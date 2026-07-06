# BuildMind — Progress Log

## Project Overview

**BuildMind** is a terminal-based AI coding assistant built as a Bun monorepo.
It uses [`@opentui/core`](https://opentui.dev) + `@opentui/react` to render a rich TUI (Terminal UI) driven by React-style components, with full client-side routing via `react-router`.

---

## Monorepo Structure

```
BuildMind/
├── package.json               # Root Bun workspace
├── tsconfig.base.json         # Shared TypeScript config
├── bun.lock
├── progress.md
└── packages/
    └── cli/
        ├── package.json       # @buildmind/cli
        ├── tsconfig.json
        └── src/
            ├── index.tsx              # App entry — router + renderer
            ├── themes.ts              # All theme definitions (32 themes)
            ├── layouts/
            │   ├── root-layout.tsx    # Provider tree wrapper
            │   └── root-theme.tsx     # Applies theme background to root
            ├── screens/
            │   ├── home.tsx           # Landing screen with InputBar
            │   ├── new-session.tsx    # New session with message preview
            │   └── session.tsx        # Ongoing session shell (stub)
            ├── components/
            │   ├── header.tsx         # ASCII art "BuildMind" logo
            │   ├── inputbar.tsx       # Textarea + CommandMenu + key logic
            │   ├── statusbar.tsx      # Active model display
            │   ├── session-shell.tsx  # Chat layout (scroll + input + footer)
            │   ├── spinner.tsx        # Loading spinner
            │   ├── dialog-search-list.tsx
            │   ├── command-menu/
            │   │   ├── index.tsx           # CommandMenu component
            │   │   ├── commands.tsx        # All registered slash commands
            │   │   ├── command-types.ts    # Command & CommandContext types
            │   │   ├── filter-commands.ts  # Fuzzy filter logic
            │   │   └── use-commandmenu.ts  # Hook: state, scroll, selection
            │   ├── messages/
            │   │   ├── index.tsx           # Re-exports
            │   │   ├── user-message.tsx    # User bubble (left border)
            │   │   ├── bot-message.tsx     # AI response with model label
            │   │   └── error-message.tsx   # Error bubble (red border)
            │   └── dialogs/
            │       ├── index.tsx
            │       └── theme-dialog.tsx    # Theme picker dialog content
            └── providers/
                ├── themes/index.tsx        # ThemeProvider + useTheme
                ├── toast/
                │   ├── index.tsx           # ToastProvider + useToast
                │   └── toast-types.ts
                ├── dialog/
                │   ├── index.tsx           # DialogProvider + useDialog
                │   └── dialog-types.ts
                └── keyboard-layer/
                    └── index.tsx           # KeyboardLayerProvider + useKeyboardLayer
```

---

## What's Been Built

### 1. Monorepo & Tooling
- Root `package.json` as a **Bun workspace** (`"workspaces": ["packages/*"]`).
- Shared `tsconfig.base.json` — strict mode, ESNext, bundler resolution.
- Single shared `node_modules` at root (avoids duplicate installs per package).
- Dev script: `bun run --watch packages/cli/src/index.tsx` (aliased as `dev:cli`).

---

### 2. Entry Point & Routing (`src/index.tsx`)
- Creates a `CliRenderer` at **60 fps** with `exitOnCtrlC: false` (handled manually).
- Sets up a `createMemoryRouter` with three routes:
  - `/` → `<Home />` — landing screen
  - `/sessions/new` → `<NewSession />` — new session initiated from home
  - `/sessions/:id` → `<Session />` — existing session (stub)
- Wraps the router in `<RouterProvider />` rendered into the TUI root.

---

### 3. Root Layout & Provider Tree (`layouts/root-layout.tsx`)
The full provider stack (outermost → innermost):

```
ThemeProvider
  ToastProvider
    KeyboardLayerProvider
      DialogProvider
        ThemedRoot        ← applies theme background color
          <Outlet />      ← screen content rendered here
```

---

### 4. Providers

#### `ThemeProvider` (`providers/themes/`)
- Reads/writes theme preference to `~/.buildmind/preferences.json`.
- Exposes `colors`, `currentTheme`, and `setTheme` via `useTheme()`.

#### `ToastProvider` (`providers/toast/`)
- `showToast({ message, variant, duration })` — displays a floating toast.
- Toast auto-dismisses after a configurable duration.
- Styled with left+right borders colored by variant (`info`, `success`, `error`).
- Positioned absolutely top-right, capped at 60 chars wide.

#### `DialogProvider` (`providers/dialog/`)
- `open(config)` / `close()` — shows a centered overlay modal.
- Pushes/pops a `"dialog"` keyboard layer so `Escape` closes it.
- Semi-transparent backdrop with click-outside-to-close support.

#### `KeyboardLayerProvider` (`providers/keyboard-layer/`)
- Maintains a **layer stack** (default: `["base"]`).
- `push(id)` / `pop(id)` — adds/removes layers.
- `isTopLayer(id)` — used to gate keyboard focus per layer.
- `setResponder(id, fn)` — registers a `Ctrl+C` responder per layer.
- Global `Ctrl+C` handler walks the stack and calls responders in order; falls back to `renderer.destroy()`.

---

### 5. Themes (`src/themes.ts`)
- `ThemeColors` type with 13 semantic color slots: `primary`, `surface`, `background`, `selection`, `error`, `success`, `info`, `planMode`, `thinking`, `dialogSurface`, `thinkingBorder`, `dimSeparator`.
- **32 built-in themes**: Nightfox (default), Catppuccin Mocha, Dracula, Monokai Pro, Tokyo Night, Nord, Synthwave, Midnight Sky, Neon Nights, Hacker Terminal, One Dark, Xcode Midnight, Catppuccin Frappe, Vercel Dark, Material Ocean, Dusk, Ocean, Soft Midnight, Minimal Dark, Solarized Dark, Gruvbox Dark, Rosé Pine, Rosé Pine Moon, Kanagawa, Everforest Dark, Ayu Dark, GitHub Dark, Palenight, Vesper, Poimandres, Moonlight, Vitesse Dark.

---

### 6. Screens

#### `<Home />` (`screens/home.tsx`)
- Centered layout with `<Header />` + `<InputBar />` (max-width 78).
- On submit → navigates to `/sessions/new` passing the message as router state.

#### `<NewSession />` (`screens/new-session.tsx`)
- Guards: redirects to `/` if no message in location state.
- Renders a `<SessionShell>` with sample `<UserMessage>`, `<BotMessage>`, and `<ErrorMessage>` (placeholder until AI is wired up).
- `inputDisabled` and `loading` flags active during "streaming" state.

#### `<Session />` (`screens/session.tsx`)
- Stub — renders `<SessionShell>` with `inputDisabled loading` (placeholder).

---

### 7. Components

#### `<Header />`
- ASCII art "BuildMind" via `<ascii-font font="tiny">` — "Build" in gray, "Mind" in theme primary.

#### `<InputBar />` (`components/inputbar.tsx`)
- Full-width textarea with neon left-border (theme `primary` color).
- **Submit logic**: reads textarea text, calls `onSubmit(text)`, clears the buffer.
- **Command menu integration**: typing `/` triggers the `<CommandMenu>` above the textarea.
- **Keyboard layer aware**: textarea only receives focus when `"base"` or `"command"` is the top layer.
- **Ctrl+C responder**: clears text if non-empty; otherwise falls through to exit.
- Uses `useRef<TextareaRenderable>` for imperative access (`plainText`, `setText`, `onSubmit`).
- Key bindings:
  - `Enter` / `Return` → **submit** (or execute selected command)
  - `Shift+Enter` / `Shift+Return` → **newline**

#### `<CommandMenu />` (`components/command-menu/`)
- Rendered as an absolute-positioned overlay above the textarea when active.
- Shows up to 8 commands at a time in a scrollable list.
- Columns: command name (fixed-width) + description.
- Mouse hover selects; mouse click executes.
- `use-commandmenu.ts` hook manages: query state, selected index, scroll sync, command resolution.
- Registered slash commands (10 total):

| Command | Description |
|---|---|
| `/new` | Start a new conversation |
| `/agents` | Switch between agents (coming soon) |
| `/models` | Select AI model (coming soon) |
| `/sessions` | Browse past sessions |
| `/theme` | Open theme picker dialog |
| `/login` | Open browser to sign in |
| `/logout` | Sign out |
| `/upgrade` | Open credits checkout |
| `/usage` | Open billing portal |
| `/exit` | Quit the application |

#### `<StatusBar />`
- Displays: `Build › opus-4-6` with dimmed separator.

#### `<SessionShell />` (`components/session-shell.tsx`)
- Full-height column layout: scrollable message area + InputBar + footer.
- `stickyScroll` with `stickyStart="bottom"` keeps view at the latest message.
- Footer shows spinner (while `loading`) and `tab agents` hint.

#### Message Components (`components/messages/`)
- `<UserMessage>` — left primary-color border, surface background.
- `<BotMessage>` — padded content with model label + primary color dot indicator.
- `<ErrorMessage>` — left error-color border, dimmed text.

#### `<Spinner />`
- Minimal animated loading indicator.

#### `<ThemeDialogContent />` (`components/dialogs/theme-dialog.tsx`)
- Rendered inside the Dialog when `/theme` command is run.
- Allows selecting from all 32 themes (persisted to disk).

---

## Bugs Fixed

### Textarea Width Resizing
- **Problem:** Textarea and its parent border-box had no explicit width, causing the entire input area to resize as the user typed.
- **Fix:** Added `width="100%"` to both the `<textarea>` element and the wrapping `<box border={["left"]}>` to anchor the full chain: outer box → border box → inner box → textarea.
- **Result:** Input area stays fixed-width regardless of content.

---

## Pending / Next Steps

- [ ] Wire up AI backend (Anthropic / Gemini SDK) in `<NewSession />` and `<Session />`.
- [ ] Stream AI responses into `<BotMessage>` in real time.
- [ ] Implement `/agents` command — agent selection UI.
- [ ] Implement `/models` command — model selection + update `<StatusBar />` dynamically.
- [ ] Implement `/sessions` command — list and resume past sessions.
- [ ] Implement `/new` command — actually navigate to a fresh session.
- [ ] Implement `/login` / `/logout` — auth flow.
- [ ] Fix `Enter`/`Return` key binding not firing in some terminal emulators.
- [ ] Persist sessions to disk (`~/.buildmind/sessions/`).
- [ ] Add plan mode UI (uses `colors.planMode` already defined in themes).
- [ ] Add thinking/streaming indicator (uses `colors.thinking` already defined).
