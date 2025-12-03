import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UserCheck } from "lucide-react";
import { ActivityFilters } from "./ActivityFilters";
import { ActivityItem } from "./ActivityItem";

export const ActivitiesList = ({
  searchTerm,
  setSearchTerm,
  assignmentFilter,
  setAssignmentFilter,
  activityTypeFilter,
  setActivityTypeFilter,
  activityTypes,
  selectedActivities,
  setSelectedActivities,
  onOpenAssignDialog,
  filteredActivities,
  toggleSelectAll,
  toggleActivitySelection,
  assignmentMap,
  getFacultyName,
  getActivityTypeName,
  faculty,
  onReassign,
  onUnassign,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <ActivityFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          assignmentFilter={assignmentFilter}
          setAssignmentFilter={setAssignmentFilter}
          activityTypeFilter={activityTypeFilter}
          setActivityTypeFilter={setActivityTypeFilter}
          activityTypes={activityTypes}
        />

        {/* Selection Actions */}
        {selectedActivities.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">
              {selectedActivities.length} selected
            </span>
            <Button size="sm" onClick={onOpenAssignDialog}>
              <UserCheck className="h-4 w-4 mr-2" />
              Assign to Faculty
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedActivities([])}
            >
              Clear
            </Button>
          </div>
        )}

        {/* Select All */}
        <div className="flex items-center gap-2 pb-2 border-b">
          <Checkbox
            checked={
              selectedActivities.length === filteredActivities.length &&
              filteredActivities.length > 0
            }
            onCheckedChange={toggleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            Select All ({filteredActivities.length})
          </span>
        </div>

        {/* Activities List */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredActivities.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No activities found
            </p>
          ) : (
            filteredActivities.map((activity) => (
              <ActivityItem
                key={activity._id}
                activity={activity}
                isSelected={selectedActivities.includes(activity._id)}
                onToggleSelection={toggleActivitySelection}
                assignment={assignmentMap.get(activity._id)}
                getFacultyName={getFacultyName}
                getActivityTypeName={getActivityTypeName}
                faculty={faculty}
                onReassign={onReassign}
                onUnassign={onUnassign}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
