"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface FundraiserDonationDialogProps {
  fundraiserId: string;
  onUpdate?: () => void;
}

const donationTiers = [50, 100, 250, 500, 1000];

export function FundraiserDonationDialog({
  fundraiserId,
  onUpdate,
}: FundraiserDonationDialogProps) {
  const [sliderValue, setSliderValue] = useState([50]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { mutate: updateRaisedAmount, isLoading } = useMutation({
    mutationFn: async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(
        `http://localhost:3009/posts/fundraisers/${fundraiserId}/raised-amount?amount=${sliderValue[0]}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process donation');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Thank you for your investment!",
      });
      setOpen(false);
      onUpdate?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process donation",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    updateRaisedAmount();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          Invest in this project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make an Investment</DialogTitle>
          <DialogDescription>
            Choose your investment amount using the slider below
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-3xl font-bold">€{sliderValue[0]}</span>
            </div>
            <div className="px-1">
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={1000}
                min={50}
                step={50}
                className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-4 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-background [&_[role=slider]]:shadow-lg [&_[role=slider]]:ring-offset-background [&_[role=slider]]:transition-all [&_[role=slider]]:duration-150 [&_[role=slider]]:ease-out h-2 py-4"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground px-1">
              {donationTiers.map((value) => (
                <div 
                  key={value} 
                  className="text-center cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setSliderValue([value])}
                >
                  €{value}
                </div>
              ))}
            </div>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading} 
            className="w-full h-12 text-lg font-semibold"
          >
            {isLoading ? "Processing..." : `Invest €${sliderValue[0]}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
