import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { FileText, ArrowLeft } from "lucide-react"
import { FloatingDots } from "@/components/decorative/floating-dots"
import { PdfChatInterface } from "@/components/pdf-chat-interface"

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Decorative elements */}
      <FloatingDots className="inset-0 opacity-50" />

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

        <div className="max-w-4xl mx-auto animate-fade-up">
          <PdfChatInterface />
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

