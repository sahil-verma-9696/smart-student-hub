import { ActivityPageContext } from "@/contexts/activity-page-context";
import useActivitiesPageLogic from "@/hooks/useActivitiesPageLogic";
import ActivitiesPage from "@/pages/student-pages/activity/page";
import React from "react";

export default function ActivityPageProvider() {
  const pageLogic = useActivitiesPageLogic();
  return (
    <ActivityPageContext.Provider value={pageLogic}>
      <ActivitiesPage />
    </ActivityPageContext.Provider>
  );
}
