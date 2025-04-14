"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, User, Shield, Zap, Gamepad2, Sword, ChevronRight, Trophy } from "lucide-react"
import { mockFitnessData } from "@/lib/mock-data"
import { CharacterStats } from "@/components/character-stats"
import { TankGame } from "@/components/games/tank-game"
import { SnakeGame } from "@/components/games/snake-game"
import { SumoGame } from "@/components/games/sumo-game"
import { GameControls } from "@/components/games/game-controls"
import { motion } from "framer-motion"

export default function GamePage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [fitnessData, setFitnessData] = useState(mockFitnessData)
  const [isLoading, setIsLoading] = useState(true)
  const [gameScore, setGameScore] = useState(0)
  const [showGameOver, setShowGameOver] = useState(false)

  // Calculate player stats based on fitness data
  const playerStats = {
    attack: Math.min(80 + (fitnessData.steps / 1000) * 5, 100),
    defense: Math.min(70 + (fitnessData.sleepHours / 8) * 30, 100),
    speed: Math.min(60 + (fitnessData.activeMinutes / 60) * 40, 100),
  }

  useEffect(() => {
    // Simulate loading fitness data
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleGameOver = (score: number) => {
    setGameScore(score)
    setShowGameOver(true)
  }

  const resetGame = () => {
    setSelectedGame(null)
    setShowGameOver(false)
    setGameScore(0)
  }

  const renderSelectedGame = () => {
    switch (selectedGame) {
      case "tank":
        return <TankGame playerStats={playerStats} onGameOver={handleGameOver} />
      case "snake":
        return <SnakeGame playerStats={playerStats} onGameOver={handleGameOver} />
      case "sumo":
        return <SumoGame playerStats={playerStats} onGameOver={handleGameOver} />
      default:
        return null
    }
  }

  const getGameControls = () => {
    switch (selectedGame) {
      case "tank":
        return {
          title: "Tank Battle Controls",
          controls: [
            { key: "W", action: "Move Up" },
            { key: "A", action: "Move Left" },
            { key: "S", action: "Move Down" },
            { key: "D", action: "Move Right" },
            { key: "E", action: "Fire" },
          ],
          description: "Destroy enemy tanks before they destroy you! Your attack power is based on your daily steps.",
        }
      case "snake":
        return {
          title: "Snake Game Controls",
          controls: [
            { key: "W", action: "Move Up" },
            { key: "A", action: "Move Left" },
            { key: "S", action: "Move Down" },
            { key: "D", action: "Move Right" },
            { key: "Q", action: "Boost (uses energy)" },
          ],
          description: "Eat food to grow longer than your opponent! Your speed is based on your active minutes.",
        }
      case "sumo":
        return {
          title: "Sumo Wrestling Controls",
          controls: [
            { key: "W", action: "Move Up" },
            { key: "A", action: "Move Left" },
            { key: "S", action: "Move Down" },
            { key: "D", action: "Move Right" },
            { key: "E", action: "Push" },
          ],
          description: "Push your opponent out of the ring! Your weight and stability are based on your sleep quality.",
        }
      default:
        return {
          title: "",
          controls: [],
          description: "",
        }
    }
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
      <main className="flex-1 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto py-6 md:py-12">
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Game Arena</h1>
              <p className="text-gray-500">Your fitness stats power your character in these mini-games!</p>
            </div>

            {selectedGame ? (
              <div className="grid gap-6 lg:grid-cols-4">
                <motion.div
                  className="lg:col-span-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-green-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="capitalize">{selectedGame} Game</CardTitle>
                          <CardDescription>{getGameControls().description}</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={resetGame}>
                          Back to Games
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {showGameOver ? (
                        <motion.div
                          className="flex flex-col items-center justify-center p-8 text-center"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <Trophy className="h-10 w-10 text-green-600" />
                          </div>
                          <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
                          <p className="text-xl mb-4">Your Score: {gameScore}</p>
                          <Button
                            onClick={() => setShowGameOver(false)}
                            className="bg-green-600 hover:bg-green-700 mb-2"
                          >
                            Play Again
                          </Button>
                          <Button variant="outline" onClick={resetGame}>
                            Choose Another Game
                          </Button>
                        </motion.div>
                      ) : (
                        <div className="w-full aspect-[16/9] bg-white relative">{renderSelectedGame()}</div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="space-y-6">
                    <GameControls title={getGameControls().title} controls={getGameControls().controls} />

                    <Card>
                      <CardHeader>
                        <CardTitle>Your Character Stats</CardTitle>
                        <CardDescription>Powered by your real-world activity</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CharacterStats fitnessData={fitnessData} isLoading={isLoading} />
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    id: "tank",
                    title: "Tank Battle",
                    description:
                      "Control your tank and destroy enemy tanks. Your attack power is based on your daily steps!",
                    icon: <Gamepad2 className="h-16 w-16 text-white" />,
                    gradient: "from-green-400 to-green-600",
                    buttonColor: "bg-green-600 hover:bg-green-700",
                  },
                  {
                    id: "snake",
                    title: "Snake Game",
                    description:
                      "Control a snake to eat food and grow longer. Your speed is based on your active minutes!",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M10 16v-6a2 2 0 1 1 4 0v6"></path>
                        <path d="M10 13h4"></path>
                        <circle cx="12" cy="5" r="1"></circle>
                        <path d="M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
                      </svg>
                    ),
                    gradient: "from-blue-400 to-blue-600",
                    buttonColor: "bg-blue-600 hover:bg-blue-700",
                  },
                  {
                    id: "sumo",
                    title: "Sumo Wrestling",
                    description: "Push your opponent out of the ring. Your defense is based on your sleep quality!",
                    icon: <Sword className="h-16 w-16 text-white" />,
                    gradient: "from-purple-400 to-purple-600",
                    buttonColor: "bg-purple-600 hover:bg-purple-700",
                  },
                ].map((game) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: ["tank", "snake", "sumo"].indexOf(game.id) * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className={`aspect-video bg-gradient-to-br ${game.gradient} relative`}>
                        <div className="absolute inset-0 flex items-center justify-center">{game.icon}</div>
                      </div>
                      <CardHeader>
                        <CardTitle>{game.title}</CardTitle>
                        <CardDescription>{game.description}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button className={`w-full ${game.buttonColor}`} onClick={() => setSelectedGame(game.id)}>
                          Play Now <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}

                <motion.div
                  className="md:col-span-2 lg:col-span-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Character Stats</CardTitle>
                      <CardDescription>These stats affect your performance in games</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <CharacterStats fitnessData={fitnessData} isLoading={isLoading} />
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">How Stats Affect Games</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <div className="mr-2 mt-1 bg-amber-100 p-1 rounded-full">
                                <Zap className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                <span className="font-medium">Attack:</span> Increases damage in Tank Battle and bite
                                size in Snake Game
                              </div>
                            </li>
                            <li className="flex items-start">
                              <div className="mr-2 mt-1 bg-blue-100 p-1 rounded-full">
                                <Shield className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <span className="font-medium">Defense:</span> Increases your weight and stability in
                                Sumo Wrestling
                              </div>
                            </li>
                            <li className="flex items-start">
                              <div className="mr-2 mt-1 bg-purple-100 p-1 rounded-full">
                                <Zap className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <span className="font-medium">Speed:</span> Increases movement speed in all games
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
