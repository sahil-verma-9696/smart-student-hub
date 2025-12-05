import { useCallback, useState } from "react";
import axios from "axios";
import { env } from "@/env/config";
import storageKeys from "@/common/storage-keys";

const getAuthHeaders = () => {
  const token = localStorage.getItem(storageKeys.accessToken) || localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export function useActivitiesApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${env.SERVER_URL}/api/activities`, {
        params,
        headers: { ...getAuthHeaders() },
      });
      return Array.isArray(res.data) ? res.data : res.data?.data || res.data?.docs || res.data?.data?.docs || [];
    } catch (err) {
      console.error("Failed to fetch activities", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createActivity = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${env.SERVER_URL}/api/activities`, payload, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });
      return res.data;
    } catch (err) {
      console.error("Failed to create activity", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateActivity = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch(`${env.SERVER_URL}/api/activities/${id}`, payload, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });
      return res.data;
    } catch (err) {
      console.error("Failed to update activity", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteActivity = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.delete(`${env.SERVER_URL}/api/activities/${id}`, {
        headers: { ...getAuthHeaders() },
      });
      return res.data;
    } catch (err) {
      console.error("Failed to delete activity", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity,
  };
}
