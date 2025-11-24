"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Palette, Layout } from "lucide-react"

const templates = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and formal design perfect for job applications",
    preview: "/professional-resume-template.png",
    color: "blue",
    features: ["ATS Friendly", "Clean Layout", "Skills Section"],
  },
  {
    id: "academic",
    name: "Academic",
    description: "Comprehensive layout for research and academic positions",
    preview: "/academic-cv-template.png",
    color: "green",
    features: ["Publications", "Research Focus", "Academic Awards"],
  },
  {
    id: "creative",
    name: "Creative",
    description: "Modern and visually appealing for creative fields",
    preview: "/creative-portfolio-template.png",
    color: "purple",
    features: ["Visual Design", "Project Showcase", "Color Accents"],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant design focusing on content",
    preview: "/minimal-resume-template.png",
    color: "gray",
    features: ["Minimalist", "Typography Focus", "White Space"],
  },
]

export function PortfolioTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState("professional")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5 text-primary" />
          Choose Template
        </CardTitle>
        <CardDescription>Select a template that best represents your professional style</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="aspect-[3/2] mb-3 rounded overflow-hidden bg-muted">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{template.name}</h3>
                  {selectedTemplate === template.id && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">{template.description}</p>

                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="flex-1">
            <Palette className="h-4 w-4 mr-2" />
            Customize Template
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
