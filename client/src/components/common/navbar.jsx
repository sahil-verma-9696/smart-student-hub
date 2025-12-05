import { Bell, Search, User, Menu } from "lucide-react";
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

function Navbar({ title, onMenuClick }) {
  /******************************************
   * Custom hooks
   ********************************************/
  const { logout } = useAuthantication();

  /******************************************
   * Handler Functions
   ********************************************/
  const handleSignOut = () => logout();

  return (
    <header className="border-b border-border bg-card px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Menu button (mobile) + Title */}
        <div className="flex items-center space-x-3 min-w-0">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden flex-shrink-0"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg sm:text-xl font-semibold text-card-foreground capitalize truncate">
            {title}
          </h2>
        </div>

        {/* Right side - Search, notifications, user */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search - hidden on mobile, visible on tablet+ */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-40 lg:w-64"
            />
          </div>

          {/* Mobile search button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

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
              <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start p-0">
                <DropdownMenuItem className="w-full">Sign out</DropdownMenuItem>
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
