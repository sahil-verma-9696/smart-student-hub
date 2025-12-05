import React from "react";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/index.js";

import AuthProvider from "./providers/auth-context-provider.jsx";
import NotificationContextProvider from "./contexts/NotificationContext.jsx";

import useAuthContext from "./hooks/useAuthContext.js";

const AppContent = () => {
  const { user } = useAuthContext();
  console.log("Logged in user:", user);

  return <RouterProvider router={routes} />;
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationContextProvider>
        <AppContent />
      </NotificationContextProvider>
    </AuthProvider>
  );
};

export default App;
