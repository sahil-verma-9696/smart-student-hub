import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, BarChart3, CheckCircle, Users, Award, TrendingUp, Clock, AlertCircle, XCircle, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { assignmentAPI } from '@/services/api';
import useAuthContext from '@/hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function FacultyDashboardPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    pending: 0,
    verified: 0,
    rejected: 0
  });

  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (!user?._id) return;

        // Fetch assigned activities
        const result = await assignmentAPI.getMyAssignedActivities(user._id, user.institute?._id);

        let assignmentsArray = [];
        if (Array.isArray(result)) {
          assignmentsArray = result;
        } else if (result && Array.isArray(result.data)) {
          assignmentsArray = result.data;
        } else if (result && typeof result === 'object') {
          assignmentsArray = [result];
        }

        // Map assignments to activity structure
        const mappedActivities = assignmentsArray.map(assignment => {
          const activity = assignment.activityId;
          if (!activity) return null;

          return {
            id: activity._id,
            student: activity.student?.basicUserDetails?.name || 'Unknown Student',
            action: activity.title, // or activity type
            time: new Date(activity.createdAt).toLocaleDateString(),
            status: activity.status || 'pending',
            activityType: activity.activityType,
            assignmentId: assignment._id
          };
        }).filter(Boolean);

        setActivities(mappedActivities);

        // Calculate stats
        const pending = mappedActivities.filter(a => ['pending', 'submitted', 'under_review'].includes(a.status?.toLowerCase())).length;
        const verified = mappedActivities.filter(a => a.status === 'approved').length;
        const rejected = mappedActivities.filter(a => a.status === 'rejected').length;

        setStats({
          totalAssigned: mappedActivities.length,
          pending,
          verified,
          rejected
        });

      } catch (error) {
        console.error("Error fetching dashboard data", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);


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

  const dashboardStats = [
    { label: 'Total Assigned', value: stats.totalAssigned, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', change: '' },
    { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', change: '' },
    { label: 'Verified', value: stats.verified, icon: Award, color: 'text-green-600', bg: 'bg-green-50', change: '' },
    { label: 'Rejected', value: stats.rejected, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', change: '' },
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
    switch (status?.toLowerCase()) {
      case 'approved':
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div
          ref={(el) => (sectionRefs.current[0] = el)}
          className={`flex items-center justify-between transition-all duration-1000 ${visibleSections.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
        >
          <div className="group cursor-default">
            <h1 className="text-5xl font-bold text-black mb-2 group-hover:text-blue-600 transition-colors duration-500 flex items-center gap-3">
              Dashboard
              <Sparkles className="h-8 w-8 text-blue-600 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500" />
            </h1>
            <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
              Welcome back, {user?.basicUserDetails?.name || 'Faculty'}
            </p>
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
          className={`transition-all duration-1000 delay-100 ${visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
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
          {dashboardStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`transition-all duration-1000 ${visibleSections.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
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

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Recent Activities with Verification */}
          <div
            ref={(el) => (sectionRefs.current[4] = el)}
            className={`transition-all duration-1000 delay-200 ${visibleSections.has(4) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
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
                    <CardDescription className="text-gray-600">Latest assigned submissions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 border border-orange-300 hover:scale-110 transition-transform duration-300 cursor-pointer">
                      {activities.filter(a => ['pending', 'submitted', 'under_review'].includes(a.status?.toLowerCase())).length} Pending
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.slice(0, 5).map((activity, index) => {
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
                          {['pending', 'submitted', 'under_review'].includes(activity.status?.toLowerCase()) && (
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
                  {activities.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No activities assigned yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}