import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, ChevronDown, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
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

        {/* Forgot Password Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Link href="/" className="flex items-center space-x-2">
                <Leaf className="w-10 h-10 text-green-500" />
                <span className="text-xl font-bold text-gray-800">ClimAct</span>
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Forgot Password</CardTitle>
            <p className="text-gray-600 text-sm mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Reset Password Form */}
            <form className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold">
                <Mail className="mr-2 h-4 w-4" />
                Send Reset Link
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
