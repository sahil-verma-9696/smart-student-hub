import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import { activityTypeAPI } from "@/services/api";
import { ActivityTypeTable } from "./activity-type-table";
import { ActivityTypeForm } from "./activity-type-form";
import { ActivityTypePreview } from "./activity-type-preview";

import storageKeys from "@/common/storage-keys";

export default function ActivityTypeManagementPage() {
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [primitiveFilter, setPrimitiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all activity types
  const fetchActivityTypes = async () => {
    try {
      setLoading(true);
      console.log('Fetching activity types...');
      console.log('Token in localStorage:', localStorage.getItem(storageKeys.accessToken));
      const response = await activityTypeAPI.getAll();
      console.log('Activity types fetched:', response);
      // Handle wrapped response from interceptor
      const data = response?.data || response || [];
      setActivityTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching activity types:", error);
      console.error("Error response:", error.response);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch activity types");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityTypes();
  }, []);

  // Create activity type
  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      await activityTypeAPI.create(formData);
      toast.success("Activity type created successfully!");
      setShowForm(false);
      fetchActivityTypes();
    } catch (error) {
      console.error("Error creating activity type:", error);
      toast.error(error.response?.data?.message || "Failed to create activity type");
    } finally {
      setLoading(false);
    }
  };

  // Update activity type
  const handleUpdate = async (id, formData) => {
    try {
      setLoading(true);
      await activityTypeAPI.update(id, formData);
      toast.success("Activity type updated successfully!");
      setShowForm(false);
      setEditingType(null);
      fetchActivityTypes();
    } catch (error) {
      console.error("Error updating activity type:", error);
      toast.error(error.response?.data?.message || "Failed to update activity type");
    } finally {
      setLoading(false);
    }
  };

  // Delete activity type
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this activity type?")) return;

    try {
      setLoading(true);
      await activityTypeAPI.delete(id);
      toast.success("Activity type deleted successfully!");
      fetchActivityTypes();
    } catch (error) {
      console.error("Error deleting activity type:", error);
      toast.error(error.response?.data?.message || "Failed to delete activity type");
    } finally {
      setLoading(false);
    }
  };

  // Approve activity type
  const handleApprove = async (id) => {
    try {
      setLoading(true);
      await activityTypeAPI.approve(id);
      toast.success("Activity type approved!");
      fetchActivityTypes();
    } catch (error) {
      console.error("Error approving activity type:", error);
      toast.error(error.response?.data?.message || "Failed to approve activity type");
    } finally {
      setLoading(false);
    }
  };

  // Reject activity type
  const handleReject = async (id) => {
    try {
      setLoading(true);
      await activityTypeAPI.reject(id);
      toast.success("Activity type rejected!");
      fetchActivityTypes();
    } catch (error) {
      console.error("Error rejecting activity type:", error);
      toast.error(error.response?.data?.message || "Failed to reject activity type");
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = (type) => {
    const duplicatedType = {
      ...type,
      _id: undefined, // Clear ID so it creates new
      name: `${type.name} (Copy)`,
      status: "DRAFT", // Reset status
      isPrimitive: false, // Duplicates are custom by default
    };
    setEditingType(duplicatedType);
    setShowForm(true);
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingType(null);
  };

  const filteredTypes = activityTypes.filter(type => {
    if (statusFilter !== "ALL" && type.status !== statusFilter) return false;
    if (primitiveFilter !== "ALL") {
        const isPrimitive = primitiveFilter === "YES";
        if (type.isPrimitive !== isPrimitive) return false;
    }
    if (searchQuery && !type.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Activity Types Management</CardTitle>
          <Button onClick={() => setShowForm(true)} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Add Activity Type
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showForm && (
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={primitiveFilter} onValueChange={setPrimitiveFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="YES">Primitive</SelectItem>
                  <SelectItem value="NO">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {showForm ? (
            <ActivityTypeForm
              activityType={editingType}
              onSubmit={editingType && editingType._id ? (data) => handleUpdate(editingType._id, data) : handleCreate}
              onCancel={handleCloseForm}
              loading={loading}
            />
          ) : (
            <ActivityTypeTable
              activityTypes={filteredTypes}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={handleReject}
              onDuplicate={handleDuplicate}
              onPreview={setPreviewType}
            />
          )}
        </CardContent>
      </Card>

      <ActivityTypePreview 
        isOpen={!!previewType} 
        onClose={() => setPreviewType(null)} 
        activityType={previewType} 
      />
    </div>
  );
}
