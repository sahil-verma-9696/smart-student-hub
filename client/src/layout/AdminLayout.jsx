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
} from "lucide-react";

const adminNavigation = [
  { name: "Dashboard", href: "/admin/", icon: Home },
  { name: "Student Panel", href: "/admin/add-student", icon: Users },
  { name: "Faculty Panel", href: "/admin/add-faculty", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
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
