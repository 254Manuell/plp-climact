"use client"

import { useState, useEffect, useCallback } from "react"
import { getWebSocketManager } from "@/lib/websocket"

export interface PollutionData {
  timestamp: string
  location: string
  pm25: number
  no2: number
  co: number
  aqi: number
  status: "Good" | "Moderate" | "Unhealthy" | "Hazardous"
  indoor?: {
    pm25: number
    no2: number
  }
  outdoor?: {
    pm25: number
    no2: number
  }
}

export interface LocationData {
  id: string
  name: string
  coordinates: [number, number]
  currentReading: PollutionData
  trend: "up" | "down" | "stable"
}

export const useRealtimeData = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [currentData, setCurrentData] = useState<PollutionData | null>(null)
  const [locations, setLocations] = useState<LocationData[]>([])
  const [historicalData, setHistoricalData] = useState<PollutionData[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">(
    "disconnected",
  )

  const wsManager = getWebSocketManager()

  useEffect(() => {
    setConnectionStatus("connecting")

    const handleConnected = () => {
      setIsConnected(true)
      setConnectionStatus("connected")
      // Request initial data
      wsManager.send({ type: "request_initial_data" })
    }

    const handleDisconnected = () => {
      setIsConnected(false)
      setConnectionStatus("disconnected")
    }

    const handleError = () => {
      setConnectionStatus("error")
    }

    const handlePollutionUpdate = (data: PollutionData) => {
      setCurrentData(data)
      // Add to historical data (keep last 100 readings)
      setHistoricalData((prev) => {
        const updated = [...prev, data]
        return updated.slice(-100)
      })
    }

    const handleLocationUpdate = (data: LocationData[]) => {
      setLocations(data)
    }

    const handleHistoricalData = (data: PollutionData[]) => {
      setHistoricalData(data)
    }

    // Set up event listeners
    wsManager.on("connected", handleConnected)
    wsManager.on("disconnected", handleDisconnected)
    wsManager.on("error", handleError)
    wsManager.on("pollution_update", handlePollutionUpdate)
    wsManager.on("location_update", handleLocationUpdate)
    wsManager.on("historical_data", handleHistoricalData)

    // Connect
    wsManager.connect()

    // Cleanup
    return () => {
      wsManager.off("connected", handleConnected)
      wsManager.off("disconnected", handleDisconnected)
      wsManager.off("error", handleError)
      wsManager.off("pollution_update", handlePollutionUpdate)
      wsManager.off("location_update", handleLocationUpdate)
      wsManager.off("historical_data", handleHistoricalData)
    }
  }, [])

  const requestLocationData = useCallback((locationId: string) => {
    wsManager.send({
      type: "request_location_data",
      payload: { locationId },
    })
  }, [])

  const requestHistoricalData = useCallback((startDate: string, endDate: string) => {
    wsManager.send({
      type: "request_historical_data",
      payload: { startDate, endDate },
    })
  }, [])

  return {
    isConnected,
    connectionStatus,
    currentData,
    locations,
    historicalData,
    requestLocationData,
    requestHistoricalData,
  }
}
