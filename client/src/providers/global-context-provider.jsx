import GlobalContext from "@/contexts/global-context";
import useCheckAuthenticity from "@/hooks/useCheckAuthenticity";
import { useState } from "react";

const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useCheckAuthenticity();
  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
