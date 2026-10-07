"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AssessmentTimerProps {
  initialMinutes: number
  onTimeUp?: () => void
  onWarning?: (minutesLeft: number) => void
  paused?: boolean
}

export function AssessmentTimer({
  initialMinutes,
  onTimeUp,
  onWarning,
  paused = false,
}: AssessmentTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)
  const [warned, setWarned] = useState<Set<number>>(new Set())

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }, [])

  useEffect(() => {
    if (paused || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1
        
        // Check for warnings at 10, 5, and 1 minute marks
        const warningMarks = [10, 5, 1]
        const minutesLeft = Math.ceil(newTime / 60)
        
        if (warningMarks.includes(minutesLeft) && !warned.has(minutesLeft)) {
          setWarned((prev) => new Set([...prev, minutesLeft]))
          onWarning?.(minutesLeft)
        }

        if (newTime <= 0) {
          onTimeUp?.()
          return 0
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [paused, timeLeft, warned, onTimeUp, onWarning])

  const isLowTime = timeLeft <= 300 // 5 minutes
  const isCritical = timeLeft <= 60 // 1 minute

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 px-3 py-1.5 text-sm font-mono",
        isLowTime && !isCritical && "border-accent bg-accent/10 text-accent",
        isCritical && "animate-pulse border-destructive bg-destructive/10 text-destructive"
      )}
    >
      {isCritical ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      {formatTime(timeLeft)}
    </Badge>
  )
}
