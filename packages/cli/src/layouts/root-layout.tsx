import { Outlet } from "react-router"
import { ToastProvider } from "../providers/toast"
import { DialogProvider } from "../providers/dialog"
import { KeyboardLayerProvider } from "../providers/keyboard-layer"
import { ThemeProvider } from "../providers/themes"
import { ThemedRoot } from "./root-theme"


export function Rootlayout() {
    return (
    <ThemeProvider>
      <ToastProvider>
        <KeyboardLayerProvider>
          <DialogProvider>
                <ThemedRoot>
                    <Outlet/>
                </ThemedRoot>
          </DialogProvider>
        </KeyboardLayerProvider>
      </ToastProvider>
    </ThemeProvider>
    )
}