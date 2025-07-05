import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true)
      setError(null)
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        setError(userError.message)
        setLoading(false)
        return
      }
      if (user) {
        setUserId(user.id)
        const { data, error: dbError } = await supabase
          .from("users")
          .select("role, subscription_status")
          .eq("id", user.id)
          .single()
        if (dbError) {
          setError(dbError.message)
        } else if (data) {
          setRole(data.role)
          setSubscriptionStatus(data.subscription_status)
        }
      }
      setLoading(false)
    }
    fetchUserRole()
  }, [])

  return { role, subscriptionStatus, userId, loading, error }
} 