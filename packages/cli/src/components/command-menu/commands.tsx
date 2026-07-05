import { ThemeDialogContent } from "../dialogs"
import type { Command } from "./command-types"

export const COMMANDS: Command[] = [
    {
        name: "new",
        description: "Starts a new conversation",
        value: "/new",
        action: (ctx) => {
            ctx.toast.showToast({message: "Starting new converstion..."})
        }
    },
    {
        name: "agents",
        description: "Switch between agents",
        value: "/agents",
        action: (ctx) => {
            ctx.dialog.open({
                title: "Select Mode",
                children: <text>Agent selection coming soon...</text>
            })
        }
    },
    {
        name: "models",
        description: "Select AI model for generation",
        value: "/models",
        action: (ctx) => {
            ctx.dialog.open({
                title: "Select Mode",
                children: <text>Model selection coming soon...</text>
            })
        }
    },
    {
        name: "sessions",
        description: "Browse past sessions",
        value: "/sessions",
        action: (ctx) => {
            ctx.toast.showToast({message: "loading sessions..."})
        }
    },
    {
        name: "theme",
        description: "Change color theme",
        value: "/theme",
        action: (ctx) => {
            ctx.dialog.open({
                title: "Select Theme",
                children: <ThemeDialogContent/>
            })
        }
    },
    {
        name: "login",
        description: "Log in to the account",
        value: "/login",
        action: (ctx) => {
            ctx.toast.showToast({message: "Opening browser to sign in..."})
        }
    },
    {
        name: "logout",
        description: "Log out of the account",
        value: "/logout",
        action: (ctx) => {
            ctx.toast.showToast({variant: "success", message: "Signed out"})
        }
    },
    {
        name: "upgrade",
        description: "Buy more credits",
        value: "/upgrade",
        action: (ctx) => {
            ctx.toast.showToast({message: "Opening credits checkout..."})
        }
    },
    {
        name: "usage",
        description: "Open billing and usage information in browser",
        value: "/usage",
        action: (ctx) => {
            ctx.toast.showToast({message: "Opening billing portal..."})
        }
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