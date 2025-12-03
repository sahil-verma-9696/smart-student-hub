import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "../ui/badge";

// Sample notifications (you can later replace with API data)
const notifications = [
  { id: 1, message: "New student registration pending approval" },
  { id: 2, message: "Faculty uploaded new report" },
  { id: 3, message: "Reminder: Meeting at 4 PM" },
];

function Navbar() {
  const { logout } = useAuthantication();
  const { user } = useAuthContext();

  const handleSignOut = () => logout();

  return (
    <header className="border-b border-border bg-card px-4 sm:px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        {/* User Name & Role */}
        <div className="flex items-center flex-wrap gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-card-foreground capitalize flex items-center gap-2">
            {user?.basicUserDetails?.name}
            <Badge variant="outlined">{user?.basicUserDetails?.role}</Badge>
          </h2>
        </div>

        {/* Right Side Menu */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Notification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-80 max-h-60 overflow-y-auto"
            >
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {notifications.length > 0 ? (
                notifications.map((note) => (
                  <DropdownMenuItem key={note.id}>
                    {note.message}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="text-muted-foreground">
                  No new notifications
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
