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
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  UserX,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";
import storageKeys from "@/common/storage-keys";
import useAuthContext from "@/hooks/useAuthContext";

export default function ActivityAssignmentManagement() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const { user } = useAuthContext();

  // State Management
  const [assignments, setAssignments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form States
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [currentAssignment, setCurrentAssignment] = useState(null);

  // Filter States
  const [filterFaculty, setFilterFaculty] = useState("");
  const [filterStudent, setFilterStudent] = useState("");
  const [filterUnassigned, setFilterUnassigned] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Data
  useEffect(() => {
    fetchAssignments();
    fetchActivities();
    fetchFaculty();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem(storageKeys.accessToken);
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/activity-assignment`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch activity assignments",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await fetch(`${API_BASE}/activities`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      setActivities(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    }
  };

  const fetchFaculty = async () => {
    try {
      const res = await fetch(`${API_BASE}/faculty`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      setFaculty(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Failed to fetch faculty:", err);
    }
  };

  // Get activity details
  const getActivityDetails = (activityId) => {
    return activities.find((a) => a._id === activityId);
  };

  // Get faculty details
  const getFacultyDetails = (facultyId) => {
    return faculty.find((f) => f._id === facultyId);
  };

  // CREATE Assignment
  const handleCreateAssignment = async () => {
    if (!selectedActivity) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select an activity",
      });
      return;
    }

    setActionLoading(true);
    try {
      const activity = getActivityDetails(selectedActivity);
      const payload = {
        activityId: selectedActivity,
        studentId: activity?.studentId,
        facultyId: (selectedFaculty && selectedFaculty !== "NONE") ? selectedFaculty : null,
        instituteId: user?.instituteId,
      };

      const res = await fetch(`${API_BASE}/activity-assignment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create assignment");
      }

      toast({
        title: "Success",
        description: "Activity assignment created successfully",
      });

      setIsCreateModalOpen(false);
      resetForm();
      fetchAssignments();
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

  // ASSIGN Faculty
  const handleAssignFaculty = async (assignmentId, facultyId) => {
    setActionLoading(true);
    try {
      const assignment = assignments.find((a) => a._id === assignmentId);
      const res = await fetch(`${API_BASE}/activity-assignment/${assignmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          facultyId: facultyId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to assign faculty");
      }

      toast({
        title: "Success",
        description: "Faculty assigned successfully",
      });

      fetchAssignments();
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

  // REASSIGN Faculty (Update Modal)
  const handleReassignFaculty = async () => {
    if (!selectedFaculty) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a faculty member",
      });
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/activity-assignment/${currentAssignment._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            facultyId: selectedFaculty,
          }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to reassign faculty");
      }

      toast({
        title: "Success",
        description: "Faculty reassigned successfully",
      });

      setIsEditModalOpen(false);
      resetForm();
      fetchAssignments();
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

  // UNASSIGN Faculty
  const handleUnassignFaculty = async (assignmentId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/activity-assignment/${assignmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          facultyId: null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to unassign faculty");
      }

      toast({
        title: "Success",
        description: "Faculty unassigned successfully",
      });

      fetchAssignments();
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

  // DELETE Assignment
  const handleDeleteAssignment = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/activity-assignment/${currentAssignment._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete assignment");
      }

      toast({
        title: "Success",
        description: "Assignment deleted successfully",
      });

      setIsDeleteModalOpen(false);
      setCurrentAssignment(null);
      fetchAssignments();
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

  // Reset Form
  const resetForm = () => {
    setSelectedActivity("");
    setSelectedFaculty("");
    setCurrentAssignment(null);
  };

  // Open Edit Modal
  const openEditModal = (assignment) => {
    setCurrentAssignment(assignment);
    setSelectedFaculty(assignment.facultyId?._id || "");
    setIsEditModalOpen(true);
  };

  // Open View Modal
  const openViewModal = (assignment) => {
    setCurrentAssignment(assignment);
    setIsViewModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (assignment) => {
    setCurrentAssignment(assignment);
    setIsDeleteModalOpen(true);
  };

  // Filter Assignments
  const filteredAssignments = assignments.filter((assignment) => {
    // Filter by faculty
    if (filterFaculty && assignment.facultyId?._id !== filterFaculty) {
      return false;
    }

    // Filter by unassigned
    if (filterUnassigned && assignment.facultyId) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const activity = getActivityDetails(assignment.activityId);
      const facultyName = assignment.facultyId
        ? `${assignment.facultyId.firstName} ${assignment.facultyId.lastName}`
        : "";
      const studentName = assignment.studentId
        ? `${assignment.studentId.firstName} ${assignment.studentId.lastName}`
        : "";

      const searchLower = searchQuery.toLowerCase();
      if (
        !activity?.title?.toLowerCase().includes(searchLower) &&
        !facultyName.toLowerCase().includes(searchLower) &&
        !studentName.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    return true;
  });

  // Get unassigned activities
  const unassignedActivities = activities.filter(
    (activity) =>
      !assignments.some((assignment) => assignment.activityId === activity._id)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Activity Assignment Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage faculty assignments for student activities
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Assignment
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
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by activity, student, or faculty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label>Filter by Faculty</Label>
              <Select value={filterFaculty} onValueChange={setFilterFaculty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Faculty</SelectItem>
                  {faculty.map((f) => (
                    <SelectItem key={f._id} value={f._id}>
                      {f.firstName} {f.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant={filterUnassigned ? "default" : "outline"}
                onClick={() => setFilterUnassigned(!filterUnassigned)}
              >
                {filterUnassigned ? "Show All" : "Unassigned Only"}
              </Button>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilterFaculty("");
                  setFilterUnassigned(false);
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Activity Assignments ({filteredAssignments.length})
          </CardTitle>
          <CardDescription>
            View and manage all activity assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading assignments...</div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No assignments found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity Title</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Assigned Faculty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => {
                  const activity = getActivityDetails(assignment.activityId);
                  const assignedFaculty = assignment.facultyId;
                  const student = assignment.studentId;

                  return (
                    <TableRow key={assignment._id}>
                      <TableCell className="font-medium">
                        {activity?.title || "Unknown Activity"}
                      </TableCell>
                      <TableCell>
                        {student
                          ? `${student.firstName} ${student.lastName}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {assignedFaculty ? (
                          <Badge variant="default">
                            {assignedFaculty.firstName} {assignedFaculty.lastName}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Unassigned</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {activity?.status ? (
                          <Badge
                            variant={
                              activity.status === "APPROVED"
                                ? "success"
                                : activity.status === "REJECTED"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {activity.status}
                          </Badge>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(assignment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openViewModal(assignment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(assignment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {assignedFaculty && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUnassignFaculty(assignment._id)}
                            disabled={actionLoading}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDeleteModal(assignment)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* CREATE Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Activity Assignment</DialogTitle>
            <DialogDescription>
              Assign a faculty member to review a student activity
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Select Activity *</Label>
              <Select
                value={selectedActivity}
                onValueChange={(value) => {
                  setSelectedActivity(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an activity..." />
                </SelectTrigger>
                <SelectContent>
                  {unassignedActivities.map((activity) => (
                    <SelectItem key={activity._id} value={activity._id}>
                      {activity.title} - {activity.studentId?.firstName}{" "}
                      {activity.studentId?.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Student will be auto-filled based on the selected activity
              </p>
            </div>

            <div>
              <Label>Assign Faculty (Optional)</Label>
              <Select
                value={selectedFaculty}
                onValueChange={setSelectedFaculty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a faculty member..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">None (Assign Later)</SelectItem>
                  {faculty.map((f) => (
                    <SelectItem key={f._id} value={f._id}>
                      {f.firstName} {f.lastName} - {f.department || "N/A"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateAssignment} disabled={actionLoading}>
              {actionLoading ? "Creating..." : "Create Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT/REASSIGN Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Faculty</DialogTitle>
            <DialogDescription>
              Change the faculty member assigned to this activity
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Activity</Label>
              <Input
                value={
                  currentAssignment
                    ? getActivityDetails(currentAssignment.activityId)?.title ||
                      "Unknown"
                    : ""
                }
                disabled
              />
            </div>

            <div>
              <Label>Select New Faculty *</Label>
              <Select
                value={selectedFaculty}
                onValueChange={setSelectedFaculty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a faculty member..." />
                </SelectTrigger>
                <SelectContent>
                  {faculty.map((f) => (
                    <SelectItem key={f._id} value={f._id}>
                      {f.firstName} {f.lastName} - {f.department || "N/A"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleReassignFaculty} disabled={actionLoading}>
              {actionLoading ? "Reassigning..." : "Reassign Faculty"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assignment Details</DialogTitle>
          </DialogHeader>

          {currentAssignment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Activity Title</Label>
                  <p className="font-medium">
                    {getActivityDetails(currentAssignment.activityId)?.title ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Student Name</Label>
                  <p className="font-medium">
                    {currentAssignment.studentId
                      ? `${currentAssignment.studentId.firstName} ${currentAssignment.studentId.lastName}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Assigned Faculty</Label>
                  <p className="font-medium">
                    {currentAssignment.facultyId
                      ? `${currentAssignment.facultyId.firstName} ${currentAssignment.facultyId.lastName}`
                      : "Unassigned"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Department</Label>
                  <p className="font-medium">
                    {currentAssignment.facultyId?.department || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created At</Label>
                  <p className="font-medium">
                    {new Date(currentAssignment.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Updated At</Label>
                  <p className="font-medium">
                    {new Date(currentAssignment.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Activity Status</Label>
                <p className="mt-1">
                  <Badge
                    variant={
                      getActivityDetails(currentAssignment.activityId)
                        ?.status === "APPROVED"
                        ? "success"
                        : "secondary"
                    }
                  >
                    {getActivityDetails(currentAssignment.activityId)?.status ||
                      "PENDING"}
                  </Badge>
                </p>
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

      {/* DELETE Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Assignment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this assignment? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          {currentAssignment && (
            <div className="py-4">
              <p className="text-sm">
                <strong>Activity:</strong>{" "}
                {getActivityDetails(currentAssignment.activityId)?.title || "N/A"}
              </p>
              <p className="text-sm mt-2">
                <strong>Student:</strong>{" "}
                {currentAssignment.studentId
                  ? `${currentAssignment.studentId.firstName} ${currentAssignment.studentId.lastName}`
                  : "N/A"}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCurrentAssignment(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAssignment}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
