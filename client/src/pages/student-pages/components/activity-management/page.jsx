import { ActivityTracker } from "./activity-tracker";
import { ActivityList } from "./activity-list";
import { ActivityStats } from "./activity-stats";
import useAuthContext from "@/hooks/useAuthContext";
import { USER_ROLE } from "@/common/enum";
import { useActivityPageContext } from "@/pages/student-pages/hooks/useActivityPageContext";

export default function ActivitiesPage() {
  const { activities, activityStats } = useActivityPageContext();
  const { user } = useAuthContext();

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {user?.basicUserDetails?.role === USER_ROLE.STUDENT && (
              <ActivityTracker />
            )}
            <ActivityList activities={activities} />
          </div>

          <div className="space-y-6">
            <ActivityStats activityStats={activityStats} />
          </div>
        </div>
      </div>
    </main>
  );
}
