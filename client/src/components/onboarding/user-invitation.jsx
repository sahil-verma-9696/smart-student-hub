"use client"


import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Mail, Copy, UserCheck } from "lucide-react"



export function UserInvitation({ onComplete }) {
  const [inviteMethod, setInviteMethod] = useState("email")
  const [bulkEmails, setBulkEmails] = useState("")
  const [singleEmail, setSingleEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [inviteLink, setInviteLink] = useState("")
  const [sentInvitations, setSentInvitations] = useState([])

  const generateInviteLink = (role) => {
    const baseUrl = window.location.origin
    const token = Math.random().toString(36).substring(2, 15)
    return `${baseUrl}/register?token=${token}&role=${role}`
  }

  const handleSingleInvite = () => {
    if (singleEmail && selectedRole) {
      const invitation = {
        id: Date.now().toString(),
        email: singleEmail,
        role: selectedRole,
        department: selectedDepartment,
        status: "sent",
        sentAt: new Date().toISOString(),
      }
      setSentInvitations([...sentInvitations, invitation])
      setSingleEmail("")
      console.log("[v0] Single invitation sent:", invitation)
    }
  }

  const handleBulkInvite = () => {
    if (bulkEmails && selectedRole) {
      const emails = bulkEmails.split("\n").filter((email) => email.trim())
      const invitations = emails.map((email) => ({
        id: Date.now().toString() + Math.random(),
        email: email.trim(),
        role: selectedRole,
        department: selectedDepartment,
        status: "sent",
        sentAt: new Date().toISOString(),
      }))
      setSentInvitations([...sentInvitations, ...invitations])
      setBulkEmails("")
      console.log("[v0] Bulk invitations sent:", invitations)
    }
  }

  const handleGenerateLink = () => {
    if (selectedRole) {
      const link = generateInviteLink(selectedRole)
      setInviteLink(link)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("[v0] User invitation setup complete:", { sentInvitations, inviteLink })
    onComplete()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          User Invitations
        </CardTitle>
        <CardDescription>Invite faculty members and students to join your Smart Student Hub</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={inviteMethod} onValueChange={setInviteMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email">Email Invites</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
              <TabsTrigger value="link">Invite Links</TabsTrigger>
            </TabsList>

            {/* Email Invitations */}
            <TabsContent value="email" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cse">Computer Science</SelectItem>
                      <SelectItem value="ece">Electronics & Communication</SelectItem>
                      <SelectItem value="me">Mechanical Engineering</SelectItem>
                      <SelectItem value="ce">Civil Engineering</SelectItem>
                      <SelectItem value="eee">Electrical Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleSingleInvite} disabled={!singleEmail || !selectedRole}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invite
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Bulk Import */}
            <TabsContent value="bulk" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bulk-role">Role *</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulk-department">Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cse">Computer Science</SelectItem>
                      <SelectItem value="ece">Electronics & Communication</SelectItem>
                      <SelectItem value="me">Mechanical Engineering</SelectItem>
                      <SelectItem value="ce">Civil Engineering</SelectItem>
                      <SelectItem value="eee">Electrical Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-emails">Email Addresses (one per line)</Label>
                <Textarea
                  id="bulk-emails"
                  value={bulkEmails}
                  onChange={(e) => setBulkEmails(e.target.value)}
                  placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Enter one email address per line. You can paste from Excel or CSV.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleBulkInvite}
                disabled={!bulkEmails || !selectedRole}
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Bulk Invitations
              </Button>
            </TabsContent>

            {/* Invite Links */}
            <TabsContent value="link" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link-role">Role *</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="button" onClick={handleGenerateLink} disabled={!selectedRole} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Generate Invite Link
              </Button>

              {inviteLink && (
                <div className="space-y-2">
                  <Label>Generated Invite Link</Label>
                  <div className="flex gap-2">
                    <Input value={inviteLink} readOnly className="flex-1" />
                    <Button type="button" variant="outline" onClick={() => copyToClipboard(inviteLink)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share this link with users to let them register with the {selectedRole} role.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Sent Invitations Summary */}
          {sentInvitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  Sent Invitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {sentInvitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{invitation.email}</span>
                        <Badge variant="secondary" className="text-xs">
                          {invitation.role}
                        </Badge>
                        {invitation.department && (
                          <Badge variant="outline" className="text-xs">
                            {invitation.department}
                          </Badge>
                        )}
                      </div>
                      <Badge variant="default" className="text-xs">
                        {invitation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Total invitations sent: {sentInvitations.length}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button type="submit" className="px-8">
              Continue to System Configuration
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
