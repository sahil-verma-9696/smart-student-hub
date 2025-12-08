import React from "react";
import { InstituteManagementPage } from "../components/institute-management/page";
import InstituteManagementContext from "../context/institute-management.context";
import useInstituteManagementData from "../hooks/useInstituteManagementData";

export default function InstituteManagementProvider() {
  const contextValue = useInstituteManagementData();
  return (
    <InstituteManagementContext.Provider value={contextValue}>
      <InstituteManagementPage />
    </InstituteManagementContext.Provider>
  );
}
