import React from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import storageKeys from "@/common/storage-keys";
import useAuthContext from "./useAuthContext";

export default function useRegisterInstitute() {
  /******************************************
   * variables
   ********************************************/
  const BASE_URL = import.meta.env.VITE_SERVER_URL;
  /******************************************
   * Local State for handling api call.
   ********************************************/
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  /******************************************
   * hooks invokation
   ********************************************/
  const navigate = useNavigate();

  /******************************************
   * Custom hooks invokation
   ********************************************/
  const { setIsUserAuthenticated, setUserRole, setUser } = useAuthContext();

  /******************************************
   * Functions
   ********************************************/

  /** Institute + Admin Registration */
  async function registerInstitute(payload) {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/institute/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const response = await res.json();

      if (!res.ok) {
        setLoading(false);
        toast.error(response.msg);
        throw new Error(response.message || "Registration failed");
      }

      setData(response.data);
      toast.success(response.msg);
      setIsUserAuthenticated(true);
      setUserRole(response.data.user?.role || "");
      setUser(response?.data?.user || {});

      localStorage.setItem(
        storageKeys.accessToken,
        response?.data?.token || ""
      );
      localStorage.setItem("user", JSON.stringify(response?.data?.user || {}));
      localStorage.setItem(
        storageKeys.userDetails,
        JSON.stringify(response?.data?.admin || {})
      );
      localStorage.setItem(
        storageKeys.instituteDetails,
        JSON.stringify(response?.data?.institute || {})
      );
      localStorage.setItem(
        storageKeys.userRole,
        response?.data?.user?.role || ""
      );
      const expiresMs = Number(response?.data?.expires_in ?? 0);
      localStorage.setItem(storageKeys.expiresAt, expiresMs + Date.now());
      console.log(response);

      if (response.data.user?.role === "admin") {
        navigate("/admin");
      }

      setLoading(false);
    } catch (err) {
      console.error("REQUEST ERROR:", err);
      setError(err);
      setLoading(false);
    }
  }

  return {
    registerInstitute,
    data,
    loading,
    error,
  };
}
