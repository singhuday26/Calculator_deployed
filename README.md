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

### Development & Testing

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

### Mobile Deployment (Capacitor)

| Command                   | Description                                   |
| ------------------------- | --------------------------------------------- |
| `npm run cap:sync`        | Build web assets and sync to native platforms |
| `npm run cap:android`     | Sync and open Android Studio                  |
| `npm run cap:run:android` | Sync and run on connected Android device      |

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

### Prerequisites

- ✅ **Capacitor installed** (already configured in this project)
- ✅ **Android platform added** (`android/` folder exists)
- ⚠️ **Android Studio** required ([Download here](https://developer.android.com/studio))
- ⚠️ **JDK 17+** required (bundled with Android Studio or install separately)

### Quick Deploy (3 steps)

```bash
# 1. Build web assets and sync to Android
npm run cap:sync

# 2. Open in Android Studio
npm run cap:android

# 3. In Android Studio:
#    Build → Generate Signed Bundle/APK → Android App Bundle (.aab)
#    Then upload to Play Console
```

### Testing on Device (Before Publishing)

```bash
# Connect Android device via USB (enable USB debugging)
# Run directly on device:
npm run cap:run:android

# Or manually in Android Studio:
# Click ▶️ Run button after opening with `npm run cap:android`
```

### Development Workflow

When making code changes:

```bash
# Option A: Rebuild and sync
npm run cap:sync

# Option B: Live reload (faster during development)
# 1. Find your local IP: ipconfig (Windows) or ifconfig (Mac/Linux)
# 2. Uncomment server config in capacitor.config.ts
# 3. Set url to http://YOUR_IP:5173
# 4. Run: npm run dev
# 5. App will hot-reload on code changes!
```

### App Identity

- **App ID**: `com.singhuday26.calculator` (cannot change after Play Store publish)
- **App Name**: `Calculator`
- **Current icons**: Default Capacitor icons (located in `android/app/src/main/res/mipmap-*`)

To customize icons, use [Capacitor Assets](https://github.com/ionic-team/capacitor-assets):

```bash
# Generate all icon sizes from a single 1024x1024 PNG
npx @capacitor/assets generate --iconBackgroundColor '#000000'
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
