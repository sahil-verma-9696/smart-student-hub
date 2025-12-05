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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Copy,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import storageKeys from "@/common/storage-keys";
import useAuthContext from "@/hooks/useAuthContext";

export default function ActivityTypeManagement() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const { user } = useAuthContext();

  // State Management
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minCredit, setMinCredit] = useState(0);
  const [maxCredit, setMaxCredit] = useState(0);
  const [formFields, setFormFields] = useState([]);
  const [currentType, setCurrentType] = useState(null);
  const [expandedFields, setExpandedFields] = useState({});

  // Filter States
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPrimitive, setFilterPrimitive] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Field Types
  const fieldTypes = ["text", "number", "date", "select", "checkbox"];

  // Fetch Data
  useEffect(() => {
    fetchActivityTypes();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem(storageKeys.accessToken);
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchActivityTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/activity-types`, {
        headers: getAuthHeaders(),
      });
      const response = await res.json();
      const data = response.data || response;
      setActivityTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch activity types:", err);
      toast.error("Failed to fetch activity types");
    } finally {
      setLoading(false);
    }
  };

  // Form Field Management
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

  const updateFormField = (index, field, value) => {
    const updated = [...formFields];
    updated[index] = { ...updated[index], [field]: value };
    setFormFields(updated);
  };

  const removeFormField = (index) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const addFieldOption = (fieldIndex) => {
    const updated = [...formFields];
    if (!updated[fieldIndex].options) {
      updated[fieldIndex].options = [];
    }
    updated[fieldIndex].options.push("");
    setFormFields(updated);
  };

  const updateFieldOption = (fieldIndex, optionIndex, value) => {
    const updated = [...formFields];
    updated[fieldIndex].options[optionIndex] = value;
    setFormFields(updated);
  };

  const removeFieldOption = (fieldIndex, optionIndex) => {
    const updated = [...formFields];
    updated[fieldIndex].options = updated[fieldIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setFormFields(updated);
  };

  // Validation
  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (minCredit < 0 || maxCredit < 0) {
      toast.error("Credits cannot be negative");
      return false;
    }

    if (minCredit > maxCredit) {
      toast.error("Minimum credit cannot be greater than maximum credit");
      return false;
    }

    // Validate form fields
    const keys = new Set();
    for (let field of formFields) {
      if (!field.key.trim() || !field.label.trim()) {
        toast.error("All form fields must have key and label");
        return false;
      }

      if (keys.has(field.key)) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: `Duplicate field key: ${field.key}`,
        });
        return false;
      }
      keys.add(field.key);

      if (
        (field.type === "select" || field.type === "checkbox") &&
        (!field.options || field.options.length === 0)
      ) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: `Field "${field.label}" requires at least one option`,
        });
        return false;
      }
    }

    return true;
  };

  // CREATE Activity Type
  const handleCreateActivityType = async () => {
    if (!validateForm()) return;

    setActionLoading(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        minCredit: Number(minCredit),
        maxCredit: Number(maxCredit),
        formSchema: formFields,
        instituteId: user?.instituteId,
      };

      const res = await fetch(`${API_BASE}/activity-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create activity type");
      }

      toast.success("Activity type created successfully");

      setIsCreateModalOpen(false);
      resetForm();
      fetchActivityTypes();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // UPDATE Activity Type
  const handleUpdateActivityType = async () => {
    if (!validateForm()) return;

    setActionLoading(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        minCredit: Number(minCredit),
        maxCredit: Number(maxCredit),
        formSchema: formFields,
      };

      const res = await fetch(`${API_BASE}/activity-types/${currentType._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update activity type");
      }

      toast.success("Activity type updated successfully");

      setIsEditModalOpen(false);
      resetForm();
      fetchActivityTypes();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // APPROVE Activity Type
  const handleApproveActivityType = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/activity-types/${currentType._id}/approve`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to approve activity type");
      }

      toast.success("Activity type approved successfully");

      setIsApproveModalOpen(false);
      setCurrentType(null);
      fetchActivityTypes();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // REJECT Activity Type
  const handleRejectActivityType = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/activity-types/${currentType._id}/reject`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to reject activity type");
      }

      toast.success("Activity type rejected successfully");

      setIsRejectModalOpen(false);
      setCurrentType(null);
      fetchActivityTypes();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE Activity Type
  const handleDeleteActivityType = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/activity-types/${currentType._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete activity type");
      }

      toast.success("Activity type deleted successfully");

      setIsDeleteModalOpen(false);
      setCurrentType(null);
      fetchActivityTypes();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // DUPLICATE Activity Type
  const handleDuplicateActivityType = (type) => {
    setName(type.name + " (Copy)");
    setDescription(type.description || "");
    setMinCredit(type.minCredit || 0);
    setMaxCredit(type.maxCredit || 0);
    setFormFields(
      type.formSchema?.map((f) => ({
        key: f.key,
        label: f.label,
        type: f.type,
        options: f.options || [],
        required: f.required || false,
        placeholder: f.placeholder || "",
      })) || []
    );
    setIsCreateModalOpen(true);
  };

  // Reset Form
  const resetForm = () => {
    setName("");
    setDescription("");
    setMinCredit(0);
    setMaxCredit(0);
    setFormFields([]);
    setCurrentType(null);
  };

  // Open Edit Modal
  const openEditModal = (type) => {
    setCurrentType(type);
    setName(type.name);
    setDescription(type.description || "");
    setMinCredit(type.minCredit || 0);
    setMaxCredit(type.maxCredit || 0);
    setFormFields(
      type.formSchema?.map((f) => ({
        key: f.key,
        label: f.label,
        type: f.type,
        options: f.options || [],
        required: f.required || false,
        placeholder: f.placeholder || "",
      })) || []
    );
    setIsEditModalOpen(true);
  };

  // Open View Modal
  const openViewModal = (type) => {
    setCurrentType(type);
    setIsViewModalOpen(true);
  };

  // Filter Activity Types
  const filteredActivityTypes = activityTypes.filter((type) => {
    // Filter by status
    if (filterStatus && filterStatus !== "ALL" && type.status !== filterStatus) {
      return false;
    }

    // Filter by primitive
    if (filterPrimitive === "yes" && !type.isPrimitive) {
      return false;
    }
    if (filterPrimitive === "no" && type.isPrimitive) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      if (!type.name?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  // Get status badge
  const getStatusBadge = (status) => {
    const variants = {
      APPROVED: "default",
      REJECTED: "destructive",
      UNDER_REVIEW: "secondary",
      DRAFT: "outline",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status || "DRAFT"}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Activity Type Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage activity types and their dynamic form schemas
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Activity Type
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Search by Name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activity types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label>Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Filter by Primitive</Label>
              <Select value={filterPrimitive} onValueChange={setFilterPrimitive}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="yes">Primitive Only</SelectItem>
                  <SelectItem value="no">Non-Primitive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("ALL");
                  setFilterPrimitive("ALL");
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Types Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Activity Types ({filteredActivityTypes.length})
          </CardTitle>
          <CardDescription>
            View and manage all activity types
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading activity types...</div>
          ) : filteredActivityTypes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activity types found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Primitive</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Credit Range</TableHead>
                  <TableHead>Fields Count</TableHead>
                  <TableHead>Institute</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivityTypes.map((type) => (
                  <TableRow key={type._id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>
                      {type.isPrimitive ? (
                        <Badge variant="secondary">YES</Badge>
                      ) : (
                        <Badge variant="outline">NO</Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(type.status)}</TableCell>
                    <TableCell>
                      {type.minCredit || 0} - {type.maxCredit || 0}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {type.formSchema?.length || 0} fields
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {type.instituteId?.name || "N/A"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openViewModal(type)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!type.isPrimitive && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditModal(type)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDuplicateActivityType(type)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {type.status === "UNDER_REVIEW" &&
                        user?.role === "admin" && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setCurrentType(type);
                                setIsApproveModalOpen(true);
                              }}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setCurrentType(type);
                                setIsRejectModalOpen(true);
                              }}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      {!type.isPrimitive && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setCurrentType(type);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* CREATE/EDIT Modal */}
      <Dialog
        open={isCreateModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditModalOpen ? "Edit Activity Type" : "Create Activity Type"}
            </DialogTitle>
            <DialogDescription>
              Define the activity type with dynamic form fields
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input
                  placeholder="e.g., Internship, Workshop, Seminar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description of this activity type..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Minimum Credit *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={minCredit}
                    onChange={(e) => setMinCredit(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Maximum Credit *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={maxCredit}
                    onChange={(e) => setMaxCredit(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Form Schema Builder */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">
                  Form Fields ({formFields.length})
                </Label>
                <Button size="sm" onClick={addFormField}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </div>

              {formFields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  No form fields added yet. Click "Add Field" to create one.
                </div>
              ) : (
                <div className="space-y-4">
                  {formFields.map((field, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="font-semibold">
                            Field {index + 1}
                          </Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFormField(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Key (unique identifier)</Label>
                            <Input
                              placeholder="e.g., company_name"
                              value={field.key}
                              onChange={(e) =>
                                updateFormField(index, "key", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Label (display name)</Label>
                            <Input
                              placeholder="e.g., Company Name"
                              value={field.label}
                              onChange={(e) =>
                                updateFormField(index, "label", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Field Type</Label>
                            <Select
                              value={field.type}
                              onValueChange={(value) =>
                                updateFormField(index, "type", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Placeholder</Label>
                            <Input
                              placeholder="Optional hint text"
                              value={field.placeholder}
                              onChange={(e) =>
                                updateFormField(
                                  index,
                                  "placeholder",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.required}
                            onCheckedChange={(checked) =>
                              updateFormField(index, "required", checked)
                            }
                          />
                          <Label>Required field</Label>
                        </div>

                        {/* Options for select/checkbox */}
                        {(field.type === "select" ||
                          field.type === "checkbox") && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Options</Label>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addFieldOption(index)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Option
                              </Button>
                            </div>
                            {field.options?.map((option, optIndex) => (
                              <div key={optIndex} className="flex gap-2">
                                <Input
                                  placeholder={`Option ${optIndex + 1}`}
                                  value={option}
                                  onChange={(e) =>
                                    updateFieldOption(
                                      index,
                                      optIndex,
                                      e.target.value
                                    )
                                  }
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    removeFieldOption(index, optIndex)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={
                isEditModalOpen
                  ? handleUpdateActivityType
                  : handleCreateActivityType
              }
              disabled={actionLoading}
            >
              {actionLoading
                ? "Saving..."
                : isEditModalOpen
                ? "Update Activity Type"
                : "Create Activity Type"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity Type Details</DialogTitle>
          </DialogHeader>

          {currentType && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium text-lg">{currentType.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(currentType.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Primitive Type</Label>
                  <p className="font-medium">
                    {currentType.isPrimitive ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Credit Range</Label>
                  <p className="font-medium">
                    {currentType.minCredit || 0} - {currentType.maxCredit || 0}
                  </p>
                </div>
              </div>

              {currentType.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{currentType.description}</p>
                </div>
              )}

              {/* Form Schema Preview */}
              <div>
                <Label className="text-lg font-semibold">
                  Form Schema ({currentType.formSchema?.length || 0} fields)
                </Label>
                {currentType.formSchema && currentType.formSchema.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {currentType.formSchema.map((field, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{field.label}</p>
                              <p className="text-sm text-muted-foreground">
                                Key: {field.key}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">{field.type}</Badge>
                              {field.required && (
                                <Badge variant="destructive">Required</Badge>
                              )}
                            </div>
                          </div>
                          {field.placeholder && (
                            <p className="text-sm text-muted-foreground italic">
                              Placeholder: {field.placeholder}
                            </p>
                          )}
                          {field.options && field.options.length > 0 && (
                            <div className="mt-2">
                              <Label className="text-sm">Options:</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {field.options.map((opt, i) => (
                                  <Badge key={i} variant="secondary">
                                    {opt}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-2">
                    No form fields defined
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* APPROVE Confirmation Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Activity Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this activity type? Students will
              be able to use it for their activities.
            </DialogDescription>
          </DialogHeader>

          {currentType && (
            <div className="py-4">
              <p className="font-medium">{currentType.name}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Credit Range: {currentType.minCredit} - {currentType.maxCredit}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsApproveModalOpen(false);
                setCurrentType(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveActivityType}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECT Confirmation Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Activity Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this activity type? It will not be
              available for use.
            </DialogDescription>
          </DialogHeader>

          {currentType && (
            <div className="py-4">
              <p className="font-medium">{currentType.name}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectModalOpen(false);
                setCurrentType(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectActivityType}
              disabled={actionLoading}
            >
              {actionLoading ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Activity Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity type? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {currentType && (
            <div className="py-4">
              <p className="font-medium">{currentType.name}</p>
              <p className="text-sm text-muted-foreground mt-2">
                This will permanently delete the activity type and its form schema.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCurrentType(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteActivityType}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

