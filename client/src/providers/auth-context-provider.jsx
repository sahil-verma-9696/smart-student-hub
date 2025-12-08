import AuthContext from "@/contexts/auth-context";
import useCheckAuthenticity from "@/hooks/useCheckAuthenticity";
import React, { useEffect, useState } from "react";

const AuthProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [user, setUser] = useState(null);

  /******************************************
   * Service Worker for pwa
   ********************************************/
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  useCheckAuthenticity({ setUser, setIsUserAuthenticated, setUserRole });

  /******************************************
   * Context Value
   ********************************************/
  const contextValue = {
    isUserAuthenticated,
    userRole,
    user,
    setIsUserAuthenticated,
    setUserRole,
    setUser,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
export default AuthProvider;
