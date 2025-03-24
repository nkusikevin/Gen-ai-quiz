"use client"

import { motion } from "framer-motion"
import { FileText, FileQuestion, FileCheck, BookOpen, Brain, Lightbulb, Sparkles } from "lucide-react"

interface AnimatedLoadingProps {
  message?: string
}

export function AnimatedLoading({ message = "Analyzing PDF and generating questions..." }: AnimatedLoadingProps) {
  const icons = [
    { Icon: FileText, delay: 0, y: -20 },
    { Icon: FileQuestion, delay: 0.5, y: 20 },
    { Icon: FileCheck, delay: 1, y: -15 },
    { Icon: BookOpen, delay: 1.5, y: 25 },
    { Icon: Brain, delay: 2, y: -25 },
    { Icon: Lightbulb, delay: 2.5, y: 15 },
    { Icon: Sparkles, delay: 3, y: -10 },
  ]

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      <div className="relative h-40 w-full max-w-md">
        {/* Central pulsing circle */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Orbiting icons */}
        {icons.map(({ Icon, delay, y }, index) => {
          const angle = (index / icons.length) * Math.PI * 2
          const radius = 80
          const x = Math.cos(angle) * radius
          const yPos = Math.sin(angle) * radius + y

          return (
            <motion.div
              key={index}
              className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-background p-2 shadow-md"
              initial={{ x, y: yPos, opacity: 0, scale: 0.5 }}
              animate={{
                x,
                y: yPos,
                opacity: 1,
                scale: 1,
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{
                delay: delay,
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <Icon className="h-full w-full text-primary" />
            </motion.div>
          )
        })}

        {/* Floating question marks */}
        {[...Array(12)].map((_, i) => {
          const size = Math.random() * 16 + 8
          const initialX = (Math.random() - 0.5) * 200
          const initialY = (Math.random() - 0.5) * 200
          const delay = Math.random() * 2

          return (
            <motion.div
              key={`question-${i}`}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-primary/20"
              style={{ fontSize: size }}
              initial={{ x: initialX, y: initialY, opacity: 0 }}
              animate={{
                x: initialX + (Math.random() - 0.5) * 40,
                y: initialY + (Math.random() - 0.5) * 40,
                opacity: [0, 0.7, 0],
              }}
              transition={{
                delay: delay,
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              ?
            </motion.div>
          )
        })}

        {/* Document lines */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute left-1/2 top-1/2 h-0.5 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10"
            initial={{ rotate: i * 60, scale: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 0.7, 0] }}
            transition={{
              delay: i * 0.5,
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <motion.div
        className="h-1 w-[90%] mt-8 overflow-hidden rounded-full bg-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      </motion.div>

      <motion.p
        className="text-center text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.p>

      <motion.div
        className="mt-2 text-sm text-muted-foreground/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        Extracting key concepts...
      </motion.div>
    </div>
  )
}

