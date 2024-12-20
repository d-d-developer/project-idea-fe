"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LocationMap } from "@/components/map/location-map";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Briefcase, Calendar, Github, Globe2, Linkedin, MapPin, Twitter, Loader2 } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import { BackButton } from "@/components/back-button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface InquiryPost {
  id: string;
  type: "INQUIRY";
  title: string;
  language: string;
  description: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  visibility: "ACTIVE" | "HIDDEN";
  categories: {
    id: string;
    name: string;
    description: string;
    systemCategory: boolean;
  }[];
  authorProfile: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarURL: string | null;
    bio: string | null;
    links: {
      github?: string;
      twitter?: string;
      website?: string;
      linkedin?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  professionalRole: string;
  progressStatus: "TODO" | "IN_PROGRESS" | "DONE";
  location: string;
  applications: Application[];
}

interface Application {
  id: string;
  message: string;
  createdAt: string;
  applicantProfile: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarURL: string;
    bio: string;
    links: {
      github?: string;
      twitter?: string;
      website?: string;
      linkedin?: string;
    };
  };
}

interface User {
  id: string;
  socialProfile: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarURL: string | null;
    bio: string | null;
    links: {
      github?: string;
      twitter?: string;
      website?: string;
      linkedin?: string;
    };
  };
}

export default function InquiryPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [inquiry, setInquiry] = useState<InquiryPost | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [hasApplied, setHasApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load user data. Please try refreshing the page.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user data. Please check your connection and try again.",
          variant: "destructive",
        });
      }
    };

    fetchUser();
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !id) return;

    const fetchInquiry = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setInquiry(data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load inquiry details. Please try refreshing the page.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load inquiry details. Please check your connection and try again.",
          variant: "destructive",
        });
      }
    };

    fetchInquiry();
  }, [id, isClient]);

  useEffect(() => {
    if (!isClient || !id || !user || !inquiry) return;

    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/posts/inquiries/${id}/applications`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
          if (user) {
            const hasAppliedStatus = data.some(app => app.applicantProfile.id === user.socialProfile.id);
            setHasApplied(hasAppliedStatus);
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to load applications. Please try refreshing the page.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load applications. Please check your connection and try again.",
          variant: "destructive",
        });
      }
    };

    fetchApplications();
  }, [id, user, inquiry, isClient]);

  const submitApplication = async () => {
    if (!applicationMessage.trim()) {
      toast({
        title: "Validation Error",
        description: "Please write a message before submitting your application.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/inquiries/${id}/applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: applicationMessage }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your application has been submitted successfully!",
          variant: "success"
        });
        setHasApplied(true);
        setApplicationMessage("");
      } else {
        const errorData = await response.text();
        toast({
          title: "Submission Failed",
          description: "Failed to submit your application. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!inquiry) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <BackButton />
      <Card className="overflow-hidden">
        {inquiry.featuredImageUrl && (
          <div className="relative w-full h-48">
            <img
              src={inquiry.featuredImageUrl}
              alt={inquiry.featuredImageAlt || inquiry.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          {inquiry && (
            <div className="space-y-6">
              {/* Title Section */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">{inquiry.title}</h1>
                  <div className="flex gap-2 mt-2">
                    {inquiry.categories.map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ShareButton url={window.location.href} />
              </div>

              {/* Content Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Description */}
                <div className="space-y-6">
                  <div className="prose max-w-none">
                    <p>{inquiry.description}</p>
                  </div>
                </div>

                {/* Right Column - Map and Details */}
                <div className="space-y-6">
                  <Card className="p-4">
                    <div className="space-y-4">
                      {/* Location Map */}
                      <div className="h-[200px] w-full rounded-lg overflow-hidden">
                        <LocationMap location={inquiry.location} />
                      </div>

                      {/* Location and Role Details */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{inquiry.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{inquiry.professionalRole}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Posted on {new Date(inquiry.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Author Profile Card */}
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={inquiry.authorProfile.avatarURL || undefined} />
                          <AvatarFallback>
                            {inquiry.authorProfile.firstName[0]}
                            {inquiry.authorProfile.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <Link 
                            href={`/profile/${inquiry.authorProfile.username}`}
                            className="text-sm font-medium hover:underline"
                          >
                            {inquiry.authorProfile.username}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {inquiry.authorProfile.bio && (
                        <p className="text-sm text-muted-foreground">{inquiry.authorProfile.bio}</p>
                      )}

                      {inquiry.authorProfile.links && Object.keys(inquiry.authorProfile.links).length > 0 && (
                        <div className="flex gap-2">
                          {inquiry.authorProfile.links.github && (
                            <Link
                              href={inquiry.authorProfile.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Github className="h-4 w-4" />
                            </Link>
                          )}
                          {inquiry.authorProfile.links.linkedin && (
                            <Link
                              href={inquiry.authorProfile.links.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Linkedin className="h-4 w-4" />
                            </Link>
                          )}
                          {inquiry.authorProfile.links.twitter && (
                            <Link
                              href={inquiry.authorProfile.links.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Twitter className="h-4 w-4" />
                            </Link>
                          )}
                          {inquiry.authorProfile.links.website && (
                            <Link
                              href={inquiry.authorProfile.links.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Globe2 className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Applications Section - Below both columns */}
              <div className="mt-8">
                {inquiry.authorProfile.id === user?.socialProfile.id ? (
                  // Show applications list to the author
                  <div>
                    <h2 className="text-lg font-semibold mb-4">
                      Applications Received
                    </h2>
                    <div className="space-y-4">
                      {applications.length === 0 ? (
                        <p className="text-muted-foreground">No applications received yet.</p>
                      ) : (
                        applications.map((application) => (
                          <Card key={application.id} className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={application.applicantProfile.avatarURL} />
                                <AvatarFallback>
                                  {application.applicantProfile.firstName[0]}{application.applicantProfile.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">
                                      {application.applicantProfile.firstName} {application.applicantProfile.lastName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">@{application.applicantProfile.username}</p>
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(application.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="mt-2">{application.message}</p>
                                {application.applicantProfile.links && Object.keys(application.applicantProfile.links).length > 0 && (
                                  <div className="flex gap-2 mt-2">
                                    {application.applicantProfile.links.github && (
                                      <a href={application.applicantProfile.links.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                        <Github className="h-4 w-4" />
                                      </a>
                                    )}
                                    {application.applicantProfile.links.linkedin && (
                                      <a href={application.applicantProfile.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                        <Linkedin className="h-4 w-4" />
                                      </a>
                                    )}
                                    {application.applicantProfile.links.twitter && (
                                      <a href={application.applicantProfile.links.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                        <Twitter className="h-4 w-4" />
                                      </a>
                                    )}
                                    {application.applicantProfile.links.website && (
                                      <a href={application.applicantProfile.links.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                        <Globe2 className="h-4 w-4" />
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                ) : hasApplied ? (
                  <Card className="p-4">
                    <p className="text-muted-foreground">You have already applied to this inquiry.</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Apply for this Position</h2>
                    <Textarea
                      placeholder="Tell us why you're a great fit for this position..."
                      value={applicationMessage}
                      onChange={(e) => setApplicationMessage(e.target.value)}
                      className="min-h-[120px]"
                      disabled={isSubmitting}
                    />
                    <Button 
                      onClick={submitApplication} 
                      disabled={!applicationMessage || isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
