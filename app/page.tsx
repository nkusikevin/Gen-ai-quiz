import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Circle } from "@/components/decorative/circle"
import { CoinDisplay } from "@/components/coin-display"
import { FloatingDots } from "@/components/decorative/floating-dots"
import { GeometricShapes } from "@/components/decorative/geometric-shapes"
import { FileText, BookOpen, Award, ArrowRight, Settings, MessageSquare } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2 animate-fade-in">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-medium tracking-wide">PDF Quiz</span>
        </div>
        <div className="flex items-center gap-3 animate-fade-in">
          <CoinDisplay coins={0} />
          <Link href="/settings">
            <Button variant="ghost" size="icon" title="Settings">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <Circle className="absolute top-20 left-10 w-64 h-64 opacity-50 animate-pulse-soft" />
        <Circle
          className="absolute bottom-20 right-10 w-40 h-40 opacity-30 animate-pulse-soft"
          style={{ animationDelay: "2s" }}
        />
        <FloatingDots className="inset-0" />
        <GeometricShapes className="inset-0" />

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight animate-slide-in-left">
              Learn from any <span className="text-primary">document</span> with AI-powered tools
            </h1>
            <p className="text-muted-foreground text-lg animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
              Upload your PDF documents to generate interactive quizzes or chat with your documents to get instant
              answers.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
              <Link href="/quiz">
                <Button size="lg" className="gap-2 transition-transform hover:translate-y-[-2px]">
                  Start Quiz
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" size="lg" className="gap-2 transition-transform hover:translate-y-[-2px]">
                  Chat with PDF
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground animate-slide-in-left" style={{ animationDelay: "0.3s" }}>
              This app requires an API key to generate quizzes and chat responses. Add yours in the settings.
            </p>
          </div>

          <div className="bg-card rounded-lg border shadow-lg p-6 relative overflow-hidden animate-slide-in-right">
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">PDF AI Tools</h3>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">AI-Powered</div>
              </div>

              <div className="space-y-4 stagger-animation">
                <div className="bg-background/50 backdrop-blur-sm p-4 rounded-md border animate-fade-up transition-all hover:shadow-md hover:translate-y-[-2px]">
                  <div className="flex gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Upload Documents</h4>
                      <p className="text-sm text-muted-foreground">Drag and drop your PDF files</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background/50 backdrop-blur-sm p-4 rounded-md border animate-fade-up transition-all hover:shadow-md hover:translate-y-[-2px]">
                  <div className="flex gap-3">
                    <div className="bg-secondary/10 p-2 rounded-md">
                      <BookOpen className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Quiz or Chat</h4>
                      <p className="text-sm text-muted-foreground">Test your knowledge or ask questions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background/50 backdrop-blur-sm p-4 rounded-md border animate-fade-up transition-all hover:shadow-md hover:translate-y-[-2px]">
                  <div className="flex gap-3">
                    <div className="bg-amber-500/10 p-2 rounded-md">
                      <Award className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Earn Rewards</h4>
                      <p className="text-sm text-muted-foreground">Collect coins for correct answers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PDF Quiz Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

