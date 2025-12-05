import { useState } from "react";
import Navbar from "@/components/common/navbar";
import Sidebar from "@/components/common/sidebar";
import { Outlet } from "react-router";
import {
  Home,
  BarChart3,
  Settings,
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  ClipboardList,
  ListChecks,
} from "lucide-react";

const adminNavigation = [
  { name: "Dashboard", href: "/admin/", icon: Home },
  { name: "Students", href: "/admin/add-student", icon: GraduationCap },
  { name: "Faculty", href: "/admin/add-faculty", icon: Users },
  { name: "Assignments", href: "/admin/faculty-assignments", icon: Users },
  { name: "Programs", href: "/admin/programs", icon: BookOpen },
  { name: "Activity Types", href: "/admin/add-activity-type", icon: BookOpen },
  { name: "Activity Type Management", href: "/admin/activity-type-management", icon: ListChecks },
  { name: "Activity Assignments", href: "/admin/activity-assignment-management", icon: ClipboardList },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        navigationConfig={adminNavigation}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto min-w-0">
        <Navbar
          title={"Admin Dashboard"}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
