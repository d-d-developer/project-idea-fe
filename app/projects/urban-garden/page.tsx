import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectContent } from "@/components/projects/project-content"
import { BackButton } from "@/components/ui/back-button"

export default function UrbanGardenPage() {
  return (
    <div className="relative">
      <BackButton />
      <ProjectHeader
        title="UrbanGarden"
        description="A smart solution for urban farming that combines IoT technology with sustainable agriculture practices to enable efficient food production in city environments."
        image="/images/project3.jpg"
        category="Agriculture"
        status="completed"
      />
      <ProjectContent
        teamSize={5}
        goalAmount={120000}
        currentAmount={120000}
        deadline="Completed"
        description={`UrbanGarden is an innovative solution that brings sustainable agriculture to urban environments. Our system combines smart technology with traditional farming techniques to create efficient, space-saving gardens that can be managed through a mobile application.

The platform includes automated irrigation systems, climate control, and plant monitoring through IoT sensors. Users can track their garden's progress, receive care recommendations, and connect with a community of urban farmers to share tips and experiences.

UrbanGarden is designed to make sustainable food production accessible to everyone, regardless of their gardening experience or available space. Whether you have a small balcony or a rooftop, our solution helps you create and maintain a thriving garden in any urban setting.`}
        features={[
          "Smart irrigation system with water usage optimization",
          "IoT sensors for monitoring plant health and growth",
          "Mobile app for remote garden management",
          "Community marketplace for trading produce",
          "AI-powered plant care recommendations",
          "Integration with weather forecasting services",
          "Vertical farming support and planning tools",
        ]}
        challenges={[
          "Designing efficient vertical farming systems that maximize space utilization while maintaining optimal growing conditions.",
          "Creating user-friendly interfaces that make complex agricultural concepts accessible to beginners.",
          "Developing reliable sensor systems that can accurately monitor multiple environmental factors affecting plant growth.",
          "Optimizing water and energy usage while ensuring maximum crop yield.",
        ]}
      />
    </div>
  )
}
