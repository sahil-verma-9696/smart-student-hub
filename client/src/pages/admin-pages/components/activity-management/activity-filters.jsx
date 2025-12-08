import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X,
  Filter,
  Search,
  SlidersHorizontal,
  GraduationCap,
  Building2,
  Calendar,
} from "lucide-react";
import {
  categories,
  classes,
  departments,
  durations,
  levels,
  semesters,
  statuses,
  types,
  years,
} from "./constant";

export default function ActivityFilters({
  filters,
  onFiltersChange,
  groupBy,
  onGroupByChange,
}) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isStudentFiltersOpen, setIsStudentFiltersOpen] = useState(false);

  const activeFiltersCount = [
    filters.categories.length,
    filters.types.length,
    filters.levels.length,
    filters.durations.length,
    filters.statuses.length,
    filters.assignmentStatus !== "all" ? 1 : 0,
    filters.departments.length,
    filters.classes.length,
    filters.years.length,
    filters.semesters.length,
  ].reduce((a, b) => a + b, 0);

  const handleMultiSelect = (field, value) => {
    const current = filters[field];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [field]: updated });
  };

  const handleNumericMultiSelect = (field, value) => {
    const current = filters[field];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [field]: updated });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      categories: [],
      types: [],
      levels: [],
      durations: [],
      statuses: [],
      assignmentStatus: "all",
      departments: [],
      classes: [],
      years: [],
      semesters: [],
    });
  };

  const removeFilter = (field, value) => {
    if (field === "search") {
      onFiltersChange({ ...filters, search: "" });
    } else if (field === "assignmentStatus") {
      onFiltersChange({ ...filters, assignmentStatus: "all" });
    } else if (field === "years" || field === "semesters") {
      const current = filters[field];
      onFiltersChange({
        ...filters,
        [field]: current.filter((v) => v !== value),
      });
    } else if (value !== undefined) {
      const current = filters[field];
      onFiltersChange({
        ...filters,
        [field]: current.filter((v) => v !== value),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities or students..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-9"
          />
        </div>

        {/* Activity Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              Category
              {filters.categories.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.categories.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() =>
                      handleMultiSelect("categories", category)
                    }
                  />
                  <Label
                    htmlFor={`cat-${category}`}
                    className="text-sm cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              Type
              {filters.types.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.types.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="space-y-2">
              {types.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.types.includes(type)}
                    onCheckedChange={() => handleMultiSelect("types", type)}
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-sm cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              Level
              {filters.levels.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.levels.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="space-y-2">
              {levels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level}`}
                    checked={filters.levels.includes(level)}
                    onCheckedChange={() => handleMultiSelect("levels", level)}
                  />
                  <Label
                    htmlFor={`level-${level}`}
                    className="text-sm cursor-pointer"
                  >
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover
          open={isStudentFiltersOpen}
          onOpenChange={setIsStudentFiltersOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <GraduationCap className="h-4 w-4" />
              Student Filters
              {filters.departments.length +
                filters.classes.length +
                filters.years.length +
                filters.semesters.length >
                0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.departments.length +
                    filters.classes.length +
                    filters.years.length +
                    filters.semesters.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="grid gap-4">
              {/* Department Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Department
                </Label>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {departments.map((dept) => (
                    <div key={dept} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dept-${dept}`}
                        checked={filters.departments.includes(dept)}
                        onCheckedChange={() =>
                          handleMultiSelect("departments", dept)
                        }
                      />
                      <Label
                        htmlFor={`dept-${dept}`}
                        className="text-sm cursor-pointer"
                      >
                        {dept}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Class</Label>
                <div className="flex flex-wrap gap-2">
                  {classes.map((cls) => (
                    <Button
                      key={cls}
                      variant={
                        filters.classes.includes(cls) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleMultiSelect("classes", cls)}
                      className="text-xs"
                    >
                      {cls}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Year Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Year
                </Label>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <Button
                      key={year}
                      variant={
                        filters.years.includes(year) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleNumericMultiSelect("years", year)}
                    >
                      Year {year}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Semester Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Semester</Label>
                <div className="flex flex-wrap gap-2">
                  {semesters.map((sem) => (
                    <Button
                      key={sem}
                      variant={
                        filters.semesters.includes(sem) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleNumericMultiSelect("semesters", sem)}
                      className="w-10"
                    >
                      {sem}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Advanced Filters */}
        <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <Button
                      key={status}
                      variant={
                        filters.statuses.includes(status)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleMultiSelect("statuses", status)}
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Duration</Label>
                <div className="flex flex-wrap gap-2">
                  {durations.map((duration) => (
                    <Button
                      key={duration}
                      variant={
                        filters.durations.includes(duration)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleMultiSelect("durations", duration)}
                    >
                      {duration}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Assignment Status</Label>
                <Select
                  value={filters.assignmentStatus}
                  onValueChange={(value) =>
                    onFiltersChange({ ...filters, assignmentStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="assigned">Assigned Only</SelectItem>
                    <SelectItem value="unassigned">Unassigned Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2 ml-auto">
          <Label className="text-sm text-muted-foreground">Group by:</Label>
          <Select value={groupBy} onValueChange={onGroupByChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select grouping" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Grouping</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="type">Type</SelectItem>
              <SelectItem value="level">Level</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="studentDepartment">Department</SelectItem>
              <SelectItem value="studentClass">Class</SelectItem>
              <SelectItem value="studentYear">Year</SelectItem>
              <SelectItem value="studentSemester">Semester</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.search || activeFiltersCount > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter("search")}
              />
            </Badge>
          )}
          {filters.categories.map((cat) => (
            <Badge key={cat} variant="secondary" className="gap-1">
              {cat}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter("categories", cat)}
              />
            </Badge>
          ))}
          {filters.types.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              {type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter("types", type)}
              />
            </Badge>
          ))}
          {filters.levels.map((level) => (
            <Badge key={level} variant="secondary" className="gap-1">
              {level}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter("levels", level)}
              />
            </Badge>
          ))}
          {filters.statuses.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="gap-1 capitalize"
            >
              {status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter("statuses", status)}
              />
            </Badge>
          ))}
          {filters.durations.map((duration) => (
            <Badge key={duration} variant="secondary" className="gap-1">
              {duration}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter("durations", duration)}
              />
            </Badge>
          ))}
          {filters.departments.map((dept) => (
            <Badge
              key={dept}
              variant="outline"
              className="gap-1 border-blue-500 text-blue-700 dark:text-blue-300"
            >
              Dept: {dept}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter("departments", dept)}
              />
            </Badge>
          ))}
          {filters.classes.map((cls) => (
            <Badge
              key={cls}
              variant="outline"
              className="gap-1 border-green-500 text-green-700 dark:text-green-300"
            >
              Class: {cls}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter("classes", cls)}
              />
            </Badge>
          ))}
          {filters.years.map((year) => (
            <Badge
              key={year}
              variant="outline"
              className="gap-1 border-orange-500 text-orange-700 dark:text-orange-300"
            >
              Year {year}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter("years", year)}
              />
            </Badge>
          ))}
          {filters.semesters.map((sem) => (
            <Badge
              key={sem}
              variant="outline"
              className="gap-1 border-purple-500 text-purple-700 dark:text-purple-300"
            >
              Sem {sem}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter("semesters", sem)}
              />
            </Badge>
          ))}
          {filters.assignmentStatus !== "all" && (
            <Badge variant="secondary" className="gap-1 capitalize">
              {filters.assignmentStatus}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter("assignmentStatus")}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
