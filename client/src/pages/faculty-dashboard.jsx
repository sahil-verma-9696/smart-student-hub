import React, { useState, useEffect, useRef } from 'react';
import FacultyAnalyticsPage from "@/pages/analytics";
import FacultyReporting from './Reporting';
import { 
  UserPlus, 
  BarChart3, 
  CheckCircle, 
  Users, 
  Award, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  GraduationCap,
  Sun,
  Moon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useNavigate } from "react-router-dom";





export default function FacultyDashboardPage({ isDark, toggleTheme }) {
  // --- State & Logic ---
  const [activities] = useState([
    { id: 1, student: 'Alice Johnson', action: 'Project Submission', time: '2h ago', status: 'pending' },
    { id: 2, student: 'Bob Smith', action: 'Workshop Attendance', time: '5h ago', status: 'verified' },
    { id: 3, student: 'Carol White', action: 'Research Paper Draft', time: '1d ago', status: 'rejected' },
    { id: 4, student: 'David Brown', action: 'Lab Report', time: '2d ago', status: 'pending' },
    { id: 5, student: 'Eva Martinez', action: 'Seminar', time: '3d ago', status: 'verified' },
    { id: 6, student: 'Frank Wilson', action: 'Code Review', time: '4d ago', status: 'rejected' },
  ]);

  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observers = [];
    
    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setVisibleSections((prev) => new Set(prev).add(index));
              }
            });
          },
          { threshold: 0.1 }
        );
        
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const stats = [
    { label: 'Total Students', value: '248', icon: Users, color: 'blue', change: '+12%', trend: 'up' },
    { label: 'Pending Verifications', value: '12', icon: Clock, color: 'amber', change: '-3%', trend: 'down' },
    { label: 'Achievements', value: '156', icon: Award, color: 'purple', change: '+28%', trend: 'up' },
    { label: 'Avg. Performance', value: '87%', icon: TrendingUp, color: 'emerald', change: '+5%', trend: 'up' },
  ];


  const navigate = useNavigate();

  // --- Handlers ---
  const handleRegisterStudent = () => console.log('Opening student registration...');
  const handleViewAnalytics = () => navigate("/analytics");
  const handleVerifyActivity = (activityId) => console.log('Verifying activity:', activityId);
  // --- Helper Components ---
  
  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success" className="px-3 py-1 rounded-lg">Verified</Badge>;
      case 'rejected':
        return <Badge variant="danger" className="px-3 py-1 rounded-lg">Rejected</Badge>;
      default:
        return <Badge variant="warning" className="px-3 py-1 rounded-lg">Pending</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return { 
        Icon: CheckCircle, 
        color: 'text-emerald-500 dark:text-emerald-400', 
        bg: 'bg-emerald-50 dark:bg-emerald-900/20' 
      };
      case 'rejected': return { 
        Icon: XCircle, 
        color: 'text-rose-500 dark:text-rose-400', 
        bg: 'bg-rose-50 dark:bg-rose-900/20' 
      };
      default: return { 
        Icon: Clock, 
        color: 'text-amber-500 dark:text-amber-400', 
        bg: 'bg-amber-50 dark:bg-amber-900/20' 
      };
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-12 max-w-[1600px] mx-auto">
      <div className="space-y-10">
        
        {/* --- Header Section --- */}
        <div 
          ref={(el) => { sectionRefs.current[0] = el; }}
          className={`flex flex-col md:flex-row items-start md:items-end justify-between gap-4 transition-all duration-700 ease-out ${
            visibleSections.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-50 animate-blob"></div>
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
            
            <h1 className="relative font-heading text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-3">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Professor</span>
            </h1>
            <p className="relative text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
              Here's what's happening in your digital classroom today.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleTheme}
              className="h-12 w-12 rounded-2xl p-0 border-slate-100 dark:border-slate-800 shadow-sm"
            >
              {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
            </Button>
            
            <div className="h-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium transition-colors duration-300">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Semester 2024
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-300 shadow-sm transition-colors duration-300">
               <GraduationCap size={24} />
            </div>
          </div>
        </div>

        {/* --- Quick Actions Section --- */}
        <div
          ref={(el) => { sectionRefs.current[1] = el; }}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 delay-100 ease-out ${
            visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
            <button 
              onClick={handleRegisterStudent}
              className="group relative overflow-hidden p-8 bg-purple-200 dark:bg-purple-700 rounded-3xl shadow-xl shadow-purple-200 dark:shadow-purple-950/40 hover:shadow-2xl hover:shadow-purple-300/50 hover:scale-[1.02] transition-all duration-300 text-left border border-transparent"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-purple-800 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <UserPlus className="text-black" size={24} />
                </div>
                <h3 className="font-heading text-xl font-bold text-purple-900 mb-1">Register Students</h3>
                <p className="text-black text-sm">Add new scholars to your course roster.</p>
              </div>
            </button>

            <button 
               onClick={handleViewAnalytics}
               className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">View Analytics</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Deep dive into student performance metrics.</p>
            </button>

            <button 
               onClick={() => handleVerifyActivity('all')}
               className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-left"
            >
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={24} />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Verify Activities</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Review pending submissions and tasks.</p>
            </button>
        </div>

        {/* --- Stats Grid --- */}
        <div 
          ref={(el) => { sectionRefs.current[2] = el; }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
            const colorClasses = {
               blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
               amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
               purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
               emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
            };
            
            return (
            <div
              key={stat.label}
              className={`transition-all duration-700 ease-out ${
                visibleSections.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <Card className="h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-slate-100 dark:border-slate-800">
                <CardContent className="flex flex-col justify-between h-full pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${colorClasses[stat.color]} transition-colors duration-300`}>
                      <stat.icon size={24} strokeWidth={2.5} />
                    </div>
                    <Badge variant={stat.trend === 'up' ? 'secondary' : 'warning'} className="rounded-lg px-2.5">
                      {stat.change}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-50 mb-1 transition-colors duration-300">{stat.value}</div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-300">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )})}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Main Content Area (Left 2 cols) --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Student Overview */}
            <div
              ref={(el) => { sectionRefs.current[3] = el; }}
              className={`transition-all duration-700 ease-out ${
                visibleSections.has(3) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <Card className="overflow-hidden">
                <CardHeader className="border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <CardTitle>Student Overview</CardTitle>
                      <CardDescription>Current semester performance metrics</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Active Students', sublabel: 'Currently enrolled', value: '235', color: 'blue', darkColor: 'blue-500' },
                      { label: 'On Track', sublabel: 'Meeting requirements', value: '92%', color: 'emerald', darkColor: 'emerald-500' },
                      { label: 'Need Attention', sublabel: 'Below average', value: '13', color: 'rose', darkColor: 'rose-500' }
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className="relative overflow-hidden p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 group hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300"
                      >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${item.color}-500 opacity-[0.03] dark:opacity-[0.1] rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500`}></div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                        <p className={`text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2`}>{item.value}</p>
                        <p className="text-xs text-slate-400 font-medium">{item.sublabel}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <div
              ref={(el) => { sectionRefs.current[4] = el; }}
              className={`transition-all duration-700 delay-150 ease-out ${
                visibleSections.has(4) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <CardTitle>Recent Activities</CardTitle>
                      <CardDescription>Live feed of student submissions</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                    View All <ArrowRight size={16} className="ml-2" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {activities.map((activity) => {
                      const { Icon, color, bg } = getStatusIcon(activity.status);
                      return (
                        <div
                          key={activity.id}
                          className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors duration-200 gap-4"
                        >
                          <div className="flex items-center gap-5">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${bg} ${color} shadow-sm transition-colors duration-300`}>
                              <Icon size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">{activity.student}</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">{activity.action}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right mr-2">
                              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg uppercase tracking-wide transition-colors duration-300">{activity.time}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <StatusBadge status={activity.status} />
                              {activity.status === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVerifyActivity(activity.id)}
                                  className="h-8 rounded-xl"
                                >
                                  Verify
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* --- Sidebar (Right col) --- */}
          <div className="space-y-8">
            {/* Achievement Stats */}
            <div
              ref={(el) => { sectionRefs.current[5] = el; }}
              className={`transition-all duration-700 ease-out ${
                visibleSections.has(5) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <Card className="bg-purple-200  text-purple-900 border-none shadow-xl shadow-slate-400/30 dark:shadow-black/40 transition-colors duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/10 rounded-xl text-purple-800">
                      <Sparkles size={20} />
                    </div>
                    <CardTitle className="text-purple-800">Highlights</CardTitle>
                  </div>
                  <CardDescription className="text-black">Semester achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Award, label: 'Gold Medals', value: '23', sublabel: 'National Competitions', color: 'text-amber-400', bg: 'bg-amber-400/10' },
                    { icon: BookOpen, label: 'Publications', value: '47', sublabel: 'Research Papers', color: 'text-purple-400', bg: 'bg-purple-400/10' },
                    { icon: GraduationCap, label: 'Internships', value: '89', sublabel: 'Placements secured', color: 'text-blue-400', bg: 'bg-blue-400/10' }
                  ].map((achievement, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center p-4 rounded-2xl bg-purple-50 border-purple-700 hover:bg-purple-100 transition-colors cursor-default"
                    >
                      <div className={`p-3 rounded-xl ${achievement.bg} ${achievement.color} mr-4`}>
                        <achievement.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-black">{achievement.label}</p>
                          <span className={`text-xl font-bold ${achievement.color}`}>{achievement.value}</span>
                        </div>
                        <p className="text-xs text-black mt-1">{achievement.sublabel}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Mini Calendar / Notices */}
            <div className={`transition-all duration-700 delay-200 ease-out ${visibleSections.has(5) ? 'opacity-100' : 'opacity-0'}`}>
               <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-slate-900 dark:to-slate-900 border-purple-100 dark:border-slate-800 transition-all duration-300">
                  <CardHeader>
                     <CardTitle className="text-purple-900 dark:text-purple-300">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <div className="flex gap-4 items-center">
                           <div className="flex flex-col items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-xs font-bold text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-slate-700 transition-colors duration-300">
                              <span>OCT</span>
                              <span className="text-lg">24</span>
                           </div>
                           <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Faculty Meeting</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">2:00 PM • Room 304</p>
                           </div>
                        </div>
                        <div className="flex gap-4 items-center">
                           <div className="flex flex-col items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-xs font-bold text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                              <span>OCT</span>
                              <span className="text-lg">28</span>
                           </div>
                           <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Project Submission</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">11:59 PM • Online Portal</p>
                           </div>
                        </div>
                     </div>
                     <Button variant="secondary" className="w-full mt-6 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50">
                        View Calendar
                     </Button>
                  </CardContent>
               </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}