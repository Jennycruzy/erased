package app.erased.android

import org.json.JSONObject
import java.util.regex.Pattern

/**
 * Reply Coach on the phone. Everything comes from assets/coach.json, generated from the same TypeScript the
 * Chrome extension ships (scripts/android-coach.ts): the phrase rules, the prompt and every answer.
 * The model only points at WHAT was asked; the answers are fixed text.
 */
class Coach(json: String) {
    private val root = JSONObject(json)
    val asks: List<String> = root.getJSONArray("asks").let { a -> List(a.length()) { a.getString(it) } }
    val noStep: Set<String> = root.getJSONArray("noStep").let { a -> (0 until a.length()).map { a.getString(it) }.toSet() }
    val prompt: String = root.getString("prompt")
    private val rules: List<Pair<String, Pattern>> = root.getJSONArray("rules").let { a ->
        List(a.length()) {
            val r = a.getJSONObject(it)
            r.getString("ask") to Pattern.compile(r.getString("pattern"), Pattern.CASE_INSENSITIVE or Pattern.UNICODE_CASE)
        }
    }

    data class Found(val ask: String, val quote: String)
    data class Action(val type: String, val label: String, val subject: String?, val body: String?)
    data class Advice(val ask: String, val headline: String, val why: String, val legal: List<String>, val action: Action)

    /** Same splitting as sentencesWithin() in src/core/coach.ts. */
    fun sentencesWithin(text: String): List<String> =
        text.replace(Regex("\\s*\\n+\\s*"), "\n").split(Regex("(?<=[.!?])\\s+|\\n")).map { it.trim() }.filter { it.length > 3 }

    /** Known phrases, first match wins, with the sentence that shows it. Otherwise "wait". */
    fun byRules(text: String): Found {
        val sents = sentencesWithin(text)
        for ((ask, re) in rules) sents.firstOrNull { re.matcher(it).find() }?.let { return Found(ask, it) }
        val real = sents.filter { Regex("[a-z]{3}", RegexOption.IGNORE_CASE).containsMatchIn(it) && !Regex("^[#\\-—_=*\\s]|reply above this line|^(hi|hello|hey)\\b[^.]{0,30}[!,.]?$", RegexOption.IGNORE_CASE).containsMatchIn(it) }
        return Found("wait", real.firstOrNull { Regex("receiv|got your|thank|review|in touch|case|ticket", RegexOption.IGNORE_CASE).containsMatchIn(it) } ?: real.firstOrNull() ?: "")
    }

    /** Rules decide when they know the phrase; the model only when they find nothing, and only with a real quote. */
    fun decide(rules: Found, model: Found?): Pair<Found, String> =
        if (rules.ask == "wait" && model != null && model.ask != "wait" && model.quote.isNotBlank()) model to "model" else rules to "rules"

    fun advice(law: String, ask: String, fill: Map<String, String>): Advice {
        val a = root.getJSONObject("advice").getJSONObject(law).getJSONObject(ask)
        // A request made outside Erased has no reference: drop the empty "[]" and "Reference:" line.
        val f = { s: String -> fill.entries.fold(s) { acc, (k, v) -> acc.replace("{$k}", v) }.replace(Regex("\\s*\\[\\]"), "").replace(Regex("\nReference: \n"), "\n") }
        val act = a.getJSONObject("action")
        val legal = a.getJSONArray("legal").let { l -> List(l.length()) { f(l.getString(it)) } }
        // Without the request's date the phone cannot name the legal deadline; it says what to do instead.
        val waitLabel = if (ask == "wait") "Nothing to do yet. Wait for their answer." else f(act.getString("label"))
        return Advice(
            ask, f(a.getString("headline")), if (ask == "wait") "They have your request. Nothing is asked of you yet." else f(a.getString("why")), legal,
            Action(act.getString("type"), waitLabel, act.optString("subject").takeIf { it.isNotEmpty() }?.let(f), act.optString("body").takeIf { it.isNotEmpty() }?.let(f)),
        )
    }
}
