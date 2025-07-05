"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, MessageCircle, TrendingUp, Users, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const featuredDiscussions = [
  {
    id: "1",
    title: "How can we reduce air pollution in Nairobi?",
    author: "Jane Mwangi",
    avatar: "/images/community/portrait 1.jpeg",
    replies: 24,
    trending: true,
  },
  {
    id: "2",
    title: "Best indoor plants for clean air?",
    author: "Samuel Kimani",
    avatar: "/images/community/portrait 2.jpeg",
    replies: 12,
    trending: false,
  },
  {
    id: "3",
    title: "Community air quality monitoring success stories",
    author: "Amina Otieno",
    avatar: "/images/community/portrait 3.jpeg",
    replies: 18,
    trending: true,
  },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center bg-gradient-to-br from-green-200 to-green-400 rounded-b-3xl shadow-lg mb-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg flex items-center justify-center gap-4">
            <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
            Join the ClimAct Community
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium drop-shadow">
            Connect, share, and take action with fellow climate champions. Discuss, learn, and make a difference together.
          </p>
          <Button asChild className="bg-white text-green-600 hover:bg-green-100 font-bold py-4 px-12 rounded-full text-lg md:text-xl shadow-lg">
            <Link href="/login">Join the Conversation</Link>
          </Button>
        </div>
      </section>

      {/* Featured Discussions */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-green-700 mb-8 flex items-center gap-2">
          <MessageCircle className="w-7 h-7 text-green-500 animate-bounce" /> Featured Discussions
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredDiscussions.map((disc) => (
            <Card key={disc.id} className="bg-gradient-to-br from-white to-green-50 shadow-xl hover:scale-[1.01] hover:shadow-2xl transition-all duration-200 animate-fade-in">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Image
  src={disc.avatar}
  alt={disc.author}
  width={48}
  height={48}
  className="rounded-full border-2 border-green-200 shadow"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== '/images/community/default-avatar.png') {
      target.src = '/images/community/default-avatar.png';
    }
  }}
/>
                <div>
                  <div className="font-semibold text-lg text-green-800">{disc.author}</div>
                  <div className="text-xs text-gray-500">Started a discussion</div>
                </div>
                {disc.trending && (
  <span aria-label="Trending">
    <TrendingUp className="w-5 h-5 text-orange-500 ml-auto animate-pulse" />
  </span>
)}
              </CardHeader>
              <CardContent>
                <h3 className="font-bold text-xl mb-2 text-gray-800 hover:text-green-700 transition-colors duration-200">
                  {disc.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4 text-green-400" /> {disc.replies} replies
                </div>
                <Button asChild variant="link" className="text-green-700 mt-4 font-semibold">
                  <Link href="#">View Discussion</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-700">Start a New Discussion</h2>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Have a question, idea, or story to share? Start a new thread and inspire others to take action!
        </p>
        <Button asChild className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-full text-lg md:text-xl shadow-lg">
          <Link href="/login">Start Discussion</Link>
        </Button>
      </section>
    </div>
  )
} 