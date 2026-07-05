import "opentui-spinner/react"
import { useTheme } from "../providers/themes"

export function Spinner() {
    const { colors } = useTheme()

    return <spinner name="aesthetic" color={colors.primary}/>
}