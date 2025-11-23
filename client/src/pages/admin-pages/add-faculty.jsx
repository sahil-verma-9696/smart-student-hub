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

export default function AdminAddFacultyPage() {
  // Initial faculty data
  const [faculties, setFaculties] = useState([
    { id: 1, name: "Dr. Ramesh Kumar", email: "ramesh.kumar@example.com", empId: "F1001", department: "CSE", position: "Professor" },
    { id: 2, name: "Prof. Meera Jain", email: "meera.jain@example.com", empId: "F1002", department: "ECE", position: "Associate Professor" },
    { id: 3, name: "Dr. Vikram Singh", email: "vikram.singh@example.com", empId: "F1003", department: "IT", position: "Assistant Professor" },
  ]);

  // Add form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    empId: "",
    department: "",
    position: "",
  });

  // EDIT modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    email: "",
    empId: "",
    department: "",
    position: "",
  });

  // DELETE modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  // Add Faculty handler
  const handleAdd = (e) => {
    e.preventDefault();

    const newFaculty = {
      id: faculties.length + 1,
      name: form.name,
      email: form.email,
      empId: form.empId,
      department: form.department,
      position: form.position,
    };

    setFaculties([...faculties, newFaculty]);

    alert("Faculty added successfully!");

    setForm({ name: "", email: "", empId: "", department: "", position: "" });
  };

  // Open edit modal
  const openEdit = (faculty) => {
    setEditData(faculty);
    setEditOpen(true);
  };

  // Save edited faculty
  const saveEdit = () => {
    setFaculties(
      faculties.map((f) => (f.id === editData.id ? editData : f))
    );
    setEditOpen(false);
  };

  // Open delete modal
  const confirmDelete = (faculty) => {
    setFacultyToDelete(faculty);
    setDeleteOpen(true);
  };

  // Perform delete
  const performDelete = () => {
    if (!facultyToDelete) return;
    setFaculties(faculties.filter((f) => f.id !== facultyToDelete.id));
    setDeleteOpen(false);
    setFacultyToDelete(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-4">All Faculties</h2>

      {/* Faculties Table */}
      <div className="border rounded-lg overflow-hidden shadow bg-white mb-10">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Employee ID</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Position</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {faculties.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="p-3">{f.id}</td>
                <td className="p-3">{f.name}</td>
                <td className="p-3">{f.email}</td>
                <td className="p-3">{f.empId}</td>
                <td className="p-3">{f.department}</td>
                <td className="p-3">{f.position}</td>
                <td className="p-3 flex gap-3">
                  <Pencil
                    className="h-5 w-5 text-blue-600 cursor-pointer"
                    onClick={() => openEdit(f)}
                  />
                  <Trash
                    className="h-5 w-5 text-red-600 cursor-pointer"
                    onClick={() => confirmDelete(f)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Faculty Form */}
      <h2 className="text-3xl font-bold mb-6">Add New Faculty</h2>

      <form
        onSubmit={handleAdd}
        className="space-y-6 p-6 bg-white shadow rounded-lg max-w-2xl"
      >
        <div>
          <Label>Name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
            required
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email address"
            required
          />
        </div>

        <div>
          <Label>Employee ID</Label>
          <Input
            value={form.empId}
            onChange={(e) => setForm({ ...form, empId: e.target.value })}
            placeholder="Employee ID (e.g., F1004)"
            required
          />
        </div>

        <div>
          <Label>Department</Label>
          <Input
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            placeholder="Department (e.g., CSE)"
            required
          />
        </div>

        <div>
          <Label>Position</Label>
          <Input
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            placeholder="Position (e.g., Professor)"
            required
          />
        </div>

        <Button className="w-full bg-blue-600 text-white" type="submit">
          Add Faculty
        </Button>
      </form>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Faculty</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>

            <div>
              <Label>Employee ID</Label>
              <Input
                value={editData.empId}
                onChange={(e) => setEditData({ ...editData, empId: e.target.value })}
              />
            </div>

            <div>
              <Label>Department</Label>
              <Input
                value={editData.department}
                onChange={(e) => setEditData({ ...editData, department: e.target.value })}
              />
            </div>

            <div>
              <Label>Position</Label>
              <Input
                value={editData.position}
                onChange={(e) => setEditData({ ...editData, position: e.target.value })}
              />
            </div>

            <Button className="w-full bg-blue-600 text-white" onClick={saveEdit}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM MODAL */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Faculty</DialogTitle>
          </DialogHeader>

          <p className="text-gray-600 mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{facultyToDelete?.name}</span>?
          </p>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>

            <Button
              className="bg-red-600 text-white"
              onClick={performDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
