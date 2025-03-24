import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { FileText, ArrowLeft } from "lucide-react"
import { FloatingDots } from "@/components/decorative/floating-dots"
import { GeometricShapes } from "@/components/decorative/geometric-shapes"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Decorative elements */}
      <FloatingDots className="inset-0 opacity-50" />
      <GeometricShapes className="inset-0 opacity-70" />

      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-medium tracking-wide">PDF Quiz</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6 animate-fade-in">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="text-4xl font-light tracking-tight">About PDF Quiz Generator</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Learn more about our AI-powered quiz generation tool and how it can help you study more effectively.
            </p>
          </div>

          <div className="space-y-6 bg-card rounded-lg border p-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-2xl font-light">How It Works</h2>
            <p>
              PDF Quiz Generator uses advanced AI to analyze your PDF documents and create relevant quiz questions. The
              application extracts key concepts and information from your documents and transforms them into
              multiple-choice questions that test your understanding of the material.
            </p>

            <h3 className="text-xl font-light mt-6">Key Features</h3>
            <ul className="space-y-2 list-disc pl-6">
              <li>Upload any PDF document for analysis</li>
              <li>Generate multiple-choice questions based on document content</li>
              <li>Test your knowledge with interactive quizzes</li>
              <li>Receive immediate feedback on your answers</li>
              <li>Earn coins for correct answers</li>
              <li>Track your progress and performance</li>
            </ul>

            <h3 className="text-xl font-light mt-6">Our Design Philosophy</h3>
            <p>
              Our application is inspired by Japanese minimalist design principles, emphasizing simplicity,
              functionality, and harmony. We believe that a clean, uncluttered interface enhances the learning
              experience and allows you to focus on what matters most: understanding and retaining information.
            </p>
          </div>

          <div className="text-center pt-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <Link href="/quiz">
              <Button size="lg" className="transition-transform hover:translate-y-[-2px]">
                Start Using PDF Quiz Generator
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t relative z-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PDF Quiz Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

