"use client"

import { CheckCircle, Star, Crown, Info, HelpCircle, Download, BarChart3, Sparkles, Mail } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-green-800 mb-4 flex items-center gap-2"><HelpCircle className="w-7 h-7 text-green-500" /> Help & How it Works</h1>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-2 flex items-center gap-2"><Info className="w-5 h-5 text-blue-400" /> Platform Overview</h2>
          <p className="text-gray-700">Climacttt is your all-in-one platform for real-time air quality monitoring, analytics, and actionable AI-powered insights. Track pollution, analyze trends, and make informed decisions for a healthier environment.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-2 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-green-500" /> Feature Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded p-4 flex flex-col items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mb-1" />
              <div className="font-bold text-green-700 mb-1">Free</div>
              <ul className="text-sm text-gray-700 list-disc ml-4">
                <li>Real-time air quality dashboard</li>
                <li>Basic map/location monitoring</li>
                <li>Blog, community, and news</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 flex flex-col items-center">
              <Star className="w-6 h-6 text-yellow-500 mb-1" />
              <div className="font-bold text-yellow-700 mb-1">Premium</div>
              <ul className="text-sm text-gray-700 list-disc ml-4">
                <li>All Free features</li>
                <li>Downloadable reports (PDF/CSV)</li>
                <li>Room/location-specific analytics</li>
                <li>Advanced AI-powered insights</li>
                <li>API key for integrations</li>
                <li>Priority support</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded p-4 flex flex-col items-center">
              <Crown className="w-6 h-6 text-purple-600 mb-1" />
              <div className="font-bold text-purple-700 mb-1">Enterprise</div>
              <ul className="text-sm text-gray-700 list-disc ml-4">
                <li>All Premium features</li>
                <li>Custom integrations</li>
                <li>Team management</li>
                <li>Higher API limits</li>
                <li>Dedicated onboarding</li>
                <li>Enterprise SLAs & support</li>
              </ul>
            </div>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-2 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" /> How to Upgrade</h2>
          <p className="text-gray-700 mb-2">To unlock Premium or Enterprise features, visit the <Link href="/pricing" className="underline text-green-700">Pricing</Link> page and select your desired plan. Premium upgrades are instant. For Enterprise, contact our sales team for a custom solution.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-2 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-500" /> Using Analytics & AI Insights</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Go to the <Link href="/analytics" className="underline text-green-700">Analytics</Link> page.</li>
            <li>Select a location/room and date range to view detailed analytics.</li>
            <li>Premium users can generate AI-powered insights and recommendations for any location and period.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-2 flex items-center gap-2"><Download className="w-5 h-5 text-green-500" /> Downloading Reports</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>On the Analytics page, select your desired location and date range.</li>
            <li>Click the Download Report button to export your data as PDF or CSV (Premium only).</li>
          </ul>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-semibold text-green-700 mb-2 flex items-center gap-2"><Mail className="w-5 h-5 text-blue-500" /> Contact & Support</h2>
          <p className="text-gray-700">Need help or have questions? Email us at <a href="mailto:support@climacttt.com" className="underline text-green-700">support@climacttt.com</a> or visit the <Link href="/community" className="underline text-green-700">Community</Link> page to connect with other users.</p>
        </section>
      </div>
    </div>
  )
} 