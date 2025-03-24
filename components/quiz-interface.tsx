"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react"

interface Question {
  question: string
  options: string[]
  correctAnswer: string
}

interface QuizInterfaceProps {
  questions: Question[]
  onComplete: (results: { correct: number; total: number }) => void
}

export function QuizInterface({ questions, onComplete }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(questions.length).fill(""))
  const [showFeedback, setShowFeedback] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isFirstQuestion = currentQuestionIndex === 0
  const hasSelectedAnswer = selectedAnswers[currentQuestionIndex] !== ""

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = value
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      if (!isSubmitted) {
        setShowFeedback(true)
        setIsSubmitted(true)
      } else {
        const correctCount = selectedAnswers.reduce((count, answer, index) => {
          return answer === questions[index].correctAnswer ? count + 1 : count
        }, 0)

        onComplete({
          correct: correctCount,
          total: questions.length,
        })
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowFeedback(false)
    }
  }

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowFeedback(false)
    }
  }

  const isCorrect = selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
        <div className="text-sm text-muted-foreground">
          {selectedAnswers.filter((a) => a !== "").length} of {questions.length} answered
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>

        <RadioGroup
          value={selectedAnswers[currentQuestionIndex]}
          onValueChange={handleAnswerSelect}
          className="space-y-3"
        >
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 rounded-md border p-3 ${
                showFeedback && option === currentQuestion.correctAnswer
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : showFeedback && option === selectedAnswers[currentQuestionIndex] && !isCorrect
                    ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                    : "hover:bg-accent"
              }`}
            >
              <RadioGroupItem value={option} id={`option-${index}`} disabled={showFeedback} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
              {showFeedback && option === currentQuestion.correctAnswer && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {showFeedback && option === selectedAnswers[currentQuestionIndex] && !isCorrect && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>

        {showFeedback && (
          <div
            className={`mt-4 p-3 rounded-md ${
              isCorrect
                ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
            }`}
          >
            {isCorrect ? "Correct!" : "Incorrect. The correct answer is highlighted above."}
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={isFirstQuestion} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button onClick={handleNext} disabled={!hasSelectedAnswer} className="gap-1">
          {isLastQuestion ? (isSubmitted ? "Finish Quiz" : "Check Answer") : "Next"}
          {!isLastQuestion && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

