/**
 * ==========================================================================
 * USE-THEME.TS — Dark/Light Theme Manager
 * ==========================================================================
 *
 * HOW THEMING WORKS IN THIS APP:
 * 1. We set a `data-theme` attribute on the <html> element
 * 2. CSS uses [data-theme="dark"] and [data-theme="light"] selectors
 * 3. CSS custom properties (variables) change based on the selector
 * 4. All components use these variables → theme changes everywhere at once
 *
 * THEME DETECTION PRIORITY:
 * 1. User's saved preference (localStorage) — highest priority
 * 2. System preference (OS dark mode setting) — fallback
 * 3. Default to 'dark' — final fallback
 *
 * WHY localStorage + matchMedia:
 * - localStorage remembers the user's explicit choice across visits
 * - matchMedia('prefers-color-scheme: dark') detects OS dark mode
 * - Combining both respects user intent while providing smart defaults
 *
 * PRODUCTION PATTERNS DEMONSTRATED:
 * 1. Persistent user preferences (localStorage)
 * 2. System preference detection (matchMedia)
 * 3. DOM manipulation from React (data attributes)
 * 4. Custom hook encapsulation (hide complexity behind a simple API)
 * ==========================================================================
 */

import { useState, useEffect, useCallback } from 'react';

/** The two supported theme options */
export type Theme = 'dark' | 'light';

/** The key used to store theme preference in localStorage */
const STORAGE_KEY = 'calculator-theme';

/**
 * Detects the initial theme based on saved preference or system setting.
 *
 * WHY NOT JUST `localStorage.getItem()`:
 * We need to handle several edge cases:
 * - localStorage might be unavailable (incognito mode, storage full)
 * - The stored value might be invalid (manually edited, corrupted)
 * - First-time users have no stored preference
 * - The user's OS preference should be respected as a default
 *
 * This function handles ALL of these cases gracefully.
 */
function getInitialTheme(): Theme {
  // Try localStorage first (user's explicit choice)
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch {
    // localStorage not available (incognito, storage limit, etc.)
    // Not a problem — we have fallbacks
  }

  // Fall back to system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    /**
     * matchMedia() queries CSS media features from JavaScript.
     * 'prefers-color-scheme: dark' returns true if the user's OS
     * is set to dark mode (Windows, macOS, Android, iOS all support this).
     */
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // Final fallback
  return 'dark';
}

/**
 * Custom hook for managing the app's color theme.
 *
 * @returns An object with:
 *   - theme: The current theme ('dark' or 'light')
 *   - toggleTheme: Function to switch between themes
 *   - setTheme: Function to set a specific theme
 *
 * USAGE:
 * ```tsx
 * function App() {
 *   const { theme, toggleTheme } = useTheme();
 *   return <button onClick={toggleTheme}>Currently: {theme}</button>;
 * }
 * ```
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  /**
   * Apply theme to the DOM and persist to localStorage.
   *
   * WHY BOTH DOM AND STATE:
   * - React state (theme) → controls what the component renders
   * - DOM attribute (data-theme) → controls what CSS styles apply
   * - localStorage → persists across page reloads
   *
   * We keep all three in sync. This is a common pattern when
   * React state needs to interact with the broader DOM or browser APIs.
   */
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);

    // Update the <html> element's data-theme attribute
    // CSS selectors like [data-theme="dark"] will immediately take effect
    document.documentElement.setAttribute('data-theme', newTheme);

    // Also update the <meta name="theme-color"> for mobile browser chrome
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#1a1a2e' : '#f2f2f7');
    }

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Storage full or unavailable — that's OK, theme still works
      // it just won't persist across reloads
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  /**
   * Apply the initial theme on mount.
   *
   * WHY useEffect:
   * We need to set the DOM attribute AFTER the component mounts.
   * During server-side rendering (SSR), `document` doesn't exist.
   * useEffect only runs in the browser, making this safe for SSR.
   * (Not applicable here since we use Vite SPA, but it's a good habit.)
   */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // ↑ We intentionally only run this on mount (theme from getInitialTheme)

  return { theme, toggleTheme, setTheme };
}
