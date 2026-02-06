/**
 * ==========================================================================
 * THEME-TOGGLE.TSX — Dark/Light Mode Switch
 * ==========================================================================
 *
 * A simple toggle button that switches between dark and light themes.
 * Uses emoji icons for simplicity (🌙 for dark, ☀️ for light).
 *
 * WHY A SEPARATE COMPONENT:
 * Even though it's small, separating it means:
 * 1. The Calculator component stays focused on calculator logic
 * 2. We can reuse ThemeToggle in other parts of the app
 * 3. We can easily enhance it (add animation, dropdown for more themes)
 *
 * This component is purely presentational — it receives the current theme
 * and a toggle function from props. The actual theme logic lives in useTheme.
 * ==========================================================================
 */

import './ThemeToggle.css';
import { Theme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  /** The current active theme */
  theme: Theme;
  /** Function to toggle between themes */
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      type="button"
    >
      {/*
        CONDITIONAL RENDERING
        We show different icons based on the current theme.
        The icon shows what you'll SWITCH TO, not what you're currently on.
        (If you're in dark mode, the sun icon means "switch to light")
      */}
      <span className="theme-toggle__icon" aria-hidden="true">
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
