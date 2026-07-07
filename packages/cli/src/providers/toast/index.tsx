import { 
  createContext, 
  useContext, 
  useRef, 
  useState, 
  useCallback,
  useMemo
} from "react"
import type { ReactNode } from "react"
import { useTerminalDimensions } from "@opentui/react"
import type { ToastOptions, ToastVariant } from "./toast-types"
import { DEFAULT_DURATION } from "./toast-types"
import { useTheme } from "../themes"

export type ToastContextValue = {
    showToast: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = (): ToastContextValue => {
    const value = useContext(ToastContext)
    if (!value) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return value
}

type ToastProviderProps = {
    children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toast, setToast] = useState<ToastOptions | null>(null)
    const timeoutHandleRef = useRef<NodeJS.Timeout | null>(null)

    const clearCurrentTimeout = useCallback(() => {
        if (timeoutHandleRef.current) {
            clearTimeout(timeoutHandleRef.current)
            timeoutHandleRef.current = null
        }  
    }, [])

    const showToast = useCallback((options: ToastOptions) => {
        clearCurrentTimeout()
        const duration = options.duration ?? DEFAULT_DURATION
        setToast({
            variant: options.variant ?? "info",
            ...options,
            duration,
        })
        timeoutHandleRef.current = setTimeout(() => {
            setToast(null)
        }, duration).unref()

    }, [clearCurrentTimeout])

    const value = useMemo(() => ({showToast}), [showToast])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toast currentToast={toast} />
        </ToastContext.Provider>
    )
}

type ToastProps = {
  currentToast: ToastOptions | null;
};

function Toast({ currentToast }: ToastProps) {
  const { width } = useTerminalDimensions();
  const { colors } = useTheme()

  if (!currentToast) {
    return null;
  }

  const variantColors: Record<ToastVariant, string> = {
    success: colors.success,
    error: colors.error,
    info: colors.info,
  };

  const borderColor = currentToast.variant
    ? variantColors[currentToast.variant]
    : variantColors.info;

  return (
    <box
      position="absolute"
      justifyContent="center"
      alignItems="flex-start"
      top={2}
      right={2}
      width={Math.max(1, Math.min(60, width - 6))}
      paddingLeft={2}
      paddingRight={2}
      paddingTop={1}
      paddingBottom={1}
      backgroundColor={colors.surface}
      borderColor={borderColor}
      border={["left", "right"]}
    >
      <box flexDirection="column" gap={1} width="100%">
        <text fg="#E1E1E1" wrapMode="word" width="100%">
          {currentToast.message}
        </text>
      </box>
    </box>
  );
};