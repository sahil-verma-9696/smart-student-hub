"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, Plus, X } from "lucide-react"

export function DepartmentSetup({ onComplete }) {
  const [departments, setDepartments] = useState([
    {
      id: "1",
      name: "Computer Science & Engineering",
      code: "CSE",
      head: "",
      email: "",
      type: "engineering",
    },
  ])

  const [newDepartment, setNewDepartment] = useState({
    name: "",
    code: "",
    head: "",
    email: "",
    type: "",
  })

  const [academicYear, setAcademicYear] = useState("")
  const [semesterSystem, setSemesterSystem] = useState("")

  const addDepartment = () => {
    if (newDepartment.name && newDepartment.code) {
      const department = {
        id: Date.now().toString(),
        ...newDepartment,
      }
      setDepartments([...departments, department])
      setNewDepartment({ name: "", code: "", head: "", email: "", type: "" })
    }
  }

  const removeDepartment = (id) => {
    setDepartments(departments.filter((dept) => dept.id !== id))
  }

  const updateDepartment = (id, field, value) => {
    setDepartments(
      departments.map((dept) =>
        dept.id === id ? { ...dept, [field]: value } : dept
      )
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("[v0] Department setup data:", { departments, academicYear, semesterSystem })
    onComplete()
  }

  const departmentTypes = [
    { value: "engineering", label: "Engineering" },
    { value: "science", label: "Science" },
    { value: "arts", label: "Arts" },
    { value: "commerce", label: "Commerce" },
    { value: "management", label: "Management" },
    { value: "medical", label: "Medical" },
    { value: "law", label: "Law" },
    { value: "other", label: "Other" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          Department Structure
        </CardTitle>
        <CardDescription>
          Set up your academic departments and organizational structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Academic Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Current Academic Year *</Label>
              <Select value={academicYear} onValueChange={setAcademicYear} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                  <SelectItem value="2026-27">2026-27</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semesterSystem">Academic System *</Label>
              <Select value={semesterSystem} onValueChange={setSemesterSystem} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semester">Semester System</SelectItem>
                  <SelectItem value="annual">Annual System</SelectItem>
                  <SelectItem value="trimester">Trimester System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Existing Departments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Departments</h3>
              <Badge variant="secondary">{departments.length} departments</Badge>
            </div>

            <div className="space-y-3">
              {departments.map((dept) => (
                <div key={dept.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Department Name *</Label>
                      <Input
                        value={dept.name}
                        onChange={(e) => updateDepartment(dept.id, "name", e.target.value)}
                        placeholder="Department name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Code *</Label>
                      <Input
                        value={dept.code}
                        onChange={(e) => updateDepartment(dept.id, "code", e.target.value)}
                        placeholder="e.g., CSE"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={dept.type}
                        onValueChange={(value) => updateDepartment(dept.id, "type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDepartment(dept.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Department Head</Label>
                      <Input
                        value={dept.head}
                        onChange={(e) => updateDepartment(dept.id, "head", e.target.value)}
                        placeholder="Head of department name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Department Email</Label>
                      <Input
                        type="email"
                        value={dept.email}
                        onChange={(e) => updateDepartment(dept.id, "email", e.target.value)}
                        placeholder="dept@institution.edu"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Department */}
          <div className="border-2 border-dashed border-muted rounded-lg p-4">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Department
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Department Name</Label>
                <Input
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  placeholder="Department name"
                />
              </div>

              <div className="space-y-2">
                <Label>Code</Label>
                <Input
                  value={newDepartment.code}
                  onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value })}
                  placeholder="e.g., ECE"
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newDepartment.type}
                  onValueChange={(value) => setNewDepartment({ ...newDepartment, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="button"
              onClick={addDepartment}
              variant="outline"
              className="w-full bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="px-8">
              Continue to User Invitations
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
