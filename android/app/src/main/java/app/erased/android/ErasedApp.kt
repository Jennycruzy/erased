package app.erased.android

import android.app.Application
import com.google.firebase.Firebase
import com.google.firebase.appcheck.appCheck
import com.google.firebase.initialize

class ErasedApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Firebase.initialize(context = this)
        // App Check: a reCAPTCHA Enterprise-backed token from the Erased website (see WebAppCheck.kt). This build is not
        // installed from the Play Store, so Play Integrity cannot attest it.
        Firebase.appCheck.installAppCheckProviderFactory(WebAppCheckProviderFactory())
    }
}
