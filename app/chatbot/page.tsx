"use client"

import { useState } from "react"

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I’m your ClimAct AI assistant. Ask me anything about air quality, climate action, or your dashboard!" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    const userMessage = { role: "user", content: input }
    setMessages(msgs => [...msgs, userMessage])
    setLoading(true)
    setInput("")
    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { name: "User" },
          location: "Nairobi",
          stats: {},
          historicalData: [],
          startDate: "",
          endDate: "",
          message: input
        })
      })
      const data = await res.json()
      setMessages(msgs => [...msgs, { role: "assistant", content: data.summary || data.trend || JSON.stringify(data) }])
    } catch (err) {
      setMessages(msgs => [...msgs, { role: "assistant", content: "Sorry, something went wrong." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 flex flex-col h-[70vh]">
        <h1 className="text-2xl font-bold text-green-800 mb-2">ClimAct AI Chatbot 🤖</h1>
        <div className="flex-1 overflow-y-auto border rounded p-4 mb-4 bg-gray-50">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right mb-2" : "text-left mb-2"}>
              <span className={m.role === "user" ? "inline-block bg-green-100 text-green-900 rounded-lg px-3 py-2" : "inline-block bg-gray-200 text-gray-700 rounded-lg px-3 py-2"}>
                {m.content}
              </span>
            </div>
          ))}
          {loading && <div className="text-left text-gray-400 animate-pulse">AI is typing…</div>}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about air quality, climate, or your data…"
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded shadow"
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
