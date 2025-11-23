"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Pencil, Trash } from "lucide-react";

export default function AdminAddStudentsPage() {
  // Initial student data
  const [students, setStudents] = useState([
    { id: 1, name: "Sahil Verma", email: "sahil@example.com", roll: "202101", dept: "CSE" },
    { id: 2, name: "Sonal Verma", email: "sonal@example.com", roll: "202102", dept: "IT" },
    { id: 3, name: "Aarav Mehta", email: "aarav@example.com", roll: "202103", dept: "ECE" },
  ]);

  // Toggle add form
  const [showForm, setShowForm] = useState(false);

  // Add form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    roll: "",
    department: "",
  });

  // **EDIT MODAL STATE**
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    email: "",
    roll: "",
    dept: "",
  });

  // **DELETE MODAL STATE**
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // ============================
  // ADD STUDENT
  // ============================
  const handleSubmit = (e) => {
    e.preventDefault();

    const newStudent = {
      id: students.length + 1,
      name: form.name,
      email: form.email,
      roll: form.roll,
      dept: form.department,
    };

    setStudents([...students, newStudent]);
    alert("Student added successfully!");

    setForm({ name: "", email: "", roll: "", department: "" });

    setShowForm(false); // hide form
  };

  // ============================
  // OPEN EDIT MODAL
  // ============================
  const openEdit = (student) => {
    setEditData(student);
    setEditOpen(true);
  };

  // ============================
  // SAVE EDIT CHANGES  ⭐ FIXED
  // ============================
  const saveEdit = () => {
    setStudents(
      students.map((s) =>
        s.id === editData.id ? editData : s
      )
    );

    setEditOpen(false);
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold">All Students</h2>

        <Button
          className="bg-blue-600 text-white"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add Student"}
        </Button>
      </div>

      {/* Students Table */}
      <div className="border rounded-lg overflow-hidden shadow bg-white mb-10">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Roll Number</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="p-3">{student.id}</td>
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.email}</td>
                <td className="p-3">{student.roll}</td>
                <td className="p-3">{student.dept}</td>

                <td className="p-3 flex gap-3">
                  {/* Edit */}
                  <Pencil
                    className="h-5 w-5 text-blue-600 cursor-pointer"
                    onClick={() => openEdit(student)}
                  />

                  {/* Delete */}
                  <Trash
                    className="h-5 w-5 text-red-600 cursor-pointer"
                    onClick={() => {
                      setStudentToDelete(student);
                      setDeleteOpen(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD STUDENT FORM */}
      {showForm && (
        <>
          <h2 className="text-3xl font-bold mb-6">Add New Student</h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 bg-white shadow rounded-lg max-w-xl"
          >
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Roll Number</Label>
              <Input
                value={form.roll}
                onChange={(e) => setForm({ ...form, roll: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Department</Label>
              <Input
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                required
              />
            </div>

            <Button className="w-full bg-blue-600 text-white" type="submit">
              +Add Student
            </Button>
          </form>
        </>
      )}

      {/* ========================== */}
      {/*        EDIT MODAL          */}
      {/* ========================== */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Roll Number</Label>
              <Input
                value={editData.roll}
                onChange={(e) =>
                  setEditData({ ...editData, roll: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Department</Label>
              <Input
                value={editData.dept}
                onChange={(e) =>
                  setEditData({ ...editData, dept: e.target.value })
                }
              />
            </div>

            <Button className="w-full bg-blue-600 text-white" onClick={saveEdit}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================== */}
      {/*     DELETE CONFIRM MODAL   */}
      {/* ========================== */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
          </DialogHeader>

          <p className="text-gray-600 mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{studentToDelete?.name}</span>?
          </p>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>

            <Button
              className="bg-red-600 text-white"
              onClick={() => {
                setStudents(students.filter((s) => s.id !== studentToDelete.id));
                setDeleteOpen(false);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
