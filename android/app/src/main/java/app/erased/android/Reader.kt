package app.erased.android

import com.google.firebase.Firebase
import com.google.firebase.ai.InferenceMode
import com.google.firebase.ai.OnDeviceConfig
import com.google.firebase.ai.ai
import com.google.firebase.ai.annotations.Generable
import com.google.firebase.ai.annotations.Guide
import com.google.firebase.ai.ondevice.*
import com.google.firebase.ai.type.*
import com.google.firebase.remoteconfig.remoteConfig
import kotlinx.coroutines.tasks.await
import org.json.JSONArray
import kotlinx.coroutines.flow.collect
import kotlinx.serialization.Serializable

/** What the model may answer: one ask from the fixed list, and the NUMBER of the sentence that shows it. */
@Serializable
@Generable(description = "What a company's reply to a data deletion request asks the person to do")
data class AskAnswer(
    @Guide(description = "One of: wait, scheduled, no_account, verify_link, go_ahead, confirm_sender, clarify, provide_info, use_form, log_in_delete")
    val ask: String,
    @Guide(description = "Number of the one sentence that shows the answer", minimum = 1.0)
    val proof: Int,
) { companion object }

enum class Where { DEVICE_ONLY, CLOUD_ALLOWED }

data class Read(val found: Coach.Found?, val source: String, val ms: Long, val error: String? = null)

/**
 * Reads a pasted or shared reply with Firebase AI Logic. Your mail stays on the phone (ONLY_ON_DEVICE) unless you
 * choose to let Gemini in the cloud read this one email on a phone without Gemini Nano.
 */
@OptIn(PublicPreviewAPI::class)
class Reader(private val coach: Coach) {
    private fun model(where: Where, name: String) = Firebase.ai(backend = GenerativeBackend.googleAI()).generativeModel(
        modelName = name,
        onDeviceConfig = OnDeviceConfig(mode = if (where == Where.DEVICE_ONLY) InferenceMode.ONLY_ON_DEVICE else InferenceMode.PREFER_ON_DEVICE),
    )

    /** Same splitting and numbering as src/core/sentences.ts. */
    fun sentencesOf(text: String, max: Int = 80): List<String> {
        val out = mutableListOf<String>()
        for (line in text.replace("\r", "").split(Regex("\n+")).map { it.replace(Regex("\\s+"), " ").trim() }.filter { it.isNotEmpty() }) {
            for (m in Regex(".+?(?:[.!?]+[\"')\\]]*(?=\\s|$)|$)").findAll(line)) {
                val t = m.value.trim()
                if (t.length >= 2) out += t
                if (out.size >= max) return out
            }
        }
        return out
    }

    suspend fun read(from: String, subject: String, body: String, where: Where): Read {
        val sents = sentencesOf(body.take(MAX_CHARS))
        val prompt = "${coach.prompt}\n\nFrom: $from\nSubject: $subject\n\n" + sents.mapIndexed { i, s -> "[${i + 1}] $s" }.joinToString("\n")
        val t0 = System.currentTimeMillis()
        return try {
            // Free-tier limits count per model: when one is spent, the next in Remote Config's order answers.
            val list = cloudModels
            var r: GenerateObjectResponse<AskAnswer>? = null
            for ((i, name) in list.withIndex()) {
                try { r = model(where, name).generateObject(AskAnswer.firebaseAISchema(), prompt); break }
                catch (e: Exception) { if (!busy(e) || i == list.lastIndex) throw e }
            }
            r!!
            val a: AskAnswer? = r.getObject()
            val quote = a?.proof?.let { sents.getOrNull(it - 1) } ?: ""
            val ask = a?.ask?.takeIf { it in coach.asks }
            Read(ask?.let { Coach.Found(it, if (body.contains(quote)) quote else "") }, r.response.inferenceSource.toString(), System.currentTimeMillis() - t0)
        } catch (e: Exception) {
            Read(null, "error", System.currentTimeMillis() - t0, e.message?.take(300))
        }
    }

    companion object {
        /** Cloud models in order; Remote Config (cloud_models) can change them. */
        val DEFAULT_CLOUD_MODELS = listOf("gemini-3.5-flash-lite", "gemini-3.5-flash")
        @Volatile var cloudModels: List<String> = DEFAULT_CLOUD_MODELS
            private set

        /** Reads cloud_models: a JSON list of one to four Gemini model names. Anything else gives null. */
        fun parseModels(raw: String): List<String>? = runCatching {
            val a = JSONArray(raw)
            val l = (0 until a.length()).map { a.get(it) }
            if (l.size !in 1..4 || !l.all { it is String && Regex("^gemini-[a-z0-9.-]{1,40}$").matches(it) }) null else l.map { it as String }
        }.getOrNull()

        fun busy(e: Throwable) = Regex("\\b429\\b|quota|RESOURCE_EXHAUSTED|\\b503\\b|overloaded", RegexOption.IGNORE_CASE).containsMatchIn(e.message ?: e.toString())

        /** Fetches the Remote Config template once; without a network, the defaults stay. */
        suspend fun loadRemote() {
            runCatching {
                val rc = Firebase.remoteConfig
                rc.setDefaultsAsync(mapOf("cloud_models" to JSONArray(DEFAULT_CLOUD_MODELS).toString())).await()
                rc.fetchAndActivate().await()
                parseModels(rc.getString("cloud_models"))?.let { cloudModels = it }
            }
        }
        /** Android's on-device limit is 4,000 tokens per request. */
        const val MAX_CHARS = 9000

        suspend fun status(): String = runCatching { FirebaseAIOnDevice.checkStatus().toString() }.getOrElse { "UNAVAILABLE (${it.message})" }

        suspend fun download(progress: (String) -> Unit) {
            FirebaseAIOnDevice.download().collect { progress(it.toString()) }
        }
    }
}
