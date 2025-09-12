import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Target, Award, TrendingUp } from "lucide-react"

const engagementMetrics = [
  { label: "Highly Active", count: 1247, percentage: 44, color: "bg-green-500" },
  { label: "Moderately Active", count: 986, percentage: 35, color: "bg-yellow-500" },
  { label: "Low Activity", count: 614, percentage: 21, color: "bg-red-500" },
]

const topPerformers = [
  { name: "John Doe", rollNo: "CS19B001", activities: 28, points: 420 },
  { name: "Jane Smith", rollNo: "EC19B045", activities: 25, points: 385 },
  { name: "Mike Johnson", rollNo: "ME19B078", activities: 23, points: 365 },
  { name: "Sarah Wilson", rollNo: "CS19B023", activities: 22, points: 340 },
  { name: "David Brown", rollNo: "EC19B012", activities: 21, points: 325 },
]

const activityCategories = [
  { category: "Workshops", participation: 78, growth: "+12%" },
  { category: "Certifications", participation: 65, growth: "+8%" },
  { category: "Competitions", participation: 45, growth: "+15%" },
  { category: "Community Service", participation: 82, growth: "+5%" },
  { category: "Research", participation: 23, growth: "+18%" },
]

export function StudentEngagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Student Engagement Analysis
        </CardTitle>
        <CardDescription>Detailed breakdown of student participation patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Engagement Distribution */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Engagement Distribution
          </h4>
          <div className="space-y-3">
            {engagementMetrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{metric.count} students</span>
                    <Badge variant="outline">{metric.percentage}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`h-2 rounded-full ${metric.color}`} style={{ width: `${metric.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Award className="h-4 w-4" />
            Top Performers (This Month)
          </h4>
          <div className="space-y-2">
            {topPerformers.map((student, index) => (
              <div key={student.rollNo} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={index < 3 ? "default" : "secondary"}
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {index + 1}
                  </Badge>
                  <div>
                    <div className="font-medium text-sm">{student.name}</div>
                    <div className="text-xs text-muted-foreground">{student.rollNo}</div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium">{student.activities} activities</div>
                  <div className="text-muted-foreground">{student.points} points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Participation */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Category Participation
          </h4>
          <div className="space-y-3">
            {activityCategories.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{category.category}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {category.growth}
                    </Badge>
                    <span className="font-medium">{category.participation}%</span>
                  </div>
                </div>
                <Progress value={category.participation} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
