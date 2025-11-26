"use client";

import React, { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Pencil, Trash, Search } from "lucide-react";

export default function FacultyPanel() {
  // Lists
  const departmentList = ["CSE", "IT", "ECE", "ME", "CIVIL", "EN", "MBA", "MCA"];

  const designationList = [
    "Professor",
    "Assistant Professor",
    "Associate Professor",
    "Lecturer",
    "HOD",
  ];

  // Sample data
  const [faculty, setFaculty] = useState([
    {
      id: 1,
      name: "Dr. Amit Sharma",
      email: "amit@college.com",
      empId: "FAC001",
      department: "CSE",
      designation: "Professor",
    },
    {
      id: 2,
      name: "Prof. Riya Singh",
      email: "riya@college.com",
      empId: "FAC002",
      department: "IT",
      designation: "Assistant Professor",
    },
  ]);

  // Add Dialog
  const [addDialog, setAddDialog] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    empId: "",
    department: "",
    designation: "",
  });

  // Edit Dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Delete Dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // Filters
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");

  // TABLE COLUMNS
  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "empId", header: "Employee ID" },
      { accessorKey: "department", header: "Department" },
      { accessorKey: "designation", header: "Designation" },

      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const f = row.original;
          return (
            <div className="flex items-center gap-3">
              <Pencil
                className="h-5 w-5 text-blue-600 cursor-pointer"
                onClick={() => {
                  setEditData({ ...f });
                  setEditOpen(true);
                }}
              />

              <Trash
                className="h-5 w-5 text-red-600 cursor-pointer"
                onClick={() => {
                  setToDelete(f);
                  setDeleteOpen(true);
                }}
              />
            </div>
          );
        },
      },
    ],
    []
  );

  // FILTER LOGIC
  const filteredData = useMemo(() => {
    return faculty.filter((f) => {
      if (selectedDept && f.department !== selectedDept) return false;
      if (selectedDesignation && f.designation !== selectedDesignation)
        return false;
      return true;
    });
  }, [faculty, selectedDept, selectedDesignation]);

  // TABLE INSTANCE
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // ADD FACULTY SUBMIT
  const handleAddSubmit = (e) => {
    e.preventDefault();

    const newFaculty = {
      id: Date.now(),
      ...addForm,
    };

    setFaculty((prev) => [newFaculty, ...prev]);
    setAddDialog(false);

    setAddForm({
      name: "",
      email: "",
      empId: "",
      department: "",
      designation: "",
    });
  };

  // SAVE EDIT
  const saveEdit = () => {
    setFaculty((prev) =>
      prev.map((f) => (f.id === editData.id ? editData : f))
    );
    setEditOpen(false);
  };

  // DELETE
  const confirmDelete = () => {
    setFaculty((prev) => prev.filter((f) => f.id !== toDelete.id));
    setDeleteOpen(false);
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Faculty Panel</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <Input
              placeholder="Search faculty..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            className="bg-blue-600 text-white"
            onClick={() => setAddDialog(true)}
          >
            Add Faculty
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div>
          <Label>Department</Label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">All Departments</option>
            {departmentList.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <Label>Designation</Label>
          <select
            value={selectedDesignation}
            onChange={(e) => setSelectedDesignation(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">All Designations</option>
            {designationList.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden shadow bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center p-6 text-gray-500"
                >
                  No faculty found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ADD FACULTY POPUP */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Faculty</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4">

            <div>
              <Label>Name</Label>
              <Input
                required
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                required
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
              />
            </div>

            <div>
              <Label>Employee ID</Label>
              <Input
                required
                value={addForm.empId}
                onChange={(e) => setAddForm({ ...addForm, empId: e.target.value })}
              />
            </div>

            <div>
              <Label>Department</Label>
              <select
                required
                className="border rounded p-2 w-full"
                value={addForm.department}
                onChange={(e) =>
                  setAddForm({ ...addForm, department: e.target.value })
                }
              >
                <option value="">Select Department</option>
                {departmentList.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Designation</Label>
              <select
                required
                className="border rounded p-2 w-full"
                value={addForm.designation}
                onChange={(e) =>
                  setAddForm({ ...addForm, designation: e.target.value })
                }
              >
                <option value="">Select Designation</option>
                {designationList.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 text-white">
                Submit
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT FACULTY POPUP */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Faculty</DialogTitle>
          </DialogHeader>

          {editData && (
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
                <Label>Employee ID</Label>
                <Input
                  value={editData.empId}
                  onChange={(e) =>
                    setEditData({ ...editData, empId: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Department</Label>
                <select
                  className="border rounded p-2 w-full"
                  value={editData.department}
                  onChange={(e) =>
                    setEditData({ ...editData, department: e.target.value })
                  }
                >
                  {departmentList.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Designation</Label>
                <select
                  className="border rounded p-2 w-full"
                  value={editData.designation}
                  onChange={(e) =>
                    setEditData({ ...editData, designation: e.target.value })
                  }
                >
                  {designationList.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <Button className="bg-blue-600 text-white" onClick={saveEdit}>
                  Save Changes
                </Button>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE POPUP */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Faculty</DialogTitle>
          </DialogHeader>

          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{toDelete?.name}</span>?
          </p>

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>

            <Button className="bg-red-600 text-white" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
