import { useCallback, useEffect } from "react";
import storageKeys from "@/common/storage-keys";
import toast from "react-hot-toast";

export default function useCheckAuthenticity({
  setUser,
  setIsUserAuthenticated,
  setUserRole,
}) {
  /******************************************
   * Fetch localStorage values
   ******************************************/
  const accessToken = localStorage.getItem(storageKeys.accessToken);
  const storedUserRole = localStorage.getItem(storageKeys.userRole);
  const expiresAt = Number(localStorage.getItem(storageKeys.expiresAt)); // ms timestamp
  const now = Date.now();

  /******************************************
   * Run on reload + page mount + whenever route changes
   ******************************************/
  useEffect(() => {
    // 1️⃣ No token → if not on home, redirect; else stay quiet
    if (!accessToken) {
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
      return;
    }

    // 2️⃣ token expired → if not on home, redirect; else stay quiet
    if (!expiresAt || now >= expiresAt) {
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
      return;
    }

    // 3️⃣ Token exists & valid time → verify with backend
    (async () => {
      try {
        // Resolve server URL robustly: prefer VITE_SERVER_URL, then VITE_API_BASE_URL, then fallback to origin
        const envServer = import.meta.env.VITE_SERVER_URL;
        const envApiBase = import.meta.env.VITE_API_BASE_URL;
        const candidate = envServer || envApiBase || window.location.origin;
        const serverUrl = String(candidate).replace(/"/g, '').trim();

        if (!serverUrl || serverUrl === 'undefined') {
          console.warn('useCheckAuthenticity: VITE_SERVER_URL not set; defaulting to window.location.origin');
        }

        const res = await fetch(`${serverUrl.replace(/\/$/, '')}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        // 4️⃣ Invalid token → redirect to home
        if (!res.ok) {
          // Avoid noisy toast on landing page; only show when navigating protected routes
          if (window.location.pathname !== "/") {
            toast.error("Unauthorized access");
            window.location.href = "/";
          }
          return;
        }

        const payload = await res.json();

        const userInfo = payload?.data?.userData;
        const userRole = userInfo?.role;

        // 5️⃣ Valid token → set user state + update auth status + role
        setUser(payload?.data?.userData);
        setIsUserAuthenticated(true);
        setUserRole(payload?.data?.userData?.role);

        // 6️⃣ Valid token but invalid role → redirect to valid route
        switch (userRole) {
          case "admin":
            if (
              window.location.pathname.toString().startsWith("/student") ||
              window.location.pathname.toString().startsWith("/faculty")
            )
              window.location.href = "/admin";
            break;

          case "student":
            if (
              window.location.pathname.toString().startsWith("/admin") ||
              window.location.pathname.toString().startsWith("/faculty")
            )
              window.location.href = "/student";
            break;

          case "faculty":
            if (
              window.location.pathname.toString().startsWith("/student") ||
              window.location.pathname.toString().startsWith("/admin")
            )
              window.location.href = "/faculty";
            break;

          default:
            if (window.location.pathname !== "/") window.location.href = "/";
            break;
        }
      } catch (err) {
        console.error(err);
        if (window.location.pathname !== "/") window.location.href = "/";
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  /******************************************
   * Auto logout when token expires (timer)
   ******************************************/
  useEffect(() => {
    if (!expiresAt) return;

    const timeout = expiresAt - Date.now();
    if (timeout <= 0) {
      if (window.location.pathname !== "/") window.location.href = "/";
      return;
    }

    const timer = setTimeout(() => {
      if (window.location.pathname !== "/") window.location.href = "/";
    }, timeout);

    return () => clearTimeout(timer);
  }, [expiresAt]);

  /******************************************
   * Detect token removal from other tabs
   ******************************************/
  useEffect(() => {
    const syncLogout = (e) => {
      if (e.key === storageKeys.accessToken && !e.newValue) {
        if (window.location.pathname !== "/") window.location.href = "/";
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);
}
