"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  Users,
  GraduationCap,
  UserPlus,
} from "lucide-react";
import FacultySelector from "./faculty-selector";

export default function ActivityTable({
  activities,
  faculty,
  groupBy,
  onAssignFaculty,
  onBulkAssign,
}) {
  const [sorting, setSorting] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [grouping, setGrouping] = useState([]);

  useEffect(() => {
    if (groupBy === "none") {
      setGrouping([]);
    } else if (groupBy === "studentDepartment") {
      setGrouping(["student_department"]);
    } else if (groupBy === "studentClass") {
      setGrouping(["student_class"]);
    } else if (groupBy === "studentYear") {
      setGrouping(["student_year"]);
    } else if (groupBy === "studentSemester") {
      setGrouping(["student_semester"]);
    } else {
      setGrouping([groupBy]);
    }
  }, [groupBy]);

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableGrouping: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Activity Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        id: "student",
        header: "Student",
        cell: ({ row }) => {
          const student = row.original.student;
          return (
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-primary/10">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{student.name}</span>
                <span className="text-xs text-muted-foreground">
                  {student.rollNumber}
                </span>
              </div>
            </div>
          );
        },
        enableGrouping: false,
      },
      {
        id: "student_department",
        accessorFn: (row) => row.student.department,
        header: "Department",
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs">
            {row.original.student.department}
          </Badge>
        ),
      },
      {
        id: "student_class",
        accessorFn: (row) => row.student.class,
        header: "Class",
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-xs">
            {row.original.student.class}
          </Badge>
        ),
      },
      {
        id: "student_year",
        accessorFn: (row) => `Year ${row.student.year}`,
        header: "Year",
        cell: ({ row }) => (
          <span className="text-sm">Year {row.original.student.year}</span>
        ),
      },
      {
        id: "student_semester",
        accessorFn: (row) => `Semester ${row.student.semester}`,
        header: "Semester",
        cell: ({ row }) => (
          <span className="text-sm">Sem {row.original.student.semester}</span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue("category")}</Badge>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="secondary">{row.getValue("type")}</Badge>
        ),
      },
      {
        accessorKey: "level",
        header: "Level",
        cell: ({ row }) => {
          const level = row.getValue("level");
          const colorMap = {
            Beginner:
              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            Intermediate:
              "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            Advanced:
              "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
            Expert: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                colorMap[level] || ""
              }`}
            >
              {level}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status");
          const colorMap = {
            active: "bg-green-500",
            inactive: "bg-gray-500",
            pending: "bg-yellow-500",
          };
          return (
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${colorMap[status] || ""}`}
              />
              <span className="capitalize">{status}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "assignedFacultyId",
        header: "Assigned Faculty",
        cell: ({ row }) => {
          const facultyId = row.getValue("assignedFacultyId");
          const assignedFaculty = faculty.find((f) => f.id === facultyId);

          if (assignedFaculty) {
            return (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {assignedFaculty.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{assignedFaculty.name}</span>
              </div>
            );
          }
          return (
            <span className="text-muted-foreground text-sm">Unassigned</span>
          );
        },
        enableGrouping: false,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="w-[180px]">
            <FacultySelector
              faculty={faculty}
              selectedFacultyId={row.original.assignedFacultyId}
              onSelect={(facultyId) =>
                onAssignFaculty(row.original.id, facultyId)
              }
              placeholder="Assign..."
            />
          </div>
        ),
        enableGrouping: false,
      },
    ],
    [faculty, onAssignFaculty]
  );

  const table = useReactTable({
    data: activities,
    columns,
    state: {
      sorting,
      expanded,
      rowSelection,
      grouping,
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row) => row.id,
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedActivityIds = selectedRows.map((row) => row.original.id);

  // const visibleColumnIds = useMemo(() => {
  //   const hideWhenGrouped = {
  //     student_department: ["student_department"],
  //     student_class: ["student_class"],
  //     student_year: ["student_year"],
  //     student_semester: ["student_semester"],
  //   };
  //   const toHide = grouping.flatMap((g) => hideWhenGrouped[g] || []);
  //   return columns
  //     .map((c) => ("id" in c ? c.id : c.accessorKey))
  //     .filter((id) => !toHide.includes(id));
  // }, [grouping, columns]);

  return (
    <div className="space-y-4">
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {selectedRows.length} activities selected
            </span>
          </div>
          <div className="w-[280px]">
            <FacultySelector
              faculty={faculty}
              selectedFacultyId={null}
              onSelect={(facultyId) => {
                onBulkAssign(selectedActivityIds, facultyId);
                setRowSelection({});
              }}
              placeholder="Assign all to faculty..."
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRowSelection({})}
          >
            Clear selection
          </Button>
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // Hide columns that are being grouped
                  if (grouping.includes(header.column.id)) return null;
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                if (row.getIsGrouped()) {
                  const groupActivityIds = row.subRows.map(
                    (r) => r.original.id
                  );
                  return (
                    <TableRow
                      key={row.id}
                      className="bg-muted/50 hover:bg-muted"
                    >
                      <TableCell colSpan={columns.length - grouping.length}>
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => row.toggleExpanded()}
                            className="gap-2"
                          >
                            {row.getIsExpanded() ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <GraduationCap className="h-4 w-4 text-primary" />
                            <span className="font-semibold">
                              {row.groupingValue}
                            </span>
                            <Badge variant="secondary">
                              {row.subRows.length} activities
                            </Badge>
                          </Button>
                          {/* Assign faculty to entire group */}
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                            <div className="w-[200px]">
                              <FacultySelector
                                faculty={faculty}
                                selectedFacultyId={null}
                                onSelect={(facultyId) =>
                                  onBulkAssign(groupActivityIds, facultyId)
                                }
                                placeholder="Assign to group..."
                              />
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      // Hide cells for grouped columns
                      if (grouping.includes(cell.column.id)) return null;
                      return (
                        <TableCell key={cell.id}>
                          {cell.getIsGrouped()
                            ? null
                            : cell.getIsAggregated()
                            ? flexRender(
                                cell.column.columnDef.aggregatedCell ??
                                  cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            : cell.getIsPlaceholder()
                            ? null
                            : flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No activities found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {table.getFilteredRowModel().rows.length} of {activities.length}{" "}
        activities
      </div>
    </div>
  );
}
