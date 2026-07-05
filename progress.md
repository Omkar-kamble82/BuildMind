# BuildMind — Progress Log

## Project Overview

**BuildMind** is a terminal-based AI coding assistant built as a Bun monorepo.
It uses [`@opentui/core`](https://opentui.dev) + `@opentui/react` to render a rich TUI (Terminal UI) powered by React-style components.

---

## Monorepo Structure

```
BuildMind/
├── package.json             # Root workspace (Bun workspaces)
├── tsconfig.base.json       # Shared TypeScript config (strict, ESNext, bundler mode)
├── bun.lock
├── progress.md
└── packages/
    └── cli/
        ├── package.json     # @buildmind/cli
        ├── tsconfig.json
        └── src/
            ├── index.tsx            # App entry point
            └── components/
                ├── header.tsx       # ASCII art "BuildMind" header
                ├── inputbar.tsx     # Textarea input with key bindings
                └── statusbar.tsx    # Shows current model info
```

---

## What's Been Built

### 1. Monorepo Setup
- Root `package.json` configured as a **Bun workspace** (`"workspaces": ["packages/*"]`).
- Shared `tsconfig.base.json` with strict TypeScript settings, bundler module resolution, and ESNext target.
- Single `node_modules` directory at the root level (shared deps) to reduce disk usage.
- Dev script: `bun run --watch packages/cli/src/index.tsx` (also available as `npm run dev:cli`).

### 2. CLI Package (`packages/cli`)
- Entry: `src/index.tsx` — creates a `CliRenderer` via `createCliRenderer()`, mounts the `<App />` component.
- App layout: full-terminal box (dark `#0d0d12` background) with centred `<Header />` and a max-width-78 `<InputBar />`.

### 3. Components

#### `<Header />`
- Renders the "BuildMind" logo using `<ascii-font font="tiny">` — "Build" in gray, "Mind" in default color.

#### `<InputBar />`
- Accepts `onSubmit` callback and optional `disabled` flag.
- Renders a neon-green (`#39FF14`) left-border box containing:
  - A multi-line **textarea** with placeholder `Ask anything... "Fix this code" or "Explain this code"`.
  - A `<StatusBar />` below it.
- Exports `INPUTBAR_KEY_BINDINGS` for the textarea:
  - `Enter` / `Return` → **submit**
  - `Shift+Enter` / `Shift+Return` → **newline**

#### `<StatusBar />`
- Displays the active model: `Build › opus-4-6` using `@opentui/core` `TextAttributes.DIM` for the separator.

---

## Bugs Fixed

### Textarea Width Resizing
- **Problem:** The textarea shrank/grew in width as the user typed because neither the textarea nor its parent border box had an explicit width — they auto-sized to content.
- **Fix 1:** Added `width="100%"` to the `<textarea>` element.
- **Fix 2:** Added `width="100%"` to the wrapping `<box border={["left"]}>` element (this was the root cause — the chain needed to be fully anchored from outer to inner).
- **Result:** The textarea now stays the same width as when the placeholder is displayed.

---

## Pending / Next Steps

- [ ] Wire up `onSubmit` in `<InputBar />` — currently passed as `() => {}` placeholder in `index.tsx`.
- [ ] Integrate an AI backend (e.g. Anthropic SDK / Gemini) to process submitted prompts.
- [ ] Display AI responses in a scrollable output area above the input bar.
- [ ] Make the model shown in `<StatusBar />` dynamic (switchable at runtime).
- [ ] Fix key bindings — `Enter`/`Return` submit not yet functioning in terminal.
- [ ] Add loading/streaming state to the UI while waiting for AI responses.
