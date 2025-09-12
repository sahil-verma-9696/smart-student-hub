"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Key, Plus, Copy, Eye, EyeOff, Trash2, BarChart3 } from "lucide-react"

const apiKeys = [
  {
    id: "1",
    name: "Mobile App API",
    key: "ssh_live_1234567890abcdef",
    created: "2024-01-15",
    lastUsed: "2 hours ago",
    requests: "12,456",
    status: "active",
  },
  {
    id: "2",
    name: "Third-party Integration",
    key: "ssh_live_fedcba0987654321",
    created: "2024-01-10",
    lastUsed: "1 day ago",
    requests: "8,234",
    status: "active",
  },
  {
    id: "3",
    name: "Analytics Dashboard",
    key: "ssh_live_abcdef1234567890",
    created: "2024-01-05",
    lastUsed: "Never",
    requests: "0",
    status: "inactive",
  },
]

const webhooks = [
  {
    id: "1",
    name: "Activity Approved",
    url: "https://api.example.com/webhooks/activity-approved",
    events: ["activity.approved", "activity.rejected"],
    status: "active",
    lastTriggered: "5 minutes ago",
  },
  {
    id: "2",
    name: "Student Registration",
    url: "https://api.example.com/webhooks/student-registered",
    events: ["student.registered", "student.updated"],
    status: "active",
    lastTriggered: "2 hours ago",
  },
]

export function APIManagement() {
  const [showKeys, setShowKeys] = useState({})
  const [isCreatingKey, setIsCreatingKey] = useState(false)

  const toggleKeyVisibility = (keyId) => {
    setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const maskKey = (key) => {
    return key.substring(0, 12) + "..." + key.substring(key.length - 4)
  }

  return (
    <div className="space-y-6">
      {/* API Keys Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                API Keys
              </CardTitle>
              <CardDescription>Manage API keys for external integrations</CardDescription>
            </div>
            <Dialog open={isCreatingKey} onOpenChange={setIsCreatingKey}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>Generate a new API key for external system integration</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Key Name</Label>
                    <Input id="key-name" placeholder="e.g., Mobile App Integration" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="key-description">Description (Optional)</Label>
                    <Textarea id="key-description" placeholder="Describe what this key will be used for..." rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="space-y-2">
                      {["Read Activities", "Write Activities", "Read Students", "Read Analytics"].map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <input type="checkbox" id={permission} className="rounded" />
                          <Label htmlFor={permission} className="text-sm">
                            {permission}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => setIsCreatingKey(false)} className="flex-1">
                      Create API Key
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreatingKey(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm">{apiKey.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Created: {apiKey.created}</span>
                      <span>•</span>
                      <span>Last used: {apiKey.lastUsed}</span>
                    </div>
                  </div>
                  <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>{apiKey.status}</Badge>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded flex-1">
                    {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                  <Button variant="ghost" size="sm" onClick={() => toggleKeyVisibility(apiKey.id)}>
                    {showKeys[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiKey.key)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{apiKey.requests} requests</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>Real-time event notifications</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{webhook.name}</h4>
                  <Badge variant={webhook.status === "active" ? "default" : "secondary"}>{webhook.status}</Badge>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>URL: {webhook.url}</div>
                  <div>Events: {webhook.events.join(", ")}</div>
                  <div>Last triggered: {webhook.lastTriggered}</div>
                </div>

                <div className="flex justify-end gap-1 mt-2">
                  <Button variant="ghost" size="sm">
                    Test
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>Resources for developers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Key className="h-4 w-4 mr-2" />
            API Reference
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <BarChart3 className="h-4 w-4 mr-2" />
            Rate Limits
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Copy className="h-4 w-4 mr-2" />
            Code Examples
          </Button>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">API Calls Today</span>
            <Badge variant="outline">12,456</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Active Keys</span>
            <Badge variant="secondary">2</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Webhook Deliveries</span>
            <Badge variant="default">98.5%</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Rate Limit Usage</span>
            <Badge variant="outline">23%</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
