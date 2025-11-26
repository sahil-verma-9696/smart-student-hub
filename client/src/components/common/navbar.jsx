import { Bell, Search, User, School, UserCog } from "lucide-react";
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

function Navbar({ title }) {
  const { user, logout } = useAuthantication();

  const handleSignOut = () => logout();

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-card-foreground capitalize">
            {title}
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

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* If Faculty → Show institution details */}
              {user?.role === "faculty" && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Institution
                  </DropdownMenuLabel>

                  <DropdownMenuItem className="flex items-center space-x-2">
                    <School className="h-4 w-4" />
                    <span>
                      {user?.institutionName || "Institution Not Assigned"}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center space-x-2">
                    <UserCog className="h-4 w-4" />
                    <span>{user?.adminName || "Admin Not Assigned"}</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                </>
              )}

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
