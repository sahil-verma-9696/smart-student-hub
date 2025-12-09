import React from "react";

const ActivityDetailContext = React.createContext({
  activity: null,
});

export default ActivityDetailContext;

export const useActivityDetailPageContext = () =>
  React.useContext(ActivityDetailContext);
