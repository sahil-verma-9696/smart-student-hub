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
    case "APPROVED":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "PENDING":
      return <Hourglass className="h-4 w-4 text-yellow-500" />
    case "REJECTED":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const activityCategories = [
    'MOOC', 'CERTIFICATION', 'CONFERENCE', 'CONFERENCE_PAPER', 'WORKSHOP',
    'WEBINAR', 'COMPETITION', 'INTERNSHIP', 'LEADERSHIP', 'VOLUNTEERING',
    'CLUB_ACTIVITY', 'PROJECT', 'SPORTS', 'CULTURAL', 'RESEARCH', 'PATENT', 'OTHER'
];

export function RecentActivities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [form, setForm] = useState({
    title: "",
    category: "MOOC",
    description: "",
    dateStart: "",
    dateEnd: "",
    certificateUrls: "",
    mediaUrls: "",
    level: "",
    hoursCount: "",
    tags: "",
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
      setActivities(data || [])
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
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
    
    const payload = {
      ...form,
      studentId,
      certificateUrls: form.certificateUrls.split(',').map(s => s.trim()).filter(s => s),
      mediaUrls: form.mediaUrls.split(',').map(s => s.trim()).filter(s => s),
      tags: form.tags.split(',').map(s => s.trim()).filter(s => s),
      hoursCount: Number(form.hoursCount) || undefined,
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
      if (!res.ok) throw new Error(result?.message || 'Failed to create activity')
      setActivities((prev) => [result, ...prev])
      toast.success('Activity added successfully')
      setShowForm(false)
      setForm({
        title: "", category: "MOOC", description: "", dateStart: "", dateEnd: "",
        certificateUrls: "", mediaUrls: "", level: "", hoursCount: "", tags: "", details: {}
      })
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
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, details: {} })} className="p-2 border rounded">
                {activityCategories.map(cat => <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <input type="date" value={form.dateStart} onChange={(e) => setForm({ ...form, dateStart: e.target.value })} className="flex-1 p-2 border rounded" placeholder="Start Date" />
              <input type="date" value={form.dateEnd} onChange={(e) => setForm({ ...form, dateEnd: e.target.value })} className="flex-1 p-2 border rounded" placeholder="End Date" />
            </div>
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 border rounded" />
            <div className="flex gap-2">
              <input placeholder="Certificate URLs (comma separated)" value={form.certificateUrls} onChange={(e) => setForm({ ...form, certificateUrls: e.target.value })} className="flex-1 p-2 border rounded" />
              <input placeholder="Media URLs (comma separated)" value={form.mediaUrls} onChange={(e) => setForm({ ...form, mediaUrls: e.target.value })} className="flex-1 p-2 border rounded" />
            </div>
            <div className="flex gap-2">
                <input placeholder="Level (e.g., National, State)" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="flex-1 p-2 border rounded" />
                <input placeholder="Hours Count" type="number" value={form.hoursCount} onChange={(e) => setForm({ ...form, hoursCount: e.target.value })} className="flex-1 p-2 border rounded" />
            </div>
            <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full p-2 border rounded" />

            {renderDetailsFields(form.category, form.details, (next) => setForm({ ...form, details: next }))}
            
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
              key={activity._id}
              onClick={() => setSelectedActivity(activity)}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex-shrink-0 mt-1">{getStatusIcon(activity.verificationStatus)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-foreground">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`text-xs ${getStatusColor(activity.verificationStatus)}`}>{activity.verificationStatus}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="outline" className="text-xs">{activity.category.replace(/_/g, ' ')}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(activity.dateStart || Date.now()).toLocaleDateString()}
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

        {selectedActivity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{selectedActivity.title}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedActivity(null)}>✕</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-sm mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="font-medium">{selectedActivity.category.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Verification Status</p>
                      <Badge className={getStatusColor(selectedActivity.verificationStatus)}>
                        {selectedActivity.verificationStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
                {selectedActivity.details && Object.keys(selectedActivity.details).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-3">Activity Details</h3>
                    <div className="bg-muted p-4 rounded-md space-y-2">
                      {renderActivityDetails(selectedActivity.details)}
                    </div>
                  </div>
                )}
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
    if (value === null || value === undefined || value === '') return null;
    const displayValue = Array.isArray(value) ? value.join(', ') : value.toString();
    return (
      <div key={key} className="text-sm">
        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
        <span className="text-muted-foreground ml-2">{displayValue}</span>
      </div>
    )
  })
}

function renderDetailsFields(category, details = {}, onChange) {
    const onField = (k, v) => onChange({ ...details, [k]: v });

    const fields = {
        MOOC: () => (
            <div className="space-y-2">
                <input required placeholder="Platform (e.g., Coursera)" value={details.platform || ''} onChange={(e) => onField('platform', e.target.value)} className="w-full p-2 border rounded" />
                <input required placeholder="Course Name" value={details.courseName || ''} onChange={(e) => onField('courseName', e.target.value)} className="w-full p-2 border rounded" />
            </div>
        ),
        CERTIFICATION: () => (
            <div className="space-y-2">
                <input required placeholder="Certifying Body" value={details.certifyingBody || ''} onChange={(e) => onField('certifyingBody', e.target.value)} className="w-full p-2 border rounded" />
                <input required placeholder="Certificate Name" value={details.certificateName || ''} onChange={(e) => onField('certificateName', e.target.value)} className="w-full p-2 border rounded" />
            </div>
        ),
        // Add all other categories here...
        // TODO: Implement fields for all other categories based on the schema
        OTHER: () => (
            <div className="space-y-2">
                <input required placeholder="Activity Name" value={details.activityName || ''} onChange={(e) => onField('activityName', e.target.value)} className="w-full p-2 border rounded" />
            </div>
        )
    };

    return fields[category] ? fields[category]() : <div>Select a category to see specific fields.</div>;
}