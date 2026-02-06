/**
 * ==========================================================================
 * CAPACITOR.CONFIG.TS — Mobile Bridge Configuration
 * ==========================================================================
 *
 * ⚠️ PREREQUISITES:
 * Before using this file, install Capacitor packages:
 *   npm install -D @capacitor/cli @capacitor/core
 *   npm install @capacitor/android    (for Android builds)
 *   npm install @capacitor/ios        (for iOS builds)
 *
 * Capacitor wraps your web app in a native WebView for Android/iOS.
 * This file tells Capacitor:
 * 1. Your app's identity (appId, appName)
 * 2. Where to find the built web assets (webDir)
 * 3. Native-specific settings (status bar, splash screen, etc.)
 *
 * HOW TO USE THIS:
 * 1. Build your web app: `npm run build`
 * 2. Add Android platform: `npx cap add android`
 * 3. Copy web assets: `npx cap sync`
 * 4. Open in Android Studio: `npx cap open android`
 * 5. Build APK/AAB from Android Studio
 *
 * APP ID (appId):
 * ───────────────
 * The appId is your app's unique identifier on app stores.
 * It uses "reverse domain notation" (like Java packages).
 * Once published, you CANNOT change it without creating a new listing.
 * Choose carefully!
 *
 * Format: com.yourcompany.yourapp
 * Example: com.johndoe.calculator
 * ==========================================================================
 */

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  /**
   * Unique app identifier for app stores.
   * CHANGE THIS to your own domain before publishing!
   */
  appId: 'com.yourname.calculator',

  /** Display name shown under the app icon */
  appName: 'Calculator',

  /**
   * The directory containing built web assets.
   * This matches Vite's default output directory.
   * When you run `npx cap sync`, Capacitor copies this folder
   * into the native project.
   */
  webDir: 'dist',

  /**
   * Server configuration for development.
   *
   * During development, you can run `npm run dev` and have
   * the native app connect to your dev server for hot reload.
   * This is much faster than rebuilding and syncing every time.
   *
   * To use: Uncomment the `server` block and set your local IP.
   */
  // server: {
  //   url: 'http://192.168.1.100:5173',
  //   cleartext: true, // Allow non-HTTPS in development
  // },
};

export default config;
