import { StudentOverview } from "@/components/dashboard/student-overview";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { AchievementStats } from "@/components/dashboard/achievement-stats";
import { AttendanceChart } from "@/pages/student-pages/attendance-chart";

export default function ScholarWindowPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Welcome back, John Doe
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">
            <StudentOverview />
            <RecentActivities />
          </div>

          <div className="space-y-6">
            <AchievementStats />

            {/* 👇 NEW Attendance Chart Section */}
            <AttendanceChart present={22} absent={3} />
          </div>

        </div>
      </div>
    </main>
  );
}
