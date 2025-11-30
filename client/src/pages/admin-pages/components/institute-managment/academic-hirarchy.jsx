import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";

export default function AcademicHierarchy({ programs, config, onChange }) {
  const [expandedPrograms, setExpandedPrograms] = useState(new Set());
  const [expandedDegrees, setExpandedDegrees] = useState(new Set());
  const [expandedBranches, setExpandedBranches] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [addingTo, setAddingTo] = useState(null);
  const [newItemName, setNewItemName] = useState("");

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
    if (!addingTo || !newItemName.trim()) {
      setAddingTo(null);
      return;
    }

    let updated = [...programs];

    if (addingTo.type === "program") {
      updated.push({
        id: generateId(),
        name: newItemName,
        degrees: [],
      });
    } else if (addingTo.type === "degree" && addingTo.parentId) {
      updated = updated.map((p) =>
        p.id === addingTo.parentId
          ? {
              ...p,
              degrees: [
                ...p.degrees,
                {
                  id: generateId(),
                  name: newItemName,
                  duration: "4 Years",
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
                <Check className="h-3 w-3 text-success" />
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
                  {program.degrees.map((degree) => (
                    <div key={degree.id} className="group">
                      {renderEditableItem(
                        degree.id,
                        `${degree.name} (${degree.duration})`,
                        <BookOpen className="h-4 w-4" />,
                        "degree",
                        config.degrees.editable,
                        config.degrees.allowDelete,
                        () => deleteItem("degree", degree.id, program.id),
                        <Collapsible open={expandedDegrees.has(degree.id)}>
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
                                      deleteItem(
                                        "branch",
                                        branch.id,
                                        degree.id,
                                        program.id
                                      ),
                                    <Collapsible
                                      open={expandedBranches.has(branch.id)}
                                    >
                                      <CollapsibleContent>
                                        <div className="border-t border-border bg-muted/20 p-3 space-y-2">
                                          {branch.specializations.map(
                                            (spec) => (
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
                                                        setEditValue(
                                                          e.target.value
                                                        )
                                                      }
                                                      className="h-6 text-xs bg-input"
                                                      autoFocus
                                                      onKeyDown={(e) => {
                                                        if (e.key === "Enter")
                                                          saveEdit();
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
                                                      <Check className="h-3 w-3 text-success" />
                                                    </Button>
                                                  </div>
                                                ) : (
                                                  <>
                                                    <span className="flex-1 text-xs text-foreground">
                                                      {spec.name}
                                                    </span>
                                                    {config.specializations
                                                      .editable && (
                                                      <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                                        onClick={() =>
                                                          startEdit(
                                                            spec.id,
                                                            spec.name
                                                          )
                                                        }
                                                      >
                                                        <Edit2 className="h-3 w-3" />
                                                      </Button>
                                                    )}
                                                    {config.specializations
                                                      .allowDelete && (
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
                                            )
                                          )}
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
                        </Collapsible>,
                        true,
                        expandedDegrees.has(degree.id),
                        () => toggleExpand(degree.id, "degree")
                      )}
                    </div>
                  ))}
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
