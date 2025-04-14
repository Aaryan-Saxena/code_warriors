"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Medal, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const leaderboardData = {
    battles: [
      { rank: 1, name: "FitWarrior", wins: 42, losses: 5, avatar: "F", level: 12 },
      { rank: 2, name: "StepMaster", wins: 38, losses: 7, avatar: "S", level: 10 },
      { rank: 3, name: "HealthHero", wins: 35, losses: 10, avatar: "H", level: 9 },
      { rank: 4, name: "ActiveAce", wins: 30, losses: 12, avatar: "A", level: 8 },
      { rank: 5, name: "RunnerKing", wins: 28, losses: 15, avatar: "R", level: 7 },
      { rank: 6, name: "FitnessFan", wins: 25, losses: 18, avatar: "F", level: 6 },
      { rank: 7, name: "GymGuru", wins: 22, losses: 20, avatar: "G", level: 5 },
      { rank: 8, name: "WalkWinner", wins: 20, losses: 22, avatar: "W", level: 5 },
      { rank: 9, name: "SleepChamp", wins: 18, losses: 25, avatar: "S", level: 4 },
      { rank: 10, name: "JoggerJoe", wins: 15, losses: 28, avatar: "J", level: 3 },
    ],
    steps: [
      { rank: 1, name: "StepMaster", steps: 15243, avatar: "S", level: 10 },
      { rank: 2, name: "WalkWinner", steps: 14876, avatar: "W", level: 5 },
      { rank: 3, name: "RunnerKing", steps: 13542, avatar: "R", level: 7 },
      { rank: 4, name: "JoggerJoe", steps: 12987, avatar: "J", level: 3 },
      { rank: 5, name: "FitWarrior", steps: 12654, avatar: "F", level: 12 },
      { rank: 6, name: "ActiveAce", steps: 11876, avatar: "A", level: 8 },
      { rank: 7, name: "HealthHero", steps: 10543, avatar: "H", level: 9 },
      { rank: 8, name: "FitnessFan", steps: 9876, avatar: "F", level: 6 },
      { rank: 9, name: "GymGuru", steps: 8765, avatar: "G", level: 5 },
      { rank: 10, name: "SleepChamp", steps: 7654, avatar: "S", level: 4 },
    ],
    sleep: [
      { rank: 1, name: "SleepChamp", hours: 8.5, avatar: "S", level: 4 },
      { rank: 2, name: "HealthHero", hours: 8.2, avatar: "H", level: 9 },
      { rank: 3, name: "FitWarrior", hours: 7.9, avatar: "F", level: 12 },
      { rank: 4, name: "FitnessFan", hours: 7.8, avatar: "F", level: 6 },
      { rank: 5, name: "StepMaster", hours: 7.5, avatar: "S", level: 10 },
      { rank: 6, name: "GymGuru", hours: 7.3, avatar: "G", level: 5 },
      { rank: 7, name: "ActiveAce", hours: 7.1, avatar: "A", level: 8 },
      { rank: 8, name: "RunnerKing", hours: 6.9, avatar: "R", level: 7 },
      { rank: 9, name: "WalkWinner", hours: 6.7, avatar: "W", level: 5 },
      { rank: 10, name: "JoggerJoe", hours: 6.5, avatar: "J", level: 3 },
    ],
  }

  const filterLeaderboard = (data, query) => {
    if (!query) return data
    return data.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
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
        </nav>
        <Button variant="ghost" size="icon" className="ml-4">
          <User className="h-5 w-5" />
          <span className="sr-only">User profile</span>
        </Button>
      </header>
      <main className="flex-1 bg-gray-50">
        <div className="container py-6 md:py-12">
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
              <p className="text-gray-500">See how you stack up against other players!</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search players..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Global Rankings</CardTitle>
                <CardDescription>
                  Compare your performance with other players across different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="battles">
                  <TabsList className="mb-4">
                    <TabsTrigger value="battles">Battle Wins</TabsTrigger>
                    <TabsTrigger value="steps">Daily Steps</TabsTrigger>
                    <TabsTrigger value="sleep">Sleep Quality</TabsTrigger>
                  </TabsList>

                  <TabsContent value="battles">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-5">Player</div>
                        <div className="col-span-2 text-center">Wins</div>
                        <div className="col-span-2 text-center">Losses</div>
                        <div className="col-span-2 text-center">Win %</div>
                      </div>
                      {filterLeaderboard(leaderboardData.battles, searchQuery).map((player, index) => (
                        <div
                          key={index}
                          className={`grid grid-cols-12 gap-2 p-4 items-center ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } ${index === 0 ? "bg-amber-50" : ""}`}
                        >
                          <div className="col-span-1 text-center font-medium flex justify-center">
                            {index === 0 ? (
                              <Medal className="h-5 w-5 text-amber-500" />
                            ) : index === 1 ? (
                              <Medal className="h-5 w-5 text-gray-400" />
                            ) : index === 2 ? (
                              <Medal className="h-5 w-5 text-amber-700" />
                            ) : (
                              player.rank
                            )}
                          </div>
                          <div className="col-span-5 flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-green-100 text-green-800">{player.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center">
                              {player.name}
                              <Badge className="ml-2 bg-green-600">Lvl {player.level}</Badge>
                            </div>
                          </div>
                          <div className="col-span-2 text-center font-medium text-green-600">{player.wins}</div>
                          <div className="col-span-2 text-center text-red-500">{player.losses}</div>
                          <div className="col-span-2 text-center font-medium">
                            {Math.round((player.wins / (player.wins + player.losses)) * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="steps">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-7">Player</div>
                        <div className="col-span-4 text-center">Daily Steps</div>
                      </div>
                      {filterLeaderboard(leaderboardData.steps, searchQuery).map((player, index) => (
                        <div
                          key={index}
                          className={`grid grid-cols-12 gap-2 p-4 items-center ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } ${index === 0 ? "bg-amber-50" : ""}`}
                        >
                          <div className="col-span-1 text-center font-medium flex justify-center">
                            {index === 0 ? (
                              <Medal className="h-5 w-5 text-amber-500" />
                            ) : index === 1 ? (
                              <Medal className="h-5 w-5 text-gray-400" />
                            ) : index === 2 ? (
                              <Medal className="h-5 w-5 text-amber-700" />
                            ) : (
                              player.rank
                            )}
                          </div>
                          <div className="col-span-7 flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-green-100 text-green-800">{player.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center">
                              {player.name}
                              <Badge className="ml-2 bg-green-600">Lvl {player.level}</Badge>
                            </div>
                          </div>
                          <div className="col-span-4 text-center font-medium">{player.steps.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="sleep">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-7">Player</div>
                        <div className="col-span-4 text-center">Avg. Sleep (hrs)</div>
                      </div>
                      {filterLeaderboard(leaderboardData.sleep, searchQuery).map((player, index) => (
                        <div
                          key={index}
                          className={`grid grid-cols-12 gap-2 p-4 items-center ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } ${index === 0 ? "bg-amber-50" : ""}`}
                        >
                          <div className="col-span-1 text-center font-medium flex justify-center">
                            {index === 0 ? (
                              <Medal className="h-5 w-5 text-amber-500" />
                            ) : index === 1 ? (
                              <Medal className="h-5 w-5 text-gray-400" />
                            ) : index === 2 ? (
                              <Medal className="h-5 w-5 text-amber-700" />
                            ) : (
                              player.rank
                            )}
                          </div>
                          <div className="col-span-7 flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-green-100 text-green-800">{player.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center">
                              {player.name}
                              <Badge className="ml-2 bg-green-600">Lvl {player.level}</Badge>
                            </div>
                          </div>
                          <div className="col-span-4 text-center font-medium">{player.hours}</div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
