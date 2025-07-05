"use client"

import { useRealtimeData } from "@/hooks/use-realtime-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Search, Bell, BarChart3, Users, Home, MessageSquare } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { MapPin, TrendingUp } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { FeatureGate } from "@/components/FeatureGate"
import { useState, useRef } from "react"

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false })
const MapConsumer = dynamic(() => import("react-leaflet").then(mod => mod.MapConsumer), { ssr: false })
const Polygon = dynamic(() => import("react-leaflet").then(mod => mod.Polygon), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false })

// Demo polygons for Nairobi regions (replace with real geo-coordinates as needed)
const areaPolygons = [
  {
    name: "Westlands",
    coordinates: [
      [-1.2635, 36.805],
      [-1.2635, 36.815],
      [-1.271, 36.815],
      [-1.271, 36.805],
    ],
  },
  {
    name: "Nairobi CBD",
    coordinates: [
      [-1.283, 36.816],
      [-1.283, 36.826],
      [-1.293, 36.826],
      [-1.293, 36.816],
    ],
  },
  {
    name: "Eastlands",
    coordinates: [
      [-1.287, 36.860],
      [-1.287, 36.880],
      [-1.300, 36.880],
      [-1.300, 36.860],
    ],
  },
];


export default function AnalyticsPage() {
  // For debugging: allow analytics even if not logged in
  // import { useAuth } from "@/components/AuthContext";
  // const { user, role, subscriptionStatus } = useAuth();
  // Instead, just show a warning if no session
  let user = null, role = null, subscriptionStatus = null;
  try {
    // Try to require useAuth if it exists, but don't block page if it fails
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const useAuth = require("@/components/AuthContext").useAuth;
    ({ user, role, subscriptionStatus } = useAuth());
  } catch (e) {
    // Not logged in or AuthContext not available
  }

  const { historicalData, currentData, locations } = useRealtimeData()
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf')
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiResult, setAiResult] = useState<any>(null)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const mapRef = useRef<any>(null)

  // Only render real-time content on the client
  if (typeof window === "undefined" || !historicalData.length) {
    return <div>Loading real-time data...</div>
  }

  // Filtered data for selected location and date range
  const filteredData = historicalData.filter((d) => {
    const matchLocation = selectedLocation ? d.location === selectedLocation : true
    const matchStart = startDate ? new Date(d.timestamp) >= new Date(startDate) : true
    const matchEnd = endDate ? new Date(d.timestamp) <= new Date(endDate) : true
    return matchLocation && matchStart && matchEnd
  })

  // Example: Calculate most polluted areas from real-time data
  const areaStats: Record<string, number> = {}
  historicalData.forEach((reading) => {
    if (!areaStats[reading.location]) areaStats[reading.location] = 0
    areaStats[reading.location] += reading.pm25
  })
  const pollutedAreas = Object.entries(areaStats)
    .sort((a, b) => b[1] - a[1])
    .map(([name, level]) => ({ name, level: Math.round(level), color: "bg-orange-500" }))
    .slice(0, 8)

  // Download report handler (unchanged)
  const handleDownload = async () => {
    setDownloading(true)
    setError(null)
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          location: selectedLocation || undefined,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to download report.")
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = format === "pdf" ? "air_quality_report.pdf" : "air_quality_report.csv"
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || "Error downloading report.")
    } finally {
      setDownloading(false)
    }
  }

  // AI Insights handler
  const handleAIInsight = async () => {
    setAiLoading(true)
    setAiError(null)
    setAiResult(null)
    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { name: "User" }, // Optionally use real user info
          location: selectedLocation,
          historicalData: filteredData,
          startDate,
          endDate,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to fetch AI insight.")
      }
      const data = await res.json()
      setAiResult(data)
    } catch (err: any) {
      setAiError(err.message || "Error fetching AI insight.")
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nairobi Air Quality Analysis and Visualization</h1>
          <p className="text-gray-600">Live Visualization</p>
          {/* Download Report Button - Premium Only */}
          <FeatureGate allowedRoles={["premium", "enterprise", "admin"]}>
            <div className="flex items-center gap-4 mt-4">
              <label htmlFor="format" className="text-sm font-medium">Format:</label>
              <select
                id="format"
                value={format}
                onChange={e => setFormat(e.target.value as 'pdf' | 'csv')}
                className="border rounded px-2 py-1 text-sm"
                aria-label="Select report format"
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
              </select>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition-all duration-150 text-white font-bold px-4 py-2 rounded shadow disabled:opacity-50"
                    aria-label="Download air quality report"
                  >
                    {downloading ? "Downloading..." : `Download Report (${format.toUpperCase()})`}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Download a detailed air quality report for your selected location and date range. Premium feature.</TooltipContent>
              </Tooltip>
              {error && <span className="text-red-500 ml-2">{error}</span>}
            </div>
          </FeatureGate>
          {/* Room/Location Analytics - Premium Only */}
          <FeatureGate allowedRoles={["premium", "enterprise", "admin"]}>
            <div className="flex items-center gap-4 mt-6">
              <label htmlFor="location" className="text-sm font-medium">Select Location/Room:</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <select
                    id="location"
                    value={selectedLocation}
                    onChange={e => setSelectedLocation(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                    aria-label="Select location or room"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </TooltipTrigger>
                <TooltipContent>Choose a specific location or room to view detailed analytics and AI insights.</TooltipContent>
              </Tooltip>
              <label htmlFor="start-date" className="text-sm font-medium">Start Date:</label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
                aria-label="Select start date"
              />
              <label htmlFor="end-date" className="text-sm font-medium">End Date:</label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
                aria-label="Select end date"
              />
            </div>
            {/* AI Insights Section */}
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <h2 className="text-lg font-bold text-green-700 mb-2 flex items-center gap-2">
                <span role="img" aria-label="AI">🤖</span> AI-Powered Insights
              </h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleAIInsight}
                    disabled={aiLoading || !selectedLocation || !startDate || !endDate}
                    className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 transition-all duration-150 text-white font-bold px-4 py-2 rounded shadow disabled:opacity-50 mb-2"
                    aria-label="Get AI-powered air quality insights"
                  >
                    {aiLoading ? "Generating..." : "Get AI Insights"}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Generate personalized, AI-powered insights and recommendations for your selected location and date range. Premium feature.</TooltipContent>
              </Tooltip>
              {aiError && <div className="text-red-500 animate-fade-in">{aiError}</div>}
              {aiResult && (
                <div className="mt-2 animate-fade-in">
                  <div className="mb-2"><span className="font-semibold">Summary:</span> {aiResult.summary}</div>
                  <div className="mb-2"><span className="font-semibold">Trend:</span> {aiResult.trend}</div>
                  <div className="mb-2"><span className="font-semibold">Recommendations:</span>
                    <ul className="list-disc ml-6">
                      {aiResult.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            {selectedLocation && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <h2 className="text-lg font-bold text-blue-700 mb-2">Analytics for {selectedLocation}</h2>
                <div className="text-gray-700 mb-2">Showing {filteredData.length} readings for this location.</div>
                {/* Example: Show average PM2.5, NO2, AQI for this location */}
                <div className="flex gap-8 mb-2">
                  <div>
                    <span className="font-semibold">Avg PM2.5:</span> {filteredData.length ? (filteredData.reduce((a, b) => a + b.pm25, 0) / filteredData.length).toFixed(1) : "-"}
                  </div>
                  <div>
                    <span className="font-semibold">Avg NO2:</span> {filteredData.length ? (filteredData.reduce((a, b) => a + b.no2, 0) / filteredData.length).toFixed(1) : "-"}
                  </div>
                  <div>
                    <span className="font-semibold">Avg AQI:</span> {filteredData.length ? (filteredData.reduce((a, b) => a + b.aqi, 0) / filteredData.length).toFixed(1) : "-"}
                  </div>
                </div>
                {/* Example: Simple chart (bar) for PM2.5 over time */}
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">PM2.5 Trend</h3>
                  <div className="flex items-end gap-1 h-24">
                    {filteredData.slice(-24).map((data, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-400 rounded"
                        style={{ height: `${Math.min((data.pm25 / 200) * 96, 96)}px`, width: "6px" }}
                        title={`PM2.5: ${data.pm25} at ${new Date(data.timestamp).toLocaleTimeString()}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </FeatureGate>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Map Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-green-100 to-green-50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-700">Live Pollution Map</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 rounded-lg overflow-hidden relative">
                  {typeof window !== "undefined" && locations.length > 0 && (
                    <MapContainer
                      center={(() => {
                        if (selectedLocation) {
                          const loc = locations.find(l => l.name === selectedLocation)
                          if (loc) return loc.coordinates
                        }
                        return [-1.2921, 36.8219]
                      })()}
                      zoom={selectedLocation ? 15 : 12}
                      style={{ height: "100%", width: "100%" }}
                      scrollWheelZoom={true}
                      whenCreated={mapInstance => { mapRef.current = mapInstance }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {areaPolygons.map(area => {
                          // Highlight if area matches a location being transmitted (in historicalData/currentData)
                          const isActive = historicalData.some(d => d.location === area.name) || currentData.some(d => d.location === area.name);
                          return (
                            <Polygon
                              key={area.name}
                              positions={area.coordinates}
                              pathOptions={{
                                color: isActive ? "#e53e3e" : "#3182ce",
                                fillOpacity: isActive ? 0.4 : 0.15,
                                weight: isActive ? 3 : 1,
                              }}
                              eventHandlers={{
                                click: () => setSelectedLocation(area.name),
                              }}
                            >
                              <Popup>{area.name}{isActive ? " (active)" : ""}</Popup>
                            </Polygon>
                          );
                        })}
                      {locations.map((loc) => (
                        <Marker
                          key={loc.id}
                          position={loc.coordinates}
                          eventHandlers={{
                            click: () => setSelectedLocation(loc.name),
                          }}
                        >
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
                      {/* Keep the map centered on selected location if changed */}
                      <MapConsumer>
                        {(map) => {
                          if (selectedLocation) {
                            const loc = locations.find(l => l.name === selectedLocation)
                            if (loc) {
                              setTimeout(() => {
                                map.setView(loc.coordinates, 15, { animate: true })
                              }, 100)
                            }
                          }
                          return null
                        }}
                      </MapConsumer>
                    </MapContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Most Polluted Areas (real-time) */}
          <Card className="bg-gradient-to-br from-orange-100 to-yellow-50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-orange-500 animate-bounce" /> Most Polluted Areas (Real-Time)</CardTitle>
              <p className="text-sm font-medium">LOCATION</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pollutedAreas.length === 0 ? (
                  <div className="text-gray-500">No real-time data yet.</div>
                ) : (
                  pollutedAreas.map((area, index) => (
                    <div key={area.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{index + 1}.</span>
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span>{area.name}</span>
                      </div>
                      <Badge className={`${area.color} text-white animate-fade-in`}>{area.level}</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
          {/* KES Pricing Summary */}
          <div className="mt-12 flex justify-center">
            <Card className="w-full max-w-lg bg-gradient-to-br from-green-200 to-green-50 shadow-lg border border-green-300">
              <CardHeader>
                <CardTitle className="text-green-700 text-2xl flex items-center gap-2">
                  <span role="img" aria-label="money">💰</span> Premium Plan Pricing (KES)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl font-bold text-green-800">KES 700/mo</span>
<span className="text-gray-600 text-sm">Access location-specific analytics and advanced features for just 700 bob per month.</span>
                  <a href="/pricing" className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded shadow transition-all">See All Plans</a>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
    </TooltipProvider>
  )
}
