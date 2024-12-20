import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { JourneySection } from "@/components/landing/journey-section"
import { Lightbulb, Users, Rocket, Star, ArrowRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        
        <JourneySection />

        {/* Platform Impact Section */}
        <section className="relative py-32 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Join Our Thriving Community
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Be part of a growing ecosystem of innovators, entrepreneurs, and creators
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
              {[
                { value: "500+", label: "Active Projects" },
                { value: "2.5K+", label: "Community Members" },
                { value: "€1M+", label: "Funds Raised" },
                { value: "50+", label: "Success Stories" }
              ].map((stat, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100 rounded-xl" />
                  <div className="relative text-center space-y-3 p-6 rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
              {[
                {
                  title: "Business & Innovation",
                  description: "From traditional businesses to innovative startups across all sectors - retail, hospitality, healthcare, tech, and beyond.",
                  icon: <Rocket className="h-6 w-6 text-primary" />,
                  stats: ["200+ Diverse Projects", "500+ Entrepreneurs"]
                },
                {
                  title: "Creative & Cultural",
                  description: "Bring your creative and cultural projects to life - arts, entertainment, fashion, culinary, heritage, and more.",
                  icon: <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>,
                  stats: ["150+ Creative Ventures", "300+ Visionaries"]
                },
                {
                  title: "Social Impact",
                  description: "Create meaningful change in any field - education, sustainability, community development, health & wellness, and social initiatives.",
                  icon: <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14C13.6569 14 15 12.6569 15 11C15 9.34315 13.6569 8 12 8C10.3431 8 9 9.34315 9 11C9 12.6569 10.3431 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>,
                  stats: ["100+ Impact Projects", "€500K+ Impact Funding"]
                }
              ].map((category, index) => (
                <div key={index} className="group relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100 rounded-xl" />
                  <div className="relative h-full border rounded-xl p-8 space-y-6 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                    <div className="p-4 rounded-xl bg-primary/10 w-fit">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">{category.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{category.description}</p>
                    </div>
                    <div className="pt-4 space-y-3">
                      {category.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary/50" />
                          <span className="text-sm text-muted-foreground font-medium">{stat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="relative py-32 bg-gradient-to-b from-background to-primary/5 -mt-24">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Featured Projects</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Discover some of the amazing projects our community has brought to life.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Featured Project Card 1 */}
              <div className="group relative bg-background/50 rounded-lg overflow-hidden border hover:shadow-xl transition-all duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                  <Image
                    src="/images/project1.jpg"
                    alt="Project 1"
                    width={400}
                    height={300}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Featured</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">EcoTrack</h3>
                  <p className="text-muted-foreground text-sm mb-4">A revolutionary app for tracking and reducing your carbon footprint.</p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/projects/eco-track">Learn More</Link>
                  </Button>
                </div>
              </div>

              {/* Featured Project Card 2 */}
              <div className="group relative bg-background/50 rounded-lg overflow-hidden border hover:shadow-xl transition-all duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                  <Image
                    src="/images/project2.jpg"
                    alt="Project 2"
                    width={400}
                    height={300}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Featured</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">SmartLearn AI</h3>
                  <p className="text-muted-foreground text-sm mb-4">Personalized learning platform powered by artificial intelligence.</p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/projects/smart-learn">Learn More</Link>
                  </Button>
                </div>
              </div>

              {/* Featured Project Card 3 */}
              <div className="group relative bg-background/50 rounded-lg overflow-hidden border hover:shadow-xl transition-all duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                  <Image
                    src="/images/project3.jpg"
                    alt="Project 3"
                    width={400}
                    height={300}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Featured</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">UrbanGarden</h3>
                  <p className="text-muted-foreground text-sm mb-4">Smart solution for urban farming and sustainable living.</p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/projects/urban-garden">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-primary/5">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">What Our Users Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Join thousands of satisfied users who have brought their ideas to life.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-background/50 p-6 rounded-lg border relative">
                <Quote className="h-8 w-8 text-primary/20 absolute -top-4 -left-4" />
                <p className="text-muted-foreground mb-4">"This platform has been instrumental in helping me turn my idea into a successful startup. The community support is incredible!"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">SJ</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">Tech Entrepreneur</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-background/50 p-6 rounded-lg border relative">
                <Quote className="h-8 w-8 text-primary/20 absolute -top-4 -left-4" />
                <p className="text-muted-foreground mb-4">"The tools and resources available here made it easy to collaborate with others and bring my project to life."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">MP</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Michael Park</h4>
                    <p className="text-sm text-muted-foreground">Product Designer</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-background/50 p-6 rounded-lg border relative">
                <Quote className="h-8 w-8 text-primary/20 absolute -top-4 -left-4" />
                <p className="text-muted-foreground mb-4">"As an investor, I've found some of the most innovative projects here. The quality of ideas and execution is outstanding."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">AR</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Anna Rodriguez</h4>
                    <p className="text-sm text-muted-foreground">Angel Investor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-primary/5 opacity-50" />
          <div className="container max-w-6xl mx-auto px-4 relative">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Ready to Bring Your Ideas to Life?</h2>
              <p className="text-lg text-muted-foreground mb-8">Join our community of innovators and start building something amazing today.</p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" asChild>
                  <Link href="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary/20" asChild>
                  <Link href="/community">Explore Ideas</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
