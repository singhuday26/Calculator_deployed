/**
 * ==========================================================================
 * INDEX.TS — Barrel Export for Calculator Components
 * ==========================================================================
 *
 * A "barrel" file re-exports from a folder, providing a clean public API.
 *
 * WITHOUT barrel export:
 *   import Calculator from './components/Calculator/Calculator';
 *                                                    ^^^^^^^^^^
 *                                         Redundant! The folder already says "Calculator"
 *
 * WITH barrel export:
 *   import { Calculator } from './components/Calculator';
 *                                             ^^^^^^^^^^
 *                                  Clean! Import from the folder, not the file.
 *
 * PRODUCTION BENEFITS:
 * 1. Cleaner import paths throughout the codebase
 * 2. Internal refactoring doesn't break imports (rename files freely)
 * 3. Controls what's "public" (only exported items are accessible)
 * 4. Single place to see everything a module exposes
 *
 * CONVENTION: Every component folder should have an index.ts barrel.
 * ==========================================================================
 */

export { default as Calculator } from './Calculator';
