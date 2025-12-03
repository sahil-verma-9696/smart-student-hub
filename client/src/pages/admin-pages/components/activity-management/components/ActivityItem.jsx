import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { RefreshCw, X } from "lucide-react";

export const ActivityItem = ({
  activity,
  isSelected,
  onToggleSelection,
  assignment,
  getFacultyName,
  getActivityTypeName,
  faculty,
  onReassign,
  onUnassign,
}) => {
  const isAssigned = !!assignment;

  return (
    <div
      className={`flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
        isSelected ? "bg-muted border-primary" : ""
      }`}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelection(activity._id)}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{activity.title}</span>
          <Badge variant="outline" className="text-xs">
            {getActivityTypeName(activity)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          Student: {activity.student?.basicUserDetails?.name || "Unknown"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {isAssigned ? (
          <>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {getFacultyName(assignment)}
            </Badge>
            <Select
              value=""
              onValueChange={(newFacId) => onReassign(activity._id, newFacId)}
            >
              <SelectTrigger className="w-[120px] h-8">
                <RefreshCw className="h-3 w-3 mr-1" />
                <span className="text-xs">Reassign</span>
              </SelectTrigger>
              <SelectContent>
                {faculty.map((f) => (
                  <SelectItem key={f._id} value={f._id}>
                    {f.basicUserDetails?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onUnassign(activity._id)}
              title="Unassign activity"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Badge variant="outline" className="bg-orange-50 text-orange-600">
            Unassigned
          </Badge>
        )}
      </div>
    </div>
  );
};
