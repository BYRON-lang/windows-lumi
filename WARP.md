# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project type: Electron Forge + Webpack + React + TypeScript + Tailwind CSS

Commands

- Install dependencies

```bash path=null start=null
npm install
```

- Start the app in development (Electron + Webpack dev server)

```bash path=null start=null
npm start
```

- Lint the codebase

```bash path=null start=null
npm run lint
```

- Lint a single file

```bash path=null start=null
npx eslint src/App.tsx
```

- Type-check (Fork TS Checker runs during dev build; run standalone with tsc)

```bash path=null start=null
npx tsc --noEmit
```

- Package (build an unpackaged app)

```bash path=null start=null
npm run package
```

- Make installers (platform-specific artifacts)

```bash path=null start=null
npm run make
```

- Publish (uses Electron Forge publish targets if configured)

```bash path=null start=null
npm run publish
```

- Tests

No test framework or scripts are configured in package.json; running a single test is not applicable.

High-level architecture

- Main process (Electron)
  - Entry: `src/index.ts` (configured by `webpack.main.config.ts`)
  - Creates a frameless `BrowserWindow` with `frame: false`, `titleBarStyle: 'hidden'`, opens DevTools by default, and loads the renderer bundle via the Forge Webpack plugin constants.
  - Registers IPC handlers: `close-app`, `minimize-app`, `maximize-app` to control the window/app.

- Preload script (context isolation boundary)
  - `src/preload.ts` exposes a minimal `window.electronAPI` via `contextBridge` with methods: `closeApp`, `minimizeApp`, `maximizeApp` that invoke the corresponding IPC channels.
  - Keeps renderer sandboxed; Node integration remains off in the renderer (only `preload` is enabled).

- Renderer (UI)
  - Webpack entry: `src/renderer.ts` which imports global styles (`src/index.css`) and mounts the React app via `src/Main.tsx`.
  - React app root: `src/Main.tsx` renders `<App />` into `#root` from `src/index.html`.
  - Application UI: `src/App.tsx` (React + react-router). Implements a custom draggable top bar and uses `WindowControls` (`src/components/WindowControls.tsx`) to trigger window actions through `window.electronAPI`.
  - Assets: images under `src/logo`, fonts bundled under `src/fonts`.

- Styling
  - Tailwind CSS v4 via PostCSS: configured in `postcss.config.js` and `tailwind.config.js`; global styles in `src/index.css` (also registers local Instrument Sans font faces).

- Build tooling
  - Electron Forge (`forge.config.ts`) with Webpack plugin defines two bundles:
    - Main: `webpack.main.config.ts` (entry `src/index.ts`).
    - Renderer: `webpack.renderer.config.ts` with `entryPoints` for `src/index.html`, `src/renderer.ts`, and `src/preload.ts`.
  - Fuses plugin disables certain Node/Electron features at package time and enables ASAR integrity/only-load-from-asar for production.
  - Webpack rules (`webpack.rules.ts`):
    - TypeScript transpilation via `ts-loader` (`transpileOnly: true`) + `fork-ts-checker-webpack-plugin` for type diagnostics.
    - Asset handling for fonts/images; CSS handled in the renderer via `style-loader`/`css-loader`/`postcss-loader`.

- Linting/TypeScript config
  - ESLint: `.eslintrc.json` with `@typescript-eslint` and `eslint-plugin-import` (including Electron and TS rules).
  - TypeScript: `tsconfig.json` with `jsx: react-jsx`, `typeRoots` including `./types` and `node_modules/@types`.

Notable files

- Electron/Forge: `forge.config.ts`, `webpack.main.config.ts`, `webpack.renderer.config.ts`, `webpack.rules.ts`, `webpack.plugins.ts`
- App entry points: `src/index.ts` (main), `src/preload.ts`, `src/renderer.ts`, `src/Main.tsx`, `src/App.tsx`, `src/index.html`
- Config: `.eslintrc.json`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`

Operational notes

- DevTools are opened automatically by the main process (`mainWindow.webContents.openDevTools()`); remove or guard for production if undesired.
- The window is frameless; all window actions must go through the exposed `electronAPI` or IPC handlers in the main process.
