import { useTheme } from "../providers/themes"

export function Header() {
    const { colors } = useTheme()
    return (
        <box justifyContent="center" alignItems="center">
            <box flexDirection="row" alignItems="center" justifyContent="center" gap={0.5}>
                <ascii-font font="tiny" text="Build" color={colors.primary}/>
                <ascii-font font="tiny" text="Mind"/>
            </box>
        </box>
    )
}