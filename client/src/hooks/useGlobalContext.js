import GlobalContext from "@/contexts/notification-context";
import { useContext } from "react";

const useGlobalContext = () => {
  return useContext(GlobalContext);
};
export default useGlobalContext;
