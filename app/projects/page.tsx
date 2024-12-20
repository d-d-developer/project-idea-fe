"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

interface Project {
  id: string;
  type: string;
  title: string;
  description: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  featured: boolean;
  visibility: string;
  categories: Array<{
    id: string;
    name: string;
    description: string;
    systemCategory: boolean;
  }>;
  authorProfile: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarURL: string;
    bio: string;
    links: Record<string, string>;
  };
  createdAt: string | null;
  updatedAt: string;
  roadmapSteps: Array<{
    id: string;
    title: string;
    description: string;
    orderIndex: number;
    status: string;
    linkedPost: any;
    createdAt: string;
  }>;
  participants: Array<{
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarURL: string;
    bio: string;
    links: Record<string, string>;
  }>;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api("/posts?type=PROJECT", {
          method: "GET",
        });
        
        if (response.data._embedded?.postList) {
          setProjects(response.data._embedded.postList);
        } else {
          setProjects([]);
        }
      } catch (err) {
        setError("Failed to load projects");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={project.authorProfile.avatarURL} alt={`${project.authorProfile.firstName} ${project.authorProfile.lastName}`} />
                      <AvatarFallback>{project.authorProfile.firstName[0]}{project.authorProfile.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">{project.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        by {project.authorProfile.firstName} {project.authorProfile.lastName}
                      </p>
                    </div>
                  </div>
                  {project.featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.categories.map((category) => (
                    <Badge key={category.id} variant="outline">
                      {category.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex -space-x-2">
                    {project.participants.slice(0, 3).map((participant) => (
                      <Avatar key={participant.id} className="border-2 border-background">
                        <AvatarImage src={participant.avatarURL} alt={`${participant.firstName} ${participant.lastName}`} />
                        <AvatarFallback>{participant.firstName[0]}{participant.lastName[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                    {project.participants.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                        <span className="text-xs">+{project.participants.length - 3}</span>
                      </div>
                    )}
                  </div>
                  <span>
                    {project.updatedAt ? 
                      `Updated ${formatDistanceToNow(new Date(project.updatedAt))} ago` : 
                      'Recently created'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
