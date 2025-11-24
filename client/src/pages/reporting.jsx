"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Users, BookOpen, AlertCircle, Search, ArrowUpDown, Mail, Phone } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"





// Mock database with comprehensive student data
const MOCK_DATA = {
  "B.Tech 1st Year": {
    A: {
      AI: [
        { id: 1, name: "Aditi Sharma", attendance: 62, score: 55, email: "aditi@college.edu", status: "at-risk" },
        { id: 2, name: "Rohan Singh", attendance: 58, score: 49, email: "rohan@college.edu", status: "at-risk" },
        { id: 3, name: "Priya Patel", attendance: 88, score: 78, email: "priya@college.edu", status: "active" },
        { id: 4, name: "Mohit Verma", attendance: 66, score: 52, email: "mohit@college.edu", status: "at-risk" },
        { id: 5, name: "Isha Kumar", attendance: 92, score: 85, email: "isha@college.edu", status: "active" },
      ],
      ML: [
        { id: 6, name: "Vikram Desai", attendance: 75, score: 68, email: "vikram@college.edu", status: "active" },
        { id: 7, name: "Neha Gupta", attendance: 80, score: 72, email: "neha@college.edu", status: "active" },
      ],
      DAA: [{ id: 8, name: "Arjun Nair", attendance: 55, score: 48, email: "arjun@college.edu", status: "at-risk" }],
    },
    B: {
      AI: [{ id: 9, name: "Sameer Ahmed", attendance: 70, score: 65, email: "sameer@college.edu", status: "active" }],
    },
  },
  "B.Tech 2nd Year": {
    A: {
      "AI & ML": [
        { id: 10, name: "Aditi Sharma", attendance: 62, score: 55, email: "aditi@college.edu", status: "at-risk" },
        { id: 11, name: "Rohan Singh", attendance: 58, score: 49, email: "rohan@college.edu", status: "at-risk" },
        { id: 12, name: "Priya Patel", attendance: 88, score: 78, email: "priya@college.edu", status: "active" },
      ],
      DBMS: [{ id: 13, name: "Mohit Verma", attendance: 66, score: 52, email: "mohit@college.edu", status: "at-risk" }],
    },
  },
}

export default function FacultyReporting() {
  const [filters, setFilters] = useState({
    class: "B.Tech 2nd Year",
    section: "A",
    subject: "AI & ML",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "score", direction: "desc" })

  // New state for modal/contact features and enhanced data tracking
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [notificationLog, setNotificationLog] = useState([])

  // Get filtered and sorted student data
  const studentData = useMemo(() => {
    const classData = MOCK_DATA[filters.class]
    if (!classData) return []

    const sectionData = classData[filters.section]
    if (!sectionData) return []

    const subjectData = sectionData[filters.subject]
    if (!subjectData) return []

    const filtered = subjectData.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1
      }
      return aValue < bValue ? 1 : -1
    })

    return filtered
  }, [filters, searchTerm, sortConfig])

  // Calculate statistics
  const stats = useMemo(() => {
    if (studentData.length === 0) {
      return { total: 0, avgScore: 0, avgAttendance: 0, atRiskCount: 0 }
    }

    const avgScore = Math.round(studentData.reduce((sum, s) => sum + s.score, 0) / studentData.length)
    const avgAttendance = Math.round(studentData.reduce((sum, s) => sum + s.attendance, 0) / studentData.length)
    const atRiskCount = studentData.filter((s) => s.status === "at-risk").length

    return {
      total: studentData.length,
      avgScore,
      avgAttendance,
      atRiskCount,
    }
  }, [studentData])

  // Prepare chart data
  const performanceDistribution = useMemo(() => {
    const ranges = [
      { range: "0-40", count: 0, color: "#ef4444" },
      { range: "41-60", count: 0, color: "#f97316" },
      { range: "61-80", count: 0, color: "#eab308" },
      { range: "81-100", count: 0, color: "#22c55e" },
    ]

    studentData.forEach((student) => {
      if (student.score <= 40) ranges[0].count++
      else if (student.score <= 60) ranges[1].count++
      else if (student.score <= 80) ranges[2].count++
      else ranges[3].count++
    })

    return ranges
  }, [studentData])

  const attendanceTrends = useMemo(() => {
    const ranges = [
      { range: "0-40%", count: 0 },
      { range: "41-60%", count: 0 },
      { range: "61-80%", count: 0 },
      { range: "81-100%", count: 0 },
    ]

    studentData.forEach((student) => {
      if (student.attendance <= 40) ranges[0].count++
      else if (student.attendance <= 60) ranges[1].count++
      else if (student.attendance <= 80) ranges[2].count++
      else ranges[3].count++
    })

    return ranges
  }, [studentData])

  // Export handlers
  const exportCSV = () => {
    const headers = ["Name", "Attendance", "Score", "Status"]
    const rows = studentData.map((s) => [s.name, `${s.attendance}%`, `${s.score}%`, s.status])
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `report-${filters.class}-${filters.section}-${filters.subject}.csv`
    a.click()
  }

  const exportPDF = () => {
    const timestamp = new Date().toLocaleString()
    const content = `
FACULTY REPORTING DASHBOARD - DETAILED REPORT
Generated: ${timestamp}

FILTERS APPLIED:
Class: ${filters.class}
Section: ${filters.section}
Subject: ${filters.subject}

STATISTICS:
Total Students: ${stats.total}
Average Score: ${stats.avgScore}%
Average Attendance: ${stats.avgAttendance}%
At-Risk Students: ${stats.atRiskCount}

STUDENT DATA:
${studentData.map((s) => `${s.name} | Attendance: ${s.attendance}% | Score: ${s.score}% | Status: ${s.status}`).join("\n")}

AT-RISK STUDENTS DETAILS:
${studentData
  .filter((s) => s.status === "at-risk")
  .map((s) => `• ${s.name} - Email: ${s.email} | Attendance: ${s.attendance}% | Score: ${s.score}%`)
  .join("\n")}
  `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `report-${filters.class}-${filters.section}-${filters.subject}-${Date.now()}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleStudentAction = (student, type) => {
    setSelectedStudent(student)
    setActionType(type)

    const timestamp = new Date().toLocaleTimeString()
    const action = `${type === "email" ? "📧 Email" : "📞 Phone"} - ${student.name} at ${timestamp}`
    setNotificationLog((prev) => [...prev, action])

    console.log(`[v0] ${type.toUpperCase()} action triggered for ${student.name}`)

    // Simulate action completion
    setTimeout(() => {
      setSelectedStudent(null)
      setActionType(null)
    }, 1500)
  }

  const atRiskStudents = useMemo(() => {
    return studentData.filter((s) => s.status === "at-risk")
  }, [studentData])

  const toggleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "desc" ? "asc" : "desc",
    })
  }

  return (
    <div className="w-full min-h-screen bg-background px-4 sm:px-6 md:px-10 py-6 md:py-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-600">Students Reports</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Real-time insights about student performance, attendance, and academic progress.
          </p>
        </div>

        {/* FILTER SECTION */}
        <Card className="bg-white border-purple-200 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="text-lg sm:text-base text-purple-700">Filters & Search</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Refine the report by selecting class, section, and subject. Use search to find students.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Select onValueChange={(value) => setFilters({ ...filters, class: value })} defaultValue={filters.class}>
                <SelectTrigger className="border-purple-300 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B.Tech 1st Year">B.Tech 1st Year</SelectItem>
                  <SelectItem value="B.Tech 2nd Year">B.Tech 2nd Year</SelectItem>
                  <SelectItem value="B.Tech 3rd Year">B.Tech 3rd Year</SelectItem>
                  <SelectItem value="B.Tech 4th Year">B.Tech 4th Year</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) => setFilters({ ...filters, section: value })}
                defaultValue={filters.section}
              >
                <SelectTrigger className="border-purple-300 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) => setFilters({ ...filters, subject: value })}
                defaultValue={filters.subject}
              >
                <SelectTrigger className="border-purple-300 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AI & ML">AI & ML</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="ML">ML</SelectItem>
                  <SelectItem value="DAA">DAA</SelectItem>
                  <SelectItem value="DBMS">DBMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <Search className="text-gray-500 flex-shrink-0" size={18} />
              <input
                type="text"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* PERFORMANCE SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-4 border-purple-300 bg-white hover:bg-purple-50 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <Users className="text-purple-600 flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Students</p>
                  <p className="text-lg sm:text-xl font-semibold">{stats.total}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-4 border-purple-300 bg-white hover:bg-purple-50 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <TrendingUp className="text-purple-600 flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg Score</p>
                  <p className="text-lg sm:text-xl font-semibold">{stats.avgScore}%</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-4 border-purple-300 bg-white hover:bg-purple-50 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <BookOpen className="text-purple-600 flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg Attendance</p>
                  <p className="text-lg sm:text-xl font-semibold">{stats.avgAttendance}%</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-4 border-red-300 bg-red-50 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">At-Risk</p>
                  <p className="text-lg sm:text-xl font-semibold text-red-600">{stats.atRiskCount}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Performance Distribution */}
          <Card className="border-purple-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-purple-700">Performance Distribution</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Score breakdown across ranges</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceDistribution}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Attendance Distribution */}
          <Card className="border-purple-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-purple-700">Attendance Distribution</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Attendance percentage breakdown</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <BarChart data={attendanceTrends} margin={{ top: 5, right: 30, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" angle={-45} height={80} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* STUDENT DETAILS TABLE */}
        <Card className="border-purple-200 bg-white hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg text-purple-700">Student Details</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Click column headers to sort • Use filters above
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">
                      <button
                        onClick={() => toggleSort("name")}
                        className="font-semibold flex items-center gap-1 hover:text-purple-600 whitespace-nowrap"
                      >
                        Name <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                      <button
                        onClick={() => toggleSort("attendance")}
                        className="font-semibold flex items-center gap-1 hover:text-purple-600 mx-auto whitespace-nowrap"
                      >
                        Att. <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                      <button
                        onClick={() => toggleSort("score")}
                        className="font-semibold flex items-center gap-1 hover:text-purple-600 mx-auto whitespace-nowrap"
                      >
                        Score <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center whitespace-nowrap">Status</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.length > 0 ? (
                    studentData.map((student) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-2 sm:px-4 py-2 sm:py-3 truncate">{student.name}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold inline-block ${
                              student.attendance >= 75
                                ? "bg-green-100 text-green-800"
                                : student.attendance >= 60
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold inline-block ${
                              student.score >= 75
                                ? "bg-green-100 text-green-800"
                                : student.score >= 60
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {student.score}%
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                          <span
                            className={`px-1 sm:px-2 py-1 rounded text-xs font-semibold ${
                              student.status === "at-risk" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {student.status === "at-risk" ? "⚠️ At Risk" : "✓ Active"}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                          <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                            <button className="p-1 hover:bg-blue-100 rounded flex-shrink-0" title="Email">
                              <Mail size={14} className="text-blue-600" />
                            </button>
                            <button className="p-1 hover:bg-green-100 rounded flex-shrink-0" title="Call">
                              <Phone size={14} className="text-green-600" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-6 text-center text-xs sm:text-sm text-muted-foreground">
                        No students found. Try different filters or search terms.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* AT-RISK STUDENTS ALERT */}
        {atRiskStudents.length > 0 && (
          <Card className="border-red-200 bg-red-50 hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-red-600 flex items-center gap-2">
                <AlertCircle className="size-4 sm:size-5 flex-shrink-0" /> At-Risk Students ({atRiskStudents.length})
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Students with low attendance or poor performance require immediate attention.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {atRiskStudents.map((student, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 border border-red-200 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:bg-red-100 transition"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{student.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Email: {student.email} • Att: {student.attendance}% • Score: {student.score}%
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs text-blue-600 border-blue-300 hover:bg-blue-100 bg-transparent flex-1 sm:flex-none"
                        onClick={() => handleStudentAction(student, "email")}
                      >
                        {selectedStudent?.id === student.id && actionType === "email" ? "✓ Sent" : "Email"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs text-green-600 border-green-300 hover:bg-green-100 bg-transparent flex-1 sm:flex-none"
                        onClick={() => handleStudentAction(student, "phone")}
                      >
                        {selectedStudent?.id === student.id && actionType === "phone" ? "✓ Called" : "Call"}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* DOWNLOAD SECTION */}
        <div className="flex flex-col gap-8 w-full mt-6 pt-4 border-t border-gray-200 sm:mx-auto">
          <div className="flex flex-col sm:flex-row gap-6">
            <Button
              variant="outline"
              className="border-purple-400 text-purple-600 hover:bg-purple-100 bg-transparent text-sm w-full sm:w-auto"
              onClick={exportCSV}
            >
              <Download className="mr-2 h-4 w-4" /> Export as CSV
            </Button>

            <Button
              className="bg-purple-600 text-white hover:bg-purple-700 text-sm w-full sm:w-auto"
              onClick={exportPDF}
            >
              <Download className="mr-2 h-4 w-4" /> Export as Report
            </Button>
          </div>

          {notificationLog.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-600 text-xs sm:text-sm">
                  Action Log ({notificationLog.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {notificationLog.map((log, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground font-mono break-words">
                      {log}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
