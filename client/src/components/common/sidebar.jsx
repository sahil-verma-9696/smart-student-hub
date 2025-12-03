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
  Award,
  Menu,
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
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-sidebar p-3 flex justify-between items-center border-b border-sidebar-border">
        <span className="font-semibold text-sidebar-foreground">
          Smart Student Hub
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-sidebar-foreground"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:block bg-sidebar border-r border-sidebar-border transition-all duration-300 h-screen",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-sidebar-primary" />
              <span className="text-lg font-semibold text-sidebar-foreground">
                Smart <br /> Student Hub
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
          {navigationConfig.map((item) => (
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

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "md:hidden fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border w-64 p-4 z-50 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-sidebar-foreground">Menu</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5 text-sidebar-foreground" />
          </Button>
        </div>

        <nav className="space-y-1">
          {navigationConfig.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border p-2 flex justify-around">
        {navigationConfig.slice(0, 4).map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="flex flex-col items-center text-xs text-sidebar-foreground"
          >
            <item.icon className="h-5 w-5 mb-1" />
            {item.name}
          </a>
        ))}
      </div>
    </>
  );
}
