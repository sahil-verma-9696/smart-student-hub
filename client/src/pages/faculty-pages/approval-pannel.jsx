"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import axios from "axios"
import { useActivityApprovalApi } from "@/hooks/useActivityApprovalApi"
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
import { Search, Eye, Download, CheckCircle, XCircle, Clock, FileText, Calendar, User, Loader2 } from "lucide-react"
import { env } from "@/env/config"
import useAuthContext from "@/hooks/useAuthContext"
import { toast } from "react-hot-toast"

export default function ApprovalPannel() {
  const { user } = useAuthContext()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState([])
  const [reviewingItem, setReviewingItem] = useState(null)
  const [reviewComment, setReviewComment] = useState("")
  const [processing, setProcessing] = useState(false)
  const { fetchPending, approve, reject } = useActivityApprovalApi()

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${env.SERVER_URL}/api/activities?status=PENDING`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      // The backend returns { data: [], total, ... }
      setActivities(res.data.data || [])
    } catch (error) {
      console.error("Failed to fetch activities", error)
      toast.error("Failed to load pending approvals")
      // Set empty array on error to prevent rendering issues
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchActivities()
    }
  }, [user])

  const filteredActivities = activities.filter((item) => {
    const studentName = item.student?.basicUserDetails?.name || "Unknown"
    const studentId = item.student?.basicUserDetails?.userId || "Unknown"
    const activityTitle = item.title || ""
    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activityTitle.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Note: Department is not currently in the student/user schema populated data. 
    // We might need to fetch it or ignore for now. Assuming 'all' for now.
    const matchesDepartment = departmentFilter === "all" 
    
    const typeTitle = item.activityType?.title || ""
    const matchesType = typeFilter === "all" || typeTitle.toLowerCase() === typeFilter.toLowerCase()

    return matchesSearch && matchesDepartment && matchesType
  })

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredActivities.map((item) => item._id))
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

  const handleApprove = async (id, comment) => {
    setProcessing(true)
    try {
      await approve(id, { creditsEarned: reviewingItem?.suggestedCredits, remarks: comment })
      toast.success("Activity approved successfully")
      setReviewingItem(null)
      setReviewComment("")
      fetchActivities() // Refresh list
    } catch (error) {
      console.error("Approval failed", error)
      toast.error(error.response?.data?.message || "Failed to approve activity")
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (id, comment) => {
    if (!comment) {
      toast.error("Please provide a reason for rejection")
      return
    }
    setProcessing(true)
    try {
      await reject(id, { reason: comment })
      toast.success("Activity rejected")
      setReviewingItem(null)
      setReviewComment("")
      fetchActivities()
    } catch (error) {
      console.error("Rejection failed", error)
      toast.error(error.response?.data?.message || "Failed to reject activity")
    } finally {
      setProcessing(false)
    }
  }

  const handleBulkApprove = async () => {
    // Implement bulk approve if backend supports it, or loop
    // For now, let's just loop (not ideal for large sets but works for MVP)
    setProcessing(true)
    try {
      await Promise.all(selectedItems.map((id) => approve(id, {})))
      toast.success(`Approved ${selectedItems.length} activities`)
      setSelectedItems([])
      fetchActivities()
    } catch (error) {
      console.error("Bulk approval failed", error)
      toast.error(error.response?.data?.message || "Some approvals failed")
      fetchActivities()
    } finally {
      setProcessing(false)
    }
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
              <Button onClick={handleBulkApprove} size="sm" disabled={processing}>
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

          {/* Department filter removed as we don't have that data easily available yet */}
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {/* We could dynamically populate this too */}
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="research">Research</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {filteredActivities.length > 0 && (
          <div className="flex items-center gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
            <Checkbox 
                checked={selectedItems.length === filteredActivities.length && filteredActivities.length > 0} 
                onCheckedChange={handleSelectAll} 
            />
            <span className="text-sm font-medium">Select All ({filteredActivities.length} items)</span>
          </div>
        )}

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities.map((item) => (
            <div key={item._id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedItems.includes(item._id)}
                  onCheckedChange={(checked) => handleSelectItem(item._id, checked )}
                />

                <div className="flex-1 min-w-0">
                  {/* Student Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{item.student?.basicUserDetails?.name || "Unknown Student"}</span>
                    <Badge variant="outline">{item.student?.basicUserDetails?.userId || "N/A"}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.student?.basicUserDetails?.email}
                    </span>
                  </div>

                  {/* Activity Info */}
                  <div className="mb-3">
                    <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.activityType?.title || "Unknown Type"}
                      </Badge>
                      {item.activityType?.points && (
                          <span className="font-medium text-primary">+{item.activityType.points} pts</span>
                      )}
                    </div>

                    {/* Details */}
                    {item.details && Object.keys(item.details).length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {Object.entries(item.details).slice(0, 3).map(([key, val]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {key}: {String(val)}
                            </Badge>
                          ))}
                        </div>
                    )}

                    {/* Files */}
                    {item.attachments && item.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                        {item.attachments.map((file, index) => (
                            <Button 
                                key={index} 
                                variant="outline" 
                                size="sm" 
                                className="text-xs h-7 bg-transparent"
                                onClick={() => window.open(file.url, "_blank")}
                            >
                            <Download className="h-3 w-3 mr-1" />
                            {file.originalFilename || "Attachment"}
                            </Button>
                        ))}
                        </div>
                    )}
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
                              <div>Name: {reviewingItem.student?.basicUserDetails?.name}</div>
                              <div>ID: {reviewingItem.student?.basicUserDetails?.userId}</div>
                              <div>Email: {reviewingItem.student?.basicUserDetails?.email}</div>
                            </div>
                          </div>

                          {/* Activity Details */}
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Activity Details</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>Title:</strong> {reviewingItem.title}
                              </div>
                              <div>
                                <strong>Type:</strong> {reviewingItem.activityType?.title}
                              </div>
                              <div>
                                <strong>Date Submitted:</strong> {new Date(reviewingItem.createdAt).toLocaleDateString()}
                              </div>
                              <div>
                                <strong>Points:</strong> {reviewingItem.activityType?.points}
                              </div>
                              <div>
                                <strong>Description:</strong> {reviewingItem.description}
                              </div>
                              
                              {reviewingItem.details && (
                                <div>
                                    <strong>Details:</strong>
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        {Object.entries(reviewingItem.details).map(([key, val]) => (
                                            <div key={key}><span className="capitalize">{key}:</span> {String(val)}</div>
                                        ))}
                                    </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Files */}
                          {reviewingItem.attachments && reviewingItem.attachments.length > 0 && (
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium mb-2">Supporting Documents</h4>
                                <div className="space-y-2">
                                {reviewingItem.attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">{file.originalFilename}</span>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => window.open(file.url, "_blank")}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    </div>
                                ))}
                                </div>
                            </div>
                          )}

                          {/* Review Comments */}
                          <div className="space-y-2">
                            <Label htmlFor="review-comment">Review Comments (Required for Rejection)</Label>
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
                            <Button onClick={() => handleApprove(reviewingItem._id, reviewComment)} className="flex-1" disabled={processing}>
                              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(reviewingItem._id, reviewComment)}
                              className="flex-1"
                              disabled={processing}
                            >
                              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" onClick={() => handleApprove(item._id)} disabled={processing}>
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
