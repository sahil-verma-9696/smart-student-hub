import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ExternalLink, CheckCircle, AlertCircle, Hourglass, Plus, Loader2 } from "lucide-react"
import useStudentActivities from "../hooks/useStudentActivities"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

const getStatusIcon = (status) => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "PENDING":
      return <Hourglass className="h-4 w-4 text-yellow-500" />
    case "REJECTED":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

import { ActivityDetailsModal } from "./ActivityDetailsModal"

export function RecentActivities({ showAll = false, hideNavigation = false, studentId }) {
  const { activities, loading, fetchActivities } = useStudentActivities(studentId);
  const navigate = useNavigate();
  const [recentActivities, setRecentActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (activities) {
      let filtered = activities;

      if (!showAll) {
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        fiveDaysAgo.setHours(0, 0, 0, 0); // Set to start of day

        filtered = activities.filter(activity => {
          const dateStr = activity.createdAt || activity.updatedAt;
          if (!dateStr) return false;
          const activityDate = new Date(dateStr);
          return activityDate >= fiveDaysAgo;
        });
      }

      const sorted = filtered.sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
      setRecentActivities(sorted);
    }
  }, [activities, showAll]);

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {showAll ? "Student Activities" : "Recent Activities"}
              </CardTitle>
              <CardDescription>
                {showAll
                  ? "All activities submitted by this student"
                  : "Your latest submissions from the last 5 days"}
              </CardDescription>
            </div>
            {!hideNavigation && (
              <Button variant="outline" size="sm" onClick={() => navigate('/student/activities')}>
                View All
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity._id}
                  onClick={() => handleActivityClick(activity)}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 mt-1">{getStatusIcon(activity.status)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground">{activity.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{activity.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`text-xs ${getStatusColor(activity.status)}`}>{activity.status}</Badge>
                        <div className="text-xs text-muted-foreground">+{activity.credits_earned || activity.creditsEarned || 0} pts</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <Badge variant="outline" className="text-xs">
                        {activity.activityType || "Activity"}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(activity.createdAt || activity.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No {showAll ? "" : "recent"} activities found{showAll ? "" : " in the last week"}.</p>
                {!hideNavigation && (
                  <Button variant="link" className="mt-2" onClick={() => navigate('/student/activities')}>
                    View all activities
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ActivityDetailsModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
      />
    </>
  )
}

