import { createContext } from "react";

export const ActivityPageContext = createContext({
  activities: null,
  postActivity: () => {},
});
