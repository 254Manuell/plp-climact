import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, ArrowLeft, Search, Sparkles, User as UserIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getBlogPosts, subscribeNewsletter } from "@/lib/blog-actions"

export default async function BlogPage() {
  const { data: posts, error } = await getBlogPosts()

  const handleNewsletterSubmit = async (formData: FormData) => {
    "use server"
    const result = await subscribeNewsletter(formData)
    // In a real app, you'd handle the result with toast notifications
    return result
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-green-500 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-white hover:text-gray-200">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <span className="text-white font-medium">BLOG</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white">EN</span>
            <Search className="w-5 h-5 text-white" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Logo and Title */}
        <div className="flex items-center space-x-6 mb-12">
          <Leaf className="w-24 h-24 text-green-500 animate-bounce" />
          <h1 className="text-8xl font-black text-black drop-shadow-lg">Blog</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8 animate-fade-in">
            <AlertDescription>Error loading blog posts: {error}</AlertDescription>
          </Alert>
        )}

        {/* Featured Post */}
        {posts && posts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-green-700"><Sparkles className="w-6 h-6 animate-pulse text-green-500" /> Featured Post</h2>
            <Link href={`/blog/${posts[0].id}`} className="block group">
              <Card className="overflow-hidden border-2 border-green-500 bg-gradient-to-br from-green-100 to-green-50 shadow-xl group-hover:scale-[1.01] group-hover:shadow-2xl transition-all duration-200">
                <div className="grid md:grid-cols-2">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-green-700 transition-colors duration-200">{posts[0].title}</h3>
                    <p className="text-gray-600 mb-4">{posts[0].excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{new Date(posts[0].created_at!).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><UserIcon className="w-4 h-4 text-green-500" />{posts[0].author?.full_name || "ClimAct Team"}</span>
                    </div>
                  </CardContent>
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src={posts[0].image_url || "/placeholder.svg?height=300&width=400"}
                      alt={posts[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </div>
              </Card>
            </Link>
          </section>
        )}

        {/* Medium Kenya Conservation Story */}
        <section className="mb-16 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-green-700">
            <Sparkles className="w-6 h-6 animate-pulse text-green-500" />
            Special Feature: Kenya's Conservation Efforts
          </h2>
          <Link href="/blog/medium-kenya-conservation" className="block group">
            <Card className="overflow-hidden border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-green-50 shadow-xl group-hover:scale-[1.01] group-hover:shadow-2xl transition-all duration-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 leading-tight group-hover:text-blue-700 transition-colors duration-200">
                  Environmental Conservation Efforts in the Republic of Kenya: An Observation of Steps Taken Towards Sustainability
                </h3>
                <p className="text-gray-700 mb-4">
                  A summary of Kenya's environmental conservation journey, including government-led reforestation, community projects, wildlife protection, and the promotion of renewable energy. Originally published by Emmanuel Ngunnzi on Medium.
                </p>
                <span className="text-blue-600 underline">Read summary &rarr;</span>
              </CardContent>
            </Card>
          </Link>
        </section>


        {/* Recent Posts */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-green-700">Recent Posts</h2>
            <Button variant="link" className="text-blue-600">
              See All
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {posts?.slice(1, 4).map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="block group">
                <Card className="overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all duration-200 bg-gradient-to-br from-green-50 to-white">
                  <div className="relative h-48">
                    <Image
                      src={post.image_url || "/placeholder.svg?height=200&width=300"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-green-700 transition-colors duration-200">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                    <div className="text-xs text-gray-500">{new Date(post.created_at!).toLocaleDateString()}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-green-500 rounded-2xl p-12 text-center text-white mb-16 shadow-xl animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">A monthly post delivered straight to your inbox</h2>
          <form action={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mt-8">
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white text-black"
              required
            />
            <Button type="submit" className="bg-white text-green-500 hover:bg-gray-100 font-semibold px-8">
              Submit
            </Button>
          </form>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-green-500 text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center">Copyright 2024. All rights reserved</p>
        </div>
      </footer>
    </div>
  )
}
