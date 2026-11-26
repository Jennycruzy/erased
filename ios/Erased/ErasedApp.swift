import SwiftUI
import FirebaseCore
import FirebaseAppCheck

@main
struct ErasedApp: App {
    init() {
        // App Check: a reCAPTCHA Enterprise-backed token from the Erased website (see WebAppCheck.swift); this build
        // is installed without the App Store, so App Attest cannot attest it. Must be set before FirebaseApp.configure().
        AppCheck.setAppCheckProviderFactory(WebAppCheckProviderFactory())
        FirebaseApp.configure()
    }

    var body: some Scene {
        WindowGroup { ContentView() }
    }
}
