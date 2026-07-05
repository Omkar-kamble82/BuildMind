import type { RefObject } from "react"
import { TextAttributes, type ScrollBoxRenderable } from "@opentui/core"
import { filterCommands } from "./filter-commands"
import { COMMANDS } from "./commands"
import { useTheme } from "../../providers/themes"

const MAX_COMMANDS_VISIBLE = 8

const COMMAND_COL_WIDTH = Math.max(...COMMANDS.map((cmd) => cmd.name.length)) + 4

type CommandMenuProps = {
  query: string
  selectedIndex: number
  scrollRef: RefObject<ScrollBoxRenderable | null>
  onSelect: (index: number) => void
  onExecute: (index: number) => void
};

export function CommandMenu({ query, selectedIndex, scrollRef, onSelect, onExecute }: CommandMenuProps) {
    const { colors } = useTheme()
    const filteredCommands = filterCommands(query)
    const visibleHeight = Math.min(filteredCommands.length, MAX_COMMANDS_VISIBLE)

    if (filteredCommands.length === 0) {
    return (
      <box paddingX={1}>
        <text attributes={TextAttributes.DIM}>
          No matching command
        </text>
      </box>
    )
  }

  return (
    <scrollbox ref={scrollRef} height={visibleHeight}>
      {filteredCommands.map((cmd, i) => {
        const isSelected = i === selectedIndex;

        return (
          <box
            key={cmd.value}
            flexDirection="row"
            paddingX={1}
            height={1}
            overflow="hidden"
            backgroundColor={isSelected ? colors.selection : undefined}
            onMouseMove={() => onSelect(i)}
            onMouseDown={() => onExecute(i)}
          >
            <box width={COMMAND_COL_WIDTH} flexShrink={0}>
              <text selectable={false} fg={isSelected ? "black" : "white"}>
                /{cmd.name}
              </text>
            </box>
            <box flexGrow={1} flexShrink={1} overflow="hidden">
              <text selectable={false} fg={isSelected ? "black" : "gray"}>
                {cmd.description}
              </text>
            </box>
          </box>
        )
      })}
    </scrollbox>
  )
}