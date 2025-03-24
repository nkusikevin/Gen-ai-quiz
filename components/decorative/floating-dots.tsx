interface FloatingDotsProps {
  className?: string
}

export function FloatingDots({ className = "" }: FloatingDotsProps) {
  return (
    <div className={`absolute pointer-events-none ${className}`} aria-hidden="true">
      <div className="relative w-full h-full">
        <div
          className="absolute w-2 h-2 rounded-full bg-primary/30 animate-float"
          style={{ animationDelay: "0s", top: "10%", left: "20%" }}
        ></div>
        <div
          className="absolute w-3 h-3 rounded-full bg-primary/20 animate-float"
          style={{ animationDelay: "0.5s", top: "30%", left: "70%" }}
        ></div>
        <div
          className="absolute w-2 h-2 rounded-full bg-secondary/30 animate-float"
          style={{ animationDelay: "1s", top: "70%", left: "30%" }}
        ></div>
        <div
          className="absolute w-4 h-4 rounded-full bg-primary/10 animate-float"
          style={{ animationDelay: "1.5s", top: "40%", left: "40%" }}
        ></div>
        <div
          className="absolute w-3 h-3 rounded-full bg-secondary/20 animate-float"
          style={{ animationDelay: "2s", top: "80%", left: "80%" }}
        ></div>
      </div>
    </div>
  )
}

