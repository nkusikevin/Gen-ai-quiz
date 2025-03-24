"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle, XCircle, Info, X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva("fixed z-50 flex items-start gap-3 rounded-lg border p-4 shadow-lg", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      error: "bg-destructive/10 border-destructive/30 text-destructive dark:border-destructive/30",
      success:
        "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400",
      warning:
        "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-400",
      info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-400",
    },
    position: {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-center": "top-4 left-1/2 -translate-x-1/2",
      "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    },
  },
  defaultVariants: {
    variant: "default",
    position: "top-right",
  },
})

export interface AnimatedToastProps extends VariantProps<typeof toastVariants> {
  message: string
  description?: string
  duration?: number
  onClose?: () => void
  className?: string
}

export function AnimatedToast({
  message,
  description,
  variant = "default",
  position = "top-right",
  duration = 5000,
  onClose,
  className,
}: AnimatedToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  useEffect(() => {
    if (!isVisible && onClose) {
      // Small delay to allow exit animation to complete
      const timer = setTimeout(() => {
        onClose()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const getIcon = () => {
    switch (variant) {
      case "error":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(toastVariants({ variant, position, className }))}
          initial={{ opacity: 0, y: position?.includes("top") ? -20 : 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
          <div className="flex-1">
            <h4 className="font-medium">{message}</h4>
            {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close toast"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

