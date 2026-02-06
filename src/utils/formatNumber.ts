/**
 * ==========================================================================
 * FORMAT-NUMBER.TS — Display Formatting Utilities
 * ==========================================================================
 *
 * WHY A SEPARATE FILE FOR FORMATTING:
 * Formatting is NOT business logic — it's presentation logic.
 * It controls HOW numbers look, not WHAT they are.
 *
 * By separating formatting from calculation:
 * - We can change how numbers display without touching math
 * - We can localize formatting (1,000 vs 1.000) independently
 * - Formatting functions are independently testable
 *
 * PRODUCTION PRINCIPLE:
 * "Keep display concerns separate from data concerns."
 * The number 1234567.89 is always that number internally.
 * How it DISPLAYS depends on locale, screen size, user preferences.
 * ==========================================================================
 */

import { MAX_DISPLAY_LENGTH } from './calculate';

// ─── PRIMARY FORMATTING ─────────────────────────────────────────────────────
/**
 * Formats a numeric string for the calculator display.
 *
 * This function adds thousands separators (commas) to make large numbers
 * readable, while handling edge cases like:
 * - Numbers being typed (with trailing decimal points)
 * - Negative numbers
 * - Numbers that exceed the display width
 *
 * @param value - The raw numeric string (e.g., "1234567.89")
 * @returns The formatted string (e.g., "1,234,567.89")
 *
 * EXAMPLES:
 *   formatDisplay("1234")     → "1,234"
 *   formatDisplay("1234.5")   → "1,234.5"
 *   formatDisplay("0.123")    → "0.123"
 *   formatDisplay("-5678")    → "-5,678"
 *   formatDisplay("1234.")    → "1,234."   (trailing dot preserved while typing)
 *   formatDisplay("Error")    → "Error"    (non-numeric strings pass through)
 */
export function formatDisplay(value: string): string {
  // Non-numeric strings (like "Error") pass through unchanged
  if (isNaN(parseFloat(value))) {
    return value;
  }

  // Preserve the trailing decimal point (user is still typing)
  // Without this, typing "5." would show "5" and lose the dot
  const hasTrailingDecimal = value.endsWith('.');

  // Handle the negative sign separately
  const isNegative = value.startsWith('-');
  const absValue = isNegative ? value.slice(1) : value;

  // Split into integer and decimal parts
  // "1234.56" → ["1234", "56"]
  // "1234"    → ["1234"]
  const parts = absValue.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  /**
   * Add thousands separators using Intl.NumberFormat.
   *
   * WHY NOT REGEX:
   * You'll see regex solutions like: str.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
   * That works but is:
   * 1. Impossible to read/maintain
   * 2. Not locale-aware
   * 3. A classic "clever code" anti-pattern
   *
   * Intl.NumberFormat is the browser's built-in internationalization API.
   * It handles locale-specific formatting automatically.
   * (We use 'en-US' for consistency, but could easily make it dynamic.)
   */
  const formattedInteger = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(parseInt(integerPart, 10) || 0);

  // Reassemble the number
  let result = isNegative ? `-${formattedInteger}` : formattedInteger;

  if (decimalPart !== undefined) {
    result += `.${decimalPart}`;
  } else if (hasTrailingDecimal) {
    result += '.';
  }

  return result;
}

// ─── RESULT FORMATTING ─────────────────────────────────────────────────────
/**
 * Formats a calculation result for display, handling overflow.
 *
 * When a result is too long to fit on the display, we switch to
 * exponential notation (e.g., 1.23e+15).
 *
 * @param num - The numeric result to format
 * @returns A string that fits within MAX_DISPLAY_LENGTH characters
 *
 * EXAMPLES:
 *   formatResult(1234)                → "1234"
 *   formatResult(123456789012345)      → "1.23456789e+14"
 *   formatResult(0.00000000001234)     → "1.234e-11"
 *   formatResult(0.3)                 → "0.3" (not "0.30000000000000004")
 */
export function formatResult(num: number): string {
  const str = String(num);

  // If it fits on the display, use it as-is
  if (str.length <= MAX_DISPLAY_LENGTH) {
    return str;
  }

  // Too long — try exponential notation
  // toExponential gives us scientific notation: "1.23e+15"
  const exponential = num.toExponential(MAX_DISPLAY_LENGTH - 6);

  // If even exponential is too long, reduce precision further
  if (exponential.length > MAX_DISPLAY_LENGTH) {
    return num.toExponential(MAX_DISPLAY_LENGTH - 8);
  }

  return exponential;
}
