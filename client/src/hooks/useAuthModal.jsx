import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <AuthModalContext.Provider value={{ open, setOpen }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);
