import { getBlogPostById } from "@/lib/blog-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, ArrowLeft, Sparkles, User as UserIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const { data: post, error } = await getBlogPostById(params.id)

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link href="/blog" className="text-blue-600 underline">Back to Blog</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-green-500 px-6 py-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <Link href="/blog" className="text-white hover:text-gray-200">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <span className="text-white font-medium">BLOG</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Card className="overflow-hidden border-2 border-green-500 mb-8 bg-gradient-to-br from-green-100 to-green-50 shadow-xl animate-fade-in">
          <div className="relative h-64 w-full">
            <Image
              src={post.image_url || "/placeholder.svg?height=300&width=400"}
              alt={post.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold mb-4 leading-tight flex items-center gap-2 text-green-800 drop-shadow-lg">
              <Sparkles className="w-7 h-7 text-green-500 animate-pulse" /> {post.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span>{new Date(post.created_at!).toLocaleDateString()}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><UserIcon className="w-4 h-4 text-green-500" />{post.author?.full_name || "ClimAct Team"}</span>
            </div>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }} />
          </CardContent>
        </Card>
        <Link href="/blog" className="text-green-700 font-semibold hover:underline flex items-center gap-2 animate-fade-in">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    </div>
  )
} 