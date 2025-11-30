import AdminInstPageContext from "@/pages/admin-pages/context/admin-inst.context";
import InstituteAdminPage from "@/pages/admin-pages/components/institute-managment/page";
import useAdminInstPageLogic from "../hooks/useAdminInstPage.logic";

export default function AdminInstPageProvider() {
  const contextValue = useAdminInstPageLogic();
  return (
    <AdminInstPageContext.Provider value={contextValue}>
      <InstituteAdminPage />
    </AdminInstPageContext.Provider>
  );
}
