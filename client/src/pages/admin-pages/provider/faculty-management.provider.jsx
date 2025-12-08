import React from "react";
import FacultyManagementPage from "../components/faculty-management/page";
import FacultyManagementContext from "../context/faculty-management.context";

export default function FacultyManagementProvider() {
  const contextValue = {};
  
  return (
    <FacultyManagementContext.Provider value={contextValue}>
      <FacultyManagementPage />
    </FacultyManagementContext.Provider>
  );
}
