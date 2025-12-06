import React from "react";

import { RouterProvider } from "react-router-dom";
import routes from "./routes/index.js";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import AuthProvider from "./providers/auth-context-provider.jsx";
import NotificationProvider from "./providers/notification-context-provider.jsx";
import GlobalContextProvider from "./providers/global-context-provider.jsx";

const App = () => {
  return (
    <>
      <AuthProvider>
        <NotificationProvider>
          <GlobalContextProvider>
            <RouterProvider router={routes} />
          </GlobalContextProvider>
        </NotificationProvider>
      </AuthProvider>
    </>
  );
};

export default App;
