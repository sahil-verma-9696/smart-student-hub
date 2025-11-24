"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, ExternalLink, BookOpen, Users, MessageSquare, Shield } from "lucide-react"

const integrationCategories = {
  lms: {
    title: "Learning Management Systems",
    icon: BookOpen,
    integrations: [
      {
        name: "Moodle",
        description: "Open-source learning platform",
        status: "connected",
        features: ["Course sync", "Grade import", "User management"],
        setupTime: "15 minutes",
      },
      {
        name: "Canvas",
        description: "Cloud-based learning management system",
        status: "available",
        features: ["Assignment sync", "Student data", "Analytics"],
        setupTime: "20 minutes",
      },
      {
        name: "Blackboard",
        description: "Educational technology and services",
        status: "available",
        features: ["Content sync", "Gradebook", "Attendance"],
        setupTime: "25 minutes",
      },
    ],
  },
  erp: {
    title: "ERP Systems",
    icon: Users,
    integrations: [
      {
        name: "SAP Student Lifecycle Management",
        description: "Comprehensive student information system",
        status: "connected",
        features: ["Student records", "Academic history", "Fee management"],
        setupTime: "45 minutes",
      },
      {
        name: "Oracle Student Cloud",
        description: "Cloud-based student information system",
        status: "available",
        features: ["Enrollment data", "Academic records", "Financial aid"],
        setupTime: "40 minutes",
      },
      {
        name: "Ellucian Banner",
        description: "Higher education ERP solution",
        status: "available",
        features: ["Student data", "Academic planning", "Degree audit"],
        setupTime: "50 minutes",
      },
    ],
  },
  communication: {
    title: "Communication Platforms",
    icon: MessageSquare,
    integrations: [
      {
        name: "Microsoft Teams",
        description: "Collaboration and communication platform",
        status: "pending",
        features: ["Team creation", "Meeting integration", "File sharing"],
        setupTime: "10 minutes",
      },
      {
        name: "Slack",
        description: "Business communication platform",
        status: "available",
        features: ["Channel management", "Notifications", "Bot integration"],
        setupTime: "15 minutes",
      },
      {
        name: "Google Workspace",
        description: "Productivity and collaboration tools",
        status: "connected",
        features: ["Email sync", "Calendar integration", "Drive access"],
        setupTime: "20 minutes",
      },
    ],
  },
  identity: {
    title: "Identity & Access Management",
    icon: Shield,
    integrations: [
      {
        name: "Active Directory",
        description: "Microsoft directory service",
        status: "available",
        features: ["SSO", "User provisioning", "Group management"],
        setupTime: "30 minutes",
      },
      {
        name: "LDAP",
        description: "Lightweight Directory Access Protocol",
        status: "available",
        features: ["Authentication", "User lookup", "Directory sync"],
        setupTime: "35 minutes",
      },
      {
        name: "SAML 2.0",
        description: "Security Assertion Markup Language",
        status: "available",
        features: ["Single sign-on", "Identity federation", "Secure authentication"],
        setupTime: "25 minutes",
      },
    ],
  },
}

export function AvailableIntegrations() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null)

  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "available":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-secondary" />
          Available Integrations
        </CardTitle>
        <CardDescription>Connect with popular educational and enterprise systems</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Integration Categories */}
          <Tabs defaultValue="lms" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="lms">LMS</TabsTrigger>
              <TabsTrigger value="erp">ERP</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="identity">Identity</TabsTrigger>
            </TabsList>

            {Object.entries(integrationCategories).map(([key, category]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <category.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{category.title}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.integrations
                    .filter((integration) => integration.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((integration) => (
                      <div key={integration.name} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{integration.name}</h4>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                          <Badge className={getStatusColor(integration.status)}>{integration.status}</Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">Features:</div>
                          <div className="flex flex-wrap gap-1">
                            {integration.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Setup: {integration.setupTime}</span>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedIntegration(integration)}>
                                  Learn More
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{integration.name} Integration</DialogTitle>
                                  <DialogDescription>{integration.description}</DialogDescription>
                                </DialogHeader>

                                {selectedIntegration && (
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Features</h4>
                                      <ul className="space-y-1 text-sm">
                                        {selectedIntegration.features.map((feature) => (
                                          <li key={feature} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                            {feature}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div>
                                      <h4 className="font-medium mb-2">Setup Requirements</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="space-y-1">
                                          <Label htmlFor="api-key">API Key</Label>
                                          <Input id="api-key" placeholder="Enter your API key" />
                                        </div>
                                        <div className="space-y-1">
                                          <Label htmlFor="server-url">Server URL</Label>
                                          <Input id="server-url" placeholder="https://your-server.com" />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex gap-2">
                                      <Button className="flex-1">
                                        {selectedIntegration.status === "connected" ? "Reconfigure" : "Connect"}
                                      </Button>
                                      <Button variant="outline">
                                        <ExternalLink className="h-4 w-4 mr-1" />
                                        Documentation
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Button
                              size="sm"
                              disabled={integration.status === "connected"}
                              variant={integration.status === "connected" ? "secondary" : "default"}
                            >
                              {integration.status === "connected" ? "Connected" : "Connect"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
