import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { createServer } from "http"
import { Server as SocketIOServer } from "socket.io"

// Import routes
import { menuRoutes } from "./routes/menu"
import { orderRoutes } from "./routes/orders"
import { tableRoutes } from "./routes/tables"
import { paymentRoutes } from "./routes/payments"

// Import socket handlers
import { setupSocketHandlers } from "./socket/handlers"

const app = express()
const server = createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
})

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    credentials: true,
  }),
)
app.use(morgan("combined"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/menu", menuRoutes)
app.use("/api/orders", orderRoutes(io))
app.use("/api/tables", tableRoutes)
app.use("/api/payments", paymentRoutes(io))

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Setup Socket.IO handlers
setupSocketHandlers(io)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`)
  console.log(`📡 Socket.IO server ready`)
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
})

export { io }
