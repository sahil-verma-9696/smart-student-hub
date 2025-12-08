import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, GraduationCap, Target, Plus } from "lucide-react"

export function StudentOverview() {
  return (
    <div className="space-y-6">
      {/* Academic Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Academic Progress
          </CardTitle>
          <CardDescription>Current semester overview and performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CGPA</span>
                <span className="font-medium">8.7/10.0</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Attendance</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">7</div>
              <div className="text-xs text-muted-foreground">Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">24</div>
              <div className="text-xs text-muted-foreground">Credits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-1">3</div>
              <div className="text-xs text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-2">2</div>
              <div className="text-xs text-muted-foreground">Internships</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-secondary" />
            Quick Actions
          </CardTitle>
          <CardDescription>Frequently used features and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent">
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add Activity</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent">
              <Calendar className="h-5 w-5" />
              <span className="text-xs">View Schedule</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent">
              <GraduationCap className="h-5 w-5" />
              <span className="text-xs">Certificates</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent">
              <Clock className="h-5 w-5" />
              <span className="text-xs">Portfolio</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Semester Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current Semester - Fall 2024</CardTitle>
          <CardDescription>Enrolled courses and progress tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { code: "CS301", name: "Data Structures & Algorithms", progress: 75, grade: "A-" },
              { code: "CS302", name: "Database Management Systems", progress: 82, grade: "A" },
              { code: "CS303", name: "Computer Networks", progress: 68, grade: "B+" },
              { code: "CS304", name: "Software Engineering", progress: 90, grade: "A+" },
            ].map((course) => (
              <div key={course.code} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      {course.code}
                    </Badge>
                    <span className="font-medium text-sm">{course.name}</span>
                  </div>
                  <div className="mt-2">
                    <Progress value={course.progress} className="h-1.5" />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <Badge variant={course.grade.startsWith("A") ? "default" : "outline"}>{course.grade}</Badge>
                  <div className="text-xs text-muted-foreground mt-1">{course.progress}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
