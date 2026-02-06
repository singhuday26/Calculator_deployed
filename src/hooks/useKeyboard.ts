/**
 * ==========================================================================
 * USE-KEYBOARD.TS — Keyboard Input Handler
 * ==========================================================================
 *
 * WHY KEYBOARD SUPPORT:
 * A production calculator must be usable without a mouse/touch.
 * This is both a UX feature (power users are faster with keyboard)
 * and an accessibility requirement (screen reader users, motor impairments).
 *
 * HOW THIS HOOK WORKS:
 * 1. Attaches a `keydown` event listener to the `document`
 * 2. Maps keyboard keys to calculator actions
 * 3. Calls the appropriate action function from useCalculator
 * 4. Cleans up the listener when the component unmounts
 *
 * KEY MAPPING:
 *   0-9        → inputDigit
 *   .          → inputDecimal
 *   + - * /    → inputOperator (mapped to ×, ÷ for display)
 *   Enter, =   → calculateResult
 *   Backspace  → backspace
 *   Escape     → clear
 *   %          → percentage
 *
 * WHY useEffect FOR EVENT LISTENERS:
 * useEffect is React's way of handling "side effects" — things that
 * interact with the outside world (DOM events, API calls, timers).
 * The cleanup function (return () => {}) removes the listener to
 * prevent memory leaks when the component unmounts.
 *
 * PRODUCTION PRINCIPLE: "Always clean up after yourself."
 * Forgetting to remove event listeners causes memory leaks that
 * are extremely hard to debug in production.
 * ==========================================================================
 */

import { useEffect } from 'react';
import { Operator } from '../types/calculator';

/**
 * The interface for the actions this hook needs from useCalculator.
 *
 * WHY AN INTERFACE HERE:
 * Instead of importing the entire useCalculator hook, we define just
 * what we need. This is the "Interface Segregation Principle" (the I in SOLID):
 * "Don't depend on things you don't use."
 *
 * Benefits:
 * 1. This hook doesn't care WHERE the actions come from
 * 2. Easy to test (just pass mock functions)
 * 3. Could be reused with a different calculator implementation
 */
interface KeyboardActionHandlers {
  inputDigit: (digit: string) => void;
  inputDecimal: () => void;
  inputOperator: (operator: Operator) => void;
  calculateResult: () => void;
  clear: () => void;
  backspace: () => void;
  percentage: () => void;
  toggleSign: () => void;
}

/**
 * Hook that maps keyboard events to calculator actions.
 *
 * @param handlers - The action functions from useCalculator
 * @param enabled - Whether keyboard input is active (default: true)
 *
 * USAGE:
 * ```tsx
 * const calc = useCalculator();
 * useKeyboard(calc); // That's it! Keyboard now works.
 * ```
 */
export function useKeyboard(
  handlers: KeyboardActionHandlers,
  enabled: boolean = true,
): void {
  useEffect(() => {
    // If disabled, don't attach any listeners
    if (!enabled) return;

    /**
     * The main keyboard event handler.
     *
     * WHY `keydown` NOT `keypress`:
     * `keypress` is deprecated and doesn't fire for special keys
     * like Backspace and Escape. `keydown` fires for ALL keys.
     */
    function handleKeyDown(event: KeyboardEvent) {
      const { key } = event;

      /**
       * We use event.preventDefault() to stop the browser's default
       * behavior for certain keys (e.g., Backspace might navigate back,
       * Enter might submit a form).
       *
       * BUT we only do this for keys we actually handle — we don't
       * want to break other keyboard functionality (accessibility tools,
       * browser shortcuts, etc.).
       */

      // ── Digits 0-9 ───────────────────────────────────────────────
      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        handlers.inputDigit(key);
        return;
      }

      // ── Operators ─────────────────────────────────────────────────
      // Map keyboard symbols to our display symbols
      const operatorMap: Record<string, Operator> = {
        '+': '+',
        '-': '-',
        '*': '×', // Keyboard * → display ×
        '/': '÷', // Keyboard / → display ÷
      };

      if (key in operatorMap) {
        event.preventDefault();
        handlers.inputOperator(operatorMap[key]);
        return;
      }

      // ── Other keys ────────────────────────────────────────────────
      switch (key) {
        case '.':
        case ',': // Some keyboards use comma as decimal separator
          event.preventDefault();
          handlers.inputDecimal();
          break;

        case 'Enter':
        case '=':
          event.preventDefault();
          handlers.calculateResult();
          break;

        case 'Backspace':
          event.preventDefault();
          handlers.backspace();
          break;

        case 'Escape':
        case 'Delete':
          event.preventDefault();
          handlers.clear();
          break;

        case '%':
          event.preventDefault();
          handlers.percentage();
          break;

        case '_':
          // Shift+- on some keyboards, toggle sign
          event.preventDefault();
          handlers.toggleSign();
          break;

        // All other keys are ignored (not prevented)
      }
    }

    // Attach the listener
    document.addEventListener('keydown', handleKeyDown);

    /**
     * CLEANUP FUNCTION:
     * This runs when:
     * 1. The component unmounts (navigating away)
     * 2. The `enabled` dependency changes
     * 3. The handler references change
     *
     * Forgetting this cleanup = memory leak.
     * The event listener would continue firing even after the
     * component is gone, causing "state updates on unmounted component"
     * warnings (or crashes).
     */
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers, enabled]);
  /**
   * DEPENDENCY ARRAY ↑
   * This array tells React "re-run this effect when these values change."
   *
   * - `handlers`: If the handler functions change, we need new listeners
   * - `enabled`: If enabled toggles, we need to add/remove listeners
   *
   * WHY NOT EMPTY []:
   * An empty array means "run once on mount, cleanup on unmount."
   * But if handlers change (unlikely with useCallback, but possible),
   * we'd be calling stale function references. Including handlers
   * in the dependency array is the correct, future-proof approach.
   */
}
