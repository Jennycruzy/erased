package app.erased.android

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/** Remote Config's cloud_models is checked the same way as in the extension (src/ai/remote.ts). */
class CloudModelsTest {
    @Test
    fun acceptsAShortListOfGeminiNames() {
        assertEquals(listOf("gemini-3.5-flash-lite", "gemini-3.5-flash"), Reader.parseModels("[\"gemini-3.5-flash-lite\",\"gemini-3.5-flash\"]"))
    }

    @Test
    fun rejectsAnythingElse() {
        for (raw in listOf("", "gemini-3.5-flash", "[]", "[\"gpt-5\"]", "[\"gemini-3.5-flash\", 3]", "[\"gemini-a\",\"gemini-b\",\"gemini-c\",\"gemini-d\",\"gemini-e\"]", "{")) {
            assertNull(raw, Reader.parseModels(raw))
        }
    }

    @Test
    fun movesOnOnlyWhenBusy() {
        assertTrue(Reader.busy(Exception("[429 Too Many Requests] RESOURCE_EXHAUSTED")))
        assertTrue(Reader.busy(Exception("503 model overloaded")))
        assertFalse(Reader.busy(Exception("400 invalid argument")))
    }

    @Test
    fun startsFromTheShippedOrder() = assertEquals(listOf("gemini-3.5-flash-lite", "gemini-3.5-flash"), Reader.cloudModels)
}
