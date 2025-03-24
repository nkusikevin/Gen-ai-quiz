interface WavePatternProps {
  className?: string
}

export function WavePattern({ className = "" }: WavePatternProps) {
  return (
    <svg
      className={`text-gray-200 dark:text-gray-800 ${className}`}
      width="100%"
      height="100%"
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 10 C 30 20, 70 0, 100 10 L 100 0 L 0 0 Z" fill="currentColor" />
    </svg>
  )
}

