import { ActivityTracker } from "@/components/activities/activity-tracker";
import { ActivityList } from "@/components/activities/activity-list";
import { ActivityStats } from "@/components/activities/activity-stats";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function ActivitiesPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Activity Tracker
                </h1>
                <p className="text-muted-foreground mt-1">
                  Document and track your academic and extracurricular
                  achievements
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <ActivityTracker />
                <ActivityList />
              </div>

              <div className="space-y-6">
                <ActivityStats />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
