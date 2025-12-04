import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  GraduationCap,
  BookOpen,
  Layers,
  Sparkles,
  Edit2,
  Check,
  X,
  Clock,
  Users,
  Building,
  Calendar,
  Hash,
} from "lucide-react"

export function AcademicHierarchy({
  programs,
  departments,
  config,
  onProgramsChange,
  onDepartmentsChange,
}) {
  const [expandedItems, setExpandedItems] = useState(new Set())
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [addingTo, setAddingTo] = useState(null)
  const [newItemData, setNewItemData] = useState({})

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const toggleExpand = (id) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const startEdit = (id, value) => {
    setEditingId(id)
    setEditValue(value)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue("")
  }

  const resetAddForm = () => {
    setAddingTo(null)
    setNewItemData({})
  }

  // Department CRUD
  const addDepartment = () => {
    if (!newItemData.name?.trim()) return
    onDepartmentsChange([...departments, { id: generateId(), name: newItemData.name, instituteId: "" }])
    resetAddForm()
  }

  const updateDepartment = (id, name) => {
    onDepartmentsChange(departments.map((d) => (d.id === id ? { ...d, name } : d)))
    cancelEdit()
  }

  const deleteDepartment = (id) => {
    onDepartmentsChange(departments.filter((d) => d.id !== id))
  }

  // Program CRUD
  const addProgram = () => {
    if (!newItemData.name?.trim()) return
    onProgramsChange([...programs, { id: generateId(), name: newItemData.name, instituteId: "", degrees: [] }])
    resetAddForm()
  }

  const updateProgram = (id, name) => {
    onProgramsChange(programs.map((p) => (p.id === id ? { ...p, name } : p)))
    cancelEdit()
  }

  const deleteProgram = (id) => {
    onProgramsChange(programs.filter((p) => p.id !== id))
  }

  // Degree CRUD
  const addDegree = (programId) => {
    if (!newItemData.name?.trim()) return
    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              degrees: [
                ...p.degrees,
                {
                  id: generateId(),
                  name: newItemData.name,
                  programId,
                  duration: Number(newItemData.duration) || 4,
                  durationUnit: newItemData.durationUnit || "Years",
                  branches: [],
                  yearLevels: [],
                },
              ],
            }
          : p,
      ),
    )
    resetAddForm()
  }

  const updateDegree = (programId, degreeId, updates) => {
    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? { ...p, degrees: p.degrees.map((d) => (d.id === degreeId ? { ...d, ...updates } : d)) }
          : p,
      ),
    )
  }

  const deleteDegree = (programId, degreeId) => {
    onProgramsChange(
      programs.map((p) => (p.id === programId ? { ...p, degrees: p.degrees.filter((d) => d.id !== degreeId) } : p)),
    )
  }

  // Branch CRUD
  const addBranch = (programId, degreeId) => {
    if (!newItemData.name?.trim() || !newItemData.departmentId) return
    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === degreeId
                  ? {
                      ...d,
                      branches: [
                        ...d.branches,
                        {
                          id: generateId(),
                          name: newItemData.name,
                          degreeId,
                          departmentId: newItemData.departmentId,
                          specializations: [],
                        },
                      ],
                    }
                  : d,
              ),
            }
          : p,
      ),
    )
    resetAddForm()
  }

  const deleteBranch = (programId, degreeId, branchId) => {
    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === degreeId ? { ...d, branches: d.branches.filter((b) => b.id !== branchId) } : d,
              ),
            }
          : p,
      ),
    )
  }

  // Specialization CRUD
  const addSpecialization = (programId, degreeId, branchId) => {
    if (!newItemData.name?.trim()) return
    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === degreeId
                  ? {
                      ...d,
                      branches: d.branches.map((b) =>
                        b.id === branchId
                          ? {
                              ...b,
                              specializations: [
                                ...b.specializations,
                                { id: generateId(), name: newItemData.name, branchId },
                              ],
                            }
                          : b,
                      ),
                    }
                  : d,
              ),
            }
          : p,
      ),
    )
    resetAddForm()
  }

  const deleteSpecialization = (programId, degreeId, branchId, specId) => {
    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === degreeId
                  ? {
                      ...d,
                      branches: d.branches.map((b) =>
                        b.id === branchId
                          ? { ...b, specializations: b.specializations.filter((s) => s.id !== specId) }
                          : b,
                      ),
                    }
                  : d,
              ),
            }
          : p,
      ),
    )
  }

  // YearLevel CRUD
  const addYearLevel = (programId, degreeId) => {
    if (!newItemData.year) return
    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === degreeId
                  ? {
                      ...d,
                      yearLevels: [
                        ...d.yearLevels,
                        { id: generateId(), year: Number(newItemData.year), degreeId, semesters: [] },
                      ],
                    }
                  : d,
              ),
            }
          : p,
      ),
    )
    resetAddForm()
  }

  const deleteYearLevel = (programId, degreeId, yearId) => {
    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === degreeId ? { ...d, yearLevels: d.yearLevels.filter((y) => y.id !== yearId) } : d,
              ),
            }
          : p,
      ),
    )
  }

  // Semester CRUD
  const addSemester = (programId, degreeId, yearId) => {
    if (!newItemData.semNumber) return
    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === degreeId
                  ? {
                      ...d,
                      yearLevels: d.yearLevels.map((y) =>
                        y.id === yearId
                          ? {
                              ...y,
                              semesters: [
                                ...y.semesters,
                                { id: generateId(), semNumber: Number(newItemData.semNumber), yearId, sections: [] },
                              ],
                            }
                          : y,
                      ),
                    }
                  : d,
              ),
            }
          : p,
      ),
    )
    resetAddForm()
  }

  const deleteSemester = (programId, degreeId, yearId, semId) => {
    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === degreeId
                  ? {
                      ...d,
                      yearLevels: d.yearLevels.map((y) =>
                        y.id === yearId ? { ...y, semesters: y.semesters.filter((s) => s.id !== semId) } : y,
                      ),
                    }
                  : d,
              ),
            }
          : p,
      ),
    )
  }

  // Section CRUD
  const addSection = (programId, degreeId, yearId, semId, specId) => {
    if (!newItemData.name?.trim() || !newItemData.seatCapacity) return
    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === degreeId
                  ? {
                      ...d,
                      yearLevels: d.yearLevels.map((y) =>
                        y.id === yearId
                          ? {
                              ...y,
                              semesters: y.semesters.map((sem) =>
                                sem.id === semId
                                  ? {
                                      ...sem,
                                      sections: [
                                        ...sem.sections,
                                        {
                                          id: generateId(),
                                          name: newItemData.name,
                                          seatCapacity: Number(newItemData.seatCapacity),
                                          specializationId: specId,
                                          semesterId: semId,
                                        },
                                      ],
                                    }
                                  : sem,
                              ),
                            }
                          : y,
                      ),
                    }
                  : d,
              ),
            }
          : p,
      ),
    )
    resetAddForm()
  }

  const deleteSection = (programId, degreeId, yearId, semId, sectionId) => {
    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === degreeId
                  ? {
                      ...d,
                      yearLevels: d.yearLevels.map((y) =>
                        y.id === yearId
                          ? {
                              ...y,
                              semesters: y.semesters.map((sem) =>
                                sem.id === semId
                                  ? { ...sem, sections: sem.sections.filter((sec) => sec.id !== sectionId) }
                                  : sem,
                              ),
                            }
                          : y,
                      ),
                    }
                  : d,
              ),
            }
          : p,
      ),
    )
  }

  // Helper to get department name
  const getDepartmentName = (deptId) => {
    return departments.find((d) => d.id === deptId)?.name || "Unknown Dept"
  }

  // Render inline add form
  const renderAddForm = (type, onAdd) => {
    if (type === "department" || type === "program" || type === "specialization") {
      return (
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
          <Input
            placeholder={`Enter ${type} name`}
            value={newItemData.name || ""}
            onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
            className="h-8 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") onAdd()
              if (e.key === "Escape") resetAddForm()
            }}
          />
          <Button size="sm" onClick={onAdd}>
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={resetAddForm}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )
    }

    if (type === "degree") {
      return (
        <div className="p-4 bg-muted/30 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Degree Name</Label>
              <Input
                placeholder="e.g., B.Tech, MBA"
                value={newItemData.name || ""}
                onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Duration</Label>
              <Input
                type="number"
                min="1"
                placeholder="4"
                value={newItemData.duration || ""}
                onChange={(e) => setNewItemData({ ...newItemData, duration: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Duration Unit</Label>
              <Select
                value={newItemData.durationUnit || "Years"}
                onValueChange={(val) => setNewItemData({ ...newItemData, durationUnit: val })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Years">Years</SelectItem>
                  <SelectItem value="Months">Months</SelectItem>
                  <SelectItem value="Semesters">Semesters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={resetAddForm}>
              Cancel
            </Button>
            <Button size="sm" onClick={onAdd}>
              Add Degree
            </Button>
          </div>
        </div>
      )
    }

    if (type === "branch") {
      return (
        <div className="p-4 bg-muted/30 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Branch Name</Label>
              <Input
                placeholder="e.g., Computer Science"
                value={newItemData.name || ""}
                onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Department</Label>
              <Select
                value={newItemData.departmentId || ""}
                onValueChange={(val) => setNewItemData({ ...newItemData, departmentId: val })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={resetAddForm}>
              Cancel
            </Button>
            <Button size="sm" onClick={onAdd}>
              Add Branch
            </Button>
          </div>
        </div>
      )
    }

    if (type === "yearLevel") {
      return (
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
          <Label className="text-xs whitespace-nowrap">Year:</Label>
          <Input
            type="number"
            min="1"
            max="6"
            placeholder="1"
            value={newItemData.year || ""}
            onChange={(e) => setNewItemData({ ...newItemData, year: e.target.value })}
            className="h-8 text-sm w-20"
          />
          <Button size="sm" onClick={onAdd}>
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={resetAddForm}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )
    }

    if (type === "semester") {
      return (
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
          <Label className="text-xs whitespace-nowrap">Semester #:</Label>
          <Input
            type="number"
            min="1"
            max="12"
            placeholder="1"
            value={newItemData.semNumber || ""}
            onChange={(e) => setNewItemData({ ...newItemData, semNumber: e.target.value })}
            className="h-8 text-sm w-20"
          />
          <Button size="sm" onClick={onAdd}>
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={resetAddForm}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )
    }

    if (type === "section") {
      return (
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg flex-wrap">
          <div className="flex items-center gap-2">
            <Label className="text-xs whitespace-nowrap">Name:</Label>
            <Input
              placeholder="A, B, C"
              value={newItemData.name || ""}
              onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
              className="h-8 text-sm w-20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs whitespace-nowrap">Seats:</Label>
            <Input
              type="number"
              min="1"
              placeholder="60"
              value={newItemData.seatCapacity || ""}
              onChange={(e) => setNewItemData({ ...newItemData, seatCapacity: e.target.value })}
              className="h-8 text-sm w-20"
            />
          </div>
          <Button size="sm" onClick={onAdd}>
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={resetAddForm}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )
    }

    return null
  }

  return (
    <Tabs defaultValue="structure" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="departments">Departments</TabsTrigger>
        <TabsTrigger value="structure">Academic Structure</TabsTrigger>
        <TabsTrigger value="sections">Year/Semester/Sections</TabsTrigger>
      </TabsList>

      {/* Departments Tab */}
      <TabsContent value="departments" className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Manage institute departments</p>
          {config.departments.allowAdd && (
            <Button size="sm" variant="outline" onClick={() => setAddingTo({ type: "department", parentIds: [] })}>
              <Plus className="h-3 w-3 mr-1" /> Add Department
            </Button>
          )}
        </div>

        {addingTo?.type === "department" && renderAddForm("department", addDepartment)}

        <div className="space-y-2">
          {departments.map((dept) => (
            <div key={dept.id} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card group">
              <Building className="h-4 w-4 text-primary" />
              {editingId === dept.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updateDepartment(dept.id, editValue)
                      if (e.key === "Escape") cancelEdit()
                    }}
                  />
                  <Button size="sm" variant="ghost" onClick={() => updateDepartment(dept.id, editValue)}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium">{dept.name}</span>
                  {config.departments.editable && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100"
                      onClick={() => startEdit(dept.id, dept.name)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                  {config.departments.allowDelete && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-destructive"
                      onClick={() => deleteDepartment(dept.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </>
              )}
            </div>
          ))}
          {departments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No departments added yet. Add your first department to get started.
            </p>
          )}
        </div>
      </TabsContent>

      {/* Academic Structure Tab */}
      <TabsContent value="structure" className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Programs, Degrees, Branches, and Specializations</p>
          {config.programs.allowAdd && (
            <Button size="sm" variant="outline" onClick={() => setAddingTo({ type: "program", parentIds: [] })}>
              <Plus className="h-3 w-3 mr-1" /> Add Program
            </Button>
          )}
        </div>

        {addingTo?.type === "program" && renderAddForm("program", addProgram)}

        <div className="space-y-3">
          {programs.map((program) => (
            <div key={program.id} className="border border-border rounded-lg bg-card overflow-hidden">
              {/* Program Header */}
              <div className="flex items-center gap-2 p-3 bg-muted/30 group">
                <button onClick={() => toggleExpand(program.id)} className="p-0.5 hover:bg-muted rounded">
                  {expandedItems.has(program.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="flex-1 font-medium">{program.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {program.degrees.length} Degree{program.degrees.length !== 1 ? "s" : ""}
                </Badge>
                {config.programs.editable && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100"
                    onClick={() => startEdit(program.id, program.name)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
                {config.programs.allowDelete && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-destructive"
                    onClick={() => deleteProgram(program.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Program Content */}
              <Collapsible open={expandedItems.has(program.id)}>
                <CollapsibleContent>
                  <div className="p-3 space-y-3 border-t border-border">
                    {/* Add Degree Button */}
                    {config.degrees.allowAdd && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setAddingTo({ type: "degree", parentIds: [program.id] })}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Degree
                      </Button>
                    )}

                    {addingTo?.type === "degree" &&
                      addingTo.parentIds[0] === program.id &&
                      renderAddForm("degree", () => addDegree(program.id))}

                    {/* Degrees */}
                    {program.degrees.map((degree) => (
                      <div key={degree.id} className="border border-border rounded-lg overflow-hidden ml-4">
                        {/* Degree Header */}
                        <div className="flex items-center gap-2 p-3 bg-card group">
                          <button onClick={() => toggleExpand(degree.id)} className="p-0.5 hover:bg-muted rounded">
                            {expandedItems.has(degree.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-sm">{degree.name}</span>
                          <Badge variant="outline" className="text-xs gap-1">
                            <Clock className="h-3 w-3" />
                            {degree.duration} {degree.durationUnit}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {degree.branches.length} Branch{degree.branches.length !== 1 ? "es" : ""}
                          </Badge>
                          <div className="flex-1" />
                          {config.degrees.allowDelete && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-destructive"
                              onClick={() => deleteDegree(program.id, degree.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        {/* Degree Content - Branches */}
                        <Collapsible open={expandedItems.has(degree.id)}>
                          <CollapsibleContent>
                            <div className="p-3 space-y-3 border-t border-border bg-muted/20">
                              {config.branches.allowAdd && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full bg-transparent"
                                  onClick={() => setAddingTo({ type: "branch", parentIds: [program.id, degree.id] })}
                                >
                                  <Plus className="h-3 w-3 mr-1" /> Add Branch
                                </Button>
                              )}

                              {addingTo?.type === "branch" &&
                                addingTo.parentIds[1] === degree.id &&
                                renderAddForm("branch", () => addBranch(program.id, degree.id))}

                              {/* Branches */}
                              {degree.branches.map((branch) => (
                                <div key={branch.id} className="border border-border rounded-lg overflow-hidden ml-4">
                                  {/* Branch Header */}
                                  <div className="flex items-center gap-2 p-3 bg-card group">
                                    <button
                                      onClick={() => toggleExpand(branch.id)}
                                      className="p-0.5 hover:bg-muted rounded"
                                    >
                                      {expandedItems.has(branch.id) ? (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </button>
                                    <Layers className="h-4 w-4 text-green-500" />
                                    <span className="font-medium text-sm">{branch.name}</span>
                                    <Badge variant="outline" className="text-xs gap-1">
                                      <Building className="h-3 w-3" />
                                      {getDepartmentName(branch.departmentId)}
                                    </Badge>
                                    <div className="flex-1" />
                                    {config.branches.allowDelete && (
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-destructive"
                                        onClick={() => deleteBranch(program.id, degree.id, branch.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>

                                  {/* Branch Content - Specializations */}
                                  <Collapsible open={expandedItems.has(branch.id)}>
                                    <CollapsibleContent>
                                      <div className="p-3 space-y-2 border-t border-border bg-muted/10">
                                        {config.specializations.allowAdd && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full bg-transparent"
                                            onClick={() =>
                                              setAddingTo({
                                                type: "specialization",
                                                parentIds: [program.id, degree.id, branch.id],
                                              })
                                            }
                                          >
                                            <Plus className="h-3 w-3 mr-1" /> Add Specialization
                                          </Button>
                                        )}

                                        {addingTo?.type === "specialization" &&
                                          addingTo.parentIds[2] === branch.id &&
                                          renderAddForm("specialization", () =>
                                            addSpecialization(program.id, degree.id, branch.id),
                                          )}

                                        {/* Specializations */}
                                        {branch.specializations.map((spec) => (
                                          <div
                                            key={spec.id}
                                            className="flex items-center gap-2 p-2 bg-card rounded-lg border border-border ml-4 group"
                                          >
                                            <Sparkles className="h-4 w-4 text-amber-500" />
                                            <span className="flex-1 text-sm">{spec.name}</span>
                                            {config.specializations.allowDelete && (
                                              <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-destructive"
                                                onClick={() =>
                                                  deleteSpecialization(program.id, degree.id, branch.id, spec.id)
                                                }
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
                                            )}
                                          </div>
                                        ))}
                                        {branch.specializations.length === 0 && (
                                          <p className="text-xs text-muted-foreground text-center py-2">
                                            No specializations added
                                          </p>
                                        )}
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </div>
                              ))}
                              {degree.branches.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                  No branches added. Add departments first, then add branches.
                                </p>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))}
                    {program.degrees.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No degrees added yet</p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
          {programs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No programs added yet. Add your first program (e.g., UG, PG, Diploma) to get started.
            </p>
          )}
        </div>
      </TabsContent>

      {/* Year/Semester/Sections Tab */}
      <TabsContent value="sections" className="space-y-4">
        <p className="text-sm text-muted-foreground">Manage year levels, semesters, and sections for each degree</p>

        {programs.map((program) =>
          program.degrees.map((degree) => (
            <Card key={degree.id} className="border-border">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {program.name} - {degree.name}
                  <Badge variant="outline" className="ml-auto">
                    {degree.duration} {degree.durationUnit}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {config.yearLevels.allowAdd && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setAddingTo({ type: "yearLevel", parentIds: [program.id, degree.id] })}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Year Level
                  </Button>
                )}

                {addingTo?.type === "yearLevel" &&
                  addingTo.parentIds[1] === degree.id &&
                  renderAddForm("yearLevel", () => addYearLevel(program.id, degree.id))}

                {/* Year Levels */}
                {degree.yearLevels
                  .sort((a, b) => a.year - b.year)
                  .map((yearLevel) => (
                    <div key={yearLevel.id} className="border border-border rounded-lg overflow-hidden">
                      <div className="flex items-center gap-2 p-3 bg-muted/30 group">
                        <button onClick={() => toggleExpand(yearLevel.id)} className="p-0.5 hover:bg-muted rounded">
                          {expandedItems.has(yearLevel.id) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">Year {yearLevel.year}</span>
                        <Badge variant="secondary" className="text-xs">
                          {yearLevel.semesters.length} Semester{yearLevel.semesters.length !== 1 ? "s" : ""}
                        </Badge>
                        <div className="flex-1" />
                        {config.yearLevels.allowDelete && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-destructive"
                            onClick={() => deleteYearLevel(program.id, degree.id, yearLevel.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      <Collapsible open={expandedItems.has(yearLevel.id)}>
                        <CollapsibleContent>
                          <div className="p-3 space-y-3 border-t border-border">
                            {config.semesters.allowAdd && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full bg-transparent"
                                onClick={() =>
                                  setAddingTo({
                                    type: "semester",
                                    parentIds: [program.id, degree.id, yearLevel.id],
                                  })
                                }
                              >
                                <Plus className="h-3 w-3 mr-1" /> Add Semester
                              </Button>
                            )}

                            {addingTo?.type === "semester" &&
                              addingTo.parentIds[2] === yearLevel.id &&
                              renderAddForm("semester", () => addSemester(program.id, degree.id, yearLevel.id))}

                            {/* Semesters */}
                            {yearLevel.semesters
                              .sort((a, b) => a.semNumber - b.semNumber)
                              .map((semester) => (
                                <div key={semester.id} className="border border-border rounded-lg overflow-hidden ml-4">
                                  <div className="flex items-center gap-2 p-3 bg-card group">
                                    <button
                                      onClick={() => toggleExpand(semester.id)}
                                      className="p-0.5 hover:bg-muted rounded"
                                    >
                                      {expandedItems.has(semester.id) ? (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </button>
                                    <Hash className="h-4 w-4 text-green-500" />
                                    <span className="font-medium text-sm">Semester {semester.semNumber}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {semester.sections.length} Section{semester.sections.length !== 1 ? "s" : ""}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs gap-1">
                                      <Users className="h-3 w-3" />
                                      {semester.sections.reduce((acc, s) => acc + s.seatCapacity, 0)} seats
                                    </Badge>
                                    <div className="flex-1" />
                                    {config.semesters.allowDelete && (
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-destructive"
                                        onClick={() => deleteSemester(program.id, degree.id, yearLevel.id, semester.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>

                                  <Collapsible open={expandedItems.has(semester.id)}>
                                    <CollapsibleContent>
                                      <div className="p-3 space-y-2 border-t border-border bg-muted/10">
                                        {/* Add Section - need to select specialization */}
                                        {config.sections.allowAdd && degree.branches.length > 0 && (
                                          <div className="space-y-2">
                                            <Label className="text-xs">Add Section for Specialization:</Label>
                                            <div className="flex flex-wrap gap-2">
                                              {degree.branches.flatMap((branch) =>
                                                branch.specializations.map((spec) => (
                                                  <Button
                                                    key={spec.id}
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                      setAddingTo({
                                                        type: "section",
                                                        parentIds: [
                                                          program.id,
                                                          degree.id,
                                                          yearLevel.id,
                                                          semester.id,
                                                          spec.id,
                                                        ],
                                                      })
                                                    }
                                                  >
                                                    <Plus className="h-3 w-3 mr-1" />
                                                    {spec.name}
                                                  </Button>
                                                )),
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        {addingTo?.type === "section" &&
                                          addingTo.parentIds[3] === semester.id &&
                                          renderAddForm("section", () =>
                                            addSection(
                                              program.id,
                                              degree.id,
                                              yearLevel.id,
                                              semester.id,
                                              addingTo.parentIds[4],
                                            ),
                                          )}

                                        {/* Sections */}
                                        {semester.sections.map((section) => {
                                          const spec = degree.branches
                                            .flatMap((b) => b.specializations)
                                            .find((s) => s.id === section.specializationId)

                                          return (
                                            <div
                                              key={section.id}
                                              className="flex items-center gap-2 p-2 bg-card rounded-lg border border-border group"
                                            >
                                              <Users className="h-4 w-4 text-amber-500" />
                                              <span className="font-medium text-sm">Section {section.name}</span>
                                              <Badge variant="outline" className="text-xs">
                                                {section.seatCapacity} seats
                                              </Badge>
                                              {spec && (
                                                <Badge variant="secondary" className="text-xs">
                                                  {spec.name}
                                                </Badge>
                                              )}
                                              <div className="flex-1" />
                                              {config.sections.allowDelete && (
                                                <Button
                                                  size="icon"
                                                  variant="ghost"
                                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-destructive"
                                                  onClick={() =>
                                                    deleteSection(
                                                      program.id,
                                                      degree.id,
                                                      yearLevel.id,
                                                      semester.id,
                                                      section.id,
                                                    )
                                                  }
                                                >
                                                  <Trash2 className="h-3 w-3" />
                                                </Button>
                                              )}
                                            </div>
                                          )
                                        })}
                                        {semester.sections.length === 0 && (
                                          <p className="text-xs text-muted-foreground text-center py-2">
                                            No sections added. Add specializations first.
                                          </p>
                                        )}
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </div>
                              ))}
                            {yearLevel.semesters.length === 0 && (
                              <p className="text-sm text-muted-foreground text-center py-2">No semesters added</p>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
                {degree.yearLevels.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No year levels added. Add year levels to manage semesters and sections.
                  </p>
                )}
              </CardContent>
            </Card>
          )),
        )}
        {programs.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Add programs and degrees in the Academic Structure tab first.
          </p>
        )}
      </TabsContent>
    </Tabs>
  )
}
