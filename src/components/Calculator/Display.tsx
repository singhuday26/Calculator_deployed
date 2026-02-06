/**
 * ==========================================================================
 * DISPLAY.TSX — Calculator Display Component
 * ==========================================================================
 *
 * This component shows two things:
 * 1. The expression being built (e.g., "5 + 3") — in smaller text above
 * 2. The current value or result — in large text below
 *
 * DESIGN DECISIONS:
 * - Auto-shrinks text when numbers get long (responsive typography)
 * - Shows error messages in place of the number
 * - Expression provides context so users know what operation is pending
 *
 * COMPONENT PATTERN: "Presentational Component"
 * This component has NO logic — it only renders what it receives via props.
 * All formatting is done before data reaches this component (in the hook
 * or utility functions). This keeps the component simple and testable.
 * ==========================================================================
 */

import './Display.css';
import { formatDisplay } from '../../utils/formatNumber';

// ─── PROPS ──────────────────────────────────────────────────────────────────
interface DisplayProps {
  /** The main value to show (raw numeric string, will be formatted) */
  value: string;
  /** The expression being built (shown above the main value) */
  expression: string;
  /** Error message to show instead of the value */
  error: string | null;
}

export default function Display({ value, expression, error }: DisplayProps) {
  /**
   * DYNAMIC FONT SIZE
   *
   * When numbers get long, they need to shrink to fit the display.
   * We calculate a CSS class based on the formatted value length.
   *
   * This is a common pattern in calculator apps — the iOS calculator
   * does exactly the same thing.
   *
   * Alternative approach: Use CSS `clamp()` or `container queries`.
   * We use explicit classes for maximum browser compatibility and control.
   */
  const displayText = error || formatDisplay(value);
  const sizeClass = getSizeClass(displayText.length);

  return (
    <div className="calc-display" role="status" aria-live="polite">
      {/*
        EXPRESSION LINE
        Shows the ongoing expression (e.g., "5 +")
        Uses aria-label to be descriptive for screen readers
      */}
      <div className="calc-display__expression" aria-label="expression">
        {expression || '\u00A0'}
        {/*
          \u00A0 is a non-breaking space.
          WHY: When expression is empty, the div would collapse to 0 height,
          causing a layout shift. The nbsp keeps the line's height consistent.
          This is a common CSS trick for "invisible content that maintains layout."
        */}
      </div>

      {/*
        MAIN VALUE
        Shows the current number or error message
      */}
      <div
        className={`calc-display__value ${sizeClass} ${error ? 'calc-display__value--error' : ''}`}
        aria-label={error ? `Error: ${error}` : `Display showing ${displayText}`}
      >
        {displayText}
      </div>
    </div>
  );
}

// ─── SIZE HELPER ────────────────────────────────────────────────────────────
/**
 * Returns a CSS class name for responsive text sizing.
 *
 * As the number of characters grows, we apply progressively
 * smaller font sizes to prevent overflow.
 *
 * @param length - The number of characters in the display text
 * @returns A CSS class name like "calc-display__value--sm"
 */
function getSizeClass(length: number): string {
  if (length > 14) return 'calc-display__value--xs';
  if (length > 11) return 'calc-display__value--sm';
  if (length > 8) return 'calc-display__value--md';
  return ''; // Default (large) size
}
