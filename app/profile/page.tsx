"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Key, Edit, Sparkles, BarChart3 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { FeatureGate } from "@/components/FeatureGate"
import { useAuth } from "@/components/AuthContext"

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const { user, role, subscriptionStatus, loading: roleLoading, error } = useAuth()

  // Fetch AI insight from backend
  const getAIInsight = async () => {
    setLoadingAI(true)
    setAiError(null)
    setAiInsight(null)
    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { name: user?.user_metadata?.full_name || user?.email || "User" },
          location: "Nairobi", // You can make this dynamic
          stats: {}, // You can fetch stats from your DB if available
        }),
      })
      if (!res.ok) throw new Error("Failed to fetch AI insight.")
      const data = await res.json()
      setAiInsight(data.tip)
    } catch (err: any) {
      setAiError(err.message || "Error fetching AI insight.")
    } finally {
      setLoadingAI(false)
    }
  }

  if (roleLoading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">Please log in to view your profile.</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center py-12">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl animate-fade-in">
        <CardHeader className="flex flex-col items-center gap-4 pb-2">
          <div className="relative">
            <Image src={user.user_metadata?.avatar_url || "/default-avatar.png"} alt={user.user_metadata?.full_name || user.email || "User"} width={96} height={96} className="rounded-full border-4 border-green-200 shadow-lg" />
            <Button size="icon" variant="ghost" className="absolute bottom-0 right-0 bg-white border border-green-200 shadow p-1" onClick={() => setEditing((v) => !v)}>
              <Edit className="w-5 h-5 text-green-600" />
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-green-800">{user.user_metadata?.full_name || user.email || "User"}</h1>
          <div className="text-gray-500">{user.email}</div>
          {/* Show user role and subscription status */}
          <div className="flex gap-4 mt-2">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">
              Role: {roleLoading ? "..." : role || "Unknown"}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
              Subscription: {roleLoading ? "..." : subscriptionStatus || "Unknown"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* API Key Management */}
          {/* You can implement API key management here if needed */}
          {/* User Stats - Placeholder */}
          <div className="flex items-center justify-around gap-4">
            <div className="flex flex-col items-center">
              <BarChart3 className="w-7 h-7 text-green-500" />
              <div className="text-xl font-bold text-green-800">--</div>
              <div className="text-xs text-gray-500">Posts</div>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="w-7 h-7 text-green-500" />
              <div className="text-xl font-bold text-green-800">--</div>
              <div className="text-xs text-gray-500">Reports</div>
            </div>
            <div className="flex flex-col items-center">
              <User className="w-7 h-7 text-green-500" />
              <div className="text-xl font-bold text-green-800">--</div>
              <div className="text-xs text-gray-500">Discussions</div>
            </div>
          </div>
          {/* AI Insights - gated for premium/enterprise/admin */}
          <FeatureGate allowedRoles={["premium", "enterprise", "admin"]}>
            <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-6 shadow-inner flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-green-500 animate-pulse" />
                <span className="text-lg font-semibold text-green-700">AI-Powered Insight</span>
              </div>
              {aiError && <div className="text-red-500 animate-fade-in">{aiError}</div>}
              {aiInsight ? (
                <div className="text-gray-700 text-center animate-fade-in">{aiInsight}</div>
              ) : (
                <Button onClick={getAIInsight} disabled={loadingAI} className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-2 rounded-full shadow">
                  {loadingAI ? "Generating..." : "Get Personalized Tip"}
                </Button>
              )}
            </div>
          </FeatureGate>
        </CardContent>
      </Card>
    </div>
  )
} 