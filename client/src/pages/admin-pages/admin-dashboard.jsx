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
import { useEffect, useState, useMemo } from "react";
import useAuthContext from "@/hooks/useAuthContext";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// ⭐ ADD THIS IMPORT
import { useNavigate } from "react-router";

export default function AdminDashboardPage() {
  const [recentItems, setRecentItems] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const { user } = useAuthContext();

  const [sortReg, setSortReg] = useState("recent");
  const [sortAct, setSortAct] = useState("recent");

  // ⭐ INITIALIZE NAVIGATE
  const navigate = useNavigate();

  // ⭐ FUNCTION TO HANDLE MANAGE STUDENTS CLICK
  function handleClick() {
    navigate("/admin/students-panel");
  }
  function handleFacultyBtnClick() {
    navigate("/admin/faculty-managment");
  }

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
      { id: 1, action: "New student registered", time: "2025-11-25T10:00" },
      { id: 2, action: "Faculty uploaded attendance", time: "2025-11-25T07:00" },
      { id: 3, action: "Admin updated institute settings", time: "2025-11-24T16:00" },
    ]);
  }, []);

  const sortedRegistrations = useMemo(() => {
    return [...recentItems].sort((a, b) =>
      sortReg === "recent"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );
  }, [recentItems, sortReg]);

  const sortedActivities = useMemo(() => {
    return [...recentActivities].sort((a, b) =>
      sortAct === "recent"
        ? new Date(b.time) - new Date(a.time)
        : new Date(a.time) - new Date(b.time)
    );
  }, [recentActivities, sortAct]);

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-[#f3f4f6]">
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-semibold text-[#111827]">
              Welcome <span className="capitalize">{user?.name || "admin"}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage students, faculty, departments, and activities.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-md border bg-white rounded-xl">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <h2 className="text-3xl font-bold">1,243</h2>
                </div>
                <GraduationCap className="w-12 h-12 text-black" />
              </CardContent>
            </Card>

            <Card className="shadow-md border bg-white rounded-xl">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-gray-500">Total Faculty</p>
                  <h2 className="text-3xl font-bold">123</h2>
                </div>
                <Users className="w-12 h-12 text-black" />
              </CardContent>
            </Card>

            <Card className="shadow-md border bg-white rounded-xl">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-gray-500">Activities</p>
                  <h2 className="text-3xl font-bold">18</h2>
                </div>
                <Building2 className="w-12 h-12 text-black" />
              </CardContent>
            </Card>

            <Card className="shadow-md border bg-white rounded-xl">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-gray-500">Pending Requests</p>
                  <h2 className="text-3xl font-bold">7</h2>
                </div>
                <AlertCircle className="w-12 h-12 text-black" />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow-md border rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Perform common tasks quickly</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* ⭐ UPDATED BUTTON WITH NAVIGATION */}
              <Button
                className="w-full bg-black text-white hover:opacity-90 shadow-lg rounded-xl py-5 text-md font-semibold transition-all duration-300"
                onClick={handleClick}
              >
                Manage Students
              </Button>

              <Button className="w-full bg-black text-white hover:opacity-90 shadow-lg rounded-xl py-5 text-md font-semibold transition-all duration-300" onClick = {handleFacultyBtnClick}>
                Manage Faculty
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registrations */}
            <Card className="shadow-md border rounded-xl">
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Recent Registrations</CardTitle>
                  <CardDescription>Latest users added to the institute</CardDescription>
                </div>

                <Select defaultValue="recent" onValueChange={setSortReg}>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>

              <CardContent className="space-y-4">
                {sortedRegistrations.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 border rounded-lg bg-white hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.role} • {item.email}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Activity */}
            <Card className="shadow-md border rounded-xl">
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>System logs and actions</CardDescription>
                </div>

                <Select defaultValue="recent" onValueChange={setSortAct}>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>

              <CardContent className="space-y-4">
                {sortedActivities.map((act) => (
                  <div
                    key={act.id}
                    className="flex justify-between items-center p-4 border rounded-lg bg-white hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-black" />
                      <p className="text-sm">{act.action}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(act.time).toLocaleString()}
                    </p>
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
