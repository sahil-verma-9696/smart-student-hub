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
  Tag,
} from "lucide-react";

const adminNavigation = [
  { name: "Dashboard", href: "/admin/", icon: Home },
  { name: "Student Panel", href: "/admin/student-management", icon: Users },
  { name: "Faculty Panel", href: "/admin/faculty-management", icon: Users },
  { name: "Activities", href: "/admin/activities", icon: Trophy },
  { name: "Activity Types", href: "/admin/activity-types", icon: Tag },
  // { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/institue", icon: Settings },
  // { name: "Settings", href: "/admin/settings", icon: Settings },
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
