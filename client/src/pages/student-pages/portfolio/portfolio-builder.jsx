"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Briefcase, Award, Code, Plus, X, Edit } from "lucide-react"

const mockStudentData = {
  personal: {
    name: "John Doe",
    email: "john.doe@college.edu",
    phone: "+1 (555) 123-4567",
    rollNo: "CS19B001",
    department: "Computer Science Engineering",
    year: "4th Year",
    cgpa: "8.7",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
  },
  achievements: [
    {
      title: "Machine Learning Workshop",
      type: "Workshop",
      organizer: "Google AI",
      date: "2024-01-15",
      verified: true,
    },
    { title: "AWS Cloud Practitioner", type: "Certification", organizer: "Amazon", date: "2024-01-08", verified: true },
    { title: "Hackathon Winner", type: "Competition", organizer: "IEEE", date: "2024-01-10", verified: true },
  ],
  skills: ["Python", "JavaScript", "React", "Node.js", "Machine Learning", "AWS", "MongoDB"],
  projects: [
    { name: "E-commerce Platform", tech: "React, Node.js, MongoDB", description: "Full-stack web application" },
    { name: "ML Prediction Model", tech: "Python, TensorFlow", description: "Stock price prediction using LSTM" },
  ],
}

export function PortfolioBuilder() {
  const [portfolioData, setPortfolioData] = useState(mockStudentData)
  const [includeSections, setIncludeSections] = useState({
    personal: true,
    education: true,
    achievements: true,
    skills: true,
    projects: true,
    certifications: true,
  })

  const handleSectionToggle = (section, enabled) => {
    setIncludeSections((prev) => ({ ...prev, [section]: enabled }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5 text-primary" />
          Portfolio Builder
        </CardTitle>
        <CardDescription>Customize your portfolio content and sections</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <h3 className="font-semibold">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={portfolioData.personal.name}
                    onChange={(e) =>
                      setPortfolioData((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, name: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={portfolioData.personal.email}
                    onChange={(e) =>
                      setPortfolioData((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, email: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={portfolioData.personal.phone}
                    onChange={(e) =>
                      setPortfolioData((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, phone: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={portfolioData.personal.linkedin}
                    onChange={(e) =>
                      setPortfolioData((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, linkedin: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <h3 className="font-semibold">Professional Summary</h3>
              </div>

              <Textarea
                placeholder="Write a brief professional summary highlighting your key strengths and career objectives..."
                rows={4}
              />
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <h3 className="font-semibold">Skills</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" />
                  </Badge>
                ))}
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Skill
                </Button>
              </div>
            </div>

            {/* Achievements Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <h3 className="font-semibold">Verified Achievements</h3>
                </div>
                <Badge variant="outline">{portfolioData.achievements.length} items</Badge>
              </div>

              <div className="space-y-2">
                {portfolioData.achievements.slice(0, 3).map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium text-sm">{achievement.title}</span>
                      <div className="text-xs text-muted-foreground">
                        {achievement.organizer} • {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {achievement.type}
                    </Badge>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  All achievements are automatically verified and included
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sections" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Include Sections</h3>

              {Object.entries(includeSections).map(([section, enabled]) => (
                <div key={section} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium capitalize">{section.replace(/([A-Z])/g, " $1")}</div>
                    <div className="text-sm text-muted-foreground">
                      {section === "personal" && "Contact information and basic details"}
                      {section === "education" && "Academic background and qualifications"}
                      {section === "achievements" && "Verified activities and accomplishments"}
                      {section === "skills" && "Technical and soft skills"}
                      {section === "projects" && "Academic and personal projects"}
                      {section === "certifications" && "Professional certifications"}
                    </div>
                  </div>
                  <Switch checked={enabled} onCheckedChange={(checked) => handleSectionToggle(section, checked)} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Portfolio Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">Public Portfolio</div>
                    <div className="text-sm text-muted-foreground">
                      Allow others to view your portfolio via shareable link
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">Include QR Code</div>
                    <div className="text-sm text-muted-foreground">Add QR code linking to your digital portfolio</div>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label>Portfolio Theme</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
