"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface Step {
  title: string
  description: string
  component: React.ComponentType<{
    onNext: (data: any) => void
    onBack: () => void
    isLastStep: boolean
    initialData?: any
  }>
}

interface MultiStepFormProps {
  steps: Step[]
  onComplete: (allData: any) => void
}

export function MultiStepForm({ steps, onComplete }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<number, any>>({})
  const [isLoading, setIsLoading] = useState(false)

  const CurrentStepComponent = steps[currentStep].component
  const isLastStep = currentStep === steps.length - 1

  const handleNext = async (stepData: any) => {
    setIsLoading(true)
    try {
      const newFormData = {
        ...formData,
        [currentStep]: stepData,
      }
      setFormData(newFormData)

      if (isLastStep) {
        console.log('Submitting survey data:', Object.values(newFormData));
        await onComplete(Object.values(newFormData))
      } else {
        setCurrentStep((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Error in form step:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
        <p className="text-muted-foreground">{steps[currentStep].description}</p>
      </div>

      <div className="flex items-center space-x-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-16 rounded ${
              index <= currentStep ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <div className="mt-4">
        <CurrentStepComponent
          onNext={handleNext}
          onBack={handleBack}
          isLastStep={isLastStep}
          initialData={formData[currentStep]}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center">
          <Icons.spinner className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  )
}
