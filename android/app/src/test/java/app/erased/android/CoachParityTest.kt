package app.erased.android

import org.json.JSONArray
import org.junit.Assert.assertEquals
import org.junit.Test
import java.io.File

/** The phone reads replies exactly like the extension: same rules, same 66 hand labels (evals/replies.json). */
class CoachParityTest {
    private val coach = Coach(File("src/main/assets/coach.json").readText())

    @Test
    fun rulesMatchEveryHandLabel() {
        val set = JSONArray(File("../../evals/replies.json").readText())
        val wrong = (0 until set.length()).map { set.getJSONObject(it) }.filter { coach.byRules(it.getString("text")).ask != it.getString("label") }
            .map { "${it.getInt("id")} ${it.getString("company")}: ${it.getString("label")} -> ${coach.byRules(it.getString("text")).ask}" }
        assertEquals("rules differ from the hand labels:\n" + wrong.joinToString("\n"), 0, wrong.size)
    }

    @Test
    fun answersAreFilledIn() {
        val a = coach.advice("ndpa", "confirm_sender", mapOf("company" to "Vimeo", "email" to "me@example.com", "name" to "Ada", "subject" to "Re: Request", "ref" to "ER-AAAAA", "to" to "privacy@vimeo.com", "domain" to "vimeo.com"))
        assertEquals("Vimeo wants to know the request really comes from you", a.headline)
        assert(a.action.body!!.contains("Section 34(1) of the Nigeria Data Protection Act 2023"))
        assert(!a.action.body!!.contains("{"))
    }

    @Test
    fun modelOnlyWhenRulesFindNothing() {
        val rules = Coach.Found("use_form", "Please complete our form.")
        assertEquals("rules", coach.decide(rules, Coach.Found("clarify", "x")).second)
        assertEquals("model", coach.decide(Coach.Found("wait", "Thanks."), Coach.Found("clarify", "What should we delete?")).second)
        assertEquals("rules", coach.decide(Coach.Found("wait", "Thanks."), Coach.Found("clarify", "")).second)
    }
}
