import type { KeyBinding } from "@opentui/core"
import { StatusBar } from "./statusbar" 
import { CommandMenu } from "./command-menu"
import { useRef, useCallback, useEffect } from "react"
import type { TextareaRenderable } from "@opentui/core"
import { useRenderer } from "@opentui/react"
import type { Command } from "./command-menu/command-types"
import { useCommandMenu } from "./command-menu/use-commandmenu"

type props = {
    onSubmit: (text: string) => void
    disabled?: boolean
}

export const INPUTBAR_KEY_BINDINGS: KeyBinding[] = [
    { name: "return", action: "submit" },
    { name: "enter", action: "submit" },
    { name: "return", shift: true, action: "newline" },
    { name: "enter", shift: true, action: "newline" },
]

export function InputBar({ onSubmit, disabled = false }: props) {

    const textareaRef = useRef<TextareaRenderable>(null)
    const onSubmitRef = useRef<() => void>(() => {})
    const renderer = useRenderer()

    const { showCommandMenu, commandQuery, selectedIndex, scrollRef, handleContentChange, resolveCommand, setSelectedIndex } = useCommandMenu()

    const handleCommandExecute = useCallback((index: number) => {
        const command = resolveCommand(index)
        handleCommand(command)
    }, [])

    const handleTextareaContentChange = useCallback(() => {
        const textarea = textareaRef.current
        if (!textarea) return
        const text = textarea.plainText
        handleContentChange(text)
    }, [])

    const handleSubmit = useCallback(() => {
        if (disabled) return
        const textarea = textareaRef.current
        if (!textarea) return
        const text = textarea.plainText.trim()
        if (text.length === 0) return
        onSubmit(text)
        textarea.setText("")

    }, [disabled, onSubmit])

    const handleCommand = useCallback((command: Command | undefined) => {
        const textarea = textareaRef.current
        if (!textarea || !command) return;
        textarea.setText("")
        if (command.action) {
            command.action({
                exit: () => renderer.destroy()
            })
        } else {
            textarea.insertText(command.value + " ")
        }
    }, [renderer])

    useEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return

        textarea.onSubmit = () => {
            onSubmitRef.current()
        }
    }, [])

    onSubmitRef.current = () => {
        if (disabled) return

        if (showCommandMenu) {
            const command = resolveCommand(selectedIndex)
            handleCommand(command)
            return
        }
        handleSubmit()
    }

    return (
        <box width="100%" alignItems="center">
            <box border={["left"]} borderColor="#39FF14" width="100%">
                <box
                    position="relative"
                    justifyContent="center"
                    paddingX={2}
                    paddingY={1}
                    backgroundColor="#1a1a1a"
                    width="100%"
                    gap={1}
                >
                    {showCommandMenu && (
                        <box
                            position="absolute"
                            bottom="100%"
                            left={0}
                            width="100%"
                            backgroundColor="#1a1a1a"
                            zIndex={10}
                        >
                            <CommandMenu 
                                query={commandQuery}
                                selectedIndex={selectedIndex}
                                scrollRef={scrollRef}
                                onSelect={setSelectedIndex}
                                onExecute={handleCommandExecute}
                            />
                        </box>
                    )}
                    <textarea
                        width="100%"
                        focused={!disabled}
                        keyBindings={INPUTBAR_KEY_BINDINGS}
                        onContentChange={handleTextareaContentChange}
                        ref={textareaRef}
                        placeholder={`Ask anything... "Fix this code" or "Explain this code"`}
                    />
                    <StatusBar />
                </box>
            </box>
        </box>
    )
}