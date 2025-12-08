import { useState } from "react";
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

export function AddFacultyForm({ onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState(false);

  const allRequiredFilled =
    name &&
    email &&
    gender &&
    employeeCode &&
    phone &&
    alternatePhone &&
    address;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!allRequiredFilled) return;

    onAdd({
      name,
      email,
      gender,
      employee_code: employeeCode,
      department: department || undefined,
      designation: designation || undefined,
      contactInfo: {
        phone,
        alternatePhone,
        address,
      },
    });

    setName("");
    setEmail("");
    setGender("");
    setEmployeeCode("");
    setDepartment("");
    setDesignation("");
    setPhone("");
    setAlternatePhone("");
    setAddress("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Card className="max-w-screen">
      <CardHeader>
        <CardTitle>Add New Faculty</CardTitle>
        <CardDescription>
          Required fields: name, email, gender, employee_code, phone, alternatePhone, address.
          Password will automatically be the same as the email for the API request, and instituteId is hardcoded on the client.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter faculty name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (also used as password)</Label>
            <Input
              id="email"
              type="email"
              placeholder="faculty@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={(value) => setGender(value)}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee_code">Employee Code</Label>
            <Input
              id="employee_code"
              placeholder="Unique employee code (e.g., FAC001)"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department (Optional)</Label>
            <Input
              id="department"
              placeholder="e.g., Computer Science"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation (Optional)</Label>
            <Input
              id="designation"
              placeholder="e.g., Assistant Professor"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="Primary phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternatePhone">Alternate Phone</Label>
            <Input
              id="alternatePhone"
              placeholder="Alternate phone"
              value={alternatePhone}
              onChange={(e) => setAlternatePhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={!allRequiredFilled}>
            Add Faculty
          </Button>

          {success && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              Faculty added successfully!
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
