# VITL — Mobile Build & Store Submission Guide

This document covers everything needed to build the VITL app as a native iOS and Android binary and submit it to the Apple App Store and Google Play Store using Capacitor.

---

## How Capacitor Works

Capacitor wraps the existing React web app into a native shell. When you run `pnpm build`, Vite compiles the frontend into `dist/public`. Running `npx cap sync` copies those compiled assets into the native iOS and Android project directories. From there, Xcode (iOS) or Android Studio (Android) compiles the native binary for store submission. **No code rewrite is required** — the same React components, tRPC routes, and Stripe integration run inside the native shell.

---

## Prerequisites

| Tool | Required For | Where to Get |
|---|---|---|
| macOS (Ventura or later) | iOS builds only | Apple hardware required |
| Xcode 15+ | iOS builds | Mac App Store |
| Android Studio Hedgehog+ | Android builds | [developer.android.com](https://developer.android.com/studio) |
| Node.js 20+ | Both | Already installed |
| Apple Developer Account ($99/yr) | App Store | [developer.apple.com](https://developer.apple.com) |
| Google Play Developer Account ($25 one-time) | Play Store | [play.google.com/console](https://play.google.com/console) |
| CocoaPods | iOS dependency sync | `sudo gem install cocoapods` |

---

## Step 1 — Build the Web Assets

Every time you make code changes, rebuild the web assets before syncing to native:

```bash
cd /home/ubuntu/vitl-app
pnpm build
npx cap sync
```

`pnpm build` compiles the React app into `dist/public`. `npx cap sync` copies those assets into both `ios/App/App/public` and `android/app/src/main/assets/public`, and updates any Capacitor plugin configurations.

---

## Step 2 — iOS Build (App Store)

### 2a. Open the Xcode Project

```bash
npx cap open ios
```

This opens `ios/App/App.xcworkspace` in Xcode. Always open the `.xcworkspace` file, not the `.xcodeproj` file, as CocoaPods dependencies are only resolved through the workspace.

### 2b. Configure Signing

In Xcode, select the **App** target in the project navigator, then go to **Signing & Capabilities**. Set your **Team** to your Apple Developer account. Xcode will automatically manage provisioning profiles if you check **Automatically manage signing**.

### 2c. Set the Bundle Identifier

The Bundle ID is pre-configured as `com.vitlcoach.app` in `capacitor.config.ts`. You must register this exact ID in [App Store Connect](https://appstoreconnect.apple.com) → Identifiers before building. If you want a different ID, change it in both `capacitor.config.ts` and the Xcode target settings before your first submission — it cannot be changed after the app is live.

### 2d. Set the App Version

In Xcode, go to the **App** target → **General** tab. Set the **Version** (e.g. `1.0.0`) and **Build** number (e.g. `1`). Increment the Build number with every submission to App Store Connect, even if the Version stays the same.

### 2e. Add the App Icon

The 1024×1024 icon is at `client/public/icons/icon-1024.png`. In Xcode, open `ios/App/App/Assets.xcassets`, click **AppIcon**, and drag the icon into the **App Store** slot. Xcode will generate all required sizes automatically if you use a single 1024×1024 source.

### 2f. Archive and Upload

1. Select **Any iOS Device (arm64)** as the build target (not a simulator)
2. Go to **Product → Archive**
3. When the Organizer window opens, click **Distribute App**
4. Choose **App Store Connect** → **Upload**
5. Follow the prompts — Xcode handles code signing and upload automatically

### 2g. Submit for Review

Go to [App Store Connect](https://appstoreconnect.apple.com) → your app → **TestFlight** to test the build internally, then go to **App Store** → **+ Version** to create a new submission. Fill in the description, screenshots, and pricing, then click **Submit for Review**. Apple's review typically takes 1–3 business days.

---

## Step 3 — Android Build (Google Play)

### 3a. Open the Android Studio Project

```bash
npx cap open android
```

This opens the `android/` directory as a Gradle project in Android Studio.

### 3b. Set the Application ID

The Application ID is pre-configured as `com.vitlcoach.app` in `android/app/build.gradle`. Verify it matches `capacitor.config.ts`. Like iOS, this cannot be changed after the app is published.

### 3c. Set the App Version

In `android/app/build.gradle`, update:

```gradle
versionCode 1        // Increment with every Play Store upload
versionName "1.0.0"  // Semantic version shown to users
```

### 3d. Add the App Icon

Android Studio provides an **Image Asset Studio** to generate all required icon sizes from the 1024×1024 source. Go to **File → New → Image Asset**, select **Launcher Icons**, and import `client/public/icons/icon-1024.png`. This generates adaptive icons for all screen densities.

### 3e. Generate a Signed APK / AAB

Google Play requires an **Android App Bundle (.aab)** for new submissions.

1. In Android Studio, go to **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle**
3. Create a new keystore (or use an existing one) — **keep this keystore file safe, you cannot re-upload to the same Play listing without it**
4. Choose **release** build variant and click **Finish**
5. The `.aab` file is generated at `android/app/release/app-release.aab`

### 3f. Submit to Google Play

1. Go to [Google Play Console](https://play.google.com/console) → **Create app**
2. Fill in the app name, category (Health & Fitness), and content rating
3. Go to **Production → Releases → Create new release**
4. Upload the `.aab` file
5. Add release notes and click **Review release → Start rollout**

Google Play review typically takes a few hours to 3 business days for new apps.

---

## Step 4 — Updating the App

After making code changes, the update workflow is:

```bash
# 1. Make your changes in the React codebase
# 2. Rebuild web assets and sync to native
pnpm build
npx cap sync

# 3. Open native IDE, increment version/build number, archive and upload
npx cap open ios     # or android
```

For iOS, increment the **Build** number in Xcode. For Android, increment `versionCode` in `build.gradle`. Both stores reject uploads with the same version/build number as a previous submission.

---

## App Store Metadata Checklist

Before submitting to either store, prepare the following assets:

| Asset | iOS Requirement | Android Requirement |
|---|---|---|
| App icon | 1024×1024 PNG, no alpha | 512×512 PNG |
| Screenshots | 6.7" iPhone (1290×2796), 12.9" iPad (2048×2732) | Phone (1080×1920 min), 7" tablet |
| Short description | 30 characters | 80 characters |
| Full description | 4000 characters | 4000 characters |
| Privacy policy URL | Required | Required |
| Support URL | Required | Required |
| Age rating | 4+ (no objectionable content) | Everyone |

The three product images generated for Stripe (`vitl-basic-stripe.jpg`, `vitl-pro-stripe.jpg`, `vitl-elite-stripe.jpg`) can also be used as promotional graphics in the store listings.

---

## Troubleshooting

**"No signing certificate" error in Xcode** — Go to Xcode → Preferences → Accounts, add your Apple ID, and download the certificates manually via **Manage Certificates**.

**Gradle build fails on first open** — Android Studio needs to sync Gradle dependencies on first open. Click **Sync Now** when prompted and wait for the download to complete.

**App shows blank white screen on device** — The `webDir` in `capacitor.config.ts` must match the Vite build output path (`dist/public`). Run `pnpm build && npx cap sync` again to ensure assets are copied.

**Stripe payments fail in the native app** — The Stripe Checkout redirect opens in the system browser. Ensure the `success_url` and `cancel_url` in `server/routers.ts` point to your deployed Manus domain (`https://vitlcoach-mk3wzzhw.manus.space`) rather than `localhost`, as the native app cannot receive localhost redirects.

---

## Key Files Reference

| File | Purpose |
|---|---|
| `capacitor.config.ts` | App ID, name, webDir, plugin config |
| `client/public/manifest.json` | PWA manifest for web install |
| `client/public/icons/` | All icon sizes (72px – 1024px) |
| `ios/App/` | Xcode project (open with `npx cap open ios`) |
| `android/` | Android Studio project (open with `npx cap open android`) |
| `dist/public/` | Compiled web assets synced into native projects |
