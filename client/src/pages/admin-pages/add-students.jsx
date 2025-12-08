"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

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

import useStudentPannel from "@/hooks/useStudentPannel.admin";

export default function AdminAddStudentsPage() {
  // ============================
  // HOOKS — must be at the top
  // ============================
  const { students } = useStudentPannel();

  // UI States
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    roll: "",
    department: "",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    email: "",
    roll: "",
    dept: "",
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // ============================
  // PREPARE TABLE DATA
  // ============================
  const columnHelper = createColumnHelper();

  const data = useMemo(() => {
    if (!students) return [];
    return students.map((s, index) => ({
      id: index + 1,
      studentId: s._id,
      name: s.basicUserDetails?.name,
      email: s.basicUserDetails?.email,
      gender: s.basicUserDetails?.gender,
      phone: s.basicUserDetails?.contactInfo?.phone,
      address: s.basicUserDetails?.contactInfo?.address,
      role: s.basicUserDetails?.role,
      createdAt: new Date(s.basicUserDetails?.createdAt).toLocaleDateString(),
    }));
  }, [students]);

  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("email", { header: "Email" }),
    columnHelper.accessor("gender", { header: "Gender" }),
    columnHelper.accessor("phone", { header: "Phone" }),
    columnHelper.accessor("address", { header: "Address" }),
    columnHelper.accessor("role", { header: "Role" }),
    columnHelper.accessor("createdAt", { header: "Created At" }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // ============================
  // FORM HANDLERS
  // ============================
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Student added! (Backend integration needed)");
    setShowForm(false);
  };

  const openEdit = (student) => {
    setEditData(student);
    setEditOpen(true);
  };

  const saveEdit = () => {
    alert("Edit saved! (Backend integration needed)");
    setEditOpen(false);
  };

  // ============================
  // LOADING CHECK (AFTER HOOKS)
  // ============================
  if (!students) return <div>Loading...</div>;

  // ============================
  // UI RETURN
  // ============================
  return (
    <div className="p-6">
      {/* TABLE */}
      <div className="rounded-xl border bg-white shadow overflow-hidden mb-10">
        <table className="w-full">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3 text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
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
              + Add Student
            </Button>
          </form>
        </>
      )}

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Label>Name</Label>
            <Input
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <Label>Email</Label>
            <Input
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
            />

            <Button
              className="w-full bg-blue-600 text-white"
              onClick={saveEdit}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
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

            <Button className="bg-red-600 text-white">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
