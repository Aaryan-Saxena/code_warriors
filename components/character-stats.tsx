import { Progress } from "@/components/ui/progress"
import { Shield, Zap } from "lucide-react"

interface CharacterStatsProps {
  fitnessData: {
    steps: number
    sleepHours: number
    activeMinutes: number
  }
  isLoading: boolean
}

export function CharacterStats({ fitnessData, isLoading }: CharacterStatsProps) {
  // Calculate character stats based on fitness data
  const attack = Math.min(80 + (fitnessData.steps / 1000) * 5, 100)
  const defense = Math.min(70 + (fitnessData.sleepHours / 8) * 30, 100)
  const speed = Math.min(60 + (fitnessData.activeMinutes / 60) * 40, 100)

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-1">
          <span className="flex items-center text-sm">
            <Zap className="h-4 w-4 mr-1 text-amber-500" /> Attack
          </span>
          <span className="text-sm font-medium">{isLoading ? "Loading..." : `${Math.round(attack)}/100`}</span>
        </div>
        <Progress value={isLoading ? 0 : attack} className="h-2" />
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <span className="flex items-center text-sm">
            <Shield className="h-4 w-4 mr-1 text-blue-500" /> Defense
          </span>
          <span className="text-sm font-medium">{isLoading ? "Loading..." : `${Math.round(defense)}/100`}</span>
        </div>
        <Progress value={isLoading ? 0 : defense} className="h-2" />
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <span className="flex items-center text-sm">
            <Zap className="h-4 w-4 mr-1 text-purple-500" /> Speed
          </span>
          <span className="text-sm font-medium">{isLoading ? "Loading..." : `${Math.round(speed)}/100`}</span>
        </div>
        <Progress value={isLoading ? 0 : speed} className="h-2" />
      </div>
    </div>
  )
}
