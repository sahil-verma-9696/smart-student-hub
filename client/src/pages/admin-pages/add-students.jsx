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
  (typeof import.meta !== "undefined" && import.meta.env &&
    (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL)) ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export default function StudentListPage() {
  const { user } = useAuthContext();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [bulkResult, setBulkResult] = useState(null);

  // MODALS
  const [addOpen, setAddOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // DELETE target
  const [studentToDelete, setStudentToDelete] = useState(null);

  // ADD DTO
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
    gender: "male",
    phone: "",
    course: "",
    branch: "",
    year: "",
    semester: "",
    section: "",
  });

  // EDIT DTO
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    branch: "",
    course: "",
    year: "",
    semester: "",
    section: "",
  });

  // 🔎 FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE}/student`);
      const data = await res.json();
      const studentsArray = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      setStudents(studentsArray);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ➕ CREATE STUDENT
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem(storageKeys.accessToken);
      const res = await fetch(`${API_BASE}/student/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed to create student: ${errorData?.error?.message || errorData?.message || 'Unknown error'}`);
        return;
      }

      alert("Student created successfully!");
      setAddOpen(false);
      setFormData({
        studentId: "",
        name: "",
        email: "",
        gender: "male",
        phone: "",
        course: "",
        branch: "",
        year: "",
        semester: "",
        section: "",
      });
      fetchStudents();
    } catch (err) {
      console.error("Create student error:", err);
      alert(err.message || String(err));
    }
  };

  // ✏ EDIT STUDENT
  const handleEdit = (stu) => {
    setEditData({
      id: stu._id,
      name: stu.basicUserDetails?.name || "",
      email: stu.basicUserDetails?.email || "",
      phone: stu.basicUserDetails?.contactInfo?.phone || "",
      branch: stu.acadmicDetails?.branch || "",
      course: stu.acadmicDetails?.course || "",
      year: stu.acadmicDetails?.year || "",
      semester: stu.acadmicDetails?.semester || "",
      section: stu.acadmicDetails?.section || "",
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      const accessToken = localStorage.getItem(storageKeys.accessToken);
      const res = await fetch(`${API_BASE}/student/${editData.id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          name: editData.name,
          email: editData.email,
          phone: editData.phone,
          branch: editData.branch,
          course: editData.course,
          year: Number(editData.year),
          semester: Number(editData.semester),
          section: editData.section,
        }),
      });

      if (!res.ok) {
        alert("Update failed");
        return;
      }
      alert("Student updated!");
      setEditOpen(false);
      fetchStudents();
    } catch (err) {
      alert(err.message || String(err));
    }
  };

  // 🗑 DELETE STUDENT
  const confirmDelete = (stu) => {
    setStudentToDelete(stu);
    setDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!studentToDelete) return;
    try {
      const accessToken = localStorage.getItem(storageKeys.accessToken);
      const res = await fetch(`${API_BASE}/student/${studentToDelete._id}`, {
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
      alert("Student deleted!");
      setDeleteOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (err) {
      alert(err.message || String(err));
    }
  };

  // 📥 DOWNLOAD SAMPLE TEMPLATE
  const downloadTemplate = () => {
    const headers = ['studentId', 'name', 'email', 'gender', 'phone', 'course', 'branch', 'year', 'semester', 'section'];
    const sampleData = [
      ['STU001', 'John Doe', 'john.doe@example.com', 'male', '1234567890', 'B.Tech', 'Computer Science', '1', '1', 'A'],
      ['STU002', 'Jane Smith', 'jane.smith@example.com', 'female', '9876543210', 'B.Tech', 'Electronics', '2', '3', 'B']
    ];
    
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'student-bulk-upload-template.csv';
    link.click();
  };

  // 📥 BULK UPLOAD CSV
  const handleBulkUpload = async () => {
    if (!file) return alert("Please select a file");

    const formDataObj = new FormData();
    formDataObj.append("file", file);

    const accessToken = localStorage.getItem(storageKeys.accessToken);

    try {
      const res = await fetch(`${API_BASE}/student/bulk-upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formDataObj,
      });

      const data = await res.json();
      setBulkResult(data);
      fetchStudents();
    } catch (err) {
      alert(err.message || String(err));
    }
  };

  // Get unique branches and years for filters
  const uniqueBranches = [...new Set(students.map(s => s.acadmicDetails?.branch).filter(Boolean))];
  const uniqueYears = [...new Set(students.map(s => s.acadmicDetails?.year).filter(Boolean))];

  const filteredStudents = students
    .filter((s) => {
      const matchesSearch = 
        s.basicUserDetails?.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.basicUserDetails?.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.basicUserDetails?.userId?.toLowerCase().includes(search.toLowerCase());
      
      const matchesBranch = !filterBranch || s.acadmicDetails?.branch === filterBranch;
      const matchesYear = !filterYear || s.acadmicDetails?.year === Number(filterYear);
      
      return matchesSearch && matchesBranch && matchesYear;
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
        case "studentId":
          aVal = a.basicUserDetails?.userId?.toLowerCase() || "";
          bVal = b.basicUserDetails?.userId?.toLowerCase() || "";
          break;
        case "year":
          aVal = a.acadmicDetails?.year || 0;
          bVal = b.acadmicDetails?.year || 0;
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
        <h2 className="text-2xl sm:text-3xl font-bold">Student Records</h2>
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
          placeholder="Search by name, email, or student ID..."
          className="flex-1 sm:max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Years</option>
          {uniqueYears.map(year => (
            <option key={year} value={year}>Year {year}</option>
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
          <option value="studentId-asc">Student ID (A-Z)</option>
          <option value="studentId-desc">Student ID (Z-A)</option>
          <option value="year-asc">Year (Low-High)</option>
          <option value="year-desc">Year (High-Low)</option>
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((stu, index) => (
              <tr key={stu._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stu.basicUserDetails?.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stu.basicUserDetails?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stu.basicUserDetails?.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stu.acadmicDetails?.branch}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stu.acadmicDetails?.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stu.acadmicDetails?.course}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  <Pencil className="cursor-pointer text-blue-600 hover:text-blue-900 h-5 w-5" onClick={() => handleEdit(stu)} />
                  <Trash className="cursor-pointer text-red-600 hover:text-red-900 h-5 w-5" onClick={() => confirmDelete(stu)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-3">
        {filteredStudents.map((stu) => (
          <div key={stu._id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{stu.basicUserDetails?.name}</h3>
                <p className="text-xs text-blue-600 font-mono">{stu.basicUserDetails?.userId}</p>
                <p className="text-sm text-gray-500">{stu.basicUserDetails?.email}</p>
              </div>
              <div className="flex gap-2">
                <Pencil className="cursor-pointer text-blue-600 hover:text-blue-900 h-5 w-5" onClick={() => handleEdit(stu)} />
                <Trash className="cursor-pointer text-red-600 hover:text-red-900 h-5 w-5" onClick={() => confirmDelete(stu)} />
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Course:</span> {stu.acadmicDetails?.course}</p>
              <p><span className="font-medium">Branch:</span> {stu.acadmicDetails?.branch}</p>
              <p><span className="font-medium">Year:</span> {stu.acadmicDetails?.year} | <span className="font-medium">Semester:</span> {stu.acadmicDetails?.semester}</p>
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No students found. Click "Add" to create your first student.
        </div>
      )}

      {/* ------------------ ADD MODAL ---------------- */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md" aria-describedby="add-student">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-3 max-h-[70vh] overflow-y-auto">
            <Input value={formData.studentId} placeholder="Student ID" onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} required />
            <Input value={formData.name} placeholder="Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input value={formData.email} placeholder="Email" type="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <Input value={formData.phone} placeholder="Phone" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full border rounded p-2">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <Input value={formData.course} placeholder="Course" onChange={(e) => setFormData({ ...formData, course: e.target.value })} required />
            <Input value={formData.branch} placeholder="Branch" onChange={(e) => setFormData({ ...formData, branch: e.target.value })} required />
            <Input value={formData.year} placeholder="Year" onChange={(e) => setFormData({ ...formData, year: e.target.value })} required />
            <Input value={formData.semester} placeholder="Semester" onChange={(e) => setFormData({ ...formData, semester: e.target.value })} required />
            <Input value={formData.section} placeholder="Section" onChange={(e) => setFormData({ ...formData, section: e.target.value })} />
            <Button type="submit" className="w-full bg-blue-600">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ------------------ EDIT MODAL ---------------- */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md" aria-describedby="edit-student">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input value={editData.branch} placeholder="Branch" onChange={(e) => setEditData({ ...editData, branch: e.target.value })} />
            <Input value={editData.course} placeholder="Course" onChange={(e) => setEditData({ ...editData, course: e.target.value })} />
            <Input value={editData.year} placeholder="Year" onChange={(e) => setEditData({ ...editData, year: e.target.value })} />
            <Input value={editData.semester} placeholder="Semester" onChange={(e) => setEditData({ ...editData, semester: e.target.value })} />
            <Input value={editData.section} placeholder="Section" onChange={(e) => setEditData({ ...editData, section: e.target.value })} />
            <Button className="w-full bg-blue-600" onClick={saveEdit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ------------------ DELETE CONFIRM MODAL ---------------- */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete <span className="font-semibold">{studentToDelete?.basicUserDetails?.name}</span>?
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
            <p className="text-sm text-blue-800 mb-2">📋 Required columns: studentId, name, email, gender, phone, course, branch, year, semester, section</p>
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
                      <li key={index}>- {err.student?.name || "Unknown"}: {typeof err.error === 'object' ? JSON.stringify(err.error) : String(err.error)}</li>
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