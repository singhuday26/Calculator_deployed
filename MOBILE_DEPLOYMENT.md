# 📱 Mobile Deployment Guide — Play Store Publishing

Complete walkthrough for deploying this calculator to the Google Play Store using Capacitor.

---

## Table of Contents

1. [Prerequisites & Setup](#prerequisites--setup)
2. [Development Workflow](#development-workflow)
3. [App Icons & Splash Screen](#app-icons--splash-screen)
4. [Building the Release APK/AAB](#building-the-release-apkaab)
5. [Play Store Submission](#play-store-submission)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites & Setup

### ✅ Already Completed

- [x] Capacitor CLI installed (`@capacitor/cli`, `@capacitor/core`)
- [x] Android platform added (`android/` folder exists)
- [x] App ID configured: `com.singhuday26.calculator`
- [x] Convenient npm scripts added (`npm run cap:android`, etc.)

### ⚠️ You Need to Install

#### 1. **Android Studio**

Download from: https://developer.android.com/studio

**Why?** Capacitor generates an Android Gradle project, but you need Android Studio to:
- Compile the Java/Kotlin code
- Sign the APK/AAB
- Manage Android SDK versions
- Debug on emulators or physical devices

**Installation Steps:**
1. Download Android Studio (3-4 GB)
2. Run installer → Select "Standard" installation
3. Wait for SDK components to download (10-15 minutes)
4. Open Android Studio → More Actions → SDK Manager
5. Ensure these are installed:
   - Android SDK Platform 34 (or latest)
   - Android SDK Build-Tools
   - Android Emulator (optional, for testing without a device)

#### 2. **JDK 17 or Higher**

Android Gradle Plugin requires JDK 17+.

**Check if you have it:**
```bash
java -version
```

**If you see version < 17 or "command not found":**
- **Option A**: Android Studio bundles a JDK (usually in `C:\Program Files\Android\Android Studio\jbr\`)
- **Option B**: Download from [Adoptium.net](https://adoptium.net/) → Install Temurin JDK 17

**Set JAVA_HOME (Windows):**
```powershell
# Find your JDK path (usually Android Studio's bundled JDK)
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
```

---

## Development Workflow

### Initial Build & Test

```bash
# 1. Build web assets and sync to Android
npm run cap:sync

# 2. Open in Android Studio
npm run cap:android
```

**First time opening?** Android Studio will:
- Download Gradle wrapper (~100 MB)
- Sync Gradle project (~2-3 minutes)
- Index files

**Running on Device/Emulator:**
1. Connect Android device via USB (or start an emulator in Android Studio)
2. Enable USB Debugging on device (Settings → About Phone → Tap "Build Number" 7 times → Developer Options → USB Debugging)
3. In Android Studio, click the green ▶️ **Run** button
4. Select your device from the list

### Live Reload During Development (Optional)

Instead of rebuilding every time, you can connect the Android app to your dev server:

**Steps:**
1. Find your computer's local IP:
   ```bash
   ipconfig   # Windows
   ifconfig   # Mac/Linux
   # Look for 192.168.x.x or 10.0.x.x
   ```

2. Edit `capacitor.config.ts`:
   ```typescript
   server: {
     url: 'http://192.168.1.100:5173',  // Your IP + Vite port
     cleartext: true,
   },
   ```

3. Sync and run:
   ```bash
   npm run dev              # Start Vite dev server
   npm run cap:run:android  # (In another terminal) Deploy to device
   ```

Now code changes will hot-reload on the device! 🔥

**⚠️ Remember:** Remove the `server` config before building for production.

---

## App Icons & Splash Screen

### Current Status

The app uses **default Capacitor icons** (generic robot).

### Customizing Icons

#### Option 1: Manual (All Sizes)

Create PNG icons in these sizes and place in `android/app/src/main/res/mipmap-*/`:
- `mipmap-mdpi/`: 48x48
- `mipmap-hdpi/`: 72x72
- `mipmap-xhdpi/`: 96x96
- `mipmap-xxhdpi/`: 144x144
- `mipmap-xxxhdpi/`: 192x192

#### Option 2: Automated (Recommended)

Use [Capacitor Assets](https://github.com/ionic-team/capacitor-assets):

1. Create `resources/icon.png` (1024x1024, square, no transparency)
2. Create `resources/splash.png` (2732x2732, content in center 1200x1200)
3. Run:
   ```bash
   npm install -D @capacitor/assets
   npx capacitor-assets generate
   ```

This auto-generates all required sizes for Android (and iOS if added).

### App Name & Colors

**App Name** (shown under icon):
- Edit `android/app/src/main/res/values/strings.xml`:
  ```xml
  <string name="app_name">Calculator</string>
  ```

**Splash Screen Color**:
- Edit `android/app/src/main/res/values/styles.xml`

---

## Building the Release APK/AAB

Google Play Store requires **Android App Bundle (.aab)** format (not APK) for new apps.

### Step 1: Generate a Signing Key (First Time Only)

Android apps must be digitally signed. You need a **keystore** file.

**In Android Studio:**
1. **Build** → **Generate Signed Bundle/APK**
2. Select **Android App Bundle**
3. Click **Create new...** (under "Key store path")
4. Fill in:
   - **Key store path**: `C:\0001_Project\Calculator\android\my-release-key.jks`
   - **Password**: Choose strong password (NEVER commit this!)
   - **Alias**: `calculator-key`
   - **Validity**: 25 years (Play Store requires 25+ years)
   - **First and Last Name**: Your name
   - **Organization**: Your company/name
5. Click **OK** → **Next**

**⚠️ CRITICAL:** Back up `my-release-key.jks` and passwords securely!
If you lose this key, you CANNOT update your app on Play Store.

### Step 2: Build the AAB

**In Android Studio:**
1. **Build** → **Generate Signed Bundle/APK**
2. Select **Android App Bundle** → **Next**
3. Select your keystore (created in Step 1)
4. Enter passwords
5. Select build variant: **release**
6. Check: ✅ **V1** and ✅ **V2** (Signature Versions)
7. Click **Finish**

**Output location:**
```
android/app/release/app-release.aab
```

This `.aab` file is what you upload to Play Console!

### Build Variants Explained

| Variant   | Purpose                          | Optimizations  | Debuggable |
|-----------|----------------------------------|----------------|------------|
| `debug`   | Development, testing             | None           | Yes        |
| `release` | Production, Play Store           | Code shrinking | No         |

---

## Play Store Submission

### Step 1: Create a Play Console Account

1. Go to [https://play.google.com/console](https://play.google.com/console)
2. Pay one-time $25 registration fee
3. Accept developer agreement

### Step 2: Create a New App

1. **Create app** button
2. Fill in:
   - **App name**: Calculator
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
   - **Category**: Tools
3. Agree to policies → **Create app**

### Step 3: Complete Store Listing

Fill out all required sections in the dashboard:

**App Details:**
- Short description (80 chars): "Fast, elegant calculator with dark mode"
- Full description (4000 chars): Explain features, keyboard support, themes, etc.

**Graphics:**
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)
- Screenshots:
  - **Phone**: 2-8 screenshots (16:9 or 9:16 aspect ratio)
  - **7-inch tablet** (optional)
  - **10-inch tablet** (optional)

**Categorization:**
- App category: Tools → Productivity
- Tags: calculator, math, utility

**Contact Details:**
- Email, privacy policy (if app collects data)

### Step 4: Set Up Release

**Production → Create new release:**

1. Upload `app-release.aab`
2. **Release name**: e.g., "1.0.0 - Initial Release"
3. **Release notes** (what's new):
   ```
   Initial release!
   - Basic arithmetic operations
   - Dark/light themes
   - Keyboard support
   - Offline capability
   ```

### Step 5: Content Rating

Complete the questionnaire (for a calculator, likely "Everyone" rating).

### Step 6: Pricing & Distribution

- **Countries**: Select all or specific countries
- **Pricing**: Free
- **Content guidelines**: Check compliance boxes

### Step 7: Submit for Review

1. Review all sections (must be ✅ green)
2. Click **Submit for review**

**Timeline:**
- First review: 1-7 days
- Updates: Usually < 24 hours

---

## Troubleshooting

### Issue: `JAVA_HOME not set`

**Error:**
```
ERROR: JAVA_HOME is not set and no 'java' command could be found
```

**Fix:**
```powershell
# Find JDK (Android Studio bundles one):
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"

# Verify:
java -version
```

Make it permanent:
1. Windows Search → "Environment Variables"
2. System Properties → Environment Variables
3. New → Variable: `JAVA_HOME`, Value: `C:\Program Files\Android\Android Studio\jbr`

---

### Issue: Gradle Sync Failed

**Error:**
```
A problem occurred configuring project ':app'.
```

**Fixes:**
1. **Check Android SDK**: Android Studio → SDK Manager → SDK Platforms → Install latest
2. **Clean build**:
   ```bash
   cd android
   ./gradlew clean
   ```
3. **Invalidate caches**: Android Studio → File → Invalidate Caches / Restart

---

### Issue: App Crashes on Launch

**Check Logcat in Android Studio:**
1. Run app on device
2. View → Tool Windows → Logcat
3. Filter for "chromium" or "CapacitorWebView"

**Common causes:**
- Missing `dist/` folder: Run `npm run build` first
- Service worker issues: Capacitor doesn't load service workers well; consider disabling for mobile

---

### Issue: Keystore Password Forgotten

**🚨 BAD NEWS:** There's no recovery. You cannot update your app.

**Workaround:**
- Create new keystore
- Publish as a **NEW app** (different package name)
- Cannot migrate users from old app

**Prevention:**
- Store keystore and passwords in password manager (1Password, Bitwarden)
- Commit encrypted keystore to private repo
- Save recovery info in 3 places

---

## Version Management

### Updating the App

When you make changes and want to publish an update:

1. **Increment version** in `android/app/build.gradle`:
   ```gradle
   versionCode 2        // Increment by 1 (used by Play Store for tracking)
   versionName "1.0.1"  // User-facing version (semantic versioning)
   ```

2. Build → sync → generate AAB:
   ```bash
   npm run cap:sync
   npm run cap:android
   # Android Studio → Build → Generate Signed Bundle
   ```

3. Upload new AAB to Play Console → Create new release

### Version Numbering

| Field          | Format       | Example   | Rule                                |
|----------------|--------------|-----------|-------------------------------------|
| `versionCode`  | Integer      | 1, 2, 3   | Increment on EVERY release          |
| `versionName`  | Semver       | 1.0.0     | User-facing version                 |

**Semantic Versioning (versionName):**
- `1.0.0` → `1.0.1`: Bug fixes
- `1.0.1` → `1.1.0`: New features
- `1.1.0` → `2.0.0`: Breaking changes

---

## Next Steps After Publishing

### 1. Add iOS Support

```bash
npm install @capacitor/ios
npx cap add ios
npx cap open ios  # Requires macOS + Xcode
```

### 2. Implement Analytics

Track user behavior with Firebase Analytics:

```bash
npm install @capacitor/firebase-analytics
```

### 3. Crash Reporting

Catch production errors:

```bash
npm install @capacitor/crashlytics
```

### 4. In-App Updates

Prompt users to update when new version is available:

```typescript
import { AppUpdate } from '@capawesome/capacitor-app-update';
```

---

## Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Signing Best Practices](https://developer.android.com/studio/publish/app-signing)

---

> 💡 **Pro Tip:** Test your AAB before uploading to Play Store using Google's **bundletool**:
> ```bash
> bundletool build-apks --bundle=app-release.aab --output=app.apks
> bundletool install-apks --apks=app.apks
> ```
> This simulates Play Store's APK generation.
