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

export default function AdminDashboardPage() {
  const [recentItems, setRecentItems] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Simulated data
  useEffect(() => {
    setRecentItems([
      {
        id: 1,
        name: "Amit Verma",
        role: "Student",
        email: "amit@gmail.com",
        date: "2025-11-23",
      },
      {
        id: 2,
        name: "Priya Sharma",
        role: "Faculty",
        email: "priya@college.com",
        date: "2025-11-22",
      },
      {
        id: 3,
        name: "Rohit Singh",
        role: "Student",
        email: "rohit@gmail.com",
        date: "2025-11-22",
      },
    ]);

    setRecentActivities([
      { id: 1, action: "New student registered", time: "2 hours ago" },
      { id: 2, action: "Faculty uploaded attendance", time: "5 hours ago" },
      { id: 3, action: "Admin updated institute settings", time: "Yesterday" },
    ]);
  }, []);

  const { user } = useAuthContext();

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
                  <h2 className="text-2xl font-bold">1,243</h2>
                </div>
                <GraduationCap className="w-10 h-10 text-black" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-[#6b7280]">Total Faculty</p>
                  <h2 className="text-2xl font-bold">123</h2>
                </div>
                <Users className="w-10 h-10 text-black" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-[#6b7280]">Departments</p>
                  <h2 className="text-2xl font-bold">18</h2>
                </div>
                <Building2 className="w-10 h-10 text-black" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-[#6b7280]">Pending Requests</p>
                  <h2 className="text-2xl font-bold">7</h2>
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
                    <span className="text-xs text-[#6b7280]">{item.date}</span>
                  </div>
                ))}
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
                      <p className="text-sm">{act.action}</p>
                    </div>
                    <p className="text-xs text-[#6b7280]">{act.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
