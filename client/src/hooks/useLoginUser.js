import React from "react";
import { useNavigate } from "react-router";
import useAuthContext from "./useAuthContext";
import useGlobalContext from "./useGlobalContext";

export default function useLoginUser() {
  const { setIsUserAuthenticated, setUserRole } = useAuthContext();
  const { setUser } = useGlobalContext();
  const navigate = useNavigate();

  /******************************************
   * API base URL
   ******************************************/
  const BASE_URL = "https://700d771d478e.ngrok-free.app";

  /******************************************
   * Local State
   ******************************************/
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  /******************************************
   * Function to login user
   ******************************************/
  async function loginUser(payload) {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/auth/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const response = await res.json();
      console.log("LOGIN API RESPONSE:", response);

      if (!res.ok) {
        throw new Error(response.message || "Login failed");
      }

      // Save response data locally
      setData(response.data);

      /******************************************
       * Update Auth Context
       ******************************************/
      setIsUserAuthenticated(true);
      setUserRole(response?.data?.user?.role || "");
      setUser(response?.data?.user || {});

      /******************************************
       * LocalStorage
       ******************************************/
      localStorage.setItem("token", response?.data?.token || "");
      localStorage.setItem("user", JSON.stringify(response?.data?.user || {}));
      localStorage.setItem("admin", JSON.stringify(response?.data?.admin || {}));
      localStorage.setItem(
        "institute",
        JSON.stringify(response?.data?.institute || {})
      );
      localStorage.setItem("role", response?.data?.user?.role || "");

      const expiresMs = Number(response?.data?.expires_in ?? 0);
      localStorage.setItem("expiresIn", expiresMs + Date.now());

      /******************************************
       * Redirect based on role
       ******************************************/
      if (response.data.user?.role === "admin") {
        navigate("/admin");
      } else if (response.data.user?.role === "student") {
        navigate("/student");
      } else if (response.data.user?.role === "institute") {
        navigate("/institute");
      }

      setLoading(false);
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err);
      setLoading(false);
    }
  }

  return {
    loginUser,
    data,
    loading,
    error,
  };
}
