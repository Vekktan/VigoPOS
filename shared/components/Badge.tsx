import type React from "react"
import { cn } from "../utils/cn"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "info"
  size?: "sm" | "md"
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", size = "md", className }) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full"

  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  }

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  }

  return <span className={cn(baseClasses, variants[variant], sizes[size], className)}>{children}</span>
}
