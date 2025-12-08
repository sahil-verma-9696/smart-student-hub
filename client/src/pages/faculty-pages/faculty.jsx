import { FacultyDashboard } from "@/components/faculty/faculty-dashboard";
import { PendingApprovals } from "@/components/faculty/pending-approvals";
import { FacultyStats } from "@/components/faculty/faculty-stats";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function FacultyPage() {
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
                  Faculty Panel
                </h1>
                <p className="text-muted-foreground mt-1">
                  Review and approve student activity submissions
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <FacultyDashboard />
                <PendingApprovals />
              </div>

              <div className="space-y-6">
                <FacultyStats />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
