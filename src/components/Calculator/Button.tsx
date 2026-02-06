/**
 * ==========================================================================
 * BUTTON.TSX — Individual Calculator Button Component
 * ==========================================================================
 *
 * THE SMALLEST UI UNIT (Atomic Design)
 *
 * In "Atomic Design" methodology (by Brad Frost), components are organized
 * from smallest to largest:
 *   Atoms      → Button (this file), Display
 *   Molecules  → Keypad (group of Buttons)
 *   Organisms  → Calculator (Display + Keypad + ThemeToggle)
 *   Templates  → App layout
 *   Pages      → Full page view
 *
 * This Button is an "atom" — the smallest, most reusable piece.
 * It doesn't know about calculations, state, or the rest of the app.
 * It only knows: "I have a label, a type, and I fire onClick."
 *
 * COMPONENT DESIGN PRINCIPLES:
 * 1. Single Responsibility: Only renders a button. Nothing else.
 * 2. Props-driven: ALL behavior comes from props (passed down from parent).
 * 3. No internal state: It's a "presentational" or "dumb" component.
 * 4. Accessible: Proper aria-label, focus styles, keyboard interaction.
 * ==========================================================================
 */

import './Button.css';
import { ButtonType } from '../../types/calculator';

// ─── PROPS INTERFACE ────────────────────────────────────────────────────────
/**
 * Props for the Button component.
 *
 * WHY EXPLICIT INTERFACE:
 * In TypeScript, we define component props as an interface.
 * This serves as documentation AND compile-time validation.
 * If a parent component passes the wrong type, TypeScript catches it.
 *
 * NAMING CONVENTION: ComponentNameProps (e.g., ButtonProps)
 * This is a universal React + TypeScript convention.
 */
interface ButtonProps {
  /** The text shown on the button (e.g., "5", "+", "AC") */
  label: string;
  /** The visual category for styling */
  type: ButtonType;
  /** Whether this button spans 2 columns */
  wide?: boolean;
  /** Whether this button is currently active (for operator highlighting) */
  active?: boolean;
  /** Called when the button is clicked or activated via keyboard */
  onClick: () => void;
}

/**
 * A single calculator button.
 *
 * WHY NOT React.FC<ButtonProps>:
 * The React community has moved away from React.FC because:
 * 1. It implicitly included `children` prop (even when not needed)
 * 2. It interfered with generic components
 * 3. Plain function declarations are simpler and more explicit
 *
 * MODERN STYLE: Just type the props parameter directly.
 * This is the recommended approach since React 18.
 */
export default function Button({
  label,
  type,
  wide = false,
  active = false,
  onClick,
}: ButtonProps) {
  /**
   * BUILD CLASS NAMES DYNAMICALLY
   *
   * We construct CSS class names based on props. This maps
   * component state to visual appearance via CSS.
   *
   * Result examples:
   *   "calc-btn calc-btn--number"
   *   "calc-btn calc-btn--operator calc-btn--active"
   *   "calc-btn calc-btn--number calc-btn--wide"
   *
   * WHY NOT A CSS-IN-JS LIBRARY (like classnames/clsx):
   * For 3-4 conditional classes, string concatenation is fine.
   * Libraries like `clsx` are useful when you have 10+ conditions.
   * Don't add a dependency for something a ternary can handle.
   */
  const className = [
    'calc-btn',
    `calc-btn--${type}`,
    wide ? 'calc-btn--wide' : '',
    active ? 'calc-btn--active' : '',
  ]
    .filter(Boolean) // Remove empty strings
    .join(' ');

  return (
    <button
      className={className}
      onClick={onClick}
      /**
       * ACCESSIBILITY: aria-label
       *
       * Screen readers announce button content. For most buttons,
       * the visible text is sufficient. But for symbols like "×" and "÷",
       * we provide human-readable labels so screen readers say
       * "multiply" instead of "times" (the mathematical × symbol).
       */
      aria-label={getAriaLabel(label)}
      /**
       * type="button" explicitly marks this as a non-submit button.
       * Without this, buttons inside <form> elements default to
       * type="submit", which could cause unexpected form submissions.
       * Even without a form, it's a best practice.
       */
      type="button"
    >
      {label}
    </button>
  );
}

// ─── ACCESSIBILITY HELPER ───────────────────────────────────────────────────
/**
 * Maps button labels to screen-reader-friendly text.
 *
 * WHY THIS EXISTS:
 * Screen readers need to announce buttons in a way that makes sense
 * when spoken aloud. "×" would be read as "times" (the letter),
 * not "multiply" (the operation). We provide explicit labels.
 */
function getAriaLabel(label: string): string {
  const ariaLabels: Record<string, string> = {
    '×': 'multiply',
    '÷': 'divide',
    '+': 'add',
    '-': 'subtract',
    '=': 'equals',
    AC: 'all clear',
    '±': 'toggle sign',
    '%': 'percent',
    '⌫': 'backspace',
    '.': 'decimal point',
  };

  return ariaLabels[label] || label;
}
