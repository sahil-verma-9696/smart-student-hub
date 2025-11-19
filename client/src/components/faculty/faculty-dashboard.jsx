import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, Clock, CheckCircle, AlertTriangle, Users, Calendar } from "lucide-react"

const quickStats = [
  {
    title: "Pending Reviews",
    value: "24",
    description: "Activities awaiting approval",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Approved Today",
    value: "12",
    description: "Activities approved today",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Students Active",
    value: "156",
    description: "Students with submissions",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "This Month",
    value: "89",
    description: "Total reviews completed",
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
]

const urgentItems = [
  {
    student: "John Doe (CS19B001)",
    activity: "International AI Conference",
    type: "Conference",
    submitted: "3 days ago",
    priority: "high",
  },
  {
    student: "Jane Smith (CS19B002)",
    activity: "AWS Certification",
    type: "Certification",
    submitted: "2 days ago",
    priority: "medium",
  },
  {
    student: "Mike Johnson (CS19B003)",
    activity: "Hackathon Winner",
    type: "Competition",
    submitted: "1 day ago",
    priority: "high",
  },
]

export function FacultyDashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>Frequently used faculty tools and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent">
              <Clock className="h-5 w-5" />
              <span className="text-xs">Review Queue</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent">
              <CheckCircle className="h-5 w-5" />
              <span className="text-xs">Bulk Approve</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent">
              <Users className="h-5 w-5" />
              <span className="text-xs">Student Reports</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4 bg-transparent">
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Activity Calendar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Urgent Reviews
              </CardTitle>
              <CardDescription>Activities requiring immediate attention</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {urgentItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{item.student}</span>
                    <Badge variant={item.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.activity}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.submitted}</span>
                  </div>
                </div>
                <Button size="sm">Review</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
