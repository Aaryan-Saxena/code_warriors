"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Award,
  Dumbbell,
  Moon,
  Play,
  User,
  RefreshCw,
  Footprints,
  Zap,
  Trophy,
  ChevronRight,
} from "lucide-react"
import { mockFitnessData } from "@/lib/mock-data"
import { FitnessStats } from "@/components/fitness-stats"
import { CharacterStats } from "@/components/character-stats"
import { ActivityChart } from "@/components/activity-chart"

export default function DashboardPage() {
  const [fitnessData, setFitnessData] = useState(mockFitnessData)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const refreshFitnessData = () => {
    setIsRefreshing(true)
    // Simulate refreshing data
    setTimeout(() => {
      setFitnessData({
        ...fitnessData,
        steps: Math.floor(Math.random() * 3000) + 7000,
        sleepHours: Math.floor(Math.random() * 2) + 6 + Math.random(),
        activeMinutes: Math.floor(Math.random() * 20) + 30,
      })
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 bg-white px-4 lg:px-6 h-16 flex items-center border-b">
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
        <Button variant="ghost" size="icon" className="ml-4">
          <User className="h-5 w-5" />
          <span className="sr-only">User profile</span>
        </Button>
      </header>
      <main className="flex-1 bg-gray-50">
        <div className="container py-6 md:py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold">Your Dashboard</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshFitnessData}
                  disabled={isRefreshing}
                  className="self-start"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh Data
                </Button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <Card className="overflow-hidden border-green-100">
                <CardHeader className="bg-green-50 pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Game Character</CardTitle>
                      <CardDescription>Your character stats are powered by your real-world activity</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 flex justify-center">
                      <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-md">
                        <img
                          src="/placeholder-user.jpg?height=160&width=160"
                          alt="Character avatar"
                          className="rounded-full"
                        />
                        <Badge className="absolute top-0 right-0 bg-green-600">Lvl 5</Badge>
                      </div>
                    </div>
                    <div className="flex-[2]">
                      <CharacterStats fitnessData={fitnessData} isLoading={isLoading} />
                      <div className="mt-4 flex justify-end">
                        <Link href="/game">
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Play className="mr-2 h-4 w-4" /> Play Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Tracking</CardTitle>
                  <CardDescription>Your fitness data powers your character abilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="daily">
                    <TabsList className="mb-4">
                      <TabsTrigger value="daily">Daily</TabsTrigger>
                      <TabsTrigger value="weekly">Weekly</TabsTrigger>
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    </TabsList>
                    <TabsContent value="daily" className="space-y-4">
                      <FitnessStats fitnessData={fitnessData} isLoading={isLoading} />
                    </TabsContent>
                    <TabsContent value="weekly">
                      <ActivityChart data={fitnessData.weeklyActivity} isLoading={isLoading} />
                    </TabsContent>
                    <TabsContent value="monthly">
                      <div className="h-[200px] flex items-center justify-center text-gray-500">
                        Monthly stats will appear here
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Workouts</CardTitle>
                  <CardDescription>Your latest fitness activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex items-center p-4 rounded-lg bg-gray-100 animate-pulse">
                            <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                            <div className="w-16 h-8 bg-gray-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {fitnessData.workouts.map((workout, index) => (
                          <div
                            key={index}
                            className="flex items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                              {workout.type === "Running" ? (
                                <Footprints className="h-6 w-6 text-green-600" />
                              ) : (
                                <Dumbbell className="h-6 w-6 text-green-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{workout.type}</h3>
                              <p className="text-sm text-gray-500">
                                {workout.duration} min • {workout.calories} cal
                              </p>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              +15 XP
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2">
                      <Button variant="outline" className="w-full">
                        View All Workouts
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connect Fitness Tracker</CardTitle>
                  <CardDescription>Sync your fitness data to power up your character</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-4 space-y-4">
                    <div className="p-4 bg-green-100 rounded-full">
                      <Activity className="h-10 w-10 text-green-600" />
                    </div>
                    <p className="text-center text-sm text-gray-500">
                      Connect your Google Fit account to automatically sync your steps, sleep, and workout data.
                    </p>
                    <Link href="/api/auth/google">
                      <Button className="w-full bg-green-600 hover:bg-green-700">Connect Google Fit</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="overflow-hidden border-green-100">
                <CardHeader className="bg-green-50">
                  <CardTitle>Daily Quests</CardTitle>
                  <CardDescription>Complete quests to earn rewards</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <Footprints className="h-4 w-4 text-blue-600" />
                          </div>
                          <h3 className="font-medium">10,000 Steps</h3>
                        </div>
                        <Badge variant="outline" className="bg-blue-50">
                          Daily
                        </Badge>
                      </div>
                      <Progress value={(fitnessData.steps / 10000) * 100} className="h-2 mb-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{fitnessData.steps.toLocaleString()} / 10,000</span>
                        <span className="text-green-600">+20 XP</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <Activity className="h-4 w-4 text-purple-600" />
                          </div>
                          <h3 className="font-medium">60 Active Minutes</h3>
                        </div>
                        <Badge variant="outline" className="bg-purple-50">
                          Daily
                        </Badge>
                      </div>
                      <Progress value={(fitnessData.activeMinutes / 60) * 100} className="h-2 mb-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{fitnessData.activeMinutes} / 60 min</span>
                        <span className="text-green-600">+15 XP</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                            <Moon className="h-4 w-4 text-amber-600" />
                          </div>
                          <h3 className="font-medium">8 Hours Sleep</h3>
                        </div>
                        <Badge variant="outline" className="bg-amber-50">
                          Daily
                        </Badge>
                      </div>
                      <Progress value={(fitnessData.sleepHours / 8) * 100} className="h-2 mb-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{fitnessData.sleepHours} / 8 hrs</span>
                        <span className="text-green-600">+10 XP</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      View All Quests <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Unlock badges by reaching fitness goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: "Early Bird", icon: <Award className="h-8 w-8" />, unlocked: true },
                      {
                        name: "Step Master",
                        icon: <Footprints className="h-8 w-8" />,
                        unlocked: fitnessData.steps >= 10000,
                      },
                      { name: "Sleep Pro", icon: <Moon className="h-8 w-8" />, unlocked: fitnessData.sleepHours >= 8 },
                      {
                        name: "Workout King",
                        icon: <Dumbbell className="h-8 w-8" />,
                        unlocked: fitnessData.activeMinutes >= 60,
                      },
                      { name: "Streak 7", icon: <Zap className="h-8 w-8" />, unlocked: true },
                      { name: "Champion", icon: <Trophy className="h-8 w-8" />, unlocked: false },
                    ].map((badge, index) => (
                      <div
                        key={index}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                          badge.unlocked ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        <div className={`p-3 rounded-full mb-2 ${badge.unlocked ? "bg-green-100" : "bg-gray-100"}`}>
                          {badge.icon}
                        </div>
                        <span className="text-xs text-center">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Game Progress</CardTitle>
                  <CardDescription>Your journey so far</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">XP</span>
                      <span className="text-sm font-medium">450/1000</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Battles Won</span>
                      <span className="text-sm font-medium">7/20</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Quests Completed</span>
                      <span className="text-sm font-medium">3/10</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>

                  <Link href="/game">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Play Games <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
