import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react"

const reviewStats = [
  { period: "Today", approved: 12, rejected: 2, pending: 8 },
  { period: "This Week", approved: 45, rejected: 8, pending: 24 },
  { period: "This Month", approved: 156, rejected: 23, pending: 47 },
]

const departmentStats = [
  { department: "Computer Science", pending: 15, approved: 89, color: "bg-blue-500" },
  { department: "Electronics", pending: 8, approved: 67, color: "bg-green-500" },
  { department: "Mechanical", pending: 6, approved: 45, color: "bg-purple-500" },
  { department: "Civil", pending: 3, approved: 34, color: "bg-orange-500" },
]

const activityTypeStats = [
  { type: "Workshops", count: 45, avgTime: "2.3 days" },
  { type: "Certifications", count: 23, avgTime: "1.8 days" },
  { type: "Competitions", count: 18, avgTime: "3.1 days" },
  { type: "Research", count: 12, avgTime: "4.2 days" },
]

export function FacultyStats() {
  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Review Summary
          </CardTitle>
          <CardDescription>Your review activity overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviewStats.map((stat) => (
            <div key={stat.period} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{stat.period}</span>
                <span className="text-muted-foreground">{stat.approved + stat.rejected + stat.pending} total</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-green-600 font-medium">{stat.approved}</div>
                  <div className="text-muted-foreground">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-medium">{stat.rejected}</div>
                  <div className="text-muted-foreground">Rejected</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-600 font-medium">{stat.pending}</div>
                  <div className="text-muted-foreground">Pending</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Department Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-secondary" />
            Department Breakdown
          </CardTitle>
          <CardDescription>Activities by department</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {departmentStats.map((dept) => (
            <div key={dept.department} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>{dept.department}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {dept.pending} pending
                  </Badge>
                  <span className="text-muted-foreground">{dept.approved} approved</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${dept.color}`}
                  style={{ width: `${(dept.approved / (dept.approved + dept.pending)) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activity Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-chart-1" />
            Activity Types
          </CardTitle>
          <CardDescription>Review patterns by activity type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activityTypeStats.map((type) => (
            <div key={type.type} className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">{type.type}</span>
                <div className="text-xs text-muted-foreground">Avg review time: {type.avgTime}</div>
              </div>
              <Badge variant="secondary">{type.count}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-chart-2" />
            Performance Metrics
          </CardTitle>
          <CardDescription>Your review efficiency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Average Review Time</span>
              <span className="font-medium">2.4 days</span>
            </div>
            <Progress value={75} className="h-2" />
            <div className="text-xs text-muted-foreground">Target: 2.0 days</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Approval Rate</span>
              <span className="font-medium">87%</span>
            </div>
            <Progress value={87} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">156</div>
              <div className="text-xs text-muted-foreground">Total Approved</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">23</div>
              <div className="text-xs text-muted-foreground">Total Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Review Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Verify certificates and supporting documents</p>
          <p>• Check activity relevance to student's field</p>
          <p>• Ensure proper documentation quality</p>
          <p>• Provide constructive feedback when rejecting</p>
          <p>• Review within 3 business days</p>
        </CardContent>
      </Card>
    </div>
  )
}
