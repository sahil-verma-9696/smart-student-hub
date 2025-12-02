import React from "react";
import StudentManagementPage from "../components/student-management/page";
import StudentManagementContext from "../context/student-management.context";

export default function StudentManagementProvider() {
  const contextValue = {};
  
  return (
    <StudentManagementContext.Provider value={contextValue}>
      <StudentManagementPage />
    </StudentManagementContext.Provider>
  );
}
