/**
 * ==========================================================================
 * USE-CALCULATOR.TS — Calculator State Machine (The Heart of the App)
 * ==========================================================================
 *
 * THIS IS THE MOST IMPORTANT FILE IN THE ENTIRE PROJECT.
 *
 * WHY useReducer INSTEAD OF useState:
 * ──────────────────────────────────
 * Our calculator has complex, interdependent state:
 * - Pressing "5" might append "5" to display OR start a new number
 * - Pressing "+" might calculate a pending operation OR just set the operator
 * - Pressing "=" might calculate OR do nothing if there's no operation
 *
 * With multiple useState calls, these transitions are error-prone:
 *   setDisplay('5');         // What if we forget to also...
 *   setWaiting(false);       // ...update this?
 *   // Bug: states are out of sync!
 *
 * With useReducer, ALL state changes happen atomically in the reducer:
 *   dispatch({ type: 'INPUT_DIGIT', payload: '5' });
 *   // The reducer handles ALL related state changes together
 *   // It's impossible for states to get out of sync
 *
 * THE REDUCER PATTERN:
 * ───────────────────
 * 1. STATE:    "Here's everything about the calculator right now"
 * 2. ACTION:   "The user did THIS" (pressed a button, typed a key)
 * 3. REDUCER:  "Given the current state and this action, here's the new state"
 * 4. DISPATCH: "Send this action to the reducer"
 *
 * It's a pure function: (currentState, action) → newState
 * No side effects, no async, no randomness — 100% predictable.
 *
 * WHY THIS MATTERS FOR YOUR CAREER:
 * This exact pattern (state + action → new state) is used in:
 * - Redux (React state management library)
 * - Vuex/Pinia (Vue state management)
 * - The Elm Architecture
 * - Game engines (game state + player input → next game state)
 * - Backend event sourcing
 * Master it once, use it everywhere.
 * ==========================================================================
 */

import { useReducer, useCallback } from 'react';
import {
  CalculatorState,
  CalculatorAction,
  Operator,
  CalculatorError,
  HistoryEntry,
} from '../types/calculator';
import { calculate } from '../utils/calculate';
import { formatResult } from '../utils/formatNumber';
import { MAX_DISPLAY_LENGTH } from '../utils/calculate';

// ─── INITIAL STATE ──────────────────────────────────────────────────────────
/**
 * The starting state of the calculator.
 *
 * PRODUCTION TIP: Always define initial state as a separate constant.
 * This makes it easy to:
 * 1. Reset to initial state (just return this object)
 * 2. Use in tests (import and spread it)
 * 3. Document what "default" means clearly
 */
const initialState: CalculatorState = {
  displayValue: '0',
  expression: '',
  firstOperand: null,
  operator: null,
  waitingForSecondOperand: false,
  error: null,
  history: [],
};

// ─── THE REDUCER ────────────────────────────────────────────────────────────
/**
 * The calculator reducer — handles every possible state transition.
 *
 * HOW TO READ THIS:
 * Each `case` in the switch handles one type of user action.
 * For each case:
 * 1. We destructure relevant state
 * 2. We compute the new values
 * 3. We return a NEW state object (never mutate the old one!)
 *
 * WHY { ...state, changes }: (Spread & Override Pattern)
 * We spread the existing state and override only what changed.
 * This ensures we never accidentally lose state fields.
 * It also creates a NEW object (React needs new references to trigger re-render).
 *
 * @param state - The current calculator state
 * @param action - The action describing what the user did
 * @returns The new state after applying the action
 */
function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    // ─── DIGIT INPUT (0-9) ────────────────────────────────────────────
    case 'INPUT_DIGIT': {
      const digit = action.payload;

      // If there's an error showing, clear it and start fresh
      if (state.error) {
        return {
          ...initialState,
          history: state.history,
          displayValue: digit,
        };
      }

      // If waiting for second operand, START a new number
      if (state.waitingForSecondOperand) {
        return {
          ...state,
          displayValue: digit,
          waitingForSecondOperand: false,
        };
      }

      // Prevent exceeding display length
      if (state.displayValue.replace(/[^0-9]/g, '').length >= MAX_DISPLAY_LENGTH) {
        return state; // No change — display is full
      }

      // If display is "0", replace it with the digit (not "05")
      // Otherwise, append the digit
      return {
        ...state,
        displayValue: state.displayValue === '0' ? digit : state.displayValue + digit,
      };
    }

    // ─── DECIMAL POINT ────────────────────────────────────────────────
    case 'INPUT_DECIMAL': {
      // Clear error state
      if (state.error) {
        return {
          ...initialState,
          history: state.history,
          displayValue: '0.',
        };
      }

      // If waiting for second operand, start with "0."
      if (state.waitingForSecondOperand) {
        return {
          ...state,
          displayValue: '0.',
          waitingForSecondOperand: false,
        };
      }

      // Only allow one decimal point per number
      // This prevents inputs like "3.14.15"
      if (state.displayValue.includes('.')) {
        return state; // No change
      }

      return {
        ...state,
        displayValue: state.displayValue + '.',
      };
    }

    // ─── OPERATOR (+, -, ×, ÷) ────────────────────────────────────────
    case 'INPUT_OPERATOR': {
      const nextOperator = action.payload;

      // Clear error state
      if (state.error) {
        return {
          ...initialState,
          history: state.history,
        };
      }

      const currentValue = parseFloat(state.displayValue);

      /**
       * CASE 1: Already waiting for second operand
       * The user pressed two operators in a row (e.g., "5 + ×")
       * Just replace the previous operator.
       */
      if (state.waitingForSecondOperand) {
        const operand = state.firstOperand ?? currentValue;
        return {
          ...state,
          firstOperand: operand,
          operator: nextOperator,
          expression: `${operand} ${nextOperator}`,
        };
      }

      /**
       * CASE 2: Chaining operations (e.g., "5 + 3 ×")
       * Both operands and a previous operator are available.
       * Calculate the intermediate result, then set up the new operator.
       */
      if (state.firstOperand !== null && state.operator) {
        try {
          const result = calculate(state.firstOperand, state.operator, currentValue);
          const resultStr = formatResult(result);

          return {
            ...state,
            displayValue: resultStr,
            firstOperand: result,
            operator: nextOperator,
            expression: `${resultStr} ${nextOperator}`,
            waitingForSecondOperand: true,
          };
        } catch (error) {
          if (error instanceof CalculatorError) {
            return {
              ...state,
              displayValue: '0',
              error: error.message,
              firstOperand: null,
              operator: null,
              waitingForSecondOperand: false,
              expression: '',
            };
          }
          throw error;
        }
      }

      /**
       * CASE 3: Starting a new operation
       * Covers both fresh start (firstOperand is null) AND
       * post-calculation state (firstOperand set but no operator).
       * Use the current display value as the first operand.
       */
      return {
        ...state,
        firstOperand: currentValue,
        operator: nextOperator,
        expression: `${state.displayValue} ${nextOperator}`,
        waitingForSecondOperand: true,
      };
    }

    // ─── EQUALS (=) ───────────────────────────────────────────────────
    case 'CALCULATE': {
      // Can't calculate without both operands and an operator
      if (
        state.firstOperand === null ||
        state.operator === null ||
        state.waitingForSecondOperand
      ) {
        return state;
      }

      const secondOperand = parseFloat(state.displayValue);

      try {
        const result = calculate(state.firstOperand, state.operator, secondOperand);
        const resultStr = formatResult(result);
        const fullExpression = `${state.expression} ${state.displayValue}`;

        // Add to history
        const historyEntry: HistoryEntry = {
          expression: `${fullExpression} =`,
          result: resultStr,
          timestamp: Date.now(),
        };

        /**
         * After calculation:
         * - firstOperand keeps the result for potential chaining (8 + ...)
         * - operator is cleared (calculation is done)
         * - waitingForSecondOperand = true so next digit starts fresh
         *
         * This works because INPUT_OPERATOR's CASE 3 (the default)
         * handles the state where firstOperand is set but operator is null.
         */
        return {
          ...state,
          displayValue: resultStr,
          expression: '',
          firstOperand: result,
          operator: null,
          waitingForSecondOperand: true,
          history: [historyEntry, ...state.history].slice(0, 50),
        };
      } catch (error) {
        if (error instanceof CalculatorError) {
          return {
            ...state,
            displayValue: '0',
            error: error.message,
            firstOperand: null,
            operator: null,
            waitingForSecondOperand: false,
            expression: '',
          };
        }
        throw error;
      }
    }

    // ─── CLEAR (AC) ───────────────────────────────────────────────────
    case 'CLEAR': {
      // Reset everything EXCEPT history
      return {
        ...initialState,
        history: state.history,
      };
    }

    // ─── TOGGLE SIGN (±) ──────────────────────────────────────────────
    case 'TOGGLE_SIGN': {
      if (state.error) return state;

      const current = state.displayValue;

      // Can't negate zero
      if (current === '0') return state;

      return {
        ...state,
        displayValue: current.startsWith('-')
          ? current.slice(1) // Remove the minus
          : `-${current}`, // Add a minus
        // Clear waiting flag - user is actively entering the value
        waitingForSecondOperand: false,
      };
    }

    // ─── PERCENTAGE (%) ───────────────────────────────────────────────
    case 'PERCENTAGE': {
      if (state.error) return state;

      const value = parseFloat(state.displayValue);
      const result = value / 100;
      const resultStr = formatResult(result);

      return {
        ...state,
        displayValue: resultStr,
        // Clear waiting flag - percentage counts as entering a value
        waitingForSecondOperand: false,
      };
    }

    // ─── BACKSPACE (⌫) ────────────────────────────────────────────────
    case 'BACKSPACE': {
      // If waiting for second operand, backspace starts entering it
      // For example: "5 +" [user presses backspace] should allow entering second operand
      if (state.waitingForSecondOperand) {
        return {
          ...state,
          displayValue: '0',
          waitingForSecondOperand: false,
        };
      }

      if (state.error) {
        return {
          ...initialState,
          history: state.history,
        };
      }

      // If waiting for second operand, backspace does nothing
      if (state.waitingForSecondOperand) return state;

      const current = state.displayValue;

      // If only one character (or "-X"), reset to "0"
      if (current.length === 1 || (current.length === 2 && current.startsWith('-'))) {
        return {
          ...state,
          displayValue: '0',
        };
      }

      return {
        ...state,
        displayValue: current.slice(0, -1),
      };
    }

    // ─── CLEAR HISTORY ────────────────────────────────────────────────
    case 'CLEAR_HISTORY': {
      return {
        ...state,
        history: [],
      };
    }

    // ─── EXHAUSTIVE CHECK ─────────────────────────────────────────────
    default: {
      /**
       * If TypeScript shows an error here, it means we added a new action
       * to CalculatorAction but forgot to handle it in this switch.
       * The `never` type makes TypeScript enforce completeness.
       */
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
    }
  }
}

// ─── THE CUSTOM HOOK ────────────────────────────────────────────────────────
/**
 * Custom hook that provides the calculator's state and action dispatchers.
 *
 * WHY A CUSTOM HOOK:
 * Instead of exposing `dispatch` directly (which requires knowing action types),
 * we expose named functions like `inputDigit('5')`. This:
 * 1. Simplifies the component code (no action object creation)
 * 2. Provides autocomplete in IDE
 * 3. Hides implementation details (components don't know about reducer)
 * 4. Acts as an API boundary between state management and UI
 *
 * USAGE IN A COMPONENT:
 * ```tsx
 * const { state, inputDigit, inputOperator, clear } = useCalculator();
 *
 * <button onClick={() => inputDigit('5')}>5</button>
 * <button onClick={() => inputOperator('+')}>+</button>
 * <button onClick={clear}>AC</button>
 * ```
 *
 * WHY useCallback:
 * useCallback memoizes the function references. Without it, new function
 * instances would be created on every render, causing child components
 * to re-render unnecessarily. In a small app this doesn't matter much,
 * but it's a best practice for production code.
 */
export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  /**
   * Each function below is a thin wrapper around dispatch.
   * They provide a clean, descriptive API for components to use.
   */

  const inputDigit = useCallback(
    (digit: string) => dispatch({ type: 'INPUT_DIGIT', payload: digit }),
    [],
  );

  const inputDecimal = useCallback(() => dispatch({ type: 'INPUT_DECIMAL' }), []);

  const inputOperator = useCallback(
    (operator: Operator) => dispatch({ type: 'INPUT_OPERATOR', payload: operator }),
    [],
  );

  const calculateResult = useCallback(() => dispatch({ type: 'CALCULATE' }), []);

  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const toggleSign = useCallback(() => dispatch({ type: 'TOGGLE_SIGN' }), []);

  const percentage = useCallback(() => dispatch({ type: 'PERCENTAGE' }), []);

  const backspace = useCallback(() => dispatch({ type: 'BACKSPACE' }), []);

  const clearHistory = useCallback(() => dispatch({ type: 'CLEAR_HISTORY' }), []);

  return {
    state,
    inputDigit,
    inputDecimal,
    inputOperator,
    calculateResult,
    clear,
    toggleSign,
    percentage,
    backspace,
    clearHistory,
  };
}
