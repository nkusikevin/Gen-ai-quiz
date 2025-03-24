interface CircleProps {
  className?: string
}

export function Circle({ className = "" }: CircleProps) {
  return <div className={`rounded-full bg-primary/10 dark:bg-primary/5 ${className}`} aria-hidden="true" />
}

