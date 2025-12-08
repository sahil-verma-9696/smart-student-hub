// src/components/dashboard/QuickActions.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, Upload, Table, Sparkles } from "lucide-react";

export default function QuickActions({ 
  onRegisterStudent, 
  onRegisterFaculty, 
  onBulkStudentUpload,
  onBulkFacultyUpload,
  onViewRegistrations
}) {
  return (
    <Card className="shadow-lg border-2 border-blue-100 dark:border-blue-900 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          Quick Actions
        </CardTitle>
        <CardDescription>
          Register new users or upload data in bulk
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">

          <Button 
            className="w-full group hover:scale-105 transition-all duration-200 hover:shadow-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            onClick={onRegisterStudent}
          >
            <UserPlus className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            Register Student
          </Button>

          <Button 
            className="w-full group hover:scale-105 transition-all duration-200 hover:shadow-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            onClick={onRegisterFaculty}
          >
            <Users className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            Register Faculty
          </Button>

          <Button 
            className="w-full group hover:scale-105 transition-all duration-200 border-2 border-blue-500 bg-white dark:bg-gray-900 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg shadow-sm"
            onClick={onBulkStudentUpload}
          >
            <Upload className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
            Bulk Upload Students
          </Button>

          <Button 
            className="w-full group hover:scale-105 transition-all duration-200 border-2 border-blue-500 bg-white dark:bg-gray-900 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg shadow-sm"
            onClick={onBulkFacultyUpload}
          >
            <Upload className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
            Bulk Upload Faculty
          </Button>

          <Button 
            className="w-full group hover:scale-105 transition-all duration-200 hover:shadow-lg bg-blue-500 hover:bg-blue-600 text-white shadow-md"
            onClick={onViewRegistrations}
          >
            <Table className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            View Registrations
          </Button>

        </div>
      </CardContent>
    </Card>
  );
}
