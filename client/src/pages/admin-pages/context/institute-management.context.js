import React from "react";

const InstituteManagementContext = React.createContext({
  instituteDetails: null,
  setInstituteDetails: () => {},
  updateInstituteDetails: () => {},
});

export default InstituteManagementContext;

export const useInstituteManagementContext = () =>
  React.useContext(InstituteManagementContext);
