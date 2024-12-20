import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, Target, Calendar, ArrowRight } from "lucide-react"

interface ProjectContentProps {
  teamSize: number
  goalAmount: number
  currentAmount: number
  deadline: string
  description: string
  features: string[]
  challenges: string[]
}

export function ProjectContent({
  teamSize,
  goalAmount,
  currentAmount,
  deadline,
  description,
  features,
  challenges,
}: ProjectContentProps) {
  const progress = (currentAmount / goalAmount) * 100

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">About the Project</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{description}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Challenges & Solutions</h2>
            <div className="space-y-4">
              {challenges.map((challenge, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted">
                  <p className="text-muted-foreground">{challenge}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Project Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Team Size</p>
                  <p className="font-medium">{teamSize} Members</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Funding Goal</p>
                  <p className="font-medium">${goalAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium">{deadline}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Funding Progress</h3>
            <Progress value={progress} className="h-2 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground mb-4">
              <span>${currentAmount.toLocaleString()} raised</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
              Support Project
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
