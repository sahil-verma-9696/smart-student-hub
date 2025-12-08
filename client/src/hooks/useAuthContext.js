import AuthContext from "@/contexts/auth-context";
import { useContext } from "react";

const useAuthContext = () => {
  return useContext(AuthContext);
};

export default useAuthContext;
