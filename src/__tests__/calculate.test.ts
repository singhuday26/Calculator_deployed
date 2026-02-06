/**
 * ==========================================================================
 * CALCULATE.TEST.TS — Unit Tests for the Calculation Engine
 * ==========================================================================
 *
 * WHY WE TEST:
 * ────────────
 * Tests are automated verification that your code works correctly.
 * Without tests, the only way to verify is to manually click through
 * the app after every change. That doesn't scale.
 *
 * Tests give you:
 * 1. Confidence: "I changed X, and tests confirm nothing broke"
 * 2. Documentation: Tests show HOW the code is supposed to be used
 * 3. Design feedback: Hard-to-test code is usually poorly designed
 * 4. Regression protection: Bugs that are fixed stay fixed
 *
 * WHAT WE TEST:
 * ─────────────
 * We focus on testing PURE FUNCTIONS (calculate, formatDisplay, formatResult).
 * Pure functions are the easiest and most valuable things to test because:
 * - They have clear inputs and outputs
 * - No mocking needed (no DOM, no API, no state)
 * - They contain the core business logic
 *
 * TESTING FRAMEWORK: Vitest
 * ─────────────────────────
 * Vitest is a test runner designed for Vite projects. It's:
 * - Compatible with Jest's API (describe, it, expect)
 * - Fast (uses Vite's transform pipeline)
 * - Zero-config for Vite projects
 *
 * HOW TO RUN TESTS:
 *   npm test          → watch mode (re-runs on file changes)
 *   npm run test:run  → single run (for CI/CD)
 *
 * TEST STRUCTURE:
 * ───────────────
 * describe('group name', () => {     ← Group related tests
 *   it('should do something', () => { ← Single test case
 *     expect(result).toBe(expected);  ← Assertion
 *   });
 * });
 *
 * The `it` description should complete the sentence:
 * "It should [do something]" → "It should add two positive numbers"
 * ==========================================================================
 */

import { describe, it, expect } from 'vitest';
import { calculate, fixFloatingPoint } from '../utils/calculate';
import { formatDisplay, formatResult } from '../utils/formatNumber';
import { CalculatorError } from '../types/calculator';

// ═══════════════════════════════════════════════════════════════════════════
// CALCULATE FUNCTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculate', () => {
  // ── Addition ──────────────────────────────────────────────────────────
  describe('addition (+)', () => {
    it('should add two positive numbers', () => {
      expect(calculate(2, '+', 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(calculate(-5, '+', 3)).toBe(-2);
    });

    it('should handle adding zero', () => {
      expect(calculate(42, '+', 0)).toBe(42);
    });

    it('should handle decimal addition correctly', () => {
      // This is the classic floating-point test case
      // 0.1 + 0.2 should be 0.3, not 0.30000000000000004
      expect(calculate(0.1, '+', 0.2)).toBe(0.3);
    });

    it('should add large numbers', () => {
      expect(calculate(999999, '+', 1)).toBe(1000000);
    });
  });

  // ── Subtraction ───────────────────────────────────────────────────────
  describe('subtraction (-)', () => {
    it('should subtract two numbers', () => {
      expect(calculate(10, '-', 4)).toBe(6);
    });

    it('should handle negative results', () => {
      expect(calculate(3, '-', 7)).toBe(-4);
    });

    it('should handle subtracting zero', () => {
      expect(calculate(5, '-', 0)).toBe(5);
    });

    it('should handle decimal subtraction', () => {
      expect(calculate(0.3, '-', 0.1)).toBe(0.2);
    });
  });

  // ── Multiplication ────────────────────────────────────────────────────
  describe('multiplication (×)', () => {
    it('should multiply two numbers', () => {
      expect(calculate(6, '×', 7)).toBe(42);
    });

    it('should handle multiplication by zero', () => {
      expect(calculate(999, '×', 0)).toBe(0);
    });

    it('should handle multiplication by one', () => {
      expect(calculate(42, '×', 1)).toBe(42);
    });

    it('should handle negative multiplication', () => {
      expect(calculate(-3, '×', 4)).toBe(-12);
    });

    it('should handle two negatives', () => {
      expect(calculate(-3, '×', -4)).toBe(12);
    });

    it('should handle decimal multiplication', () => {
      expect(calculate(0.1, '×', 0.2)).toBe(0.02);
    });
  });

  // ── Division ──────────────────────────────────────────────────────────
  describe('division (÷)', () => {
    it('should divide two numbers', () => {
      expect(calculate(10, '÷', 2)).toBe(5);
    });

    it('should handle decimal results', () => {
      expect(calculate(1, '÷', 3)).toBeCloseTo(0.333333333333, 10);
    });

    it('should handle division of zero', () => {
      expect(calculate(0, '÷', 5)).toBe(0);
    });

    /**
     * TESTING ERROR CASES
     *
     * We use expect().toThrow() to verify that the function
     * throws the correct error. The function call MUST be
     * wrapped in an arrow function (() => calculate(...))
     * so Jest/Vitest can catch the error.
     *
     * We also check that it throws the specific CalculatorError
     * class, not just any generic Error.
     */
    it('should throw CalculatorError for division by zero', () => {
      expect(() => calculate(5, '÷', 0)).toThrow(CalculatorError);
      expect(() => calculate(5, '÷', 0)).toThrow('Cannot divide by zero');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// FLOATING POINT FIX TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('fixFloatingPoint', () => {
  it('should fix 0.1 + 0.2 artifact', () => {
    expect(fixFloatingPoint(0.30000000000000004)).toBe(0.3);
  });

  it('should fix 0.3 - 0.1 artifact', () => {
    expect(fixFloatingPoint(0.19999999999999998)).toBe(0.2);
  });

  it('should not change clean numbers', () => {
    expect(fixFloatingPoint(42)).toBe(42);
    expect(fixFloatingPoint(3.14)).toBe(3.14);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// FORMAT DISPLAY TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('formatDisplay', () => {
  it('should add thousands separators', () => {
    expect(formatDisplay('1234')).toBe('1,234');
    expect(formatDisplay('1234567')).toBe('1,234,567');
  });

  it('should handle decimals', () => {
    expect(formatDisplay('1234.56')).toBe('1,234.56');
  });

  it('should preserve trailing decimal point', () => {
    expect(formatDisplay('1234.')).toBe('1,234.');
  });

  it('should handle negative numbers', () => {
    expect(formatDisplay('-5678')).toBe('-5,678');
  });

  it('should handle zero', () => {
    expect(formatDisplay('0')).toBe('0');
  });

  it('should pass through non-numeric strings', () => {
    expect(formatDisplay('Error')).toBe('Error');
  });

  it('should handle small decimals', () => {
    expect(formatDisplay('0.123')).toBe('0.123');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// FORMAT RESULT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('formatResult', () => {
  it('should return number as string for small numbers', () => {
    expect(formatResult(42)).toBe('42');
    expect(formatResult(3.14)).toBe('3.14');
  });

  it('should use exponential notation for very large numbers', () => {
    const result = formatResult(123456789012345);
    expect(result).toContain('e+');
  });

  it('should handle negative numbers', () => {
    expect(formatResult(-42)).toBe('-42');
  });

  it('should handle zero', () => {
    expect(formatResult(0)).toBe('0');
  });
});
