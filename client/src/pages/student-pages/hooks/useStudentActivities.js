import { useState, useEffect } from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import { useGlobalContext } from "@/contexts/global-context";

/**
 * Custom hook for fetching and managing student activities
 */
export default function useStudentActivities(studentId) {
  const [activities, setActivities] = useState([]);
  const [activityStats, setActivityStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuthContext();
  const { BACKEND_URL } = useGlobalContext();

  const targetId = studentId || user?._id;

  // Fetch all activities for the student
  const fetchActivities = async (filters = {}) => {
    if (!targetId || !BACKEND_URL) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("studentId", targetId);

      // Add filters if provided
      if (filters.title && filters.title !== "*") {
        params.set("title", filters.title);
      }
      if (filters.status && filters.status !== "all") {
        params.set("status", filters.status);
      }
      if (filters.activityTypeId && filters.activityTypeId !== "all") {
        params.set("activityTypeId", filters.activityTypeId);
      }

      const res = await fetch(`${BACKEND_URL}/activities?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch activities");

      const response = await res.json();
      setActivities(response.data || []);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch activity statistics
  const fetchActivityStats = async () => {
    if (!targetId || !BACKEND_URL) return;

    try {
      const res = await fetch(
        `${BACKEND_URL}/activities/stats?studentId=${targetId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch activity stats");

      const response = await res.json();
      setActivityStats(response.data);
    } catch (err) {
      console.error("Error fetching activity stats:", err);
    }
  };

  // Delete activity
  const deleteActivity = async (activityId) => {
    if (!BACKEND_URL) return;

    try {
      const res = await fetch(`${BACKEND_URL}/activities/${activityId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete activity");

      // Remove from local state
      setActivities((prev) => prev.filter((a) => a._id !== activityId));

      // Refresh stats
      fetchActivityStats();

      return true;
    } catch (err) {
      console.error("Error deleting activity:", err);
      throw err;
    }
  };

  // Update activity
  const updateActivity = async (activityId, updateData) => {
    if (!BACKEND_URL) return;

    try {
      const res = await fetch(`${BACKEND_URL}/activities/${activityId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error("Failed to update activity");

      const response = await res.json();

      // Update local state
      setActivities((prev) =>
        prev.map((a) => (a._id === activityId ? response.data : a))
      );

      return response.data;
    } catch (err) {
      console.error("Error updating activity:", err);
      throw err;
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    if (targetId && BACKEND_URL) {
      fetchActivities();
      fetchActivityStats();
    }
  }, [targetId, BACKEND_URL]);

  return {
    activities,
    activityStats,
    loading,
    error,
    fetchActivities,
    fetchActivityStats,
    deleteActivity,
    updateActivity,
    refetch: fetchActivities,
  };
}
