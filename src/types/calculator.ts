/**
 * ==========================================================================
 * CALCULATOR.TS — Type Definitions (The Data Contract)
 * ==========================================================================
 *
 * THIS FILE IS THE FOUNDATION OF THE ENTIRE APP.
 *
 * WHY TYPES FIRST:
 * In production development, we define types BEFORE writing any logic.
 * Types are a "contract" — they define the exact shape of our data and
 * ensure consistency everywhere that data is used.
 *
 * ANALOGY: Think of types like architectural blueprints. You don't start
 * building a house by pouring concrete — you start with the plans.
 * Similarly, you don't start coding logic — you start with the data shapes.
 *
 * WHAT'S IN THIS FILE:
 * 1. Operator type — the four arithmetic operators
 * 2. ButtonType — categories for styling/behavior
 * 3. CalculatorState — the complete app state at any moment
 * 4. CalculatorAction — every possible user action (reducer actions)
 * 5. HistoryEntry — shape of a past calculation
 * 6. CalculatorError — custom error for calculator-specific failures
 * ==========================================================================
 */

// ─── OPERATOR TYPE ──────────────────────────────────────────────────────────
/**
 * The four arithmetic operators our calculator supports.
 *
 * WHY A UNION TYPE INSTEAD OF `string`:
 * If we typed this as `string`, any string would be valid — including
 * typos like "plus" or "add". With a union type, TypeScript will ERROR
 * if you try to use an invalid operator ANYWHERE in the codebase.
 *
 * This is "making invalid states unrepresentable" — a core TypeScript principle.
 */
export type Operator = '+' | '-' | '×' | '÷';

// ─── BUTTON TYPE ────────────────────────────────────────────────────────────
/**
 * Categorizes buttons for different visual styling and behavior.
 *
 * - 'number'   → Digits 0-9 and decimal point (neutral color)
 * - 'operator' → +, -, ×, ÷ (accent color, e.g., orange)
 * - 'action'   → AC, ±, %, ⌫ (secondary color)
 * - 'equals'   → The = button (primary accent, often different from operators)
 */
export type ButtonType = 'number' | 'operator' | 'action' | 'equals';

// ─── BUTTON CONFIG ──────────────────────────────────────────────────────────
/**
 * Configuration for a single calculator button.
 * Used by Keypad.tsx to generate the button grid.
 *
 * WHY A CONFIG OBJECT:
 * Instead of hardcoding buttons in JSX, we define them as data.
 * This makes it easy to add/remove/reorder buttons without touching
 * the rendering logic. Data-driven UI is a production pattern.
 */
export interface ButtonConfig {
  /** The label/value shown on the button */
  label: string;
  /** Visual category for styling */
  type: ButtonType;
  /** Whether this button spans 2 columns (like the "0" button) */
  wide?: boolean;
}

// ─── CALCULATOR STATE ───────────────────────────────────────────────────────
/**
 * The complete state of our calculator at any point in time.
 *
 * WHY A SINGLE STATE OBJECT:
 * Instead of having separate useState calls for each piece of state
 * (which can get out of sync), we keep EVERYTHING in one object.
 *
 * Benefits:
 * 1. Atomic updates: All related state changes happen together
 * 2. Debuggable: Inspect one object to see the entire app state
 * 3. Testable: Create specific states for testing edge cases
 * 4. Serializable: Easy to save/restore (undo, persistence)
 *
 * PRODUCTION TIP: If you ever need "time travel debugging" (like Redux DevTools),
 * having state in a single object makes it trivial to implement.
 */
export interface CalculatorState {
  /** The current number displayed to the user (always a string for display purposes) */
  displayValue: string;

  /**
   * The expression being built, shown above the main display.
   * Example: "5 + 3" while the user is entering the second operand.
   * This provides context so users can see what operation is in progress.
   */
  expression: string;

  /**
   * The first number in a binary operation (e.g., the "5" in "5 + 3").
   * null when no operation is in progress.
   */
  firstOperand: number | null;

  /** The currently selected operator. null when no operator is active. */
  operator: Operator | null;

  /**
   * A flag that indicates whether the NEXT digit press should START
   * a new number (true) or APPEND to the current number (false).
   *
   * Set to true when:
   * - An operator is pressed (waiting for the second number)
   * - "=" is pressed (next input starts a fresh calculation)
   * - An error occurred (next input clears the error)
   */
  waitingForSecondOperand: boolean;

  /** Error message to display (e.g., "Cannot divide by zero"), or null */
  error: string | null;

  /** Past calculations for the history feature */
  history: HistoryEntry[];
}

// ─── HISTORY ENTRY ──────────────────────────────────────────────────────────
/**
 * A single entry in the calculation history.
 *
 * WHY TIMESTAMP:
 * Timestamps enable sorting, grouping by date, and expiring old entries.
 * Even if we don't use it now, it's forward-compatible — adding features
 * later won't require changing the data shape.
 */
export interface HistoryEntry {
  /** The full expression (e.g., "5 + 3") */
  expression: string;
  /** The result (e.g., "8") */
  result: string;
  /** Unix timestamp in milliseconds */
  timestamp: number;
}

// ─── CALCULATOR ACTIONS ─────────────────────────────────────────────────────
/**
 * All possible actions that can be dispatched to the calculator reducer.
 *
 * DISCRIMINATED UNION PATTERN:
 * Each action has a unique `type` string. TypeScript uses this to "narrow"
 * the type inside a switch statement — meaning it knows exactly which
 * fields are available for each action type.
 *
 * Example:
 *   case 'INPUT_DIGIT':
 *     action.payload  ← TypeScript knows this is a string (the digit)
 *   case 'INPUT_OPERATOR':
 *     action.payload  ← TypeScript knows this is an Operator
 *
 * This pattern eliminates an entire class of bugs where you access
 * the wrong field on the wrong action type.
 *
 * WHY THESE SPECIFIC ACTIONS:
 * Each action represents a USER INTENT, not a UI event.
 * "INPUT_DIGIT" not "BUTTON_CLICKED" — the action describes WHAT
 * the user wants to do, not HOW they did it (could be button, keyboard, voice).
 */
export type CalculatorAction =
  | { type: 'INPUT_DIGIT'; payload: string }
  | { type: 'INPUT_DECIMAL' }
  | { type: 'INPUT_OPERATOR'; payload: Operator }
  | { type: 'CALCULATE' }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'PERCENTAGE' }
  | { type: 'BACKSPACE' }
  | { type: 'CLEAR_HISTORY' };

// ─── CUSTOM ERROR ───────────────────────────────────────────────────────────
/**
 * Custom error class for calculator-specific errors.
 *
 * WHY CUSTOM ERRORS:
 * In production, you need to distinguish between:
 * - Expected errors (division by zero → show user-friendly message)
 * - Unexpected errors (bug in code → log to error tracking service)
 *
 * Custom error classes let you use `instanceof` to differentiate:
 *   if (error instanceof CalculatorError) {
 *     showUserMessage(error.message);  // Expected, handle gracefully
 *   } else {
 *     logToSentry(error);              // Unexpected, investigate
 *   }
 */
export class CalculatorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalculatorError';
  }
}
