import AuthContext from "@/contexts/auth-context";
import { useState } from "react";

const AuthProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  /******************************************
   * Context Value
   ********************************************/
  const contextValue = {
    isUserAuthenticated,
    userRole,
    setIsUserAuthenticated,
    setUserRole,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
export default AuthProvider;
