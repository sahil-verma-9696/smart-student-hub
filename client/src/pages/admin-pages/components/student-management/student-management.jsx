import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentTable } from "./student-table";
import { AddStudentForm } from "./add-student-form";
import { CsvUpload } from "./csv-upload";
import { UpdateStudentsCsv } from "./update-students-csv";
import { Users, UserPlus, Upload, FileEdit } from "lucide-react";
import { studentAPI } from "@/services/api";
import toast from "react-hot-toast";

const INSTITUTE_ID = "69290e999fe3149cdc284749";

export function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  /*********************************************************
   * **************** Fetch Students ********************
   *********************************************************/
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getStudents({ instituteId: INSTITUTE_ID });
      setStudents(response.data || response || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  /*********************************************************
   * **************** Handle Add Student ********************
   *********************************************************/
  const addStudent = async (studentData) => {
    const payload = {
      ...studentData,
      instituteId: INSTITUTE_ID,
      password: studentData.email, // email === password
    };

    try {
      setLoading(true);
      const response = await studentAPI.createStudent(payload);
      toast.success("Student added successfully!");
      await fetchStudents(); // Refresh the list
      return response;
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error(error.response?.data?.message || "Failed to add student");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /*********************************************************
   * **************** Handle Bulk Add Student ********************
   *********************************************************/
  const addStudents = async (newStudents) => {
    const studentsWithPassword = newStudents.map((student) => ({
      ...student,
      password: student.email, // email === password
    }));

    const payload = {
      instituteId: INSTITUTE_ID,
      students: studentsWithPassword,
    };

    try {
      setLoading(true);
      const response = await studentAPI.bulkCreateStudents(payload);
      
      // Handle the response from backend
      const result = response.data || response;
      
      if (result.status === 'success') {
        toast.success(`Successfully added ${result.created} students!`);
      } else if (result.status === 'partial') {
        const duplicates = result.failures.filter(f => f.reason?.includes('duplicate key')).length;
        if (duplicates > 0) {
          toast.success(`Added ${result.created} students. ${duplicates} already exist (duplicates skipped).`);
        } else {
          toast.success(`Added ${result.created} students. ${result.failed} failed.`);
        }
        if (result.failures && result.failures.length > 0) {
          console.warn("Failed students:", result.failures);
        }
      } else if (result.status === 'failed') {
        const allDuplicates = result.failures.every(f => f.reason?.includes('duplicate key'));
        if (allDuplicates) {
          toast.error(`All students already exist in the database.`);
        } else {
          toast.error(`Failed to add students. Check console for details.`);
        }
        console.error("Failed students:", result.failures);
      }
      
      await fetchStudents(); // Refresh the list
      return response;
    } catch (error) {
      console.error("Error bulk adding students:", error);
      toast.error(error.response?.data?.message || "Failed to bulk add students");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update via CSV (by roll_number)
  const updateStudents = async (updates) => {
    try {
      setLoading(true);
      let updatedCount = 0;
      
      for (const update of updates) {
        const student = students.find(
          (s) =>
            s.roll_number &&
            update.roll_number &&
            s.roll_number.toLowerCase().trim() ===
              update.roll_number.toLowerCase().trim()
        );

        if (student) {
          const updatePayload = {
            instituteId: INSTITUTE_ID,
            ...(update.name && { name: update.name }),
            ...(update.gender && { gender: update.gender }),
            ...(update.email && { email: update.email }),
            ...(update.contactInfo && { contactInfo: update.contactInfo }),
          };

          await studentAPI.updateStudent(student._id || student.id, updatePayload);
          updatedCount++;
        }
      }

      toast.success(`Successfully updated ${updatedCount} students!`);
      await fetchStudents(); // Refresh the list
    } catch (error) {
      console.error("Error updating students:", error);
      toast.error(error.response?.data?.message || "Failed to update students");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      setLoading(true);
      await studentAPI.deleteStudent(id);
      toast.success("Student deleted successfully!");
      await fetchStudents(); // Refresh the list
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(error.response?.data?.message || "Failed to delete student");
    } finally {
      setLoading(false);
    }
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

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

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
