"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, ChevronDown, Mail, Facebook, Loader2 } from "lucide-react"
import Link from "next/link"
import { signUp } from "@/lib/auth-actions"
import { useState, useTransition } from "react"

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    setError(null)

    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    startTransition(async () => {
      const result = await signUp(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
            English (UK)
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Signup Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Link href="/" className="flex items-center space-x-2">
                <Leaf className="w-10 h-10 text-green-500" />
                <span className="text-xl font-bold text-gray-800">ClimAct</span>
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Create Account</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Email Signup Form */}
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                Continue with Email
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Signup Buttons */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full h-12 border-gray-300 hover:bg-gray-50 bg-transparent">
                <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                Continue with Facebook
              </Button>

              <Button variant="outline" className="w-full h-12 border-gray-300 hover:bg-gray-50 bg-transparent">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>

            {/* Terms and Conditions */}
            <div className="text-xs text-gray-600 text-center px-4">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-green-600 hover:text-green-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-green-600 hover:text-green-700">
                Privacy Policy
              </Link>
            </div>

            {/* Footer Links */}
            <div className="text-center pt-4">
              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                  LOGIN
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
