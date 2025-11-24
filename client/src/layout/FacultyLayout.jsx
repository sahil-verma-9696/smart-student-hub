import Navbar from "@/components/common/navbar";
import Sidebar from "@/components/common/sidebar";
import React from "react";
import { Outlet } from "react-router";
import {
  Home,
  Trophy,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Users,
  Award,
} from "lucide-react";

const navigationConfig = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Activities", href: "/activities", icon: Calendar },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];
const FacultyLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar navigationConfig={navigationConfig} />
      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar title={"Faculty Dashboard"} />
        <Outlet />
      </div>
    </div>
  );
};

export default FacultyLayout;
