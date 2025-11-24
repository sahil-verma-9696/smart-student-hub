import GlobalContext from "@/contexts/global-context";


const GlobalContextProvider = ({ children }) => {
  return (
    <GlobalContext.Provider value={{ }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
