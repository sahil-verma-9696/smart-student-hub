import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Filter, UserCheck, Users, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import axios from 'axios';
import { useActivitiesApi } from "@/hooks/useActivitiesApi";

const API_BASE = import.meta.env.VITE_SERVER_URL 
  || import.meta.env.VITE_API_BASE_URL 
  || 'http://localhost:3000';

const FacultyAssignmentsPage = () => {
  // Data states
  const [activities, setActivities] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [assignments, setAssignments] = useState([]); // activityId -> facultyId mapping
  const [loading, setLoading] = useState(true);
  const { fetchActivities } = useActivitiesApi();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("all"); // "all", "assigned", "unassigned"
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");

  // Selection states
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedFacultyForAssign, setSelectedFacultyForAssign] = useState("");

  // Faculty view state
  const [viewFacultyDialogOpen, setViewFacultyDialogOpen] = useState(false);
  const [selectedFacultyToView, setSelectedFacultyToView] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 1) Fetch activity types first (robustly), so the filter dropdown is populated immediately
      let activityTypesList = [];
      try {
        const tokenHeader = token ? { Authorization: `Bearer ${token}` } : {};
        const tryUrls = [`${API_BASE}/api/activity-types`, `${API_BASE}/activity-types`];
        for (const url of tryUrls) {
          try {
            const res = await fetch(url, { headers: tokenHeader });
            if (!res.ok) continue;
            const data = await res.json();
            const types = Array.isArray(data)
              ? data
              : Array.isArray(data.data)
              ? data.data
              : Array.isArray(data.docs)
              ? data.docs
              : Array.isArray(data.data?.docs)
              ? data.data.docs
              : [];
            if (types.length) {
              activityTypesList = types;
              break;
            }
          } catch (err) {
            // ignore and try next URL
          }
        }
      } catch (err) {
        console.error('Failed to fetch activity types', err);
      }

      // Normalize activity type objects (ensure at least _id and name/title presence)
      activityTypesList = activityTypesList.map(t => ({
        _id: t._id || t.id || (t._id && t._id.toString && t._id.toString()),
        name: t.name || t.title || t.key || t.name,
        key: t.key,
        raw: t,
      }));

      setActivityTypes(activityTypesList);

      // 2) Now fetch activities, faculty and assignments in parallel
      const [activitiesList, facultyRes, assignmentsRes] = await Promise.all([
        fetchActivities(),
        axios.get(`${API_BASE}/api/faculty`, config),
        axios.get(`${API_BASE}/api/assignment`, config),
      ]);
      setActivities(Array.isArray(activitiesList) ? activitiesList : []);
      setFaculty(Array.isArray(facultyRes.data) ? facultyRes.data : facultyRes.data?.data || []);
      setAssignments(Array.isArray(assignmentsRes.data) ? assignmentsRes.data : assignmentsRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a map of activityId -> assignment for quick lookup
  const assignmentMap = useMemo(() => {
    const map = new Map();
    assignments.forEach(a => {
      const actId = a.activityId?._id || a.activityId;
      map.set(actId, a);
    });
    return map;
  }, [assignments]);

  // Get faculty assignment counts
  const facultyAssignmentCounts = useMemo(() => {
    const counts = new Map();
    assignments.forEach(a => {
      const facId = a.facultyId?._id || a.facultyId;
      counts.set(facId, (counts.get(facId) || 0) + 1);
    });
    return counts;
  }, [assignments]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Search filter
      const searchMatch = 
        activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.student?.basicUserDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!searchMatch) return false;

      // Assignment filter
      const isAssigned = assignmentMap.has(activity._id);
      if (assignmentFilter === "assigned" && !isAssigned) return false;
      if (assignmentFilter === "unassigned" && isAssigned) return false;

      // Activity type filter
      if (activityTypeFilter !== "all") {
        const actTypeId = activity.activityType?._id || activity.activityType;
        if (actTypeId !== activityTypeFilter) return false;
      }

      return true;
    });
  }, [activities, searchTerm, assignmentFilter, activityTypeFilter, assignmentMap]);

  // Handle activity selection
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

  // Assign selected activities to faculty
  const handleAssignToFaculty = async () => {
    if (!selectedFacultyForAssign || selectedActivities.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post(`${API_BASE}/api/assignment/bulk`, {
        activityIds: selectedActivities,
        facultyId: selectedFacultyForAssign
      }, config);

      setAssignDialogOpen(false);
      setSelectedActivities([]);
      setSelectedFacultyForAssign("");
      fetchData();
    } catch (error) {
      console.error("Assignment failed:", error);
      alert(`Assignment failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Reassign a single activity
  const handleReassign = async (activityId, newFacultyId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`${API_BASE}/api/assignment/activity/${activityId}`, {
        facultyId: newFacultyId
      }, config);

      fetchData();
    } catch (error) {
      console.error("Reassignment failed:", error);
      alert(`Reassignment failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Get activities assigned to a specific faculty
  const getActivitiesForFaculty = (facultyId) => {
    return assignments
      .filter(a => (a.facultyId?._id || a.facultyId) === facultyId)
      .map(a => a.activityId)
      .filter(Boolean);
  };

  // Get faculty name by id
  const getFacultyName = (assignment) => {
    if (assignment?.facultyId?.basicUserDetails?.name) {
      return assignment.facultyId.basicUserDetails.name;
    }
    const fac = faculty.find(f => f._id === (assignment?.facultyId?._id || assignment?.facultyId));
    return fac?.basicUserDetails?.name || 'Unknown';
  };

  // Get activity type name
  const getActivityTypeName = (activity) => {
    if (activity?.activityType?.name) return activity.activityType.name;
    const at = activityTypes.find(t => t._id === (activity?.activityType?._id || activity?.activityType));
    return at?.name || 'Unknown';
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Activities</p>
              <p className="text-2xl font-bold">{activities.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assigned</p>
              <p className="text-2xl font-bold">{assignments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <XCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unassigned</p>
              <p className="text-2xl font-bold">{activities.length - assignments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Faculty</p>
              <p className="text-2xl font-bold">{faculty.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activities List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by title or student..." 
                    className="pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Activity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {activityTypes.map(type => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selection Actions */}
              {selectedActivities.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">
                    {selectedActivities.length} selected
                  </span>
                  <Button 
                    size="sm" 
                    onClick={() => setAssignDialogOpen(true)}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Assign to Faculty
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setSelectedActivities([])}
                  >
                    Clear
                  </Button>
                </div>
              )}

              {/* Select All */}
              <div className="flex items-center gap-2 pb-2 border-b">
                <Checkbox 
                  checked={selectedActivities.length === filteredActivities.length && filteredActivities.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  Select All ({filteredActivities.length})
                </span>
              </div>

              {/* Activities List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredActivities.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No activities found</p>
                ) : (
                  filteredActivities.map(activity => {
                    const assignment = assignmentMap.get(activity._id);
                    const isAssigned = !!assignment;

                    return (
                      <div 
                        key={activity._id} 
                        className={`flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
                          selectedActivities.includes(activity._id) ? 'bg-muted border-primary' : ''
                        }`}
                      >
                        <Checkbox 
                          checked={selectedActivities.includes(activity._id)}
                          onCheckedChange={() => toggleActivitySelection(activity._id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{activity.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {getActivityTypeName(activity)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            Student: {activity.student?.basicUserDetails?.name || 'Unknown'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAssigned ? (
                            <>
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                {getFacultyName(assignment)}
                              </Badge>
                              <Select 
                                value="" 
                                onValueChange={(newFacId) => handleReassign(activity._id, newFacId)}
                              >
                                <SelectTrigger className="w-[120px] h-8">
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  <span className="text-xs">Reassign</span>
                                </SelectTrigger>
                                <SelectContent>
                                  {faculty.map(f => (
                                    <SelectItem key={f._id} value={f._id}>
                                      {f.basicUserDetails?.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </>
                          ) : (
                            <Badge variant="outline" className="bg-orange-50 text-orange-600">
                              Unassigned
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Faculty Overview */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Faculty Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {faculty.map(f => {
                  const count = facultyAssignmentCounts.get(f._id) || 0;
                  return (
                    <div 
                      key={f._id} 
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedFacultyToView(f);
                        setViewFacultyDialogOpen(true);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{f.basicUserDetails?.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {f.department || 'No department'} • {f.designation || 'Faculty'}
                          </p>
                        </div>
                        <Badge variant={count > 0 ? "default" : "secondary"}>
                          {count} {count === 1 ? 'Activity' : 'Activities'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Activities to Faculty</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Assigning {selectedActivities.length} {selectedActivities.length === 1 ? 'activity' : 'activities'}
            </p>
            <Select value={selectedFacultyForAssign} onValueChange={setSelectedFacultyForAssign}>
              <SelectTrigger>
                <SelectValue placeholder="Select Faculty" />
              </SelectTrigger>
              <SelectContent>
                {faculty.map(f => (
                  <SelectItem key={f._id} value={f._id}>
                    <div className="flex items-center gap-2">
                      <span>{f.basicUserDetails?.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {facultyAssignmentCounts.get(f._id) || 0} assigned
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssignToFaculty}
              disabled={!selectedFacultyForAssign}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Faculty Activities Dialog */}
      <Dialog open={viewFacultyDialogOpen} onOpenChange={setViewFacultyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Activities Assigned to {selectedFacultyToView?.basicUserDetails?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 max-h-[400px] overflow-y-auto">
            {selectedFacultyToView && (
              <>
                {getActivitiesForFaculty(selectedFacultyToView._id).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No activities assigned to this faculty
                  </p>
                ) : (
                  <div className="space-y-2">
                    {getActivitiesForFaculty(selectedFacultyToView._id).map(activity => (
                      <div key={activity._id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{activity.title}</span>
                          <p className="text-sm text-muted-foreground">
                            {getActivityTypeName(activity)} • {activity.student?.basicUserDetails?.name}
                          </p>
                        </div>
                        <Select 
                          value="" 
                          onValueChange={(newFacId) => {
                            handleReassign(activity._id, newFacId);
                            setViewFacultyDialogOpen(false);
                          }}
                        >
                          <SelectTrigger className="w-[130px]">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            <span className="text-xs">Reassign</span>
                          </SelectTrigger>
                          <SelectContent>
                            {faculty
                              .filter(f => f._id !== selectedFacultyToView._id)
                              .map(f => (
                                <SelectItem key={f._id} value={f._id}>
                                  {f.basicUserDetails?.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewFacultyDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacultyAssignmentsPage;
