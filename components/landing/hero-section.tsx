"use client";

import { Button } from "@/components/ui/button";
import { useTextAnimation } from "@/hooks/use-text-animation";
import { Sparkles, Rocket, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const { currentPhrase, isVisible } = useTextAnimation([
    "to share your ideas",
    "to validate your ideas",
    "to find partners",
    "to find investors", 
    "to find talents",
    "to grow your network",
    "to make an impact",
    "to launch your startup",
  ]);

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-1/4 -right-4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-3/4 left-1/4 w-72 h-72 bg-violet-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        <div className="absolute top-2/4 right-1/4 w-72 h-72 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[15%] animate-float animation-delay-2000">
          <Sparkles className="w-6 h-6 text-primary/40" />
        </div>
        <div className="absolute top-40 right-[20%] animate-float animation-delay-4000">
          <Rocket className="w-8 h-8 text-purple-500/40" />
        </div>
        <div className="absolute bottom-32 left-[25%] animate-float animation-delay-6000">
          <Users className="w-7 h-7 text-violet-500/40" />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000,transparent)]" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 container px-4 flex flex-col items-center justify-center text-center relative z-10">
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-sm text-primary/80 mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Turn your ideas into reality</span>
              </div>
              <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text">
                The perfect place{" "}
                <span 
                  className={`bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent transition-opacity duration-500 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {currentPhrase}
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                Connect with like-minded individuals, share your innovative ideas,
                and turn your vision into reality.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20" asChild>
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg backdrop-blur-sm border-primary/20 hover:bg-primary/5" asChild>
                <Link href="/community">
                  Explore Ideas
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">1000+</h3>
                <p className="text-muted-foreground">Active Projects</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">500+</h3>
                <p className="text-muted-foreground">Startups Launched</p>
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">5000+</h3>
                <p className="text-muted-foreground">Community Members</p>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant scroll indicator */}
        <div 
          className="relative flex flex-col items-center pb-12 z-10 cursor-pointer group"
          onClick={scrollToNextSection}
        >
          <span className="text-sm text-muted-foreground/80 font-medium tracking-wider uppercase mb-4 group-hover:text-primary transition-colors">
            Discover More
          </span>
          <div className="relative w-6 h-10 rounded-full border-2 border-primary/20 p-1">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-scroll-dot mx-auto" />
          </div>
          <div className="absolute bottom-8 w-px h-12 bg-gradient-to-b from-primary/5 to-primary/40" />
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-purple-500/5 to-background opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>
    </section>
  );
}
