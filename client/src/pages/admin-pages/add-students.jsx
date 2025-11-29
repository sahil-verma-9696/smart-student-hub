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

export default function StudentListPage() {
  const { user } = useAuthContext();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
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
      const response = await res.json();

      console.log("GET /student response:", response);

      // Backend returns { data: { data: [...] } } or { data: [...] }
      const studentsArray =
        Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
          ? response.data
          : [];

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
      const res = await fetch(`${API_BASE}/student/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, instituteId: user?.instituteId }),
      });

      if (!res.ok) {
        const txt = await res.text();
        alert(`Failed to create student: ${txt}`);
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
      alert(err.message || String(err));
    }
  };

  // ✏ EDIT STUDENT
  const handleEdit = (stu) => {
    setEditData({
      id: stu._id,
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
      const res = await fetch(`${API_BASE}/student/${editData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
      const res = await fetch(`${API_BASE}/student/${studentToDelete._id}`, {
        method: "DELETE",
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

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl font-bold">Student Records</h2>
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students
            .filter((s) =>
              s.basicUserDetails?.name?.toLowerCase().includes(search.toLowerCase())
            )
            .map((stu, index) => (
              <tr key={stu._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {stu.basicUserDetails?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stu.basicUserDetails?.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stu.acadmicDetails?.branch}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stu.acadmicDetails?.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stu.acadmicDetails?.course}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  <Pencil
                    className="cursor-pointer text-blue-600 hover:text-blue-900 h-5 w-5"
                    onClick={() => handleEdit(stu)}
                  />
                  <Trash
                    className="cursor-pointer text-red-600 hover:text-red-900 h-5 w-5"
                    onClick={() => confirmDelete(stu)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* ------------------ ADD MODAL ---------------- */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent aria-describedby="add-student">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-2">
            <Input
              value={formData.studentId}
              placeholder="Student ID"
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
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
              value={formData.course}
              placeholder="Course"
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              required
            />
            <Input
              value={formData.branch}
              placeholder="Branch"
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              required
            />
            <Input
              value={formData.year}
              placeholder="Year"
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              required
            />
            <Input
              value={formData.semester}
              placeholder="Semester"
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              required
            />
            <Input
              value={formData.section}
              placeholder="Section"
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            />
            <Button type="submit" className="w-full bg-blue-600">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ------------------ EDIT MODAL ---------------- */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent aria-describedby="edit-student">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              value={editData.branch}
              placeholder="Branch"
              onChange={(e) => setEditData({ ...editData, branch: e.target.value })}
            />
            <Input
              value={editData.course}
              placeholder="Course"
              onChange={(e) => setEditData({ ...editData, course: e.target.value })}
            />
            <Input
              value={editData.year}
              placeholder="Year"
              onChange={(e) => setEditData({ ...editData, year: e.target.value })}
            />
            <Input
              value={editData.semester}
              placeholder="Semester"
              onChange={(e) => setEditData({ ...editData, semester: e.target.value })}
            />
            <Input
              value={editData.section}
              placeholder="Section"
              onChange={(e) => setEditData({ ...editData, section: e.target.value })}
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
            <DialogTitle>Delete Student</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{studentToDelete?.basicUserDetails?.name}</span>?
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
                        - {err.student?.name || "Unknown"}: {err.error}
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