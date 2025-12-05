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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useAuthantication from "@/hooks/useAuthantication";
import useAuthContext from "@/hooks/useAuthContext";
import { Badge } from "@/components/ui/badge";

import { useNotificationContext } from "@/contexts/NotificationContext.jsx";
import { useState } from "react";

function Navbar() {
  const { logout } = useAuthantication();
  const { user } = useAuthContext();
  const { notifications } = useNotificationContext();

  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {user?.basicUserDetails?.name}
            <Badge variant="outlined">{user?.basicUserDetails?.role}</Badge>
          </h2>
        </div>

        {/* RIGHT */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search activities..." className="pl-10 w-64" />
          </div>

          {/* Notification Bell + MODAL */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <div className="relative cursor-pointer">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>

                {notifications?.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Notifications</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {notifications.length > 0 &&
                  notifications.map((n, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-muted/20 shadow-sm"
                    >
                      {/* TITLE fallback logic */}
                      <h3 className="font-semibold">
                        {n.title || "Untitled Notification"}
                      </h3>

                      {/* MESSAGE fallback logic */}
                      <p className="text-sm text-muted-foreground">
                        {n.message || "No details available"}
                      </p>

                      
                    </div>
                  ))}

                {/* Empty State */}
                {notifications.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    No notifications yet.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* User Dropdown */}
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
