"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Lock, Star, Crown, Users, Info } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { useAuth } from "@/components/AuthContext"

const packages = [
  {
    name: "Free",
    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
    price: "$0",
    features: [
      "Real-time air quality dashboard",
      "Basic map/location monitoring",
      "Blog, community, and news",
    ],
    cta: <Link href="/signup"><button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded shadow">Get Started</button></Link>,
    highlight: false,
  },
  {
    name: "Premium",
    icon: <Star className="w-8 h-8 text-yellow-500" />,
    price: "$9/mo",
    features: [
      "All Free features",
      "Downloadable reports (PDF/CSV)",
      "Room/location-specific analytics",
      "Advanced AI-powered insights",
      "API key for integrations",
      "Priority support",
    ],
    cta: <Link href="/dashboard"><button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-2 rounded shadow">Upgrade to Premium</button></Link>,
    highlight: true,
  },
  {
    name: "Enterprise",
    icon: <Crown className="w-8 h-8 text-purple-600" />,
    price: "Contact Us",
    features: [
      "All Premium features",
      "Custom integrations",
      "Team management",
      "Higher API limits",
      "Dedicated onboarding",
      "Enterprise SLAs & support",
    ],
    cta: <a href="mailto:sales@climacttt.com"><button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded shadow">Contact Sales</button></a>,
    highlight: false,
  },
]

function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth();
  const userId = user?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    // Simulate payment delay
    setTimeout(async () => {
      // Simulate payment success, then call upgrade API
      if (!userId) {
        setError("User not found. Please log in.")
        setLoading(false)
        return
      }
      try {
        const res = await fetch("/api/upgrade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, paymentStatus: "successful" }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Upgrade failed.")
        }
        setSuccess(true)
      } catch (err: any) {
        setError(err.message || "Upgrade failed.")
      } finally {
        setLoading(false)
      }
    }, 2000)
  }

  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
        <h2 className="text-2xl font-bold text-green-700 mb-4">Upgrade to Premium</h2>
        {success ? (
          <div className="text-green-700 font-semibold text-center">
            Payment successful! 🎉<br />
            Your account will be upgraded shortly.<br />
            <button onClick={onClose} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                placeholder="e.g. 07XXXXXXXX"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="text"
                value="KES 700/mo"
                readOnly
                className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-700 font-bold"
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded shadow disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay with M-Pesa"}
            </button>
          </form>
        )}
      </div>
    </div>
  ) : null
}

export default function PricingPage() {
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  return (
    <TooltipProvider>
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center py-16">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-600 mb-10">Access location-specific analytics and advanced features with Premium or Enterprise for just 700 bob per month.</p>
        {/* Responsive grid: side by side on desktop, stacked on mobile */}
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card
                key={pkg.name}
                className={`flex flex-col items-center p-8 shadow-2xl border-2 ${pkg.highlight ? "border-yellow-400 scale-105 bg-yellow-50" : "border-green-200 bg-white"} animate-fade-in`}
              >
                <CardHeader className="flex flex-col items-center gap-2 mb-2">
                  {pkg.icon}
                  <CardTitle className="text-2xl font-bold text-center">{pkg.name}</CardTitle>
                  <div className="text-3xl font-extrabold mt-2 mb-1">{pkg.price}</div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center w-full">
                  <ul className="mb-6 space-y-2 w-full">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                        {/* Add info icon and tooltip for premium/enterprise features */}
                        {(pkg.name !== "Free" && feature !== "All Free features") && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span tabIndex={0} aria-label="More info about this feature">
                                <Info className="w-4 h-4 text-blue-400 cursor-pointer" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {feature.includes("AI") && "AI-powered insights use advanced models to provide personalized recommendations and trend analysis."}
                              {feature.includes("Downloadable") && "Export your air quality data as PDF or CSV for reports and sharing."}
                              {feature.includes("analytics") && "Get detailed analytics for each room or location you monitor."}
                              {feature.includes("API key") && "Integrate your data with other platforms using a secure API key."}
                              {feature.includes("Priority support") && "Get faster responses and dedicated help from our team."}
                              {feature.includes("Custom integrations") && "Enterprise customers can request custom data integrations."}
                              {feature.includes("Team management") && "Manage multiple users and permissions for your organization."}
                              {feature.includes("Higher API limits") && "Enterprise plans get increased API usage quotas."}
                              {feature.includes("Dedicated onboarding") && "Personalized onboarding and setup for your team."}
                              {feature.includes("SLAs") && "Service Level Agreements for uptime and support."}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="w-full flex justify-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          {pkg.name === "Premium"
                            ? <button
                                className="bg-yellow-500 hover:bg-yellow-600 transition-all duration-150 hover:scale-105 focus:ring-2 focus:ring-green-400 aria-[label]:font-bold text-white font-bold px-6 py-2 rounded shadow"
                                aria-label="Upgrade to Premium"
                                onClick={() => setUpgradeOpen(true)}
                              >Upgrade to Premium</button>
                            : pkg.cta && React.cloneElement(pkg.cta, {
                                className: `${pkg.cta.props.className || ""} transition-all duration-150 hover:scale-105 focus:ring-2 focus:ring-green-400 aria-[label]:font-bold`,
                                "aria-label": pkg.name === "Enterprise" ? "Contact Sales" : "Get Started"
                              })}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {pkg.name === "Premium" && "Upgrade to unlock all advanced analytics, AI insights, and more."}
                        {pkg.name === "Enterprise" && "Contact us for custom solutions, integrations, and support."}
                        {pkg.name === "Free" && "Start monitoring air quality for free."}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">
          Need a custom solution or have questions? <a href="mailto:support@climacttt.com" className="underline text-green-700">Contact us</a>.
        </div>
      </div>
    </TooltipProvider>
  )
} 