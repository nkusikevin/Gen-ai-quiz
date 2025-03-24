"use client"

import { useState, useEffect } from "react"

interface UseCoinSystemProps {
  initialCoins?: number
}

export function useCoinSystem({ initialCoins = 0 }: UseCoinSystemProps = {}) {
  const [coins, setCoins] = useState(initialCoins)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load coins from localStorage on component mount
  useEffect(() => {
    const storedCoins = localStorage.getItem("quiz-coins")
    if (storedCoins !== null) {
      setCoins(Number.parseInt(storedCoins, 10))
    }
    setIsLoaded(true)
  }, [])

  // Save coins to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("quiz-coins", coins.toString())
    }
  }, [coins, isLoaded])

  const addCoins = (amount: number) => {
    setCoins((prevCoins) => prevCoins + amount)
  }

  return { coins, addCoins }
}

