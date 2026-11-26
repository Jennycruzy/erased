package app.erased.android

import android.util.Log
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.test.platform.app.InstrumentationRegistry
import com.google.firebase.ai.ondevice.DownloadStatus
import com.google.firebase.appcheck.debug.testing.DebugAppCheckTestHelper
import com.google.firebase.ai.ondevice.FirebaseAIOnDevice
import com.google.firebase.ai.ondevice.OnDeviceModelStatus
import kotlinx.coroutines.flow.takeWhile
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.tasks.await
import com.google.firebase.appcheck.appCheck
import kotlinx.coroutines.withTimeoutOrNull
import org.json.JSONArray
import org.json.JSONObject
import org.junit.FixMethodOrder
import org.junit.Rule
import org.junit.Test
import org.junit.runners.MethodSorters
import java.io.File

/**
 * Runs on a real phone (Firebase Test Lab): gets Gemini Nano ready, reads one reply through the app's own
 * screen, then reads every hand-labelled reply in evals/replies.json with ONLY_ON_DEVICE and writes what it
 * found, which model answered and how long it took to files/nano-eval.json.
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class NanoOnDeviceTest {
    @get:Rule val compose = createAndroidComposeRule<MainActivity>()

    private val ctx = InstrumentationRegistry.getInstrumentation().targetContext
    private val testCtx = InstrumentationRegistry.getInstrumentation().context
    private val out = File(ctx.getExternalFilesDir(null), "nano").apply { mkdirs() }
    private fun log(line: String) { Log.i(TAG, line); File(out, "log.txt").appendText(line + "\n") }
    private val args = InstrumentationRegistry.getArguments()
    /** Saves what the phone shows right now (pulled from Test Lab with the logs). */
    private fun shot(name: String) {
        val bmp = InstrumentationRegistry.getInstrumentation().uiAutomation.takeScreenshot() ?: return
        File(out, "$name.png").outputStream().use { bmp.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, it) }
        log("screenshot: $name.png")
    }

    private fun name(s: OnDeviceModelStatus) = when (s) {
        OnDeviceModelStatus.AVAILABLE -> "AVAILABLE"; OnDeviceModelStatus.DOWNLOADABLE -> "DOWNLOADABLE"
        OnDeviceModelStatus.DOWNLOADING -> "DOWNLOADING"; OnDeviceModelStatus.UNAVAILABLE -> "UNAVAILABLE"; else -> s.toString()
    }

    /** AICore is the system app that runs Gemini Nano; log whether this phone has it and which version. */
    private fun aicore(): String = try {
        val pm = ctx.packageManager
        val i = pm.getPackageInfo("com.google.android.aicore", 0)
        "installed version=${i.versionName} enabled=${pm.getApplicationEnabledSetting("com.google.android.aicore")} appEnabled=${i.applicationInfo?.enabled}"
    } catch (e: Exception) { "not installed (${e.javaClass.simpleName})" }

    @Test
    fun a_nanoIsReady() = runBlocking {
        var status = runCatching { FirebaseAIOnDevice.checkStatus() }.onFailure { log("checkStatus threw: $it") }.getOrDefault(OnDeviceModelStatus.UNAVAILABLE)
        log("device=${android.os.Build.MANUFACTURER} ${android.os.Build.MODEL} sdk=${android.os.Build.VERSION.SDK_INT} build=${android.os.Build.DISPLAY} status=${name(status)}")
        log("aicore: ${aicore()}")
        if (status == OnDeviceModelStatus.DOWNLOADABLE || status == OnDeviceModelStatus.DOWNLOADING) {
            withTimeoutOrNull(25 * 60_000L) {
                FirebaseAIOnDevice.download().takeWhile { s -> log("download: $s"); s !is DownloadStatus.DownloadCompleted && s !is DownloadStatus.DownloadFailed }.collect {}
            } ?: log("download: still going after 25 min")
            status = FirebaseAIOnDevice.checkStatus()
        }
        log("status after=${name(status)}")
        File(out, "status.txt").writeText(name(status))
    }

    @Test
    fun b_readsOneReplyOnScreen() = DebugAppCheckTestHelper.fromInstrumentationArgs().withDebugProvider<Throwable> {
        compose.waitForIdle(); Thread.sleep(1500); shot("01-start")
        if (!ready()) { log("screen: Nano not available on this phone, switching on the cloud fallback"); compose.onNode(isToggleable()).performScrollTo().performClick() }
        compose.onNodeWithText("Company").performTextInput("Substack")
        compose.onNodeWithText("Their email address").performTextInput("privacy@substackinc.com")
        compose.onNodeWithText("The email").performTextInput(
            "Hi there,\nBefore I make any permanent changes, please confirm that you would like us to delete your account and all its data. " +
                "Reply YES to this email and we will go ahead.")
        compose.onNodeWithText("Read it").performScrollTo().performClick()
        compose.waitUntil(120_000) { compose.onAllNodesWithText("Read it").fetchSemanticsNodes().isNotEmpty() && compose.onAllNodes(hasText("Read ", substring = true) and !hasText("Read it")).fetchSemanticsNodes().isNotEmpty() }
        val where = compose.onAllNodes(hasText("Read ", substring = true) and !hasText("Read it")).fetchSemanticsNodes()
            .flatMap { n -> n.config.getOrElseNullable(androidx.compose.ui.semantics.SemanticsProperties.Text) { null }?.map { it.text } ?: emptyList() }
        log("screen: ${where.joinToString(" | ")}")
        // Hide the keyboard and show the answer card for the recording and the screenshot.
        InstrumentationRegistry.getInstrumentation().uiAutomation.executeShellCommand("input keyevent 111").close()
        compose.onAllNodes(hasText("Read ", substring = true) and !hasText("Read it")).onFirst().performScrollTo()
        Thread.sleep(2500); shot("02-answer")
        Thread.sleep(5000)
    }

    @Test
    fun c_readsEveryLabelledReply() = DebugAppCheckTestHelper.fromInstrumentationArgs().withDebugProvider<Throwable> { runBlocking {
        // With Gemini Nano: on-device only. Without it: the hybrid setting the app uses when you allow the cloud.
        val where = if (ready()) Where.DEVICE_ONLY else Where.CLOUD_ALLOWED
        if (args.getString("erasedScreensOnly") == "1") { log("eval: skipped (screens only)"); return@runBlocking }
        log("eval: mode=$where")
        val coach = Coach(ctx.assets.open("coach.json").bufferedReader().readText())
        val reader = Reader(coach)
        val set = JSONArray(testCtx.assets.open("replies.json").bufferedReader().readText())
        val rows = JSONArray()
        var nano = 0; var mix = 0; var onDevice = 0; var inCloud = 0
        for (i in 0 until set.length()) {
            val e = set.getJSONObject(i)
            val text = e.getString("text"); val label = e.getString("label")
            val r = reader.read(e.optString("from"), e.optString("subject"), text, where)
            if (!r.source.contains("device", ignoreCase = true)) Thread.sleep(4500) // stay under the cloud model's free per-minute limit
            val (final, by) = coach.decide(coach.byRules(text), r.found)
            if (r.found?.ask == label) nano++
            if (final.ask == label) mix++
            if (r.source.contains("device", ignoreCase = true)) onDevice++
            if (r.source.contains("cloud", ignoreCase = true)) inCloud++
            rows.put(JSONObject().put("id", e.getInt("id")).put("label", label).put("nano", r.found?.ask ?: JSONObject.NULL)
                .put("final", final.ask).put("by", by).put("source", r.source).put("ms", r.ms).put("error", r.error ?: JSONObject.NULL))
            log("eval ${e.getInt("id")}: label=$label nano=${r.found?.ask} final=${final.ask} source=${r.source} ms=${r.ms}${r.error?.let { " error=$it" } ?: ""}")
        }
        val summary = JSONObject().put("device", "${android.os.Build.MANUFACTURER} ${android.os.Build.MODEL}").put("mode", where.toString()).put("n", set.length())
            .put("nanoAlone", nano).put("rulesThenNano", mix).put("answeredOnDevice", onDevice).put("answeredInCloud", inCloud).put("rows", rows)
        File(out, "nano-eval.json").writeText(summary.toString(1))
        log("eval: mode=$where n=${set.length()} modelAlone=$nano rulesThenModel=$mix answeredOnDevice=$onDevice answeredInCloud=$inCloud")
    } }

    /** The app's own App Check route (no debug token): a token from the website's reCAPTCHA Enterprise check. */
    @Test
    fun d_appCheckFromWebsite() = runBlocking {
        val t0 = System.currentTimeMillis()
        val r = runCatching { com.google.firebase.Firebase.appCheck.getAppCheckToken(true).await() }
        log("appcheck: " + r.fold({ "token ok, ${it.token.length} chars, valid ${(it.expireTimeMillis - System.currentTimeMillis()) / 60_000} min" }, { "failed: ${it.message}" }) + " · ${System.currentTimeMillis() - t0} ms")
    }

    private fun ready() = runBlocking { FirebaseAIOnDevice.checkStatus() == OnDeviceModelStatus.AVAILABLE }

    companion object { const val TAG = "ERASED_NANO" }
}
