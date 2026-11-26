package app.erased.android

import android.annotation.SuppressLint
import android.content.Context
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import com.google.android.gms.tasks.Task
import com.google.android.gms.tasks.TaskCompletionSource
import com.google.firebase.FirebaseApp
import com.google.firebase.appcheck.AppCheckProvider
import com.google.firebase.appcheck.AppCheckProviderFactory
import com.google.firebase.appcheck.AppCheckToken
import org.json.JSONObject

/** The page that hands a fresh App Check token to the apps (same as APPCHECK_BRIDGE_URL in src/ai/firebase-config.ts). */
const val APPCHECK_BRIDGE_URL = "https://forget-me-hybrid.web.app/appcheck.html"

private class WebToken(private val token: String, private val expires: Long) : AppCheckToken() {
    override fun getToken() = token
    override fun getExpireTimeMillis() = expires
}

/**
 * App Check for a build that is not installed from the Play Store (so Play Integrity cannot vouch for it): a hidden
 * web view opens the Erased website's /appcheck.html, which passes reCAPTCHA Enterprise and returns an App Check
 * token for this Firebase project. Only that page is ever loaded in the web view, and only the token comes back.
 */
class WebAppCheckProvider(private val context: Context) : AppCheckProvider {
    private val main = Handler(Looper.getMainLooper())

    @SuppressLint("SetJavaScriptEnabled", "JavascriptInterface")
    override fun getToken(): Task<AppCheckToken> {
        val done = TaskCompletionSource<AppCheckToken>()
        main.post {
            val web = WebView(context)
            val finish = { web.stopLoading(); web.destroy() }
            web.settings.javaScriptEnabled = true
            web.webViewClient = object : WebViewClient() {
                // Stay on the bridge page; nothing else may load in this web view.
                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest) = request.url.host != Uri.parse(APPCHECK_BRIDGE_URL).host
            }
            web.addJavascriptInterface(object {
                @JavascriptInterface
                fun token(json: String) {
                    val m = JSONObject(json)
                    val t = m.optString("token")
                    if (t.isNotEmpty()) done.trySetResult(WebToken(t, m.optLong("expireTimeMillis", System.currentTimeMillis() + 30 * 60_000L)))
                    else done.trySetException(IllegalStateException("App Check: " + m.optString("error", "no token")))
                    main.post { finish() }
                }
            }, "ErasedAndroid")
            web.loadUrl(APPCHECK_BRIDGE_URL)
            main.postDelayed({ if (done.trySetException(IllegalStateException("App Check: no token from the website in 25 s"))) finish() }, 25_000)
        }
        return done.task
    }
}

class WebAppCheckProviderFactory : AppCheckProviderFactory {
    override fun create(firebaseApp: FirebaseApp): AppCheckProvider = WebAppCheckProvider(firebaseApp.applicationContext)
}
