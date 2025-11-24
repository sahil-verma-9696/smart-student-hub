import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users, Upload, Table, Sparkles, TrendingUp, Award, BookOpen, GraduationCap } from "lucide-react";
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
    <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8">
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
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-slate-900">
            
            </h1>
            <p className="text-base text-slate-600 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-slate-900" />
              Manage your institution with ease
            </p>
          </div>
          <div className="text-sm text-slate-700 px-6 py-3 rounded-2xl bg-white shadow-lg border border-slate-200">
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
          <Card className="bg-white rounded-3xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-900 text-2xl">
                <div className="p-4 rounded-2xl bg-slate-100">
                  <Sparkles className="w-6 h-6 text-slate-900" />
                </div>
                Quick Actions
              </CardTitle>
              <CardDescription className="text-slate-600 text-base ml-16">
                Register new users or upload data in bulk
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-8 px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <Button 
                  className="w-full h-14 group hover:scale-105 transition-all duration-300 bg-slate-900 hover:bg-slate-800 text-white shadow-lg rounded-3xl font-medium text-base"
                >
                  <UserPlus className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Register Student
                </Button>
                <Button 
                  className="w-full h-14 group hover:scale-105 transition-all duration-300 bg-slate-900 hover:bg-slate-800 text-white shadow-lg rounded-3xl font-medium text-base"
                >
                  <Users className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Register Faculty
                </Button>
                <Button 
                  className="w-full h-14 group hover:scale-105 transition-all duration-300 bg-white hover:bg-slate-50 text-slate-900 shadow-lg rounded-3xl font-medium text-base border-2 border-slate-900"
                >
                  <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                  Bulk Upload Students
                </Button>
                <Button 
                  className="w-full h-14 group hover:scale-105 transition-all duration-300 bg-white hover:bg-slate-50 text-slate-900 shadow-lg rounded-3xl font-medium text-base border-2 border-slate-900"
                >
                  <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                  Bulk Upload Faculty
                </Button>
                <Button 
                  className="w-full h-14 group hover:scale-105 transition-all duration-300 bg-slate-800 hover:bg-slate-700 text-white shadow-lg rounded-3xl font-medium text-base"
                >
                  <Table className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  View Registrations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid with scroll animations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div
              id="student-overview"
              data-scroll-animation
              className={`transition-all duration-700 delay-200 ${
                isVisible("student-overview")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12"
              }`}
            >
              <Card className="bg-white rounded-3xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="relative overflow-hidden pb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardTitle className="relative text-slate-900 text-2xl flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-slate-100">
                      <Users className="w-5 h-5 text-slate-900" />
                    </div>
                    Student Overview
                  </CardTitle>
                  <CardDescription className="relative text-slate-600 text-base ml-14">
                    Current enrollment and statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative pt-2 pb-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-xl bg-slate-900">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-xs font-medium text-slate-600">Total Students</p>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">2,847</p>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +12% from last month
                        </p>
                      </div>
                      
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-xl bg-slate-900">
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-xs font-medium text-slate-600">Active Courses</p>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">156</p>
                        <p className="text-xs text-slate-500 mt-1">Across all programs</p>
                      </div>
                      
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-xl bg-slate-900">
                            <GraduationCap className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-xs font-medium text-slate-600">Graduation Rate</p>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">94%</p>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +3% this year
                        </p>
                      </div>
                      
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-xl bg-slate-900">
                            <Award className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-xs font-medium text-slate-600">Avg Performance</p>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">8.7</p>
                        <p className="text-xs text-slate-500 mt-1">Out of 10</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Enrollment by Program</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-700 font-medium">Computer Science</span>
                            <span className="text-slate-900 font-bold">847 students</span>
                          </div>
                          <div className="h-3 bg-white rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900 rounded-full" style={{width: '45%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-700 font-medium">Business Administration</span>
                            <span className="text-slate-900 font-bold">692 students</span>
                          </div>
                          <div className="h-3 bg-white rounded-full overflow-hidden">
                            <div className="h-full bg-slate-700 rounded-full" style={{width: '36%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-700 font-medium">Engineering</span>
                            <span className="text-slate-900 font-bold">621 students</span>
                          </div>
                          <div className="h-3 bg-white rounded-full overflow-hidden">
                            <div className="h-full bg-slate-600 rounded-full" style={{width: '32%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-700 font-medium">Other Programs</span>
                            <span className="text-slate-900 font-bold">687 students</span>
                          </div>
                          <div className="h-3 bg-white rounded-full overflow-hidden">
                            <div className="h-full bg-slate-500 rounded-full" style={{width: '35%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            <div
              id="achievement-stats"
              data-scroll-animation
              className={`transition-all duration-700 delay-400 ${
                isVisible("achievement-stats")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
            >
              <Card className="bg-white rounded-3xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="relative overflow-hidden pb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardTitle className="relative text-slate-900 text-2xl flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-slate-100">
                      <Sparkles className="w-5 h-5 text-slate-900" />
                    </div>
                    Achievement Stats
                  </CardTitle>
                  <CardDescription className="relative text-slate-600 text-base ml-14">
                    Performance metrics and milestones
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative pt-2 pb-8">
                  <div className="space-y-5">
                    <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-slate-900">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Top Performers</h3>
                          <p className="text-sm text-slate-600">This semester</p>
                        </div>
                      </div>
                      <div className="text-4xl font-bold text-slate-900 mb-2">487</div>
                      <p className="text-sm text-slate-700">Students with GPA above 9.0</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-slate-900">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-slate-900">Distinctions</span>
                          </div>
                          <span className="text-2xl font-bold text-slate-900">142</span>
                        </div>
                        <div className="h-2 bg-white rounded-full overflow-hidden">
                          <div className="h-full bg-slate-900 rounded-full" style={{width: '68%'}}></div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-slate-900">
                              <TrendingUp className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-slate-900">First Class</span>
                          </div>
                          <span className="text-2xl font-bold text-slate-900">345</span>
                        </div>
                        <div className="h-2 bg-white rounded-full overflow-hidden">
                          <div className="h-full bg-slate-700 rounded-full" style={{width: '85%'}}></div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-slate-900">
                              <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-slate-900">Scholarships</span>
                          </div>
                          <span className="text-2xl font-bold text-slate-900">89</span>
                        </div>
                        <div className="h-2 bg-white rounded-full overflow-hidden">
                          <div className="h-full bg-slate-600 rounded-full" style={{width: '42%'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Recent Achievements</h4>
                      <div className="space-y-2 text-sm text-slate-700">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-slate-900 mt-1.5 flex-shrink-0"></div>
                          <p>23 students qualified for national competitions</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-slate-900 mt-1.5 flex-shrink-0"></div>
                          <p>15 research papers published this quarter</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-slate-900 mt-1.5 flex-shrink-0"></div>
                          <p>98% placement rate for graduating class</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}