import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Clock, Zap, Database, Shield } from "lucide-react"

const connectedSystems = [
  {
    name: "University ERP",
    status: "connected",
    lastSync: "2 minutes ago",
    type: "ERP System",
    students: "2,847 synced",
  },
  {
    name: "Moodle LMS",
    status: "connected",
    lastSync: "15 minutes ago",
    type: "Learning Management",
    students: "2,234 active",
  },
  {
    name: "Google Workspace",
    status: "connected",
    lastSync: "1 hour ago",
    type: "Identity Provider",
    students: "2,847 accounts",
  },
  {
    name: "Microsoft Teams",
    status: "pending",
    lastSync: "Setup required",
    type: "Communication",
    students: "Not configured",
  },
]

const integrationStats = [
  {
    title: "Active Connections",
    value: "3",
    description: "Systems currently integrated",
    icon: Zap,
    color: "text-green-600",
  },
  {
    title: "Data Sync Rate",
    value: "99.8%",
    description: "Successful synchronizations",
    icon: Database,
    color: "text-blue-600",
  },
  {
    title: "API Calls Today",
    value: "12,456",
    description: "Total API requests processed",
    icon: Shield,
    color: "text-purple-600",
  },
]

const getStatusIcon = (status) => {
  switch (status) {
    case "connected":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "connected":
      return "bg-green-100 text-green-800 border-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "error":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function IntegrationOverview() {
  return (
    <div className="space-y-6">
      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {integrationStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connected Systems */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Connected Systems
          </CardTitle>
          <CardDescription>Overview of all integrated systems and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedSystems.map((system) => (
              <div key={system.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(system.status)}
                  <div>
                    <h4 className="font-medium">{system.name}</h4>
                    <p className="text-sm text-muted-foreground">{system.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div className="font-medium">{system.students}</div>
                    <div className="text-muted-foreground">Last sync: {system.lastSync}</div>
                  </div>
                  <Badge className={`${getStatusColor(system.status)}`}>{system.status}</Badge>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
