"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Share2, ExternalLink, QrCode, Link } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PortfolioPreview() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareUrl] = useState("https://portfolio.smartstudenthub.edu/john-doe-cs19b001")

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    // Simulate PDF generation
    setTimeout(() => {
      setIsGenerating(false)
      // Trigger download
      console.log("PDF generated and downloaded")
    }, 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    // You could add a toast notification here
  }

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Portfolio Preview
          </CardTitle>
          <CardDescription>See how your portfolio will look to employers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mini Preview */}
          <div className="aspect-[3/4] border rounded-lg bg-muted p-4 overflow-hidden">
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="h-3 bg-foreground/80 rounded w-2/3"></div>
                <div className="h-2 bg-muted-foreground/50 rounded w-1/2"></div>
              </div>

              <div className="space-y-1">
                <div className="h-2 bg-muted-foreground/30 rounded w-full"></div>
                <div className="h-2 bg-muted-foreground/30 rounded w-4/5"></div>
                <div className="h-2 bg-muted-foreground/30 rounded w-3/4"></div>
              </div>

              <div className="flex gap-1">
                <div className="h-4 bg-secondary rounded px-2 flex items-center">
                  <div className="h-1 bg-secondary-foreground/60 rounded w-8"></div>
                </div>
                <div className="h-4 bg-secondary rounded px-2 flex items-center">
                  <div className="h-1 bg-secondary-foreground/60 rounded w-6"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-2 bg-muted-foreground/40 rounded w-1/3"></div>
                <div className="h-1.5 bg-muted-foreground/30 rounded w-full"></div>
                <div className="h-1.5 bg-muted-foreground/30 rounded w-5/6"></div>
              </div>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                Full Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Portfolio Preview</DialogTitle>
                <DialogDescription>This is how your portfolio will appear to viewers</DialogDescription>
              </DialogHeader>

              {/* Full Portfolio Preview */}
              <div className="bg-white text-black p-8 rounded border">
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">John Doe</h1>
                    <p className="text-gray-600">Computer Science Engineering Student</p>
                    <div className="flex justify-center gap-4 text-sm text-gray-600">
                      <span>john.doe@college.edu</span>
                      <span>+1 (555) 123-4567</span>
                      <span>CS19B001</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h2 className="text-xl font-semibold mb-2 border-b">Professional Summary</h2>
                    <p className="text-gray-700">
                      Passionate Computer Science student with strong foundation in software development, machine
                      learning, and cloud technologies. Proven track record of academic excellence and practical project
                      experience.
                    </p>
                  </div>

                  {/* Education */}
                  <div>
                    <h2 className="text-xl font-semibold mb-2 border-b">Education</h2>
                    <div className="space-y-1">
                      <div className="font-medium">Bachelor of Technology - Computer Science Engineering</div>
                      <div className="text-gray-600">XYZ College of Engineering • 2019-2023</div>
                      <div className="text-gray-600">CGPA: 8.7/10.0</div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h2 className="text-xl font-semibold mb-2 border-b">Technical Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {["Python", "JavaScript", "React", "Node.js", "Machine Learning", "AWS"].map((skill) => (
                        <span key={skill} className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h2 className="text-xl font-semibold mb-2 border-b">Verified Achievements</h2>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Machine Learning Workshop</div>
                          <div className="text-gray-600 text-sm">Google AI • January 2024</div>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Verified</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">AWS Cloud Practitioner Certification</div>
                          <div className="text-gray-600 text-sm">Amazon Web Services • January 2024</div>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Generation Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-secondary" />
            Generate Portfolio
          </CardTitle>
          <CardDescription>Create downloadable and shareable versions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGeneratePDF} disabled={isGenerating} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating PDF..." : "Download PDF"}
          </Button>

          <Button variant="outline" className="w-full bg-transparent">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Web Version
          </Button>
        </CardContent>
      </Card>

      {/* Sharing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-chart-1" />
            Share Portfolio
          </CardTitle>
          <CardDescription>Share your verified portfolio with employers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-url">Public Portfolio URL</Label>
            <div className="flex gap-2">
              <Input id="share-url" value={shareUrl} readOnly className="text-sm" />
              <Button variant="outline" size="icon" onClick={handleCopyLink}>
                <Link className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <QrCode className="h-4 w-4 mr-1" />
              QR Code
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Completeness</span>
            <Badge variant="secondary">85%</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Verified Items</span>
            <Badge variant="default">12</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Total Points</span>
            <Badge variant="outline">156</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Profile Views</span>
            <Badge variant="secondary">23</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Keep your summary concise and impactful</p>
          <p>• Highlight your most relevant achievements</p>
          <p>• Update regularly with new accomplishments</p>
          <p>• Use the PDF version for job applications</p>
          <p>• Share the web link for easy access</p>
        </CardContent>
      </Card>
    </div>
  )
}
