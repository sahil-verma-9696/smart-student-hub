import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_SERVER_URL 
  || import.meta.env.VITE_API_BASE_URL 
  || 'http://localhost:3000';

export const useFacultyAssignments = () => {
  const [activities, setActivities] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Define activity types from backend enum
      const activityTypesList = [
        { _id: 'custom', name: 'Custom', key: 'custom' },
        { _id: 'workshop', name: 'Workshop', key: 'workshop' },
        { _id: 'hackathon', name: 'Hackathon', key: 'hackathon' },
        { _id: 'default', name: 'Default', key: 'default' },
      ];

      setActivityTypes(activityTypesList);

      // Get instituteId from localStorage or user context
      const instituteId = localStorage.getItem('instituteId') || '69290e999fe3149cdc284749';

      const [activitiesRes, facultyRes, assignmentsRes] = await Promise.all([
        axios.get(`${API_BASE}/activities`, config).catch(() => ({ data: [] })),
        axios.get(`${API_BASE}/faculty?instituteId=${instituteId}`, config).catch(() => ({ data: [] })),
        axios.get(`${API_BASE}/admin/assignment?instituteId=${instituteId}`, config).catch(() => ({ data: [] })),
      ]);

      // Debug: log raw responses to help diagnose missing data in UI
      try {
        // eslint-disable-next-line no-console
        console.debug('useFacultyAssignments: fetch responses', {
          activities: activitiesRes.data,
          faculty: facultyRes.data,
          assignments: assignmentsRes.data,
        });
      } catch (e) {
        // ignore logging errors
      }

      // Extract and filter activities
      let allActivities = Array.isArray(activitiesRes.data) ? activitiesRes.data : activitiesRes.data?.data || [];
      
      // Filter activities by institute if student data is populated
      allActivities = allActivities.filter(activity => {
        const studentInstitute = activity.student?.institute?._id || activity.student?.institute;
        return !studentInstitute || studentInstitute.toString() === instituteId.toString();
      });

      setActivities(allActivities);
      setFaculty(Array.isArray(facultyRes.data) ? facultyRes.data : facultyRes.data?.data || []);
      setAssignments(Array.isArray(assignmentsRes.data) ? assignmentsRes.data : assignmentsRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignmentMap = useMemo(() => {
    const map = new Map();
    assignments.forEach(a => {
      const actId = a.activityId?._id || a.activityId;
      map.set(actId, a);
    });
    return map;
  }, [assignments]);

  const facultyAssignmentCounts = useMemo(() => {
    const counts = new Map();
    assignments.forEach(a => {
      const facId = a.facultyId?._id || a.facultyId;
      counts.set(facId, (counts.get(facId) || 0) + 1);
    });
    return counts;
  }, [assignments]);

  const assignActivities = async (activityIds, facultyId) => {
    try {
      const token = localStorage.getItem('token');
      const instituteId = localStorage.getItem('instituteId') || '69290e999fe3149cdc284749';
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post(`${API_BASE}/admin/assignment/bulk`, {
        activityIds,
        facultyId,
        instituteId
      }, config);

      await fetchData();
      return { success: true };
    } catch (error) {
      console.error("Assignment failed:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  };

  const reassignActivity = async (activityId, newFacultyId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.patch(`${API_BASE}/admin/assignment/reassign`, {
        activityId,
        newFacultyId
      }, config);

      await fetchData();
      return { success: true };
    } catch (error) {
      console.error("Reassignment failed:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  };

  const unassignActivity = async (activityId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`${API_BASE}/admin/assignment/activity/${activityId}`, config);

      await fetchData();
      return { success: true };
    } catch (error) {
      console.error("Unassignment failed:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  };

  return {
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
  };
};
