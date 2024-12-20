"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { api } from "@/lib/api"
import { Icons } from "@/components/icons"

interface UserTypeStepProps {
  onNext: (data: { userType: string }) => void
  onBack: () => void
  isLastStep: boolean
  initialData?: {
    userType?: string
  }
}

export function UserTypeStep({ onNext, onBack, isLastStep, initialData }: UserTypeStepProps) {
  const [userType, setUserType] = useState<string>(initialData?.userType || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    if (!userType) return

    try {
      setIsLoading(true)
      // Update the user's type
      await api("/users/me", {
        method: "PATCH",
        body: { userType }
      })
      onNext({ userType })
    } catch (error) {
      console.error('Error updating user type:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">What brings you to Project Idea?</h2>
          <p className="text-sm text-muted-foreground">
            Choose your role to help us personalize your experience
          </p>
        </div>

        <RadioGroup
          value={userType}
          onValueChange={setUserType}
          className="grid gap-4"
        >
          <div>
            <RadioGroupItem
              value="PROFESSIONAL"
              id="professional"
              className="peer sr-only"
            />
            <Label
              htmlFor="professional"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="text-2xl mb-2">👨‍💼</div>
              <span className="text-base">Professional</span>
              <span className="text-sm text-muted-foreground">
                Looking for work opportunities
              </span>
            </Label>
          </div>

          <div>
            <RadioGroupItem
              value="CREATOR"
              id="creator"
              className="peer sr-only"
            />
            <Label
              htmlFor="creator"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="text-2xl mb-2">🚀</div>
              <span className="text-base">Creator</span>
              <span className="text-sm text-muted-foreground">
                Has project ideas
              </span>
            </Label>
          </div>

          <div>
            <RadioGroupItem
              value="INVESTOR"
              id="investor"
              className="peer sr-only"
            />
            <Label
              htmlFor="investor"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="text-2xl mb-2">💰</div>
              <span className="text-base">Investor</span>
              <span className="text-sm text-muted-foreground">
                Looking for investment opportunities
              </span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={isLoading || !userType}
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isLastStep ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  )
}
