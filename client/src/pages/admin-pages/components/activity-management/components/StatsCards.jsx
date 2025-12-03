import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, XCircle, UserCheck } from "lucide-react";

export const StatsCards = ({ activities, assignments, faculty }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Activities</p>
            <p className="text-2xl font-bold">{activities.length}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Assigned</p>
            <p className="text-2xl font-bold">{assignments.length}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <XCircle className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Unassigned</p>
            <p className="text-2xl font-bold">{activities.length - assignments.length}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <UserCheck className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Faculty</p>
            <p className="text-2xl font-bold">{faculty.length}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
