/**
 * ==========================================================================
 * CALCULATOR.TSX — Main Calculator Container (The Orchestrator)
 * ==========================================================================
 *
 * THIS IS THE COMPONENT THAT TIES EVERYTHING TOGETHER.
 *
 * COMPONENT HIERARCHY:
 *   App
 *   └── Calculator (this file) ← "Smart" / "Container" component
 *       ├── Display            ← "Presentational" component
 *       └── Keypad             ← "Presentational" component
 *           └── Button (×19)   ← "Presentational" component
 *
 * SMART vs PRESENTATIONAL COMPONENTS:
 * ──────────────────────────────────
 * This is a fundamental React pattern for organizing components:
 *
 * "Smart" (Container) components:
 *   - Manage state and business logic
 *   - Use hooks (useCalculator, useKeyboard)
 *   - Pass data down to presentational components
 *   - This Calculator component is the only "smart" component
 *
 * "Presentational" (Dumb) components:
 *   - Only render UI based on props
 *   - No state management, no hooks (except maybe useState for UI-only state)
 *   - Display, Keypad, Button are all presentational
 *
 * WHY THIS SEPARATION:
 * 1. Presentational components are easy to understand (just look at props)
 * 2. They're easy to test (pass props, check output)
 * 3. They're reusable (not tied to specific state logic)
 * 4. Changes to logic happen in ONE place (this file + hooks)
 * 5. Changes to UI happen in their respective components
 * ==========================================================================
 */

import './Calculator.css';
import Display from './Display';
import Keypad from './Keypad';
import { useCalculator } from '../../hooks/useCalculator';
import { useKeyboard } from '../../hooks/useKeyboard';

export default function Calculator() {
  /**
   * HOOK USAGE
   *
   * useCalculator provides:
   * - state: The current calculator state (display value, expression, etc.)
   * - Action functions: inputDigit, inputOperator, clear, etc.
   *
   * useKeyboard:
   * - Maps keyboard events to calculator actions
   * - We pass it the action functions from useCalculator
   * - It handles the event listener lifecycle automatically
   *
   * NOTICE: This component doesn't contain ANY calculation logic.
   * All logic lives in hooks and utilities. This component's ONLY
   * job is to wire hooks to components — it's "glue code."
   */
  const {
    state,
    inputDigit,
    inputDecimal,
    inputOperator,
    calculateResult,
    clear,
    toggleSign,
    percentage,
    backspace,
  } = useCalculator();

  // Enable keyboard shortcuts
  useKeyboard({
    inputDigit,
    inputDecimal,
    inputOperator,
    calculateResult,
    clear,
    backspace,
    percentage,
    toggleSign,
  });

  return (
    <div className="calc-container">
      {/*
        THE CALCULATOR LAYOUT
        ─────────────────────
        The container holds the display and keypad.
        CSS Grid (defined in Calculator.css) handles the layout.

        Data flows DOWN (parent → child):
        - Calculator passes state TO Display
        - Calculator passes handlers TO Keypad
        - Keypad passes handlers TO each Button

        Events flow UP (child → parent → hook):
        - Button fires onClick
        - Keypad's handleButtonPress routes it
        - Calculator's handler (from useCalculator) dispatches the action
        - The reducer computes new state
        - React re-renders with the new state
      */}

      <Display
        value={state.displayValue}
        expression={state.expression}
        error={state.error}
      />

      <Keypad
        onDigit={inputDigit}
        onDecimal={inputDecimal}
        onOperator={inputOperator}
        onEquals={calculateResult}
        onClear={clear}
        onToggleSign={toggleSign}
        onPercentage={percentage}
        onBackspace={backspace}
        activeOperator={state.operator}
        waitingForSecondOperand={state.waitingForSecondOperand}
      />
    </div>
  );
}
