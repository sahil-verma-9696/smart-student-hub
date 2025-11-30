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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search activities, achievements..."
              className="pl-10 w-64"
            />
          </div>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

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
