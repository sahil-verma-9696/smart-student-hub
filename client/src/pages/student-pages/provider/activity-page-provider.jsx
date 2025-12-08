import { ActivityPageContext } from "@/pages/student-pages/contexts/activity-page-context";
import useActivitiesPageLogic from "@/pages/student-pages/hooks/useActivitiesPageLogic";
import ActivitiesPage from "@/pages/student-pages/components/activity-management/page";
import React from "react";

export default function ActivityPageProvider() {
  const pageLogic = useActivitiesPageLogic();
  return (
    <ActivityPageContext.Provider value={pageLogic}>
      <ActivitiesPage />
    </ActivityPageContext.Provider>
  );
}
