"use client";

import { Card } from "@/components/ui/card";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { Lightbulb, Users, Rocket, Target, CircleDot } from "lucide-react";

interface JourneyStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const journeySteps: JourneyStep[] = [
  {
    title: "Share Your Idea",
    description:
      "Start by sharing your innovative project idea with our community. Get valuable feedback and insights from experienced entrepreneurs.",
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
  },
  {
    title: "Find Your Team",
    description:
      "Connect with talented individuals who share your vision. Build a strong team with complementary skills and expertise.",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    title: "Develop MVP",
    description:
      "Work together to develop a Minimum Viable Product. Test your assumptions and validate your solution in the market.",
    icon: <Rocket className="h-6 w-6 text-primary" />,
  },
  {
    title: "Get Funding",
    description:
      "Present your validated project to investors. Access funding opportunities and resources to scale your startup.",
    icon: <Target className="h-6 w-6 text-primary" />,
  },
];

export function JourneySection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Decorative circles */}
      <div className="absolute -left-24 top-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -right-24 bottom-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" 
        style={{ animationDelay: "1s" }}
      />

      {/* Floating dots */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute hidden md:block"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          <CircleDot className="w-4 h-4 text-primary/30" />
        </div>
      ))}

      <div className="container relative px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-1.5 mb-4 bg-primary/20 rounded-full">
            <span className="text-sm font-medium text-primary px-4 py-1.5">
              Your Path to Success
            </span>
          </div>
          <h2 className="text-4xl font-bold sm:text-5xl mb-6 bg-gradient-to-br from-foreground via-foreground to-primary/70 bg-clip-text text-transparent">
            Your Journey to Success
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow these steps to transform your idea into a successful startup. We'll guide you through each milestone of your entrepreneurial journey.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline line with gradient */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-transparent animate-pulse" 
              style={{ animationDuration: "3s" }}
            />
          </div>

          <div className="space-y-24 relative">
            {journeySteps.map((step, index) => (
              <JourneyCard
                key={step.title}
                step={step}
                index={index}
                total={journeySteps.length}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .bg-grid-pattern {
          background-size: 50px 50px;
          background-image: linear-gradient(to right, rgba(var(--primary) / 0.15) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(var(--primary) / 0.15) 1px, transparent 1px);
        }
      `}</style>
    </section>
  );
}

function JourneyCard({
  step,
  index,
  total,
}: {
  step: JourneyStep;
  index: number;
  total: number;
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
    rootMargin: "-100px 0px",
  });

  const isEven = index % 2 === 0;
  const delay = index * 100;

  return (
    <div ref={ref} className="relative">
      {/* Timeline dot with ring effect */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 w-6 h-6 z-10">
        <div className={cn(
          "absolute w-6 h-6 rounded-full bg-primary/30 animate-ping"
        )} />
        <div className={cn(
          "absolute w-6 h-6 rounded-full bg-primary/20 animate-pulse"
        )} />
        <div className={cn(
          "relative w-6 h-6 rounded-full border-2 border-primary bg-background transition-all duration-500",
          inView ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )} 
        style={{ transitionDelay: `${delay}ms` }}
        />
      </div>

      <div className="grid grid-cols-[1fr,auto,1fr] gap-8 items-center">
        {/* Left content */}
        <div className={cn(
          "relative transition-all duration-700",
          isEven ? "" : "opacity-0",
          inView && !isEven ? "opacity-100 translate-x-0" : "translate-x-24"
        )}
        style={{ transitionDelay: `${delay + 100}ms` }}>
          {!isEven && (
            <Card className="group p-6 backdrop-blur-sm bg-background/50 border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-full bg-primary/20 group-hover:bg-primary/30 group-hover:scale-110 transition-all">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{step.title}</h3>
              </div>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">{step.description}</p>
            </Card>
          )}
        </div>

        {/* Center line spacer */}
        <div className="w-4" />

        {/* Right content */}
        <div className={cn(
          "relative transition-all duration-700",
          !isEven ? "" : "opacity-0",
          inView && isEven ? "opacity-100 translate-x-0" : "-translate-x-24"
        )}
        style={{ transitionDelay: `${delay + 100}ms` }}>
          {isEven && (
            <Card className="group p-6 backdrop-blur-sm bg-background/50 border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-full bg-primary/20 group-hover:bg-primary/30 group-hover:scale-110 transition-all">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{step.title}</h3>
              </div>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">{step.description}</p>
            </Card>
          )}
        </div>
      </div>

      {/* Numbers on opposite sides */}
      <div className={cn(
        "absolute top-4 text-8xl font-bold text-primary/20 transition-all duration-700",
        isEven ? "right-0 translate-x-[120%]" : "left-0 -translate-x-[120%]",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${delay + 200}ms` }}>
        {(index + 1).toString().padStart(2, "0")}
      </div>
    </div>
  );
}
