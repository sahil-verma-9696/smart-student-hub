import { ActivityList } from "@/pages/student-pages/components/activity-management/activity-list";
import { ActivityStats } from "@/pages/student-pages/components/activity-management/activity-stats";
import { ActivityTracker } from "@/pages/student-pages/components/activity-management/activity-tracker";
import React from "react";

const Settings = () => {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
  );
};

export default Settings;
