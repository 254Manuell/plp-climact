// Sample WebSocket server for development
// Run with: node scripts/websocket-server.js

const WebSocket = require("ws")

const wss = new WebSocket.Server({ port: 8080 })

console.log("WebSocket server running on ws://localhost:8080")

// Sample pollution data generator
const generatePollutionData = () => {
  const locations = ["Nairobi CBD", "Westlands", "Karen", "Eastlands"]
  const statuses = ["Good", "Moderate", "Unhealthy", "Hazardous"]

  return {
    type: "pollution_update",
    payload: {
      timestamp: new Date().toISOString(),
      location: locations[Math.floor(Math.random() * locations.length)],
      pm25: Math.floor(Math.random() * 200) + 20,
      no2: Math.floor(Math.random() * 100) + 10,
      co: Math.floor(Math.random() * 50) + 20,
      aqi: Math.floor(Math.random() * 200) + 50,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      indoor: {
        pm25: Math.floor(Math.random() * 150) + 50,
        no2: Math.floor(Math.random() * 80) + 20,
      },
      outdoor: {
        pm25: Math.floor(Math.random() * 300) + 100,
        no2: Math.floor(Math.random() * 120) + 30,
      },
    },
  }
}

const generateLocationData = () => {
  return {
    type: "location_update",
    payload: [
      {
        id: "1",
        name: "BUS STATION",
        coordinates: [-1.2921, 36.8219],
        currentReading: {
          pm25: Math.floor(Math.random() * 200) + 50,
          no2: Math.floor(Math.random() * 100) + 20,
          co: Math.floor(Math.random() * 50) + 30,
          aqi: Math.floor(Math.random() * 200) + 50,
          status: ["Good", "Moderate", "Unhealthy", "Hazardous"][Math.floor(Math.random() * 4)],
          location: "Bus Station",
          timestamp: new Date().toISOString(),
        },
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
      },
      {
        id: "2",
        name: "MOI AVENUE",
        coordinates: [-1.2841, 36.8155],
        currentReading: {
          pm25: Math.floor(Math.random() * 200) + 50,
          no2: Math.floor(Math.random() * 100) + 20,
          co: Math.floor(Math.random() * 50) + 30,
          aqi: Math.floor(Math.random() * 200) + 50,
          status: ["Good", "Moderate", "Unhealthy", "Hazardous"][Math.floor(Math.random() * 4)],
          location: "Moi Avenue",
          timestamp: new Date().toISOString(),
        },
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
      },
    ],
  }
}

wss.on("connection", function connection(ws) {
  console.log("Client connected")

  // Send initial data
  ws.send(JSON.stringify(generatePollutionData()))
  ws.send(JSON.stringify(generateLocationData()))

  // Send periodic updates
  const pollutionInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(generatePollutionData()))
    }
  }, 5000) // Every 5 seconds

  const locationInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(generateLocationData()))
    }
  }, 10000) // Every 10 seconds

  ws.on("message", function message(data) {
    try {
      const parsed = JSON.parse(data.toString())
      console.log("Received:", parsed)

      // Handle different message types
      if (parsed.type === "request_initial_data") {
        ws.send(JSON.stringify(generatePollutionData()))
        ws.send(JSON.stringify(generateLocationData()))
      }
    } catch (error) {
      console.error("Error parsing message:", error)
    }
  })

  ws.on("close", function close() {
    console.log("Client disconnected")
    clearInterval(pollutionInterval)
    clearInterval(locationInterval)
  })
})
