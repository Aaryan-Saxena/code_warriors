import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Dumbbell, Trophy, Users, Gamepad2, Zap, Heart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Dumbbell className="h-6 w-6 text-green-500" />
          <span>FitQuest</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
            Dashboard
          </Link>
          <Link href="/game" className="text-sm font-medium hover:underline underline-offset-4">
            Play
          </Link>
          <Link href="/leaderboard" className="text-sm font-medium hover:underline underline-offset-4">
            Leaderboard
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-16 md:py-28 lg:py-36 xl:py-48 bg-gradient-to-b from-green-50 to-white">
          <div className="container px-6 md:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Level Up Your Fitness Journey
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Transform your daily activity into gaming power. Compete with friends, earn rewards, and achieve
                    your fitness goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-xl shadow-xl">
                  <img
                    src="/placeholder.svg?height=600&width=600"
                    alt="Game preview showing character powered by fitness stats"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container px-6 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  FitQuest connects your real-world activity to in-game performance, making fitness fun and rewarding.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Dumbbell className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Track Activity</h3>
                  <p className="text-gray-500">
                    Connect your fitness tracker to automatically sync steps, sleep, and workouts.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Gamepad2 className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Play Games</h3>
                  <p className="text-gray-500">
                    Enjoy fun mini-games where your character's abilities scale with your fitness achievements.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Earn Rewards</h3>
                  <p className="text-gray-500">
                    Win battles, complete challenges, and climb the leaderboard to unlock special rewards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-6 md:px-8">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Featured Games</h2>
                <p className="text-gray-500 mb-6">
                  Our interactive games are powered by your real-world fitness data, making every workout count toward
                  your gaming success.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 bg-green-100 p-1 rounded-full">
                      <Zap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Tank Battle</h3>
                      <p className="text-gray-500">
                        Control your tank and destroy enemies. Your attack power is based on your daily steps!
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 bg-blue-100 p-1 rounded-full">
                      <Zap className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Snake Game</h3>
                      <p className="text-gray-500">
                        Guide your snake to eat and grow. Your speed is based on your active minutes!
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 bg-purple-100 p-1 rounded-full">
                      <Zap className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Sumo Wrestling</h3>
                      <p className="text-gray-500">
                        Push your opponent out of the ring. Your defense is based on your sleep quality!
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/game">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Play Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-video overflow-hidden rounded-xl shadow-xl">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Game screenshots showing various mini-games"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container px-6 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Benefits of FitQuest</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Combining fitness with gaming creates a powerful motivation loop
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl">
                <Heart className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Improved Health</h3>
                <p className="text-gray-500">
                  Stay motivated to maintain daily activity levels and improve your overall health.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-xl">
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Social Connection</h3>
                <p className="text-gray-500">
                  Compete with friends and join a community of like-minded fitness gamers.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-purple-50 rounded-xl">
                <Zap className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Consistent Motivation</h3>
                <p className="text-gray-500">Turn fitness into a game that keeps you coming back for more every day.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-6 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold">Ready to Level Up Your Fitness?</h2>
              <p className="max-w-[600px] text-gray-500 md:text-lg">
                Join thousands of players who are transforming their fitness journey with FitQuest.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2025 FitQuest. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/about" className="text-xs hover:underline underline-offset-4">
            About
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
