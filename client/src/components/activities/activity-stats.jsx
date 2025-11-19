import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Clock, CheckCircle } from "lucide-react"

const monthlyStats = [
  { month: "Jan", activities: 5, points: 85 },
  { month: "Dec", activities: 3, points: 45 },
  { month: "Nov", activities: 7, points: 120 },
  { month: "Oct", activities: 4, points: 60 },
]

const categoryStats = [
  { category: "Workshops", count: 8, points: 40, color: "bg-blue-500" },
  { category: "Certifications", count: 3, points: 45, color: "bg-green-500" },
  { category: "Competitions", count: 2, points: 50, color: "bg-purple-500" },
  { category: "Community Service", count: 5, points: 25, color: "bg-orange-500" },
]

export function ActivityStats() {
  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Activity Summary
          </CardTitle>
          <CardDescription>Your activity statistics overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-primary">18</div>
              <div className="text-xs text-muted-foreground">Total Activities</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-secondary">160</div>
              <div className="text-xs text-muted-foreground">Points Earned</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Monthly Goal</span>
              <span>5/8 activities</span>
            </div>
            <Progress value={62.5} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Approved</span>
            </div>
            <Badge variant="secondary">12</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Pending</span>
            </div>
            <Badge variant="secondary">4</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Rejected</span>
            </div>
            <Badge variant="secondary">2</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Activities by type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {categoryStats.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>{category.category}</span>
                <div className="flex items-center gap-2">
                  <span>{category.count} activities</span>
                  <Badge variant="outline" className="text-xs">
                    {category.points} pts
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${category.color}`}
                  style={{ width: `${(category.count / 18) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-chart-1" />
            Monthly Trend
          </CardTitle>
          <CardDescription>Last 4 months activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {monthlyStats.map((month) => (
            <div key={month.month} className="flex items-center justify-between">
              <span className="text-sm font-medium">{month.month}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{month.activities} activities</span>
                <span>•</span>
                <span>{month.points} pts</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-chart-2" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Upload clear certificates for faster approval</p>
          <p>• Add detailed descriptions to showcase learning</p>
          <p>• Tag relevant skills to build your profile</p>
          <p>• Submit activities within 30 days of completion</p>
        </CardContent>
      </Card>
    </div>
  )
}
