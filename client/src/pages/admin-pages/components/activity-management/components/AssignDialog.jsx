import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  SelectValue,
} from "@/components/ui/select";

export const AssignDialog = ({
  open,
  onOpenChange,
  selectedActivities,
  selectedFaculty,
  setSelectedFaculty,
  faculty,
  facultyAssignmentCounts,
  onAssign,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Activities to Faculty</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Assigning {selectedActivities.length}{" "}
            {selectedActivities.length === 1 ? "activity" : "activities"}
          </p>
          <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
            <SelectTrigger>
              <SelectValue placeholder="Select Faculty" />
            </SelectTrigger>
            <SelectContent>
              {faculty.map((f) => (
                <SelectItem key={f._id} value={f._id}>
                  <div className="flex items-center gap-2">
                    <span>{f.basicUserDetails?.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {facultyAssignmentCounts.get(f._id) || 0} assigned
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAssign} disabled={!selectedFaculty}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
