"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const studentNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Activities", href: "/activities", icon: Calendar },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Portfolio", href: "/portfolio", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Certifications", href: "/certifications", icon: Award },
  { name: "Settings", href: "/settings", icon: Settings },
];

const adminNavigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Add Student", href: "/admin/add-student", icon: Users },
  { name: "Add Faculty", href: "/admin/add-faculty", icon: Users },
  { name: "Student Panel", href: "/admin/students-panel", icon: GraduationCap },
  { name: "All Activities", href: "/admin/activities", icon: Calendar },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // TODO: Replace with actual role from session / API
  const role = "admin"; 
  // role can be: "student" | "admin"

  const navigation = role === "admin" ? adminNavigation : studentNavigation;

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-sidebar-primary" />
            <span className="text-lg font-semibold text-sidebar-foreground">
              Smart Student Hub
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center"
            )}
          >
            <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
            {!collapsed && item.name}
          </a>
        ))}
      </nav>
    </div>
  );
}
