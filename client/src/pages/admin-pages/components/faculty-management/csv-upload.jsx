import { useState } from "react";
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
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CSV_CONFIG = {
  requiredHeaders: [
    "name",
    "email",
    "gender",
    "employee_code",
    "phone",
    "alternatePhone",
    "address",
  ],
  optionalHeaders: ["department", "designation"],
  headerAliases: {
    employee_code: ["employeecode", "employee code", "emp_code", "emp-code"],
    alternatePhone: ["alternate_phone", "altphone", "alt_phone", "alt-contact"],
  },
};

const normalize = (h) => h.toLowerCase().trim();

const findHeaderKey = (headers, key) => {
  const normalized = headers.map(normalize);
  const aliases = [key, ...(CSV_CONFIG.headerAliases[key] || [])].map(normalize);

  for (let alias of aliases) {
    const index = normalized.indexOf(alias);
    if (index !== -1) return headers[index];
  }
  return null;
};

export function CsvUpload({ onUpload }) {
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (file) => {
    setError(null);
    setSuccess(null);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: async ({ data, errors, meta }) => {
        try {
          if (errors.length > 0) {
            console.error(errors);
            throw new Error("CSV contains formatting issues");
          }

          const headers = meta.fields || [];
          const missing = [];

          // Validate required columns
          for (const key of CSV_CONFIG.requiredHeaders) {
            const headerKey = findHeaderKey(headers, key);
            if (!headerKey) missing.push(key);
          }

          if (missing.length > 0) {
            throw new Error(
              `Missing required columns: ${missing.join(", ")}`
            );
          }

          // Transform rows
          const faculties = [];

          for (const row of data) {
            const faculty = {};

            for (const key of CSV_CONFIG.requiredHeaders) {
              const headerKey = findHeaderKey(Object.keys(row), key);
              const value = row[headerKey];

              if (!value) {
                faculty.valid = false;
                break;
              }

              if (key === "gender") {
                const g = value.toLowerCase();
                if (!["male", "female", "other"].includes(g)) {
                  faculty.valid = false;
                }
                faculty.gender = g;
              } else if (
                ["phone", "alternatePhone"].includes(key)
              ) {
                faculty[key] = value.toString();
              } else {
                faculty[key] = value;
              }
            }

            if (faculty.valid === false) continue;

            // Handle optional fields
            const departmentKey = findHeaderKey(Object.keys(row), "department");
            const designationKey = findHeaderKey(Object.keys(row), "designation");

            faculties.push({
              name: faculty.name,
              email: faculty.email,
              gender: faculty.gender,
              employee_code: faculty.employee_code,
              department: departmentKey ? row[departmentKey] : undefined,
              designation: designationKey ? row[designationKey] : undefined,
              contactInfo: {
                phone: faculty.phone,
                alternatePhone: faculty.alternatePhone,
                address: faculty.address,
              },
            });
          }

          if (faculties.length === 0) {
            throw new Error("No valid rows found in CSV");
          }

          setUploading(true);
          await onUpload(faculties);
          setSuccess({ count: faculties.length });
          setUploading(false);
        } catch (err) {
          console.error(err);
          setError(err.message);
          setUploading(false);
        }
      },
    });
  };

  const downloadTemplate = () => {
    const template =
      "name,email,gender,employee_code,department,designation,phone,alternatePhone,address\n" +
      `Faculty One,faculty1@gmail.com,male,FAC001,Computer Science,Assistant Professor,9876501234,9988776655,"JP Nagar, Bengaluru"\n` +
      `Faculty Two,faculty2@gmail.com,female,FAC002,Mathematics,Associate Professor,9876505678,8877665544,"BTM Layout, Bengaluru"\n`;

    const blob = new Blob([template], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "faculty_template.csv";
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Faculty via CSV</CardTitle>
        <CardDescription>
          Uses PapaParse (comma-safe). Addresses with commas will not break
          columns.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Button onClick={downloadTemplate} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download CSV Template
        </Button>

        <div
          className="border-2 border-dashed rounded-lg p-8 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
        >
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
            disabled={uploading}
          />

          <label htmlFor="csv-upload" className={uploading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}>
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                <p className="font-medium">Uploading faculty...</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="font-medium">
                  {fileName || "Drop your CSV here or click to browse"}
                </p>
              </>
            )}
          </label>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Successfully added {success.count} faculty member{success.count !== 1 ? "s" : ""}!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
