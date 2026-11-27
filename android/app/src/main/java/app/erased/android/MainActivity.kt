package app.erased.android

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch
import org.json.JSONObject

/** Laws the letters use; the phone picks the same answer text as the extension. */
private val LAWS = listOf("ndpa" to "Nigeria (NDPA 2023)", "gdpr" to "EU (GDPR)", "uk_gdpr" to "UK (UK GDPR)", "ccpa" to "California (CCPA)", "pipeda" to "Canada (PIPEDA)", "policy" to "Anywhere else")

/** The extension's and website's colours (public/panel.css), light and dark. */
private data class Ink(val bg: Color, val fg: Color, val muted: Color, val line: Color, val chip: Color, val green: Color, val greenBg: Color, val amber: Color, val amberBg: Color)
private val LIGHT = Ink(Color(0xFFFFFFFF), Color(0xFF111418), Color(0xFF5F6670), Color(0xFFE6E8EB), Color(0xFFF3F4F6), Color(0xFF1B7F3B), Color(0xFFE8F5EC), Color(0xFFB45309), Color(0xFFFFF4E5))
private val DARK = Ink(Color(0xFF0F1115), Color(0xFFEEF0F3), Color(0xFF9AA1AB), Color(0xFF23272E), Color(0xFF1A1D23), Color(0xFF4ADE80), Color(0xFF11251A), Color(0xFFF5A524), Color(0xFF2A2010))

data class Sample(val company: String, val from: String, val subject: String, val text: String)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val shared = intent?.takeIf { it.action == Intent.ACTION_SEND }
        val json = assets.open("coach.json").bufferedReader().readText()
        val coach = Coach(json)
        val samples = JSONObject(json).optJSONArray("samples")?.let { a -> List(a.length()) { a.getJSONObject(it).let { s -> Sample(s.getString("company"), s.getString("from"), s.getString("subject"), s.getString("text")) } } } ?: emptyList()
        setContent {
            val ink = if (isSystemInDarkTheme()) DARK else LIGHT
            MaterialTheme(colorScheme = (if (isSystemInDarkTheme()) darkColorScheme() else lightColorScheme()).copy(primary = ink.fg, onPrimary = ink.bg, background = ink.bg, surface = ink.bg, onSurface = ink.fg, outline = ink.line)) {
                Surface(Modifier.fillMaxSize(), color = ink.bg) {
                    Screen(this, coach, samples, ink, shared?.getStringExtra(Intent.EXTRA_TEXT) ?: "", shared?.getStringExtra(Intent.EXTRA_SUBJECT) ?: "")
                }
            }
        }
    }
}

@Composable
private fun Pill(text: String, fg: Color, bg: Color) {
    Text(text, color = fg, fontSize = 12.sp, modifier = Modifier.background(bg, RoundedCornerShape(999.dp)).padding(horizontal = 10.dp, vertical = 3.dp))
}

@Composable
private fun SectionTitle(text: String, ink: Ink) = Text(text, fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = ink.muted)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun Screen(ctx: Context, coach: Coach, samples: List<Sample>, ink: Ink, sharedText: String, sharedSubject: String) {
    val prefs = remember { ctx.getSharedPreferences("erased", Context.MODE_PRIVATE) }
    var name by remember { mutableStateOf(prefs.getString("name", "") ?: "") }
    var email by remember { mutableStateOf(prefs.getString("email", "") ?: "") }
    var law by remember { mutableStateOf(prefs.getString("law", "ndpa") ?: "ndpa") }
    var company by remember { mutableStateOf("") }
    var from by remember { mutableStateOf("") }
    var subject by remember { mutableStateOf(sharedSubject) }
    var body by remember { mutableStateOf(sharedText) }
    var cloudOk by remember { mutableStateOf(false) }
    var status by remember { mutableStateOf("checking…") }
    var busy by remember { mutableStateOf(false) }
    var result by remember { mutableStateOf<Pair<Coach.Advice, Pair<Read?, Coach.Found>>?>(null) }
    var lawOpen by remember { mutableStateOf(false) }
    var youOpen by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val reader = remember { Reader(coach) }
    val scroll = rememberScrollState()
    val field = OutlinedTextFieldDefaults.colors(focusedBorderColor = ink.fg, unfocusedBorderColor = ink.line, focusedLabelColor = ink.muted, unfocusedLabelColor = ink.muted)

    LaunchedEffect(Unit) { status = Reader.status() }
    LaunchedEffect(Unit) { Reader.loadRemote() }

    Column(Modifier.fillMaxSize().systemBarsPadding().verticalScroll(scroll)) {
        // Top bar: brand and where the reading happens.
        Row(Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 14.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Text("Erased", fontWeight = FontWeight.ExtraBold, fontSize = 18.sp, color = ink.fg)
            val ready = status.startsWith("AVAILABLE")
            Pill(if (ready) "Gemini Nano on this phone" else if (status.startsWith("DOWNLOAD")) "Gemini Nano: download" else "No Gemini Nano here", if (ready) ink.green else ink.amber, if (ready) ink.greenBg else ink.amberBg)
        }
        HorizontalDivider(color = ink.line)

        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("What does their reply want from you?", fontWeight = FontWeight.Bold, fontSize = 22.sp, color = ink.fg, lineHeight = 28.sp)
            Text("Share or paste a company's reply to your deletion request. Erased reads it on this phone and tells you the one thing to do, with the answer already written.", color = ink.muted, fontSize = 14.sp)
            if (status.startsWith("DOWNLOADABLE")) {
                OutlinedButton(onClick = { scope.launch { Reader.download { status = "DOWNLOADING $it" }; status = Reader.status() } }, border = BorderStroke(1.dp, ink.line)) { Text("Get Gemini Nano ready", color = ink.fg) }
            }
            if (samples.isNotEmpty()) {
                SectionTitle("Try a real reply", ink)
                Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    samples.forEach { s ->
                        OutlinedButton(onClick = { company = s.company; from = s.from; subject = s.subject; body = s.text; result = null }, border = BorderStroke(1.dp, ink.line), shape = RoundedCornerShape(999.dp), contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)) {
                            Text(s.company, color = ink.fg, fontSize = 13.sp)
                        }
                    }
                }
            }
        }
        HorizontalDivider(color = ink.line)

        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            SectionTitle("Their reply", ink)
            OutlinedTextField(company, { company = it }, label = { Text("Company") }, singleLine = true, colors = field, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(from, { from = it }, label = { Text("Their email address") }, singleLine = true, colors = field, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(subject, { subject = it }, label = { Text("Subject") }, singleLine = true, colors = field, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(body, { body = it }, label = { Text("The email") }, minLines = 5, maxLines = 12, colors = field, modifier = Modifier.fillMaxWidth())
            Row(verticalAlignment = Alignment.CenterVertically) {
                Switch(cloudOk, { cloudOk = it }, colors = SwitchDefaults.colors(checkedTrackColor = ink.fg))
                Spacer(Modifier.width(10.dp))
                Text("If this phone has no Gemini Nano, let Gemini in the cloud read this one email", fontSize = 12.sp, color = ink.muted)
            }
            Button(enabled = !busy && body.isNotBlank(), modifier = Modifier.fillMaxWidth().height(48.dp), shape = RoundedCornerShape(10.dp), onClick = {
                busy = true
                scope.launch {
                    val rules = coach.byRules(body)
                    val read = reader.read(from, subject, body, if (cloudOk) Where.CLOUD_ALLOWED else Where.DEVICE_ONLY)
                    val (found, _) = coach.decide(rules, read.found)
                    val ref = Regex("\\bER-[A-Z0-9]{5}\\b").find(subject)?.value ?: ""
                    val fill = mapOf("company" to company.ifBlank { "The company" }, "email" to email.ifBlank { "my email address" }, "name" to name, "subject" to subject.ifBlank { "Your reply" }, "ref" to ref, "to" to from, "domain" to from.substringAfter('@'))
                    result = coach.advice(law, found.ask, fill) to (read to found)
                    busy = false
                    scroll.animateScrollTo(scroll.maxValue)
                }
            }) { Text(if (busy) "Reading…" else "Read it", fontWeight = FontWeight.SemiBold) }
        }

        result?.let { (a, rf) ->
            val (read, found) = rf
            HorizontalDivider(color = ink.line)
            Column(Modifier.padding(16.dp).fillMaxWidth().border(1.dp, ink.line, RoundedCornerShape(12.dp)).padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                val onDevice = read?.source?.contains("device", ignoreCase = true) == true
                val inCloud = read?.source?.contains("cloud", ignoreCase = true) == true
                val where = when {
                    onDevice -> "Read on this phone by Gemini Nano"
                    inCloud -> "Read by Gemini in the cloud (you allowed it)"
                    else -> "Read with known phrases only"
                } + (read?.let { if (it.ms > 0) " · ${it.ms} ms" else "" } ?: "")
                Pill(where, if (onDevice) ink.green else ink.muted, if (onDevice) ink.greenBg else ink.chip)
                if (!onDevice && !inCloud && read?.error != null) Text("Model: ${read.error.take(160)}", fontSize = 11.sp, color = ink.muted)
                if (found.quote.isNotBlank()) Text("“${found.quote}”", fontSize = 13.sp, fontStyle = FontStyle.Italic, color = ink.muted)
                Text(a.headline, fontWeight = FontWeight.Bold, fontSize = 17.sp, color = ink.fg)
                Text(a.why, fontSize = 14.sp, color = ink.fg)
                a.legal.forEach { Text(it, fontSize = 11.sp, color = ink.muted) }
                if (a.action.type == "email" && a.action.body != null) {
                    Column(Modifier.fillMaxWidth().background(ink.chip, RoundedCornerShape(10.dp)).padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("To ${from.ifBlank { "them" }} · ${a.action.subject ?: ""}", fontSize = 11.sp, color = ink.muted)
                        Text(a.action.body, fontSize = 13.sp, color = ink.fg)
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(shape = RoundedCornerShape(10.dp), onClick = {
                            val uri = Uri.parse("mailto:" + Uri.encode(from) + "?subject=" + Uri.encode(a.action.subject ?: "") + "&body=" + Uri.encode(a.action.body))
                            ctx.startActivity(Intent(Intent.ACTION_SENDTO, uri))
                        }) { Text(a.action.label) }
                        OutlinedButton(shape = RoundedCornerShape(10.dp), border = BorderStroke(1.dp, ink.line), onClick = {
                            (ctx.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager).setPrimaryClip(ClipData.newPlainText("reply", a.action.body))
                        }) { Text("Copy", color = ink.fg) }
                    }
                } else {
                    Text(a.action.label, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = ink.fg)
                }
            }
        }

        HorizontalDivider(color = ink.line)
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            TextButton(onClick = { youOpen = !youOpen }, contentPadding = PaddingValues(0.dp)) { Text((if (youOpen) "▾ " else "▸ ") + "Your details for the written reply", color = ink.muted, fontSize = 13.sp) }
            if (youOpen) {
                OutlinedTextField(name, { name = it; prefs.edit().putString("name", it).apply() }, label = { Text("Your name") }, singleLine = true, colors = field, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(email, { email = it; prefs.edit().putString("email", it).apply() }, label = { Text("The account's email address") }, singleLine = true, colors = field, modifier = Modifier.fillMaxWidth())
                ExposedDropdownMenuBox(lawOpen, { lawOpen = it }) {
                    OutlinedTextField(LAWS.first { it.first == law }.second, {}, readOnly = true, label = { Text("Where you live") }, colors = field, modifier = Modifier.menuAnchor(ExposedDropdownMenuAnchorType.PrimaryNotEditable).fillMaxWidth())
                    ExposedDropdownMenu(lawOpen, { lawOpen = false }) {
                        LAWS.forEach { (id, label) -> DropdownMenuItem(text = { Text(label) }, onClick = { law = id; prefs.edit().putString("law", id).apply(); lawOpen = false }) }
                    }
                }
            }
            Text("Your mail is read on this phone. The cloud reads one email only if you switch it on above.", fontSize = 11.sp, color = ink.muted)
        }
    }
}
