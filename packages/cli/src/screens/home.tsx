import { Header } from "../components/header"
import { InputBar } from "../components/inputbar"
import { useCallback } from "react"
import { useNavigate } from "react-router"

export function Home() {
    const navigate = useNavigate()

    const handleSubmit = useCallback((text: string) => {
        navigate("/sessions/new", {state: {message: text}})
    }, [navigate])

    return (
        <box alignItems="center" justifyContent="center" width="100%" height="100%" gap={2} position="relative" flexGrow={1}>
            <Header />
            <box width="100%" maxWidth={78} paddingX={2}>
                <InputBar onSubmit={handleSubmit} />
            </box>
        </box>
    )
}