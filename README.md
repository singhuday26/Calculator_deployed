# Production Calculator

A production-grade calculator built with **React 19 + TypeScript + Vite**, deployable on both **Web (PWA)** and **Android (Play Store via Capacitor)**.

> **Learning Project**: Every file is extensively commented to explain the **WHY** behind each decision. Read [BLUEPRINT.md](BLUEPRINT.md) for the complete architecture guide.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Open http://localhost:5173 in your browser
```

## Available Commands

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Start development server with HMR         |
| `npm run build`      | Build for production (outputs to `dist/`) |
| `npm run preview`    | Preview production build locally          |
| `npm test`           | Run tests in watch mode                   |
| `npm run test:run`   | Run tests once (for CI/CD)                |
| `npm run lint`       | Check code quality with ESLint            |
| `npm run format`     | Format code with Prettier                 |
| `npm run type-check` | Check TypeScript types without building   |

## Features

- **Basic Arithmetic**: Addition, subtraction, multiplication, division
- **Keyboard Support**: Full keyboard input (0-9, +, -, \*, /, Enter, Escape, Backspace)
- **Dark/Light Theme**: Toggle with auto-detection of system preference
- **PWA**: Installable on desktop and mobile browsers, works offline
- **Responsive**: Works from 320px phones to 4K desktops
- **Accessible**: Screen reader labels, keyboard navigation, focus indicators
- **Precision**: Handles floating-point edge cases (0.1 + 0.2 = 0.3)

## Project Architecture

```
src/
├── types/          → TypeScript type definitions (the data contract)
├── utils/          → Pure functions: math, formatting (no React dependency)
├── hooks/          → React hooks: state machine, keyboard, theme
├── components/     → UI components: Calculator, Display, Keypad, Button
├── styles/         → Global CSS reset and theme variables
└── __tests__/      → Unit tests for business logic
```

Read [BLUEPRINT.md](BLUEPRINT.md) for the full architecture deep-dive.

## Deploying to Web

Build and deploy the `dist/` folder to any static hosting:

```bash
npm run build
# Upload dist/ to Vercel, Netlify, GitHub Pages, etc.
```

## Deploying to Play Store

### 1. Install Capacitor (first time only)

```bash
npm install -D @capacitor/cli @capacitor/core
npm install @capacitor/android
```

### 2. Build and Deploy

```bash
npm run build                      # Build web assets
npx cap init Calculator com.yourname.calculator  # Initialize Capacitor
npx cap add android                # Add Android platform
npx cap sync                       # Copy web assets to Android
npx cap open android               # Open in Android Studio → Build → Generate Signed APK
```

See [BLUEPRINT.md § Capacitor](BLUEPRINT.md#9-capacitor--from-web-to-play-store) for detailed instructions.

## Tech Stack

| Layer         | Technology      | Purpose                               |
| ------------- | --------------- | ------------------------------------- |
| UI Framework  | React 19        | Component-based UI                    |
| Language      | TypeScript      | Type safety                           |
| Build Tool    | Vite 6          | Fast dev server & optimized builds    |
| PWA           | vite-plugin-pwa | Service worker & manifest generation  |
| Mobile Bridge | Capacitor       | Web → Android/iOS wrapper             |
| Testing       | Vitest          | Unit testing with Jest-compatible API |
| Linting       | ESLint          | Code quality checks                   |
| Formatting    | Prettier        | Consistent code style                 |

## License

MIT
