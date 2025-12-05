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
    "roll_number",
    "phone",
    "alternatePhone",
    "address",
    "branch",
    "degree",
    "program",
  ],
  headerAliases: {
    roll_number: ["rollnumber", "roll number", "roll", "roll_no"],
    alternatePhone: ["alternate_phone", "altphone", "alt_phone", "alt-contact"],
  },
};

const normalize = (h) => h.toLowerCase().trim();

const findHeaderKey = (headers, key) => {
  const normalized = headers.map(normalize);
  const aliases = [key, ...(CSV_CONFIG.headerAliases[key] || [])].map(
    normalize
  );

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
            throw new Error(`Missing required columns: ${missing.join(", ")}`);
          }

          // Transform rows
          const students = [];

          for (const row of data) {
            const student = {};

            for (const key of CSV_CONFIG.requiredHeaders) {
              const headerKey = findHeaderKey(Object.keys(row), key);
              const value = row[headerKey];

              if (!value) {
                student.valid = false;
                break;
              }

              if (key === "gender") {
                const g = value.toLowerCase();
                if (!["male", "female", "other"].includes(g)) {
                  student.valid = false;
                }
                student.gender = g;
              } else if (["phone", "alternatePhone"].includes(key)) {
                student[key] = value.toString();
              } else {
                student[key] = value;
              }
            }

            if (student.valid === false) continue;

            students.push({
              name: student.name,
              email: student.email,
              gender: student.gender,
              roll_number: student.roll_number,
              contactInfo: {
                phone: student.phone,
                alternatePhone: student.alternatePhone,
                address: student.address,
              },
              branch: student.branch,
              degree: student.degree,
              program: student.program,
            });
          }

          if (students.length === 0) {
            throw new Error("No valid rows found in CSV");
          }

          setUploading(true);
          await onUpload(students);
          setSuccess({ count: students.length });
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
    const template = CSV_CONFIG.requiredHeaders.join(",") + "\n";

    const blob = new Blob([template], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "students_template.csv";
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Students via CSV</CardTitle>
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

          <label
            htmlFor="csv-upload"
            className={
              uploading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                <p className="font-medium">Uploading students...</p>
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
              Successfully added {success.count} students!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
