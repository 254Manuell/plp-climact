"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, AlertCircle, Loader2 } from "lucide-react"

interface RealtimeStatusProps {
  status: "connecting" | "connected" | "disconnected" | "error"
  lastUpdate?: string
}

export function RealtimeStatus({ status, lastUpdate }: RealtimeStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: <Wifi className="w-3 h-3" />,
          text: "Live",
          className: "bg-green-100 text-green-800 border-green-200",
        }
      case "connecting":
        return {
          icon: <Loader2 className="w-3 h-3 animate-spin" />,
          text: "Connecting",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        }
      case "disconnected":
        return {
          icon: <WifiOff className="w-3 h-3" />,
          text: "Offline",
          className: "bg-gray-100 text-gray-800 border-gray-200",
        }
      case "error":
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          text: "Error",
          className: "bg-red-100 text-red-800 border-red-200",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="flex items-center space-x-2">
      <Badge variant="outline" className={config.className}>
        {config.icon}
        <span className="ml-1">{config.text}</span>
      </Badge>
      {lastUpdate && status === "connected" && (
        <span className="text-xs text-gray-500">Updated {new Date(lastUpdate).toLocaleTimeString()}</span>
      )}
    </div>
  )
}
