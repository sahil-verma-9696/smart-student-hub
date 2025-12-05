import { useCallback, useState } from "react";
import axios from "axios";
import { env } from "@/env/config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export function useActivityApprovalApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${env.SERVER_URL}/api/activities`, {
        params: { status: "PENDING" },
        headers: { ...getAuthHeaders() },
      });
      return Array.isArray(res.data) ? res.data : res.data?.data || res.data?.docs || res.data?.data?.docs || [];
    } catch (err) {
      console.error("Failed to fetch pending activities", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const approve = useCallback(async (id, { creditsEarned, remarks } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch(
        `${env.SERVER_URL}/api/activities/${id}`,
        { status: "APPROVED", creditsEarned, remarks },
        { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }
      );
      return res.data;
    } catch (err) {
      console.error("Failed to approve activity", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reject = useCallback(async (id, { reason } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch(
        `${env.SERVER_URL}/api/activities/${id}`,
        { status: "REJECTED", reason },
        { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }
      );
      return res.data;
    } catch (err) {
      console.error("Failed to reject activity", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchPending,
    approve,
    reject,
  };
}
