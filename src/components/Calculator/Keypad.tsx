/**
 * ==========================================================================
 * KEYPAD.TSX — Button Grid Layout Component
 * ==========================================================================
 *
 * DATA-DRIVEN UI PATTERN:
 *
 * Instead of hardcoding 19 <Button> elements in JSX, we define the
 * buttons as a DATA ARRAY and render them with .map().
 *
 * WHY THIS IS BETTER:
 * 1. Adding/removing/reordering buttons = changing one array
 * 2. The rendering logic stays unchanged regardless of button count
 * 3. Scientific mode? Just swap the buttonLayout array
 * 4. Localization? Map over the array and translate labels
 *
 * This is the "configuration over code" principle.
 * The WHAT (which buttons exist) is separated from the HOW (rendering).
 *
 * COMPONENT RESPONSIBILITY:
 * - Defines the button layout (data)
 * - Renders buttons in a CSS Grid
 * - Routes button presses to the appropriate handler
 * - Does NOT know about calculator state or logic
 * ==========================================================================
 */

import './Keypad.css';
import Button from './Button';
import { ButtonConfig, Operator } from '../../types/calculator';

// ─── PROPS ──────────────────────────────────────────────────────────────────
interface KeypadProps {
  /** Called when any button is pressed */
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onOperator: (operator: Operator) => void;
  onEquals: () => void;
  onClear: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onBackspace: () => void;
  /** The currently active operator (for visual highlighting) */
  activeOperator: Operator | null;
  /** Whether we're waiting for second operand (affects operator highlight) */
  waitingForSecondOperand: boolean;
}

// ─── BUTTON LAYOUT ──────────────────────────────────────────────────────────
/**
 * The calculator's button layout defined as data.
 *
 * This array defines every button in order, from top-left to bottom-right.
 * The CSS Grid handles the 4-column layout automatically.
 *
 * Each button has:
 * - label: What's displayed on the button
 * - type: Visual category (for CSS styling)
 * - wide: Whether it spans 2 columns (optional)
 *
 * ┌──────┬──────┬──────┬──────┐
 * │  AC  │  ±   │  %   │  ÷   │
 * ├──────┼──────┼──────┼──────┤
 * │  7   │  8   │  9   │  ×   │
 * ├──────┼──────┼──────┼──────┤
 * │  4   │  5   │  6   │  -   │
 * ├──────┼──────┼──────┼──────┤
 * │  1   │  2   │  3   │  +   │
 * ├──────┴──────┼──────┼──────┤
 * │      0      │  .   │  =   │
 * └─────────────┴──────┴──────┘
 */
const buttonLayout: ButtonConfig[] = [
  // Row 1: Actions & divide
  { label: 'AC', type: 'action' },
  { label: '±', type: 'action' },
  { label: '%', type: 'action' },
  { label: '÷', type: 'operator' },

  // Row 2: 7-8-9 & multiply
  { label: '7', type: 'number' },
  { label: '8', type: 'number' },
  { label: '9', type: 'number' },
  { label: '×', type: 'operator' },

  // Row 3: 4-5-6 & subtract
  { label: '4', type: 'number' },
  { label: '5', type: 'number' },
  { label: '6', type: 'number' },
  { label: '-', type: 'operator' },

  // Row 4: 1-2-3 & add
  { label: '1', type: 'number' },
  { label: '2', type: 'number' },
  { label: '3', type: 'number' },
  { label: '+', type: 'operator' },

  // Row 5: 0 (wide), decimal, equals
  { label: '0', type: 'number', wide: true },
  { label: '.', type: 'number' },
  { label: '=', type: 'equals' },
];

export default function Keypad({
  onDigit,
  onDecimal,
  onOperator,
  onEquals,
  onClear,
  onToggleSign,
  onPercentage,
  activeOperator,
  waitingForSecondOperand,
}: KeypadProps) {
  /**
   * BUTTON PRESS ROUTER
   *
   * This function determines WHAT action to take based on the button label.
   * It's a "router" — it directs each button press to the right handler.
   *
   * WHY A SINGLE HANDLER:
   * Instead of giving each button its own inline onClick handler,
   * we have one function that dispatches based on the label.
   * This centralizes the routing logic and makes it easy to:
   * 1. Add logging/analytics for button presses
   * 2. Add haptic feedback for all buttons
   * 3. Add sound effects
   * Without modifying 19 individual handlers.
   */
  function handleButtonPress(label: string) {
    // ── Number digits ─────────────────────────────────────────
    if (/^[0-9]$/.test(label)) {
      onDigit(label);
      return;
    }

    // ── Special buttons ───────────────────────────────────────
    switch (label) {
      case '.':
        onDecimal();
        break;
      case '+':
      case '-':
      case '×':
      case '÷':
        onOperator(label as Operator);
        break;
      case '=':
        onEquals();
        break;
      case 'AC':
        onClear();
        break;
      case '±':
        onToggleSign();
        break;
      case '%':
        onPercentage();
        break;
    }
  }

  return (
    <div className="calc-keypad" role="group" aria-label="Calculator keypad">
      {/*
        RENDERING WITH .map()

        We iterate over the buttonLayout array and render a Button
        for each entry. This is the "data-driven UI" pattern.

        KEY PROP:
        React requires a unique `key` prop when rendering lists.
        It uses keys to efficiently update the DOM — if an item's
        key hasn't changed, React knows it can skip updating that element.

        We use `label` as the key because each button has a unique label.
        In general, prefer stable, unique identifiers (IDs) over array indices.
      */}
      {buttonLayout.map((btn) => (
        <Button
          key={btn.label}
          label={btn.label}
          type={btn.type}
          wide={btn.wide}
          active={
            btn.type === 'operator' &&
            btn.label === activeOperator &&
            waitingForSecondOperand
          }
          onClick={() => handleButtonPress(btn.label)}
        />
      ))}
    </div>
  );
}
