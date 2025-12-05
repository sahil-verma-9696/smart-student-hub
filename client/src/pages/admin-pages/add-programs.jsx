"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Upload, Pencil, Trash } from "lucide-react";

import useAuthContext from "@/hooks/useAuthContext";
import storageKeys from "@/common/storage-keys";

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE) ||
  "http://localhost:3000";

// Program levels matching backend schema
const PROGRAM_LEVELS = ["UG", "PG", "Diploma", "PhD", "Certification"];

export default function AdminProgramsPage() {
  const { user } = useAuthContext();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [sortBy, setSortBy] = useState("degree");
  const [sortOrder, setSortOrder] = useState("asc");
  const [bulkResult, setBulkResult] = useState(null);

  // MODALS
  const [addOpen, setAddOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ADD DTO
  const [formData, setFormData] = useState({
    level: "UG",
    degree: "",
    branch: "",
    specialization: "",
    intake: "",
  });

  // EDIT DTO
  const [editData, setEditData] = useState({
    id: "",
    level: "UG",
    degree: "",
    branch: "",
    specialization: "",
    intake: "",
  });

  // DELETE target
  const [programToDelete, setProgramToDelete] = useState(null);

  // 🔎 FETCH PROGRAMS
  const fetchPrograms = async () => {
    try {
      const url = user?.instituteId
        ? `${API_BASE}/program/institute/${user.instituteId}`
        : `${API_BASE}/program`;

      const res = await fetch(url);
      const data = await res.json();

      const programsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setPrograms(programsArray);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [user?.instituteId]);

  // ➕ CREATE PROGRAM
  const handleAddProgram = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/program/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: formData.level,
          degree: formData.degree,
          branch: formData.branch || null,
          specialization: formData.specialization || null,
          intake: Number(formData.intake),
          instituteId: user?.instituteId,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        alert(`Failed to create program: ${txt}`);
        return;
      }

      alert("Program created successfully!");
      setAddOpen(false);
      setFormData({
        level: "UG",
        degree: "",
        branch: "",
        specialization: "",
        intake: "",
      });
      fetchPrograms();
    } catch (err) {
      alert(err.message || String(err));
    }
  };

  // ✏ EDIT PROGRAM
  const handleEdit = (prog) => {
    setEditData({
      id: prog._id,
      level: prog.level || "UG",
      degree: prog.degree || "",
      branch: prog.branch || "",
      specialization: prog.specialization || "",
      intake: prog.intake || "",
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`${API_BASE}/program/${editData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: editData.level,
          degree: editData.degree,
          branch: editData.branch || null,
          specialization: editData.specialization || null,
          intake: Number(editData.intake),
        }),
      });

      if (!res.ok) {
        alert("Update failed");
        return;
      }
      alert("Program updated!");
      setEditOpen(false);
      fetchPrograms();
    } catch (err) {
      alert(err.message || String(err));
    }
  };

  // 🗑 DELETE PROGRAM
  const confirmDelete = (prog) => {
    setProgramToDelete(prog);
    setDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!programToDelete) return;
    try {
      const res = await fetch(`${API_BASE}/program/${programToDelete._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const txt = await res.text();
        alert(`Delete failed: ${txt}`);
        return;
      }
      alert("Program deleted!");
      setDeleteOpen(false);
      setProgramToDelete(null);
      fetchPrograms();
    } catch (err) {
      alert(err.message || String(err));
    }
  };

  // 📥 BULK UPLOAD CSV/XLSX
  const handleBulkUpload = async () => {
    if (!file) return alert("Please select a file");

    const formDataObj = new FormData();
    formDataObj.append("file", file);

    const accessToken = localStorage.getItem(storageKeys.accessToken);

    try {
      const res = await fetch(`${API_BASE}/program/bulk`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formDataObj,
      });

      const data = await res.json();
      setBulkResult(data);
      fetchPrograms();
    } catch (err) {
      alert(err.message || String(err));
    }
  };

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case "UG":
        return "bg-blue-100 text-blue-800";
      case "PG":
        return "bg-purple-100 text-purple-800";
      case "PhD":
        return "bg-green-100 text-green-800";
      case "Diploma":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get unique branches for filter
  const uniqueBranches = [...new Set(programs.map(p => p.branch).filter(Boolean))];

  const filteredPrograms = programs
    .filter((p) => {
      const matchesSearch = 
        p.degree?.toLowerCase().includes(search.toLowerCase()) ||
        p.branch?.toLowerCase().includes(search.toLowerCase()) ||
        p.specialization?.toLowerCase().includes(search.toLowerCase());
      
      const matchesLevel = !filterLevel || p.level === filterLevel;
      const matchesBranch = !filterBranch || p.branch === filterBranch;
      
      return matchesSearch && matchesLevel && matchesBranch;
    })
    .sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case "degree":
          aVal = a.degree?.toLowerCase() || "";
          bVal = b.degree?.toLowerCase() || "";
          break;
        case "branch":
          aVal = a.branch?.toLowerCase() || "";
          bVal = b.branch?.toLowerCase() || "";
          break;
        case "level":
          aVal = a.level?.toLowerCase() || "";
          bVal = b.level?.toLowerCase() || "";
          break;
        case "intake":
          aVal = a.intake || 0;
          bVal = b.intake || 0;
          break;
        default:
          return 0;
      }
      
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  if (loading) return <p className="p-4 sm:p-6">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Program Records</h2>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)} className="flex-1 sm:flex-none">
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
          <Button variant="secondary" onClick={() => setBulkOpen(true)} className="flex-1 sm:flex-none">
            <Upload className="mr-1 h-4 w-4" /> Bulk
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          placeholder="Search by degree, branch, or specialization..."
          className="flex-1 sm:max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Levels</option>
          {PROGRAM_LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        <select
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Branches</option>
          {uniqueBranches.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split("-");
            setSortBy(field);
            setSortOrder(order);
          }}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="degree-asc">Degree (A-Z)</option>
          <option value="degree-desc">Degree (Z-A)</option>
          <option value="branch-asc">Branch (A-Z)</option>
          <option value="branch-desc">Branch (Z-A)</option>
          <option value="level-asc">Level (A-Z)</option>
          <option value="level-desc">Level (Z-A)</option>
          <option value="intake-asc">Intake (Low-High)</option>
          <option value="intake-desc">Intake (High-Low)</option>
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intake</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPrograms.map((prog, index) => (
              <tr key={prog._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelBadgeClass(prog.level)}`}>
                    {prog.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prog.degree}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prog.branch || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prog.specialization || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prog.intake}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  <Pencil className="cursor-pointer text-blue-600 hover:text-blue-900 h-5 w-5" onClick={() => handleEdit(prog)} />
                  <Trash className="cursor-pointer text-red-600 hover:text-red-900 h-5 w-5" onClick={() => confirmDelete(prog)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-3">
        {filteredPrograms.map((prog) => (
          <div key={prog._id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelBadgeClass(prog.level)}`}>
                  {prog.level}
                </span>
                <h3 className="font-semibold mt-2">{prog.degree}</h3>
              </div>
              <div className="flex gap-2">
                <Pencil className="cursor-pointer text-blue-600 hover:text-blue-900 h-5 w-5" onClick={() => handleEdit(prog)} />
                <Trash className="cursor-pointer text-red-600 hover:text-red-900 h-5 w-5" onClick={() => confirmDelete(prog)} />
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {prog.branch && <p><span className="font-medium">Branch:</span> {prog.branch}</p>}
              {prog.specialization && <p><span className="font-medium">Specialization:</span> {prog.specialization}</p>}
              <p><span className="font-medium">Intake:</span> {prog.intake} seats</p>
            </div>
          </div>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No programs found. Click "Add" to create your first program.
        </div>
      )}

      {/* ------------------ ADD MODAL ---------------- */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md" aria-describedby="add-program">
          <DialogHeader>
            <DialogTitle>Add Program</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProgram} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full border rounded p-2"
                required
              >
                {PROGRAM_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <Input value={formData.degree} placeholder="Degree (e.g., BTech, BCA)" onChange={(e) => setFormData({ ...formData, degree: e.target.value })} required />
            <Input value={formData.branch} placeholder="Branch (optional, e.g., CSE, ECE)" onChange={(e) => setFormData({ ...formData, branch: e.target.value })} />
            <Input value={formData.specialization} placeholder="Specialization (optional)" onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} />
            <Input value={formData.intake} placeholder="Intake (seat count)" type="number" min="1" onChange={(e) => setFormData({ ...formData, intake: e.target.value })} required />
            <Button type="submit" className="w-full bg-blue-600">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ------------------ EDIT MODAL ---------------- */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md" aria-describedby="edit-program">
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select value={editData.level} onChange={(e) => setEditData({ ...editData, level: e.target.value })} className="w-full border rounded p-2">
                {PROGRAM_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <Input value={editData.degree} placeholder="Degree" onChange={(e) => setEditData({ ...editData, degree: e.target.value })} />
            <Input value={editData.branch} placeholder="Branch" onChange={(e) => setEditData({ ...editData, branch: e.target.value })} />
            <Input value={editData.specialization} placeholder="Specialization (optional)" onChange={(e) => setEditData({ ...editData, specialization: e.target.value })} />
            <Input value={editData.intake} placeholder="Intake" type="number" min="1" onChange={(e) => setEditData({ ...editData, intake: e.target.value })} />
            <Button className="w-full bg-blue-600" onClick={saveEdit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ------------------ DELETE CONFIRM MODAL ---------------- */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Program</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {programToDelete?.degree}{programToDelete?.branch ? ` - ${programToDelete.branch}` : ''}
              {programToDelete?.specialization && ` (${programToDelete.specialization})`}
            </span>?
          </p>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button className="bg-red-600 text-white" onClick={performDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ------------------ BULK MODAL ---------------- */}
      <Dialog open={bulkOpen} onOpenChange={(isOpen) => { setBulkOpen(isOpen); if (!isOpen) { setBulkResult(null); setFile(null); } }}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Upload Programs</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-600 mb-3">
            <p className="font-medium mb-1">Excel/CSV columns:</p>
            <ul className="list-disc list-inside text-xs">
              <li>Level (UG, PG, Diploma, PhD, Certification) - required</li>
              <li>Degree (BTech, BCA, MBA, etc.) - required</li>
              <li>Branch (CSE, ECE, etc.) - optional</li>
              <li>Specialization - optional</li>
              <li>Intake (number) - required</li>
            </ul>
          </div>
          <Input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
          <Button className="w-full bg-green-600 mt-3" onClick={handleBulkUpload}>Upload</Button>
          {bulkResult && (
            <div className="mt-4">
              <p>{bulkResult.message}</p>
              <p>Created: {bulkResult.createdCount}</p>
              <p>Errors: {bulkResult.errorCount}</p>
              {bulkResult.errors?.length > 0 && (
                <div>
                  <h4 className="font-bold mt-2">Error Details:</h4>
                  <ul className="text-sm text-red-600 max-h-32 overflow-y-auto">
                    {bulkResult.errors.map((err, index) => (
                      <li key={index}>- {err.program?.Degree || err.program?.degree || "Unknown"}: {typeof err.error === 'object' ? JSON.stringify(err.error) : String(err.error)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
