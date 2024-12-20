"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "./button"

interface BackButtonProps {
  className?: string
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`group absolute left-4 top-4 z-30 hover:bg-background/50 backdrop-blur-sm ${className}`}
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
      Back
    </Button>
  )
}
