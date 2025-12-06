import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, CheckCircle, CircleDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotificationContext } from "@/contexts/notification-context";
import { formatDistanceToNow } from "date-fns";

export function NotificationPopover() {
  const { notifications = [], markAllRead = () => {} } =
    useNotificationContext();

  const unreadCount = notifications?.filter((n) => !n.isRead).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1 py-0 text-[10px]"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 p-0 shadow-lg border rounded-lg bg-card"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="text-sm font-medium">Notifications</h4>

          {notifications?.length > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications?.length === 0 ? (
            <div className="p-4 text-muted-foreground text-sm text-center">
              No notifications available
            </div>
          ) : (
            notifications?.map((n) => (
              <div
                key={n._id}
                className="flex items-start gap-3 p-4 border-b hover:bg-accent cursor-pointer"
              >
                {/* Dot indicator */}
                {!n.isRead ? (
                  <CircleDot className="h-4 w-4 text-blue-600 mt-1" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-muted-foreground mt-1" />
                )}

                <div className="flex-1">
                  <div className="font-medium text-sm">{n.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {n.message}
                  </div>

                  <div className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
