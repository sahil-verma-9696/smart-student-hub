import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
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
} from "lucide-react";

export default function AcademicHierarchy({
  programs,
  config,
  onChange,
}) {
  const [expandedPrograms, setExpandedPrograms] = useState(new Set());
  const [expandedDegrees, setExpandedDegrees] = useState(new Set());
  const [expandedBranches, setExpandedBranches] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editingDegreeId, setEditingDegreeId] = useState(null);
  const [editDegreeData, setEditDegreeData] = useState(null);
  const [addingTo, setAddingTo] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [newDegreeData, setNewDegreeData] = useState({
    name: "",
    duration: "4",
    durationUnit: "Years",
    sections: 1,
    intakePerSection: 60,
  });

  const toggleExpand = (id, type) => {
    const setter =
      type === "program"
        ? setExpandedPrograms
        : type === "degree"
        ? setExpandedDegrees
        : setExpandedBranches;
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const startEdit = (id, currentValue) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  const startEditDegree = (degree) => {
    setEditingDegreeId(degree.id);
    setEditDegreeData({
      name: degree.name,
      duration: degree.duration,
      durationUnit: degree.durationUnit || "Years",
      sections: degree.sections || 1,
      intakePerSection: degree.intakePerSection || 60,
    });
  };

  const saveDegreeEdit = (programId) => {
    if (!editingDegreeId || !editDegreeData) {
      setEditingDegreeId(null);
      setEditDegreeData(null);
      return;
    }

    const updated = programs.map((program) => {
      if (program.id === programId) {
        return {
          ...program,
          degrees: program.degrees.map((degree) => {
            if (degree.id === editingDegreeId) {
              return {
                ...degree,
                name: editDegreeData.name,
                duration: editDegreeData.duration,
                durationUnit: editDegreeData.durationUnit,
                sections: editDegreeData.sections,
                intakePerSection: editDegreeData.intakePerSection,
              };
            }
            return degree;
          }),
        };
      }
      return program;
    });

    onChange(updated);
    setEditingDegreeId(null);
    setEditDegreeData(null);
  };

  const saveEdit = () => {
    if (!editingId || !editValue.trim()) {
      setEditingId(null);
      return;
    }

    const updated = programs.map((program) => {
      if (program.id === editingId) {
        return { ...program, name: editValue };
      }
      return {
        ...program,
        degrees: program.degrees.map((degree) => {
          if (degree.id === editingId) {
            return { ...degree, name: editValue };
          }
          return {
            ...degree,
            branches: degree.branches.map((branch) => {
              if (branch.id === editingId) {
                return { ...branch, name: editValue };
              }
              return {
                ...branch,
                specializations: branch.specializations.map((spec) =>
                  spec.id === editingId ? { ...spec, name: editValue } : spec
                ),
              };
            }),
          };
        }),
      };
    });

    onChange(updated);
    setEditingId(null);
    setEditValue("");
  };

  const addItem = () => {
    if (!addingTo) {
      setAddingTo(null);
      return;
    }

    let updated = [...programs];

    if (addingTo.type === "program") {
      if (!newItemName.trim()) {
        setAddingTo(null);
        return;
      }
      updated.push({
        id: generateId(),
        name: newItemName,
        degrees: [],
      });
    } else if (addingTo.type === "degree" && addingTo.parentId) {
      if (!newDegreeData.name.trim()) {
        setAddingTo(null);
        return;
      }
      updated = updated.map((p) =>
        p.id === addingTo.parentId
          ? {
              ...p,
              degrees: [
                ...p.degrees,
                {
                  id: generateId(),
                  name: newDegreeData.name,
                  duration: newDegreeData.duration,
                  durationUnit: newDegreeData.durationUnit,
                  sections: newDegreeData.sections,
                  intakePerSection: newDegreeData.intakePerSection,
                  branches: [],
                },
              ],
            }
          : p
      );
    } else if (
      addingTo.type === "branch" &&
      addingTo.parentId &&
      addingTo.grandParentId
    ) {
      if (!newItemName.trim()) {
        setAddingTo(null);
        return;
      }
      updated = updated.map((p) =>
        p.id === addingTo.grandParentId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === addingTo.parentId
                  ? {
                      ...d,
                      branches: [
                        ...d.branches,
                        {
                          id: generateId(),
                          name: newItemName,
                          specializations: [],
                        },
                      ],
                    }
                  : d
              ),
            }
          : p
      );
    } else if (
      addingTo.type === "specialization" &&
      addingTo.parentId &&
      addingTo.grandParentId &&
      addingTo.greatGrandParentId
    ) {
      if (!newItemName.trim()) {
        setAddingTo(null);
        return;
      }
      updated = updated.map((p) =>
        p.id === addingTo.greatGrandParentId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === addingTo.grandParentId
                  ? {
                      ...d,
                      branches: d.branches.map((b) =>
                        b.id === addingTo.parentId
                          ? {
                              ...b,
                              specializations: [
                                ...b.specializations,
                                { id: generateId(), name: newItemName },
                              ],
                            }
                          : b
                      ),
                    }
                  : d
              ),
            }
          : p
      );
    }

    onChange(updated);
    setAddingTo(null);
    setNewItemName("");
    setNewDegreeData({
      name: "",
      duration: "4",
      durationUnit: "Years",
      sections: 1,
      intakePerSection: 60,
    });
  };

  const deleteItem = (
    type,
    id,
    parentId,
    grandParentId,
    greatGrandParentId
  ) => {
    let updated = [...programs];

    if (type === "program") {
      updated = updated.filter((p) => p.id !== id);
    } else if (type === "degree" && parentId) {
      updated = updated.map((p) =>
        p.id === parentId
          ? { ...p, degrees: p.degrees.filter((d) => d.id !== id) }
          : p
      );
    } else if (type === "branch" && parentId && grandParentId) {
      updated = updated.map((p) =>
        p.id === grandParentId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === parentId
                  ? { ...d, branches: d.branches.filter((b) => b.id !== id) }
                  : d
              ),
            }
          : p
      );
    } else if (
      type === "specialization" &&
      parentId &&
      grandParentId &&
      greatGrandParentId
    ) {
      updated = updated.map((p) =>
        p.id === greatGrandParentId
          ? {
              ...p,
              degrees: p.degrees.map((d) =>
                d.id === grandParentId
                  ? {
                      ...d,
                      branches: d.branches.map((b) =>
                        b.id === parentId
                          ? {
                              ...b,
                              specializations: b.specializations.filter(
                                (s) => s.id !== id
                              ),
                            }
                          : b
                      ),
                    }
                  : d
              ),
            }
          : p
      );
    }

    onChange(updated);
  };

  const renderEditableItem = (
    id,
    name,
    icon,
    type,
    editable,
    allowDelete,
    onDelete,
    children,
    isExpandable,
    isExpanded,
    onToggle
  ) => {
    const isEditing = editingId === id;

    return (
      <div
        key={id}
        className="border border-border rounded-lg bg-card/50 overflow-hidden"
      >
        <div className="flex items-center gap-2 p-3">
          {isExpandable && (
            <button
              type="button"
              onClick={onToggle}
              className="p-0.5 hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}
          {!isExpandable && <div className="w-5" />}
          <span className="text-primary">{icon}</span>
          {isEditing ? (
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-7 text-sm bg-input"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") setEditingId(null);
                }}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={saveEdit}
              >
                <Check className="h-3 w-3 text-green-600" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setEditingId(null)}
              >
                <X className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          ) : (
            <>
              <span className="flex-1 text-sm font-medium text-foreground">
                {name}
              </span>
              {editable && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100"
                  onClick={() => startEdit(id, name)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
              {allowDelete && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </>
          )}
        </div>
        {children}
      </div>
    );
  };

  const renderDegreeItem = (degree, program) => {
    const isEditing = editingDegreeId === degree.id;
    const isExpanded = expandedDegrees.has(degree.id);
    const totalIntake =
      (degree.sections || 1) * (degree.intakePerSection || 60);

    return (
      <div
        key={degree.id}
        className="border border-border rounded-lg bg-card/50 overflow-hidden group"
      >
        <div className="p-3">
          {isEditing && editDegreeData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Edit Degree
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Degree Name
                  </Label>
                  <Input
                    value={editDegreeData.name}
                    onChange={(e) =>
                      setEditDegreeData({
                        ...editDegreeData,
                        name: e.target.value,
                      })
                    }
                    className="h-8 text-sm bg-input"
                    placeholder="e.g., B.Tech, MBA"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Duration
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={editDegreeData.duration}
                      onChange={(e) =>
                        setEditDegreeData({
                          ...editDegreeData,
                          duration: e.target.value,
                        })
                      }
                      className="h-8 text-sm bg-input w-20"
                    />
                    <Select
                      value={editDegreeData.durationUnit}
                      onValueChange={(val) =>
                        setEditDegreeData({
                          ...editDegreeData,
                          durationUnit: val,
                        })
                      }
                    >
                      <SelectTrigger className="h-8 text-sm bg-input flex-1">
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
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Number of Sections
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={editDegreeData.sections}
                    onChange={(e) =>
                      setEditDegreeData({
                        ...editDegreeData,
                        sections: Number.parseInt(e.target.value) || 1,
                      })
                    }
                    className="h-8 text-sm bg-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Intake per Section
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={editDegreeData.intakePerSection}
                    onChange={(e) =>
                      setEditDegreeData({
                        ...editDegreeData,
                        intakePerSection: Number.parseInt(e.target.value) || 1,
                      })
                    }
                    className="h-8 text-sm bg-input"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Total Intake:{" "}
                  <span className="font-medium text-foreground">
                    {editDegreeData.sections * editDegreeData.intakePerSection}{" "}
                    students
                  </span>
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingDegreeId(null);
                      setEditDegreeData(null);
                    }}
                  >
                    <X className="h-3 w-3 mr-1" /> Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => saveDegreeEdit(program.id)}
                  >
                    <Check className="h-3 w-3 mr-1" /> Save
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleExpand(degree.id, "degree")}
                  className="p-0.5 hover:bg-muted rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="flex-1 text-sm font-medium text-foreground">
                  {degree.name}
                </span>
                {config.degrees.editable && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100"
                    onClick={() => startEditDegree(degree)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
                {config.degrees.allowDelete && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                    onClick={() => deleteItem("degree", degree.id, program.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2 ml-7">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  <Clock className="h-3 w-3" />
                  {degree.duration} {degree.durationUnit || "Years"}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-500/10 text-blue-600 rounded-full">
                  <Users className="h-3 w-3" />
                  {degree.sections || 1} Section
                  {(degree.sections || 1) > 1 ? "s" : ""}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-500/10 text-green-600 rounded-full">
                  {degree.intakePerSection || 60}/section
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-amber-500/10 text-amber-600 rounded-full">
                  Total: {totalIntake} students
                </span>
              </div>
            </>
          )}
        </div>

        {/* Branches */}
        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            <div className="border-t border-border bg-muted/20 p-3 space-y-3">
              {degree.branches.map((branch) => (
                <div key={branch.id} className="group">
                  {renderEditableItem(
                    branch.id,
                    branch.name,
                    <Layers className="h-4 w-4" />,
                    "branch",
                    config.branches.editable,
                    config.branches.allowDelete,
                    () =>
                      deleteItem("branch", branch.id, degree.id, program.id),
                    <Collapsible open={expandedBranches.has(branch.id)}>
                      <CollapsibleContent>
                        <div className="border-t border-border bg-muted/20 p-3 space-y-2">
                          {branch.specializations.map((spec) => (
                            <div
                              key={spec.id}
                              className="flex items-center gap-2 p-2 bg-card rounded-md group"
                            >
                              <Sparkles className="h-3 w-3 text-primary" />
                              {editingId === spec.id ? (
                                <div className="flex-1 flex items-center gap-2">
                                  <Input
                                    value={editValue}
                                    onChange={(e) =>
                                      setEditValue(e.target.value)
                                    }
                                    className="h-6 text-xs bg-input"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") saveEdit();
                                      if (e.key === "Escape")
                                        setEditingId(null);
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={saveEdit}
                                  >
                                    <Check className="h-3 w-3 text-green-600" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <span className="flex-1 text-xs text-foreground">
                                    {spec.name}
                                  </span>
                                  {config.specializations.editable && (
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                      onClick={() =>
                                        startEdit(spec.id, spec.name)
                                      }
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                  {config.specializations.allowDelete && (
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                                      onClick={() =>
                                        deleteItem(
                                          "specialization",
                                          spec.id,
                                          branch.id,
                                          degree.id,
                                          program.id
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
                          {renderAddButton(
                            "specialization",
                            branch.id,
                            degree.id,
                            program.id
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>,
                    true,
                    expandedBranches.has(branch.id),
                    () => toggleExpand(branch.id, "branch")
                  )}
                </div>
              ))}
              {renderAddButton("branch", degree.id, program.id)}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  const renderAddButton = (
    type,
    parentId,
    grandParentId,
    greatGrandParentId
  ) => {
    const configKey =
      type === "program"
        ? "programs"
        : type === "degree"
        ? "degrees"
        : type === "branch"
        ? "branches"
        : "specializations";
    if (!config[configKey].allowAdd) return null;

    const isAdding = addingTo?.type === type && addingTo?.parentId === parentId;

    if (isAdding) {
      if (type === "degree") {
        return (
          <div className="p-4 border border-dashed border-primary/50 rounded-lg bg-primary/5 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Add New Degree
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Degree Name *
                </Label>
                <Input
                  value={newDegreeData.name}
                  onChange={(e) =>
                    setNewDegreeData({ ...newDegreeData, name: e.target.value })
                  }
                  placeholder="e.g., B.Tech, MBA, M.Sc"
                  className="h-8 text-sm bg-input"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Duration *
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={newDegreeData.duration}
                    onChange={(e) =>
                      setNewDegreeData({
                        ...newDegreeData,
                        duration: e.target.value,
                      })
                    }
                    className="h-8 text-sm bg-input w-20"
                  />
                  <Select
                    value={newDegreeData.durationUnit}
                    onValueChange={(val) =>
                      setNewDegreeData({ ...newDegreeData, durationUnit: val })
                    }
                  >
                    <SelectTrigger className="h-8 text-sm bg-input flex-1">
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
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" /> Number of Sections
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={newDegreeData.sections}
                  onChange={(e) =>
                    setNewDegreeData({
                      ...newDegreeData,
                      sections: Number.parseInt(e.target.value) || 1,
                    })
                  }
                  className="h-8 text-sm bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" /> Intake per Section
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={newDegreeData.intakePerSection}
                  onChange={(e) =>
                    setNewDegreeData({
                      ...newDegreeData,
                      intakePerSection: Number.parseInt(e.target.value) || 1,
                    })
                  }
                  className="h-8 text-sm bg-input"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Total Intake:{" "}
                <span className="font-medium text-foreground">
                  {newDegreeData.sections * newDegreeData.intakePerSection}{" "}
                  students
                </span>
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setAddingTo(null)}
                >
                  <X className="h-3 w-3 mr-1" /> Cancel
                </Button>
                <Button type="button" size="sm" onClick={addItem}>
                  <Check className="h-3 w-3 mr-1" /> Add Degree
                </Button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2 p-2 border border-dashed border-primary/50 rounded-lg bg-primary/5">
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={`Enter ${type} name`}
            className="h-8 text-sm flex-1 bg-input"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") addItem();
              if (e.key === "Escape") setAddingTo(null);
            }}
          />
          <Button type="button" size="sm" onClick={addItem} className="h-8">
            <Check className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setAddingTo(null)}
            className="h-8"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-dashed bg-transparent"
        onClick={() =>
          setAddingTo({ type, parentId, grandParentId, greatGrandParentId })
        }
      >
        <Plus className="h-3 w-3 mr-1" />
        Add {type.charAt(0).toUpperCase() + type.slice(1)}
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      {programs.map((program) => (
        <div key={program.id} className="group">
          {renderEditableItem(
            program.id,
            program.name,
            <GraduationCap className="h-4 w-4" />,
            "program",
            config.programs.editable,
            config.programs.allowDelete,
            () => deleteItem("program", program.id),
            <Collapsible open={expandedPrograms.has(program.id)}>
              <CollapsibleContent>
                <div className="border-t border-border bg-muted/20 p-3 space-y-3">
                  {program.degrees.map((degree) =>
                    renderDegreeItem(degree, program)
                  )}
                  {renderAddButton("degree", program.id)}
                </div>
              </CollapsibleContent>
            </Collapsible>,
            true,
            expandedPrograms.has(program.id),
            () => toggleExpand(program.id, "program")
          )}
        </div>
      ))}
      {renderAddButton("program")}
    </div>
  );
}
