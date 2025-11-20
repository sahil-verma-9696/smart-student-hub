import { StudentOverview } from "@/components/dashboard/student-overview";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { AchievementStats } from "@/components/dashboard/achievement-stats";

export default function FacultyDashboardPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
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
          </div>
        </div>
      </div>
    </main>
  );
}
