import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium text-[#3b82f6] ">
                Government Initiative • J&K Higher Education
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Centralized Student Activity <span className="text-[#3b82f6]">Records Platform</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Smart Student Hub revolutionizes how Higher Educational Institutions manage comprehensive student activity records. A unified digital platform designed for the Government of Jammu and Kashmir's Higher Education Department.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-[#3b82f6] hover:bg-primary/90">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
              <div>
                <p className="text-3xl font-bold text-foreground">100+</p>
                <p className="text-sm text-muted-foreground">HEIs Supported</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Students Managed</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 sm:h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-border flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="inline-block px-6 py-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-semibold text-[#3b82f6]">Platform Features</p>
              </div>
              <p className="text-muted-foreground">Comprehensive Activity Tracking</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
