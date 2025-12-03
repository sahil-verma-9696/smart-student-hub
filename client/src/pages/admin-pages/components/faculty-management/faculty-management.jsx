import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacultyTable } from "./faculty-table";
import { AddFacultyForm } from "./add-faculty-form";
import { CsvUpload } from "./csv-upload";
import { UpdateFacultyCsv } from "./update-faculty-csv";
import { Users, UserPlus, Upload, FileEdit } from "lucide-react";
import { facultyAPI } from "@/services/api";
import toast from "react-hot-toast";

const INSTITUTE_ID = "69290e999fe3149cdc284749";

export function FacultyManagement() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);

  /*********************************************************
   * **************** Fetch Faculties ********************
   *********************************************************/
  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const response = await facultyAPI.getFaculties({ instituteId: INSTITUTE_ID });
      setFaculties(response.data || response || []);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      toast.error("Failed to load faculties");
    } finally {
      setLoading(false);
    }
  };

  /*********************************************************
   * **************** Handle Add Faculty ********************
   *********************************************************/
  const addFaculty = async (facultyData) => {
    const payload = {
      ...facultyData,
      instituteId: INSTITUTE_ID,
      password: facultyData.email, // email === password
    };

    try {
      setLoading(true);
      const response = await facultyAPI.createFaculty(payload);
      toast.success("Faculty added successfully!");
      await fetchFaculties(); // Refresh the list
      return response;
    } catch (error) {
      console.error("Error adding faculty:", error);
      toast.error(error.response?.data?.message || "Failed to add faculty");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /*********************************************************
   * **************** Handle Bulk Add Faculty ********************
   *********************************************************/
  const addFaculties = async (newFaculties) => {
    const facultiesWithPassword = newFaculties.map((faculty) => ({
      ...faculty,
      password: faculty.email, // email === password
    }));

    const payload = {
      instituteId: INSTITUTE_ID,
      faculties: facultiesWithPassword,
    };

    try {
      setLoading(true);
      const response = await facultyAPI.bulkCreateFaculties(payload);
      
      // Handle the response from backend
      const result = response.data || response;
      
      if (result.status === 'success') {
        toast.success(`Successfully added ${result.created} faculty members!`);
      } else if (result.status === 'partial') {
        const duplicates = result.failures.filter(f => f.reason?.includes('duplicate key')).length;
        if (duplicates > 0) {
          toast.success(`Added ${result.created} faculty. ${duplicates} already exist (duplicates skipped).`);
        } else {
          toast.success(`Added ${result.created} faculty. ${result.failed} failed.`);
        }
        if (result.failures && result.failures.length > 0) {
          console.warn("Failed faculty:", result.failures);
        }
      } else if (result.status === 'failed') {
        const allDuplicates = result.failures.every(f => f.reason?.includes('duplicate key'));
        if (allDuplicates) {
          toast.error(`All faculty members already exist in the database.`);
        } else {
          toast.error(`Failed to add faculty. Check console for details.`);
        }
        console.error("Failed faculty:", result.failures);
      }
      
      await fetchFaculties(); // Refresh the list
      return response;
    } catch (error) {
      console.error("Error bulk adding faculties:", error);
      toast.error(error.response?.data?.message || "Failed to bulk add faculties");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update via CSV (by employee_code)
  const updateFaculties = async (updates) => {
    try {
      setLoading(true);
      let updatedCount = 0;
      
      for (const update of updates) {
        const faculty = faculties.find(
          (f) =>
            f.employee_code &&
            update.employee_code &&
            f.employee_code.toLowerCase().trim() ===
              update.employee_code.toLowerCase().trim()
        );

        if (faculty) {
          const updatePayload = {
            ...(update.name && { name: update.name }),
            ...(update.gender && { gender: update.gender }),
            ...(update.email && { email: update.email }),
            ...(update.department && { department: update.department }),
            ...(update.designation && { designation: update.designation }),
            ...(update.contactInfo && { contactInfo: update.contactInfo }),
          };

          await facultyAPI.updateFaculty(faculty._id || faculty.id, updatePayload);
          updatedCount++;
        }
      }

      toast.success(`Successfully updated ${updatedCount} faculty members!`);
      await fetchFaculties(); // Refresh the list
    } catch (error) {
      console.error("Error updating faculties:", error);
      toast.error(error.response?.data?.message || "Failed to update faculties");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFaculty = async (id) => {
    try {
      setLoading(true);
      await facultyAPI.deleteFaculty(id);
      toast.success("Faculty deleted successfully!");
      await fetchFaculties(); // Refresh the list
    } catch (error) {
      console.error("Error deleting faculty:", error);
      toast.error(error.response?.data?.message || "Failed to delete faculty");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Faculty Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Register and manage faculty records
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      <Tabs defaultValue="faculties" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="faculties" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Faculty</span>
          </TabsTrigger>
          <TabsTrigger value="add" className="gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Faculty</span>
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

        <TabsContent value="faculties">
          <FacultyTable faculties={faculties} onDelete={deleteFaculty} />
        </TabsContent>

        <TabsContent value="add">
          <AddFacultyForm onAdd={addFaculty} />
        </TabsContent>

        <TabsContent value="csv-upload">
          <CsvUpload onUpload={addFaculties} />
        </TabsContent>

        <TabsContent value="update-csv">
          <UpdateFacultyCsv faculties={faculties} onUpdate={updateFaculties} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
