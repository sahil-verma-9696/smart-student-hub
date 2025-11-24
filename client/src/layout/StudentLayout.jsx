import Navbar from "@/components/common/navbar";
import Sidebar from "@/components/common/sidebar";
import {
  Award,
  BarChart3,
  Bolt,
  Brain,
  Calendar,
  DockIcon,
  FileText,
  Home,
  Lock,
  Settings,
  Share,
  Trophy,
} from "lucide-react";
import React from "react";
import { Outlet } from "react-router";
const studentNavigationConfig = [
  { name: "Scholar Window", href: "/student", icon: Home },
  { name: "Activities", href: "/student/updocs", icon: Calendar },
  { name: "Fastfolo", href: "/student/fastfolo", icon: DockIcon },
  { name: "Mind Piolet", href: "/student/mind-piolet", icon: Brain },
  { name: "Share Achivos", href: "/student/share-achivos", icon: Share },
  { name: "Private Vault", href: "/student/private-vault", icon: Lock },
  { name: "Settings", href: "/student/setting", icon: Settings },
];
const StudentLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar navigationConfig={studentNavigationConfig} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={"Scholar window"} />
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
