import { StudentOverview } from "@/components/dashboard/student-overview";
import { AchievementStats } from "@/components/dashboard/achievement-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users, Upload, Table, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AdminDashboardPage() {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    const elements = document.querySelectorAll("[data-scroll-animation]");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with animation */}
        <div 
          id="header"
          data-scroll-animation
          className={`flex items-center justify-between transition-all duration-700 ${
            isVisible("header") 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 -translate-y-8"
          }`}
        >
          <div className="space-y-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Manage your institution with ease
            </p>
          </div>
          <div className="text-sm text-muted-foreground px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 backdrop-blur-sm border border-blue-200 dark:border-blue-800">
            Welcome Back
          </div>
        </div>

        {/* Action Button Panel with scroll animation */}
        <div
          id="actions"
          data-scroll-animation
          className={`transition-all duration-700 delay-100 ${
            isVisible("actions")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
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
                >
                  <UserPlus className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Register Student
                </Button>
                <Button 
                  className="w-full group hover:scale-105 transition-all duration-200 hover:shadow-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  <Users className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Register Faculty
                </Button>
                <Button 
                  className="w-full group hover:scale-105 transition-all duration-200 border-2 border-blue-500 bg-white dark:bg-gray-900 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg shadow-sm"
                >
                  <Upload className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
                  Bulk Upload Students
                </Button>
                <Button 
                  className="w-full group hover:scale-105 transition-all duration-200 border-2 border-blue-500 bg-white dark:bg-gray-900 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg shadow-sm"
                >
                  <Upload className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
                  Bulk Upload Faculty
                </Button>
                <Button 
                  className="w-full group hover:scale-105 transition-all duration-200 hover:shadow-lg bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                >
                  <Table className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  View Registrations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid with scroll animations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div
              id="student-overview"
              data-scroll-animation
              className={`transition-all duration-700 delay-200 ${
                isVisible("student-overview")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12"
              }`}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-700 group">
                <CardHeader className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardTitle className="relative text-blue-900 dark:text-blue-100">Student Overview</CardTitle>
                  <CardDescription className="relative">
                    Current enrollment and statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <StudentOverview />
                </CardContent>
              </Card>
            </div>


          </div>

          <div className="space-y-6">
            <div
              id="achievement-stats"
              data-scroll-animation
              className={`transition-all duration-700 delay-400 ${
                isVisible("achievement-stats")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-700 group">
                <CardHeader className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardTitle className="relative text-blue-900 dark:text-blue-100">Achievement Stats</CardTitle>
                  <CardDescription className="relative">
                    Performance metrics and milestones
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <AchievementStats />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}