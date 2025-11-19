import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Star, Target, Calendar } from "lucide-react"

const achievements = [
  { title: "Academic Excellence", count: 12, total: 15, color: "text-yellow-600" },
  { title: "Leadership Roles", count: 3, total: 5, color: "text-blue-600" },
  { title: "Community Service", count: 8, total: 10, color: "text-green-600" },
  { title: "Technical Skills", count: 15, total: 20, color: "text-purple-600" },
]

const recentBadges = [
  { name: "Workshop Enthusiast", description: "Attended 10+ workshops", icon: Star },
  { name: "Team Player", description: "Led 3 group projects", icon: Trophy },
  { name: "Community Champion", description: "50+ volunteer hours", icon: Award },
]

export function AchievementStats() {
  return (
    <div className="space-y-6">
      {/* Achievement Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Achievement Overview
          </CardTitle>
          <CardDescription>Your progress across different categories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.title} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{achievement.title}</span>
                <span className="text-sm text-muted-foreground">
                  {achievement.count}/{achievement.total}
                </span>
              </div>
              <Progress value={(achievement.count / achievement.total) * 100} className="h-2" />
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">156</div>
              <div className="text-sm text-muted-foreground">Total Points Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            Recent Badges
          </CardTitle>
          <CardDescription>Latest achievements unlocked</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentBadges.map((badge) => (
            <div key={badge.name} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-shrink-0">
                <badge.icon className="h-6 w-6 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{badge.name}</div>
                <div className="text-xs text-muted-foreground">{badge.description}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Monthly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-chart-1" />
            Monthly Goals
          </CardTitle>
          <CardDescription>January 2024 targets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Complete 2 Certifications</span>
              <Badge variant="outline">1/2</Badge>
            </div>
            <Progress value={50} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Attend 3 Workshops</span>
              <Badge variant="default">3/3</Badge>
            </div>
            <Progress value={100} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Volunteer 20 Hours</span>
              <Badge variant="outline">12/20</Badge>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-chart-2" />
            Upcoming Events
          </CardTitle>
          <CardDescription>Don't miss these opportunities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "AI Conference 2024", date: "Jan 25", type: "Conference" },
            { name: "Coding Bootcamp", date: "Jan 28", type: "Workshop" },
            { name: "Career Fair", date: "Feb 02", type: "Event" },
          ].map((event) => (
            <div key={event.name} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium text-sm">{event.name}</div>
                <Badge variant="outline" className="text-xs mt-1">
                  {event.type}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">{event.date}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
