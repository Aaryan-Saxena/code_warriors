// Mock fitness data for demonstration purposes
export const mockFitnessData = {
  steps: 8742,
  sleepHours: 7.5,
  activeMinutes: 45,
  caloriesBurned: 1850,
  heartRate: 68,
  workouts: [
    { type: "Running", duration: 30, calories: 320 },
    { type: "Strength", duration: 45, calories: 280 },
  ],
  weeklyActivity: [
    { day: "Mon", steps: 9200, active: 50 },
    { day: "Tue", steps: 8500, active: 45 },
    { day: "Wed", steps: 10200, active: 60 },
    { day: "Thu", steps: 7800, active: 40 },
    { day: "Fri", steps: 8742, active: 45 },
    { day: "Sat", steps: 0, active: 0 },
    { day: "Sun", steps: 0, active: 0 },
  ],
}
