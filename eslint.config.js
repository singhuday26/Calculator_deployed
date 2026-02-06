import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

/**
 * ==========================================================================
 * ESLINT.CONFIG.JS — Code Quality & Consistency Rules
 * ==========================================================================
 *
 * ESLint catches code quality issues that TypeScript doesn't:
 * - Unused imports/variables (that TS might miss)
 * - React hooks rule violations (missing deps in useEffect)
 * - Accessibility issues
 * - Code style inconsistencies
 *
 * This uses the new "flat config" format (eslint.config.js) instead
 * of the legacy .eslintrc format. Flat config is simpler and faster.
 * ==========================================================================
 */
export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
);
