"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { AnimatedToast, type AnimatedToastProps } from "./animated-toast"
import { nanoid } from "nanoid"

type ToastType = AnimatedToastProps & { id: string }

interface ToastContextType {
  toasts: ToastType[]
  addToast: (toast: Omit<AnimatedToastProps, "onClose">) => string
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const addToast = useCallback((toast: Omit<AnimatedToastProps, "onClose">) => {
    const id = nanoid()
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {toasts.map((toast) => (
        <AnimatedToast
          key={toast.id}
          message={toast.message}
          description={toast.description}
          variant={toast.variant}
          position={toast.position}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

