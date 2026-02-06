/**
 * ==========================================================================
 * MAIN.TSX — Application Entry Point (The Bootstrap)
 * ==========================================================================
 *
 * THIS IS WHERE EVERYTHING BEGINS.
 *
 * HOW A REACT APP STARTS:
 * 1. Browser loads index.html
 * 2. index.html has <script src="/src/main.tsx">
 * 3. Browser executes this file
 * 4. This file creates a React "root" and renders <App />
 * 5. React takes over the DOM from here
 *
 * WHAT IS createRoot:
 * React 18 introduced `createRoot` (replacing the old `ReactDOM.render`).
 * It enables concurrent features like automatic batching and transitions.
 * Even if we don't use those features yet, using createRoot is required
 * for React 19 and is the standard entry point.
 *
 * WHAT IS StrictMode:
 * React.StrictMode is a development-only wrapper that:
 * 1. Renders components TWICE to detect side effects
 * 2. Checks for deprecated API usage
 * 3. Warns about potential problems
 *
 * It has ZERO effect in production builds — it's stripped out completely.
 * Always use it. It catches bugs before they reach users.
 * ==========================================================================
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import global styles FIRST (order matters in CSS!)
import './styles/themes.css'; // Theme variables (must be first — components depend on these)
import './styles/globals.css'; // Reset and base styles

// Import the root component
import App from './App';

/**
 * Get the root DOM element.
 *
 * The `!` is TypeScript's "non-null assertion operator."
 * It tells TypeScript: "I guarantee this is not null."
 *
 * We can safely use it here because we control index.html
 * and we KNOW the div#root exists. If it didn't, the app
 * couldn't run anyway, and we'd want a clear crash.
 */
const rootElement = document.getElementById('root')!;

/**
 * Create the React root and render the app.
 *
 * createRoot() creates a concurrent React root.
 * .render() mounts the React component tree into the DOM.
 *
 * From this point on, React owns the DOM inside #root.
 * All updates happen through React's reconciliation algorithm
 * (the "virtual DOM diff" process), not direct DOM manipulation.
 */
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
