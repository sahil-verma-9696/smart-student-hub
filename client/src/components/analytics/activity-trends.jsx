import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const weeklyData = [
  { week: "Week 1", submissions: 145, approvals: 128, rejections: 12 },
  { week: "Week 2", submissions: 167, approvals: 142, rejections: 18 },
  { week: "Week 3", submissions: 189, approvals: 165, rejections: 15 },
  { week: "Week 4", submissions: 203, approvals: 178, rejections: 19 },
];

const popularActivities = [
  { activity: "Technical Workshops", count: 456, trend: "+15%" },
  { activity: "Online Certifications", count: 342, trend: "+22%" },
  { activity: "Hackathons", count: 234, trend: "+8%" },
  { activity: "Community Service", count: 198, trend: "+12%" },
  { activity: "Research Projects", count: 156, trend: "+25%" },
];

const timeAnalysis = [
  { period: "Morning (6-12)", activities: 234, percentage: 28 },
  { period: "Afternoon (12-18)", activities: 456, percentage: 55 },
  { period: "Evening (18-24)", activities: 142, percentage: 17 },
];

const approvalTrends = [
  { month: "Aug", approved: 89, rejected: 11, pending: 5 },
  { month: "Sep", approved: 92, rejected: 8, pending: 3 },
  { month: "Oct", approved: 87, rejected: 13, pending: 7 },
  { month: "Nov", approved: 91, rejected: 9, pending: 4 },
  { month: "Dec", approved: 88, rejected: 12, pending: 6 },
  { month: "Jan", approved: 94, rejected: 6, pending: 2 },
];

export function ActivityTrends() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-purple-50 border-purple-200 cursor-pointer hover:scale-[1.02] transition-transform">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <TrendingUp className="h-5 w-5 text-black" />
            Activity Trends & Patterns
          </CardTitle>
          <CardDescription className="text-black/70">
            Insights into activity submission and approval patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weekly Submissions */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2 text-purple-700">
              <Calendar className="h-4 w-4" />
              Weekly Submission Trends
            </h4>
            <div className="space-y-2">
              {weeklyData.map((week) => (
                <motion.div
                  key={week.week}
                  whileHover={{ scale: 1.02, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)" }}
                  className="flex items-center justify-between p-2 border rounded bg-purple-100"
                >
                  <span className="font-medium text-black">{week.week}</span>
                  <div className="flex items-center gap-4 text-xs text-black">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{week.submissions} submitted</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{week.approvals} approved</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{week.rejections} rejected</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Popular Activities */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2 text-purple-800">
              <CheckCircle className="h-4 w-4" />
              Most Popular Activities
            </h4>
            <div className="space-y-2 overflow-x-auto">
              {popularActivities.map((activity, index) => (
                <motion.div
                  key={activity.activity}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-2 border rounded bg-purple-100"
                >
                  <div className="flex items-center gap-2 text-black">
                    <Badge
                      variant="outline"
                      className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {index + 1}
                    </Badge>
                    <span className="text-sm">{activity.activity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-600">
                    <Badge variant="secondary" className="text-xs bg-purple-200 text-black">
                      {activity.trend}
                    </Badge>
                    <span className="text-sm font-medium">{activity.count}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Time Analysis */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2 text-purple-800">
              <Clock className="h-4 w-4" />
              Submission Time Analysis
            </h4>
            <div className="space-y-2">
              {timeAnalysis.map((period) => (
                <motion.div
                  key={period.period}
                  whileHover={{ scale: 1.02 }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between text-sm text-black">
                    <span>{period.period}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{period.activities} activities</span>
                      <Badge variant="outline" className="text-black bg-purple-100">{period.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-1.5">
                    <div
                      className="bg-purple-400 h-1.5 rounded-full"
                      style={{ width: `${period.percentage}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Approval Rate Trends */}
          <div className="space-y-4">
            <h4 className="font-medium text-purple-900">Monthly Approval Rates</h4>
            <div className="flex gap-2 overflow-x-auto">
              {approvalTrends.map((month) => (
                <motion.div
                  key={month.month}
                  whileHover={{ scale: 1.05 }}
                  className="text-center space-y-1 min-w-[40px]"
                >
                  <div className="text-xs font-medium text-black">{month.month}</div>
                  <div className="space-y-0.5">
                    <div
                      className="bg-green-500 rounded-t"
                      style={{ height: `${month.approved}%`, minHeight: "4px" }}
                    ></div>
                    <div
                      className="bg-red-500"
                      style={{ height: `${month.rejected}%`, minHeight: "2px" }}
                    ></div>
                    <div
                      className="bg-yellow-500 rounded-b"
                      style={{ height: `${month.pending}%`, minHeight: "2px" }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-green-600">{month.approved}%</div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center gap-4 text-xs mt-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded"></div>
                <span className="text-black">Approved</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded"></div>
                <span className="text-black">Rejected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded"></div>
                <span className="text-black">Pending</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
