"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { surveysApi } from "@/lib/api"

interface FirstSurveyStepProps {
  onNext: (data: any) => void
  onBack: () => void
  isLastStep: boolean
}

export function FirstSurveyStep({ onNext, onBack, isLastStep }: FirstSurveyStepProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [surveyType, setSurveyType] = useState("open-ended")
  const [options, setOptions] = useState<string[]>([""])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddOption = () => {
    setOptions([...options, ""])
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSkip = () => {
    onNext({ skipped: true })
  }

  const handleNext = async () => {
    if (!title || !description) {
      return
    }

    try {
      setIsLoading(true)
      // Create the survey
      const surveyData = {
        title,
        description,
        isOpenEnded: surveyType === "open-ended",
        options: surveyType === "multiple-choice" ? options.filter(Boolean) : undefined,
      }
      const survey = await surveysApi.create(surveyData)

      onNext({ survey })
    } catch (error) {
      console.error('Error creating survey:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Survey Title</Label>
          <Input
            id="title"
            placeholder="Enter your survey title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what you want to know"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Survey Type</Label>
          <RadioGroup value={surveyType} onValueChange={setSurveyType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="open-ended" id="open-ended" />
              <Label htmlFor="open-ended">Open-ended</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multiple-choice" id="multiple-choice" />
              <Label htmlFor="multiple-choice">Multiple Choice</Label>
            </div>
          </RadioGroup>
        </div>

        {surveyType === "multiple-choice" && (
          <div className="space-y-4">
            <Label>Options</Label>
            {options.map((option, index) => (
              <Input
                key={index}
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            ))}
            <Button type="button" variant="outline" onClick={handleAddOption}>
              Add Option
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={isLoading || (!title && !description)}
          >
            {isLoading ? (
              <>
                Creating Survey...
              </>
            ) : isLastStep ? (
              "Complete"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
