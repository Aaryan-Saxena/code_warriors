"use client"

import { useEffect, useRef, useState } from "react"

interface TankGameProps {
  playerStats: {
    attack: number
    defense: number
    speed: number
  }
  onGameOver: (score: number) => void
}

export function TankGame({ playerStats, onGameOver }: TankGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(true)

  // Convert player stats to game mechanics
  const tankSpeed = 2 + (playerStats.speed / 100) * 3 // 2-5 pixels per frame
  const bulletDamage = 10 + (playerStats.attack / 100) * 20 // 10-30 damage per hit
  const tankHealth = 100 + (playerStats.defense / 100) * 100 // 100-200 health

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

    // Player tank
    const playerTank = {
      x: canvas.width / 4,
      y: canvas.height - 80,
      width: 40,
      height: 40,
      speed: tankSpeed,
      direction: 0, // 0: up, 1: right, 2: down, 3: left
      health: tankHealth,
      color: "#4ade80",
      lastShot: 0,
    }

    // Opponent tank (AI)
    const opponentTank = {
      x: (canvas.width / 4) * 3,
      y: canvas.height - 80,
      width: 40,
      height: 40,
      speed: 1.5,
      direction: 0,
      health: 120,
      color: "#ef4444",
      lastShot: 0,
      thinkTime: 0,
    }

    // Bullets
    const bullets: {
      x: number
      y: number
      speed: number
      direction: number
      damage: number
      active: boolean
      isPlayer: boolean
    }[] = []

    // Controls
    const keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      e: false, // E for shooting
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

    // Shoot bullet
    const shootBullet = (x: number, y: number, direction: number, damage: number, isPlayer: boolean) => {
      bullets.push({
        x,
        y,
        speed: 5,
        direction,
        damage,
        active: true,
        isPlayer,
      })
    }

    // Update opponent AI
    const updateOpponentAI = () => {
      // Update think time
      opponentTank.thinkTime -= 1

      if (opponentTank.thinkTime <= 0) {
        // Random movement
        const randomDirection = Math.floor(Math.random() * 4)
        opponentTank.direction = randomDirection

        // Random shooting
        if (Math.random() < 0.1) {
          const now = Date.now()
          if (now - opponentTank.lastShot > 800) {
            let bulletX = opponentTank.x + opponentTank.width / 2
            let bulletY = opponentTank.y

            if (opponentTank.direction === 0) {
              // Up
              bulletY = opponentTank.y
            } else if (opponentTank.direction === 1) {
              // Right
              bulletX = opponentTank.x + opponentTank.width
              bulletY = opponentTank.y + opponentTank.height / 2
            } else if (opponentTank.direction === 2) {
              // Down
              bulletY = opponentTank.y + opponentTank.height
            } else if (opponentTank.direction === 3) {
              // Left
              bulletX = opponentTank.x
              bulletY = opponentTank.y + opponentTank.height / 2
            }

            shootBullet(bulletX, bulletY, opponentTank.direction, 15, false)
            opponentTank.lastShot = now
          }
        }

        // Set new think time
        opponentTank.thinkTime = Math.floor(Math.random() * 30) + 10
      }

      // Move opponent based on direction
      if (opponentTank.direction === 0) {
        opponentTank.y = Math.max(0, opponentTank.y - opponentTank.speed)
      } else if (opponentTank.direction === 1) {
        opponentTank.x = Math.min(canvas.width - opponentTank.width, opponentTank.x + opponentTank.speed)
      } else if (opponentTank.direction === 2) {
        opponentTank.y = Math.min(canvas.height - opponentTank.height, opponentTank.y + opponentTank.speed)
      } else if (opponentTank.direction === 3) {
        opponentTank.x = Math.max(0, opponentTank.x - opponentTank.speed)
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

        // Draw grid
        ctx.strokeStyle = "#e2e8f0"
        ctx.lineWidth = 1

        // Vertical grid lines
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }

        // Horizontal grid lines
        for (let y = 0; y < canvas.height; y += 40) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }

        // Update player tank
        if (keys.w) {
          playerTank.y = Math.max(0, playerTank.y - playerTank.speed)
          playerTank.direction = 0
        }
        if (keys.s) {
          playerTank.y = Math.min(canvas.height - playerTank.height, playerTank.y + playerTank.speed)
          playerTank.direction = 2
        }
        if (keys.a) {
          playerTank.x = Math.max(0, playerTank.x - playerTank.speed)
          playerTank.direction = 3
        }
        if (keys.d) {
          playerTank.x = Math.min(canvas.width - playerTank.width, playerTank.x + playerTank.speed)
          playerTank.direction = 1
        }

        // Shoot bullets
        if (keys.e) {
          const now = Date.now()
          if (now - playerTank.lastShot > 300) {
            // Limit shooting rate
            let bulletX = playerTank.x + playerTank.width / 2
            let bulletY = playerTank.y

            if (playerTank.direction === 0) {
              // Up
              bulletY = playerTank.y
            } else if (playerTank.direction === 1) {
              // Right
              bulletX = playerTank.x + playerTank.width
              bulletY = playerTank.y + playerTank.height / 2
            } else if (playerTank.direction === 2) {
              // Down
              bulletY = playerTank.y + playerTank.height
            } else if (playerTank.direction === 3) {
              // Left
              bulletX = playerTank.x
              bulletY = playerTank.y + playerTank.height / 2
            }

            shootBullet(bulletX, bulletY, playerTank.direction, bulletDamage, true)
            playerTank.lastShot = now
          }
        }

        // Update opponent AI
        updateOpponentAI()

        // Update bullets
        for (let i = 0; i < bullets.length; i++) {
          const bullet = bullets[i]
          if (!bullet.active) continue

          // Move bullet based on direction
          if (bullet.direction === 0) bullet.y -= bullet.speed
          else if (bullet.direction === 1) bullet.x += bullet.speed
          else if (bullet.direction === 2) bullet.y += bullet.speed
          else if (bullet.direction === 3) bullet.x -= bullet.speed

          // Check if bullet is out of bounds
          if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullet.active = false
            continue
          }

          // Check collision with tanks
          if (bullet.isPlayer) {
            // Player bullet hits opponent
            if (
              bullet.x >= opponentTank.x &&
              bullet.x <= opponentTank.x + opponentTank.width &&
              bullet.y >= opponentTank.y &&
              bullet.y <= opponentTank.y + opponentTank.height
            ) {
              opponentTank.health -= bullet.damage
              bullet.active = false

              if (opponentTank.health <= 0) {
                setScore((prevScore) => prevScore + 100)
                setGameActive(false)
                onGameOver(score + 100)
              }
            }
          } else {
            // Opponent bullet hits player
            if (
              bullet.x >= playerTank.x &&
              bullet.x <= playerTank.x + playerTank.width &&
              bullet.y >= playerTank.y &&
              bullet.y <= playerTank.y + playerTank.height
            ) {
              playerTank.health -= bullet.damage
              bullet.active = false

              if (playerTank.health <= 0) {
                setGameActive(false)
                onGameOver(score)
              }
            }
          }
        }

        // Remove inactive bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
          if (!bullets[i].active) {
            bullets.splice(i, 1)
          }
        }

        // Draw player tank
        ctx.fillStyle = playerTank.color
        ctx.fillRect(playerTank.x, playerTank.y, playerTank.width, playerTank.height)

        // Draw player tank cannon based on direction
        ctx.fillStyle = "#333"
        if (playerTank.direction === 0) {
          // Up
          ctx.fillRect(playerTank.x + playerTank.width / 2 - 3, playerTank.y - 10, 6, 10)
        } else if (playerTank.direction === 1) {
          // Right
          ctx.fillRect(playerTank.x + playerTank.width, playerTank.y + playerTank.height / 2 - 3, 10, 6)
        } else if (playerTank.direction === 2) {
          // Down
          ctx.fillRect(playerTank.x + playerTank.width / 2 - 3, playerTank.y + playerTank.height, 6, 10)
        } else if (playerTank.direction === 3) {
          // Left
          ctx.fillRect(playerTank.x - 10, playerTank.y + playerTank.height / 2 - 3, 10, 6)
        }

        // Draw opponent tank
        ctx.fillStyle = opponentTank.color
        ctx.fillRect(opponentTank.x, opponentTank.y, opponentTank.width, opponentTank.height)

        // Draw opponent tank cannon based on direction
        ctx.fillStyle = "#333"
        if (opponentTank.direction === 0) {
          // Up
          ctx.fillRect(opponentTank.x + opponentTank.width / 2 - 3, opponentTank.y - 10, 6, 10)
        } else if (opponentTank.direction === 1) {
          // Right
          ctx.fillRect(opponentTank.x + opponentTank.width, opponentTank.y + opponentTank.height / 2 - 3, 10, 6)
        } else if (opponentTank.direction === 2) {
          // Down
          ctx.fillRect(opponentTank.x + opponentTank.width / 2 - 3, opponentTank.y + opponentTank.height, 6, 10)
        } else if (opponentTank.direction === 3) {
          // Left
          ctx.fillRect(opponentTank.x - 10, opponentTank.y + opponentTank.height / 2 - 3, 10, 6)
        }

        // Draw bullets
        ctx.fillStyle = "#ff0"
        for (const bullet of bullets) {
          if (bullet.active) {
            ctx.beginPath()
            ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        // Draw health bars
        // Player health bar
        const playerHealthPercentage = playerTank.health / tankHealth
        ctx.fillStyle = "#000"
        ctx.fillRect(10, 10, 204, 24)
        ctx.fillStyle = playerHealthPercentage > 0.5 ? "#4ade80" : playerHealthPercentage > 0.25 ? "#fbbf24" : "#ef4444"
        ctx.fillRect(12, 12, 200 * playerHealthPercentage, 20)
        ctx.fillStyle = "#fff"
        ctx.font = "14px Arial"
        ctx.fillText(`Health: ${Math.floor(playerTank.health)}`, 15, 28)

        // Opponent health bar
        const opponentHealthPercentage = opponentTank.health / 120
        ctx.fillStyle = "#000"
        ctx.fillRect(canvas.width - 214, 10, 204, 24)
        ctx.fillStyle =
          opponentHealthPercentage > 0.5 ? "#4ade80" : opponentHealthPercentage > 0.25 ? "#fbbf24" : "#ef4444"
        ctx.fillRect(canvas.width - 212, 12, 200 * opponentHealthPercentage, 20)
        ctx.fillStyle = "#fff"
        ctx.fillText(`Enemy: ${Math.floor(opponentTank.health)}`, canvas.width - 200, 28)

        // Draw score
        ctx.fillStyle = "#000"
        ctx.fillRect(canvas.width / 2 - 50, 10, 100, 24)
        ctx.fillStyle = "#fff"
        ctx.textAlign = "center"
        ctx.fillText(`Score: ${score}`, canvas.width / 2, 28)
        ctx.textAlign = "left"
      }

      animationFrameId = requestAnimationFrame(gameLoop)
    }

    // Initialize game
    const lastShot = 0
    animationFrameId = requestAnimationFrame(gameLoop)

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [playerStats, score, gameActive, onGameOver, bulletDamage, tankHealth, tankSpeed])

  return <canvas ref={canvasRef} className="w-full h-full bg-white" tabIndex={0} />
}
