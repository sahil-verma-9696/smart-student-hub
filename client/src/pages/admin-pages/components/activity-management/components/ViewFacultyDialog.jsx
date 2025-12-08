import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { RefreshCw, X } from "lucide-react";

export const ViewFacultyDialog = ({
  open,
  onOpenChange,
  selectedFaculty,
  activities,
  faculty,
  getActivityTypeName,
  onReassign,
  onUnassign,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Activities Assigned to {selectedFaculty?.basicUserDetails?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 max-h-[400px] overflow-y-auto">
          {selectedFaculty && (
            <>
              {activities.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No activities assigned to this faculty
                </p>
              ) : (
                <div className="space-y-2">
                  {activities.map((activity) => (
                    <div
                      key={activity._id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{activity.title}</span>
                        <p className="text-sm text-muted-foreground">
                          {getActivityTypeName(activity)} •{" "}
                          {activity.student?.basicUserDetails?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value=""
                          onValueChange={(newFacId) => {
                            onReassign(activity._id, newFacId);
                            onOpenChange(false);
                          }}
                        >
                          <SelectTrigger className="w-[130px]">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            <span className="text-xs">Reassign</span>
                          </SelectTrigger>
                          <SelectContent>
                            {faculty
                              .filter((f) => f._id !== selectedFaculty._id)
                              .map((f) => (
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
                          onClick={() => {
                            onUnassign(activity._id);
                            onOpenChange(false);
                          }}
                          title="Unassign activity"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
