import fs from "fs"
import path from "path"

// Define the player stats interface
export interface PlayerStats {
  steps: number
  sleepHours: number
  workoutDuration: number
  activeMinutes?: number
}

// Path to the player stats file
const STATS_FILE_PATH = path.join(process.cwd(), "data", "player_stats.json")

// Ensure the data directory exists
export function ensureDataDirectoryExists() {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Get player stats from file
export function getPlayerStats(): PlayerStats {
  ensureDataDirectoryExists()

  try {
    if (fs.existsSync(STATS_FILE_PATH)) {
      const data = fs.readFileSync(STATS_FILE_PATH, "utf8")
      return JSON.parse(data)
    } else {
      // Initialize with default values if file doesn't exist
      const defaultStats: PlayerStats = {
        steps: 0,
        sleepHours: 0,
        workoutDuration: 0,
        activeMinutes: 0,
      }
      savePlayerStats(defaultStats)
      return defaultStats
    }
  } catch (error) {
    console.error("Error reading player stats:", error)
    return {
      steps: 0,
      sleepHours: 0,
      workoutDuration: 0,
      activeMinutes: 0,
    }
  }
}

// Save player stats to file
export function savePlayerStats(stats: PlayerStats): void {
  ensureDataDirectoryExists()

  try {
    fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(stats, null, 2))
  } catch (error) {
    console.error("Error saving player stats:", error)
  }
}

// Update player stats with new fitness data
export function updatePlayerStats(fitnessData: {
  steps?: number
  sleepHours?: number
  activeMinutes?: number
}): PlayerStats {
  const currentStats = getPlayerStats()

  const updatedStats: PlayerStats = {
    ...currentStats,
    steps: fitnessData.steps !== undefined ? fitnessData.steps : currentStats.steps,
    sleepHours: fitnessData.sleepHours !== undefined ? fitnessData.sleepHours : currentStats.sleepHours,
    activeMinutes: fitnessData.activeMinutes !== undefined ? fitnessData.activeMinutes : currentStats.activeMinutes,
  }

  savePlayerStats(updatedStats)
  return updatedStats
}

// Calculate character stats based on fitness data
export function calculateCharacterStats(playerStats: PlayerStats) {
  const attack = Math.min(80 + (playerStats.steps / 1000) * 5, 100)
  const defense = Math.min(70 + (playerStats.sleepHours / 8) * 30, 100)
  const speed = Math.min(60 + ((playerStats.activeMinutes || 0) / 60) * 40, 100)

  return {
    attack,
    defense,
    speed,
  }
}
