"use client"

import { io, Socket } from "socket.io-client"

export class SocketIOManager {
  private socket: Socket | null = null
  private listeners: Map<string, Function[]> = new Map()

  constructor(private url: string) {}

  connect() {
    this.socket = io(this.url, { transports: ["websocket"] })

    this.socket.on("connect", () => {
      console.log("Socket.IO connected")
      this.emit("connected", null)
    })

    this.socket.on("disconnect", () => {
      console.log("Socket.IO disconnected")
      this.emit("disconnected", null)
    })

    this.socket.on("connect_error", (error) => {
      console.error("Socket.IO error:", error)
      this.emit("error", error)
    })

    // Listen for pollution_update events
    this.socket.on("pollution_update", (data) => {
      this.emit("pollution_update", data.payload)
    })

    // Add more event listeners as needed
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data))
    }
  }

  send(data: any) {
    if (this.socket) {
      this.socket.emit("message", data)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

// Singleton instance
let socketManager: SocketIOManager | null = null

export const getWebSocketManager = () => {
  if (!socketManager) {
    // Use the Flask-SocketIO server URL
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080"
    socketManager = new SocketIOManager(wsUrl)
  }
  return socketManager
}
