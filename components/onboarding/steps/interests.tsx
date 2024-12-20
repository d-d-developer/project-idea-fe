"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { categoriesApi, userApi } from "@/lib/api"
import { Icons } from "@/components/icons"

interface Category {
  id: string
  name: string
  description?: string
  systemCategory?: boolean
}

interface InterestsStepProps {
  onNext: (data: { categories: string[] }) => void
  onBack: () => void
  isLastStep: boolean
  initialData?: { categories: string[] }
}

export function InterestsStep({ onNext, onBack, isLastStep, initialData }: InterestsStepProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categories || []
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesArray = await categoriesApi.getAll()
        setCategories(categoriesArray)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleNext = async () => {
    try {
      await userApi.updateInterests(selectedCategories)
      onNext({ categories: selectedCategories })
    } catch (error) {
      console.error('Error updating user interests:', error)
      // Continue with onNext even if the API call fails to not block the user
      onNext({ categories: selectedCategories })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Icons.spinner className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategories.includes(category.id) ? "default" : "outline"}
              className="h-auto p-4 text-left"
              onClick={() => toggleCategory(category.id)}
            >
              {category.name}
            </Button>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            No categories available
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={selectedCategories.length === 0}>
          {isLastStep ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  )
}
