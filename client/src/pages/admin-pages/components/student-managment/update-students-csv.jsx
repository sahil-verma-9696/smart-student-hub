import { useState, useCallback } from "react";
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

  const parseCsv = (content) => {
    const lines = content.trim().split("\n");
    if (lines.length < 2)
      throw new Error("CSV must have a header row and at least one data row");

    const headerRaw = lines[0].split(",").map((h) => h.trim());

    const missingRequired = UPDATE_CSV_CONFIG.requiredHeaders.filter((key) => {
      const idx = headerIndex(headerRaw, key);
      return idx === -1;
    });

    if (missingRequired.length > 0) {
      throw new Error(
        `CSV must have at least the following column(s): ${missingRequired.join(
          ", "
        )}`
      );
    }

    const idx = {
      roll_number: headerIndex(headerRaw, "roll_number"),
      name: headerIndex(headerRaw, "name"),
      email: headerIndex(headerRaw, "email"),
      gender: headerIndex(headerRaw, "gender"),
      phone: headerIndex(headerRaw, "phone"),
      alternatePhone: headerIndex(headerRaw, "alternatePhone"),
      address: headerIndex(headerRaw, "address"),
    };

    const updates = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].trim();
      if (!row) continue;

      const values = row.split(",").map((v) => v.trim());
      const getVal = (index) =>
        index >= 0 && index < values.length ? values[index] : "";

      const roll_number = getVal(idx.roll_number);
      if (!roll_number) continue;

      const update = {
        roll_number,
      };

      const name = getVal(idx.name);
      if (name) update.name = name;

      const email = getVal(idx.email);
      if (email) update.email = email;

      const gender = getVal(idx.gender)?.toLowerCase();
      if (gender && ["male", "female", "other"].includes(gender)) {
        update.gender = gender;
      }

      const phone = getVal(idx.phone);
      const alternatePhone = getVal(idx.alternatePhone);
      const address = getVal(idx.address);

      if (phone || alternatePhone || address) {
        update.contactInfo = {};
        if (phone) update.contactInfo.phone = phone;
        if (alternatePhone) update.contactInfo.alternatePhone = alternatePhone;
        if (address) update.contactInfo.address = address;
      }

      updates.push(update);
    }

    return updates;
  };

  const handleFile = useCallback(
    (file) => {
      setError(null);
      setSuccess(null);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          const updates = parseCsv(content);

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

          onUpdate(updates);
          setSuccess({ count: matched.length, notFound });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to parse CSV");
        }
      };
      reader.readAsText(file);
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

    const header = [
      "roll_number",
      "name",
      "email",
      "gender",
      "phone",
      "alternatePhone",
      "address",
    ].join(",");
    const rows = students.map((s) =>
      [
        s.roll_number || "",
        s.name || "",
        s.email || "",
        s.gender || "",
        s.contactInfo?.phone || "",
        s.contactInfo?.alternatePhone || "",
        s.contactInfo?.address || "",
      ].join(",")
    );
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
