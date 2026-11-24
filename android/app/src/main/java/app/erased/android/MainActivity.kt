package app.erased.android

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

/** Laws the letters use; the phone picks the same answer text as the extension. */
private val LAWS = listOf("ndpa" to "Nigeria (NDPA 2023)", "gdpr" to "EU (GDPR)", "uk_gdpr" to "UK (UK GDPR)", "ccpa" to "California (CCPA)", "pipeda" to "Canada (PIPEDA)", "policy" to "Anywhere else")

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val shared = intent?.takeIf { it.action == Intent.ACTION_SEND }
        val coach = Coach(assets.open("coach.json").bufferedReader().readText())
        setContent {
            MaterialTheme(colorScheme = lightColorScheme(primary = Color(0xFF111111))) {
                Surface(Modifier.fillMaxSize()) {
                    Screen(this, coach, shared?.getStringExtra(Intent.EXTRA_TEXT) ?: "", shared?.getStringExtra(Intent.EXTRA_SUBJECT) ?: "")
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun Screen(ctx: Context, coach: Coach, sharedText: String, sharedSubject: String) {
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
    val scope = rememberCoroutineScope()
    val reader = remember { Reader(coach) }

    LaunchedEffect(Unit) { status = Reader.status() }

    Column(Modifier.fillMaxSize().systemBarsPadding().verticalScroll(rememberScrollState()).padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Erased", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        Text("Share a company's reply to your deletion request. Erased reads it on this phone and tells you the quickest lawful next step.", style = MaterialTheme.typography.bodyMedium)
        AssistChip(onClick = {}, label = { Text("Gemini Nano on this phone: $status") })
        if (status.startsWith("DOWNLOADABLE")) {
            OutlinedButton(onClick = { scope.launch { Reader.download { status = "downloading: $it" }; status = Reader.status() } }) { Text("Download Gemini Nano") }
        }

        Text("You", fontWeight = FontWeight.SemiBold)
        OutlinedTextField(name, { name = it; prefs.edit().putString("name", it).apply() }, label = { Text("Your name") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(email, { email = it; prefs.edit().putString("email", it).apply() }, label = { Text("The account's email address") }, modifier = Modifier.fillMaxWidth())
        ExposedDropdownMenuBox(lawOpen, { lawOpen = it }) {
            OutlinedTextField(LAWS.first { it.first == law }.second, {}, readOnly = true, label = { Text("Where you live") }, modifier = Modifier.menuAnchor(ExposedDropdownMenuAnchorType.PrimaryNotEditable).fillMaxWidth())
            ExposedDropdownMenu(lawOpen, { lawOpen = false }) {
                LAWS.forEach { (id, label) -> DropdownMenuItem(text = { Text(label) }, onClick = { law = id; prefs.edit().putString("law", id).apply(); lawOpen = false }) }
            }
        }

        Text("Their reply", fontWeight = FontWeight.SemiBold)
        OutlinedTextField(company, { company = it }, label = { Text("Company") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(from, { from = it }, label = { Text("Their email address") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(subject, { subject = it }, label = { Text("Subject") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(body, { body = it }, label = { Text("The email") }, minLines = 6, modifier = Modifier.fillMaxWidth())
        Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
            Switch(cloudOk, { cloudOk = it })
            Spacer(Modifier.width(8.dp))
            Text("If this phone has no Gemini Nano, let Gemini in the cloud read this one email", style = MaterialTheme.typography.bodySmall)
        }
        Button(enabled = !busy && body.isNotBlank(), onClick = {
            busy = true
            scope.launch {
                val rules = coach.byRules(body)
                val read = reader.read(from, subject, body, if (cloudOk) Where.CLOUD_ALLOWED else Where.DEVICE_ONLY)
                val (found, _) = coach.decide(rules, read.found)
                val fill = mapOf("company" to company.ifBlank { "The company" }, "email" to email.ifBlank { "my email address" }, "name" to name, "subject" to subject.ifBlank { "Your reply" }, "ref" to "", "to" to from, "domain" to from.substringAfter('@'))
                result = coach.advice(law, found.ask, fill) to (read to found)
                busy = false
            }
        }) { Text(if (busy) "Reading…" else "Read it") }

        result?.let { (a, rf) ->
            val (read, found) = rf
            ElevatedCard(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    val where = when {
                        read?.source?.contains("DEVICE") == true -> "Read on this phone by Gemini Nano"
                        read?.source?.contains("CLOUD") == true -> "Read by Gemini in the cloud (you allowed it)"
                        else -> "Read with known phrases only" + (read?.error?.let { " · model: $it" } ?: "")
                    }
                    Text(where + (read?.let { if (it.ms > 0) " · ${it.ms} ms" else "" } ?: ""), style = MaterialTheme.typography.labelMedium)
                    if (found.quote.isNotBlank()) Text("“${found.quote}”", style = MaterialTheme.typography.bodyMedium)
                    Text(a.headline, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    Text(a.why, style = MaterialTheme.typography.bodyMedium)
                    a.legal.forEach { Text(it, style = MaterialTheme.typography.bodySmall) }
                    if (a.action.type == "email" && a.action.body != null) {
                        Button(onClick = {
                            val uri = Uri.parse("mailto:" + Uri.encode(from) + "?subject=" + Uri.encode(a.action.subject ?: "") + "&body=" + Uri.encode(a.action.body))
                            ctx.startActivity(Intent(Intent.ACTION_SENDTO, uri))
                        }) { Text(a.action.label) }
                    } else {
                        Text(a.action.label, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
        }
    }
}
