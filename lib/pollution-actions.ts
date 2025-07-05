"use server"

import { createServerClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export interface PollutionReading {
  id?: string
  location: string
  pm25: number
  no2: number
  co: number
  aqi: number
  status: string
  indoor_pm25?: number
  indoor_no2?: number
  outdoor_pm25?: number
  outdoor_no2?: number
  timestamp: string
  user_id?: string
}

export async function addPollutionReading(data: Omit<PollutionReading, "id" | "user_id">) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  const { error } = await supabase.from("pollution_readings").insert([
    {
      ...data,
      user_id: user.id,
    },
  ])

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/analytics")
  return { success: "Reading added successfully" }
}

export async function getPollutionReadings(limit = 100) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("pollution_readings")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit)

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getLocationReadings(location: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("pollution_readings")
    .select("*")
    .eq("location", location)
    .order("timestamp", { ascending: false })
    .limit(50)

  if (error) {
    return { error: error.message }
  }

  return { data }
}
