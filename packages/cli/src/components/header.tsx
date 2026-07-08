import { Mode } from "@buildmind/database"
import { usePromptConfig } from "../providers/prompt-config"
import { useTheme } from "../providers/themes"

export function Header() {
    const { colors } = useTheme()
    const { mode } = usePromptConfig()
    return (
        <box justifyContent="center" alignItems="center">
            <box flexDirection="row" alignItems="center" justifyContent="center" gap={0.5}>
                <ascii-font font="tiny" text="Build" color={mode === Mode.BUILD ? colors.primary : colors.planMode}/>
                <ascii-font font="tiny" text="Mind"/>
            </box>
        </box>
    )
}