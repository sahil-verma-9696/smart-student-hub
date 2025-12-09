import React from "react";

const AdminPageContext = React.createContext({
  instituteStats: null,
  recentActivities: null,
});

export default AdminPageContext;

export const useAdminPageContext = () => React.useContext(AdminPageContext);
