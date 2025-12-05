import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, BarChart3, CheckCircle, Users, Award, TrendingUp, Clock, AlertCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function FacultyDashboardPage() {
  const navigate = useNavigate();
  const [activities] = useState([
    { id: 1, student: 'Alice Johnson', action: 'Completed Project Submission', time: '2 hours ago', status: 'pending' },
    { id: 2, student: 'Bob Smith', action: 'Workshop Attendance', time: '5 hours ago', status: 'verified' },
    { id: 3, student: 'Carol White', action: 'Research Paper Draft', time: '1 day ago', status: 'rejected' },
    { id: 4, student: 'David Brown', action: 'Lab Report Submission', time: '2 days ago', status: 'pending' },
    { id: 5, student: 'Eva Martinez', action: 'Seminar Participation', time: '3 days ago', status: 'verified' },
    { id: 6, student: 'Frank Wilson', action: 'Code Review Task', time: '4 days ago', status: 'rejected' },
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
                setVisibleSections((prev) => new Set([...prev, index]));
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
    { label: 'Total Students', value: '248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', change: '+12%' },
    { label: 'Pending Verifications', value: '12', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', change: '-3%' },
    { label: 'Achievements', value: '156', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50', change: '+28%' },
    { label: 'Avg. Performance', value: '87%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', change: '+5%' },
  ];

  const handleRegisterStudent = () => {
    console.log('Opening student registration...');
  };

  const handleViewAnalytics = () => {
    console.log('Opening analytics dashboard...');
  };

  const handleVerifyActivity = (activityId) => {
    navigate('/faculty/approval-pannel');
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          badgeClass: 'bg-green-50 text-green-700 border-green-200'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-100',
          badgeClass: 'bg-red-50 text-red-700 border-red-200'
        };
      default: // pending
        return {
          icon: Clock,
          color: 'text-orange-600',
          bg: 'bg-orange-100',
          badgeClass: 'bg-orange-50 text-orange-700 border-orange-200'
        };
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div 
          ref={(el) => (sectionRefs.current[0] = el)}
          className={`flex items-center justify-between transition-all duration-1000 ${
            visibleSections.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="group cursor-default">
            <h1 className="text-5xl font-bold text-black mb-2 group-hover:text-blue-600 transition-colors duration-500 flex items-center gap-3">
              Dashboard
              <Sparkles className="h-8 w-8 text-blue-600 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500" />
            </h1>
            <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Welcome back, John Doe</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm py-2 px-4 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer hover:scale-105">
              Faculty
            </Badge>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div
          ref={(el) => (sectionRefs.current[1] = el)}
          className={`transition-all duration-1000 delay-100 ${
            visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <Card className="border-2 border-black shadow-xl bg-white hover:shadow-2xl hover:border-blue-600 transition-all duration-500 overflow-visible hover:scale-[1.02] group/card">
            <CardHeader className="group-hover/card:bg-gradient-to-r group-hover/card:from-blue-50 group-hover/card:to-transparent transition-all duration-500">
              <CardTitle className="text-black text-2xl flex items-center gap-2 group-hover/card:text-blue-600 transition-colors duration-300">
                Quick Actions
                <ArrowRight className="h-5 w-5 opacity-0 group-hover/card:opacity-100 group-hover/card:translate-x-1 transition-all duration-300" />
              </CardTitle>
              <CardDescription className="text-gray-600 group-hover/card:text-gray-800 transition-colors duration-300">
                Frequently used actions for efficient workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button
                onClick={handleRegisterStudent}
                className="bg-black text-white hover:bg-blue-600 hover:border-blue-600 shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 border-2 border-black relative overflow-hidden group/btn"
                size="lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700 ease-out"></span>
                <span className="relative flex items-center">
                  <UserPlus className="mr-2 h-5 w-5 group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-all duration-500" />
                  Register Students
                </span>
              </Button>
              <Button
                onClick={handleViewAnalytics}
                className="bg-black text-white hover:bg-blue-600 hover:border-blue-600 shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 border-2 border-black relative overflow-hidden group/btn"
                size="lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700 ease-out"></span>
                <span className="relative flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 group-hover/btn:scale-125 group-hover/btn:-rotate-6 transition-all duration-500" />
                  View Analytics
                </span>
              </Button>
              <Button
                onClick={() => handleVerifyActivity('all')}
                className="bg-black text-white hover:bg-blue-600 hover:border-blue-600 shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 border-2 border-black relative overflow-hidden group/btn"
                size="lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700 ease-out"></span>
                <span className="relative flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 group-hover/btn:rotate-[360deg] group-hover/btn:scale-110 transition-all duration-700" />
                  Verify Activities
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div 
          ref={(el) => (sectionRefs.current[2] = el)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`transition-all duration-1000 ${
                visibleSections.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 150 + 200}ms` }}
            >
              <Card className="border-2 border-black shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:border-blue-600 group/stat cursor-pointer overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover/stat:from-blue-500/5 group-hover/stat:to-blue-500/10 transition-all duration-500"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2 group-hover/stat:text-blue-600 transition-colors duration-300">{stat.label}</p>
                      <p className="text-4xl font-bold text-black group-hover/stat:text-blue-600 transition-all duration-300 group-hover/stat:scale-110 inline-block">{stat.value}</p>
                      <Badge variant="outline" className="ml-2 text-xs group-hover/stat:bg-blue-100 group-hover/stat:border-blue-600 transition-all duration-300">
                        {stat.change}
                      </Badge>
                    </div>
                    <div className={`${stat.bg} ${stat.color} p-4 rounded-xl border-2 border-transparent group-hover/stat:border-current group-hover/stat:scale-110 group-hover/stat:rotate-6 transition-all duration-500 shadow-lg`}>
                      <stat.icon className="h-7 w-7 group-hover/stat:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Overview */}
            <div
              ref={(el) => (sectionRefs.current[3] = el)}
              className={`transition-all duration-1000 ${
                visibleSections.has(3) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <Card className="border-2 border-black shadow-xl hover:shadow-2xl hover:border-blue-600 transition-all duration-500 group/overview">
                <CardHeader className="group-hover/overview:bg-gradient-to-r group-hover/overview:from-blue-50 group-hover/overview:to-transparent transition-all duration-500">
                  <CardTitle className="text-2xl text-black group-hover/overview:text-blue-600 transition-colors duration-300 flex items-center gap-2">
                    Student Overview
                    <TrendingUp className="h-6 w-6 opacity-0 group-hover/overview:opacity-100 transition-all duration-300" />
                  </CardTitle>
                  <CardDescription className="text-gray-600">Current semester performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Active Students', sublabel: 'Currently enrolled', value: '235', color: 'blue' },
                      { label: 'On Track', sublabel: 'Meeting requirements', value: '92%', color: 'green' },
                      { label: 'Need Attention', sublabel: 'Below average', value: '13', color: 'orange' }
                    ].map((item, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-5 bg-${item.color}-50 rounded-xl transition-all duration-500 hover:shadow-lg border-2 border-${item.color}-200 hover:border-${item.color}-400 group/item hover:scale-105 hover:-translate-y-1 cursor-pointer`}>
                        <div>
                          <p className="font-semibold text-black group-hover/item:text-blue-600 transition-colors duration-300">{item.label}</p>
                          <p className="text-sm text-gray-600">{item.sublabel}</p>
                        </div>
                        <p className={`text-4xl font-bold text-${item.color}-600 group-hover/item:scale-110 transition-transform duration-300`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities with Verification */}
            <div
              ref={(el) => (sectionRefs.current[4] = el)}
              className={`transition-all duration-1000 delay-200 ${
                visibleSections.has(4) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <Card className="border-2 border-black shadow-xl hover:shadow-2xl hover:border-blue-600 transition-all duration-500 group/activities">
                <CardHeader className="group-hover/activities:bg-gradient-to-r group-hover/activities:from-blue-50 group-hover/activities:to-transparent transition-all duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-black group-hover/activities:text-blue-600 transition-colors duration-300 flex items-center gap-2">
                        Recent Activities
                        <AlertCircle className="h-6 w-6 opacity-0 group-hover/activities:opacity-100 transition-all duration-300" />
                      </CardTitle>
                      <CardDescription className="text-gray-600">Student submissions with status</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 border border-orange-300 hover:scale-110 transition-transform duration-300 cursor-pointer">
                        {activities.filter(a => a.status === 'pending').length} Pending
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border border-green-300 hover:scale-110 transition-transform duration-300 cursor-pointer">
                        {activities.filter(a => a.status === 'verified').length} Verified
                      </Badge>
                      <Badge variant="secondary" className="bg-red-100 text-red-700 border border-red-300 hover:scale-110 transition-transform duration-300 cursor-pointer">
                        {activities.filter(a => a.status === 'rejected').length} Rejected
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.map((activity, index) => {
                      const statusConfig = getStatusConfig(activity.status);
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-500 group/activity hover:scale-[1.02] hover:-translate-y-1 cursor-pointer bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3 rounded-xl ${statusConfig.bg} border-2 ${statusConfig.color.replace('text-', 'border-')} group-hover/activity:scale-110 group-hover/activity:rotate-6 transition-all duration-500`}>
                              <StatusIcon className={`h-5 w-5 ${statusConfig.color} group-hover/activity:scale-110 transition-transform duration-300`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-black group-hover/activity:text-blue-600 transition-colors duration-300">{activity.student}</p>
                              <p className="text-sm text-gray-600 group-hover/activity:text-gray-800 transition-colors duration-300">{activity.action}</p>
                              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={`${statusConfig.badgeClass} hover:scale-110 transition-transform duration-300`}>
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </Badge>
                            {activity.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleVerifyActivity(activity.id)}
                                className="bg-black text-white hover:bg-blue-600 transition-all duration-500 hover:scale-110 hover:shadow-xl border-2 border-black hover:border-blue-600 relative overflow-hidden group/verify"
                              >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 transform -translate-x-full group-hover/verify:translate-x-0 transition-transform duration-500"></span>
                                <span className="relative flex items-center">
                                  <CheckCircle className="mr-1 h-4 w-4 group-hover/verify:rotate-180 transition-transform duration-500" />
                                  Verify
                                </span>
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievement Stats */}
            <div
              ref={(el) => (sectionRefs.current[5] = el)}
              className={`transition-all duration-1000 ${
                visibleSections.has(5) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <Card className="border-2 border-black shadow-xl hover:shadow-2xl hover:border-blue-600 transition-all duration-500 group/achievements">
                <CardHeader className="group-hover/achievements:bg-gradient-to-r group-hover/achievements:from-blue-50 group-hover/achievements:to-transparent transition-all duration-500">
                  <CardTitle className="text-2xl text-black group-hover/achievements:text-blue-600 transition-colors duration-300 flex items-center gap-2">
                    Achievement Stats
                    <Award className="h-6 w-6 opacity-0 group-hover/achievements:opacity-100 group-hover/achievements:rotate-12 transition-all duration-500" />
                  </CardTitle>
                  <CardDescription className="text-gray-600">This semester's highlights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Award, label: 'Gold Medals', value: '23', sublabel: 'National level competitions', color: 'yellow' },
                    { icon: Award, label: 'Publications', value: '47', sublabel: 'Research papers & articles', color: 'purple' },
                    { icon: TrendingUp, label: 'Internships', value: '89', sublabel: 'Students placed this year', color: 'blue' }
                  ].map((achievement, idx) => (
                    <div key={idx} className={`p-5 bg-${achievement.color}-50 rounded-xl border-l-4 border-${achievement.color}-600 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:-translate-y-1 cursor-pointer group/achievement`}>
                      <div className="flex items-center gap-3 mb-3">
                        <achievement.icon className={`h-6 w-6 text-${achievement.color}-600 group-hover/achievement:rotate-12 group-hover/achievement:scale-125 transition-all duration-500`} />
                        <p className="font-semibold text-black group-hover/achievement:text-blue-600 transition-colors duration-300">{achievement.label}</p>
                      </div>
                      <p className={`text-4xl font-bold text-${achievement.color}-600 mb-2 group-hover/achievement:scale-110 inline-block transition-transform duration-300`}>{achievement.value}</p>
                      <p className="text-sm text-gray-600">{achievement.sublabel}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}