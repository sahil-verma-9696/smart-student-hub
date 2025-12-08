"use client"
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
  const [editValue, setEditValue] = useState({})
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

  const startEdit = (id, data) => {
    setEditingId(id)
    setEditValue(data)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue({})
  }

  const resetAddForm = () => {
    setAddingTo(null)
    setNewItemData({})
  }

  // Auto-generate year levels when degree duration changes
  const generateYearLevels = (duration, durationUnit, degreeId) => {
    const years = durationUnit === "Years" ? duration : Math.ceil(duration / 12)
    return Array.from({ length: years }, (_, i) => ({
      id: generateId(),
      year: i + 1,
      degreeId,
      semesters: [
        { id: generateId(), semNumber: i * 2 + 1, yearId: "", sections: [] },
        { id: generateId(), semNumber: i * 2 + 2, yearId: "", sections: [] },
      ],
    }))
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
    const duration = Number(newItemData.duration) || 4
    const durationUnit = newItemData.durationUnit || "Years"
    const degreeId = generateId()

    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              degrees: [
                ...p.degrees,
                {
                  id: degreeId,
                  name: newItemData.name,
                  programId,
                  duration,
                  durationUnit,
                  branches: [],
                  yearLevels: generateYearLevels(duration, durationUnit, degreeId),
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
          ? {
              ...p,
              degrees: p.degrees.map((d) => {
                if (d.id === degreeId) {
                  const newDegree = { ...d, ...updates }
                  // Regenerate year levels if duration changed
                  if (updates.duration !== undefined || updates.durationUnit !== undefined) {
                    newDegree.yearLevels = generateYearLevels(
                      updates.duration ?? d.duration,
                      updates.durationUnit ?? d.durationUnit,
                      degreeId,
                    )
                  }
                  return newDegree
                }
                return d
              }),
            }
          : p,
      ),
    )
    cancelEdit()
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

  const updateBranch = (
    programId,
    degreeId,
    branchId,
    updates,
  ) => {
    onProgramsChange(
      programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === degreeId
                  ? {
                      ...d,
                      branches: d.branches.map((b) => (b.id === branchId ? { ...b, ...updates } : b)),
                    }
                  : d,
              ),
            }
          : p,
      ),
    )
    cancelEdit()
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
                                {
                                  id: generateId(),
                                  name: newItemData.name,
                                  branchId,
                                  sectionIntake: Number(newItemData.sectionIntake) || 60,
                                },
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

  const updateSpecialization = (
    programId,
    degreeId,
    branchId,
    specId,
    updates,
  ) => {
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
                              specializations: b.specializations.map((s) =>
                                s.id === specId ? { ...s, ...updates } : s,
                              ),
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
    cancelEdit()
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

  // Section CRUD
  const addSection = (programId, degreeId, yearId, semId) => {
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

  const updateSection = (
    programId,
    degreeId,
    yearId,
    semId,
    sectionId,
    updates,
  ) => {
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
                                      sections: sem.sections.map((sec) =>
                                        sec.id === sectionId ? { ...sec, ...updates } : sec,
                                      ),
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
    cancelEdit()
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

  // Add Form Renderer
  const renderAddForm = (type, onAdd) => {
    if (type === "department" || type === "program") {
      return (
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
          <Input
            placeholder={`Enter ${type} name`}
            value={newItemData.name || ""}
            onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
            className="h-8 text-sm flex-1"
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
        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Degree Name</Label>
              <Input
                placeholder="e.g., B.Tech, M.Tech, MBA"
                value={newItemData.name || ""}
                onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                className="h-8 text-sm mt-1"
                autoFocus
              />
            </div>
            <div>
              <Label className="text-xs">Duration</Label>
              <Input
                type="number"
                min="1"
                placeholder="4"
                value={newItemData.duration || ""}
                onChange={(e) => setNewItemData({ ...newItemData, duration: e.target.value })}
                className="h-8 text-sm mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Unit</Label>
              <Select
                value={newItemData.durationUnit || "Years"}
                onValueChange={(v) => setNewItemData({ ...newItemData, durationUnit: v })}
              >
                <SelectTrigger className="h-8 text-sm mt-1">
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
        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Branch Name</Label>
              <Input
                placeholder="e.g., Computer Science"
                value={newItemData.name || ""}
                onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                className="h-8 text-sm mt-1"
                autoFocus
              />
            </div>
            <div>
              <Label className="text-xs">Department</Label>
              <Select
                value={newItemData.departmentId || ""}
                onValueChange={(v) => setNewItemData({ ...newItemData, departmentId: v })}
              >
                <SelectTrigger className="h-8 text-sm mt-1">
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
            <Button size="sm" onClick={onAdd} disabled={!newItemData.name || !newItemData.departmentId}>
              Add Branch
            </Button>
          </div>
        </div>
      )
    }

    if (type === "specialization") {
      return (
        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Specialization Name</Label>
              <Input
                placeholder="e.g., AI & ML, Data Science"
                value={newItemData.name || ""}
                onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                className="h-8 text-sm mt-1"
                autoFocus
              />
            </div>
            <div>
              <Label className="text-xs">Section Intake (Students)</Label>
              <Input
                type="number"
                min="1"
                placeholder="60"
                value={newItemData.sectionIntake || ""}
                onChange={(e) => setNewItemData({ ...newItemData, sectionIntake: e.target.value })}
                className="h-8 text-sm mt-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={resetAddForm}>
              Cancel
            </Button>
            <Button size="sm" onClick={onAdd}>
              Add Specialization
            </Button>
          </div>
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
              autoFocus
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

  // Get department name helper
  const getDepartmentName = (departmentId) => {
    return departments.find((d) => d.id === departmentId)?.name || "Unknown"
  }

  return (
    <Tabs defaultValue="departments" className="w-full">
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
                    value={editValue.name || ""}
                    onChange={(e) => setEditValue({ ...editValue, name: e.target.value })}
                    className="h-8 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updateDepartment(dept.id, editValue.name)
                      if (e.key === "Escape") cancelEdit()
                    }}
                  />
                  <Button size="sm" variant="ghost" onClick={() => updateDepartment(dept.id, editValue.name)}>
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
                      onClick={() => startEdit(dept.id, { name: dept.name })}
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
            <Card key={program.id} className="border-border overflow-hidden">
              {/* Program Header */}
              <div className="flex items-center gap-2 p-3 bg-muted/50 group">
                <button onClick={() => toggleExpand(program.id)} className="p-0.5 hover:bg-muted rounded">
                  {expandedItems.has(program.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                <GraduationCap className="h-4 w-4 text-primary" />

                {editingId === program.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editValue.name || ""}
                      onChange={(e) => setEditValue({ ...editValue, name: e.target.value })}
                      className="h-8 text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") updateProgram(program.id, editValue.name)
                        if (e.key === "Escape") cancelEdit()
                      }}
                    />
                    <Button size="sm" variant="ghost" onClick={() => updateProgram(program.id, editValue.name)}>
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-sm">{program.name}</span>
                    <Badge variant="secondary" className="text-xs ml-2">
                      {program.degrees.length} Degree{program.degrees.length !== 1 ? "s" : ""}
                    </Badge>
                    <div className="flex-1" />
                    {config.programs.editable && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100"
                        onClick={() => startEdit(program.id, { name: program.name })}
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
                  </>
                )}
              </div>

              {/* Program Content */}
              <Collapsible open={expandedItems.has(program.id)}>
                <CollapsibleContent>
                  <div className="p-3 space-y-3 border-t border-border">
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
                      <div key={degree.id} className="border border-border rounded-lg overflow-hidden">
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

                          {editingId === degree.id ? (
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Input
                                  value={editValue.name || ""}
                                  onChange={(e) => setEditValue({ ...editValue, name: e.target.value })}
                                  className="h-8 text-sm w-40"
                                  placeholder="Degree name"
                                  autoFocus
                                />
                                <Input
                                  type="number"
                                  min="1"
                                  value={editValue.duration || ""}
                                  onChange={(e) => setEditValue({ ...editValue, duration: e.target.value })}
                                  className="h-8 text-sm w-20"
                                  placeholder="Duration"
                                />
                                <Select
                                  value={editValue.durationUnit || "Years"}
                                  onValueChange={(v) => setEditValue({ ...editValue, durationUnit: v })}
                                >
                                  <SelectTrigger className="h-8 text-sm w-28">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Years">Years</SelectItem>
                                    <SelectItem value="Months">Months</SelectItem>
                                    <SelectItem value="Semesters">Semesters</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    updateDegree(program.id, degree.id, {
                                      name: editValue.name,
                                      duration: Number(editValue.duration),
                                      durationUnit: editValue.durationUnit,
                                    })
                                  }
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <span className="font-medium text-sm">{degree.name}</span>
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {degree.duration} {degree.durationUnit}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {degree.branches.length} Branch{degree.branches.length !== 1 ? "es" : ""}
                              </Badge>
                              <div className="flex-1" />
                              {config.degrees.editable && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 opacity-0 group-hover:opacity-100"
                                  onClick={() =>
                                    startEdit(degree.id, {
                                      name: degree.name,
                                      duration: degree.duration,
                                      durationUnit: degree.durationUnit,
                                    })
                                  }
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              )}
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
                            </>
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
                                <div
                                  key={branch.id}
                                  className="border border-border rounded-lg overflow-hidden bg-card"
                                >
                                  {/* Branch Header */}
                                  <div className="flex items-center gap-2 p-3 group">
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
                                    <Layers className="h-4 w-4 text-orange-500" />

                                    {editingId === branch.id ? (
                                      <div className="flex-1 flex items-center gap-2 flex-wrap">
                                        <Input
                                          value={editValue.name || ""}
                                          onChange={(e) => setEditValue({ ...editValue, name: e.target.value })}
                                          className="h-8 text-sm w-40"
                                          autoFocus
                                        />
                                        <Select
                                          value={editValue.departmentId || ""}
                                          onValueChange={(v) => setEditValue({ ...editValue, departmentId: v })}
                                        >
                                          <SelectTrigger className="h-8 text-sm w-40">
                                            <SelectValue placeholder="Select dept" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {departments.map((dept) => (
                                              <SelectItem key={dept.id} value={dept.id}>
                                                {dept.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            updateBranch(program.id, degree.id, branch.id, {
                                              name: editValue.name,
                                              departmentId: editValue.departmentId,
                                            })
                                          }
                                        >
                                          <Check className="h-3 w-3" />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <>
                                        <span className="font-medium text-sm">{branch.name}</span>
                                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                                          <Building className="h-3 w-3" />
                                          {getDepartmentName(branch.departmentId)}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          {branch.specializations.length} Specialization
                                          {branch.specializations.length !== 1 ? "s" : ""}
                                        </Badge>
                                        <div className="flex-1" />
                                        {config.branches.editable && (
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 opacity-0 group-hover:opacity-100"
                                            onClick={() =>
                                              startEdit(branch.id, {
                                                name: branch.name,
                                                departmentId: branch.departmentId,
                                              })
                                            }
                                          >
                                            <Edit2 className="h-3 w-3" />
                                          </Button>
                                        )}
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
                                      </>
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
                                            className="flex items-center gap-2 p-2.5 border border-border rounded-lg bg-card group"
                                          >
                                            <Sparkles className="h-4 w-4 text-purple-500" />

                                            {editingId === spec.id ? (
                                              <div className="flex-1 flex items-center gap-2 flex-wrap">
                                                <Input
                                                  value={editValue.name || ""}
                                                  onChange={(e) => setEditValue({ ...editValue, name: e.target.value })}
                                                  className="h-8 text-sm w-40"
                                                  autoFocus
                                                />
                                                <div className="flex items-center gap-1">
                                                  <Users className="h-3 w-3 text-muted-foreground" />
                                                  <Input
                                                    type="number"
                                                    min="1"
                                                    value={editValue.sectionIntake || ""}
                                                    onChange={(e) =>
                                                      setEditValue({ ...editValue, sectionIntake: e.target.value })
                                                    }
                                                    className="h-8 text-sm w-20"
                                                    placeholder="Intake"
                                                  />
                                                </div>
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() =>
                                                    updateSpecialization(program.id, degree.id, branch.id, spec.id, {
                                                      name: editValue.name,
                                                      sectionIntake: Number(editValue.sectionIntake),
                                                    })
                                                  }
                                                >
                                                  <Check className="h-3 w-3" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                                  <X className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            ) : (
                                              <>
                                                <span className="text-sm">{spec.name}</span>
                                                <Badge variant="outline" className="text-xs flex items-center gap-1">
                                                  <Users className="h-3 w-3" />
                                                  {spec.sectionIntake} students/section
                                                </Badge>
                                                <div className="flex-1" />
                                                {config.specializations.editable && (
                                                  <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 opacity-0 group-hover:opacity-100"
                                                    onClick={() =>
                                                      startEdit(spec.id, {
                                                        name: spec.name,
                                                        sectionIntake: spec.sectionIntake,
                                                      })
                                                    }
                                                  >
                                                    <Edit2 className="h-3 w-3" />
                                                  </Button>
                                                )}
                                                {config.specializations.allowDelete && (
                                                  <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-destructive"
                                                    onClick={() =>
                                                      deleteSpecialization(program.id, degree.id, branch.id, spec.id)
                                                    }
                                                  >
                                                    <Trash2 className="h-3 w-3" />
                                                  </Button>
                                                )}
                                              </>
                                            )}
                                          </div>
                                        ))}

                                        {branch.specializations.length === 0 && (
                                          <p className="text-xs text-muted-foreground text-center py-4">
                                            No specializations yet
                                          </p>
                                        )}
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </div>
                              ))}

                              {degree.branches.length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-4">
                                  No branches yet. Add departments first, then add branches.
                                </p>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
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
        <p className="text-sm text-muted-foreground">
          Year levels are auto-generated based on degree duration. Manage semesters and sections here.
        </p>

        {programs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Add programs and degrees first in the Academic Structure tab.
          </p>
        ) : (
          programs.map((program) =>
            program.degrees.map((degree) => (
              <Card key={degree.id} className="border-border">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {program.name} - {degree.name}
                    <Badge variant="outline" className="ml-auto">
                      {degree.duration} {degree.durationUnit}
                    </Badge>
                    <Badge variant="secondary">
                      {degree.yearLevels.length} Year{degree.yearLevels.length !== 1 ? "s" : ""}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                        </div>

                        <Collapsible open={expandedItems.has(yearLevel.id)}>
                          <CollapsibleContent>
                            <div className="p-3 space-y-3 border-t border-border">
                              {/* Semesters */}
                              {yearLevel.semesters
                                .sort((a, b) => a.semNumber - b.semNumber)
                                .map((semester) => (
                                  <div key={semester.id} className="border border-border rounded-lg overflow-hidden">
                                    <div
                                      className="flex items-center gap-2 p-2.5 bg-card group cursor-pointer"
                                      onClick={() => toggleExpand(semester.id)}
                                    >
                                      {expandedItems.has(semester.id) ? (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                      )}
                                      <Hash className="h-4 w-4 text-green-500" />
                                      <span className="text-sm font-medium">Semester {semester.semNumber}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {semester.sections.length} Section{semester.sections.length !== 1 ? "s" : ""}
                                      </Badge>
                                      {semester.sections.length > 0 && (
                                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                          <Users className="h-3 w-3" />
                                          {semester.sections.reduce((sum, s) => sum + s.seatCapacity, 0)} total seats
                                        </Badge>
                                      )}
                                    </div>

                                    <Collapsible open={expandedItems.has(semester.id)}>
                                      <CollapsibleContent>
                                        <div className="p-3 space-y-2 border-t border-border bg-muted/10">
                                          {config.sections.allowAdd && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="w-full bg-transparent"
                                              onClick={() =>
                                                setAddingTo({
                                                  type: "section",
                                                  parentIds: [program.id, degree.id, yearLevel.id, semester.id],
                                                })
                                              }
                                            >
                                              <Plus className="h-3 w-3 mr-1" /> Add Section
                                            </Button>
                                          )}

                                          {addingTo?.type === "section" &&
                                            addingTo.parentIds[3] === semester.id &&
                                            renderAddForm("section", () =>
                                              addSection(program.id, degree.id, yearLevel.id, semester.id),
                                            )}

                                          {/* Sections */}
                                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                            {semester.sections.map((section) => (
                                              <div
                                                key={section.id}
                                                className="flex items-center gap-2 p-2 border border-border rounded-lg bg-card group"
                                              >
                                                {editingId === section.id ? (
                                                  <div className="flex-1 flex items-center gap-1">
                                                    <Input
                                                      value={editValue.name || ""}
                                                      onChange={(e) =>
                                                        setEditValue({ ...editValue, name: e.target.value })
                                                      }
                                                      className="h-7 text-xs w-12"
                                                      autoFocus
                                                    />
                                                    <Input
                                                      type="number"
                                                      min="1"
                                                      value={editValue.seatCapacity || ""}
                                                      onChange={(e) =>
                                                        setEditValue({ ...editValue, seatCapacity: e.target.value })
                                                      }
                                                      className="h-7 text-xs w-14"
                                                    />
                                                    <Button
                                                      size="icon"
                                                      variant="ghost"
                                                      className="h-6 w-6"
                                                      onClick={() =>
                                                        updateSection(
                                                          program.id,
                                                          degree.id,
                                                          yearLevel.id,
                                                          semester.id,
                                                          section.id,
                                                          {
                                                            name: editValue.name,
                                                            seatCapacity: Number(editValue.seatCapacity),
                                                          },
                                                        )
                                                      }
                                                    >
                                                      <Check className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                      size="icon"
                                                      variant="ghost"
                                                      className="h-6 w-6"
                                                      onClick={cancelEdit}
                                                    >
                                                      <X className="h-3 w-3" />
                                                    </Button>
                                                  </div>
                                                ) : (
                                                  <>
                                                    <span className="text-sm font-medium">Section {section.name}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                      {section.seatCapacity}
                                                    </Badge>
                                                    <div className="flex-1" />
                                                    {config.sections.editable && (
                                                      <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                                        onClick={() =>
                                                          startEdit(section.id, {
                                                            name: section.name,
                                                            seatCapacity: section.seatCapacity,
                                                          })
                                                        }
                                                      >
                                                        <Edit2 className="h-3 w-3" />
                                                      </Button>
                                                    )}
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
                                                  </>
                                                )}
                                              </div>
                                            ))}
                                          </div>

                                          {semester.sections.length === 0 && (
                                            <p className="text-xs text-muted-foreground text-center py-3">
                                              No sections yet
                                            </p>
                                          )}
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  </div>
                                ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))}

                  {degree.yearLevels.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Set degree duration to auto-generate year levels
                    </p>
                  )}
                </CardContent>
              </Card>
            )),
          )
        )}
      </TabsContent>
    </Tabs>
  )
}
