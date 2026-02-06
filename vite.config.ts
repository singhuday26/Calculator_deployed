/**
 * ==========================================================================
 * VITE.CONFIG.TS — Build Tool Configuration
 * ==========================================================================
 *
 * Vite (French for "fast") is our build tool. It does two things:
 *
 * 1. DEVELOPMENT: Runs a dev server with Hot Module Replacement (HMR).
 *    When you save a file, changes appear instantly without page reload.
 *
 * 2. PRODUCTION: Bundles your app into optimized static files (HTML/CSS/JS)
 *    that can be deployed anywhere.
 *
 * PLUGINS:
 * - @vitejs/plugin-react: Enables JSX, Fast Refresh, and React-specific
 *   optimizations.
 * - vite-plugin-pwa: Auto-generates a Service Worker and web manifest
 *   for Progressive Web App support.
 * ==========================================================================
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    /**
     * React plugin — enables:
     * - JSX transformation (no need to import React in every file)
     * - Fast Refresh (state-preserving hot reload during development)
     */
    react(),

    /**
     * PWA plugin — makes our app installable and offline-capable.
     *
     * HOW IT WORKS:
     * 1. During build, it auto-generates a Service Worker using Workbox
     * 2. The service worker caches all your app's assets
     * 3. On repeat visits, assets load from cache (instant!)
     * 4. If the network is unavailable, the app still works
     *
     * registerType: 'autoUpdate' means:
     * - New versions are detected automatically
     * - The service worker updates in the background
     * - User gets the new version on next visit
     */
    VitePWA({
      registerType: 'autoUpdate',

      // Include these file types in the precache
      includeAssets: ['favicon.svg'],

      // PWA manifest — defines how the app appears when installed
      manifest: {
        name: 'Production Calculator',
        short_name: 'Calculator',
        description: 'A beautiful, production-grade calculator',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],

  /**
   * Build configuration
   *
   * sourcemap: true — Generates source maps for production debugging.
   * In production, your code is minified and bundled. Source maps let
   * you see original source code in browser DevTools when debugging.
   */
  build: {
    sourcemap: true,
  },
});
