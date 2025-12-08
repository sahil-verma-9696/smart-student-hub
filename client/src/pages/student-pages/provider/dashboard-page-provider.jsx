import { ActivityPageContext } from "@/pages/student-pages/contexts/activity-page-context";
import useActivitiesPageLogic from "@/pages/student-pages/hooks/useActivitiesPageLogic";import React from "react";
import { DashboardPageContext } from "../contexts/dasboard-page-context";

export default function DashboardPageProvider() {
  const pageLogic = useActivitiesPageLogic();
  return (
    <DashboardPageContext.Provider value={pageLogic}>
      <ActivitiesPage />
    </DashboardPageContext.Provider>
  );
}
