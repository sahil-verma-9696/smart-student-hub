import { ActivityPageContext } from "@/pages/student-pages/contexts/activity-page-context";
import React from "react";

export const useActivityPageContext = () =>
  React.useContext(ActivityPageContext);
