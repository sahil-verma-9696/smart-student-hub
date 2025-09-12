"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RefreshCw, Download, Upload, CheckCircle, AlertCircle, Clock } from "lucide-react"

const syncJobs = [
  {
    id: "1",
    name: "Student Data Sync",
    source: "University ERP",
    target: "Smart Student Hub",
    status: "completed",
    lastRun: "2024-01-20 14:30",
    nextRun: "2024-01-20 20:30",
    records: "2,847 students",
    duration: "2m 34s",
  },
  {
    id: "2",
    name: "Course Enrollment Sync",
    source: "Moodle LMS",
    target: "Smart Student Hub",
    status: "running",
    lastRun: "2024-01-20 15:00",
    nextRun: "2024-01-20 21:00",
    records: "1,234 enrollments",
    duration: "1m 45s",
    progress: 67,
  },
  {
    id: "3",
    name: "Grade Import",
    source: "Canvas LMS",
    target: "Smart Student Hub",
    status: "failed",
    lastRun: "2024-01-20 12:00",
    nextRun: "2024-01-20 18:00",
    records: "456 grades",
    duration: "Failed after 30s",
    error: "Authentication failed",
  },
]

const dataMapping = [
  { field: "Student ID", source: "student_id", target: "roll_number", mapped: true },
  { field: "Full Name", source: "full_name", target: "student_name", mapped: true },
  { field: "Email", source: "email_address", target: "email", mapped: true },
  { field: "Department", source: "dept_code", target: "department", mapped: true },
  { field: "Year", source: "academic_year", target: "current_year", mapped: false },
  { field: "Phone", source: "phone_number", target: "contact_number", mapped: false },
]

const getStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "running":
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
    case "failed":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "running":
      return "bg-blue-100 text-blue-800"
    case "failed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function DataSync() {
  const [selectedJob, setSelectedJob] = useState("")

  const handleRunSync = (jobId) => {
    console.log("Running sync job:", jobId)
    // Here you would typically trigger the sync job
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-chart-1" />
          Data Synchronization
        </CardTitle>
        <CardDescription>Manage data sync between integrated systems</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sync Jobs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Sync Jobs</h4>
            <Button size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh All
            </Button>
          </div>

          <div className="space-y-3">
            {syncJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <h5 className="font-medium text-sm">{job.name}</h5>
                      <p className="text-xs text-muted-foreground">
                        {job.source} → {job.target}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                </div>

                {job.status === "running" && job.progress && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-3">
                  <div>Last run: {job.lastRun}</div>
                  <div>Next run: {job.nextRun}</div>
                  <div>Records: {job.records}</div>
                  <div>Duration: {job.duration}</div>
                </div>

                {job.error && (
                  <div className="text-xs text-red-600 mb-3 p-2 bg-red-50 rounded border border-red-200">
                    Error: {job.error}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleRunSync(job.id)}>
                    Run Now
                  </Button>
                  <Button size="sm" variant="ghost">
                    Configure
                  </Button>
                  <Button size="sm" variant="ghost">
                    Logs
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Mapping */}
        <div className="space-y-4">
          <h4 className="font-medium">Field Mapping</h4>

          <div className="space-y-2">
            <Label>Select Integration</Label>
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger>
                <SelectValue placeholder="Choose integration to configure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="erp">University ERP</SelectItem>
                <SelectItem value="moodle">Moodle LMS</SelectItem>
                <SelectItem value="canvas">Canvas LMS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedJob && (
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground p-2 border-b">
                <span>Field</span>
                <span>Source</span>
                <span>Target</span>
                <span>Mapped</span>
              </div>

              {dataMapping.map((mapping, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 items-center p-2 border rounded">
                  <span className="text-sm">{mapping.field}</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{mapping.source}</code>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{mapping.target}</code>
                  <Switch checked={mapping.mapped} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Import/Export */}
        <div className="space-y-4">
          <h4 className="font-medium">Manual Data Operations</h4>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent">
              <Upload className="h-5 w-5" />
              <span className="text-sm">Import Data</span>
              <span className="text-xs text-muted-foreground">Upload CSV/Excel files</span>
            </Button>

            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent">
              <Download className="h-5 w-5" />
              <span className="text-sm">Export Data</span>
              <span className="text-xs text-muted-foreground">Download current data</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
