import { useState, useCallback } from "react";
import Papa from "papaparse";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Info,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UPDATE_CSV_CONFIG = {
  // roll_number used to match existing students
  requiredHeaders: ["roll_number"],
  optionalHeaders: ["name", "email", "gender", "phone", "alternatePhone", "address"],
};

const normalizeHeader = (h) => h.toLowerCase().trim();

const headerIndex = (headerRow, key) =>
  headerRow.findIndex((h) => normalizeHeader(h) === key.toLowerCase());

export function UpdateStudentsCsv({ students, onUpdate }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFile = useCallback(
    (file) => {
      setError(null);
      setSuccess(null);
      setFileName(file.name);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async ({ data, errors, meta }) => {
          try {
            if (errors.length > 0) {
              console.error(errors);
              throw new Error("CSV contains formatting issues");
            }

            const headers = meta.fields || [];
            const missingRequired = UPDATE_CSV_CONFIG.requiredHeaders.filter(
              (key) => !headers.some((h) => normalizeHeader(h) === key.toLowerCase())
            );

            if (missingRequired.length > 0) {
              throw new Error(
                `CSV must have at least the following column(s): ${missingRequired.join(", ")}`
              );
            }

            const updates = [];

            for (const row of data) {
              const roll_number = row.roll_number || row.roll_Number || row.ROLL_NUMBER;
              if (!roll_number) continue;

              const update = { roll_number };

              if (row.name) update.name = row.name;
              if (row.email) update.email = row.email;

              const gender = row.gender?.toLowerCase();
              if (gender && ["male", "female", "other"].includes(gender)) {
                update.gender = gender;
              }

              const phone = row.phone;
              const alternatePhone = row.alternatePhone || row.alternatephone;
              const address = row.address;

              if (phone || alternatePhone || address) {
                update.contactInfo = {};
                if (phone) update.contactInfo.phone = phone;
                if (alternatePhone) update.contactInfo.alternatePhone = alternatePhone;
                if (address) update.contactInfo.address = address;
              }

              updates.push(update);
            }

            if (updates.length === 0) {
              throw new Error("No valid update records found in CSV");
            }

            const matched = updates.filter((u) =>
              students.some(
                (s) =>
                  s.roll_number &&
                  u.roll_number &&
                  s.roll_number.toLowerCase().trim() ===
                    u.roll_number.toLowerCase().trim()
              )
            );
            const notFound = updates
              .filter(
                (u) =>
                  !students.some(
                    (s) =>
                      s.roll_number &&
                      u.roll_number &&
                      s.roll_number.toLowerCase().trim() ===
                        u.roll_number.toLowerCase().trim()
                  )
              )
              .map((u) => u.roll_number);

            await onUpdate(updates);
            setSuccess({ count: matched.length, notFound });
          } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to parse CSV");
          }
        },
      });
    },
    [onUpdate, students]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type === "text/csv") {
        handleFile(file);
      } else {
        setError("Please upload a valid CSV file");
      }
    },
    [handleFile]
  );

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const downloadCurrentStudents = () => {
    if (students.length === 0) {
      setError("No students to export. Add students first.");
      return;
    }

    const escapeCSV = (value) => {
      if (value == null) return "";
      const str = String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const header = [
      "roll_number",
      "name",
      "email",
      "gender",
      "phone",
      "alternatePhone",
      "address",
    ].join(",");
    
    const rows = students.map((s) => {
      // Handle both populated and unpopulated basicUserDetails
      const userDetails = typeof s.basicUserDetails === 'object' && s.basicUserDetails !== null 
        ? s.basicUserDetails 
        : {};
      
      return [
        escapeCSV(s.roll_number),
        escapeCSV(userDetails.name || s.name || ""),
        escapeCSV(userDetails.email || s.email || ""),
        escapeCSV(userDetails.gender || s.gender || ""),
        escapeCSV(userDetails.contactInfo?.phone || s.contactInfo?.phone || ""),
        escapeCSV(userDetails.contactInfo?.alternatePhone || s.contactInfo?.alternatePhone || ""),
        escapeCSV(userDetails.contactInfo?.address || s.contactInfo?.address || ""),
      ].join(",");
    });
    
    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students_update_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="max-w-screen">
      <CardHeader>
        <CardTitle>Update Student Details via CSV</CardTitle>
        <CardDescription>
          Upload a CSV file to update student details. Students are matched by
          roll_number.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Currently {students.length} student
            {students.length !== 1 ? "s" : ""} registered. Download the template
            to get a pre-filled CSV with student roll numbers.
          </AlertDescription>
        </Alert>

        <Button
          variant="outline"
          onClick={downloadCurrentStudents}
          className="gap-2 bg-transparent"
          disabled={students.length === 0}
        >
          <Download className="h-4 w-4" />
          Download Update Template
        </Button>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
            id="update-csv-upload"
          />
          <label htmlFor="update-csv-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-muted p-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  {fileName ? fileName : "Drop your update CSV here"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse
                </p>
              </div>
            </div>
          </label>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <div className="space-y-2">
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Successfully updated {success.count} student
                {success.count !== 1 ? "s" : ""}!
              </AlertDescription>
            </Alert>
            {success.notFound.length > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {success.notFound.length} roll_number
                  {success.notFound.length !== 1 ? "s" : ""} not found:{" "}
                  {success.notFound.join(", ")}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Update CSV Format
          </h4>
          <pre className="text-sm text-muted-foreground font-mono bg-background rounded p-3 overflow-x-auto">
            roll_number,name,email,gender,phone,alternatePhone,address{"\n"}
            S1,Student One,student1@gmail.com,male,9876501234,9988776655,"HSR
            Layout, Bengaluru"
            {"\n"}
            S2,Student Two,student2@gmail.com,female,9876505678,8877665544,"BTM
            Layout, Bengaluru"
          </pre>
          <p className="text-xs text-muted-foreground mt-2">
            Only roll_number is required for matching. Other columns are
            optional and will overwrite existing values if provided.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
