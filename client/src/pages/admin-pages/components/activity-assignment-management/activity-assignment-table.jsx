import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, UserMinus, UserPlus } from "lucide-react";
import { format } from "date-fns";

export function ActivityAssignmentTable({
  assignments,
  loading,
  onReassign,
  onUnassign,
  onDelete,
}) {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!assignments || assignments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No activity assignments found.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Activity Title</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Assigned Faculty</TableHead>
            <TableHead>Institute</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment._id}>
              <TableCell className="font-medium">
                {assignment.activityId?.title || "Unknown Activity"}
              </TableCell>
              <TableCell>
                {assignment.studentId?.name || "Unknown Student"}
              </TableCell>
              <TableCell>
                {assignment.facultyId ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {assignment.facultyId.name}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-muted-foreground">Unassigned</Badge>
                )}
              </TableCell>
              <TableCell>
                {assignment.instituteId?.institute_name || "Unknown Institute"}
              </TableCell>
              <TableCell>
                {assignment.createdAt ? format(new Date(assignment.createdAt), "PPP") : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReassign(assignment)}
                    title={assignment.facultyId ? "Reassign Faculty" : "Assign Faculty"}
                  >
                    {assignment.facultyId ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(assignment._id)}
                    title="Delete Assignment"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
