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
  BookOpen,
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
import storageKeys from "@/common/storage-keys";
import { useNavigate } from "react-router-dom";

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE) ||
  "http://localhost:3000";

export default function AdminDashboardPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalPrograms: 0,
    departments: 0,
    pendingRequests: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const accessToken = localStorage.getItem(storageKeys.accessToken);

        const [statsRes, registrationsRes, activitiesRes] = await Promise.all([
          fetch(`${API_BASE}/admin/dashboard/stats`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch(`${API_BASE}/admin/dashboard/recent-registrations`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch(`${API_BASE}/admin/dashboard/recent-activities`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData?.data || statsData);
        }

        if (registrationsRes.ok) {
          const regsData = await registrationsRes.json();
          const registrations = regsData?.data || regsData || [];
          setRecentItems(
            registrations.map((item) => ({
              ...item,
              date: new Date(item.date).toLocaleDateString(),
            }))
          );
        }

        if (activitiesRes.ok) {
          const actData = await activitiesRes.json();
          setRecentActivities(actData?.data || actData || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        // Set empty data on error to prevent rendering issues
        setStats({
          totalStudents: 0,
          totalFaculty: 0,
          totalPrograms: 0,
          departments: 0,
          pendingRequests: 0,
        });
        setRecentItems([]);
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.instituteId) {
      fetchDashboardData();
    }
  }, [user?.instituteId]);

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-[#f8f9fa]">
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827] space-x-2">
                <span>Welcome</span>
                <span className="capitalize">{user?.name || "admin"}</span>
              </h1>
              <p className="text-sm text-[#6b7280] mt-1">
                Manage students, faculty, departments, and activities.
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            <Card className="shadow-sm border hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-4 sm:p-5">
                <div>
                  <p className="text-xs sm:text-sm text-[#6b7280]">Total Students</p>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {loading ? "..." : stats.totalStudents.toLocaleString()}
                  </h2>
                </div>
                <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-4 sm:p-5">
                <div>
                  <p className="text-xs sm:text-sm text-[#6b7280]">Total Faculty</p>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {loading ? "..." : stats.totalFaculty.toLocaleString()}
                  </h2>
                </div>
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-4 sm:p-5">
                <div>
                  <p className="text-xs sm:text-sm text-[#6b7280]">Programs</p>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {loading ? "..." : stats.totalPrograms}
                  </h2>
                </div>
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-4 sm:p-5">
                <div>
                  <p className="text-xs sm:text-sm text-[#6b7280]">Departments</p>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {loading ? "..." : stats.departments}
                  </h2>
                </div>
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-4 sm:p-5">
                <div>
                  <p className="text-xs sm:text-sm text-[#6b7280]">Activities</p>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {loading ? "..." : stats.pendingRequests}
                  </h2>
                </div>
                <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-[#111827]">
                Quick Actions
              </CardTitle>
              <CardDescription>Perform common tasks quickly</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Button
                onClick={() => navigate("/admin/add-student")}
                className="w-full bg-black text-white hover:bg-neutral-800"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Student
              </Button>

              <Button
                onClick={() => navigate("/admin/add-faculty")}
                className="w-full bg-black text-white hover:bg-neutral-800"
              >
                <Users className="w-4 h-4 mr-2" />
                Add Faculty
              </Button>

              <Button
                onClick={() => navigate("/admin/programs")}
                className="w-full bg-black text-white hover:bg-neutral-800"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Programs
              </Button>

              <Button
                onClick={() => navigate("/admin/add-activity-type")}
                className="w-full bg-black text-white hover:bg-neutral-800"
              >
                <Activity className="w-4 h-4 mr-2" />
                Add Activity Type
              </Button>

              <Button
                onClick={() => navigate("/admin/analytics")}
                className="w-full bg-black text-white hover:bg-neutral-800"
              >
                <Activity className="w-4 h-4 mr-2" />
                View Analytics
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
                {loading ? (
                  <p className="text-center text-gray-500 py-4">Loading...</p>
                ) : recentItems.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No recent registrations</p>
                ) : (
                  recentItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-neutral-100 transition"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-[#6b7280]">
                          {item.role} • {item.email}
                        </p>
                        {item.userId && (
                          <p className="text-xs text-blue-600 font-mono mt-1">
                            ID: {item.userId}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-[#6b7280]">{item.date}</span>
                    </div>
                  ))
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
                {loading ? (
                  <p className="text-center text-gray-500 py-4">Loading...</p>
                ) : recentActivities.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No recent activities</p>
                ) : (
                  recentActivities.map((act) => (
                    <div
                      key={act.id}
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-neutral-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">{act.action}</p>
                          {act.user && (
                            <p className="text-xs text-gray-500">by {act.user}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-[#6b7280]">{act.time}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
