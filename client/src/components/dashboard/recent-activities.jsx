import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink, CheckCircle, AlertCircle, Hourglass, Plus } from "lucide-react";
import FileUploader from "@/components/common/file-uploader";
import storageKeys from "@/common/storage-keys";

const getStatusIcon = (status) => {
  switch (String(status).toLowerCase()) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "pending":
      return <Hourglass className="h-4 w-4 text-yellow-500" />;
    case "rejected":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status) => {
  switch (String(status).toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function RecentActivities() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  // For add/edit modal
  const [showForm, setShowForm] = useState(false);
  const [activityTypes, setActivityTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [formValues, setFormValues] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  
  // Core activity fields (not in dynamic details)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationType, setLocationType] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [skills, setSkills] = useState("");
  const [externalUrl, setExternalUrl] = useState("");

  useEffect(() => {
    fetchActivityTypes();
    fetchActivities();
  }, []);

  useEffect(() => {
    // when selected type changes, initialize formValues based on formSchema
    const type = activityTypes.find((t) => String(t._id) === String(selectedTypeId));
    if (type && type.formSchema) {
      const initial = {};
      const fields = Array.isArray(type.formSchema)
        ? type.formSchema
        : Object.entries(type.formSchema).map(([key, val]) => ({ key, ...(val || {}) }));
      fields.forEach((f) => {
        initial[f.key] = f.default || "";
      });
      setFormValues(initial);
    } else {
      setFormValues({});
    }
  }, [selectedTypeId, activityTypes]);

  const fetchActivityTypes = async () => {
    try {
      const token = localStorage.getItem(storageKeys.accessToken);
      const res = await fetch(`${API_BASE}/activity-types`, { 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
      });
      const data = await res.json();
      const types = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.docs)
        ? data.docs
        : [];
      setActivityTypes(types);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(storageKeys.accessToken);
      const res = await fetch(`${API_BASE}/activities`, { 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
      });
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.docs)
        ? data.docs
        : [];
      setActivities(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (cloudResponse) => {
    if (!cloudResponse) return;
    setAttachments((prev) => [cloudResponse, ...prev]);
  };

  const handleInputChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const openNewForm = () => {
    setEditingActivity(null);
    setSelectedTypeId("");
    setFormValues({});
    setAttachments([]);
    setTitle("");
    setDescription("");
    setLocation("");
    setLocationType("");
    setIsPublic(false);
    setSkills("");
    setExternalUrl("");
    setShowForm(true);
  };

  const openEditForm = (activity) => {
    setEditingActivity(activity);
    setSelectedTypeId(activity.activityType?._id || activity.activityType);
    setFormValues(activity.details || {});
    setAttachments(activity.attachments || []);
    setTitle(activity.title || "");
    setDescription(activity.description || "");
    setLocation(activity.location || "");
    setLocationType(activity.locationType || "");
    setIsPublic(activity.isPublic || false);
    setSkills(Array.isArray(activity.skills) ? activity.skills.join(", ") : "");
    setExternalUrl(activity.externalUrl || "");
    setShowForm(true);
  };

  const handleSubmit = async () => {
    // Validate required core fields
    if (!selectedTypeId) return alert("Please select an activity type");
    if (!title.trim()) return alert("Please enter a title");
    if (!location.trim()) return alert("Please enter a location");

    // client-side required-field validation for dynamic details
    const type = activityTypes.find((t) => String(t._id) === String(selectedTypeId));
    if (type) {
      const fields = Array.isArray(type.formSchema)
        ? type.formSchema
        : Object.entries(type.formSchema || {}).map(([key, val]) => ({ key, ...(val || {}) }));
      const missing = [];
      fields.forEach((f) => {
        if (f.required) {
          const val = formValues[f.key];
          const isEmpty = val === undefined || val === null || val === "";
          if (isEmpty) missing.push(f.label || f.key);
        }
      });
      if (missing.length > 0) {
        return alert("Please fill required fields: " + missing.join(", "));
      }
    }

    // Build the complete payload matching CreateActivityDto
    const payload = {
      activityTypeId: selectedTypeId,
      title: title.trim(),
      description: description.trim() || undefined,
      location: location.trim(),
      locationType: locationType.trim() || undefined,
      details: formValues,
      isPublic: isPublic,
      skills: skills ? skills.split(",").map(s => s.trim()).filter(Boolean) : [],
      externalUrl: externalUrl.trim() || undefined,
      attachments: attachments.map((a) => a._id || a.id).filter(Boolean),
    };

    try {
      const token = localStorage.getItem(storageKeys.accessToken);
      if (editingActivity) {
        const res = await fetch(`${API_BASE}/activities/${editingActivity._id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            ...(token ? { Authorization: `Bearer ${token}` } : {}) 
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
      } else {
        const res = await fetch(`${API_BASE}/activities`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            ...(token ? { Authorization: `Bearer ${token}` } : {}) 
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || "Create failed");
        }
      }
      await fetchActivities();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit activity");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this activity?")) return;
    try {
      const token = localStorage.getItem(storageKeys.accessToken);
      const res = await fetch(`${API_BASE}/activities/${id}`, { 
        method: "DELETE", 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchActivities();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const renderActivity = (activity) => {
    const status = String(activity.status || "PENDING").toLowerCase();
    return (
      <div
        key={activity._id}
        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
      >
        <div className="flex-shrink-0 mt-1">{getStatusIcon(status)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-medium text-sm text-foreground">
                {activity.title || (activity.details && Object.values(activity.details)[0])}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.description || activity.externalUrl}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={`text-xs ${getStatusColor(status)}`}>
                {status}
              </Badge>
              <div className="text-xs text-muted-foreground">
                {activity.activityType?.name || activity.activityType?.key}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <Badge variant="outline" className="text-xs">
              {activity.activityType?.key || "Activity"}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(activity.createdAt || Date.now()).toLocaleDateString()}
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="ghost" onClick={() => openEditForm(activity)}>
              Edit
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(activity._id)}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

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
            <Button variant="outline" size="sm" onClick={openNewForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Activity
            </Button>
            <Button variant="outline" size="sm" onClick={fetchActivities}>
              View All
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {activities.length === 0 && !loading && (
            <div className="text-sm text-muted-foreground">No activities yet.</div>
          )}
          {activities.map((activity) => renderActivity(activity))}
        </div>

        {showForm && (
          <div className="mt-6 pt-4 border-t">
            <div className="space-y-4 p-4 bg-muted/50 rounded">
              <h3 className="text-lg font-semibold">
                {editingActivity ? "Edit Activity" : "Create New Activity"}
              </h3>

              {/* Core Activity Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Activity Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedTypeId}
                    onChange={(e) => setSelectedTypeId(e.target.value)}
                    className="mt-1 block w-full rounded-md border px-2 py-2"
                  >
                    <option value="">Select type</option>
                    {activityTypes.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name || t.title || t.key}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Summer Internship at Google"
                    className="mt-1 block w-full rounded-md border px-2 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Bangalore, India"
                    className="mt-1 block w-full rounded-md border px-2 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location Type</label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    className="mt-1 block w-full rounded-md border px-2 py-2"
                  >
                    <option value="">Select</option>
                    <option value="onsite">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of your activity"
                    rows={3}
                    className="mt-1 block w-full rounded-md border px-2 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g., React, Node.js, MongoDB"
                    className="mt-1 block w-full rounded-md border px-2 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">External URL</label>
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1 block w-full rounded-md border px-2 py-2"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    Make this activity public
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Attachments</label>
                  <div className="mt-2">
                    <FileUploader onUpload={handleFileUpload} />
                    <div className="text-xs text-muted-foreground mt-2">
                      Uploaded: {attachments.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic form fields based on ActivityType's formSchema */}
              {selectedTypeId && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-md font-semibold mb-3">Activity-Specific Details</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activityTypes
                      .filter((t) => String(t._id) === String(selectedTypeId))
                      .flatMap((t) => t.formSchema || [])
                      .map((field) => (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {field.type === "text" && (
                            <input
                              type="text"
                              value={formValues[field.key] || ""}
                              onChange={(e) => handleInputChange(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className={`mt-1 block w-full rounded-md border px-2 py-2 ${
                                field.required && !formValues[field.key] ? 'border-red-300' : ''
                              }`}
                            />
                          )}
                          {field.type === "number" && (
                            <input
                              type="number"
                              value={formValues[field.key] || ""}
                              onChange={(e) => handleInputChange(field.key, Number(e.target.value))}
                              placeholder={field.placeholder}
                              className={`mt-1 block w-full rounded-md border px-2 py-2 ${
                                field.required && !formValues[field.key] ? 'border-red-300' : ''
                              }`}
                            />
                          )}
                          {field.type === "date" && (
                            <input
                              type="date"
                              value={formValues[field.key] || ""}
                              onChange={(e) => handleInputChange(field.key, e.target.value)}
                              className={`mt-1 block w-full rounded-md border px-2 py-2 ${
                                field.required && !formValues[field.key] ? 'border-red-300' : ''
                              }`}
                            />
                          )}
                          {field.type === "select" && (
                            <select
                              value={formValues[field.key] || ""}
                              onChange={(e) => handleInputChange(field.key, e.target.value)}
                              className={`mt-1 block w-full rounded-md border px-2 py-2 ${
                                field.required && !formValues[field.key] ? 'border-red-300' : ''
                              }`}
                            >
                              <option value="">Select</option>
                              {(field.options || []).map((opt, idx) => (
                                <option key={idx} value={opt.value || opt}>
                                  {opt.label || opt}
                                </option>
                              ))}
                            </select>
                          )}
                          {field.type === "checkbox" && (
                            <input
                              type="checkbox"
                              checked={!!formValues[field.key]}
                              onChange={(e) => handleInputChange(field.key, e.target.checked)}
                              className="mt-1"
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingActivity ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
