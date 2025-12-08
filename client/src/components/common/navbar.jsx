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
import { Badge } from "../ui/badge";
import { NotificationPopover } from "./notification-popover";
import { Link } from "react-router";

function Navbar() {
  /******************************************
   * Custom hooks
   ********************************************/
  const { logout } = useAuthantication();
  const { user } = useAuthContext();

  /******************************************
   * Handler Functions
   ********************************************/
  const handleSignOut = () => logout();

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-card-foreground capitalize  flex items-center justify-center gap-1">
            {user?.basicUserDetails?.name}
            <Badge variant={"outlined"}>{user?.basicUserDetails?.role}</Badge>
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationPopover />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={"profile"}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={"settings"}>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Button variant="ghost" onClick={handleSignOut}>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
