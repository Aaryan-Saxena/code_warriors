"use client"

import { useEffect, useRef } from "react"

interface ActivityChartProps {
  data: {
    day: string
    steps: number
    active: number
  }[]
  isLoading: boolean
}

export function ActivityChart({ data, isLoading }: ActivityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || isLoading) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Chart dimensions
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const barWidth = chartWidth / data.length / 3

    // Find max values for scaling
    const maxSteps = Math.max(...data.map((d) => d.steps), 10000)
    const maxActive = Math.max(...data.map((d) => d.active), 60)

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Draw y-axis labels (steps)
    ctx.fillStyle = "#666"
    ctx.font = "12px Arial"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxSteps / 5) * i)
      const y = canvas.height - padding - (chartHeight / 5) * i
      ctx.fillText(value.toLocaleString(), padding - 10, y)
    }

    // Draw y-axis label (active minutes)
    ctx.textAlign = "left"
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxActive / 5) * i)
      const y = canvas.height - padding - (chartHeight / 5) * i
      ctx.fillText(`${value} min`, canvas.width - padding + 10, y)
    }

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    data.forEach((d, i) => {
      const x = padding + (chartWidth / data.length) * (i + 0.5)
      ctx.fillText(d.day, x, canvas.height - padding + 10)
    })

    // Draw bars for steps
    data.forEach((d, i) => {
      const x = padding + (chartWidth / data.length) * i + barWidth
      const barHeight = (d.steps / maxSteps) * chartHeight
      const y = canvas.height - padding - barHeight

      // Create gradient
      const gradient = ctx.createLinearGradient(x, y, x, canvas.height - padding)
      gradient.addColorStop(0, "#4ade80")
      gradient.addColorStop(1, "#22c55e")

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)
    })

    // Draw line for active minutes
    ctx.beginPath()
    ctx.strokeStyle = "#8b5cf6"
    ctx.lineWidth = 3
    data.forEach((d, i) => {
      const x = padding + (chartWidth / data.length) * (i + 0.5)
      const y = canvas.height - padding - (d.active / maxActive) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw points for active minutes
    data.forEach((d, i) => {
      const x = padding + (chartWidth / data.length) * (i + 0.5)
      const y = canvas.height - padding - (d.active / maxActive) * chartHeight

      ctx.beginPath()
      ctx.fillStyle = "#8b5cf6"
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.fillStyle = "#fff"
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw legend
    const legendX = padding
    const legendY = padding - 20

    // Steps legend
    ctx.fillStyle = "#4ade80"
    ctx.fillRect(legendX, legendY, 15, 15)
    ctx.fillStyle = "#666"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillText("Steps", legendX + 20, legendY + 7.5)

    // Active minutes legend
    ctx.fillStyle = "#8b5cf6"
    ctx.beginPath()
    ctx.arc(legendX + 100, legendY + 7.5, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#666"
    ctx.fillText("Active Minutes", legendX + 110, legendY + 7.5)
  }, [data, isLoading])

  if (isLoading) {
    return (
      <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Loading chart data...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[300px] relative">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
