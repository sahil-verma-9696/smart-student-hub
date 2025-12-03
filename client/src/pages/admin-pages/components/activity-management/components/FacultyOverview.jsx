import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const FacultyOverview = ({
  faculty,
  facultyAssignmentCounts,
  onFacultyClick,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Faculty Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {faculty.map((f) => {
            const count = facultyAssignmentCounts.get(f._id) || 0;
            return (
              <div
                key={f._id}
                className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onFacultyClick(f)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {f.basicUserDetails?.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {f.department || "No department"} •{" "}
                      {f.designation || "Faculty"}
                    </p>
                  </div>
                  <Badge variant={count > 0 ? "default" : "secondary"}>
                    {count} {count === 1 ? "Activity" : "Activities"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
