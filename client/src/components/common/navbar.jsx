// src/components/common/Navbar.jsx

import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useAuthantication from "@/hooks/useAuthantication";
import useAuthContext from "@/hooks/useAuthContext";
import { Badge } from "@/components/ui/badge";
import { useNotificationContext } from "@/contexts/NotificationContext.jsx";

function Navbar() {
  const { logout } = useAuthantication();
  const { user } = useAuthContext();
  const { notifications } = useNotificationContext();

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        
        {/* LEFT */}
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {user?.basicUserDetails?.name}
          <Badge variant="outlined">{user?.basicUserDetails?.role}</Badge>
        </h2>

        {/* RIGHT */}
        <div className="flex items-center space-x-4">

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search..." className="pl-10 w-64" />
          </div>

          {/* 🔔 NOTIFICATION DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />

                {notifications?.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-80 max-h-96 overflow-y-auto p-2"
            >
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {notifications.length > 0 ? (
                notifications.map((n, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-md border mb-2 bg-muted/20 cursor-pointer hover:bg-muted transition"
                  >
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.message}</p>

                    {n.time && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(n.time).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No notifications yet.
                </p>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* USER MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
