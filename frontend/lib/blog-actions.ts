"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export interface BlogPost {
  id?: string
  title: string
  content: string
  excerpt: string
  image_url?: string
  published: boolean
  created_at?: string
  updated_at?: string
  author_id?: string
  author?: {
    full_name: string
  }
}

export async function createBlogPost(formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const imageUrl = formData.get("imageUrl") as string
  const published = formData.get("published") === "true"

  if (!title || !content || !excerpt) {
    return { error: "Title, content, and excerpt are required" }
  }

  const { error } = await supabase.from("blog_posts").insert([
    {
      title,
      content,
      excerpt,
      image_url: imageUrl || null,
      published,
      author_id: user.id,
    },
  ])

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/blog")
  return { success: "Blog post created successfully" }
}

export async function getBlogPosts(published = true) {
  const supabase = createServerClient()

  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      author:profiles(full_name)
    `)
    .order("created_at", { ascending: false })

  if (published) {
    query = query.eq("published", true)
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function subscribeNewsletter(formData: FormData) {
  const supabase = createServerClient()
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required" }
  }

  const { error } = await supabase.from("newsletter_subscribers").insert([{ email }])

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      return { error: "Email already subscribed" }
    }
    return { error: error.message }
  }

  return { success: "Successfully subscribed to newsletter" }
}
