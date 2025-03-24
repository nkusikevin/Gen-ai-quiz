"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { Input } from "@/components/ui/input"
import { Shield, Brain, Sparkles, Send, User, Bot, FileText, X } from "lucide-react"
import { useLLMSettings } from "@/hooks/use-llm-settings"
import { useToast } from "@/components/ui/toast-context"
import Link from "next/link"
import { AnimatedLoading } from "@/components/animated-loading"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

type ChatMessage = {
  role: "user" | "assistant" | "system"
  content: string
}

export function PdfChatInterface() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content: "Welcome to PDF Chat! Upload a PDF document and ask questions about it.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { settings, getActiveApiKey } = useLLMSettings()
  const { addToast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile)
    setIsUploading(true)

    // Simulate processing time
    setTimeout(() => {
      setIsUploading(false)
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `PDF "${uploadedFile.name}" uploaded successfully. You can now ask questions about it.`,
        },
      ])

      addToast({
        message: "PDF uploaded successfully",
        description: "You can now ask questions about the document.",
        variant: "success",
        position: "bottom-right",
        duration: 3000,
      })
    }, 1500)
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return
    if (!file) {
      addToast({
        message: "No PDF uploaded",
        description: "Please upload a PDF document first.",
        variant: "warning",
        position: "top-center",
      })
      return
    }

    // Get the active API key based on selected provider
    const apiKey = getActiveApiKey()

    // Check if API key is available
    if (!apiKey) {
      addToast({
        message: `${settings.provider === "claude" ? "Claude" : "OpenAI"} API Key Required`,
        description: `Please add your ${settings.provider === "claude" ? "Claude" : "OpenAI"} API key in settings.`,
        variant: "error",
        position: "top-center",
        duration: 5000,
      })
      return
    }

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("pdf", file)
      formData.append("provider", settings.provider)
      formData.append("model", settings.model)
      formData.append("apiKey", apiKey)
      formData.append("message", userMessage)

      // Add previous messages for context (limit to last 10 for performance)
      const contextMessages = messages.filter((msg) => msg.role !== "system").slice(-10)
      formData.append("context", JSON.stringify(contextMessages))

      const response = await fetch("/api/chat-with-pdf", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      console.error("Error getting response:", error)

      const errorMessage = error instanceof Error ? error.message : "Failed to get response"

      addToast({
        message: "Error",
        description: errorMessage,
        variant: "error",
        position: "top-center",
        duration: 7000,
      })

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I encountered an error processing your request." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearFile = () => {
    setFile(null)
    setMessages([
      {
        role: "system",
        content: "Welcome to PDF Chat! Upload a PDF document and ask questions about it.",
      },
    ])
  }

  // Get the appropriate icon based on the selected provider
  const ProviderIcon = settings.provider === "claude" ? Brain : Sparkles

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Chat with your PDF</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-primary/10 rounded-md text-sm">
              <ProviderIcon className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">
                Using {settings.provider === "claude" ? "Claude 3.5 Sonnet" : "GPT-4o-mini"}
              </span>
            </div>
          </div>
        </div>

        {!file ? (
          <div className="space-y-6">
            {!getActiveApiKey() && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-300 mb-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">API Key Required</p>
                    <p className="text-sm mt-1">
                      You need to add your {settings.provider === "claude" ? "Claude" : "OpenAI"} API key.
                      <Link href="/settings" className="underline ml-1 font-medium">
                        Add your API key in settings
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <FileUploader onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* File indicator */}
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFile} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat messages */}
            <div className="border rounded-md h-[400px] flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.role === "user"
                            ? "flex-row-reverse"
                            : message.role === "system"
                              ? "w-full max-w-full"
                              : ""
                        }`}
                      >
                        {message.role !== "system" && (
                          <Avatar className={`h-8 w-8 ${message.role === "user" ? "bg-primary" : "bg-muted"}`}>
                            {message.role === "user" ? (
                              <User className="h-4 w-4 text-primary-foreground" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </Avatar>
                        )}
                        <div
                          className={`p-3 rounded-lg ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : message.role === "system"
                                ? "bg-muted/50 text-muted-foreground text-sm w-full text-center"
                                : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8 bg-muted">
                          <Bot className="h-4 w-4" />
                        </Avatar>
                        <div className="p-3 rounded-lg bg-muted flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div
                              className="w-2 h-2 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input area */}
              <div className="p-3 border-t flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about your PDF..."
                  disabled={isLoading || isUploading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading || isUploading || !file}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <AnimatedLoading message="Processing PDF document..." />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

