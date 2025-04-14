import { Progress } from "@/components/ui/progress"
import { Activity, Moon, Footprints } from "lucide-react"

interface FitnessStatsProps {
  fitnessData: {
    steps: number
    sleepHours: number
    activeMinutes: number
  }
  isLoading: boolean
}

export function FitnessStats({ fitnessData, isLoading }: FitnessStatsProps) {
  const stepsGoal = 10000
  const sleepGoal = 8
  const activeGoal = 60

  const stepsPercentage = Math.min(100, (fitnessData.steps / stepsGoal) * 100)
  const sleepPercentage = Math.min(100, (fitnessData.sleepHours / sleepGoal) * 100)
  const activePercentage = Math.min(100, (fitnessData.activeMinutes / activeGoal) * 100)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Footprints className="h-6 w-6 text-green-600" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Steps</span>
            <span className="text-sm font-medium">
              {isLoading ? "Loading..." : `${fitnessData.steps.toLocaleString()} / ${stepsGoal.toLocaleString()}`}
            </span>
          </div>
          <Progress value={isLoading ? 0 : stepsPercentage} className="h-2" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Moon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sleep</span>
            <span className="text-sm font-medium">
              {isLoading ? "Loading..." : `${fitnessData.sleepHours} / ${sleepGoal} hrs`}
            </span>
          </div>
          <Progress value={isLoading ? 0 : sleepPercentage} className="h-2" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
          <Activity className="h-6 w-6 text-purple-600" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Minutes</span>
            <span className="text-sm font-medium">
              {isLoading ? "Loading..." : `${fitnessData.activeMinutes} / ${activeGoal} min`}
            </span>
          </div>
          <Progress value={isLoading ? 0 : activePercentage} className="h-2" />
        </div>
      </div>
    </div>
  )
}
