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
  Trophy,
  Upload,
} from "lucide-react";
import React from "react";
import { Outlet } from "react-router";
const studentNavigationConfig = [
  { name: "Scholar Window", href: "/student", icon: Home },
  { name: "Up Docs", href: "/student/updocs", icon: Upload },
  { name: "Fastfolo", href: "/student/fastfolo", icon: DockIcon },
  { name: "Mind Piolet", href: "/student/mind-piolet", icon: Brain },
  { name: "Share Achivos", href: "/student/share-achivos", icon: Share },
  { name: "Private Vault", href: "/student/private-vault", icon: Lock },
  { name: "Settings", href: "/student/setting", icon: Settings },
  {
    name: "Social Integrations",
    href: "/student/social-integrations",
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
