"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Building, Settings, Zap, ArrowRight } from "lucide-react"

export function OnboardingComplete({ onComplete }) {
  const [isLaunching, setIsLaunching] = useState(false)

  const handleLaunchPlatform = () => {
    setIsLaunching(true)
    setTimeout(() => {
      onComplete()
      window.location.href = "/dashboard"
    }, 2000)
  }

  const setupSummary = [
    {
      icon: Building,
      title: "Organization Setup",
      description: "Institution profile and branding configured",
      status: "complete",
    },
    {
      icon: Users,
      title: "Department Structure",
      description: "5 departments added with academic configuration",
      status: "complete",
    },
    {
      icon: CheckCircle,
      title: "User Invitations",
      description: "Invitation system configured and ready",
      status: "complete",
    },
    {
      icon: Settings,
      title: "System Configuration",
      description: "Email, notifications, and security settings applied",
      status: "complete",
    },
  ]

  const nextSteps = [
    {
      title: "Customize Your Dashboard",
      description: "Personalize the interface with your institution's branding and preferences",
    },
    {
      title: "Import Existing Data",
      description: "Upload student records, faculty information, and historical data",
    },
    {
      title: "Train Your Team",
      description: "Provide training sessions for faculty and administrative staff",
    },
    {
      title: "Launch to Students",
      description: "Begin onboarding students and start tracking their achievements",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Setup Complete!</CardTitle>
          <CardDescription className="text-green-700">
            Your Smart Student Hub is ready to transform your institution's student achievement tracking
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Setup Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Summary</CardTitle>
          <CardDescription>Review what has been configured during the onboarding process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {setupSummary.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Complete
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
          <CardDescription>Here's what you can do to get the most out of your Smart Student Hub</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-primary">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Features */}
      <Card>
        <CardHeader>
          <CardTitle>What's Available Now</CardTitle>
          <CardDescription>Your Smart Student Hub comes with these powerful features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                For Students
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Activity tracking and validation</li>
                <li>• Digital portfolio generation</li>
                <li>• Achievement dashboard</li>
                <li>• Progress monitoring</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                For Faculty & Admin
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Activity approval workflow</li>
                <li>• Analytics and reporting</li>
                <li>• User management</li>
                <li>• Integration capabilities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Launch Button */}
      <div className="text-center">
        <Button onClick={handleLaunchPlatform} size="lg" className="px-8" disabled={isLaunching}>
          {isLaunching ? (
            "Launching Platform..."
          ) : (
            <>
              Launch Smart Student Hub
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          You'll be redirected to your dashboard where you can start using all features
        </p>
      </div>
    </div>
  )
}
