import { useState, useEffect, useMemo } from "react";
import { ChevronDown, FileText } from "lucide-react";

export default function ReportGenerator() {
  const [nbaReports, setNbaReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selection State
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch only from nbareports API
  useEffect(() => {
    fetchNbaReports();
  }, []);

  const fetchNbaReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("/api/criterion4/programs", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        // Handle potentially nested data structure if response wrapper is complex
        // User reports response structure: { data: { message: "...", data: [...] } } or just { message: "...", data: [...] }
        // We will robustly check both "data" and "data.data"
        let reports = [];
        if (Array.isArray(result.data)) {
          reports = result.data;
        } else if (result.data && Array.isArray(result.data.data)) {
          reports = result.data.data;
        }

        setNbaReports(reports || []);
      } else {
        console.error("Failed to fetch NBA reports");
      }
    } catch (error) {
      console.error("Error fetching NBA reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique Departments from loaded reports
  const departments = useMemo(() => {
    const depts = new Set();
    nbaReports.forEach(report => {
      const deptName = report?.reportData?.programInfo?.department;
      if (deptName) depts.add(deptName);
    });
    return Array.from(depts);
  }, [nbaReports]);

  // Filter Programs based on selected Department
  const availablePrograms = useMemo(() => {
    if (!selectedDepartment) return [];
    return nbaReports.filter(report =>
      report?.reportData?.programInfo?.department === selectedDepartment
    ).map(report => ({
      id: report._id,
      name: report.reportData.programInfo.programName,
      code: report.reportData.programInfo.programmeCode,
      fullReport: report // Store full reference
    }));
  }, [selectedDepartment, nbaReports]);

  const handleGenerate = async () => {
    if (!selectedProgramId) return;

    // Find the full report object for the selected program ID
    const selectedReport = nbaReports.find(r => r._id === selectedProgramId);
    if (!selectedReport) return;

    setIsGenerating(true);
    setToastMessage("");

    try {
      const response = await fetch("/api/criterion4/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportData: selectedReport.reportData,
          fileName: `NBA_Report_${selectedReport.reportData.programInfo.programName.replace(/\s+/g, '_')}.pdf`
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `NBA_Report_${selectedReport.reportData.programInfo.programName.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setToastMessage(`Report generated for: ${selectedReport.reportData.programInfo.department}`);
      } else {
        const errorData = await response.json();
        setToastMessage(`Failed to generate report: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      setToastMessage("An error occurred while generating the report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto shadow-md border rounded-xl p-4 sm:p-6 bg-white mt-4 sm:mt-6 w-[95%] sm:w-full max-w-2xl transition-all">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
          Department Reports
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Select an available program from the system to generate a report.
        </p>
      </div>

      {loading && <p className="text-sm text-gray-500 mb-4 animate-pulse">Loading available reports...</p>}

      {!loading && nbaReports.length === 0 && (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm mb-4">
          No NBA reports found in the system.
        </div>
      )}

      {/* Department Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
        <div className="relative">
          <select
            className="w-full bg-white text-black border p-3 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-black outline-none disabled:bg-gray-100 transition-all appearance-none"
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setSelectedProgramId("");
            }}
            disabled={departments.length === 0}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Program Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
        <div className="relative">
          <select
            className="w-full bg-white text-black border p-3 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-black outline-none disabled:bg-gray-100 transition-all appearance-none"
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
            disabled={!selectedDepartment || availablePrograms.length === 0}
          >
            <option value="">Select Program</option>
            {availablePrograms.map((prog) => (
              <option key={prog.id} value={prog.id}>
                {prog.name} ({prog.code})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <button
        className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg text-white transition-all font-medium tracking-wide active:scale-[0.98] ${selectedProgramId && !isGenerating
          ? "bg-black hover:bg-gray-800 cursor-pointer"
          : "bg-gray-300 cursor-not-allowed"
          }`}
        disabled={!selectedProgramId || isGenerating}
        onClick={handleGenerate}
      >
        <FileText className={`w-4 h-4 ${isGenerating ? "animate-pulse" : ""}`} />
        {isGenerating ? "Generating..." : "Generate Report"}
      </button>

      {toastMessage && (
        <div className={`mt-4 p-3 text-sm border rounded-lg animate-fadeIn ${toastMessage.includes("Failed") || toastMessage.includes("error")
            ? "text-red-700 bg-red-100 border-red-300"
            : "text-green-700 bg-green-100 border-green-300"
          }`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}