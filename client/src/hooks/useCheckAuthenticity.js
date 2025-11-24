import { useCallback, useEffect } from "react";
import useAuthContext from "./useAuthContext";
import useGlobalContext from "./useGlobalContext";
import useAuthantication from "./useAuthantication";
import storageKeys from "@/common/storage-keys";

export default function useCheckAuthenticity() {
  const { isUserAuthenticated, setIsUserAuthenticated } = useAuthContext();
  const { user, setUser } = useGlobalContext();
  const { logout } = useAuthantication();

  /******************************************
   * Fetch localStorage values
   ******************************************/
  const accessToken = localStorage.getItem(storageKeys.accessToken);
  const storedUserRole = localStorage.getItem(storageKeys.userRole);
  const expiresAt = Number(localStorage.getItem(storageKeys.expiresAt)); // ms timestamp
  const now = Date.now();

  /******************************************
   * Validate token with backend
   ******************************************/
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const payload = await res.json();
      setUser(payload.data);
      setIsUserAuthenticated(true);

      return payload.data;
    } catch (err) {
      console.error(err);
      logout();
      return null;
    }
  }, [accessToken, logout, setIsUserAuthenticated, setUser]);

  /******************************************
   * Main Auth Validation Logic
   ******************************************/
  const validateAuth = useCallback(() => {
    // 1️⃣ No token → logout immediately
    if (!accessToken) {
      logout();
      return;
    }

    // 2️⃣ Check expiry time
    if (!expiresAt || now >= expiresAt) {
      logout();
      return;
    }

    // 3️⃣ Token exists & valid time → verify with backend
    fetchUser();
  }, [accessToken, expiresAt, fetchUser, logout, now]);

  /******************************************
   * Run on reload + page mount
   ******************************************/
  useEffect(() => {
    validateAuth();
  }, [validateAuth]);

  /******************************************
   * Run whenever route changes
   ******************************************/
  useEffect(() => {
    validateAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  /******************************************
   * Auto logout when token expires (timer)
   ******************************************/
  useEffect(() => {
    if (!expiresAt) return;

    const timeout = expiresAt - Date.now();
    if (timeout <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
    }, timeout);

    return () => clearTimeout(timer);
  }, [expiresAt, logout]);

  /******************************************
   * Detect token removal from other tabs
   ******************************************/
  useEffect(() => {
    const syncLogout = (e) => {
      if (e.key === storageKeys.accessToken && !e.newValue) {
        logout();
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  /******************************************
   * Return states
   ******************************************/
  return {
    isUserAuthenticated,
    user,
  };
}
