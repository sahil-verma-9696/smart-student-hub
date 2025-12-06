import React from "react";

const StudentManagementContext = React.createContext({
  students: null,
});

export default StudentManagementContext;

export const useStudentManagementContext = () =>
  React.useContext(StudentManagementContext);
