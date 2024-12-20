import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectContent } from "@/components/projects/project-content"
import { BackButton } from "@/components/ui/back-button"

export default function EcoTrackPage() {
  return (
    <div className="relative">
      <BackButton />
      <ProjectHeader
        title="EcoTrack"
        description="A revolutionary app for tracking and reducing your carbon footprint through smart analytics and personalized recommendations."
        image="/images/project1.jpg"
        category="Sustainability"
        status="active"
      />
      <ProjectContent
        teamSize={6}
        goalAmount={150000}
        currentAmount={89000}
        deadline="March 31, 2024"
        description={`EcoTrack is an innovative mobile application designed to help individuals and businesses track and reduce their carbon footprint. By leveraging advanced IoT sensors and machine learning algorithms, EcoTrack provides real-time insights into your environmental impact and offers personalized recommendations for sustainable living.

Our platform analyzes various aspects of daily life, from energy consumption to transportation choices, and provides actionable insights to help users make more environmentally conscious decisions. The app also features a social component, allowing users to connect with like-minded individuals and share their sustainability journey.`}
        features={[
          "Real-time carbon footprint tracking using IoT sensors",
          "Personalized recommendations powered by AI",
          "Community features for sharing tips and achievements",
          "Integration with smart home devices",
          "Monthly sustainability reports and analytics",
          "Gamification elements to encourage sustainable habits",
        ]}
        challenges={[
          "Developing accurate carbon footprint calculation algorithms that account for various lifestyle factors and regional differences.",
          "Creating an intuitive user interface that makes complex environmental data accessible and actionable for users.",
          "Building a scalable infrastructure to handle real-time data processing from IoT devices while maintaining user privacy.",
        ]}
      />
    </div>
  )
}
