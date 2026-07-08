import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"

import sessions from "./routes/sessions"
import chat from "./routes/chat"
import auth from "./routes/auth"
import { requireAuth } from "./middleware/requireauth"

const app = new Hono()


app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ 
      error: error.message || "Request failed",
    }, error.status)
  }

  console.error("Unhandled server error", error)
  return c.json({ error: "Internal server error" }, 500)
})

app.use("/sessions/*", requireAuth)
app.use("/chat/*", requireAuth)

const routes = app.route("/sessions", sessions).route("/chat", chat).route("/auth", auth)

export type AppType = typeof routes

export default { port: 3000, fetch: app.fetch, idleTimeout: 255 }