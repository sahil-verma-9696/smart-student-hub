import { GlobalContext } from "@/contexts/Global";
import { useContext } from "react";

const useGlobalContext = () => {
  return useContext(GlobalContext);
};
export default useGlobalContext;
