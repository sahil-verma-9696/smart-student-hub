import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ExternalLink, CheckCircle, AlertCircle, Hourglass, Plus } from "lucide-react"

const activities = [
  {
    id: 1,
    title: "Machine Learning Workshop",
    type: "Workshop",
    date: "2024-01-15",
    status: "approved",
    points: 10,
    description: "Attended 3-day ML workshop by Google AI",
  },
  {
    id: 2,
    title: "Hackathon - TechFest 2024",
    type: "Competition",
    date: "2024-01-10",
    status: "pending",
    points: 25,
    description: "Participated in 48-hour coding hackathon",
  },
  {
    id: 3,
    title: "AWS Cloud Practitioner",
    type: "Certification",
    date: "2024-01-08",
    status: "approved",
    points: 15,
    description: "Completed AWS Cloud Practitioner certification",
  },
  {
    id: 4,
    title: "Blood Donation Camp",
    type: "Community Service",
    date: "2024-01-05",
    status: "approved",
    points: 5,
    description: "Volunteered at college blood donation drive",
  },
  {
    id: 5,
    title: "Research Paper Publication",
    type: "Research",
    date: "2024-01-03",
    status: "pending",
    points: 30,
    description: "Published paper on AI in healthcare",
  },
]

const getStatusIcon = (status) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "pending":
      return <Hourglass className="h-4 w-4 text-yellow-500" />
    case "rejected":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>Your latest submissions and achievements</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">{getStatusIcon(activity.status)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-foreground">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`text-xs ${getStatusColor(activity.status)}`}>{activity.status}</Badge>
                    <div className="text-xs text-muted-foreground">+{activity.points} pts</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(activity.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <Button className="w-full bg-transparent" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add New Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
