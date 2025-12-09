import ActivityDetailPage from "@/components/activity-details-page";
import ActivityDetailContext from "@/contexts/activity-context";
import useActivityDetailsPageLogic from "@/hooks/useActivityDetailsPageLogic";
import React from "react";

export default function ActivityDetailsPageProvider() {
  const contextValue = useActivityDetailsPageLogic();
  return (
    <ActivityDetailContext.Provider value={contextValue}>
      <ActivityDetailPage />
    </ActivityDetailContext.Provider>
  );
}
