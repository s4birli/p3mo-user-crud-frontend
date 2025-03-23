import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
  size?: "sm" | "default" | "lg"
  fullPage?: boolean
}

export function Loading({
  text = "Loading...",
  size = "default",
  fullPage = false,
  className,
  ...props
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        fullPage && "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export function LoadingButton({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-muted text-muted-foreground animate-pulse",
        className
      )}
      {...props}
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading...
    </div>
  )
}

export function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 shadow-sm space-y-3",
        className
      )}
      {...props}
    >
      <div className="h-5 w-2/5 rounded-md bg-muted animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 rounded-md bg-muted animate-pulse" />
        <div className="h-4 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-4/5 rounded-md bg-muted animate-pulse" />
      </div>
    </div>
  )
} 