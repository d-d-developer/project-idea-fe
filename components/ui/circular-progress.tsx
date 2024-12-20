import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CircularProgress({
  value,
  size = "md",
  className,
}: CircularProgressProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, value));
  const offset = circumference - (progress / 100) * circumference;

  const sizes = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  return (
    <div className={cn("relative", sizes[size], className)}>
      <svg className="h-full w-full -rotate-90">
        {/* Background circle */}
        <circle
          className="stroke-muted"
          fill="none"
          strokeWidth="8"
          cx="50%"
          cy="50%"
          r={radius}
        />
        {/* Progress circle */}
        <circle
          className="stroke-primary transition-all duration-300 ease-in-out"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          cx="50%"
          cy="50%"
          r={radius}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
