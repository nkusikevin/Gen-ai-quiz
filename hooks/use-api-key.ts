"use client"

import { useState, useEffect } from "react"
import { encrypt, decrypt } from "@/utils/encryption"

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load API key from localStorage on component mount
  useEffect(() => {
    try {
      const encryptedKey = localStorage.getItem("claude-api-key")
      if (encryptedKey) {
        // Decrypt the key
        const decryptedKey = decrypt(encryptedKey)
        setApiKey(decryptedKey)
      }
      setIsLoaded(true)
    } catch (error) {
      console.error("Error loading API key:", error)
      setIsLoaded(true)
    }
  }, [])

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        if (apiKey) {
          // Encrypt the key before storing
          const encryptedKey = encrypt(apiKey)
          localStorage.setItem("claude-api-key", encryptedKey)
        } else {
          localStorage.removeItem("claude-api-key")
        }
      } catch (error) {
        console.error("Error saving API key:", error)
      }
    }
  }, [apiKey, isLoaded])

  const clearApiKey = () => {
    setApiKey(null)
  }

  return {
    apiKey,
    setApiKey,
    clearApiKey,
    isLoaded,
  }
}

