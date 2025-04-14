"use client"

import { useEffect, useRef, useState } from "react"

interface SnakeGameProps {
  playerStats: {
    attack: number
    defense: number
    speed: number
  }
  onGameOver: (score: number) => void
}

export function SnakeGame({ playerStats, onGameOver }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(true)

  // Convert player stats to game mechanics
  const snakeSpeed = 5 + Math.floor((playerStats.speed / 100) * 10) // 5-15 frames per movement
  const growthRate = 1 + Math.floor((playerStats.attack / 100) * 2) // 1-3 segments per food
  const initialLength = 3 + Math.floor((playerStats.defense / 100) * 5) // 3-8 initial segments

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

    // Game constants
    const GRID_SIZE = 20
    const GRID_WIDTH = Math.floor(canvas.width / GRID_SIZE)
    const GRID_HEIGHT = Math.floor(canvas.height / GRID_SIZE)

    // Game state
    let animationFrameId: number
    let lastTimestamp = 0
    let frameCount = 0
    let boostActive = false
    let boostEnergy = 100
    const boostRechargeRate = 0.5

    // Player Snake
    const playerSnake = {
      body: Array.from({ length: initialLength }, (_, i) => ({
        x: Math.floor(GRID_WIDTH / 4) - i,
        y: Math.floor(GRID_HEIGHT / 2),
      })),
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      color: "#4ade80",
    }

    // AI Snake
    const aiSnake = {
      body: Array.from({ length: 5 }, (_, i) => ({
        x: Math.floor((GRID_WIDTH / 4) * 3) - i,
        y: Math.floor(GRID_HEIGHT / 2),
      })),
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      color: "#ef4444",
      thinkTime: 0,
    }

    // Food
    const foods: { x: number; y: number; color: string }[] = []

    // Generate food at random position
    const generateFood = () => {
      let newX, newY
      let validPosition = false

      while (!validPosition) {
        newX = Math.floor(Math.random() * GRID_WIDTH)
        newY = Math.floor(Math.random() * GRID_HEIGHT)
        validPosition = true

        // Check if food is not on player snake
        for (const segment of playerSnake.body) {
          if (segment.x === newX && segment.y === newY) {
            validPosition = false
            break
          }
        }

        // Check if food is not on AI snake
        if (validPosition) {
          for (const segment of aiSnake.body) {
            if (segment.x === newX && segment.y === newY) {
              validPosition = false
              break
            }
          }
        }

        // Check if food is not on other food
        if (validPosition) {
          for (const food of foods) {
            if (food.x === newX && food.y === newY) {
              validPosition = false
              break
            }
          }
        }
      }

      foods.push({
        x: newX,
        y: newY,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      })
    }

    // Controls
    const keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      q: false, // Q for boost
    }

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

    // Update AI snake
    const updateAISnake = () => {
      // Update think time
      aiSnake.thinkTime -= 1

      if (aiSnake.thinkTime <= 0) {
        // Find closest food
        let closestFood = null
        let closestDistance = Number.POSITIVE_INFINITY

        for (const food of foods) {
          const distance = Math.sqrt(Math.pow(food.x - aiSnake.body[0].x, 2) + Math.pow(food.y - aiSnake.body[0].y, 2))
          if (distance < closestDistance) {
            closestDistance = distance
            closestFood = food
          }
        }

        // Move towards closest food
        if (closestFood) {
          const head = aiSnake.body[0]

          // Decide direction based on food position
          if (Math.abs(closestFood.x - head.x) > Math.abs(closestFood.y - head.y)) {
            // Move horizontally
            if (closestFood.x > head.x && aiSnake.direction.x !== -1) {
              aiSnake.nextDirection = { x: 1, y: 0 }
            } else if (closestFood.x < head.x && aiSnake.direction.x !== 1) {
              aiSnake.nextDirection = { x: -1, y: 0 }
            } else {
              // Can't move horizontally, try vertically
              if (closestFood.y > head.y && aiSnake.direction.y !== -1) {
                aiSnake.nextDirection = { x: 0, y: 1 }
              } else if (closestFood.y < head.y && aiSnake.direction.y !== 1) {
                aiSnake.nextDirection = { x: 0, y: -1 }
              }
            }
          } else {
            // Move vertically
            if (closestFood.y > head.y && aiSnake.direction.y !== -1) {
              aiSnake.nextDirection = { x: 0, y: 1 }
            } else if (closestFood.y < head.y && aiSnake.direction.y !== 1) {
              aiSnake.nextDirection = { x: 0, y: -1 }
            } else {
              // Can't move vertically, try horizontally
              if (closestFood.x > head.x && aiSnake.direction.x !== -1) {
                aiSnake.nextDirection = { x: 1, y: 0 }
              } else if (closestFood.x < head.x && aiSnake.direction.x !== 1) {
                aiSnake.nextDirection = { x: -1, y: 0 }
              }
            }
          }

          // Avoid collisions with walls
          const nextX = head.x + aiSnake.nextDirection.x
          const nextY = head.y + aiSnake.nextDirection.y

          if (nextX < 0 || nextX >= GRID_WIDTH || nextY < 0 || nextY >= GRID_HEIGHT) {
            // Random direction that doesn't hit wall
            const possibleDirections = []

            if (head.x > 0 && aiSnake.direction.x !== 1) {
              possibleDirections.push({ x: -1, y: 0 })
            }
            if (head.x < GRID_WIDTH - 1 && aiSnake.direction.x !== -1) {
              possibleDirections.push({ x: 1, y: 0 })
            }
            if (head.y > 0 && aiSnake.direction.y !== 1) {
              possibleDirections.push({ x: 0, y: -1 })
            }
            if (head.y < GRID_HEIGHT - 1 && aiSnake.direction.y !== -1) {
              possibleDirections.push({ x: 0, y: 1 })
            }

            if (possibleDirections.length > 0) {
              const randomIndex = Math.floor(Math.random() * possibleDirections.length)
              aiSnake.nextDirection = possibleDirections[randomIndex]
            }
          }

          // Avoid collisions with self
          for (let i = 1; i < aiSnake.body.length; i++) {
            if (nextX === aiSnake.body[i].x && nextY === aiSnake.body[i].y) {
              // Random direction that doesn't hit self
              const possibleDirections = []

              if (
                aiSnake.direction.x !== 1 &&
                !aiSnake.body.some((segment) => segment.x === head.x - 1 && segment.y === head.y)
              ) {
                possibleDirections.push({ x: -1, y: 0 })
              }
              if (
                aiSnake.direction.x !== -1 &&
                !aiSnake.body.some((segment) => segment.x === head.x + 1 && segment.y === head.y)
              ) {
                possibleDirections.push({ x: 1, y: 0 })
              }
              if (
                aiSnake.direction.y !== 1 &&
                !aiSnake.body.some((segment) => segment.x === head.x && segment.y === head.y - 1)
              ) {
                possibleDirections.push({ x: 0, y: -1 })
              }
              if (
                aiSnake.direction.y !== -1 &&
                !aiSnake.body.some((segment) => segment.x === head.x && segment.y === head.y + 1)
              ) {
                possibleDirections.push({ x: 0, y: 1 })
              }

              if (possibleDirections.length > 0) {
                const randomIndex = Math.floor(Math.random() * possibleDirections.length)
                aiSnake.nextDirection = possibleDirections[randomIndex]
              }
              break
            }
          }
        }

        // Set new think time
        aiSnake.thinkTime = Math.floor(Math.random() * 5) + 1
      }
    }

    // Initialize food
    generateFood()
    generateFood()

    // Game loop
    const gameLoop = (timestamp: number) => {
      if (!gameActive) return

      // Calculate delta time
      const deltaTime = timestamp - lastTimestamp

      // Handle player input
      if (keys.w && playerSnake.direction.y === 0) {
        playerSnake.nextDirection = { x: 0, y: -1 }
      } else if (keys.s && playerSnake.direction.y === 0) {
        playerSnake.nextDirection = { x: 0, y: 1 }
      } else if (keys.a && playerSnake.direction.x === 0) {
        playerSnake.nextDirection = { x: -1, y: 0 }
      } else if (keys.d && playerSnake.direction.x === 0) {
        playerSnake.nextDirection = { x: 1, y: 0 }
      }

      // Handle boost
      boostActive = keys.q && boostEnergy > 0

      if (boostActive) {
        boostEnergy = Math.max(0, boostEnergy - 1)
      } else {
        boostEnergy = Math.min(100, boostEnergy + boostRechargeRate)
      }

      // Update game state
      frameCount++
      const speedModifier = boostActive ? 0.5 : 1
      if (frameCount >= snakeSpeed * speedModifier) {
        frameCount = 0

        // Update AI
        updateAISnake()

        // Update player snake direction
        playerSnake.direction = playerSnake.nextDirection

        // Update AI snake direction
        aiSnake.direction = aiSnake.nextDirection

        // Move player snake
        const playerHead = { x: playerSnake.body[0].x, y: playerSnake.body[0].y }
        const playerNewHead = {
          x: playerHead.x + playerSnake.direction.x,
          y: playerHead.y + playerSnake.direction.y,
        }

        // Move AI snake
        const aiHead = { x: aiSnake.body[0].x, y: aiSnake.body[0].y }
        const aiNewHead = {
          x: aiHead.x + aiSnake.direction.x,
          y: aiHead.y + aiSnake.direction.y,
        }

        // Check wall collision for player
        if (
          playerNewHead.x < 0 ||
          playerNewHead.x >= GRID_WIDTH ||
          playerNewHead.y < 0 ||
          playerNewHead.y >= GRID_HEIGHT
        ) {
          setGameActive(false)
          onGameOver(score)
          return
        }

        // Check wall collision for AI
        if (aiNewHead.x < 0 || aiNewHead.x >= GRID_WIDTH || aiNewHead.y < 0 || aiNewHead.y >= GRID_HEIGHT) {
          // AI loses
          setScore((prevScore) => prevScore + 100)
          setGameActive(false)
          onGameOver(score + 100)
          return
        }

        // Check self collision for player
        for (let i = 0; i < playerSnake.body.length; i++) {
          if (playerNewHead.x === playerSnake.body[i].x && playerNewHead.y === playerSnake.body[i].y) {
            setGameActive(false)
            onGameOver(score)
            return
          }
        }

        // Check self collision for AI
        for (let i = 0; i < aiSnake.body.length; i++) {
          if (aiNewHead.x === aiSnake.body[i].x && aiNewHead.y === aiSnake.body[i].y) {
            // AI loses
            setScore((prevScore) => prevScore + 100)
            setGameActive(false)
            onGameOver(score + 100)
            return
          }
        }

        // Check collision between player and AI
        for (let i = 0; i < aiSnake.body.length; i++) {
          if (playerNewHead.x === aiSnake.body[i].x && playerNewHead.y === aiSnake.body[i].y) {
            setGameActive(false)
            onGameOver(score)
            return
          }
        }

        for (let i = 0; i < playerSnake.body.length; i++) {
          if (aiNewHead.x === playerSnake.body[i].x && aiNewHead.y === playerSnake.body[i].y) {
            // AI loses
            setScore((prevScore) => prevScore + 100)
            setGameActive(false)
            onGameOver(score + 100)
            return
          }
        }

        // Add new heads
        playerSnake.body.unshift(playerNewHead)
        aiSnake.body.unshift(aiNewHead)

        // Check food collision for player
        let playerAteFood = false
        for (let i = 0; i < foods.length; i++) {
          if (playerNewHead.x === foods[i].x && playerNewHead.y === foods[i].y) {
            // Grow snake by growthRate segments
            for (let j = 0; j < growthRate - 1; j++) {
              const tail = playerSnake.body[playerSnake.body.length - 1]
              playerSnake.body.push({ x: tail.x, y: tail.y })
            }

            // Update score
            setScore((prevScore) => prevScore + 10)

            // Remove food
            foods.splice(i, 1)
            playerAteFood = true
            break
          }
        }

        // Check food collision for AI
        let aiAteFood = false
        for (let i = 0; i < foods.length; i++) {
          if (aiNewHead.x === foods[i].x && aiNewHead.y === foods[i].y) {
            // Grow AI snake
            for (let j = 0; j < 2; j++) {
              const tail = aiSnake.body[aiSnake.body.length - 1]
              aiSnake.body.push({ x: tail.x, y: tail.y })
            }

            // Remove food
            foods.splice(i, 1)
            aiAteFood = true
            break
          }
        }

        // Generate new food if needed
        if (playerAteFood || aiAteFood) {
          generateFood()
        }

        // Remove tails if no food eaten
        if (!playerAteFood) {
          playerSnake.body.pop()
        }
        if (!aiAteFood) {
          aiSnake.body.pop()
        }

        // Check win condition
        if (playerSnake.body.length >= 20) {
          setScore((prevScore) => prevScore + 200)
          setGameActive(false)
          onGameOver(score + 200)
          return
        }

        if (aiSnake.body.length >= 20) {
          setGameActive(false)
          onGameOver(score)
          return
        }
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      ctx.fillStyle = "#f8fafc"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 0.5
      for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = 0; y < GRID_HEIGHT; y++) {
          ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        }
      }

      // Draw player snake
      for (let i = 0; i < playerSnake.body.length; i++) {
        const segment = playerSnake.body[i]

        // Gradient color from head to tail
        const hue = 120 - (i / playerSnake.body.length) * 60
        ctx.fillStyle = i === 0 ? "#4ade80" : `hsl(${hue}, 70%, 50%)`

        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE)

        // Draw eyes on head
        if (i === 0) {
          ctx.fillStyle = "#000"
          const eyeSize = GRID_SIZE / 5

          if (playerSnake.direction.x === 1) {
            ctx.fillRect((segment.x + 0.7) * GRID_SIZE, (segment.y + 0.3) * GRID_SIZE, eyeSize, eyeSize)
            ctx.fillRect((segment.x + 0.7) * GRID_SIZE, (segment.y + 0.7) * GRID_SIZE, eyeSize, eyeSize)
          } else if (playerSnake.direction.x === -1) {
            ctx.fillRect((segment.x + 0.3) * GRID_SIZE, (segment.y + 0.3) * GRID_SIZE, eyeSize, eyeSize)
            ctx.fillRect((segment.x + 0.3) * GRID_SIZE, (segment.y + 0.7) * GRID_SIZE, eyeSize, eyeSize)
          } else if (playerSnake.direction.y === 1) {
            ctx.fillRect((segment.x + 0.3) * GRID_SIZE, (segment.y + 0.7) * GRID_SIZE, eyeSize, eyeSize)
            ctx.fillRect((segment.x + 0.7) * GRID_SIZE, (segment.y + 0.7) * GRID_SIZE, eyeSize, eyeSize)
          } else if (playerSnake.direction.y === -1) {
            ctx.fillRect((segment.x + 0.3) * GRID_SIZE, (segment.y + 0.3) * GRID_SIZE, eyeSize, eyeSize)
            ctx.fillRect((segment.x + 0.7) * GRID_SIZE, (segment.y + 0.3) * GRID_SIZE, eyeSize, eyeSize)
          }
        }
      }

      // Draw AI snake
      for (let i = 0; i < aiSnake.body.length; i++) {
        const segment = aiSnake.body[i]

        // Gradient color from head to tail
        const hue = 0 - (i / aiSnake.body.length) * 60
        ctx.fillStyle = i === 0 ? "#ef4444" : `hsl(${hue}, 70%, 50%)`

        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE)

        // Draw eyes on head
        if (i === 0) {
          ctx.fillStyle = "#000"
          const eyeSize = GRID_SIZE / 5

          if (aiSnake.direction.x === 1) {
            ctx.fillRect((segment.x + 0.7) * GRID_SIZE, (segment.y + 0.3) * GRID_SIZE, eyeSize, eyeSize)
            ctx.fillRect((segment.x + 0.7) * GRID_SIZE, (segment.y + 0.7) * GRID_SIZE, eyeSize, eyeSize)
          } else if (aiSnake.direction.x === -1) {
            ctx.fillRect((segment.x + 0.3) * GRID_SIZE, (segment.y + 0.3) * GRID_SIZE, eyeSize, eyeSize)
            ctx.fillRect((segment.x + 0.3) * GRID_SIZE, (segment.y + 0.7) * GRID_SIZE, eyeSize, eyeSize)
          } else if (aiSnake.direction.y === 1) {
            ctx.fillRect((segment.x + 0.3) * GRID_SIZE, (segment.y + 0.7) * GRID_SIZE, eyeSize, eyeSize)
            ctx.fillRect((segment.x + 0.7) * GRID_SIZE, (segment.y + 0.7) * GRID_SIZE, eyeSize, eyeSize)
          } else if (aiSnake.direction.y === -1) {
            ctx.fillRect((segment.x + 0.3) * GRID_SIZE, (segment.y + 0.3) * GRID_SIZE, eyeSize, eyeSize)
            ctx.fillRect((segment.x + 0.7) * GRID_SIZE, (segment.y + 0.3) * GRID_SIZE, eyeSize, eyeSize)
          }
        }
      }

      // Draw food
      for (const food of foods) {
        ctx.fillStyle = food.color
        ctx.beginPath()
        ctx.arc(food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw score
      ctx.fillStyle = "#000"
      ctx.font = "20px Arial"
      ctx.fillText(`Score: ${score}`, 10, 30)

      // Draw boost energy
      ctx.fillStyle = "#000"
      ctx.fillRect(10, canvas.height - 30, 204, 20)
      ctx.fillStyle = boostEnergy > 50 ? "#4ade80" : boostEnergy > 25 ? "#fbbf24" : "#ef4444"
      ctx.fillRect(12, canvas.height - 28, 200 * (boostEnergy / 100), 16)
      ctx.fillStyle = "#fff"
      ctx.font = "12px Arial"
      ctx.fillText("Boost Energy (Q)", 15, canvas.height - 15)

      // Draw snake lengths
      ctx.fillStyle = "#000"
      ctx.font = "16px Arial"
      ctx.fillText(`Your Length: ${playerSnake.body.length}`, 10, 60)
      ctx.fillText(`Enemy Length: ${aiSnake.body.length}`, 10, 85)

      lastTimestamp = timestamp
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
  }, [playerStats, score, gameActive, onGameOver, snakeSpeed, growthRate, initialLength])

  return <canvas ref={canvasRef} className="w-full h-full bg-white" tabIndex={0} />
}
