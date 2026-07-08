import { SUPPORTED_CHAT_MODELS } from "@buildmind/shared"
import { AgentsDialogContent, ModelsDialogContent, SessionsDialogContent, ThemeDialogContent } from "../dialogs"
import type { Command } from "./command-types"
import { performLogin } from "../../lib/oauth"
import { clearAuth } from "../../lib/auth"

export const COMMANDS: Command[] = [
    {
        name: "new",
        description: "Starts a new conversation",
        value: "/new",
        action: (ctx) => {
            ctx.navigate("/")
        }
    },
    {
        name: "agents",
        description: "Switch between agents",
        value: "/agents",
        action: (ctx) => {
            ctx.dialog.open({
                title: "Select Agent",
                children: <AgentsDialogContent currentMode={ctx.mode} onSelectMode={ctx.setMode}/>
            })
        }
    },
    {
        name: "models",
        description: "Select AI model for generation",
        value: "/models",
        action: (ctx) => {
            ctx.dialog.open({
                title: "Select Model",
                children: <ModelsDialogContent models={SUPPORTED_CHAT_MODELS.map((model) => model.id)} onSelectModel={ctx.setModel}/>
            })
        }
    },
    {
        name: "sessions",
        description: "Browse past sessions",
        value: "/sessions",
        action: (ctx) => {
            ctx.dialog.open({
                title: "Sessions",
                children: <SessionsDialogContent />
            })
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
        action: async (ctx) => {
            ctx.toast.showToast({message: "Opening browser to sign in..."})
            try {
                await performLogin()
                ctx.toast.showToast({ variant: "success", message: "Signed in" })
            } catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : "Sign in Failed"
                ctx.toast.showToast({ variant: "error", message })
            }
        }
    },
    {
        name: "logout",
        description: "Log out of the account",
        value: "/logout",
        action: async (ctx) => {
            clearAuth()
            ctx.toast.showToast({ variant: "success", message: "Signed out successfully"})
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