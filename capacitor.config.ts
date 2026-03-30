import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  /**
   * Unique reverse-domain app identifier.
   * Must match the Bundle ID you register in App Store Connect and Google Play Console.
   * Change this before your first store submission — it cannot be changed afterwards.
   */
  appId: "com.vitlcoach.app",

  /** Display name shown on the device home screen */
  appName: "VITL",

  /**
   * Path to the built web assets that Capacitor will bundle into the native shell.
   * This matches the vite build output directory (dist/public).
   */
  webDir: "dist/public",

  server: {
    /**
     * In development you can point Capacitor at the local Vite dev server so
     * live-reload works on a physical device or simulator.
     * Comment this out for production builds.
     */
    // url: "http://YOUR_LOCAL_IP:3000",
    // cleartext: true,
  },

  ios: {
    /**
     * iOS-specific settings.
     * contentInset: "automatic" lets the web content respect the safe area
     * (notch, home indicator) automatically.
     */
    contentInset: "automatic",
    backgroundColor: "#090910",
    preferredContentMode: "mobile",
  },

  android: {
    /**
     * Android-specific settings.
     * backgroundColor must be a full 8-digit hex (AARRGGBB) for Android.
     */
    backgroundColor: "#FF090910",
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#090910",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
    StatusBar: {
      style: "Dark",
      backgroundColor: "#090910",
    },
  },
};

export default config;
