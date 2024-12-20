"use client";

import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { SurveyForm } from "@/components/posts/create/survey-form";
import { ProjectForm } from "@/components/posts/create/project-form";
import { InquiryForm } from "@/components/posts/create/inquiry-form";
import { FundraiserForm } from "@/components/posts/create/fundraiser-form";

const postTypeInfo = {
  survey: {
    title: "Create Survey",
    description: "Create a survey to gather feedback and insights",
    component: SurveyForm,
  },
  project: {
    title: "Create Project",
    description: "Share your project idea and find collaborators",
    component: ProjectForm,
  },
  inquiry: {
    title: "Create Inquiry",
    description: "Ask questions or seek advice from the community",
    component: InquiryForm,
  },
  fundraiser: {
    title: "Create Fundraiser",
    description: "Start a fundraiser for your project or cause",
    component: FundraiserForm,
  },
};

export default function CreatePage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as keyof typeof postTypeInfo;

  if (!type || !postTypeInfo[type]) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-2">Invalid Post Type</h1>
            <p className="text-muted-foreground">
              Please select a valid post type from the create post dialog.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const { title, description, component: FormComponent } = postTypeInfo[type];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <FormComponent />
        </div>
      </main>
    </div>
  );
}
