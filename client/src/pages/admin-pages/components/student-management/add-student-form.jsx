import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import { Cascader } from "antd";
import { useGlobalContext } from "@/contexts/global-context";

export function AddStudentForm({ onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [programPath, setProgramPath] = useState([]); // <-- cascader selected array
  const [success, setSuccess] = useState(false);

  const { instituteDepartments, institutePrograms } = useGlobalContext();

  const departments = instituteDepartments.map((d) => d.name);

  // 🔥 Convert institutePrograms → Cascader options
  const cascaderOptions = useMemo(() => {
    if (!institutePrograms) return [];

    return institutePrograms.map((program) => ({
      value: program.id,
      label: program.name,
      children: program.degrees?.map((degree) => ({
        value: degree.id,
        label: degree.name,
        children: degree.branches?.map((branch) => ({
          value: branch.id,
          label: branch.name,
          children: branch.specializations?.map((spec) => ({
            value: spec.id,
            label: spec.name,
            children:
              degree.yearLevels?.map((year) => ({
                value: year.id,
                label: `Year ${year.year}`,
                children: year.semesters?.map((sem) => ({
                  value: sem.id,
                  label: `Semester ${sem.semNumber}`,
                })),
              })) ?? [],
          })),
        })),
      })),
    }));
  }, [institutePrograms]);

  const allRequiredFilled =
    name &&
    email &&
    gender &&
    rollNumber &&
    phone &&
    alternatePhone &&
    address &&
    programPath.length === 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allRequiredFilled) return;

    const [
      programId,
      degreeId,
      branchId,
      specializationId,
      yearId,
      semesterId,
    ] = programPath;

    onAdd({
      name,
      email,
      gender,
      roll_number: rollNumber,
      contactInfo: {
        phone,
        alternatePhone,
        address,
      },
      programStructure: {
        programId,
        degreeId,
        branchId,
        specializationId,
        yearId,
        semesterId,
      },
    });

    setName("");
    setEmail("");
    setGender("");
    setRollNumber("");
    setPhone("");
    setAlternatePhone("");
    setAddress("");
    setProgramPath([]);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Card className="max-w-screen">
      <CardHeader>
        <CardTitle>Add New Student</CardTitle>
        <CardDescription>
          All fields are required. Program selection is hierarchical.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAME */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label htmlFor="email">Email (also password)</Label>
            <Input
              id="email"
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* GENDER */}
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={(value) => setGender(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* DEPARTMENT */}
          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              value={department}
              onValueChange={(value) => setDepartment(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments?.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PROGRAM CASCADER */}
          <div className="space-y-2">
            <Label>
              Program → Degree → Branch → Specialization → Year → Semester
            </Label>
            <Cascader
              options={cascaderOptions}
              placeholder="Select complete academic structure"
              className="w-full"
              value={programPath}
              onChange={(value) => setProgramPath(value)}
              changeOnSelect
            />
          </div>

          {/* ROLL NUMBER */}
          <div className="space-y-2">
            <Label htmlFor="roll_number">Roll Number</Label>
            <Input
              id="roll_number"
              placeholder="e.g., S1"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
            />
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="Primary phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* ALT PHONE */}
          <div className="space-y-2">
            <Label htmlFor="alternatePhone">Alternate Phone</Label>
            <Input
              id="alternatePhone"
              placeholder="Alternate phone"
              value={alternatePhone}
              onChange={(e) => setAlternatePhone(e.target.value)}
            />
          </div>

          {/* ADDRESS */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            className="w-full"
            disabled={!allRequiredFilled}
          >
            Add Student
          </Button>

          {success && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              Student added successfully!
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
