"use client";

import { useState, useMemo, useCallback } from "react";

import { Layers3 } from "lucide-react";
import ActivityFilters from "./activity-filters";
import ActivityTable from "./activity-table";
import { StatsCards } from "./status-cards";
import { mockActivities, mockFaculty } from "./constant";

export default function ActivityManagement() {
  const [activities, setActivities] = useState(mockActivities);
  const [filters, setFilters] = useState({
    search: "",
    categories: [],
    types: [],
    levels: [],
    durations: [],
    statuses: [],
    assignmentStatus: "all",
    departments: [],
    classes: [],
    years: [],
    semesters: [],
  });
  const [groupBy, setGroupBy] = useState("none");

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Search filter - now includes student name and roll number
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesActivity = activity.name
          .toLowerCase()
          .includes(searchLower);
        const matchesStudent =
          activity.student.name.toLowerCase().includes(searchLower) ||
          activity.student.rollNumber.toLowerCase().includes(searchLower);
        if (!matchesActivity && !matchesStudent) {
          return false;
        }
      }

      // Category filter
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(activity.category)
      ) {
        return false;
      }

      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(activity.type)) {
        return false;
      }

      // Level filter
      if (
        filters.levels.length > 0 &&
        !filters.levels.includes(activity.level)
      ) {
        return false;
      }

      // Duration filter
      if (
        filters.durations.length > 0 &&
        !filters.durations.includes(activity.duration)
      ) {
        return false;
      }

      // Status filter
      if (
        filters.statuses.length > 0 &&
        !filters.statuses.includes(activity.status)
      ) {
        return false;
      }

      // Assignment status filter
      if (
        filters.assignmentStatus === "assigned" &&
        !activity.assignedFacultyId
      ) {
        return false;
      }
      if (
        filters.assignmentStatus === "unassigned" &&
        activity.assignedFacultyId
      ) {
        return false;
      }

      if (
        filters.departments.length > 0 &&
        !filters.departments.includes(activity.student.department)
      ) {
        return false;
      }

      if (
        filters.classes.length > 0 &&
        !filters.classes.includes(activity.student.class)
      ) {
        return false;
      }

      if (
        filters.years.length > 0 &&
        !filters.years.includes(activity.student.year)
      ) {
        return false;
      }

      if (
        filters.semesters.length > 0 &&
        !filters.semesters.includes(activity.student.semester)
      ) {
        return false;
      }

      return true;
    });
  }, [activities, filters]);

  // Assign faculty to single activity
  const handleAssignFaculty = useCallback((activityId, facultyId) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId
          ? { ...activity, assignedFacultyId: facultyId }
          : activity
      )
    );
  }, []);

  // Bulk assign faculty to multiple activities
  const handleBulkAssign = useCallback((activityIds, facultyId) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activityIds.includes(activity.id)
          ? { ...activity, assignedFacultyId: facultyId }
          : activity
      )
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Layers3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Activity Management
              </h1>
            </div>
            <p className="text-muted-foreground">
              Group activities by category, student info and assign faculty
              members
            </p>
          </div>
        </div>

        {/* Stats */}
        <StatsCards activities={activities} faculty={mockFaculty} />

        {/* Filters */}
        <div className="bg-card border rounded-lg p-4">
          <ActivityFilters
            filters={filters}
            onFiltersChange={setFilters}
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
          />
        </div>

        {/* Table */}
        <div className="bg-card border rounded-lg p-4">
          <ActivityTable
            activities={filteredActivities}
            faculty={mockFaculty}
            groupBy={groupBy}
            onAssignFaculty={handleAssignFaculty}
            onBulkAssign={handleBulkAssign}
          />
        </div>
      </div>
    </div>
  );
}
