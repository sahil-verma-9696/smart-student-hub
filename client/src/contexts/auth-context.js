import { createContext } from "react";

const AuthContext = createContext({
  isUserAuthenticated: false,
  userRole: "",
  setIsUserAuthenticated: () => {},
  setUserRole: () => {},
});

export default AuthContext;
