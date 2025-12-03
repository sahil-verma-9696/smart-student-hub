import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { StatsCards } from "./components/StatsCards";
import { ActivitiesList } from "./components/ActivitiesList";
import { FacultyOverview } from "./components/FacultyOverview";
import { AssignDialog } from "./components/AssignDialog";
import { ViewFacultyDialog } from "./components/ViewFacultyDialog";
import { useFacultyAssignments } from "./hooks/useFacultyAssignments";

const FacultyAssignmentsPage = () => {
  const {
    activities,
    activityTypes,
    faculty,
    assignments,
    loading,
    assignmentMap,
    facultyAssignmentCounts,
    fetchData,
    assignActivities,
    reassignActivity,
    unassignActivity,
  } = useFacultyAssignments();

  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedFacultyForAssign, setSelectedFacultyForAssign] = useState("");
  const [viewFacultyDialogOpen, setViewFacultyDialogOpen] = useState(false);
  const [selectedFacultyToView, setSelectedFacultyToView] = useState(null);

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const searchMatch = 
        activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.student?.basicUserDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!searchMatch) return false;

      const isAssigned = assignmentMap.has(activity._id);
      if (assignmentFilter === "assigned" && !isAssigned) return false;
      if (assignmentFilter === "unassigned" && isAssigned) return false;

      if (activityTypeFilter !== "all") {
        const actTypeId = activity.activityType?._id || activity.activityType;
        if (actTypeId !== activityTypeFilter) return false;
      }

      return true;
    });
  }, [activities, searchTerm, assignmentFilter, activityTypeFilter, assignmentMap]);

  const toggleActivitySelection = (activityId) => {
    setSelectedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedActivities.length === filteredActivities.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(filteredActivities.map(a => a._id));
    }
  };

  const handleAssignToFaculty = async () => {
    if (!selectedFacultyForAssign || selectedActivities.length === 0) return;

    const result = await assignActivities(selectedActivities, selectedFacultyForAssign);
    
    if (result.success) {
      setAssignDialogOpen(false);
      setSelectedActivities([]);
      setSelectedFacultyForAssign("");
    } else {
      alert(`Assignment failed: ${result.error}`);
    }
  };

  const handleReassign = async (activityId, newFacultyId) => {
    const result = await reassignActivity(activityId, newFacultyId);
    
    if (!result.success) {
      alert(`Reassignment failed: ${result.error}`);
    }
  };

  const handleUnassign = async (activityId) => {
    const result = await unassignActivity(activityId);
    
    if (!result.success) {
      alert(`Unassignment failed: ${result.error}`);
    }
  };

  const getActivitiesForFaculty = (facultyId) => {
    return assignments
      .filter(a => (a.facultyId?._id || a.facultyId) === facultyId)
      .map(a => a.activityId)
      .filter(Boolean);
  };

  const getFacultyName = (assignment) => {
    if (assignment?.facultyId?.basicUserDetails?.name) {
      return assignment.facultyId.basicUserDetails.name;
    }
    const fac = faculty.find(f => f._id === (assignment?.facultyId?._id || assignment?.facultyId));
    return fac?.basicUserDetails?.name || 'Unknown';
  };

  const getActivityTypeName = (activity) => {
    if (activity?.activityType?.name) return activity.activityType.name;
    const typeValue = activity?.activityType?._id || activity?.activityType;
    if (!typeValue) return 'Unknown';
    const at = activityTypes.find(t => t._id === typeValue || t.key === typeValue);
    return at?.name || (typeof typeValue === 'string' ? typeValue.charAt(0).toUpperCase() + typeValue.slice(1) : 'Unknown');
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Faculty Assignments</h1>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards
        activities={activities}
        assignments={assignments}
        faculty={faculty}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activities List */}
        <div className="lg:col-span-2 space-y-4">
          <ActivitiesList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            assignmentFilter={assignmentFilter}
            setAssignmentFilter={setAssignmentFilter}
            activityTypeFilter={activityTypeFilter}
            setActivityTypeFilter={setActivityTypeFilter}
            activityTypes={activityTypes}
            selectedActivities={selectedActivities}
            setSelectedActivities={setSelectedActivities}
            onOpenAssignDialog={() => setAssignDialogOpen(true)}
            filteredActivities={filteredActivities}
            toggleSelectAll={toggleSelectAll}
            toggleActivitySelection={toggleActivitySelection}
            assignmentMap={assignmentMap}
            getFacultyName={getFacultyName}
            getActivityTypeName={getActivityTypeName}
            faculty={faculty}
            onReassign={handleReassign}
            onUnassign={handleUnassign}
          />
        </div>

        {/* Faculty Overview */}
        <div className="space-y-4">
          <FacultyOverview
            faculty={faculty}
            facultyAssignmentCounts={facultyAssignmentCounts}
            onFacultyClick={(f) => {
              setSelectedFacultyToView(f);
              setViewFacultyDialogOpen(true);
            }}
          />
        </div>
      </div>

      {/* Assign Dialog */}
      <AssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        selectedActivities={selectedActivities}
        selectedFaculty={selectedFacultyForAssign}
        setSelectedFaculty={setSelectedFacultyForAssign}
        faculty={faculty}
        facultyAssignmentCounts={facultyAssignmentCounts}
        onAssign={handleAssignToFaculty}
      />

      {/* View Faculty Activities Dialog */}
      <ViewFacultyDialog
        open={viewFacultyDialogOpen}
        onOpenChange={setViewFacultyDialogOpen}
        selectedFaculty={selectedFacultyToView}
        activities={selectedFacultyToView ? getActivitiesForFaculty(selectedFacultyToView._id) : []}
        faculty={faculty}
        getActivityTypeName={getActivityTypeName}
        onReassign={handleReassign}
        onUnassign={handleUnassign}
      />
    </div>
  );
};

export default FacultyAssignmentsPage;
