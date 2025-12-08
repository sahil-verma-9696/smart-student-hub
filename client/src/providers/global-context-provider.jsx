import GlobalContext from "@/contexts/global-context";
import useGlobalData from "@/hooks/useGlobalData";

export default function GlobalContextProvider({ children }) {
  const contextValue = useGlobalData();
  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}
