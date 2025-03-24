"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { QuizInterface } from "@/components/quiz-interface"
import { Trophy, Settings, Shield, Brain, Sparkles } from "lucide-react"
import { ConfettiExplosion } from "@/components/confetti-explosion"
import { CoinDisplay } from "@/components/coin-display"
import { useCoinSystem } from "@/hooks/use-coin-system"
import { useLLMSettings } from "@/hooks/use-llm-settings"
import { useToast } from "@/components/ui/toast-context"
import Link from "next/link"
import { AnimatedLoading } from "@/components/animated-loading"

type QuizState = "upload" | "generating" | "quiz" | "results"

export function PdfQuizGenerator() {
  const [quizState, setQuizState] = useState<QuizState>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [questions, setQuestions] = useState<
    Array<{
      question: string
      options: string[]
      correctAnswer: string
    }>
  >([])
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const [earnedCoins, setEarnedCoins] = useState(0)
  const { coins, addCoins } = useCoinSystem()
  const { settings, getActiveApiKey } = useLLMSettings()
  const { addToast } = useToast()

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile)
    addToast({
      message: "File uploaded successfully",
      description: uploadedFile.name,
      variant: "success",
      position: "bottom-right",
      duration: 3000,
    })
  }

  const generateQuestions = async () => {
    if (!file) return

    // Get the active API key based on selected provider
    const apiKey = getActiveApiKey()

    // Check if API key is available
    if (!apiKey) {
      addToast({
        message: `${settings.provider === "claude" ? "Claude" : "OpenAI"} API Key Required`,
        description: `Please add your ${settings.provider === "claude" ? "Claude" : "OpenAI"} API key in settings to generate quizzes.`,
        variant: "error",
        position: "top-center",
        duration: 5000,
      })
      return
    }

    setQuizState("generating")

    try {
      const formData = new FormData()
      formData.append("pdf", file)
      formData.append("provider", settings.provider)
      formData.append("model", settings.model)
      formData.append("apiKey", apiKey)

      console.log("Sending request to generate questions...")

      const response = await fetch("/api/generate-questions", {
        method: "POST",
        body: formData,
      })

      console.log("Response received:", response.status, response.statusText)

      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate questions")
      }

      // Validate that we received proper questions data
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No valid questions were generated. The PDF might be too complex or contain insufficient content.")
      }

      setQuestions(data.questions)
      setQuizState("quiz")

      addToast({
        message: "Quiz Generated",
        description: "Your quiz is ready! Answer the questions to test your knowledge.",
        variant: "success",
        position: "bottom-right",
      })
    } catch (error) {
      console.error("Error generating questions:", error)

      const errorMessage = error instanceof Error ? error.message : "Failed to generate questions"

      // Provide more specific guidance based on common error patterns
      let description = errorMessage
      if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
        description = "The request timed out. Your PDF might be too large or complex. Try with a smaller document."
      } else if (errorMessage.includes("format") || errorMessage.includes("parse")) {
        description = "There was an issue processing the PDF. Make sure it contains readable text content."
      } else if (errorMessage.includes("rate limit") || errorMessage.includes("quota")) {
        description = `You've reached the ${settings.provider} API rate limit. Please try again later.`
      } else if (errorMessage.includes("API key")) {
        description = `There was an issue with your ${settings.provider} API key. Please check that it's valid and has sufficient permissions.`
      }

      addToast({
        message: "Error Generating Quiz",
        description: description,
        variant: "error",
        position: "top-center",
        duration: 7000,
      })

      setQuizState("upload")
    }
  }

  const handleQuizComplete = (results: { correct: number; total: number }) => {
    setScore(results)
    setQuizState("results")

    // Calculate earned coins (10 per correct answer)
    const coinsEarned = results.correct * 10
    setEarnedCoins(coinsEarned)

    // Add coins to total
    if (coinsEarned > 0) {
      addCoins(coinsEarned)
      setShowConfetti(true)

      addToast({
        message: "Quiz Completed!",
        description: `You earned ${coinsEarned} coins for answering ${results.correct} questions correctly.`,
        variant: "success",
        position: "bottom-center",
        duration: 5000,
      })
    } else {
      addToast({
        message: "Quiz Completed",
        description: "Try again to earn coins by answering questions correctly.",
        variant: "info",
        position: "bottom-center",
      })
    }
  }

  const resetQuiz = () => {
    setFile(null)
    setQuestions([])
    setScore({ correct: 0, total: 0 })
    setQuizState("upload")
    setShowConfetti(false)
    setEarnedCoins(0)

    addToast({
      message: "Quiz Reset",
      description: "You can now upload a new PDF and generate a new quiz.",
      variant: "info",
      position: "bottom-right",
      duration: 3000,
    })
  }

  // Get the appropriate icon based on the selected provider
  const ProviderIcon = settings.provider === "claude" ? Brain : Sparkles

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">PDF Quiz Generator</h2>
          <div className="flex items-center gap-3">
            <CoinDisplay coins={coins} newCoins={quizState === "results" ? earnedCoins : undefined} />
            <Link href="/settings">
              <Button variant="ghost" size="icon" title="Settings">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {quizState === "upload" && (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-md text-sm">
              <ProviderIcon className="h-4 w-4 text-primary" />
              <span>
                Using {settings.provider === "claude" ? "Claude 3.5 Sonnet" : "GPT-4o-mini"} for quiz generation
              </span>
            </div>

            {!getActiveApiKey() && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-300 mb-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">API Key Required</p>
                    <p className="text-sm mt-1">
                      You need to add your {settings.provider === "claude" ? "Claude" : "OpenAI"} API key to generate
                      quizzes.
                      <Link href="/settings" className="underline ml-1 font-medium">
                        Add your API key in settings
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <FileUploader onFileUpload={handleFileUpload} />

            {file && (
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Selected file: <span className="font-medium">{file.name}</span>
                </p>
                <Button onClick={generateQuestions} disabled={!getActiveApiKey()}>
                  Generate Quiz
                </Button>

                {getActiveApiKey() && (
                  <div className="flex items-center gap-1.5 text-xs text-primary">
                    <Shield className="h-3 w-3" />
                    Using your securely stored {settings.provider === "claude" ? "Claude" : "OpenAI"} API key
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {quizState === "generating" && (
          <AnimatedLoading
            message={`Analyzing PDF and generating questions with ${settings.provider === "claude" ? "Claude 3.5 Sonnet" : "GPT-4o-mini"
              }...`}
          />
        )}

        {quizState === "quiz" && questions.length > 0 && (
          <QuizInterface questions={questions} onComplete={handleQuizComplete} />
        )}

        {quizState === "results" && (
          <div className="flex flex-col items-center py-8 gap-6">
            {showConfetti && <ConfettiExplosion />}

            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
              <Trophy className="h-10 w-10 text-primary" />
            </div>

            <h2 className="text-2xl font-bold">Quiz Results</h2>

            <div className="text-5xl font-bold text-primary">
              {score.correct} / {score.total}
            </div>

            <div className="space-y-2 text-center">
              <p className="text-muted-foreground">
                You answered {score.correct} out of {score.total} questions correctly.
              </p>

              {earnedCoins > 0 && (
                <p className="font-medium text-amber-600 dark:text-amber-400">You earned {earnedCoins} coins!</p>
              )}
            </div>

            <Button onClick={resetQuiz} className="mt-4">
              Start New Quiz
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}