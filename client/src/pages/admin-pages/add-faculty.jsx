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
  const [filterDept, setFilterDept] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
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
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
  });

  // DELETE target
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  // 🔎 FETCH FACULTIES
  const fetchFaculties = async () => {
    try {
      const res = await fetch(`http://localhost:3000/faculty`);
      const data = await res.json();
      const facultiesArray = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
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
      const accessToken = localStorage.getItem(storageKeys.accessToken);
      const res = await fetch(`${API_BASE}/faculty/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed to create faculty: ${errorData?.error?.message || errorData?.message || 'Unknown error'}`);
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
      console.error("Create faculty error:", err);
      alert(err.message || String(err));
    }
  };

  // ✏ EDIT FACULTY
  const handleEdit = (fac) => {
    setEditData({
      id: fac._id,
      name: fac.basicUserDetails?.name || "",
      email: fac.basicUserDetails?.email || "",
      phone: fac.basicUserDetails?.contactInfo?.phone || "",
      department: fac.department || "",
      designation: fac.designation || "",
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      const accessToken = localStorage.getItem(storageKeys.accessToken);
      const res = await fetch(`${API_BASE}/faculty/${editData.id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          name: editData.name,
          email: editData.email,
          phone: editData.phone,
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
      const accessToken = localStorage.getItem(storageKeys.accessToken);
      const res = await fetch(`${API_BASE}/faculty/${facultyToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
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

  // 📥 DOWNLOAD SAMPLE TEMPLATE
  const downloadTemplate = () => {
    const headers = ['facultyId', 'name', 'email', 'gender', 'phone', 'department', 'designation'];
    const sampleData = [
      ['FAC001', 'Dr. Robert Johnson', 'robert.johnson@example.com', 'male', '1112223333', 'Computer Science', 'Professor'],
      ['FAC002', 'Dr. Sarah Williams', 'sarah.williams@example.com', 'female', '4445556666', 'Electronics', 'Associate Professor']
    ];
    
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'faculty-bulk-upload-template.csv';
    link.click();
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

  // Get unique departments for filter
  const uniqueDepartments = [...new Set(faculties.map(f => f.department).filter(Boolean))];

  const filteredFaculties = faculties
    .filter((f) => {
      const matchesSearch = 
        f.basicUserDetails?.name?.toLowerCase().includes(search.toLowerCase()) ||
        f.basicUserDetails?.email?.toLowerCase().includes(search.toLowerCase()) ||
        f.basicUserDetails?.userId?.toLowerCase().includes(search.toLowerCase());
      
      const matchesDept = !filterDept || f.department === filterDept;
      
      return matchesSearch && matchesDept;
    })
    .sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case "name":
          aVal = a.basicUserDetails?.name?.toLowerCase() || "";
          bVal = b.basicUserDetails?.name?.toLowerCase() || "";
          break;
        case "email":
          aVal = a.basicUserDetails?.email?.toLowerCase() || "";
          bVal = b.basicUserDetails?.email?.toLowerCase() || "";
          break;
        case "facultyId":
          aVal = a.basicUserDetails?.userId?.toLowerCase() || "";
          bVal = b.basicUserDetails?.userId?.toLowerCase() || "";
          break;
        case "department":
          aVal = a.department?.toLowerCase() || "";
          bVal = b.department?.toLowerCase() || "";
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
        <h2 className="text-2xl sm:text-3xl font-bold">Faculty Records</h2>
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
          placeholder="Search by name, email, or faculty ID..."
          className="flex-1 sm:max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Departments</option>
          {uniqueDepartments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
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
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="facultyId-asc">Faculty ID (A-Z)</option>
          <option value="facultyId-desc">Faculty ID (Z-A)</option>
          <option value="department-asc">Department (A-Z)</option>
          <option value="department-desc">Department (Z-A)</option>
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
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
            {filteredFaculties.map((fac, index) => (
              <tr key={fac._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fac.basicUserDetails?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fac.basicUserDetails?.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fac.basicUserDetails?.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fac.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fac.designation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  <Pencil className="cursor-pointer text-blue-600 hover:text-blue-900 h-5 w-5" onClick={() => handleEdit(fac)} />
                  <Trash className="cursor-pointer text-red-600 hover:text-red-900 h-5 w-5" onClick={() => confirmDelete(fac)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-3">
        {filteredFaculties.map((fac) => (
          <div key={fac._id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{fac.basicUserDetails?.name}</h3>
                <p className="text-sm text-gray-500">{fac.basicUserDetails?.email}</p>
              </div>
              <div className="flex gap-2">
                <Pencil className="cursor-pointer text-blue-600 hover:text-blue-900 h-5 w-5" onClick={() => handleEdit(fac)} />
                <Trash className="cursor-pointer text-red-600 hover:text-red-900 h-5 w-5" onClick={() => confirmDelete(fac)} />
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Faculty ID:</span> {fac.basicUserDetails?.userId}</p>
              <p><span className="font-medium">Department:</span> {fac.department}</p>
              <p><span className="font-medium">Designation:</span> {fac.designation}</p>
            </div>
          </div>
        ))}
      </div>

      {faculties.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No faculty found. Click "Add" to create your first faculty member.
        </div>
      )}

      {/* ------------------ ADD MODAL ---------------- */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md" aria-describedby="add-faculty">
          <DialogHeader>
            <DialogTitle>Add Faculty</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddFaculty} className="space-y-3 max-h-[70vh] overflow-y-auto">
            <Input value={formData.facultyId} placeholder="Faculty ID" onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })} required />
            <Input value={formData.name} placeholder="Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input value={formData.email} placeholder="Email" type="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <Input value={formData.phone} placeholder="Phone" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full border rounded p-2">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <Input value={formData.department} placeholder="Department" onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
            <Input value={formData.designation} placeholder="Designation" onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required />
            <Button type="submit" className="w-full bg-blue-600">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ------------------ EDIT MODAL ---------------- */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md" aria-describedby="edit-faculty">
          <DialogHeader>
            <DialogTitle>Edit Faculty</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input value={editData.name} placeholder="Name" onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
            <Input value={editData.email} placeholder="Email" onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
            <Input value={editData.phone} placeholder="Phone" onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
            <Input value={editData.department} placeholder="Department" onChange={(e) => setEditData({ ...editData, department: e.target.value })} />
            <Input value={editData.designation} placeholder="Designation" onChange={(e) => setEditData({ ...editData, designation: e.target.value })} />
            <Button className="w-full bg-blue-600" onClick={saveEdit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ------------------ DELETE CONFIRM MODAL ---------------- */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Faculty</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete <span className="font-semibold">{facultyToDelete?.basicUserDetails?.name}</span>?
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
            <DialogTitle>Bulk Upload CSV/Excel</DialogTitle>
          </DialogHeader>
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800 mb-2">📋 Required columns: facultyId, name, email, gender, phone, department, designation</p>
            <Button variant="outline" size="sm" onClick={downloadTemplate} className="w-full">
              ⬇️ Download Sample Template
            </Button>
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
                      <li key={index}>- {err.faculty?.["Full Name"] || "Unknown"}: {typeof err.error === 'object' ? JSON.stringify(err.error) : String(err.error)}</li>
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
