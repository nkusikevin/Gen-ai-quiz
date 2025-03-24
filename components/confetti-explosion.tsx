"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

interface ConfettiExplosionProps {
  duration?: number
}

export function ConfettiExplosion({ duration = 3000 }: ConfettiExplosionProps) {
  const [isExploding, setIsExploding] = useState(true)

  useEffect(() => {
    if (!isExploding) return

    const end = Date.now() + duration

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Continuous smaller bursts
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval)
        setIsExploding(false)
        return
      }

      confetti({
        particleCount: 50,
        angle: Math.random() * 360,
        spread: 60,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2,
        },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [duration, isExploding])

  return null
}

