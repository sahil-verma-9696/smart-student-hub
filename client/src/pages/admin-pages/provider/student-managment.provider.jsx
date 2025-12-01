import React from "react";
import StudentManagementPage from "../components/student-managment/page";
import StudentManagmentContext from "../context/student-managment.context";

export default function StudentManagmentProvider() {
  return (
    <StudentManagmentContext.Provider>
      <StudentManagementPage />
    </StudentManagmentContext.Provider>
  );
}
