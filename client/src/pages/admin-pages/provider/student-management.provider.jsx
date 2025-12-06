import React from "react";
import StudentManagementPage from "../components/student-management/page";
import StudentManagementContext from "../context/student-management.context";
import useStudentManagementData from "../hooks/useStudentManagementData";

export default function StudentManagementProvider() {
  const contextValue = useStudentManagementData();
  return (
    <StudentManagementContext.Provider value={contextValue}>
      <StudentManagementPage />
    </StudentManagementContext.Provider>
  );
}
