import React from "react";
import AdminPageContext from "../context/admin-page.context";
import AdminDashboardPage from "../components/admin-dashboard/page";
import useAdminInstPageLogic from "../hooks/useAdminInstPage.logic";

export default function AdminPageProvider() {
  const contextValue = useAdminInstPageLogic();
  return (
    <AdminPageContext value={contextValue}>
      <AdminDashboardPage />
    </AdminPageContext>
  );
}
