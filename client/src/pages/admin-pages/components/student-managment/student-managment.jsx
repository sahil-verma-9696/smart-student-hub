import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentTable } from "./student-table";
import { AddStudentForm } from "./add-student-form";
import { CsvUpload } from "./csv-upload";
import { UpdateStudentsCsv } from "./update-students-csv";
import { Users, UserPlus, Upload, FileEdit } from "lucide-react";
import useAuthContext from "@/hooks/useAuthContext";
import axios from "axios";

export function StudentManagement() {
  const { user } = useAuthContext();
  const INSTITUTE_ID = user?.institute?._id;
  const [students, setStudents] = useState([]);

  // Load students for the institute on mount / when institute changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!INSTITUTE_ID) return;

      try {
        const res = await axios.get("http://localhost:3000/student", {
          params: { instituteId: INSTITUTE_ID },
        });

        // Normalize response: backend may return array or wrapped object
        const payload = res.data;
        let list = [];

        if (Array.isArray(payload)) {
          list = payload;
        } else if (Array.isArray(payload?.data)) {
          list = payload.data;
        } else if (Array.isArray(payload?.successes)) {
          list = payload.successes;
        } else if (Array.isArray(payload?.students)) {
          list = payload.students;
        }

        setStudents(list);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, [INSTITUTE_ID]);

  /*********************************************************
   * **************** Handle Add Student ********************
   *********************************************************/
  const addStudent = async (studentData) => {
    const payload = {
      ...studentData,
      instituteId: INSTITUTE_ID,
      password: studentData.email, 
    };

    try {
      const res = await axios.post("http://localhost:3000/student", payload);

      // Normalize created student
      const created = Array.isArray(res.data)
        ? res.data[0]
        : res.data?.data ?? res.data;

      setStudents((prev) => [...prev, created]);

      console.log("Student added successfully!");
    } catch (err) {
      console.error("Failed to add student:", err);
    }
  };

  /*********************************************************
   * **************** Handle Bulk Add Student ********************
   *********************************************************/
  const addStudents = (newStudents) => {
    (async () => {
      const payloads = newStudents.map((student) => ({
        ...student,
        instituteId: INSTITUTE_ID,
        password: student.email, // email === password
      }));

      try {
        const res = await axios.post("http://localhost:3000/student/bulk/json", {
          instituteId: INSTITUTE_ID,
          students: payloads,
        });

        // backend returns object with `successes` array of created students
        const created = res.data?.successes ?? [];

        setStudents((prev) => [...prev, ...created]);
      } catch (err) {
        console.error("Bulk add failed, falling back to local add:", err);
        setStudents((prev) => [...prev, ...payloads]);
      }
    })();
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
    // call backend delete and update UI
    (async () => {
      try {
        await axios.delete(`http://localhost:3000/student/${id}`);
        setStudents((prev) => prev.filter((s) => s._id !== id));
      } catch (err) {
        console.error("Failed to delete student:", err);
      }
    })();
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
