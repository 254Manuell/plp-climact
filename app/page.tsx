import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 pt-12 pb-24">
        <Image
          src="/banner.jpg"
          alt="Nairobi traffic and public transport scene"
          fill
          className="object-cover absolute inset-0 w-full h-full opacity-60 z-0 rounded-b-3xl"
          priority
        />
        <div className="relative z-10 flex flex-col items-center space-y-8 max-w-3xl text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-wider text-white drop-shadow-lg">
            Take Action for a Cleaner Tomorrow
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium drop-shadow">
            Join ClimAct to monitor, analyze, and improve air quality in your community. Together, we can make a difference.
          </p>
          <Button
            asChild
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-full text-lg md:text-xl shadow-lg"
          >
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </div>

      {/* Mission Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-700">Our Mission</h2>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          ClimAct empowers individuals, organizations, and communities to take meaningful climate action by providing real-time air quality monitoring, insightful analytics, and a collaborative platform for change.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
          <div className="flex-1 flex flex-col items-center">
            <Image
              src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
              alt="Air Quality Monitoring"
              width={300}
              height={200}
              className="rounded-xl shadow-lg mb-4"
            />
            <h3 className="font-semibold text-xl text-green-800 mb-2">Monitor</h3>
            <p className="text-gray-600">Track air quality in real time for your city, neighborhood, or even your room.</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <Image
              src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80"
              alt="Analyze Data"
              width={300}
              height={200}
              className="rounded-xl shadow-lg mb-4"
            />
            <h3 className="font-semibold text-xl text-green-800 mb-2">Analyze</h3>
            <p className="text-gray-600">Visualize trends, generate reports, and gain insights to drive climate action.</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <Image
              src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
              alt="Community Action"
              width={300}
              height={200}
              className="rounded-xl shadow-lg mb-4"
            />
            <h3 className="font-semibold text-xl text-green-800 mb-2">Act Together</h3>
            <p className="text-gray-600">Join a community of changemakers and collaborate to combat air pollution.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-green-600 py-12 text-center text-white rounded-t-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to make an impact?</h2>
        <p className="text-lg md:text-xl mb-8">Sign up now and be part of the solution for a cleaner, healthier planet.</p>
        <Button
          asChild
          className="bg-white text-green-600 hover:bg-green-100 font-bold py-4 px-12 rounded-full text-lg md:text-xl shadow-lg"
        >
          <Link href="/signup">Join ClimAct</Link>
        </Button>
      </section>
    </div>
  )
}
