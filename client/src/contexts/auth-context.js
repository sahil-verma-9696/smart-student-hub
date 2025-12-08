import { createContext } from "react";

const AuthContext = createContext({
  isUserAuthenticated: false,
  userRole: "",
  setIsUserAuthenticated: () => {},
  setUserRole: () => {},
  setUser: () => {},
  user: null,
});

export default AuthContext;
