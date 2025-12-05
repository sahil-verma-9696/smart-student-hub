"use client";

import { useState } from "react";
import { useLocation } from "react-router";
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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const defaultNavigationConfig = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Activities", href: "/activities", icon: Calendar },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Portfolio", href: "/portfolio", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Certifications", href: "/certifications", icon: Award },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({
  navigationConfig = defaultNavigationConfig,
  mobileOpen = false,
  onMobileClose = () => {},
}) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (href) => {
    if (href === "/admin/" || href === "/student/" || href === "/faculty/") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 h-full",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-sidebar-primary flex-shrink-0" />
              <span className="text-lg font-semibold text-sidebar-foreground leading-tight">
                Smart Student Hub
              </span>
            </div>
          )}
          {collapsed && (
            <GraduationCap className="h-8 w-8 text-sidebar-primary mx-auto" />
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="mx-auto mb-2 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigationConfig.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                isActive(item.href)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", !collapsed && "mr-3")} />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </a>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-sidebar-primary flex-shrink-0" />
            <span className="text-lg font-semibold text-sidebar-foreground leading-tight">
              Smart Student Hub
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigationConfig.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                isActive(item.href)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
