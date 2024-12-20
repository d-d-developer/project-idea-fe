"use client";

import { ProjectFilesStep } from "@/components/posts/create/project-files-step";

interface ProjectFilesPageProps {
  params: {
    id: string;
  };
}

export default function ProjectFilesPage({ params }: ProjectFilesPageProps) {
  return (
    <div className="container max-w-3xl py-6 space-y-6">
      <ProjectFilesStep projectId={params.id} />
    </div>
  );
}
