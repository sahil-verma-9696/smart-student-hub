import { createContext, useContext } from "react";

const GlobalContext = createContext({
  user: null,
  setUser: () => {},
});

export default GlobalContext;
