"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { categoriesApi } from "@/lib/api"

interface PostFiltersProps {
  onFilterChange: (filters: {
    search?: string
    category?: string
    type?: string
  }) => void
}

export function PostFilters({ onFilterChange }: PostFiltersProps) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await categoriesApi.getAll()
        console.log('Category Data:', categoryData)
        setCategories(categoryData)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  // Handle filter changes
  useEffect(() => {
    const filters = {
      search: debouncedSearch || undefined,
      category: selectedCategory || undefined,
      type: selectedType || undefined,
    }
    onFilterChange(filters)
  }, [debouncedSearch, selectedCategory, selectedType, onFilterChange])

  const postTypes = [
    { id: "SURVEY", label: "Surveys" },
    { id: "PROJECT", label: "Projects" },
    { id: "INQUIRY", label: "Inquiries" },
    { id: "FUNDRAISER", label: "Fundraisers" },
  ]

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        <Label>Categories</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("")}
          >
            All
          </Button>
          {!isLoading && categories && categories.length > 0 ? (
            categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              {isLoading ? "Loading categories..." : "No categories available"}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Post Type</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedType === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("")}
          >
            All
          </Button>
          {postTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.id)}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
