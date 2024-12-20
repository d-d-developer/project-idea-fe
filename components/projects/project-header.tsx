import { Star } from "lucide-react"
import Image from "next/image"

interface ProjectHeaderProps {
  title: string
  description: string
  image: string
  category: string
  status: "active" | "completed" | "funding"
}

export function ProjectHeader({ title, description, image, category, status }: ProjectHeaderProps) {
  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Content */}
      <div className="container relative z-20 -mt-32">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-white/10 border border-primary/20 text-primary backdrop-blur-sm shadow-lg shadow-primary/10">
              {category}
            </span>
            <span className={`px-4 py-1.5 text-sm font-medium rounded-full backdrop-blur-sm border shadow-lg ${
              status === "active" 
                ? "bg-green-500/10 border-green-500/20 text-green-500 shadow-green-500/10" 
                : status === "completed" 
                ? "bg-blue-500/10 border-blue-500/20 text-blue-500 shadow-blue-500/10" 
                : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500 shadow-yellow-500/10"
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-yellow-500/20 backdrop-blur-sm shadow-lg shadow-yellow-500/10">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-500">Featured</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
