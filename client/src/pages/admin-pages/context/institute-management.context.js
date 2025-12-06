import React from "react";

const InstituteManagementContext = React.createContext({
  students: null,
});

export default InstituteManagementContext;

export const useStudentManagementContext = () =>
  React.useContext(InstituteManagementContext);
