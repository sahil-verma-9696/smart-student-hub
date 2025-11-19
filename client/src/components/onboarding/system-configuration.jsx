"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Settings, Mail, Bell, Shield, Zap } from "lucide-react"



export function SystemConfiguration({ onComplete }) {
  const [emailConfig, setEmailConfig] = useState({
    provider: "",
    smtpHost: "",
    smtpPort: "",
    username: "",
    password: "",
    fromEmail: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordPolicy: "medium",
    sessionTimeout: "24",
    ipWhitelist: "",
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    lmsIntegration: false,
    erpIntegration: false,
    ssoEnabled: false,
    apiAccess: true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("[v0] System configuration:", {
      emailConfig,
      notificationSettings,
      securitySettings,
      integrationSettings,
    })
    onComplete()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          System Configuration
        </CardTitle>
        <CardDescription>Configure system settings, integrations, and security preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email Configuration
              </CardTitle>
              <CardDescription>Set up email delivery for notifications and invitations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email-provider">Email Provider</Label>
                  <Select
                    value={emailConfig.provider}
                    onValueChange={(value) => setEmailConfig({ ...emailConfig, provider: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmail">Gmail</SelectItem>
                      <SelectItem value="outlook">Outlook</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="custom">Custom SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email Address</Label>
                  <Input
                    id="from-email"
                    type="email"
                    value={emailConfig.fromEmail}
                    onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                    placeholder="noreply@institution.edu"
                  />
                </div>
              </div>

              {emailConfig.provider === "custom" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      value={emailConfig.smtpHost}
                      onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                      placeholder="smtp.example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input
                      id="smtp-port"
                      value={emailConfig.smtpPort}
                      onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                      placeholder="587"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input
                      id="smtp-username"
                      value={emailConfig.username}
                      onChange={(e) => setEmailConfig({ ...emailConfig, username: e.target.value })}
                      placeholder="username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input
                      id="smtp-password"
                      type="password"
                      value={emailConfig.password}
                      onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                      placeholder="password"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure how users receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send notifications via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser and mobile push notifications</p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Send weekly activity summaries</p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password-policy">Password Policy</Label>
                  <Select
                    value={securitySettings.passwordPolicy}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, passwordPolicy: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (6+ characters)</SelectItem>
                      <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                      <SelectItem value="high">High (12+ chars, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="168">1 week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Integration Settings
              </CardTitle>
              <CardDescription>Enable integrations with external systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>LMS Integration</Label>
                  <p className="text-sm text-muted-foreground">Connect with Learning Management System</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Coming Soon</Badge>
                  <Switch
                    checked={integrationSettings.lmsIntegration}
                    onCheckedChange={(checked) =>
                      setIntegrationSettings({ ...integrationSettings, lmsIntegration: checked })
                    }
                    disabled
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>ERP Integration</Label>
                  <p className="text-sm text-muted-foreground">Connect with Enterprise Resource Planning system</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Coming Soon</Badge>
                  <Switch
                    checked={integrationSettings.erpIntegration}
                    onCheckedChange={(checked) =>
                      setIntegrationSettings({ ...integrationSettings, erpIntegration: checked })
                    }
                    disabled
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>API Access</Label>
                  <p className="text-sm text-muted-foreground">Enable API for third-party integrations</p>
                </div>
                <Switch
                  checked={integrationSettings.apiAccess}
                  onCheckedChange={(checked) => setIntegrationSettings({ ...integrationSettings, apiAccess: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="px-8">
              Complete Setup
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
