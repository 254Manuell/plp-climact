"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RealtimeStatus } from "@/components/realtime-status"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import { Leaf, Bell, Settings, User, BarChart3, MapPin, Clock, TrendingUp, TrendingDown, Sparkles, Cloud, Wind, Sun } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { Tooltip } from "react-leaflet"
import L from "leaflet"

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false })


export default function DashboardPage() {
  const { isConnected, connectionStatus, currentData, locations, historicalData } = useRealtimeData()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [liveIcon, setLiveIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    const icon = new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconSize: [30, 48],
      iconAnchor: [15, 48],
      popupAnchor: [0, -48],
      className: "live-marker-icon"
    });
    setLiveIcon(icon);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Only render real-time content when data is available
  if (!currentData) {
    return <div>Loading real-time data...</div>
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "good":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "unhealthy":
        return "bg-orange-100 text-orange-800"
      case "hazardous":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  // Use real-time data or fallback to mock data
  const displayData = currentData || {
    pm25: 65,
    no2: 45,
    co: 79,
    aqi: 55,
    status: "Moderate" as const,
    indoor: { pm25: 244, no2: 244 },
    outdoor: { pm25: 244, no2: 244 },
    location: "Nairobi",
    timestamp: new Date().toISOString(),
  }

  const displayLocations =
    locations.length > 0
      ? locations
      : [
          {
            id: "1",
            name: "BUS STATION",
            coordinates: [-1.2921, 36.8219] as [number, number],
            currentReading: {
              pm25: 149,
              no2: 45,
              co: 79,
              aqi: 149,
              status: "Hazardous" as const,
              location: "Bus Station",
              timestamp: new Date().toISOString(),
            },
            trend: "up" as const,
          },
          {
            id: "2",
            name: "MOI AVENUE",
            coordinates: [-1.2841, 36.8155] as [number, number],
            currentReading: {
              pm25: 149,
              no2: 45,
              co: 79,
              aqi: 149,
              status: "Hazardous" as const,
              location: "Moi Avenue",
              timestamp: new Date().toISOString(),
            },
            trend: "stable" as const,
          },
        ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="w-8 h-8 text-green-500" />
              <span className="text-xl font-bold text-gray-800">ClimAct</span>
            </Link>
            <div className="text-2xl font-bold text-gray-800">Climate Management Dashboard</div>
          </div>
          <div className="flex items-center space-x-4">
            <RealtimeStatus status={connectionStatus} lastUpdate={currentData?.timestamp} />
            <Bell className="w-5 h-5 text-gray-400" />
            <Settings className="w-5 h-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <div className="text-sm">
                <div className="font-medium">Emmanuel Ngunnzi</div>
                <div className="text-gray-500">UID: 112A4B</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Current: {formatTime(currentTime)}</span>
            </div>
            <div>Today's Average</div>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-100 to-green-50 shadow-lg">
            <CardContent className="p-6 flex flex-col items-center">
              <Sparkles className="w-10 h-10 text-green-500 animate-bounce mb-2" />
              <div className="text-3xl font-bold text-gray-900">{formatTime(currentTime)}</div>
              <div className="text-sm text-gray-600 mt-1">Current Time</div>
              <div className="text-xs text-green-600 mt-2">UP TO Today's Average</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-100 to-yellow-50 shadow-lg">
            <CardContent className="p-6 flex flex-col items-center">
              <Cloud className="w-10 h-10 text-orange-500 animate-pulse mb-2" />
              <div className="text-3xl font-bold text-orange-600">{displayData.pm25}</div>
              <div className="text-sm text-gray-600 mt-1">PM2.5 Level</div>
              <Badge className={getStatusColor(displayData.status) + " animate-fade-in"}>{displayData.status}</Badge>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-100 to-cyan-50 shadow-lg">
            <CardContent className="p-6 flex flex-col items-center">
              <Wind className="w-10 h-10 text-blue-500 animate-spin-slow mb-2" />
              <div className="text-3xl font-bold text-blue-600">{displayData.no2}</div>
              <div className="text-sm text-gray-600 mt-1">NO2 Level</div>
              <div className="text-xs text-green-600 mt-2">µg/m³</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-100 to-pink-50 shadow-lg">
            <CardContent className="p-6 flex flex-col items-center">
              <Sun className="w-10 h-10 text-purple-500 animate-pulse mb-2" />
              <div className="text-3xl font-bold text-purple-600">{displayData.aqi}</div>
              <div className="text-sm text-gray-600 mt-1">AQI</div>
              <div className="text-xs text-green-600 mt-2">Air Quality Index</div>
            </CardContent>
          </Card>
        </div>

        {/* Map Legend */}
        <div className="flex items-center gap-4 mb-4">
          <span className="font-semibold text-gray-700">Legend:</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 bg-green-400 rounded-full inline-block"></span> Good</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 bg-yellow-400 rounded-full inline-block"></span> Moderate</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 bg-orange-400 rounded-full inline-block"></span> Unhealthy</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 bg-red-500 rounded-full inline-block"></span> Hazardous</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Indoor/Outdoor Readings */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Indoor Readings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">PM2.5</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{displayData.indoor?.pm25 || 244}</div>
                    <div className="text-xs text-gray-500">µg/m³</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">NO2</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{displayData.indoor?.no2 || 244}</div>
                    <div className="text-xs text-gray-500">µg/m³</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Outdoor Readings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">PM2.5</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{displayData.outdoor?.pm25 || 244}</div>
                    <div className="text-xs text-gray-500">µg/m³</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">NO2</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{displayData.outdoor?.no2 || 244}</div>
                    <div className="text-xs text-gray-500">µg/m³</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Live Visualization Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Real-time Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Real-time Pollution Levels</CardTitle>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>NO2</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>PM 2.5</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end space-x-1">
                  {historicalData.slice(-24).map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                      <div className="w-full flex flex-col space-y-1">
                        <div
                          className="bg-purple-500 rounded-t"
                          style={{ height: `${Math.min((data.pm25 / 200) * 120, 120)}px` }}
                        ></div>
                        <div
                          className="bg-blue-500 rounded-b"
                          style={{ height: `${Math.min((data.no2 / 200) * 120, 120)}px` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold">
                    {displayData.pm25} <span className="text-sm font-normal">µg/m³</span>
                  </div>
                  <div className="text-sm text-gray-600">Current PM 2.5</div>
                </div>
              </CardContent>
            </Card>

            {/* Live Visualization Map with Dynamic Locations and Real-Time Marker */}
            <Card>
              <CardHeader>
                <CardTitle>Live Visualization (Dynamic Real-Time Map)</CardTitle>
              </CardHeader>
              <CardContent style={{ height: 400 }}>
                <MapContainer center={[-1.2921, 36.8219]} zoom={13} style={{ height: "350px", width: "100%" }} scrollWheelZoom={true}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {/* Real-time pollution marker (currentData) */}
                  {currentData && liveIcon && (
                    <Marker position={[-1.2921, 36.8219]} icon={liveIcon}>
                      <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                        <div>
                          <strong>Live Pollution (Current)</strong><br />
                          PM2.5: {currentData.pm25}<br />
                          NO2: {currentData.no2}<br />
                          CO: {currentData.co}<br />
                          AQI: {currentData.aqi}<br />
                          Status: {currentData.status}
                          <br />
                          Last updated: {new Date(currentData.timestamp).toLocaleTimeString()}
                        </div>
                      </Tooltip>
                    </Marker>
                  )}
                  {/* Dynamic location markers */}
                  {locations.map((loc) => (
                    <Marker key={loc.id} position={loc.coordinates}>
                      <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                        <div>
                          <strong>{loc.name}</strong><br />
                          PM2.5: {loc.currentReading.pm25}<br />
                          NO2: {loc.currentReading.no2}<br />
                          CO: {loc.currentReading.co}<br />
                          AQI: {loc.currentReading.aqi}<br />
                          Status: {loc.currentReading.status}
                          <br />
                          Last updated: {new Date(loc.currentReading.timestamp).toLocaleTimeString()}
                        </div>
                      </Tooltip>
                    </Marker>
                  ))}
                </MapContainer>
              </CardContent>
            </Card>

            {/* Real-Time Location List */}
            <Card>
              <CardHeader>
                <CardTitle>Location Monitoring (Real-Time List)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.map((loc) => (
                    <div key={loc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-semibold">{loc.name}</div>
                          <div className="text-sm text-gray-600">
                            PM2.5: {loc.currentReading.pm25} • CO: {loc.currentReading.co}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(loc.currentReading.status)}>
                          {loc.currentReading.status}
                        </Badge>
                        {loc.trend === "up" && <TrendingUp className="w-4 h-4 text-red-500" />}
                        {loc.trend === "down" && <TrendingDown className="w-4 h-4 text-green-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
