"use client"

import { useState, useEffect } from "react"
import { Coins } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CoinDisplayProps {
  coins: number
  newCoins?: number
}

export function CoinDisplay({ coins, newCoins }: CoinDisplayProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (newCoins && newCoins > 0) {
      setShowAnimation(true)
      const timer = setTimeout(() => setShowAnimation(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [newCoins])

  return (
    <div className="relative flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-full">
      <Coins className="h-4 w-4" />
      <span className="font-medium">{coins}</span>

      <AnimatePresence>
        {showAnimation && newCoins && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-amber-600 dark:text-amber-400 font-bold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0 }}
          >
            +{newCoins}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

