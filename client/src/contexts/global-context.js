import { createContext, useContext } from "react";

const GlobalContext = createContext({
  institutePrograms: null,
  instituteDepartments: null,
  BACKEND_URL: null,
  INSITITUTE_ID: null,
});

export default GlobalContext;

export function useGlobalContext() {
  return useContext(GlobalContext);
}
