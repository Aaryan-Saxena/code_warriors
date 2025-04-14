"use client"

import { useEffect, useRef, useState } from "react"

interface SumoGameProps {
  playerStats: {
    attack: number
    defense: number
    speed: number
  }
  onGameOver: (score: number) => void
}

export function SumoGame({ playerStats, onGameOver }: SumoGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(true)
  const [round, setRound] = useState(1)

  // Convert player stats to game mechanics
  const playerSpeed = 3 + (playerStats.speed / 100) * 4 // 3-7 pixels per frame
  const playerSize = 40 + (playerStats.defense / 100) * 30 // 40-70 pixels
  const playerStrength = 5 + (playerStats.attack / 100) * 10 // 5-15 push force

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Game state
    let animationFrameId: number
    let lastTimestamp = 0
    const FPS = 60
    const frameInterval = 1000 / FPS
    const isPushing = false

    // Ring
    const ringRadius = Math.min(canvas.width, canvas.height) * 0.4
    const ringCenterX = canvas.width / 2
    const ringCenterY = canvas.height / 2

    // Player
    const player = {
      x: ringCenterX - 50,
      y: ringCenterY,
      size: playerSize,
      speed: playerSpeed,
      strength: playerStrength,
      color: "#4ade80",
    }

    // Opponent
    const opponent = {
      x: ringCenterX + 50,
      y: ringCenterY,
      size: 40 + round * 5, // Increases with each round
      speed: 2 + round * 0.5, // Increases with each round
      strength: 5 + round * 1, // Increases with each round
      color: "#ef4444",
      direction: { x: 0, y: 0 },
      thinkTime: 0,
    }

    // Controls
    const keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      e: false, // E for pushing
    }

    // Event listeners for controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keys.hasOwnProperty(e.key.toLowerCase())) {
        keys[e.key.toLowerCase() as keyof typeof keys] = true
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keys.hasOwnProperty(e.key.toLowerCase())) {
        keys[e.key.toLowerCase() as keyof typeof keys] = false
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    // Check if a point is inside the ring
    const isInsideRing = (x: number, y: number) => {
      const distance = Math.sqrt((x - ringCenterX) ** 2 + (y - ringCenterY) ** 2)
      return distance < ringRadius
    }

    // Check collision between two circles
    const checkCollision = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number) => {
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
      return distance < r1 + r2
    }

    // AI for opponent
    const updateOpponentAI = () => {
      // Update think time
      opponent.thinkTime -= 1

      if (opponent.thinkTime <= 0) {
        // Calculate direction towards player
        const dx = player.x - opponent.x
        const dy = player.y - opponent.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Normalize direction
        opponent.direction = {
          x: dx / distance,
          y: dy / distance,
        }

        // Add some randomness
        if (Math.random() < 0.2) {
          opponent.direction.x += (Math.random() - 0.5) * 2
          opponent.direction.y += (Math.random() - 0.5) * 2

          // Normalize again
          const newDist = Math.sqrt(
            opponent.direction.x * opponent.direction.x + opponent.direction.y * opponent.direction.y,
          )

          opponent.direction.x /= newDist
          opponent.direction.y /= newDist
        }

        // Set new think time
        opponent.thinkTime = Math.floor(Math.random() * 30) + 10
      }

      // Move opponent
      opponent.x += opponent.direction.x * opponent.speed
      opponent.y += opponent.direction.y * opponent.speed

      // Keep opponent in ring
      if (!isInsideRing(opponent.x, opponent.y)) {
        // Move back towards center
        const dx = ringCenterX - opponent.x
        const dy = ringCenterY - opponent.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        opponent.x += (dx / distance) * opponent.speed
        opponent.y += (dy / distance) * opponent.speed
      }
    }

    // Game loop
    const gameLoop = (timestamp: number) => {
      if (!gameActive) return

      // Calculate delta time
      const deltaTime = timestamp - lastTimestamp

      // Only update if enough time has passed
      if (deltaTime > frameInterval) {
        lastTimestamp = timestamp - (deltaTime % frameInterval)

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw background
        ctx.fillStyle = "#f8fafc"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw ring
        ctx.beginPath()
        ctx.arc(ringCenterX, ringCenterY, ringRadius, 0, Math.PI * 2)
        ctx.fillStyle = "#f5f5dc" // Beige color for sumo ring
        ctx.fill()

        ctx.beginPath()
        ctx.arc(ringCenterX, ringCenterY, ringRadius, 0, Math.PI * 2)
        ctx.strokeStyle = "#8b4513" // Brown color for ring border
        ctx.lineWidth = 10
        ctx.stroke()

        // Draw center line
        ctx.beginPath()
        ctx.arc(ringCenterX, ringCenterY, ringRadius * 0.5, 0, Math.PI * 2)
        ctx.strokeStyle = "#8b4513"
        ctx.lineWidth = 2
        ctx.stroke()

        // Update player position based on keys
        let playerDx = 0
        let playerDy = 0

        if (keys.w) playerDy -= player.speed
        if (keys.s) playerDy += player.speed
        if (keys.a) playerDx -= player.speed
        if (keys.d) playerDx += player.speed

        // Normalize diagonal movement
        if (playerDx !== 0 && playerDy !== 0) {
          const magnitude = Math.sqrt(playerDx * playerDx + playerDy * playerDy)
          playerDx = (playerDx / magnitude) * player.speed
          playerDy = (playerDy / magnitude) * player.speed
        }

        player.x += playerDx
        player.y += playerDy

        // Update opponent AI
        updateOpponentAI()

        // Check collision between player and opponent
        if (checkCollision(player.x, player.y, player.size / 2, opponent.x, opponent.y, opponent.size / 2)) {
          // Calculate collision response
          const dx = opponent.x - player.x
          const dy = opponent.y - player.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Normalize direction
          const nx = dx / distance
          const ny = dy / distance

          // Apply forces based on strength
          const playerForce = player.strength * (keys.e ? 2 : 1) // Double force when pushing
          const opponentForce = opponent.strength

          // Move opponent away from player
          opponent.x += nx * playerForce
          opponent.y += ny * playerForce

          // Move player away from opponent
          player.x -= nx * opponentForce
          player.y -= ny * opponentForce
        }

        // Check if player is outside the ring
        if (!isInsideRing(player.x, player.y)) {
          // Player loses
          setGameActive(false)
          onGameOver(score)
          return
        }

        // Check if opponent is outside the ring
        if (!isInsideRing(opponent.x, opponent.y)) {
          // Player wins round
          setScore((prevScore) => prevScore + 100 * round)
          setRound((prevRound) => prevRound + 1)

          // Reset positions for next round
          player.x = ringCenterX - 50
          player.y = ringCenterY

          opponent.x = ringCenterX + 50
          opponent.y = ringCenterY
          opponent.size = 40 + round * 5
          opponent.speed = 2 + round * 0.5
          opponent.strength = 5 + round * 1

          return
        }

        // Draw player
        ctx.beginPath()
        ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2)
        ctx.fillStyle = player.color
        ctx.fill()
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw player face
        const faceRadius = player.size / 6
        ctx.beginPath()
        ctx.arc(player.x, player.y, faceRadius, 0, Math.PI * 2)
        ctx.fillStyle = "#fff"
        ctx.fill()

        // Draw player eyes
        const eyeRadius = faceRadius / 3
        ctx.fillStyle = "#000"
        ctx.beginPath()
        ctx.arc(player.x - faceRadius / 2, player.y - faceRadius / 3, eyeRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(player.x + faceRadius / 2, player.y - faceRadius / 3, eyeRadius, 0, Math.PI * 2)
        ctx.fill()

        // Draw player mouth
        ctx.beginPath()
        ctx.arc(player.x, player.y + faceRadius / 3, faceRadius / 2, 0, Math.PI)
        ctx.stroke()

        // Draw opponent
        ctx.beginPath()
        ctx.arc(opponent.x, opponent.y, opponent.size / 2, 0, Math.PI * 2)
        ctx.fillStyle = opponent.color
        ctx.fill()
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw opponent face
        const oppFaceRadius = opponent.size / 6
        ctx.beginPath()
        ctx.arc(opponent.x, opponent.y, oppFaceRadius, 0, Math.PI * 2)
        ctx.fillStyle = "#fff"
        ctx.fill()

        // Draw opponent eyes (angry)
        const oppEyeRadius = oppFaceRadius / 3
        ctx.fillStyle = "#000"
        ctx.beginPath()
        ctx.arc(opponent.x - oppFaceRadius / 2, opponent.y - oppFaceRadius / 3, oppEyeRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(opponent.x + oppFaceRadius / 2, opponent.y - oppFaceRadius / 3, oppEyeRadius, 0, Math.PI * 2)
        ctx.fill()

        // Draw opponent mouth (frown)
        ctx.beginPath()
        ctx.arc(opponent.x, opponent.y + oppFaceRadius / 2, oppFaceRadius / 2, Math.PI, 0)
        ctx.stroke()

        // Draw score and round info
        ctx.fillStyle = "#000"
        ctx.font = "20px Arial"
        ctx.fillText(`Score: ${score}`, 10, 30)
        ctx.fillText(`Round: ${round}`, 10, 60)
        ctx.fillText(`Player Size: ${Math.floor(player.size)}`, 10, 90)
        ctx.fillText(`Player Strength: ${Math.floor(player.strength)}`, 10, 120)

        // Draw push indicator
        if (keys.e) {
          ctx.fillStyle = "rgba(74, 222, 128, 0.3)"
          ctx.beginPath()
          ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop)
    }

    // Start game loop
    animationFrameId = requestAnimationFrame(gameLoop)

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [playerStats, score, gameActive, onGameOver, round, playerSize, playerSpeed, playerStrength])

  return <canvas ref={canvasRef} className="w-full h-full bg-white" tabIndex={0} />
}
