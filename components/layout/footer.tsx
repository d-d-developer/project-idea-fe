import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-8 py-8 md:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Project Idea</h3>
            <p className="text-sm text-muted-foreground max-w-[300px]">
              A platform for innovators to share, collaborate, and bring ideas to life.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <h4 className="font-medium">Product</h4>
              <nav className="flex flex-col gap-2">
                <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </Link>
                <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Explore
                </Link>
                <Link href="/onboarding" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Get Started
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-medium">Company</h4>
              <nav className="flex flex-col gap-2">
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
                <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-medium">Legal</h4>
              <nav className="flex flex-col gap-2">
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-4 md:flex-row md:justify-between md:items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Project Idea. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
