"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Eye, Download, CheckCircle, XCircle, Clock, FileText, Calendar, User, Loader2, RefreshCw, Sparkles, AlertCircle } from "lucide-react"
import { activityAPI, assignmentAPI } from "@/services/api"
import { toast } from "react-hot-toast"
import useAuthContext from "@/hooks/useAuthContext"

export default function ApprovalPannel() {
  const { user } = useAuthContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [selectedItems, setSelectedItems] = useState([])
  const [reviewingItem, setReviewingItem] = useState(null)
  const [reviewComment, setReviewComment] = useState("")
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [visibleSections, setVisibleSections] = useState(new Set())
  const sectionRefs = useRef([])

  // Fetch activities assigned to current faculty
  const fetchAssignedActivities = async () => {
    try {
      setLoading(true)
      
      // Get faculty ID from user context
      const facultyId = user?._id
      const instituteId = user?.institute?._id
      
      if (!facultyId) {
        console.error('No faculty ID found in user context')
        toast.error('Unable to get faculty information')
        setAssignments([])
        return
      }

      // Fetch assignments for this faculty
      const result = await assignmentAPI.getMyAssignedActivities(facultyId, instituteId)
      console.log('Fetched assignments result:', result)
      
      // Ensure data is an array and handle { data: [...] } structure
      let assignmentsArray = []
      
      if (Array.isArray(result)) {
        assignmentsArray = result
      } else if (result && Array.isArray(result.data)) {
        assignmentsArray = result.data
      } else if (result && typeof result === 'object') {
        // Handle case where API returns a single object instead of array
        assignmentsArray = [result]
      }
      
      console.log('All assignments:', assignmentsArray)
      console.log('Statuses found:', assignmentsArray.map(a => a.activityId?.status))

      setAssignments(assignmentsArray)
    } catch (error) {
      console.error('Error fetching assigned activities:', error)
      console.error('Error response:', error.response?.data)
      toast.error('Failed to fetch assigned activities')
      setAssignments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?._id) {
      fetchAssignedActivities()
    }
  }, [user])

  // Intersection Observer for animations
  useEffect(() => {
    const observers = []
    
    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setVisibleSections((prev) => new Set([...prev, index]))
              }
            })
          },
          { threshold: 0.1 }
        )
        
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [assignments])

  // Filter assignments based on search and type
  const filteredAssignments = assignments.filter((assignment) => {
    const activity = assignment.activityId
    if (!activity) return false
    
    const studentName = activity.student?.basicUserDetails?.name || ''
    const studentEmail = activity.student?.basicUserDetails?.email || ''
    const activityTitle = activity.title || ''
    
    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activityTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || activity.activityType?.toLowerCase() === typeFilter
    const matchesStatus = statusFilter === "all" || (activity.status && activity.status.toLowerCase() === statusFilter.toLowerCase())

    return matchesSearch && matchesType && matchesStatus
  })

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredAssignments.map((a) => a.activityId._id))
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

  const handleApprove = async (activityId, comment) => {
    try {
      setActionLoading(true)
      await activityAPI.approveActivity(activityId, comment || null)
      toast.success('Activity approved successfully')
      setReviewingItem(null)
      setReviewComment("")
      setDialogOpen(false)
      // Refresh the list
      fetchAssignedActivities()
    } catch (error) {
      console.error('Error approving activity:', error)
      toast.error('Failed to approve activity')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (activityId, comment) => {
    if (!comment || comment.trim() === '') {
      toast.error('Remarks are required when rejecting an activity')
      return
    }
    try {
      setActionLoading(true)
      await activityAPI.rejectActivity(activityId, comment)
      toast.success('Activity rejected')
      setReviewingItem(null)
      setReviewComment("")
      setDialogOpen(false)
      // Refresh the list
      fetchAssignedActivities()
    } catch (error) {
      console.error('Error rejecting activity:', error)
      toast.error(error.response?.data?.message || 'Failed to reject activity')
    } finally {
      setActionLoading(false)
    }
  }

  const handleBulkApprove = async () => {
    try {
      setActionLoading(true)
      // Approve each selected activity
      await Promise.all(selectedItems.map(id => activityAPI.approveActivity(id)))
      toast.success(`${selectedItems.length} activities approved successfully`)
      setSelectedItems([])
      fetchAssignedActivities()
    } catch (error) {
      console.error('Error bulk approving:', error)
      toast.error('Failed to approve some activities')
    } finally {
      setActionLoading(false)
    }
  }

  // Calculate stats
  const totalPending = filteredAssignments.length
  const totalAssigned = assignments.length
  const selectedCount = selectedItems.length

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <Card className="border-2 border-black shadow-xl">
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div 
          ref={(el) => (sectionRefs.current[0] = el)}
          className={`flex items-center justify-between transition-all duration-1000 ${
            visibleSections.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="group cursor-default">
            <h1 className="text-5xl font-bold text-black mb-2 group-hover:text-blue-600 transition-colors duration-500 flex items-center gap-3">
              Approval Panel
              <Sparkles className="h-8 w-8 text-blue-600 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500" />
            </h1>
            <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
              Review and approve student activity submissions assigned to you
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchAssignedActivities}
              variant="outline"
              className="border-2 border-black hover:bg-black hover:text-white transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Badge variant="outline" className="text-sm py-2 px-4 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer hover:scale-105">
              Faculty
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div 
          ref={(el) => (sectionRefs.current[1] = el)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: 'Total Assigned', value: totalAssigned, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', change: '' },
            { label: 'Pending Review', value: totalPending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', change: '' },
            { label: 'Selected', value: selectedCount, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', change: '' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`transition-all duration-1000 ${
                visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150 + 100}ms` }}
            >
              <Card className="border-2 border-black shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:border-blue-600 group/stat cursor-pointer overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover/stat:from-blue-500/5 group-hover/stat:to-blue-500/10 transition-all duration-500"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2 group-hover/stat:text-blue-600 transition-colors duration-300">{stat.label}</p>
                      <p className="text-4xl font-bold text-black group-hover/stat:text-blue-600 transition-all duration-300 group-hover/stat:scale-110 inline-block">{stat.value}</p>
                    </div>
                    <div className={`${stat.bg} ${stat.color} p-4 rounded-xl border-2 border-transparent group-hover/stat:border-current group-hover/stat:scale-110 group-hover/stat:rotate-6 transition-all duration-500 shadow-lg`}>
                      <stat.icon className="h-7 w-7 group-hover/stat:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div
          ref={(el) => (sectionRefs.current[2] = el)}
          className={`transition-all duration-1000 delay-200 ${
            visibleSections.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <Card className="border-2 border-black shadow-xl bg-white hover:shadow-2xl hover:border-blue-600 transition-all duration-500 overflow-visible hover:scale-[1.01] group/card">
            <CardHeader className="group-hover/card:bg-gradient-to-r group-hover/card:from-blue-50 group-hover/card:to-transparent transition-all duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-black group-hover/card:text-blue-600 transition-colors duration-300 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-orange-600" />
                    Pending Submissions
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Review student activity submissions and provide feedback
                  </CardDescription>
                </div>
                {selectedItems.length > 0 && (
                  <Button 
                    onClick={handleBulkApprove} 
                    disabled={actionLoading}
                    className="bg-black text-white hover:bg-blue-600 hover:border-blue-600 shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl border-2 border-black relative overflow-hidden group/btn"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700 ease-out"></span>
                    <span className="relative flex items-center">
                      {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                      Approve Selected ({selectedItems.length})
                    </span>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    placeholder="Search by student name, email, or activity title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48 border-2 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Activity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 border-2 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {filteredAssignments.length > 0 && (
                <div className="flex items-center gap-4 mb-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300">
                  <Checkbox 
                    checked={selectedItems.length === filteredAssignments.length && filteredAssignments.length > 0} 
                    onCheckedChange={handleSelectAll} 
                    className="border-2"
                  />
                  <span className="text-sm font-semibold text-blue-900">
                    Select All ({filteredAssignments.length} {filteredAssignments.length === 1 ? 'item' : 'items'})
                  </span>
                </div>
              )}

              {/* Activities List */}
              <div className="space-y-4">
                {filteredAssignments.map((assignment, index) => {
                  const activity = assignment.activityId
                  const student = activity?.student
                  const studentDetails = student?.basicUserDetails
                  
                  return (
                    <div 
                      key={assignment._id} 
                      className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-xl transition-all duration-500 group/activity hover:scale-[1.02] hover:-translate-y-1 cursor-pointer bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedItems.includes(activity._id)}
                          onCheckedChange={(checked) => handleSelectItem(activity._id, checked)}
                          className="border-2 group-hover/activity:scale-110 transition-transform duration-300"
                        />

                        <div className="flex-1 min-w-0">
                          {/* Student Info */}
                          <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg group-hover/activity:bg-blue-50 transition-colors duration-300">
                            <div className="p-2 bg-blue-100 rounded-lg border-2 border-blue-300 group-hover/activity:scale-110 group-hover/activity:rotate-6 transition-all duration-300">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            {studentDetails ? (
                              <div>
                                <span className="font-semibold text-black group-hover/activity:text-blue-600 transition-colors duration-300">{studentDetails.name}</span>
                                <span className="text-sm text-gray-600 ml-2">{studentDetails.email}</span>
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">Student info not available</span>
                            )}
                          </div>

                          {/* Activity Info */}
                          <div className="mb-3">
                            <h3 className="font-semibold text-lg text-black group-hover/activity:text-blue-600 transition-colors duration-300 mb-2">
                              {activity.title || 'Untitled Activity'}
                            </h3>
                            {activity.description && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                              <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                <Calendar className="h-3 w-3" />
                                {activity.dateStart ? new Date(activity.dateStart).toLocaleDateString() : 'N/A'}
                                {activity.dateEnd && activity.dateEnd !== activity.dateStart && (
                                  <span> - {new Date(activity.dateEnd).toLocaleDateString()}</span>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs capitalize border-2 border-blue-300 text-blue-700 bg-blue-50 hover:scale-110 transition-transform duration-300">
                                {activity.activityType || 'default'}
                              </Badge>
                              <Badge variant="secondary" className="text-xs capitalize bg-orange-100 text-orange-700 border-2 border-orange-300 hover:scale-110 transition-transform duration-300">
                                {activity.status}
                              </Badge>
                            </div>

                            {/* External Links */}
                            {activity.externalLinks && activity.externalLinks.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {activity.externalLinks.map((link, index) => (
                                  <Badge key={index} variant="outline" className="text-xs border-2 border-green-300 bg-green-50 text-green-700 hover:scale-110 transition-transform duration-300">
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                      🔗 Link {index + 1}
                                    </a>
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Attachments Count */}
                            {activity.attachments && activity.attachments.length > 0 && (
                              <div className="flex items-center gap-2 text-xs text-gray-600 bg-purple-50 px-3 py-1 rounded-full border-2 border-purple-200 w-fit">
                                <FileText className="h-3 w-3 text-purple-600" />
                                <span className="font-medium">{activity.attachments.length} attachment(s)</span>
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-gray-500 flex items-center gap-4 pt-2 border-t border-gray-200">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Submitted: {new Date(activity.createdAt).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              📌 Assigned: {new Date(assignment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                          <Dialog open={dialogOpen && reviewingItem?._id === assignment._id} onOpenChange={(open) => {
                            setDialogOpen(open)
                            if (!open) {
                              setReviewingItem(null)
                              setReviewComment("")
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setReviewingItem(assignment)
                                  setDialogOpen(true)
                                }}
                                className="border-2 border-black hover:bg-black hover:text-white transition-all duration-300 hover:scale-110 relative overflow-hidden group/review"
                              >
                                <span className="absolute inset-0 bg-black transform -translate-x-full group-hover/review:translate-x-0 transition-transform duration-500"></span>
                                <span className="relative flex items-center">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Review
                                </span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto border-2 border-black shadow-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-black flex items-center gap-2">
                                  <Eye className="h-6 w-6 text-blue-600" />
                                  Review Activity Submission
                                </DialogTitle>
                                <DialogDescription className="text-gray-600">
                                  Carefully review the activity details and supporting documents before making a decision
                                </DialogDescription>
                              </DialogHeader>

                              {reviewingItem && (
                                <div className="space-y-6">
                                  {/* Student Details */}
                                  <div className="p-5 border-2 border-blue-200 rounded-xl bg-blue-50 hover:shadow-lg transition-all duration-300">
                                    <h4 className="font-bold text-lg mb-3 text-blue-900 flex items-center gap-2">
                                      <User className="h-5 w-5" />
                                      Student Information
                                    </h4>
                                    {reviewingItem.activityId?.student?.basicUserDetails ? (
                                      <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="bg-white p-3 rounded-lg">
                                          <strong className="text-gray-600">Name:</strong>
                                          <p className="font-semibold text-black mt-1">{reviewingItem.activityId.student.basicUserDetails.name}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg">
                                          <strong className="text-gray-600">Email:</strong>
                                          <p className="font-semibold text-black mt-1">{reviewingItem.activityId.student.basicUserDetails.email}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg">
                                          <strong className="text-gray-600">Gender:</strong>
                                          <p className="font-semibold text-black mt-1">{reviewingItem.activityId.student.basicUserDetails.gender || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg">
                                          <strong className="text-gray-600">Contact:</strong>
                                          <p className="font-semibold text-black mt-1">{reviewingItem.activityId.student.basicUserDetails.contactInfo?.phone || 'N/A'}</p>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500 italic bg-white p-3 rounded-lg">Student information not available</p>
                                    )}
                                  </div>

                                  {/* Activity Details */}
                                  <div className="p-5 border-2 border-purple-200 rounded-xl bg-purple-50 hover:shadow-lg transition-all duration-300">
                                    <h4 className="font-bold text-lg mb-3 text-purple-900 flex items-center gap-2">
                                      <FileText className="h-5 w-5" />
                                      Activity Details
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                      <div className="bg-white p-3 rounded-lg">
                                        <strong className="text-gray-600">Title:</strong>
                                        <p className="font-semibold text-black mt-1">{reviewingItem.activityId?.title || 'Untitled'}</p>
                                      </div>
                                      <div className="bg-white p-3 rounded-lg">
                                        <strong className="text-gray-600">Type:</strong>
                                        <p className="font-semibold text-black mt-1 capitalize">{reviewingItem.activityId?.activityType || 'default'}</p>
                                      </div>
                                      <div className="bg-white p-3 rounded-lg">
                                        <strong className="text-gray-600">Status:</strong>
                                        <div className="mt-1">
                                          <Badge variant="secondary" className="capitalize bg-orange-100 text-orange-700 border-2 border-orange-300">
                                            {reviewingItem.activityId?.status}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="bg-white p-3 rounded-lg grid grid-cols-2 gap-2">
                                        <div>
                                          <strong className="text-gray-600">Start Date:</strong>
                                          <p className="font-semibold text-black mt-1">
                                            {reviewingItem.activityId?.dateStart ? new Date(reviewingItem.activityId.dateStart).toLocaleDateString() : 'N/A'}
                                          </p>
                                        </div>
                                        <div>
                                          <strong className="text-gray-600">End Date:</strong>
                                          <p className="font-semibold text-black mt-1">
                                            {reviewingItem.activityId?.dateEnd ? new Date(reviewingItem.activityId.dateEnd).toLocaleDateString() : 'N/A'}
                                          </p>
                                        </div>
                                      </div>
                                      {reviewingItem.activityId?.description && (
                                        <div className="bg-white p-3 rounded-lg">
                                          <strong className="text-gray-600">Description:</strong>
                                          <p className="text-gray-700 mt-1">{reviewingItem.activityId.description}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                            {/* External Links */}
                            {reviewingItem.activityId?.externalLinks && reviewingItem.activityId.externalLinks.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <h4 className="font-medium mb-2">External Links</h4>
                                <div className="space-y-2">
                                  {reviewingItem.activityId.externalLinks.map((link, index) => (
                                    <a 
                                      key={index} 
                                      href={link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="block text-sm text-blue-600 hover:underline"
                                    >
                                      {link}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Attachments */}
                            {reviewingItem.activityId?.attachments && reviewingItem.activityId.attachments.length > 0 && (
                              <div className="p-4 border rounded-lg">
                                <h4 className="font-medium mb-2">Attachments ({reviewingItem.activityId.attachments.length})</h4>
                                <div className="space-y-2">
                                  {reviewingItem.activityId.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">
                                          {typeof attachment === 'object' ? attachment.name : `Attachment ${index + 1}`}
                                        </span>
                                      </div>
                                      {typeof attachment === 'object' && attachment.url && (
                                        <Button variant="outline" size="sm" onClick={() => window.open(attachment.url, '_blank')}>
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Review Comments */}
                            <div className="space-y-2">
                              <Label htmlFor="review-comment">Review Comments <span className="text-muted-foreground">(Required for rejection)</span></Label>
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
                              <Button 
                                onClick={() => handleApprove(reviewingItem.activityId._id, reviewComment)} 
                                className="flex-1"
                                disabled={actionLoading}
                              >
                                {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleReject(reviewingItem.activityId._id, reviewComment)}
                                className="flex-1"
                                disabled={actionLoading}
                              >
                                {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                                Reject
                              </Button>
                            </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(activity._id)} 
                              disabled={actionLoading}
                              className="bg-black text-white hover:bg-green-600 transition-all duration-300 hover:scale-110 border-2 border-black hover:border-green-600"
                            >
                              {actionLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                              Quick Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {filteredAssignments.length === 0 && (
                  <div className="text-center py-12">
                    <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200 inline-block">
                      <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 font-medium">No pending activities assigned to you.</p>
                      <p className="text-sm text-gray-500 mt-2">Check back later for new submissions.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }
