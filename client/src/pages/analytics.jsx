import React, { useState } from "react";
import { motion } from "framer-motion";

import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { StudentEngagement } from "@/components/analytics/student-engagement";
import { ActivityTrends } from "@/components/analytics/activity-trends";
import { DepartmentComparison } from "@/components/analytics/department-comparison";
import { ReportGeneration } from "@/components/analytics/report-generation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function FacultyAnalyticsPage() {
  return (
    <div className="flex h-screen bg-purple-100 text-black">
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Main Section */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-black">
                  Faculty Analytics & Reporting
                </h1>
                <p className="text-purple-800 mt-1">
                  View student-specific and institutional performance insights
                </p>
              </div>
            </div>

            {/* 🔍 Search Filters */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-purple-50 border-purple-500 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-900">
                    Search Student
                  </CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Student Name"
                    className="bg-white border-purple-400 text-black hover:border-purple-900 transition"
                  />

                  <Input
                    placeholder="Roll Number"
                    className="bg-white border-purple-400 text-black hover:border-purple-900 transition"
                  />

                  <Select>
                    <SelectTrigger className="bg-purple-100 border-purple-400 text-black hover:border-purple-600 transition">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-200 text-purple-600 border-purple-400">
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="bg-purple-100 border-purple-400 text-black hover:border-purple-600 transition">
                      <SelectValue placeholder="Branch" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-200 text-purple-600 border-purple-400">
                      <SelectItem value="cse">CSE</SelectItem>
                      <SelectItem value="aiml">AIML</SelectItem>
                      <SelectItem value="ece">ECE</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </motion.div>

            {/* 📊 Student-Level Analytics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                "Academic Performance",
                "Co-Curricular Activities",
                "NAAC Metrics",
                "AICTE Compliance",
                "NIRF Indicators",
                "Internal Evaluations",
              ].map((title, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 + index * 0.1 }}
                >
                  <Card className="bg-white border-purple-500 hover:scale-[1.02] transition-transform shadow-xl cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-purple-900">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-black">
                      Student-level insights will appear here.
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* 🌍 Institutional Analytics (Original components) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-10">
              <div className="lg:col-span-3 space-y-6">
                <AnalyticsOverview />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <StudentEngagement />
                  <ActivityTrends />
                </div>

                <DepartmentComparison />
              </div>

              <div className="space-y-6">
                <ReportGeneration />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
