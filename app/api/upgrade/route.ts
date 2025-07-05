import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  const { userId, paymentStatus } = await req.json()
  if (!userId || !paymentStatus) {
    return NextResponse.json({ error: "Missing userId or paymentStatus" }, { status: 400 })
  }
  if (paymentStatus !== "successful") {
    return NextResponse.json({ error: "Payment not successful" }, { status: 400 })
  }
  const supabase = createServerClient()
  const { error } = await supabase
    .from("users")
    .update({ role: "premium", subscription_status: "active" })
    .eq("id", userId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
} 