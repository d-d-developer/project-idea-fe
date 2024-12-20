"use client"

import { MultiStepForm } from "@/components/onboarding/multi-step-form"
import { InterestsStep } from "@/components/onboarding/steps/interests"
import { ProfileSetupStep } from "@/components/onboarding/steps/profile-setup"
import { FirstSurveyStep } from "@/components/onboarding/steps/first-survey"
import { UserTypeStep } from "@/components/onboarding/steps/user-type"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()
  
  const steps = [
    {
      title: "🎯 Select Your Interests",
      description: "Choose categories that interest you to personalize your experience",
      component: InterestsStep,
    },
    {
      title: "👤 Choose Your Role",
      description: "Tell us what brings you to Project Idea",
      component: UserTypeStep,
    },
    {
      title: "✨ Complete Your Profile",
      description: "Add a bio, profile picture, and social links to help others know you better",
      component: ProfileSetupStep,
    },
    {
      title: "📝 Create Your First Survey",
      description: "Let's create your first survey to engage with the community",
      component: FirstSurveyStep,
    },
  ]

  const handleComplete = async (data: any[]) => {
    try {
      const [interests, userType, profile, survey] = data

      // Update user interests
      await api('/users/me', {
        method: 'PATCH',
        body: { interests: interests.categories },
      })

      // User type is already saved in the UserTypeStep
      // Profile data is already saved in the ProfileSetupStep

      // If survey was not skipped, redirect to the survey page
      if (survey && !survey.skipped && survey.survey?.id) {
        router.push(`/surveys/${survey.survey.id}`)
      } else {
        // If survey was skipped, redirect to community page
        router.push('/community')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <MultiStepForm steps={steps} onComplete={handleComplete} />
    </div>
  )
}
