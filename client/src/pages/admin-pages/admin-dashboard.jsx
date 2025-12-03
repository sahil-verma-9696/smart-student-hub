import {
  UserPlus,
  Users,
  Bell,
  Activity,
  User,
  CalendarDays,
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
import { useEffect, useState } from "react";
import useGlobalContext from "@/hooks/useGlobalContext";
import useAuthContext from "@/hooks/useAuthContext";
import { studentAPI, facultyAPI, activityAPI } from "@/services/api";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboardPage() {
  const [recentItems, setRecentItems] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    departments: 0,
    pendingRequests: 0,
  });

  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instituteId = user?.institute?._id || user?.institute;
        
        // Fetch data in parallel
        const [students, faculty, activities] = await Promise.all([
          studentAPI.getStudents({ instituteId }),
          facultyAPI.getFaculties({ instituteId, limit: 1000 }), // High limit to get count
          activityAPI.getActivities({ instituteId }), // Assuming this endpoint supports filtering
        ]);

        // 1. Calculate Stats
        const uniqueDepartments = new Set(faculty.map(f => f.department).filter(Boolean));
        const pending = activities.filter(a => a.status === 'pending');

        setStats({
          totalStudents: students.length,
          totalFaculty: faculty.length,
          departments: uniqueDepartments.size,
          pendingRequests: pending.length,
        });

        // 2. Process Recent Registrations (Students + Faculty)
        const allUsers = [
          ...students.map(s => ({
            id: s._id,
            name: s.basicUserDetails?.name || "Unknown",
            role: "Student",
            email: s.basicUserDetails?.email,
            date: s.createdAt,
          })),
          ...faculty.map(f => ({
            id: f._id,
            name: f.basicUserDetails?.name || "Unknown",
            role: "Faculty",
            email: f.basicUserDetails?.email,
            date: f.createdAt,
          }))
        ];

        // Sort by date descending and take top 5
        const sortedUsers = allUsers.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        setRecentItems(sortedUsers);

        // 3. Process Recent Activities
        const sortedActivities = activities
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(act => ({
            id: act._id,
            action: act.title || "Untitled Activity",
            time: act.createdAt,
            status: act.status
          }));
        
        setRecentActivities(sortedActivities);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-[#f8f9fa]">
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
                  <h2 className="text-2xl font-bold">{stats.totalStudents}</h2>
                </div>
                <GraduationCap className="w-10 h-10 text-black" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-[#6b7280]">Total Faculty</p>
                  <h2 className="text-2xl font-bold">{stats.totalFaculty}</h2>
                </div>
                <Users className="w-10 h-10 text-black" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-[#6b7280]">Departments</p>
                  <h2 className="text-2xl font-bold">{stats.departments}</h2>
                </div>
                <Building2 className="w-10 h-10 text-black" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-[#6b7280]">Pending Requests</p>
                  <h2 className="text-2xl font-bold">{stats.pendingRequests}</h2>
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

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="w-full bg-black text-white hover:bg-neutral-800">
                <UserPlus className="w-4 h-4 mr-2" />
                Register Student
              </Button>

              <Button className="w-full bg-black text-white hover:bg-neutral-800">
                <Users className="w-4 h-4 mr-2" />
                Register Faculty
              </Button>

              {/* FIXED BUTTON STYLE */}
              <Button className="w-full bg-black text-white hover:bg-neutral-800">
                Manage Students
              </Button>

              <Button className="w-full bg-black text-white hover:bg-neutral-800">
                Manage Faculty
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Registrations */}
            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg text-[#111827]">
                  Recent Registrations
                </CardTitle>
                <CardDescription>
                  Latest users added to the institute
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-neutral-100 transition"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-[#6b7280]">
                        {item.role} • {item.email}
                      </p>
                    </div>
                    <span className="text-xs text-[#6b7280]">
                      {item.date ? formatDistanceToNow(new Date(item.date), { addSuffix: true }) : 'N/A'}
                    </span>
                  </div>
                ))}
                {recentItems.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No recent registrations found.</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg text-[#111827]">
                  Recent Activity
                </CardTitle>
                <CardDescription>System logs and actions</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-neutral-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-black" />
                      <div>
                        <p className="text-sm font-medium">{act.action}</p>
                        <p className="text-xs text-gray-500 capitalize">{act.status}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#6b7280]">
                      {act.time ? formatDistanceToNow(new Date(act.time), { addSuffix: true }) : 'N/A'}
                    </p>
                  </div>
                ))}
                {recentActivities.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No recent activities found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
