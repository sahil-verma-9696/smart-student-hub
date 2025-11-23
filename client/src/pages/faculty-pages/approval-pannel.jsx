"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Eye, Download, CheckCircle, XCircle, Clock, FileText, Calendar, User } from "lucide-react"

const pendingActivities = [
  {
    id: 1,
    student: {
      name: "John Doe",
      rollNo: "CS19B001",
      year: "4th Year",
      department: "Computer Science",
      email: "john.doe@college.edu",
    },
    activity: {
      title: "Machine Learning Workshop",
      type: "Workshop",
      organizer: "Google AI",
      date: "2024-01-15",
      duration: "3 days",
      description:
        "Comprehensive workshop covering ML fundamentals, neural networks, and practical applications using TensorFlow and Python.",
      skills: ["Python", "TensorFlow", "Machine Learning", "Data Analysis"],
      points: 10,
    },
    submission: {
      submittedOn: "2024-01-18",
      files: ["certificate.pdf", "project_report.pdf", "attendance_proof.jpg"],
      status: "pending",
    },
  },
  {
    id: 2,
    student: {
      name: "Jane Smith",
      rollNo: "CS19B002",
      year: "4th Year",
      department: "Computer Science",
      email: "jane.smith@college.edu",
    },
    activity: {
      title: "Hackathon - TechFest 2024",
      type: "Competition",
      organizer: "IEEE Student Chapter",
      date: "2024-01-10",
      duration: "48 hours",
      description:
        "Participated in 48-hour coding hackathon focused on sustainable technology solutions. Developed a waste management app.",
      skills: ["React", "Node.js", "MongoDB", "Problem Solving"],
      points: 25,
    },
    submission: {
      submittedOn: "2024-01-16",
      files: ["participation_certificate.pdf", "project_demo.mp4"],
      status: "pending",
    },
  },
  {
    id: 3,
    student: {
      name: "Mike Johnson",
      rollNo: "CS19B003",
      year: "3rd Year",
      department: "Computer Science",
      email: "mike.johnson@college.edu",
    },
    activity: {
      title: "Research Paper Publication",
      type: "Research",
      organizer: "International Journal of AI",
      date: "2024-01-03",
      duration: "6 months",
      description:
        'Published research paper on "Machine Learning Applications in Medical Diagnosis" in a peer-reviewed journal.',
      skills: ["Research", "Academic Writing", "AI/ML", "Data Analysis"],
      points: 30,
    },
    submission: {
      submittedOn: "2024-01-14",
      files: ["research_paper.pdf", "publication_proof.pdf", "peer_review.pdf"],
      status: "pending",
    },
  },
]

export default function ApprovalPannel() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState([])
  const [reviewingItem, setReviewingItem] = useState(null)
  const [reviewComment, setReviewComment] = useState("")

  const filteredActivities = pendingActivities.filter((item) => {
    const matchesSearch =
      item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.activity.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment =
      departmentFilter === "all" || item.student.department.toLowerCase().includes(departmentFilter)
    const matchesType = typeFilter === "all" || item.activity.type.toLowerCase() === typeFilter

    return matchesSearch && matchesDepartment && matchesType
  })

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredActivities.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id])
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== id))
    }
  }

  const handleApprove = (id, comment) => {
    console.log("Approving activity:", id, "Comment:", comment)
    // Here you would typically send the approval to your backend
    setReviewingItem(null)
    setReviewComment("")
  }

  const handleReject = (id, comment) => {
    console.log("Rejecting activity:", id, "Comment:", comment)
    // Here you would typically send the rejection to your backend
    setReviewingItem(null)
    setReviewComment("")
  }

  const handleBulkApprove = () => {
    console.log("Bulk approving activities:", selectedItems)
    setSelectedItems([])
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Approvals
            </CardTitle>
            <CardDescription>Review and approve student activity submissions</CardDescription>
          </div>
          {selectedItems.length > 0 && (
            <div className="flex gap-2">
              <Button onClick={handleBulkApprove} size="sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve Selected ({selectedItems.length})
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by student name, roll number, or activity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="computer science">Computer Science</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="mechanical">Mechanical</SelectItem>
              <SelectItem value="civil">Civil</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="competition">Competition</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
              <SelectItem value="research">Research</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {filteredActivities.length > 0 && (
          <div className="flex items-center gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
            <Checkbox checked={selectedItems.length === filteredActivities.length} onCheckedChange={handleSelectAll} />
            <span className="text-sm font-medium">Select All ({filteredActivities.length} items)</span>
          </div>
        )}

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => handleSelectItem(item.id, checked )}
                />

                <div className="flex-1 min-w-0">
                  {/* Student Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{item.student.name}</span>
                    <Badge variant="outline">{item.student.rollNo}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.student.year} • {item.student.department}
                    </span>
                  </div>

                  {/* Activity Info */}
                  <div className="mb-3">
                    <h3 className="font-medium text-foreground mb-1">{item.activity.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.activity.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.activity.date).toLocaleDateString()}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.activity.type}
                      </Badge>
                      <span>{item.activity.organizer}</span>
                      <span className="font-medium text-primary">+{item.activity.points} pts</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.activity.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Files */}
                    <div className="flex flex-wrap gap-2">
                      {item.submission.files.map((file, index) => (
                        <Button key={index} variant="outline" size="sm" className="text-xs h-7 bg-transparent">
                          <Download className="h-3 w-3 mr-1" />
                          {file}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Submitted on {new Date(item.submission.submittedOn).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setReviewingItem(item)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Review Activity Submission</DialogTitle>
                        <DialogDescription>
                          Carefully review the activity details and supporting documents
                        </DialogDescription>
                      </DialogHeader>

                      {reviewingItem && (
                        <div className="space-y-6">
                          {/* Student Details */}
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Student Information</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Name: {reviewingItem.student.name}</div>
                              <div>Roll No: {reviewingItem.student.rollNo}</div>
                              <div>Year: {reviewingItem.student.year}</div>
                              <div>Department: {reviewingItem.student.department}</div>
                            </div>
                          </div>

                          {/* Activity Details */}
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Activity Details</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>Title:</strong> {reviewingItem.activity.title}
                              </div>
                              <div>
                                <strong>Type:</strong> {reviewingItem.activity.type}
                              </div>
                              <div>
                                <strong>Organizer:</strong> {reviewingItem.activity.organizer}
                              </div>
                              <div>
                                <strong>Date:</strong> {new Date(reviewingItem.activity.date).toLocaleDateString()}
                              </div>
                              <div>
                                <strong>Duration:</strong> {reviewingItem.activity.duration}
                              </div>
                              <div>
                                <strong>Points:</strong> {reviewingItem.activity.points}
                              </div>
                              <div>
                                <strong>Description:</strong> {reviewingItem.activity.description}
                              </div>
                              <div>
                                <strong>Skills:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {reviewingItem.activity.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Files */}
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Supporting Documents</h4>
                            <div className="space-y-2">
                              {reviewingItem.submission.files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 border rounded">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-sm">{file}</span>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Review Comments */}
                          <div className="space-y-2">
                            <Label htmlFor="review-comment">Review Comments (Optional)</Label>
                            <Textarea
                              id="review-comment"
                              placeholder="Add any comments or feedback for the student..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              rows={3}
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <Button onClick={() => handleApprove(reviewingItem.id, reviewComment)} className="flex-1">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(reviewingItem.id, reviewComment)}
                              className="flex-1"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" onClick={() => handleApprove(item.id)}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Quick Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No pending activities found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
