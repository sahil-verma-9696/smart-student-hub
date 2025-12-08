import { createContext, useContext } from "react";

const GlobalContext = createContext({
  institutePrograms: null,
  instituteDepartments: null,
  BACKEND_URL: null,
  INSITITUTE_ID: null,
  USER_ID: null,
  USER_ROLE: null,
});

export default GlobalContext;

export function useGlobalContext() {
  return useContext(GlobalContext);
}
