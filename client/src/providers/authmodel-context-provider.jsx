import { useState } from "react";

const AuthModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <AuthModalContext.Provider value={{ open, setOpen }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export default AuthModalProvider;
