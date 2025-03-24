"use client"

import { useState, useEffect } from "react"
import { encrypt, decrypt } from "@/utils/encryption"

export type LLMProvider = "claude" | "openai"
export type LLMModel = "claude-3-5-sonnet" | "gpt-4o-mini"

interface LLMSettings {
  provider: LLMProvider
  model: LLMModel
  claudeApiKey?: string
  openaiApiKey?: string
}

const DEFAULT_SETTINGS: LLMSettings = {
  provider: "claude",
  model: "claude-3-5-sonnet",
}

export function useLLMSettings() {
  const [settings, setSettings] = useState<LLMSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("llm-settings")
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings))
      }

      // Load API keys separately for security
      const encryptedClaudeKey = localStorage.getItem("claude-api-key")
      if (encryptedClaudeKey) {
        const decryptedKey = decrypt(encryptedClaudeKey)
        setSettings((prev) => ({ ...prev, claudeApiKey: decryptedKey }))
      }

      const encryptedOpenAIKey = localStorage.getItem("openai-api-key")
      if (encryptedOpenAIKey) {
        const decryptedKey = decrypt(encryptedOpenAIKey)
        setSettings((prev) => ({ ...prev, openaiApiKey: decryptedKey }))
      }

      setIsLoaded(true)
    } catch (error) {
      console.error("Error loading LLM settings:", error)
      setIsLoaded(true)
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        // Save settings without API keys
        const settingsToSave = {
          provider: settings.provider,
          model: settings.model,
        }
        localStorage.setItem("llm-settings", JSON.stringify(settingsToSave))

        // Save API keys separately with encryption
        if (settings.claudeApiKey) {
          const encryptedKey = encrypt(settings.claudeApiKey)
          localStorage.setItem("claude-api-key", encryptedKey)
        }

        if (settings.openaiApiKey) {
          const encryptedKey = encrypt(settings.openaiApiKey)
          localStorage.setItem("openai-api-key", encryptedKey)
        }
      } catch (error) {
        console.error("Error saving LLM settings:", error)
      }
    }
  }, [settings, isLoaded])

  const updateSettings = (newSettings: Partial<LLMSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const setClaudeApiKey = (key: string | null) => {
    if (key === null) {
      localStorage.removeItem("claude-api-key")
      setSettings((prev) => {
        const { claudeApiKey, ...rest } = prev
        return rest
      })
    } else {
      setSettings((prev) => ({ ...prev, claudeApiKey: key }))
    }
  }

  const setOpenAIApiKey = (key: string | null) => {
    if (key === null) {
      localStorage.removeItem("openai-api-key")
      setSettings((prev) => {
        const { openaiApiKey, ...rest } = prev
        return rest
      })
    } else {
      setSettings((prev) => ({ ...prev, openaiApiKey: key }))
    }
  }

  const clearApiKeys = () => {
    localStorage.removeItem("claude-api-key")
    localStorage.removeItem("openai-api-key")
    setSettings((prev) => {
      const { claudeApiKey, openaiApiKey, ...rest } = prev
      return rest
    })
  }

  const getActiveApiKey = () => {
    if (settings.provider === "claude") {
      return settings.claudeApiKey
    } else if (settings.provider === "openai") {
      return settings.openaiApiKey
    }
    return null
  }

  return {
    settings,
    updateSettings,
    setClaudeApiKey,
    setOpenAIApiKey,
    clearApiKeys,
    getActiveApiKey,
    isLoaded,
  }
}

