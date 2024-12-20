import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectContent } from "@/components/projects/project-content"
import { BackButton } from "@/components/ui/back-button"

export default function SmartLearnPage() {
  return (
    <div className="relative">
      <BackButton />
      <ProjectHeader
        title="SmartLearn AI"
        description="An adaptive learning platform that personalizes education using artificial intelligence to match each student's unique learning style and pace."
        image="/images/project2.jpg"
        category="Education"
        status="funding"
      />
      <ProjectContent
        teamSize={8}
        goalAmount={200000}
        currentAmount={145000}
        deadline="April 15, 2024"
        description={`SmartLearn AI is revolutionizing education by creating truly personalized learning experiences. Our platform uses advanced artificial intelligence algorithms to understand each student's learning style, pace, and preferences, then adapts the curriculum accordingly.

The system continuously analyzes student performance and engagement, adjusting the difficulty level and teaching methods in real-time. Whether it's visual, auditory, or kinesthetic learning, SmartLearn AI ensures that educational content is presented in the most effective way for each individual student.

We're not just creating another e-learning platform; we're building an intelligent tutor that evolves with each student, ensuring that no one gets left behind and everyone can reach their full potential.`}
        features={[
          "AI-powered learning path customization",
          "Real-time performance analytics",
          "Multi-modal content delivery (video, text, interactive exercises)",
          "Automated progress tracking and reporting",
          "Collaborative learning spaces",
          "Integration with popular learning management systems",
          "Mobile-first design for learning on the go",
        ]}
        challenges={[
          "Developing sophisticated AI algorithms that can accurately assess learning styles and adapt content delivery methods.",
          "Creating engaging, interactive content that works across multiple learning modalities.",
          "Ensuring the platform remains accessible and effective for students with different levels of technological proficiency.",
          "Building a scalable system that can handle thousands of simultaneous users while maintaining personalized experiences.",
        ]}
      />
    </div>
  )
}
