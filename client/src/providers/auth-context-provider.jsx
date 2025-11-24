import AuthContext from "@/contexts/auth-context";
import useCheckAuthenticity from "@/hooks/useCheckAuthenticity";
import { useState } from "react";

const AuthProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [user, setUser] = useState(null);

  useCheckAuthenticity({ setUser, setIsUserAuthenticated, setUserRole });

  /******************************************
   * Context Value
   ********************************************/
  const contextValue = {
    isUserAuthenticated,
    userRole,
    setIsUserAuthenticated,
    setUserRole,
    user,
    setUser,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
export default AuthProvider;
