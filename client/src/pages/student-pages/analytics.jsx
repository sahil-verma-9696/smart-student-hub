import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { StudentEngagement } from "@/components/analytics/student-engagement"
import { ActivityTrends } from "@/components/analytics/activity-trends"
import { DepartmentComparison } from "@/components/analytics/department-comparison"
import { ReportGeneration } from "@/components/analytics/report-generation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Analytics & Reporting</h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive insights for institutional decision-making and accreditation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <AnalyticsOverview />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <StudentEngagement />
                  <ActivityTrends />
                </div>
                <DepartmentComparison />
              </div>

              <div className="space-y-6">
                <ReportGeneration />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
