import storageKeys from "@/common/storage-keys";
import React from "react";
import useAuthContext from "./useAuthContext";
import toast from "react-hot-toast";

export default function useAuthantication() {
  /******************************************
   * Local State for handling api call.
   ********************************************/
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  /******************************************
   * variables
   ********************************************/
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  /******************************************
   * hooks invokation
   ********************************************/
  // const navigate = useNavigate();

  /******************************************
   * Custom hooks invokation
   ********************************************/
  const { setIsUserAuthenticated, setUserRole, setUser } = useAuthContext();

  /******************************************
   * Functions
   ********************************************/
  async function login(payload) {
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
        setLoading(false);
        throw new Error(response?.msg || "Login failed");
      }

      setLoading(false);
      toast.success(response?.msg);

      // Save response data locally
      setData(response?.data);

      /******************************************
       * Update Auth Context
       * ******************************************/
      setIsUserAuthenticated(true);
      setUserRole(response?.data?.user?.role || "");
      setUser(response?.data?.user || {});

      localStorage.setItem(
        storageKeys.accessToken,
        response?.data?.token || ""
      );
      localStorage.setItem("user", JSON.stringify(response?.data?.user || {}));
      localStorage.setItem(
        storageKeys.userDetails,
        JSON.stringify(response?.data?.user || {})
      );
      localStorage.setItem(
        storageKeys.userRole,
        response?.data?.user?.role || ""
      );

      const expiresMs = Number(response?.data?.expires_in ?? 0);
      localStorage.setItem(storageKeys.expiresAt, expiresMs + Date.now());

      setLoading(false);

      window.location.href = `/${response?.data?.user?.role?.toLowerCase()}`;
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err.message);
      setError(err.message);
    }
  }

  /***************** logout *************************/
  async function logout() {
    // const res = await fetch(`${BASE_URL}/user/logout`, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem(
    //       storageKeys.accessToken
    //     )}`,
    //   },
    // });
    // if (res.ok) {
    //   navigate("/");
    //   setUser(null);
    // }

    localStorage.removeItem(storageKeys.accessToken);
    localStorage.removeItem(storageKeys.userRole);
    localStorage.removeItem(storageKeys.userDetails);
    localStorage.removeItem(storageKeys.instituteDetails);
    localStorage.removeItem(storageKeys.userRole);
    localStorage.removeItem(storageKeys.expiresAt);
    setIsUserAuthenticated(false);
    setUserRole("");
    setUser(null);
    window.location.href = "/";
    toast.success("Logout successful");
  }
  return {
    login,
    logout,
    data,
    loading,
    error,
  };
}
