import { io, type Socket } from "socket.io-client"
import type { SocketEvents } from "../../shared/types"

export class SocketClient {
  private socket: Socket | null = null
  private url: string

  constructor(url: string) {
    this.url = url
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(this.url, {
        transports: ["websocket"],
        autoConnect: true,
      })

      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket?.id)
        resolve()
      })

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error)
        reject(error)
      })
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  emit<K extends keyof SocketEvents>(event: K, data: SocketEvents[K]): void {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  on<K extends keyof SocketEvents>(event: K, callback: (data: SocketEvents[K]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off<K extends keyof SocketEvents>(event: K): void {
    if (this.socket) {
      this.socket.off(event)
    }
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false
  }
}

export const createSocketClient = (url: string) => new SocketClient(url)
