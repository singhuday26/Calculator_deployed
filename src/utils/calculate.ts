/**
 * ==========================================================================
 * CALCULATE.TS — Pure Calculation Engine
 * ==========================================================================
 *
 * THIS IS THE BRAIN OF THE CALCULATOR.
 *
 * WHY THIS FILE EXISTS (Separation of Concerns):
 * This file contains PURE FUNCTIONS — functions that:
 * 1. Take inputs and return outputs
 * 2. Have ZERO side effects (no DOM, no state, no network calls)
 * 3. Always return the same output for the same input
 *
 * WHY PURE FUNCTIONS MATTER IN PRODUCTION:
 * - Testable: Just call the function and check the result
 * - Predictable: No hidden state or side effects to track down
 * - Reusable: Works in React, Node.js, Deno, anywhere JavaScript runs
 * - Debuggable: If the output is wrong, the bug is 100% in this function
 *
 * DESIGN PRINCIPLE:
 * "Your business logic should work without your UI framework even existing."
 * If React disappeared tomorrow, this file would still work perfectly.
 * ==========================================================================
 */

import { Operator, CalculatorError } from '../types/calculator';

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
/**
 * Maximum number of digits allowed in the display.
 *
 * WHY A CONSTANT:
 * Hardcoded "magic numbers" scattered in code are a maintenance nightmare.
 * By defining them as named constants, you:
 * 1. Document what the number means
 * 2. Change it in ONE place if needed
 * 3. Can find all usages easily
 */
export const MAX_DISPLAY_LENGTH = 12;

/**
 * Number of decimal places used to fix floating-point precision.
 * See fixFloatingPoint() below for why this exists.
 */
const PRECISION = 12;

// ─── CORE CALCULATION ───────────────────────────────────────────────────────
/**
 * Performs a binary arithmetic operation.
 *
 * @param firstOperand - The left-hand number (e.g., 5 in "5 + 3")
 * @param operator - The arithmetic operator (+, -, ×, ÷)
 * @param secondOperand - The right-hand number (e.g., 3 in "5 + 3")
 * @returns The result of the operation
 * @throws {CalculatorError} If division by zero is attempted
 *
 * DESIGN DECISION — Why throw instead of returning Infinity:
 * JavaScript's `5 / 0` returns `Infinity`, which is technically correct
 * per IEEE 754. But for a calculator UI, showing "Infinity" is confusing.
 * Throwing an error forces us to handle this case explicitly in the UI
 * and show a human-readable message.
 *
 * PRODUCTION PRINCIPLE: "Fail loudly, not silently."
 * Silent failures (returning weird values) create bugs that are hard
 * to track down. Explicit errors are your friend.
 */
export function calculate(
  firstOperand: number,
  operator: Operator,
  secondOperand: number,
): number {
  let result: number;

  switch (operator) {
    case '+':
      result = firstOperand + secondOperand;
      break;

    case '-':
      result = firstOperand - secondOperand;
      break;

    case '×':
      result = firstOperand * secondOperand;
      break;

    case '÷':
      if (secondOperand === 0) {
        throw new CalculatorError('Cannot divide by zero');
      }
      result = firstOperand / secondOperand;
      break;

    default: {
      /**
       * EXHAUSTIVE CHECK PATTERN:
       *
       * TypeScript's `never` type means "this should be impossible."
       * If we add a new operator to the Operator union type (like '%')
       * but forget to add a case for it here, TypeScript will show a
       * compile-time error on this line.
       *
       * This is how you make TypeScript work FOR you — it catches
       * forgotten cases before they become runtime bugs.
       *
       * NOTE: Wrapped in braces to satisfy ESLint's no-case-declarations rule.
       */
      const _exhaustiveCheck: never = operator;
      throw new CalculatorError(`Unknown operator: ${_exhaustiveCheck}`);
    }
  }

  // Fix floating-point precision before returning
  return fixFloatingPoint(result);
}

// ─── FLOATING POINT FIX ─────────────────────────────────────────────────────
/**
 * Fixes floating-point precision artifacts.
 *
 * THE FLOATING-POINT PROBLEM:
 * In JavaScript (and most languages), decimal numbers are stored in
 * binary (IEEE 754). Some decimal numbers can't be represented exactly
 * in binary, leading to tiny precision errors:
 *
 *   0.1 + 0.2 = 0.30000000000000004  (not 0.3!)
 *   0.3 - 0.1 = 0.19999999999999998  (not 0.2!)
 *
 * This is NOT a JavaScript bug — it's a fundamental limitation of
 * binary floating-point representation.
 *
 * OUR SOLUTION:
 * Round to 12 significant digits using toPrecision(). This eliminates
 * the tiny artifacts while maintaining more than enough precision for
 * a calculator (most scientific calculators use 10-12 digits).
 *
 * @param num - The number to fix
 * @returns The number with precision artifacts removed
 *
 * EXAMPLES:
 *   fixFloatingPoint(0.30000000000000004) → 0.3
 *   fixFloatingPoint(0.19999999999999998) → 0.2
 *   fixFloatingPoint(1234567890.123)      → 1234567890.123 (unchanged, already clean)
 */
export function fixFloatingPoint(num: number): number {
  return parseFloat(num.toPrecision(PRECISION));
}
