import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ProblemSolution() {
  return (
    <section id="problem" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Problem */}
          <Card className="p-8 border-border bg-card">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-lg bg-destructive/10">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">The Challenge</h3>
            </div>

            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-destructive mt-1">•</span>
                <span className="text-muted-foreground">Fragmented student records scattered across multiple institutions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive mt-1">•</span>
                <span className="text-muted-foreground">Time-consuming manual data entry and verification processes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive mt-1">•</span>
                <span className="text-muted-foreground">Lack of real-time visibility into student activities</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive mt-1">•</span>
                <span className="text-muted-foreground">Data security and compliance concerns with legacy systems</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive mt-1">•</span>
                <span className="text-muted-foreground">Inefficient reporting and analytics capabilities</span>
              </li>
            </ul>
          </Card>

          {/* Solution */}
          <Card className="p-8 border-border bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Our Solution</h3>
            </div>

            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-muted-foreground">Unified platform integrating all HEIs under one system</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-muted-foreground">Automated data collection and management workflows</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-muted-foreground">Real-time dashboard for instant activity tracking</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-muted-foreground">Enterprise-grade security with government compliance</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span className="text-muted-foreground">Powerful analytics and comprehensive reporting tools</span>
              </li>
            </ul>
          </Card>

        </div>
      </div>
    </section>
  )
}
