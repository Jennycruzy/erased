package app.erased.android

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.test.platform.app.InstrumentationRegistry
import com.google.firebase.ai.ondevice.FirebaseAIOnDevice
import com.google.firebase.ai.ondevice.OnDeviceModelStatus
import com.google.firebase.appcheck.debug.testing.DebugAppCheckTestHelper
import kotlinx.coroutines.runBlocking
import org.junit.Rule
import org.junit.Test

/**
 * Walks through the app the way a person would, at a person's pace, for the Test Lab screen recording:
 * pick a real reply, let the phone read it, and show the answer.
 */
class DemoVideoTest {
    @get:Rule val compose = createAndroidComposeRule<MainActivity>()

    /** With a debug secret (Test Lab), App Check uses the debug provider; without one (a device cloud), the app's own
     *  App Check runs: the token from the website's reCAPTCHA Enterprise check, as on a person's phone. */
    private fun appCheck(block: () -> Unit) {
        if (InstrumentationRegistry.getArguments().getString("firebaseAppCheckDebugSecret") != null)
            DebugAppCheckTestHelper.fromInstrumentationArgs().withDebugProvider<Throwable> { block() }
        else block()
    }

    private fun pause(ms: Long) { compose.waitForIdle(); Thread.sleep(ms) }
    private fun hideKeyboard() = InstrumentationRegistry.getInstrumentation().uiAutomation.executeShellCommand("input keyevent 111").close()
    private val answer get() = hasText("Read ", substring = true) and !hasText("Read it")

    /** A slow finger swipe, so the recording shows the page moving rather than jumping. */
    private fun swipe(up: Boolean) = compose.onRoot().performTouchInput {
        val (a, b) = if (up) bottomCenter.y * 0.8f to bottomCenter.y * 0.3f else bottomCenter.y * 0.3f to bottomCenter.y * 0.8f
        swipe(androidx.compose.ui.geometry.Offset(centerX, a), androidx.compose.ui.geometry.Offset(centerX, b), durationMillis = 900)
    }

    private fun readSample(company: String) {
        compose.onAllNodesWithText(company).onFirst().performClick()
        pause(1800)
        compose.onNodeWithText("Read it").performScrollTo()
        pause(1200)
        compose.onNodeWithText("Read it").performClick()
        compose.waitUntil(120_000) { compose.onAllNodes(answer).fetchSemanticsNodes().isNotEmpty() }
        hideKeyboard()
        pause(1500)
        compose.onAllNodes(answer).onFirst().performScrollTo()
        pause(4000)
        swipe(up = true); pause(4500)
        swipe(up = true); pause(3000)
    }

    @Test
    fun walkthrough() = appCheck {
        pause(3000)
        // No Gemini Nano on this phone: switch on the cloud fallback, as a person would.
        if (runBlocking { FirebaseAIOnDevice.checkStatus() } != OnDeviceModelStatus.AVAILABLE) {
            compose.onNode(isToggleable()).performScrollTo()
            pause(1200)
            compose.onNode(isToggleable()).performClick()
            pause(1500)
            repeat(3) { swipe(up = false) }
            pause(1200)
        }
        readSample("Substack")
        repeat(4) { swipe(up = false) }
        pause(1500)
        readSample("Medium")
    }
}
