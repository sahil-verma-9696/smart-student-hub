import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function ActivityAssignmentForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  assignment, 
  activities = [], 
  faculties = [],
  loading 
}) {
  const [formData, setFormData] = useState({
    activityId: "",
    studentId: "",
    facultyId: "",
    instituteId: ""
  });

  useEffect(() => {
    if (assignment) {
      setFormData({
        activityId: assignment.activityId?._id || assignment.activityId,
        studentId: assignment.studentId?._id || assignment.studentId,
        facultyId: assignment.facultyId?._id || assignment.facultyId || "unassigned",
        instituteId: assignment.instituteId?._id || assignment.instituteId
      });
    } else {
      setFormData({
        activityId: "",
        studentId: "",
        facultyId: "unassigned",
        instituteId: ""
      });
    }
  }, [assignment, isOpen]);

  const handleActivityChange = (activityId) => {
    const selectedActivity = activities.find(a => a._id === activityId);
    if (selectedActivity) {
      setFormData(prev => ({
        ...prev,
        activityId,
        studentId: selectedActivity.studentId?._id || selectedActivity.studentId,
        instituteId: selectedActivity.instituteId?._id || selectedActivity.instituteId
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
        ...formData,
        facultyId: formData.facultyId === "unassigned" ? null : formData.facultyId
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{assignment ? "Update Assignment" : "Create Assignment"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Activity</Label>
            {assignment ? (
               <div className="p-2 border rounded bg-muted text-sm">
                 {assignment.activityId?.title || "Unknown Activity"}
               </div>
            ) : (
              <Select onValueChange={handleActivityChange} value={formData.activityId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Activity" />
                </SelectTrigger>
                <SelectContent>
                  {activities.map(activity => (
                    <SelectItem key={activity._id} value={activity._id}>
                      {activity.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>Student</Label>
             <div className="p-2 border rounded bg-muted text-sm min-h-[2.5rem] flex items-center">
                 {assignment ? (assignment.studentId?.name || "Unknown Student") : 
                  (activities.find(a => a._id === formData.activityId)?.studentId?.name || "Auto-filled")}
             </div>
          </div>

          <div className="space-y-2">
            <Label>Assigned Faculty</Label>
            <Select 
                value={formData.facultyId || "unassigned"} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, facultyId: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {faculties.map(faculty => (
                  <SelectItem key={faculty._id} value={faculty._id}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
