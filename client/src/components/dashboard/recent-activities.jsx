import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ExternalLink, CheckCircle, AlertCircle, Hourglass, Plus } from "lucide-react"
import React, { useEffect, useState } from "react"
import { env } from "@/env/config"
import storageKeys from "@/common/storage-keys"
import toast from "react-hot-toast"

const getStatusIcon = (status) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "pending":
      return <Hourglass className="h-4 w-4 text-yellow-500" />
    case "rejected":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function RecentActivities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [form, setForm] = useState({
    title: "",
    activityType: "JournalPaper",
    description: "",
    dateStart: "",
    dateEnd: "",
    status: "Completed",
    certificateUrl: "",
    documentUrl: "",
    remarks: "",
    details: {},
  })

  useEffect(() => {
    fetchActivities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchActivities() {
    setLoading(true)
    try {
      const res = await fetch(`${env.SERVER_URL}/activity`, {
        headers: { Authorization: `Bearer ${localStorage.getItem(storageKeys.accessToken) || ""}` },
      })
      if (!res.ok) throw new Error('Failed to fetch activities')
      const data = await res.json()
      setActivities(data?.data || [])
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Get user details from localStorage
    const userDetailsStr = localStorage.getItem(storageKeys.userDetails)
    if (!userDetailsStr) {
      toast.error('User details not found. Please log in again.')
      return
    }
    
    let studentId = ''
    try {
      const userDetails = JSON.parse(userDetailsStr)
      studentId = userDetails._id || userDetails.id
    } catch (err) {
      toast.error('Invalid user details format')
      return
    }
    
    if (!studentId) {
      toast.error('Student ID not found')
      return
    }
    
    // Generate a simple activity ID (can be UUID if needed)
    const activityId = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // build payload
    const payload = {
      activityId,
      studentId,
      title: form.title,
      activityType: form.activityType,
      description: form.description,
      dateStart: form.dateStart || undefined,
      dateEnd: form.dateEnd || undefined,
      status: form.status,
      certificateUrl: form.certificateUrl || undefined,
      documentUrl: form.documentUrl || undefined,
      remarks: form.remarks || undefined,
      details: Object.keys(form.details || {}).length ? form.details : undefined,
    }

    try {
      const res = await fetch(`${env.SERVER_URL}/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem(storageKeys.accessToken) || ""}`,
        },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result?.error?.message || result?.message || 'Failed to create')
      // prepend newly created activity
      setActivities((prev) => [result?.data || result, ...prev])
      toast.success('Activity added')
      setShowForm(false)
      setForm({ title: '', activityType: 'JournalPaper', description: '', dateStart: '', dateEnd: '', status: 'Completed', certificateUrl: '', documentUrl: '', remarks: '', details: {} })
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to add activity')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>Your latest submissions and achievements</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowForm((s) => !s)}>
              {showForm ? 'Close' : 'Add Activity'}
              <Plus className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowAll(true)}>
              View All
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-md space-y-3">
            <div className="flex gap-2">
              <input required className="flex-1 p-2 border rounded" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <select value={form.activityType} onChange={(e) => setForm({ ...form, activityType: e.target.value, details: {} })} className="p-2 border rounded">
                <option value="JournalPaper">Journal Paper</option>
                <option value="ConferencePaper">Conference Paper</option>
                <option value="OnlineCourse">Online Course</option>
                <option value="WorkshopSeminar">Workshop / Seminar</option>
                <option value="AchievementAward">Achievement / Award</option>
                <option value="Certification">Certification</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input type="date" value={form.dateStart} onChange={(e) => setForm({ ...form, dateStart: e.target.value })} className="flex-1 p-2 border rounded" placeholder="Start Date" />
              <input type="date" value={form.dateEnd} onChange={(e) => setForm({ ...form, dateEnd: e.target.value })} className="flex-1 p-2 border rounded" placeholder="End Date" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="p-2 border rounded">
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Published">Published</option>
                <option value="Submitted">Submitted</option>
                <option value="Won">Won</option>
                <option value="Participated">Participated</option>
              </select>
            </div>
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 border rounded" />
            <div className="flex gap-2">
              <input placeholder="Certificate URL" value={form.certificateUrl} onChange={(e) => setForm({ ...form, certificateUrl: e.target.value })} className="flex-1 p-2 border rounded" />
              <input placeholder="Document URL" value={form.documentUrl} onChange={(e) => setForm({ ...form, documentUrl: e.target.value })} className="flex-1 p-2 border rounded" />
            </div>
            <textarea placeholder="Remarks (optional)" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} className="w-full p-2 border rounded" />
            {/* Dynamic details fields based on activity type */}
            {renderDetailsFields(form.activityType, form.details, (next) => setForm({ ...form, details: next }))}
            <div className="flex gap-2">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {!loading && activities.length === 0 && <div className="text-sm text-muted-foreground">No activities yet.</div>}
          {activities.slice(0, showAll ? activities.length : 5).map((activity) => (
            <div
              key={activity._id || activity.id}
              onClick={() => setSelectedActivity(activity)}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex-shrink-0 mt-1">{getStatusIcon(activity.status || activity.state || 'pending')}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-foreground">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`text-xs ${getStatusColor(activity.status || activity.state || 'pending')}`}>{activity.status || activity.state || 'pending'}</Badge>
                    <div className="text-xs text-muted-foreground">+{activity.points || 0} pts</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="outline" className="text-xs">{activity.activityType || activity.type}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(activity.dateStart || activity.date || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!loading && activities.length > 5 && !showAll && (
            <div className="text-center pt-4">
              <Button variant="ghost" size="sm" onClick={() => setShowAll(true)}>
                Load more ({activities.length - 5} more activities)
              </Button>
            </div>
          )}
        </div>

        {/* Activity Detail Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{selectedActivity.title}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedActivity(null)}>✕</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="font-semibold text-sm mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Activity Type</p>
                      <p className="font-medium">{selectedActivity.activityType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(selectedActivity.status || selectedActivity.state || 'pending')}>
                        {selectedActivity.status || selectedActivity.state || 'pending'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="font-medium">{selectedActivity.dateStart ? new Date(selectedActivity.dateStart).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">End Date</p>
                      <p className="font-medium">{selectedActivity.dateEnd ? new Date(selectedActivity.dateEnd).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedActivity.description && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{selectedActivity.description}</p>
                  </div>
                )}

                {/* URLs */}
                <div>
                  <h3 className="font-semibold text-sm mb-3">Documents & Certificates</h3>
                  <div className="space-y-2">
                    {selectedActivity.certificateUrl && (
                      <div>
                        <p className="text-xs text-muted-foreground">Certificate URL</p>
                        <a href={selectedActivity.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm truncate">
                          {selectedActivity.certificateUrl}
                        </a>
                      </div>
                    )}
                    {selectedActivity.documentUrl && (
                      <div>
                        <p className="text-xs text-muted-foreground">Document URL</p>
                        <a href={selectedActivity.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm truncate">
                          {selectedActivity.documentUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Remarks */}
                {selectedActivity.remarks && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Remarks</h3>
                    <p className="text-sm text-muted-foreground">{selectedActivity.remarks}</p>
                  </div>
                )}

                {/* Details */}
                {selectedActivity.details && Object.keys(selectedActivity.details).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-3">Activity Details</h3>
                    <div className="bg-muted p-4 rounded-md space-y-2">
                      {renderActivityDetails(selectedActivity.details)}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <Button onClick={() => setSelectedActivity(null)} className="w-full">Close</Button>
              </CardContent>
            </Card>
          </div>
        )}

      </CardContent>
    </Card>
  )
}

function renderActivityDetails(details) {
  return Object.entries(details).map(([key, value]) => {
    let displayValue = value
    if (Array.isArray(value)) {
      displayValue = value.join(', ')
    } else if (typeof value === 'object' && value !== null) {
      displayValue = JSON.stringify(value, null, 2)
    }
    return (
      <div key={key} className="text-sm">
        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
        <span className="text-muted-foreground ml-2">{displayValue || 'N/A'}</span>
      </div>
    )
  })
}

function renderDetailsFields(type, details = {}, onChange) {
  const onField = (k, v) => onChange({ ...details, [k]: v })

  switch (type) {
    case 'JournalPaper':
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input required placeholder="Journal Name" value={details.journalName || ''} onChange={(e) => onField('journalName', e.target.value)} className="flex-1 p-2 border rounded" />
            <select required value={details.indexing || ''} onChange={(e) => onField('indexing', e.target.value)} className="p-2 border rounded">
              <option value="">Indexing *</option>
              <option value="SCI">SCI</option>
              <option value="Scopus">Scopus</option>
              <option value="UGC">UGC</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input placeholder="ISSN" value={details.issn || ''} onChange={(e) => onField('issn', e.target.value)} className="flex-1 p-2 border rounded" />
            <input placeholder="DOI" value={details.doi || ''} onChange={(e) => onField('doi', e.target.value)} className="flex-1 p-2 border rounded" />
          </div>
          <div className="flex gap-2">
            <input placeholder="Publisher" value={details.publisher || ''} onChange={(e) => onField('publisher', e.target.value)} className="flex-1 p-2 border rounded" />
            <input placeholder="Page Numbers" value={details.pageNumbers || ''} onChange={(e) => onField('pageNumbers', e.target.value)} className="p-2 border rounded" />
          </div>
          <div>
            <label className="text-sm font-medium">Authors</label>
            <input required placeholder="First Author *" value={details.firstAuthor || ''} onChange={(e) => onField('firstAuthor', e.target.value)} className="w-full p-2 border rounded mb-1" />
            <input placeholder="Co-Authors (comma separated)" value={details.coAuthors?.join ? details.coAuthors.join(', ') : (details.coAuthors || '')} onChange={(e) => onField('coAuthors', e.target.value.split(',').map(s => s.trim()).filter(s => s))} className="w-full p-2 border rounded" />
          </div>
        </div>
      )

    case 'ConferencePaper':
      return (
        <div className="space-y-2">
          <input required placeholder="Conference Name *" value={details.conferenceName || ''} onChange={(e) => onField('conferenceName', e.target.value)} className="w-full p-2 border rounded" />
          <div className="flex gap-2">
            <input placeholder="Location" value={details.location || ''} onChange={(e) => onField('location', e.target.value)} className="flex-1 p-2 border rounded" />
            <select required value={details.presentationType || ''} onChange={(e) => onField('presentationType', e.target.value)} className="p-2 border rounded">
              <option value="">Presentation Type *</option>
              <option value="oral">Oral</option>
              <option value="poster">Poster</option>
            </select>
          </div>
          <div className="flex gap-2">
            <select value={details.publisher || ''} onChange={(e) => onField('publisher', e.target.value)} className="flex-1 p-2 border rounded">
              <option value="">Publisher</option>
              <option value="IEEE">IEEE</option>
              <option value="ACM">ACM</option>
              <option value="Springer">Springer</option>
              <option value="Elsevier">Elsevier</option>
              <option value="Other">Other</option>
            </select>
            <input placeholder="Proceedings ISBN" value={details.proceedingsISBN || ''} onChange={(e) => onField('proceedingsISBN', e.target.value)} className="p-2 border rounded" />
          </div>
          <input placeholder="DOI" value={details.doi || ''} onChange={(e) => onField('doi', e.target.value)} className="w-full p-2 border rounded" />
        </div>
      )

    case 'OnlineCourse':
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <select required value={details.platform || ''} onChange={(e) => onField('platform', e.target.value)} className="p-2 border rounded">
              <option value="">Platform *</option>
              <option value="NPTEL">NPTEL</option>
              <option value="Udemy">Udemy</option>
              <option value="Coursera">Coursera</option>
              <option value="edX">edX</option>
              <option value="Other">Other</option>
            </select>
            <input placeholder="Instructor Name" value={details.instructorName || ''} onChange={(e) => onField('instructorName', e.target.value)} className="flex-1 p-2 border rounded" />
          </div>
          <div className="flex gap-2">
            <input placeholder="Duration (hours)" type="number" value={details.durationHours || ''} onChange={(e) => onField('durationHours', e.target.value)} className="flex-1 p-2 border rounded" />
            <input placeholder="Score (%)" type="number" value={details.scorePercent || ''} onChange={(e) => onField('scorePercent', e.target.value)} className="flex-1 p-2 border rounded" />
          </div>
          <div className="flex gap-2">
            <input placeholder="Certificate ID" value={details.certificateId || ''} onChange={(e) => onField('certificateId', e.target.value)} className="flex-1 p-2 border rounded" />
            <input placeholder="Verification Link" value={details.verificationLink || ''} onChange={(e) => onField('verificationLink', e.target.value)} className="flex-1 p-2 border rounded" />
          </div>
          <div className="flex gap-2">
            <input placeholder="Course Category" value={details.courseCategory || ''} onChange={(e) => onField('courseCategory', e.target.value)} className="flex-1 p-2 border rounded" />
            <input placeholder="Course URL" value={details.courseUrl || ''} onChange={(e) => onField('courseUrl', e.target.value)} className="flex-1 p-2 border rounded" />
          </div>
          <input type="date" placeholder="Completion Date" value={details.completionDate || ''} onChange={(e) => onField('completionDate', e.target.value)} className="w-full p-2 border rounded" />
        </div>
      )

    case 'WorkshopSeminar':
      return (
        <div className="space-y-2">
          <input required placeholder="Organization *" value={details.organization || ''} onChange={(e) => onField('organization', e.target.value)} className="w-full p-2 border rounded" />
          <div className="flex gap-2">
            <select required value={details.mode || ''} onChange={(e) => onField('mode', e.target.value)} className="p-2 border rounded">
              <option value="">Mode *</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            <input placeholder="Duration (days)" type="number" value={details.durationDays || ''} onChange={(e) => onField('durationDays', e.target.value)} className="p-2 border rounded" />
            <select required value={details.role || ''} onChange={(e) => onField('role', e.target.value)} className="p-2 border rounded">
              <option value="">Role *</option>
              <option value="participant">Participant</option>
              <option value="speaker">Speaker</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input placeholder="Skill Gained" value={details.skillGained || ''} onChange={(e) => onField('skillGained', e.target.value)} className="flex-1 p-2 border rounded" />
            <input placeholder="Organizer Contact" value={details.organizerContact || ''} onChange={(e) => onField('organizerContact', e.target.value)} className="flex-1 p-2 border rounded" />
          </div>
          <input placeholder="Attendance Certificate URL" value={details.attendanceCertificateUrl || ''} onChange={(e) => onField('attendanceCertificateUrl', e.target.value)} className="w-full p-2 border rounded" />
        </div>
      )

    case 'AchievementAward':
      return (
        <div className="space-y-2">
          <input required placeholder="Award Title *" value={details.awardTitle || ''} onChange={(e) => onField('awardTitle', e.target.value)} className="w-full p-2 border rounded" />
          <div className="flex gap-2">
            <input required placeholder="Awarded By *" value={details.awardedBy || ''} onChange={(e) => onField('awardedBy', e.target.value)} className="flex-1 p-2 border rounded" />
            <input placeholder="Event Name" value={details.eventName || ''} onChange={(e) => onField('eventName', e.target.value)} className="flex-1 p-2 border rounded" />
          </div>
          <div className="flex gap-2">
            <input placeholder="Rank / Position" value={details.rankPosition || ''} onChange={(e) => onField('rankPosition', e.target.value)} className="flex-1 p-2 border rounded" />
            <input placeholder="Skill Gained" value={details.skilledGained || ''} onChange={(e) => onField('skilledGained', e.target.value)} className="flex-1 p-2 border rounded" />
          </div>
          <input placeholder="Award Certificate URL" value={details.awardCertificateUrl || ''} onChange={(e) => onField('awardCertificateUrl', e.target.value)} className="w-full p-2 border rounded" />
        </div>
      )

    case 'Certification':
      return (
        <div className="space-y-2">
          <input required placeholder="Certifying Body *" value={details.certifyingBody || ''} onChange={(e) => onField('certifyingBody', e.target.value)} className="w-full p-2 border rounded" />
          <div className="flex gap-2">
            <input type="date" placeholder="Valid Till" value={details.validTill || ''} onChange={(e) => onField('validTill', e.target.value)} className="flex-1 p-2 border rounded" />
            <input placeholder="Skill Category" value={details.skillCategory || ''} onChange={(e) => onField('skillCategory', e.target.value)} className="flex-1 p-2 border rounded" />
          </div>
          <input placeholder="Verification Link" value={details.verificationLink || ''} onChange={(e) => onField('verificationLink', e.target.value)} className="w-full p-2 border rounded" />
        </div>
      )

    default:
      return <div />
  }
}
