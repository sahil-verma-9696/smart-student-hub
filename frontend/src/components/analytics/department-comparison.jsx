import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building2, Award, TrendingUp, BarChart3 } from "lucide-react"

const departmentData = [
  {
    name: "Computer Science",
    students: 856,
    activities: 2340,
    avgPerStudent: 2.7,
    topCategory: "Technical Workshops",
    engagement: 92,
    growth: "+15%",
  },
  {
    name: "Electronics & Communication",
    students: 743,
    activities: 1876,
    avgPerStudent: 2.5,
    topCategory: "Certifications",
    engagement: 85,
    growth: "+12%",
  },
  {
    name: "Mechanical Engineering",
    students: 654,
    activities: 1456,
    avgPerStudent: 2.2,
    topCategory: "Industry Visits",
    engagement: 78,
    growth: "+8%",
  },
  {
    name: "Civil Engineering",
    students: 594,
    activities: 1234,
    avgPerStudent: 2.1,
    topCategory: "Workshops",
    engagement: 73,
    growth: "+6%",
  },
  {
    name: "Electrical Engineering",
    students: 512,
    activities: 1098,
    avgPerStudent: 2.1,
    topCategory: "Seminars",
    engagement: 71,
    growth: "+10%",
  },
]

const categoryComparison = [
  {
    category: "Technical Workshops",
    departments: [
      { name: "CSE", count: 456, percentage: 35 },
      { name: "ECE", count: 342, percentage: 26 },
      { name: "ME", count: 234, percentage: 18 },
      { name: "CE", count: 156, percentage: 12 },
      { name: "EEE", count: 123, percentage: 9 },
    ],
  },
  {
    category: "Certifications",
    departments: [
      { name: "ECE", count: 298, percentage: 32 },
      { name: "CSE", count: 287, percentage: 31 },
      { name: "EEE", count: 156, percentage: 17 },
      { name: "ME", count: 98, percentage: 11 },
      { name: "CE", count: 87, percentage: 9 },
    ],
  },
  {
    category: "Research Projects",
    departments: [
      { name: "CSE", count: 89, percentage: 28 },
      { name: "ECE", count: 76, percentage: 24 },
      { name: "ME", count: 67, percentage: 21 },
      { name: "EEE", count: 45, percentage: 14 },
      { name: "CE", count: 41, percentage: 13 },
    ],
  },
]

export function DepartmentComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-chart-1" />
          Department-wise Analysis
        </CardTitle>
        <CardDescription>Comparative analysis of student engagement across departments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Department Overview */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Department Performance Overview
          </h4>
          <div className="space-y-3">
            {departmentData.map((dept) => (
              <div key={dept.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-medium">{dept.name}</h5>
                    <p className="text-sm text-muted-foreground">
                      {dept.students} students • {dept.activities} activities
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{dept.growth}</Badge>
                    <Badge variant="outline">{dept.engagement}%</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-primary">{dept.avgPerStudent}</div>
                    <div className="text-muted-foreground">Avg per student</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-secondary">{dept.topCategory}</div>
                    <div className="text-muted-foreground">Top category</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-chart-1">{dept.engagement}%</div>
                    <div className="text-muted-foreground">Engagement</div>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress value={dept.engagement} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category-wise Comparison */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Award className="h-4 w-4" />
            Activity Category Distribution
          </h4>
          <div className="space-y-4">
            {categoryComparison.map((category) => (
              <div key={category.category} className="space-y-3">
                <h5 className="font-medium text-sm">{category.category}</h5>
                <div className="space-y-2">
                  {category.departments.map((dept) => (
                    <div key={dept.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm font-medium w-12">{dept.name}</span>
                        <div className="flex-1">
                          <Progress value={dept.percentage} className="h-1.5" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{dept.count}</span>
                        <Badge variant="outline" className="text-xs">
                          {dept.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Ranking */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Engagement Ranking
          </h4>
          <div className="space-y-2">
            {departmentData
              .sort((a, b) => b.engagement - a.engagement)
              .map((dept, index) => (
                <div key={dept.name} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={index < 2 ? "default" : "secondary"}
                      className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {index + 1}
                    </Badge>
                    <span className="font-medium text-sm">{dept.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {dept.growth}
                    </Badge>
                    <span className="text-sm font-medium">{dept.engagement}%</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
