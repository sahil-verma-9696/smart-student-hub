import {
  Users,
  Activity,
  AlertCircle,
  GraduationCap,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuthContext from "@/hooks/useAuthContext";
import { formatDistanceToNow } from "date-fns";
import { useAdminPageContext } from "../../context/admin-page.context";
import { Link } from "react-router";

export default function AdminDashboardPage() {
  const { user } = useAuthContext();

  const { instituteStats, recentActivities } = useAdminPageContext();

  return (
    <div className="min-h-screen max-h-screen  bg-[#f8f9fa]">
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#111827] space-x-2">
                <span>Welcome</span>
                <span className="capitalize">{user?.name || "admin"}</span>
              </h1>
              <p className="text-sm text-[#6b7280] mt-1">
                Manage students, faculty, departments, and activities.
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm border">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-[#6b7280]">Total Students</p>
                  <h2 className="text-2xl font-bold">
                    {instituteStats?.totalStudents}
                  </h2>
                </div>
                <GraduationCap className="w-10 h-10 text-black" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-[#6b7280]">Total Faculty</p>
                  <h2 className="text-2xl font-bold">
                    {instituteStats?.totalFaculty}
                  </h2>
                </div>
                <Users className="w-10 h-10 text-black" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-[#6b7280]">Departments</p>
                  <h2 className="text-2xl font-bold">
                    {instituteStats?.totalDepartments}
                  </h2>
                </div>
                <Building2 className="w-10 h-10 text-black" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-[#6b7280]">Total Requests</p>
                  <h2 className="text-2xl font-bold">
                    {instituteStats?.totalActivities}
                  </h2>
                </div>
                <AlertCircle className="w-10 h-10 text-black" />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-lg text-[#111827]">
                Quick Actions
              </CardTitle>
              <CardDescription>Perform common tasks quickly</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {/* FIXED BUTTON STYLE */}
              <Button className="w-full bg-black text-white hover:bg-neutral-800">
                <Link to={"/admin/student-management"}>Manage Students</Link>
              </Button>

              <Button className="w-full bg-black text-white hover:bg-neutral-800">
                <Link to={"/admin/faculty-management"}>Manage Faculty</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1">
            {/* Recent Activity */}
            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg text-[#111827]">
                  Recent Activity
                </CardTitle>
                <CardDescription>System logs and actions</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {recentActivities?.map((act) => (
                  <div
                    key={act.id}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-neutral-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-black" />
                      <div>
                        <p className="text-sm font-medium">{act.action}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {act.status}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-[#6b7280]">
                      {act.time
                        ? formatDistanceToNow(new Date(act.time), {
                            addSuffix: true,
                          })
                        : "N/A"}
                    </p>
                  </div>
                ))}
                {recentActivities?.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent activities found.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
