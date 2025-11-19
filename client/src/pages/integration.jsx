import { IntegrationOverview } from "@/components/integrations/integration-overview";
import { AvailableIntegrations } from "@/components/integrations/available-integrations";
import { APIManagement } from "@/components/integrations/api-management";
import { DataSync } from "@/components/integrations/data-sync";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function IntegrationsPage() {
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
                  System Integrations
                </h1>
                <p className="text-muted-foreground mt-1">
                  Connect with existing systems and enable seamless data flow
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <IntegrationOverview />
                <AvailableIntegrations />
                <DataSync />
              </div>

              <div className="space-y-6">
                <APIManagement />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
