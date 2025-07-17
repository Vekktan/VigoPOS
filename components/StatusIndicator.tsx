"use client"

import { CheckCircle, Clock, XCircle } from "lucide-react"

interface StatusIndicatorProps {
  status: "idle" | "processing" | "success" | "error"
  message?: string
}

export function StatusIndicator({ status, message }: StatusIndicatorProps) {
  const statusConfig = {
    idle: {
      icon: null,
      className: "",
      defaultMessage: "",
    },
    processing: {
      icon: Clock,
      className: "status-processing",
      defaultMessage: "Processing...",
    },
    success: {
      icon: CheckCircle,
      className: "status-success",
      defaultMessage: "Success!",
    },
    error: {
      icon: XCircle,
      className: "status-error",
      defaultMessage: "Error occurred",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  if (status === "idle") return null

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${config.className}`}>
      {Icon && <Icon className="w-4 h-4" />}
      <span className="text-sm font-medium">{message || config.defaultMessage}</span>
    </div>
  )
}
