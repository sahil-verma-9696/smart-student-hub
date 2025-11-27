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
  LinkIcon,
  Lock,
  Settings,
  Share,
  Share2,
  Share2Icon,
  Trophy,
  Upload,
} from "lucide-react";
import React from "react";
import { Outlet } from "react-router";
const studentNavigationConfig = [
  { name: "Scholar Window", href: "/student", icon: Home },
  { name: "Activities", href: "/student/activities", icon: Trophy },
  { name: "Fastfolo", href: "/student/fastfolo", icon: DockIcon },
  { name: "Mind Piolet", href: "/student/mind-piolet", icon: Brain },
  { name: "Private Vault", href: "/student/private-vault", icon: Lock },
  { name: "Settings", href: "/student/setting", icon: Settings },
  {
    name: "Profile",
    href: "/student/profile",
    icon: LinkIcon,
  },
];
const StudentLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar navigationConfig={studentNavigationConfig} />
      <div className="flex-1 flex flex-col overflow-auto">
        <Navbar title={"Scholar window"} />
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
