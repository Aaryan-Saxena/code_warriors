import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Heart, Footprints, Brain, Trophy, ArrowRight, Users, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-white z-10">
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Gamifying Your Fitness Journey</h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  FitQuest transforms your daily physical activity into gaming power, making fitness fun and rewarding.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-500 md:text-lg">
                  At FitQuest, we believe fitness should be fun, engaging, and rewarding. Our mission is to transform
                  the way people approach their health by gamifying the fitness experience.
                </p>
                <p className="text-gray-500 md:text-lg mt-4">
                  By connecting real-world activity to in-game performance, we create a powerful motivation loop that
                  encourages consistent physical activity and healthy habits.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-green-50 border-green-100">
                    <CardContent className="p-0 flex flex-col items-center text-center">
                      <Heart className="h-8 w-8 text-green-500 mb-2" />
                      <h3 className="font-medium">Promote Health</h3>
                    </CardContent>
                  </Card>
                  <Card className="p-4 bg-blue-50 border-blue-100">
                    <CardContent className="p-0 flex flex-col items-center text-center">
                      <Brain className="h-8 w-8 text-blue-500 mb-2" />
                      <h3 className="font-medium">Engage Minds</h3>
                    </CardContent>
                  </Card>
                  <Card className="p-4 bg-purple-50 border-purple-100">
                    <CardContent className="p-0 flex flex-col items-center text-center">
                      <Users className="h-8 w-8 text-purple-500 mb-2" />
                      <h3 className="font-medium">Build Community</h3>
                    </CardContent>
                  </Card>
                  <Card className="p-4 bg-amber-50 border-amber-100">
                    <CardContent className="p-0 flex flex-col items-center text-center">
                      <Trophy className="h-8 w-8 text-amber-500 mb-2" />
                      <h3 className="font-medium">Reward Progress</h3>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold">How FitQuest Works</h2>
              <p className="max-w-[700px] text-gray-500 md:text-lg">
                Our innovative platform connects your real-world activity to in-game performance
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Footprints className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-bold">Track Activity</h3>
                <p className="text-gray-500">
                  Connect your fitness tracker or manually log your daily steps, sleep, and workouts.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-bold">Power Your Character</h3>
                <p className="text-gray-500">
                  Your real-world activity directly powers your in-game character's abilities and stats.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold">Compete & Win</h3>
                <p className="text-gray-500">
                  Battle friends, complete challenges, and climb the leaderboard to earn rewards.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16 items-center">
              <div>
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="FitQuest gameplay screenshot"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Game Features</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 bg-green-100 p-1 rounded-full">
                      <Zap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Multiple Mini-Games</h3>
                      <p className="text-gray-500">
                        Enjoy various games including tank battles, snake, sumo wrestling, and more.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 bg-green-100 p-1 rounded-full">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Multiplayer Battles</h3>
                      <p className="text-gray-500">
                        Challenge friends to PvP matches where your fitness level determines your power.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1 bg-green-100 p-1 rounded-full">
                      <Trophy className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Achievements & Rewards</h3>
                      <p className="text-gray-500">
                        Unlock special items, badges, and character customizations as you progress.
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="pt-4">
                  <Link href="/game">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Try Games Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
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
