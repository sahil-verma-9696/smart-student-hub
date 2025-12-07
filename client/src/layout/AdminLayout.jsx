import Navbar from "@/components/common/navbar";
import Sidebar from "@/components/common/sidebar";
import { Outlet } from "react-router";
import {
  Home,
  Trophy,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  GraduationCap,
  Users,
  Building2,
} from "lucide-react";
import PATHS from "@/common/PATHS";

const adminNavigation = [
  { name: "Dashboard", href: "/admin/", icon: Home },
  { name: "Student Panel", href: "/admin/student-management", icon: Users },
  { name: "Faculty Panel", href: "/admin/faculty-management", icon: Users },
  { name: "Activities", href: "/admin/activities", icon: Trophy },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Institue", href: `/${PATHS.ADMIN.BASE}/${PATHS.ADMIN.INSTITUTE}`, icon: Building2 },
  { name: "Settings", href: `/${PATHS.ADMIN.BASE}/${PATHS.ADMIN.SETTINGS}`, icon: Settings },
];
const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar navigationConfig={adminNavigation} />
      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar title={"Admin Dashboard"} />
        <Outlet />
      </div>
    </div>
  );
};
export default AdminLayout;
