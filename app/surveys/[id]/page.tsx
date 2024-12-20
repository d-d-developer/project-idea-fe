"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShareButton } from "@/components/share-button";
import { BackButton } from "@/components/back-button";
import Link from "next/link";

interface SurveyResponse {
  id: number;
  response?: string;
  selectedOptions?: string[];
  socialProfile: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarURL: string;
  };
}

interface Survey {
  id: string;
  title: string;
  description: string;
  options?: string[];
  responses: SurveyResponse[];
  allowMultipleAnswers: boolean;
  authorProfile: {
    username: string;
  };
  isOpenEnded?: boolean;
}

interface Statistics {
  [key: string]: number;
}

export default function SurveyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [answer, setAnswer] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: survey, isLoading: surveyLoading, error: surveyError } = useQuery<Survey>({
    queryKey: ["survey", id],
    queryFn: () => api(`/posts/${id}`).then((res) => res.data),
  });

  const { data: statistics, isLoading: statisticsLoading } = useQuery<Statistics>({
    queryKey: ["survey-statistics", id],
    queryFn: () => api(`/responses/multiple-choice/survey/${id}/statistics`).then((res) => res.data),
    enabled: !!(survey && !survey.isOpenEnded),
  });

  const submitResponse = async () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    try {
      if (!survey?.options) {
        const response = await api(`/responses/open-ended/${survey?.id}`, {
          method: "POST",
          body: { response: answer },
        });
        
        if (response.data) {
          toast({
            title: "Response Submitted",
            description: "Your answer has been recorded successfully.",
            variant: "default",
          });
          
          // Reset form
          setAnswer("");
          
          // Refresh data
          await queryClient.invalidateQueries({ queryKey: ["survey", id] });
        }
      } else {
        if (selectedOptions.length === 0) {
          toast({
            title: "Selection Required",
            description: "Please select at least one option.",
            variant: "destructive",
          });
          return;
        }

        const response = await api(`/responses/multiple-choice/${survey.id}`, {
          method: "POST",
          body: { selectedOptions },
        });

        if (response.data) {
          toast({
            title: "Response Submitted",
            description: `Your selection${selectedOptions.length > 1 ? 's' : ''} (${selectedOptions.join(", ")}) has been recorded successfully.`,
            variant: "default",
          });
          
          // Reset form
          setSelectedOptions([]);
          
          // Refresh data
          await queryClient.invalidateQueries({ queryKey: ["survey", id] });
        }
      }
    } catch (error) {
      console.error('Survey submission error:', error);
      
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/signup");
  };

  if (surveyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (surveyError || !survey) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-destructive">Error Loading Survey</h1>
          <p className="text-muted-foreground mt-2">
            Failed to load the survey. Please try again later.
          </p>
        </div>
      </Card>
    );
  }

  const isOpenEnded = !survey.options || survey.options.length === 0;

  const handleOptionChange = (option: string) => {
    if (survey.allowMultipleAnswers) {
      setSelectedOptions(prev => {
        if (prev.includes(option)) {
          return prev.filter(v => v !== option);
        } else {
          return [...prev, option];
        }
      });
    } else {
      setSelectedOptions([option]);
    }
  };

  return (
    <div className="container max-w-4xl py-6">
      <BackButton />
      <Toaster />
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to participate in surveys. Please login or create an account to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end mt-4">
            <Button variant="outline" onClick={handleLogin}>
              Login
            </Button>
            <Button onClick={handleRegister}>
              Register
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{survey.title}</h1>
          <ShareButton url={window.location.href} />
        </div>
        <p className="text-muted-foreground mb-8">{survey.description}</p>

        {isOpenEnded ? (
          <div className="space-y-6">
            <Textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[120px]"
            />
            <Button onClick={submitResponse} disabled={!answer}>
              Submit Response
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <RadioGroup
              value={selectedOptions[0]}
              onValueChange={handleOptionChange}
              className="space-y-4"
            >
              {survey.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  {survey.allowMultipleAnswers ? (
                    <input
                      type="checkbox"
                      id={option}
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionChange(option)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  ) : (
                    <RadioGroupItem value={option} id={option} />
                  )}
                  <label
                    htmlFor={option}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={submitResponse} disabled={selectedOptions.length === 0}>
              Submit Response
            </Button>
          </div>
        )}

        {/* Statistics for multiple-choice surveys */}
        {!isOpenEnded && statistics && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Statistics</h2>
            <div className="space-y-4">
              {survey.options?.map((option) => (
                <div key={option} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{option}</span>
                    <span className="text-muted-foreground">
                      {statistics[option] || 0} votes ({Object.values(statistics).reduce((a, b) => a + b, 0) > 0
                        ? Math.round((statistics[option] || 0) / Object.values(statistics).reduce((a, b) => a + b, 0) * 100)
                        : 0}%)
                    </span>
                  </div>
                  <Progress
                    value={Object.values(statistics).reduce((a, b) => a + b, 0) > 0
                      ? ((statistics[option] || 0) / Object.values(statistics).reduce((a, b) => a + b, 0)) * 100
                      : 0}
                  />
                </div>
              ))}
              <p className="text-sm text-muted-foreground">
                Total responses: {Object.values(statistics).reduce((a, b) => a + b, 0)}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Survey Responses - Only visible to creator for multiple-choice surveys */}
      {!surveyLoading && survey && (isOpenEnded || user?.socialProfile?.username === survey.authorProfile.username) && (
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold">Responses</h2>
          {survey.responses.length === 0 ? (
            <p className="text-muted-foreground">No responses yet. Be the first to respond!</p>
          ) : (
            <div className="space-y-4">
              {survey.responses.map((response) => (
                <Card key={response.id} className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar and Username */}
                    <div className="flex-shrink-0">
                      <img
                        src={response.socialProfile.avatarURL}
                        alt={response.socialProfile.username}
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/profile/${response.socialProfile.username}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {response.socialProfile.username}
                        </Link>
                        <span className="text-sm text-muted-foreground">
                          {response.socialProfile.firstName} {response.socialProfile.lastName}
                        </span>
                      </div>
                      <p className="mt-2 text-sm">
                        {response.response || response.selectedOptions?.join(", ")}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
