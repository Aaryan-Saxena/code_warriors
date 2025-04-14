"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface GameControlsProps {
  title: string
  controls: { key: string; action: string }[]
}

export function GameControls({ title, controls }: GameControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {controls.map((control, index) => (
            <motion.div
              key={control.key}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 font-mono font-bold">
                  {control.key}
                </div>
                <span className="ml-3 text-sm">{control.action}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
