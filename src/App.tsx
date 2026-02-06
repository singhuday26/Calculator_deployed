/**
 * ==========================================================================
 * APP.TSX — Root Application Component
 * ==========================================================================
 *
 * This is the top-level React component. It's responsible for:
 * 1. Setting up the theme (dark/light mode)
 * 2. Rendering the app header (with theme toggle)
 * 3. Rendering the Calculator component
 *
 * COMPONENT HIERARCHY (the complete tree):
 *   main.tsx
 *   └── <App>              ←── You are here
 *       ├── <ThemeToggle>
 *       └── <Calculator>
 *           ├── <Display>
 *           └── <Keypad>
 *               └── <Button> (×19)
 *
 * NOTICE HOW SMALL THIS FILE IS:
 * The root component doesn't do much — and that's by design.
 * All the heavy lifting is delegated to:
 * - useTheme hook (theme management)
 * - useCalculator hook (calculator logic)
 * - Child components (rendering)
 *
 * A well-designed app has a thin root component. If your App.tsx
 * is hundreds of lines, it's doing too much.
 * ==========================================================================
 */

import { Calculator } from './components/Calculator';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import { useTheme } from './hooks/useTheme';

export default function App() {
  /**
   * Theme hook — manages dark/light mode.
   *
   * `theme`: Current theme string ('dark' | 'light')
   * `toggleTheme`: Function to switch between themes
   *
   * The hook also:
   * - Sets the data-theme attribute on <html>
   * - Persists preference to localStorage
   * - Detects system preference on first load
   */
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/*
        APP HEADER
        ──────────
        Positioned above the calculator with the theme toggle.
        We don't use <header> semantically here because this isn't
        a traditional page header — it's more of a toolbar.
        
        In a more complex app, this would be a proper Header component
        with navigation, user menu, etc.
      */}
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '8px',
        }}
      >
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      {/*
        THE CALCULATOR
        ──────────────
        This is the entire calculator — display + keypad.
        It manages its own state internally via useCalculator.
        
        Notice: we pass ZERO props to Calculator.
        It's fully self-contained. This is the "smart component" pattern —
        it manages its own state, queries its own data, and renders
        its own UI.
        
        In a larger app, you might lift state up to App.tsx and pass
        it down. But for a self-contained feature like a calculator,
        encapsulation is better.
      */}
      <Calculator />

      {/*
        FOOTER
        ──────
        Keyboard shortcut hint — helps desktop users discover
        that they can use the keyboard.
      */}
      <p
        style={{
          marginTop: '16px',
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          transition: 'color 0.3s ease',
        }}
      >
        Keyboard supported • Built with React + TypeScript
      </p>
    </>
  );
}
