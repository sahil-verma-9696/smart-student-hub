import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export const ActivityFilters = ({
  searchTerm,
  setSearchTerm,
  assignmentFilter,
  setAssignmentFilter,
  activityTypeFilter,
  setActivityTypeFilter,
  activityTypes,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title or student..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
        <SelectTrigger className="w-[160px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Assignment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Activities</SelectItem>
          <SelectItem value="assigned">Assigned</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
        </SelectContent>
      </Select>
      <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Activity Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {activityTypes.map((type) => (
            <SelectItem key={type._id} value={type._id}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
