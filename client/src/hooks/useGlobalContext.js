import GlobalContext from "@/contexts/global-context";
import { useContext } from "react";

const useGlobalContext = () => {
  return useContext(GlobalContext);
};
export default useGlobalContext;
