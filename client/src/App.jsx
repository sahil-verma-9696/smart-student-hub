import React from "react";

import { RouterProvider } from "react-router-dom";
import routes from "./routes/index.js";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";


import AuthProvider from "./providers/auth-context-provider.jsx";
import GlobalContextProvider from "./providers/global-context-provider.jsx";

const App = () => {
  return (
    <>
      <AuthProvider>
        <GlobalContextProvider>
          <RouterProvider router={routes} />
        </GlobalContextProvider>
      </AuthProvider>
    </>
  );
};

export default App;
