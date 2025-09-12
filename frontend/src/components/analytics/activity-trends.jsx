import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Clock, CheckCircle } from "lucide-react"

const weeklyData = [
  { week: "Week 1", submissions: 145, approvals: 128, rejections: 12 },
  { week: "Week 2", submissions: 167, approvals: 142, rejections: 18 },
  { week: "Week 3", submissions: 189, approvals: 165, rejections: 15 },
  { week: "Week 4", submissions: 203, approvals: 178, rejections: 19 },
]

const popularActivities = [
  { activity: "Technical Workshops", count: 456, trend: "+15%" },
  { activity: "Online Certifications", count: 342, trend: "+22%" },
  { activity: "Hackathons", count: 234, trend: "+8%" },
  { activity: "Community Service", count: 198, trend: "+12%" },
  { activity: "Research Projects", count: 156, trend: "+25%" },
]

const timeAnalysis = [
  { period: "Morning (6-12)", activities: 234, percentage: 28 },
  { period: "Afternoon (12-18)", activities: 456, percentage: 55 },
  { period: "Evening (18-24)", activities: 142, percentage: 17 },
]

const approvalTrends = [
  { month: "Aug", approved: 89, rejected: 11, pending: 5 },
  { month: "Sep", approved: 92, rejected: 8, pending: 3 },
  { month: "Oct", approved: 87, rejected: 13, pending: 7 },
  { month: "Nov", approved: 91, rejected: 9, pending: 4 },
  { month: "Dec", approved: 88, rejected: 12, pending: 6 },
  { month: "Jan", approved: 94, rejected: 6, pending: 2 },
]

export function ActivityTrends() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-secondary" />
          Activity Trends & Patterns
        </CardTitle>
        <CardDescription>Insights into activity submission and approval patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Submissions */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Weekly Submission Trends
          </h4>
          <div className="space-y-2">
            {weeklyData.map((week) => (
              <div key={week.week} className="flex items-center justify-between p-2 border rounded">
                <span className="font-medium text-sm">{week.week}</span>
                <div className="flex items-center gap-4 text-xs">
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
              </div>
            ))}
          </div>
        </div>

        {/* Popular Activities */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Most Popular Activities
          </h4>
          <div className="space-y-2">
            {popularActivities.map((activity, index) => (
              <div key={activity.activity} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {index + 1}
                  </Badge>
                  <span className="text-sm">{activity.activity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {activity.trend}
                  </Badge>
                  <span className="text-sm font-medium">{activity.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Analysis */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Submission Time Analysis
          </h4>
          <div className="space-y-2">
            {timeAnalysis.map((period) => (
              <div key={period.period} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{period.period}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{period.activities} activities</span>
                    <Badge variant="outline">{period.percentage}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="h-1.5 bg-secondary rounded-full" style={{ width: `${period.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Rate Trends */}
        <div className="space-y-4">
          <h4 className="font-medium">Monthly Approval Rates</h4>
          <div className="grid grid-cols-6 gap-2">
            {approvalTrends.map((month) => (
              <div key={month.month} className="text-center space-y-1">
                <div className="text-xs font-medium text-muted-foreground">{month.month}</div>
                <div className="space-y-0.5">
                  <div
                    className="bg-green-500 rounded-t"
                    style={{ height: `${month.approved}%`, minHeight: "2px" }}
                  ></div>
                  <div className="bg-red-500" style={{ height: `${month.rejected}%`, minHeight: "1px" }}></div>
                  <div
                    className="bg-yellow-500 rounded-b"
                    style={{ height: `${month.pending}%`, minHeight: "1px" }}
                  ></div>
                </div>
                <div className="text-xs font-medium text-green-600">{month.approved}%</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded"></div>
              <span>Approved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded"></div>
              <span>Rejected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded"></div>
              <span>Pending</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
