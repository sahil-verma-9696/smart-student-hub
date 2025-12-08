import { createContext } from "react";

export const DashboardPageContext = createContext({
  activities: null,
  postActivity: () => {},
  fetchFilteredActivities: () => {},
});