import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { activityAssignmentAPI, facultyAPI, activityAPI } from "@/services/api";
import { ActivityAssignmentTable } from "./activity-assignment-table";
import { ActivityAssignmentForm } from "./activity-assignment-form";

export default function ActivityAssignmentManagementPage() {
  const [assignments, setAssignments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Filters
  const [studentFilter, setStudentFilter] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");
  const [unassignedFilter, setUnassignedFilter] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, facultiesRes, activitiesRes] = await Promise.all([
        activityAssignmentAPI.getAll(),
        facultyAPI.getFaculties(),
        activityAPI.getActivities()
      ]);
      
      // Handle wrapped responses
      setAssignments(assignmentsRes?.data || assignmentsRes || []);
      setFaculties(facultiesRes?.data || facultiesRes || []);
      setActivities(activitiesRes?.data || activitiesRes || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      await activityAssignmentAPI.create(formData);
      toast.success("Assignment created successfully");
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error(error.response?.data?.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      setLoading(true);
      // If facultyId changed, use assign/reassign/unassign endpoints
      if (formData.facultyId) {
         // If it was previously unassigned, use assign, else reassign. 
         // But reassign works for both usually if implemented robustly, or we check editingAssignment.
         // The backend has specific endpoints.
         if (editingAssignment.facultyId) {
             await activityAssignmentAPI.reassignFaculty(formData.activityId, formData.facultyId);
         } else {
             await activityAssignmentAPI.assignFaculty(formData.activityId, formData.facultyId);
         }
      } else {
         await activityAssignmentAPI.unassignFaculty(formData.activityId);
      }
      
      toast.success("Assignment updated successfully");
      setShowForm(false);
      setEditingAssignment(null);
      fetchData();
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast.error(error.response?.data?.message || "Failed to update assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      setLoading(true);
      await activityAssignmentAPI.delete(id);
      toast.success("Assignment deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("Failed to delete assignment");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingAssignment(null);
    setShowForm(true);
  };

  const openEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (unassignedFilter && assignment.facultyId) return false;
    if (facultyFilter && !assignment.facultyId?.name?.toLowerCase().includes(facultyFilter.toLowerCase())) return false;
    if (studentFilter && !assignment.studentId?.name?.toLowerCase().includes(studentFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Activity Assignment Management</CardTitle>
          <Button onClick={openCreateModal} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
             <Input 
                placeholder="Filter by Student..." 
                value={studentFilter}
                onChange={(e) => setStudentFilter(e.target.value)}
                className="max-w-xs"
             />
             <Input 
                placeholder="Filter by Faculty..." 
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                className="max-w-xs"
             />
             <div className="flex items-center space-x-2">
                <Checkbox 
                    id="unassigned" 
                    checked={unassignedFilter}
                    onCheckedChange={setUnassignedFilter}
                />
                <Label htmlFor="unassigned">Show Unassigned Only</Label>
             </div>
          </div>

          <ActivityAssignmentTable
            assignments={filteredAssignments}
            loading={loading}
            onReassign={openEditModal}
            onUnassign={(assignment) => {
                if(confirm(`Unassign faculty from ${assignment.activityId?.title}?`)) {
                    activityAssignmentAPI.unassignFaculty(assignment.activityId._id)
                        .then(() => {
                            toast.success("Unassigned successfully");
                            fetchData();
                        })
                        .catch(err => toast.error("Failed to unassign"));
                }
            }}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <ActivityAssignmentForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={editingAssignment ? handleUpdate : handleCreate}
        assignment={editingAssignment}
        activities={activities}
        faculties={faculties}
        loading={loading}
      />
    </div>
  );
}
