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
  const [currentYear, setCurrentYear] = useState("");
  const [currentSemester, setCurrentSemester] = useState("");
  const [success, setSuccess] = useState(false);

  const { instituteDepartments, institutePrograms } = useGlobalContext();

  const departments = instituteDepartments?.map((d) => d.name) || [];

  // 🔥 Get available years and semesters based on selected degree
  const availableYearsAndSemesters = useMemo(() => {
    if (!programPath || programPath.length < 2) {
      return { years: [], semesters: [] };
    }

    const [programId, degreeId] = programPath;
    const selectedProgram = institutePrograms?.find(p => p.id === programId);
    const selectedDegree = selectedProgram?.degrees?.find(d => d.id === degreeId);

    if (!selectedDegree?.yearLevels || selectedDegree.yearLevels.length === 0) {
      return { years: [], semesters: [] };
    }

    // Get all years from the degree
    const years = selectedDegree.yearLevels.map(yl => ({
      id: yl.id,
      year: yl.year,
      label: `Year ${yl.year}`,
      semesters: yl.semesters || []
    }));

    // Get semesters for the currently selected year
    const selectedYearData = years.find(y => y.id === currentYear);
    const semesters = selectedYearData?.semesters?.map(sem => ({
      id: sem.id,
      semNumber: sem.semNumber,
      label: `Semester ${sem.semNumber}`
    })) || [];

    return { years, semesters };
  }, [programPath, institutePrograms, currentYear]);

  // 🔥 Convert institutePrograms → Cascader options (flexible structure)
  const cascaderOptions = useMemo(() => {
    if (!institutePrograms) return [];

    return institutePrograms.map((program) => ({
      value: program.id,
      label: program.name,
      children: program.degrees?.map((degree) => {
        const hasBranches = degree.branches && degree.branches.length > 0;
        const hasSpecializations = degree.specializations && degree.specializations.length > 0;

        // Case 1: Degree has specializations directly (no branches)
        if (!hasBranches && hasSpecializations) {
          return {
            value: degree.id,
            label: degree.name,
            children: degree.specializations.map((spec) => ({
              value: spec.id,
              label: spec.name,
              isLeaf: true,
            })),
          };
        }

        // Case 2: Degree has neither branches nor specializations
        if (!hasBranches && !hasSpecializations) {
          return {
            value: degree.id,
            label: degree.name,
            isLeaf: true,
          };
        }

        // Case 3: Degree has branches - build branch level
        return {
          value: degree.id,
          label: degree.name,
          children: degree.branches.map((branch) => {
            // Check if branch has specializations
            if (!branch.specializations || branch.specializations.length === 0) {
              return {
                value: branch.id,
                label: branch.name,
                isLeaf: true,
              };
            }

            // Has specializations - build specialization level
            return {
              value: branch.id,
              label: branch.name,
              children: branch.specializations.map((spec) => ({
                value: spec.id,
                label: spec.name,
                isLeaf: true,
              })),
            };
          }),
        };
      }),
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
    programPath.length >= 2 && // Require at least program and degree
    currentYear &&
    currentSemester;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allRequiredFilled) return;

    // Flexible path handling:
    // [program, degree] - only degree
    // [program, degree, specialization] - degree with direct specialization (no branch)
    // [program, degree, branch] - degree with branch (no specialization)
    // [program, degree, branch, specialization] - full hierarchy
    const [programId, degreeId, thirdLevel, fourthLevel] = programPath;

    // Determine if thirdLevel is branch or specialization
    // If we have 4 levels, thirdLevel is branch, fourthLevel is specialization
    // If we have 3 levels, need to check if degree has branches or direct specializations
    let branchId = undefined;
    let specializationId = undefined;

    if (programPath.length === 4) {
      // Full hierarchy: program → degree → branch → specialization
      branchId = thirdLevel;
      specializationId = fourthLevel;
    } else if (programPath.length === 3) {
      // Either: program → degree → branch OR program → degree → specialization
      // Check if the selected degree has branches
      const selectedProgram = institutePrograms?.find(p => p.id === programId);
      const selectedDegree = selectedProgram?.degrees?.find(d => d.id === degreeId);
      const hasBranches = selectedDegree?.branches && selectedDegree.branches.length > 0;

      if (hasBranches) {
        branchId = thirdLevel;
      } else {
        specializationId = thirdLevel;
      }
    }

    // Get the actual year number and semester number from the selected IDs
    const selectedYearData = availableYearsAndSemesters.years.find(y => y.id === currentYear);
    const selectedSemesterData = availableYearsAndSemesters.semesters.find(s => s.id === currentSemester);

    try {
      await onAdd({
        name,
        email,
        gender,
        roll_number: rollNumber,
        contactInfo: {
          phone,
          alternatePhone,
          address,
        },
        // Send flat fields as backend expects
        program: programId,
        degree: degreeId,
        branch: branchId || undefined, // Only send if exists
        specialization: specializationId || undefined, // Only send if exists
        currentYear: selectedYearData?.year, // Send the year number (1, 2, 3, etc.)
        currentSemester: selectedSemesterData?.semNumber, // Send the semester number (1, 2, 3, etc.)
      });

      // Only clear form on success
      setName("");
      setEmail("");
      setGender("");
      setRollNumber("");
      setPhone("");
      setAlternatePhone("");
      setAddress("");
      setProgramPath([]);
      setCurrentYear("");
      setCurrentSemester("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to add student:", error);
      // Error is already shown by the parent component via toast
    }
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
              Program → Degree → Branch (optional) → Specialization (optional)
            </Label>
            <Cascader
              options={cascaderOptions}
              placeholder="Select academic structure"
              className="w-full"
              value={programPath}
              onChange={(value) => setProgramPath(value)}
              changeOnSelect
            />
          </div>

          {/* CURRENT YEAR */}
          <div className="space-y-2">
            <Label htmlFor="currentYear">Current Year</Label>
            <Select 
              value={currentYear} 
              onValueChange={(value) => {
                setCurrentYear(value);
                setCurrentSemester(""); // Reset semester when year changes
              }}
              disabled={!programPath || programPath.length < 2}
            >
              <SelectTrigger>
                <SelectValue placeholder={programPath.length < 2 ? "Select degree first" : "Select year"} />
              </SelectTrigger>
              <SelectContent>
                {availableYearsAndSemesters.years.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CURRENT SEMESTER */}
          <div className="space-y-2">
            <Label htmlFor="currentSemester">Current Semester</Label>
            <Select 
              value={currentSemester} 
              onValueChange={(value) => setCurrentSemester(value)}
              disabled={!currentYear}
            >
              <SelectTrigger>
                <SelectValue placeholder={!currentYear ? "Select year first" : "Select semester"} />
              </SelectTrigger>
              <SelectContent>
                {availableYearsAndSemesters.semesters.map((sem) => (
                  <SelectItem key={sem.id} value={sem.id}>
                    {sem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
