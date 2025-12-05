import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, Edit, Eye, Check, X, RefreshCw } from "lucide-react";
import storageKeys from "@/common/storage-keys";

export default function AddActivityType() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minCredit, setMinCredit] = useState(0);
  const [maxCredit, setMaxCredit] = useState(0);
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(false);

  // List and edit states
  const [activityTypes, setActivityTypes] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("create"); // "create" or "list"
  const [selectedType, setSelectedType] = useState(null);

  // Fetch all activity types
  useEffect(() => {
    fetchActivityTypes();
  }, []);

  const fetchActivityTypes = async () => {
    setLoadingList(true);
    try {
      const token = localStorage.getItem(storageKeys.accessToken);
      const res = await fetch(`${API_BASE}/activity-types`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const response = await res.json();
      // Backend returns { data: [...], meta: {...} }
      const data = response.data || response;
      setActivityTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch activity types:", err);
    } finally {
      setLoadingList(false);
    }
  };

  const addFormField = () => {
    setFormFields([
      ...formFields,
      {
        key: "",
        label: "",
        type: "text",
        options: [],
        required: false,
        placeholder: "",
      },
    ]);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setMinCredit(0);
    setMaxCredit(0);
    setFormFields([]);
    setEditingId(null);
    setSelectedType(null);
  };

  const loadActivityTypeForEdit = (activityType) => {
    setEditingId(activityType._id);
    setName(activityType.name);
    setDescription(activityType.description || "");
    setMinCredit(activityType.minCredit || 0);
    setMaxCredit(activityType.maxCredit || 0);
    setFormFields(
      activityType.formSchema?.map((f) => ({
        key: f.key,
        label: f.label,
        type: f.type,
        options: f.options || [],
        required: f.required || false,
        placeholder: f.placeholder || "",
      })) || []
    );
    setViewMode("create");
  };

  const removeFormField = (index) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const updateFormField = (index, field, value) => {
    const updated = [...formFields];
    updated[index] = { ...updated[index], [field]: value };
    setFormFields(updated);
  };

  const updateFieldOptions = (index, optionsString) => {
    const updated = [...formFields];
    updated[index].options = optionsString
      .split(",")
      .map((opt) => opt.trim())
      .filter(Boolean);
    setFormFields(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) return alert("Please enter activity type name");
    if (maxCredit > 0 && minCredit > maxCredit) {
      return alert("Min credit cannot be greater than max credit");
    }

    // Validate form fields
    for (let i = 0; i < formFields.length; i++) {
      const field = formFields[i];
      if (!field.key.trim()) return alert(`Field ${i + 1}: Key is required`);
      if (!field.label.trim()) return alert(`Field ${i + 1}: Label is required`);
      if ((field.type === "select" || field.type === "checkbox") && field.options.length === 0) {
        return alert(`Field ${i + 1}: Options are required for ${field.type} type`);
      }
    }

    // Institute-created activity types are always non-primitive (isPrimitive: false)
    // This means they are only visible to the creating institute
    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      isPrimitive: false, // Always false for institute-created types
      minCredit: Number(minCredit),
      maxCredit: Number(maxCredit),
      formSchema: formFields.map((f) => ({
        key: f.key.trim(),
        label: f.label.trim(),
        type: f.type,
        options: f.options.length > 0 ? f.options : undefined,
        required: f.required,
        placeholder: f.placeholder.trim() || undefined,
      })),
    };

    setLoading(true);
    try {
      const token = localStorage.getItem(storageKeys.accessToken);
      const url = editingId
        ? `${API_BASE}/activity-types/${editingId}`
        : `${API_BASE}/activity-types`;
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || `Failed to ${editingId ? "update" : "create"} activity type`);
      }

      alert(`Activity type ${editingId ? "updated" : "created"} successfully!`);
      resetForm();
      fetchActivityTypes();
      setViewMode("list");
    } catch (err) {
      console.error(err);
      alert(err.message || `Failed to ${editingId ? "update" : "create"} activity type`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this activity type?")) return;

    try {
      const token = localStorage.getItem(storageKeys.accessToken);
      const res = await fetch(`${API_BASE}/activity-types/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to delete activity type");
      }

      alert("Activity type deleted successfully!");
      fetchActivityTypes();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete activity type");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem(storageKeys.accessToken);
      const res = await fetch(`${API_BASE}/activity-types/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to update status");
      }

      alert(`Activity type ${newStatus.toLowerCase()} successfully!`);
      fetchActivityTypes();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* View Toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={viewMode === "create" ? "default" : "outline"}
          onClick={() => {
            setViewMode("create");
            if (!editingId) resetForm();
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {editingId ? "Edit Activity Type" : "Create New"}
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          onClick={() => setViewMode("list")}
        >
          <Eye className="h-4 w-4 mr-2" />
          View All ({activityTypes.length})
        </Button>
        <Button variant="ghost" onClick={fetchActivityTypes} disabled={loadingList}>
          <RefreshCw className={`h-4 w-4 ${loadingList ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Types</CardTitle>
            <CardDescription>
              Manage all activity types for your institute
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingList ? (
              <div className="text-center py-8">Loading...</div>
            ) : activityTypes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No activity types found. Create one to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {activityTypes.map((type) => (
                  <Card key={type._id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{type.name}</h3>
                          <Badge className={getStatusColor(type.status)}>
                            {type.status}
                          </Badge>
                          {type.isPrimitive && (
                            <Badge variant="outline">Primitive</Badge>
                          )}
                        </div>
                        {type.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {type.description}
                          </p>
                        )}
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>Credits: {type.minCredit} - {type.maxCredit}</span>
                          <span>Fields: {type.formSchema?.length || 0}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!type.isPrimitive && type.status === "UNDER_REVIEW" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(type._id, "APPROVED")}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(type._id, "REJECTED")}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedType(type);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!type.isPrimitive && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => loadActivityTypeForEdit(type)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(type._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Details Modal */}
                    {selectedType && selectedType._id === type._id && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>{selectedType.name}</CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedType(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-1">Status</h4>
                              <Badge className={getStatusColor(selectedType.status)}>
                                {selectedType.status}
                              </Badge>
                            </div>
                            {selectedType.description && (
                              <div>
                                <h4 className="font-semibold mb-1">Description</h4>
                                <p className="text-sm text-gray-600">
                                  {selectedType.description}
                                </p>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-1">Min Credit</h4>
                                <p className="text-sm">{selectedType.minCredit}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-1">Max Credit</h4>
                                <p className="text-sm">{selectedType.maxCredit}</p>
                              </div>
                            </div>
                            {selectedType.formSchema && selectedType.formSchema.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">Form Fields</h4>
                                <div className="space-y-2">
                                  {selectedType.formSchema.map((field, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3 bg-gray-50 rounded border"
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium">{field.label}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {field.type}
                                        </Badge>
                                        {field.required && (
                                          <Badge variant="outline" className="text-xs text-red-600">
                                            Required
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500">Key: {field.key}</p>
                                      {field.options && field.options.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          Options: {field.options.join(", ")}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form */}
      {viewMode === "create" && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Activity Type" : "Add New Activity Type"}
            </CardTitle>
            <CardDescription>
              {editingId
                ? "Update activity type details and form fields"
                : "Create a new activity type with custom form fields for students to fill"}
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Internship, Workshop, Hackathon"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This activity type will be available only to your institute
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this activity type"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Credits
                  </label>
                  <input
                    type="number"
                    value={minCredit}
                    onChange={(e) => setMinCredit(e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Credits
                  </label>
                  <input
                    type="number"
                    value={maxCredit}
                    onChange={(e) => setMaxCredit(e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Form Schema Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Custom Form Fields</h3>
                <Button type="button" variant="outline" size="sm" onClick={addFormField}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>

              {formFields.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-8 border-2 border-dashed rounded-md">
                  No form fields yet. Click "Add Field" to create custom fields for this activity type.
                </div>
              ) : (
                <div className="space-y-4">
                  {formFields.map((field, index) => (
                    <Card key={index} className="p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline">Field {index + 1}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFormField(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field Key <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={field.key}
                            onChange={(e) => updateFormField(index, "key", e.target.value)}
                            placeholder="e.g., companyName, duration"
                            className="w-full px-2 py-1 border rounded text-sm"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Used as the data key (no spaces, camelCase)
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field Label <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateFormField(index, "label", e.target.value)}
                            placeholder="e.g., Company Name, Duration"
                            className="w-full px-2 py-1 border rounded text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) => updateFormField(index, "type", e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="select">Select (Dropdown)</option>
                            <option value="checkbox">Checkbox</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Placeholder
                          </label>
                          <input
                            type="text"
                            value={field.placeholder}
                            onChange={(e) => updateFormField(index, "placeholder", e.target.value)}
                            placeholder="e.g., Enter company name"
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </div>

                        {(field.type === "select" || field.type === "checkbox") && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Options (comma-separated) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={field.options.join(", ")}
                              onChange={(e) => updateFieldOptions(index, e.target.value)}
                              placeholder="e.g., Option 1, Option 2, Option 3"
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </div>
                        )}

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateFormField(index, "required", e.target.checked)}
                            />
                            Required Field
                          </label>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (confirm("Are you sure you want to reset the form?")) {
                    resetForm();
                  }
                }}
              >
                Reset
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setViewMode("list");
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading
                  ? editingId
                    ? "Updating..."
                    : "Creating..."
                  : editingId
                  ? "Update Activity Type"
                  : "Create Activity Type"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
