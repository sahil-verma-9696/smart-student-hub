import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";

export function StatsCards({ activities, faculty }) {
  const totalActivities = activities.length;
  const assignedActivities = activities.filter(
    (a) => a.assignedFacultyId !== null
  ).length;
  const unassignedActivities = totalActivities - assignedActivities;
  const activeActivities = activities.filter(
    (a) => a.status === "active"
  ).length;
  const pendingActivities = activities.filter(
    (a) => a.status === "pending"
  ).length;

  const facultyWithAssignments = new Set(
    activities
      .filter((a) => a.assignedFacultyId)
      .map((a) => a.assignedFacultyId)
  ).size;

  const stats = [
    {
      title: "Total Activities",
      value: totalActivities,
      icon: Activity,
      description: "Across all categories",
    },
    {
      title: "Assigned",
      value: assignedActivities,
      icon: CheckCircle,
      description: `${((assignedActivities / totalActivities) * 100).toFixed(
        0
      )}% of total`,
      className: "text-green-600",
    },
    {
      title: "Unassigned",
      value: unassignedActivities,
      icon: AlertCircle,
      description: "Need faculty assignment",
      className: "text-orange-600",
    },
    {
      title: "Active Faculty",
      value: facultyWithAssignments,
      icon: Users,
      description: `Out of ${faculty.length} available`,
    },
    {
      title: "Active",
      value: activeActivities,
      icon: CheckCircle,
      description: "Currently running",
      className: "text-green-600",
    },
    {
      title: "Pending",
      value: pendingActivities,
      icon: Clock,
      description: "Awaiting approval",
      className: "text-yellow-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon
              className={`h-4 w-4 ${stat.className || "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.className || ""}`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
