import type { Command } from "./command-types"

export const COMMANDS: Command[] = [
    {
        name: "new",
        description: "Starts a new conversation",
        value: "/new",
    },
    {
        name: "agents",
        description: "Switch between agents",
        value: "/agents",
    },
    {
        name: "models",
        description: "Select AI model for generation",
        value: "/models",
    },
    {
        name: "sessions",
        description: "Browse past sessions",
        value: "/sessions",
    },
    {
        name: "theme",
        description: "Change color theme",
        value: "/theme",
    },
    {
        name: "login",
        description: "Log in to the account",
        value: "/login",
    },
    {
        name: "logout",
        description: "Log out of the account",
        value: "/logout",
    },
    {
        name: "upgrade",
        description: "Buy more credits",
        value: "/upgrade",
    },
    {
        name: "usage",
        description: "Open billing and usage information in browser",
        value: "/usage",
    },
    {
        name: "exit",
        description: "Quit the application",
        value: "/exit",
        action: (ctx) => {
            ctx.exit()
        }
    }
]