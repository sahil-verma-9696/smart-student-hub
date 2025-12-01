import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentTable } from "./student-table";
import { AddStudentForm } from "./add-student-form";
import { CsvUpload } from "./csv-upload";
import { UpdateStudentsCsv } from "./update-students-csv";
import { Users, UserPlus, Upload, FileEdit } from "lucide-react";

const INSTITUTE_ID = "69290e999fe3149cdc284749";

export function StudentManagement() {
  const [students, setStudents] = useState([]);

  /*********************************************************
   * **************** Handle Add Student ********************
   *********************************************************/
  const addStudent = (studentData) => {
    const payload = {
      ...studentData,
      instituteId: INSTITUTE_ID,
      password: studentData.email, // email === password
    };

    console.log("Adding student:", payload);

    setStudents((prev) => [...prev, payload]);

    // Here you can also call your backend:
    // await axios.post("/students", payload)
  };

  /*********************************************************
   * **************** Handle Bulk Add Student ********************
   *********************************************************/
  const addStudents = (newStudents) => {
    const payloads = newStudents.map((student) => ({
      ...student,
      instituteId: INSTITUTE_ID,
      password: student.email, // email === password
    }));

    console.log(payloads);

    setStudents((prev) => [...prev, ...payloads]);

    // Backend example:
    // await axios.post("/students/bulk", payloads)
  };

  // Update via CSV (by roll_number)
  const updateStudents = (updates) => {
    setStudents((prev) => {
      return prev.map((student) => {
        const update = updates.find(
          (u) =>
            u.roll_number &&
            student.roll_number &&
            u.roll_number.toLowerCase().trim() ===
              student.roll_number.toLowerCase().trim()
        );

        if (!update) return student;

        return {
          ...student,
          name: update.name || student.name,
          gender: update.gender || student.gender,
          email: update.email || student.email,
          roll_number: update.roll_number || student.roll_number,
          contactInfo: {
            ...student.contactInfo,
            ...(update.contactInfo || {}),
          },
        };
      });
    });

    // Optionally call backend for bulk update here
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Student Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Register and manage student records
        </p>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="students" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Students</span>
          </TabsTrigger>
          <TabsTrigger value="add" className="gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Student</span>
          </TabsTrigger>
          <TabsTrigger value="csv-upload" className="gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">CSV Upload</span>
          </TabsTrigger>
          <TabsTrigger value="update-csv" className="gap-2">
            <FileEdit className="h-4 w-4" />
            <span className="hidden sm:inline">Update via CSV</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <StudentTable students={students} onDelete={deleteStudent} />
        </TabsContent>

        <TabsContent value="add">
          <AddStudentForm onAdd={addStudent} />
        </TabsContent>

        <TabsContent value="csv-upload">
          <CsvUpload onUpload={addStudents} />
        </TabsContent>

        <TabsContent value="update-csv">
          <UpdateStudentsCsv students={students} onUpdate={updateStudents} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
