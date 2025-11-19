"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Activities", href: "/activities", icon: Calendar },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Portfolio", href: "/portfolio", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Certifications", href: "/certifications", icon: Award },
  { name: "Faculty Panel", href: "/faculty", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-sidebar-primary" />
            <span className="text-lg font-semibold text-sidebar-foreground">SSH</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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
              collapsed && "justify-center",
            )}
          >
            <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
            {!collapsed && item.name}
          </a>
        ))}
      </nav>
    </div>
  )
}
