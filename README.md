<p align="center">
  <h1 align="center">BuildMind</h1>
  <p align="center">
    A terminal-based AI coding assistant with a rich TUI — built with Bun, React, and OpenTUI.
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#usage">Usage</a> •
    <a href="#roadmap">Roadmap</a>
  </p>
</p>

---

## Overview

**BuildMind** is a terminal-native AI coding assistant that brings a full chat experience to your terminal. It renders a pixel-perfect TUI (Terminal UI) powered by React components through [OpenTUI](https://opentui.dev), complete with client-side routing, theming, dialogs, toasts, and streaming AI responses — all at 60 fps.

Think of it as a terminal-first alternative to AI coding assistants, with the aesthetics and interactivity of a modern GUI app.

## Features

- 🤖 **Multi-Model AI Chat** — Talk to Claude, GPT, and Gemini models with real-time streaming responses via SSE
- 🎨 **32 Built-in Themes** — From Nightfox to Catppuccin, Dracula to Rosé Pine — switch instantly with `/theme`
- ⌨️ **Slash Commands** — 10 built-in commands (`/new`, `/theme`, `/models`, `/sessions`, `/exit`, and more) with fuzzy search
- 💬 **Session Management** — Create, resume, and browse past chat sessions backed by PostgreSQL
- 🔐 **Authentication** — Clerk-based auth with `/login` and `/logout` commands
- 💳 **Billing Integration** — Polar-powered credit system with `/upgrade` and `/usage` commands
- 🖥️ **60 fps Rendering** — Smooth, responsive TUI powered by OpenTUI's React renderer
- 🧱 **Monorepo Architecture** — Clean separation of CLI, server, database, and shared packages

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | [Bun](https://bun.sh) |
| **TUI Framework** | [@opentui/core](https://opentui.dev) + @opentui/react |
| **Routing** | react-router (memory router) |
| **UI Components** | React 19 + JSX |
| **Server** | [Hono](https://hono.dev) |
| **AI SDK** | [Vercel AI SDK](https://sdk.vercel.ai) (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/google`) |
| **Database** | PostgreSQL + [Prisma](https://prisma.io) (with `@prisma/adapter-pg`) |
| **Auth** | [Clerk](https://clerk.com) (`@clerk/backend`) |
| **Billing** | [Polar](https://polar.sh) (`@polar-sh/sdk`) |
| **Validation** | [Zod](https://zod.dev) v4 |
| **Language** | TypeScript (strict mode) |

## Architecture

BuildMind is organized as a **Bun monorepo** with four packages:

```
BuildMind/
├── package.json                # Root Bun workspace
├── tsconfig.base.json          # Shared TypeScript config (strict, ESNext)
└── packages/
    ├── cli/                    # @buildmind/cli — Terminal UI application
    ├── server/                 # @buildmind/server — Hono API server
    ├── database/               # @buildmind/database — Prisma + PostgreSQL
    └── shared/                 # @buildmind/shared — Shared schemas & model definitions
```

### `@buildmind/cli`

The terminal UI application. Renders a full interactive chat interface at 60 fps using React components via OpenTUI.

- **Entry** — Memory router with three routes: Home (`/`), New Session (`/sessions/new`), Session (`/sessions/:id`)
- **Provider Tree** — `ThemeProvider → ToastProvider → KeyboardLayerProvider → DialogProvider → ThemedRoot → <Outlet />`
- **Components** — InputBar with command menu, message bubbles (user/bot/error), session shell with sticky scroll, ASCII header, status bar, spinner, and theme dialog
- **Keyboard Layer System** — Stack-based keyboard focus management with `Ctrl+C` responders per layer

### `@buildmind/server`

A Hono-based HTTP server exposing REST + SSE endpoints.

| Route | Description |
|-------|-------------|
| `POST /chat/:sessionId` | Submit a message and stream AI response via SSE |
| `POST /chat/:sessionId/resume` | Resume an interrupted stream |
| `GET/POST /sessions/*` | Session CRUD (auth-protected) |
| `/auth/*` | Authentication endpoints |
| `/billing/*` | Credit checkout & billing portal |

- Auth middleware via Clerk on protected routes
- Credit-based usage gating
- Vercel AI SDK `streamText` with support for Anthropic, OpenAI, and Google models
- Abortable streams with `AbortController`

### `@buildmind/database`

Prisma-based data layer with PostgreSQL.

```prisma
model Session {
  id        String   @id @default(cuid())
  userId    String
  title     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  messages  Json     @default("[]")
  @@index([userId])
}
```

### `@buildmind/shared`

Shared type definitions, Zod schemas, and model configuration used by both CLI and server.

**Supported Models:**

| Provider | Models |
|----------|--------|
| Anthropic | `claude-sonnet-4-6`, `claude-haiku-4-5`, `claude-opus-4-6` |
| OpenAI | `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.4-nano` |
| Google | `gemini-3.1-pro-preview`, `gemini-3.5-flash`, `gemini-3.1-flash-lite` |

**SSE Event Types:** `text-delta`, `reasoning-delta`, `tool-call`, `tool-result`, `done`, `error`

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- [PostgreSQL](https://postgresql.org) database
- API keys for at least one AI provider (Anthropic, OpenAI, or Google)

### Installation

```bash
# Clone the repository
git clone https://github.com/Omkar-kamble82/BuildMind.git
cd BuildMind

# Install dependencies
bun install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=

# AI Providers (at least one required)
GOOGLE_GENERATIVE_AI_API_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Authentication (Clerk)
CLERK_OAUTH_CLIENT_SECRET=
CLERK_OAUTH_CLIENT_ID=
JWT_SECRET=
CLERK_FRONTEND_API=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Billing (Polar)
POLAR_ACCESS_TOKEN=
POLAR_PRODUCT_ID=
POLAR_SERVER=
POLAR_CREDITS_METER_ID=
```

### Database Setup

```bash
# Generate Prisma client
cd packages/database
bunx prisma generate

# Run migrations
bunx prisma migrate dev
```

### Running

```bash
# Start the API server (port 3000, hot reload)
bun run dev:server

# Start the CLI (separate terminal, watch mode)
bun run dev:cli
```

## Usage

### Slash Commands

Type `/` in the input bar to open the command menu with fuzzy search:

| Command | Description |
|---------|-------------|
| `/new` | Start a new conversation |
| `/agents` | Switch between agents |
| `/models` | Select AI model |
| `/sessions` | Browse past sessions |
| `/theme` | Open theme picker (32 themes) |
| `/login` | Sign in via browser |
| `/logout` | Sign out |
| `/upgrade` | Open credits checkout |
| `/usage` | Open billing portal |
| `/exit` | Quit the application |

### Key Bindings

| Key | Action |
|-----|--------|
| `Enter` | Submit message / execute command |
| `Shift+Enter` | Insert newline |
| `Ctrl+C` | Clear input (if text present) / exit (if empty) |
| `Escape` | Close dialog / dismiss command menu |

### Theming

BuildMind ships with **32 themes** including Nightfox (default), Catppuccin Mocha, Dracula, Monokai Pro, Tokyo Night, Nord, Synthwave, Gruvbox Dark, Rosé Pine, and many more. Theme preference is persisted to `~/.buildmind/preferences.json`.

## Roadmap

- [ ] Real-time AI streaming in session views
- [ ] Agent selection UI (`/agents` command)
- [ ] Dynamic model switching with StatusBar updates
- [ ] Session browser (`/sessions` command)
- [ ] Plan mode UI with dedicated theme colors
- [ ] Thinking/streaming visual indicators
- [ ] Environment variable validation on server startup
- [ ] Session persistence to `~/.buildmind/sessions/`

## Project Structure

<details>
<summary>Full file tree</summary>

```
BuildMind/
├── package.json
├── tsconfig.base.json
├── bun.lock
└── packages/
    ├── cli/
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── src/
    │       ├── index.tsx                     # App entry — router + renderer
    │       ├── themes.ts                     # 32 theme definitions
    │       ├── layouts/
    │       │   ├── root-layout.tsx           # Provider tree wrapper
    │       │   └── root-theme.tsx            # Theme background
    │       ├── screens/
    │       │   ├── home.tsx                  # Landing screen
    │       │   ├── new-session.tsx           # New session view
    │       │   └── session.tsx               # Ongoing session
    │       ├── components/
    │       │   ├── header.tsx                # ASCII logo
    │       │   ├── inputbar.tsx              # Text input + commands
    │       │   ├── statusbar.tsx             # Active model display
    │       │   ├── session-shell.tsx          # Chat layout
    │       │   ├── spinner.tsx               # Loading indicator
    │       │   ├── dialog-search-list.tsx
    │       │   ├── command-menu/             # Slash command system
    │       │   ├── messages/                 # Message bubble components
    │       │   └── dialogs/                  # Modal dialogs
    │       └── providers/
    │           ├── themes/                   # Theme context
    │           ├── toast/                    # Toast notifications
    │           ├── dialog/                   # Modal dialog system
    │           └── keyboard-layer/           # Keyboard focus management
    ├── server/
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── src/
    │       ├── index.ts                      # Hono app entry
    │       ├── system-prompt.ts              # AI system prompt
    │       ├── routes/
    │       │   ├── chat.ts                   # AI chat streaming (SSE)
    │       │   ├── sessions.ts               # Session CRUD
    │       │   ├── auth.ts                   # Authentication
    │       │   └── billing.ts                # Credits & billing
    │       ├── lib/
    │       │   ├── models.ts                 # AI model resolution
    │       │   ├── auth.ts                   # Auth utilities
    │       │   ├── credits.ts                # Credit management
    │       │   └── polar.ts                  # Polar SDK wrapper
    │       └── middleware/
    │           ├── requireauth.ts            # Auth middleware
    │           └── requirecredits.ts         # Credit check middleware
    ├── database/
    │   ├── package.json
    │   ├── prisma.config.ts
    │   ├── prisma/
    │   │   └── schema.prisma                 # Database schema
    │   └── src/
    └── shared/
        └── src/
            ├── index.ts                      # Re-exports
            ├── schemas.ts                    # Zod schemas (SSE events, messages)
            └── models.ts                     # Supported AI model definitions
```

</details>
