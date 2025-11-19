import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, BarChart3, Settings } from "lucide-react"

const reportTypes = [
  {
    id: "naac",
    name: "NAAC Report",
    description: "National Assessment and Accreditation Council compliance report",
    sections: ["Student Activities", "Faculty Engagement", "Quality Metrics", "Outcome Analysis"],
  },
  {
    id: "aicte",
    name: "AICTE Report",
    description: "All India Council for Technical Education annual report",
    sections: ["Technical Activities", "Industry Engagement", "Skill Development", "Innovation Metrics"],
  },
  {
    id: "nirf",
    name: "NIRF Report",
    description: "National Institutional Ranking Framework data",
    sections: ["Research Output", "Student Performance", "Faculty Metrics", "Outreach Activities"],
  },
  {
    id: "internal",
    name: "Internal Audit",
    description: "Comprehensive internal assessment report",
    sections: ["All Departments", "Complete Analytics", "Trend Analysis", "Recommendations"],
  },
]

const timeRanges = [
  { value: "current-semester", label: "Current Semester" },
  { value: "academic-year", label: "Academic Year 2023-24" },
  { value: "last-6-months", label: "Last 6 Months" },
  { value: "custom", label: "Custom Range" },
]

const departments = [
  "Computer Science Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
]

export function ReportGeneration() {
  const [selectedReport, setSelectedReport] = useState("")
  const [selectedTimeRange, setSelectedTimeRange] = useState("")
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDepartmentToggle = (department, checked) => {
    if (checked) {
      setSelectedDepartments((prev) => [...prev, department])
    } else {
      setSelectedDepartments((prev) => prev.filter((d) => d !== department))
    }
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      console.log("Report generated")
    }, 3000)
  }

  const selectedReportData = reportTypes.find((r) => r.id === selectedReport)

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Generate Reports
          </CardTitle>
          <CardDescription>Create institutional reports for accreditation and audits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((report) => (
                  <SelectItem key={report.id} value={report.id}>
                    {report.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedReportData && <p className="text-xs text-muted-foreground">{selectedReportData.description}</p>}
          </div>

          <div className="space-y-2">
            <Label>Time Range</Label>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Departments</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {departments.map((department) => (
                <div key={department} className="flex items-center space-x-2">
                  <Checkbox
                    id={department}
                    checked={selectedDepartments.includes(department)}
                    onCheckedChange={(checked) => handleDepartmentToggle(department, checked)}
                  />
                  <Label htmlFor={department} className="text-sm">
                    {department}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {selectedReportData && (
            <div className="space-y-2">
              <Label>Report Sections</Label>
              <div className="flex flex-wrap gap-1">
                {selectedReportData.sections.map((section) => (
                  <Badge key={section} variant="secondary" className="text-xs">
                    {section}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleGenerateReport}
            disabled={!selectedReport || !selectedTimeRange || isGenerating}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating Report..." : "Generate Report"}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-secondary" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Students</span>
            <Badge variant="outline">2,847</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Active This Month</span>
            <Badge variant="secondary">1,456</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Activities Logged</span>
            <Badge variant="default">8,234</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Approval Rate</span>
            <Badge variant="outline">87.3%</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-chart-1" />
            Export Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export as Excel
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { name: "NAAC Report Q4 2023", date: "Jan 15, 2024", size: "2.4 MB" },
            { name: "Department Analysis", date: "Jan 10, 2024", size: "1.8 MB" },
            { name: "Monthly Summary", date: "Jan 01, 2024", size: "956 KB" },
          ].map((report) => (
            <div key={report.name} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium text-sm">{report.name}</div>
                <div className="text-xs text-muted-foreground">
                  {report.date} • {report.size}
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
