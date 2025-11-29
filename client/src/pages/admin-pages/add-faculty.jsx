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

export default function AdminAddFacultyPage() {
  const { user } = useAuthContext();
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
  const [bulkResult, setBulkResult] = useState(null);

  // MODALS
  const [addOpen, setAddOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ADD DTO
  const [formData, setFormData] = useState({
    facultyId: "",
    name: "",
    email: "",
    gender: "male",
    phone: "",
    department: "",
    designation: "",
  });

  // EDIT DTO
  const [editData, setEditData] = useState({
    id: "",
    department: "",
    designation: "",
  });

  // DELETE target
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  // 🔎 FETCH FACULTIES
  const fetchFaculties = async () => {
    try {
      const res = await fetch(`${API_BASE}/faculty`);
      const data = await res.json();
      // Backend returns array directly from findAllFaculty()
      const facultiesArray = Array.isArray(data) ? data : [];
      setFaculties(facultiesArray);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  // ➕ CREATE FACULTY
  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/faculty/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, instituteId: user?.instituteId }),
      });

      if (!res.ok) {
        const txt = await res.text();
        alert(`Failed to create faculty: ${txt}`);
        return;
      }

      alert("Faculty created successfully!");
      setAddOpen(false);
      setFormData({
        facultyId: "",
        name: "",
        email: "",
        gender: "male",
        phone: "",
        department: "",
        designation: "",
      });
      fetchFaculties();
    } catch (err) {
      alert(err.message || String(err));
    }
  };

  // ✏ EDIT FACULTY
  const handleEdit = (fac) => {
    setEditData({
      id: fac._id,
      department: fac.department || "",
      designation: fac.designation || "",
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`${API_BASE}/faculty/${editData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department: editData.department,
          designation: editData.designation,
        }),
      });

      if (!res.ok) {
        alert("Update failed");
        return;
      }
      alert("Faculty updated!");
      setEditOpen(false);
      fetchFaculties();
    } catch (err) {
      alert(err.message || String(err));
    }
  };

  // 🗑 DELETE FACULTY
  const confirmDelete = (fac) => {
    setFacultyToDelete(fac);
    setDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!facultyToDelete) return;
    try {
      const res = await fetch(`${API_BASE}/faculty/${facultyToDelete._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const txt = await res.text();
        alert(`Delete failed: ${txt}`);
        return;
      }
      alert("Faculty deleted!");
      setDeleteOpen(false);
      setFacultyToDelete(null);
      fetchFaculties();
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
      const res = await fetch(`${API_BASE}/faculty/bulk`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formDataObj,
      });

      const data = await res.json();
      setBulkResult(data);
      fetchFaculties();
    } catch (err) {
      alert(err.message || String(err));
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl font-bold">Faculty Records</h2>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
          <Button variant="secondary" onClick={() => setBulkOpen(true)}>
            <Upload className="mr-1 h-4 w-4" /> Bulk
          </Button>
        </div>
      </div>

      <Input
        placeholder="Search by name..."
        className="max-w-sm mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {faculties
            .filter((f) =>
              f.basicUserDetails?.name?.toLowerCase().includes(search.toLowerCase())
            )
            .map((fac, index) => (
              <tr key={fac._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {fac.basicUserDetails?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {fac.basicUserDetails?.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {fac.basicUserDetails?.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {fac.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {fac.designation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  <Pencil
                    className="cursor-pointer text-blue-600 hover:text-blue-900 h-5 w-5"
                    onClick={() => handleEdit(fac)}
                  />
                  <Trash
                    className="cursor-pointer text-red-600 hover:text-red-900 h-5 w-5"
                    onClick={() => confirmDelete(fac)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* ------------------ ADD MODAL ---------------- */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent aria-describedby="add-faculty">
          <DialogHeader>
            <DialogTitle>Add Faculty</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddFaculty} className="space-y-2">
            <Input
              value={formData.facultyId}
              placeholder="Faculty ID"
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              required
            />
            <Input
              value={formData.name}
              placeholder="Name"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              value={formData.email}
              placeholder="Email"
              type="email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              value={formData.phone}
              placeholder="Phone"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full border rounded p-2"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <Input
              value={formData.department}
              placeholder="Department"
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
            <Input
              value={formData.designation}
              placeholder="Designation"
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              required
            />
            <Button type="submit" className="w-full bg-blue-600">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ------------------ EDIT MODAL ---------------- */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent aria-describedby="edit-faculty">
          <DialogHeader>
            <DialogTitle>Edit Faculty</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              value={editData.department}
              placeholder="Department"
              onChange={(e) => setEditData({ ...editData, department: e.target.value })}
            />
            <Input
              value={editData.designation}
              placeholder="Designation"
              onChange={(e) => setEditData({ ...editData, designation: e.target.value })}
            />
            <Button className="w-full bg-blue-600" onClick={saveEdit}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ------------------ DELETE CONFIRM MODAL ---------------- */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Faculty</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{facultyToDelete?.basicUserDetails?.name}</span>?
          </p>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 text-white" onClick={performDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ------------------ BULK MODAL ---------------- */}
      <Dialog
        open={bulkOpen}
        onOpenChange={(isOpen) => {
          setBulkOpen(isOpen);
          if (!isOpen) {
            setBulkResult(null);
            setFile(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Upload CSV/Excel</DialogTitle>
          </DialogHeader>
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          <Button className="w-full bg-green-600 mt-3" onClick={handleBulkUpload}>
            Upload
          </Button>
          {bulkResult && (
            <div className="mt-4">
              <p>{bulkResult.message}</p>
              <p>Created: {bulkResult.createdCount}</p>
              <p>Errors: {bulkResult.errorCount}</p>
              {bulkResult.errors && bulkResult.errors.length > 0 && (
                <div>
                  <h4 className="font-bold mt-2">Error Details:</h4>
                  <ul className="text-sm text-red-600">
                    {bulkResult.errors.map((err, index) => (
                      <li key={index}>
                        - {err.faculty?.["Full Name"] || "Unknown"}: {err.error}
                      </li>
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
