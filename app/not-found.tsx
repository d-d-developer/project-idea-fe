'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 px-4">
      <div className="space-y-4 text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-lg">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href={isAuthenticated ? "/community" : "/"}>
            <Home className="mr-2 h-4 w-4" />
            {isAuthenticated ? "Go to Community" : "Back to Home"}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="javascript:history.back()">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Link>
        </Button>
      </div>
    </div>
  );
}
