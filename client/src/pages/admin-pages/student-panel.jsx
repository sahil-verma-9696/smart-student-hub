import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ActivitiesFilterPage() {
  // UI state
  const [selectedFilter, setSelectedFilter] = useState("students");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [yearDropdown, setYearDropdown] = useState(false);
  const [deptDropdown, setDeptDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Sample data
  const students = [
    { id: 1, name: "Sonal Verma", department: "CSE", year: "3rd", email: "sonal@example.com", phone: "9876543210", section: "A", course: "B.Tech" },
    { id: 2, name: "Riya Sharma", department: "ECE", year: "2nd", email: "riya@example.com", phone: "9876501234", section: "B", course: "B.Tech" },
    { id: 3, name: "Kunal Gupta", department: "IT", year: "1st", email: "kunal@example.com", phone: "9876123456", section: "A", course: "BCA" },
    { id: 4, name: "Sahil Kumar", department: "ME", year: "4th", email: "sahil@example.com", phone: "9876001122", section: "C", course: "B.Tech" },
    { id: 5, name: "Sakshi Singh", department: "CSE", year: "2nd", email: "sakshi@example.com", phone: "9876332211", section: "A", course: "B.Tech" },
    { id: 6, name: "Priya Mehta", department: "ECE", year: "3rd", email: "priya@example.com", phone: "9988332211", section: "B", course: "B.Tech" },
  ];

  const faculty = [
    { id: 1, name: "Dr. Mehta", department: "CSE", email: "mehta@example.com", phone: "9988776655" },
    { id: 2, name: "Prof. Arjun", department: "IT", email: "arjun@example.com", phone: "8877665544" },
  ];

  const departments = ["CSE", "ECE", "IT", "ME"];

  // Filtering helpers
  const filterStudents = () => {
    let data = students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

    if (selectedYear) {
      // compare by starting number (1,2,3,4)
      data = data.filter((s) => s.year.startsWith(selectedYear));
    }

    if (selectedDepartment) {
      data = data.filter((s) => s.department === selectedDepartment);
    }

    return data;
  };

  const filterFaculty = () => {
    return faculty.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  };

  // Click handlers
  const handleSelect = (filter) => {
    setSelectedFilter(filter);
    setDropdownOpen(false);
    // reset sub-dropdowns when switching
    setYearDropdown(false);
    setDeptDropdown(false);
    // if switching to students, keep selectedYear/Department as-is (they refine results)
    // if switching to all or faculty, clear student-specific filters
    if (filter === "faculty" || filter === "all") {
      setSelectedYear("");
      setSelectedDepartment("");
    }
  };

  const handleYearPick = (y) => {
    setSelectedYear(y);
    setSelectedFilter("students");
    setYearDropdown(false);
    setDropdownOpen(false);
  };

  const handleDeptPick = (d) => {
    setSelectedDepartment(d);
    setSelectedFilter("students");
    setDeptDropdown(false);
    setDropdownOpen(false);
  };

  // Render Table(s) based on selection
  const renderTable = () => {
    if (selectedFilter === "students") {
      return (
        <>
          <div className="relative mt-4 w-80">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              className="w-full border rounded-xl pl-10 p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Table className="mt-6 bg-white rounded-xl shadow">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterStudents().map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.department}</TableCell>
                  <TableCell>{s.year}</TableCell>
                  <TableCell>{s.section}</TableCell>
                  <TableCell>{s.course}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      );
    }

    if (selectedFilter === "faculty") {
      return (
        <>
          <div className="relative mt-4 w-80">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <input
              className="w-full border rounded-xl pl-10 p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Search faculty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Table className="mt-6 bg-white rounded-xl shadow">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterFaculty().map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.name}</TableCell>
                  <TableCell>{f.department}</TableCell>
                  <TableCell>{f.email}</TableCell>
                  <TableCell>{f.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      );
    }

    // 'all' shows both lists one after another
    if (selectedFilter === "all") {
      return (
        <div className="space-y-8">
          <div>
            <h2 className="font-semibold">Students</h2>
            <Table className="mt-2 bg-white rounded-xl shadow">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.department}</TableCell>
                    <TableCell>{s.year}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h2 className="font-semibold">Faculty</h2>
            <Table className="mt-2 bg-white rounded-xl shadow">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faculty.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>{f.name}</TableCell>
                    <TableCell>{f.department}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      );
    }

    return <p className="mt-6 text-gray-500">Please select a filter.</p>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Student Panel — Activities</h1>

        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-xl"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Filter className="h-5 w-5" />
          </Button>

          {dropdownOpen && (
            <Card className="absolute right-0 mt-2 w-56 shadow-lg rounded-xl bg-white z-10">
              <ul className="py-2 text-sm">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelect("all")}>
                  All
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelect("students")}>
                  Students
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelect("faculty")}>
                  Faculty
                </li>

                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative">
                  <div onClick={() => setDeptDropdown(!deptDropdown)} className="flex justify-between items-center">
                    <span>Department</span>
                    <span className="text-xs text-gray-500">{selectedDepartment || "All"}</span>
                  </div>

                  {deptDropdown && (
                    <ul className="mt-2 ml-2 bg-white border rounded-lg">
                      {departments.map((d) => (
                        <li key={d} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleDeptPick(d)}>
                          {d}
                        </li>
                      ))}
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold" onClick={() => handleDeptPick("")}>All Departments</li>
                    </ul>
                  )}
                </li>

                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative" onClick={() => setYearDropdown(!yearDropdown)}>
                  <div className="flex justify-between items-center">
                    <span>Year</span>
                    <span className="text-xs text-gray-500">{selectedYear ? `${selectedYear} Year` : "All"}</span>
                  </div>

                  {yearDropdown && (
                    <ul className="mt-2 ml-2 bg-white border rounded-lg">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleYearPick("1")}>1 Year</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleYearPick("2")}>2 Year</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleYearPick("3")}>3 Year</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleYearPick("4")}>4 Year</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold" onClick={() => handleYearPick("")}>All Years</li>
                    </ul>
                  )}
                </li>
              </ul>
            </Card>
          )}
        </div>
      </div>

      {renderTable()}
    </div>
  );
}
