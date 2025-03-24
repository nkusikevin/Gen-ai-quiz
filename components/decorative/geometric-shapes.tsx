interface GeometricShapesProps {
  className?: string
}

export function GeometricShapes({ className = "" }: GeometricShapesProps) {
  return (
    <div className={`absolute pointer-events-none ${className}`} aria-hidden="true">
      <div className="relative w-full h-full">
        <div
          className="absolute w-16 h-16 border-2 border-primary/20 rounded-lg animate-rotate-slow"
          style={{ top: "10%", left: "10%", transformOrigin: "center" }}
        ></div>
        <div
          className="absolute w-12 h-12 border-2 border-secondary/20 rotate-45 animate-float"
          style={{ animationDelay: "1s", top: "60%", left: "80%" }}
        ></div>
        <div
          className="absolute w-20 h-20 border border-primary/10 rounded-full animate-pulse-soft"
          style={{ animationDelay: "0.5s", top: "70%", left: "20%" }}
        ></div>
        <div
          className="absolute w-8 h-8 bg-primary/5 rounded-md animate-float"
          style={{ animationDelay: "1.5s", top: "20%", left: "70%" }}
        ></div>
      </div>
    </div>
  )
}

