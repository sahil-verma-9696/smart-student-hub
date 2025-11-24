import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, TrendingUp, Calendar, CheckCircle, Clock } from "lucide-react";

const overviewStats = [
  {
    title: "Total Students",
    value: "2,847",
    change: "+12%",
    changeType: "positive",
    icon: Users,
    description: "Active students in system",
  },
  {
    title: "Activities Logged",
    value: "8,234",
    change: "+28%",
    changeType: "positive",
    icon: Calendar,
    description: "This academic year",
  },
  {
    title: "Approval Rate",
    value: "87.3%",
    change: "+2.1%",
    changeType: "positive",
    icon: CheckCircle,
    description: "Faculty approval rate",
  },
  {
    title: "Avg Response Time",
    value: "2.4 days",
    change: "-0.3 days",
    changeType: "positive",
    icon: Clock,
    description: "Faculty review time",
  },
];

const departmentEngagement = [
  { department: "Computer Science", students: 856, activities: 2340, engagement: 92 },
  { department: "Electronics", students: 743, activities: 1876, engagement: 85 },
  { department: "Mechanical", students: 654, activities: 1456, engagement: 78 },
  { department: "Civil", students: 594, activities: 1234, engagement: 73 },
];

const monthlyTrends = [
  { month: "Aug", activities: 456, students: 234 },
  { month: "Sep", activities: 678, students: 345 },
  { month: "Oct", activities: 892, students: 456 },
  { month: "Nov", activities: 1234, students: 567 },
  { month: "Dec", activities: 987, students: 432 },
  { month: "Jan", activities: 1456, students: 678 },
];

export function AnalyticsOverview() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.title} className="bg-purple-50 border-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-purple-800">{stat.title}</p>
                  <p className="text-2xl font-bold text-black">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <Badge
                      variant={stat.changeType === "positive" ? "default" : "destructive"}
                      className="text-black bg-purple-100"
                    >
                      {stat.change}
                    </Badge>
                    <span className="text-white text-xs">{stat.description}</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-400/30 rounded-lg">
                  <stat.icon className="h-5 w-5 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department Engagement */}
      <Card className="bg-purple-50 border-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <BarChart3 className="h-5 w-5 text-black" />
            Department Engagement Overview
          </CardTitle>
          <CardDescription className="text-white">Student participation and activity levels by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentEngagement.map((dept) => (
              <div key={dept.department} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-medium min-w-0 flex-1 text-black">{dept.department}</span>
                    <div className="flex items-center gap-4 text-sm text-white">
                      <span>{dept.students} students</span>
                      <span>{dept.activities} activities</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-purple-300 text-black">{dept.engagement}%</Badge>
                </div>
                <Progress value={dept.engagement} className="h-2 bg-purple-200" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Activity Trend */}
      <Card className="bg-purple-50 border-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <TrendingUp className="h-5 w-5 text-black" />
            Monthly Activity Trends
          </CardTitle>
          <CardDescription className="text-purple-600">Activity submissions and student participation over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-4">
              {monthlyTrends.map((month) => (
                <div key={month.month} className="text-center space-y-2">
                  <div className="text-xs font-medium text-black">{month.month}</div>
                  <div className="space-y-1">
                    <div
                      className="bg-purple-700 rounded-t"
                      style={{ height: `${(month.activities / 1500) * 60}px`, minHeight: "4px" }}
                    ></div>
                    <div
                      className="bg-purple-500 rounded-b"
                      style={{ height: `${(month.students / 700) * 40}px`, minHeight: "2px" }}
                    ></div>
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <div className="text-black font-medium">{month.activities}</div>
                    <div className="text-black">{month.students}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-700 rounded"></div>
                <span className="text-black">Activities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-300 rounded"></div>
                <span className="text-black">Active Students</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
