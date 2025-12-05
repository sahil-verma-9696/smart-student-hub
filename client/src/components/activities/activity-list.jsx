"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Eye,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Hourglass,
  Loader2,
} from "lucide-react";
import { env } from "@/env/config";
import useAuthContext from "@/hooks/useAuthContext";
import { toast } from "react-hot-toast";

const getStatusIcon = (status) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "pending":
      return <Hourglass className="h-4 w-4 text-yellow-500" />;
    case "rejected":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
  import { useAuthContext } from "@/hooks/useAuthContext";
  import { useActivitiesApi } from "@/hooks/useActivitiesApi";
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    const { fetchActivities, loading: loadingActivities } = useActivitiesApi();
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
          const [activitiesList, typesRes] = await Promise.all([
            fetchActivities(),
            axios.get(`${env.SERVER_URL}/api/activity-types`),
          ]);
          setActivities(activitiesList);
          setActivityTypes(typesRes.data);
  const [typeFilter, setTypeFilter] = useState("all");
  const [activityTypes, setActivityTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [activitiesRes, typesRes] = await Promise.all([
          axios.get(`${env.SERVER_URL}/api/activities`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          axios.get(`${env.SERVER_URL}/api/activity-types`),
        ]);
        setActivities(activitiesRes.data);
        setActivityTypes(typesRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load activities");
        // Set empty arrays on error to prevent rendering issues
        setActivities([]);
        setActivityTypes([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const status = activity.approval?.state?.toLowerCase() || "pending";
    const matchesStatus =
      statusFilter === "all" || status === statusFilter;
    // activity.activityType might be populated or just an ID. Assuming populated based on backend.
    const typeTitle = activity.activityType?.title || "";
    const matchesType =
      typeFilter === "all" || typeTitle.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  // Extract unique types for filter
  const uniqueTypes = Array.from(new Set(activityTypes.map(t => t.title)));

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          My Activities
        </CardTitle>
        <CardDescription>
          Track and manage all your submitted activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {filteredActivities.map((activity) => {
            const status = activity.approval?.state?.toLowerCase() || "pending";
            return (
            <div
              key={activity._id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(status)}
                    <h3 className="font-semibold text-foreground">
                      {activity.title}
                    </h3>
                    <Badge
                      className={`text-xs ${getStatusColor(status)}`}
                    >
                      {status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {activity.description}
                  </p>

                  {/* Status Details */}
                  {status === 'rejected' && activity.approval?.rejected?.reason && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                        <strong>Rejection Reason:</strong> {activity.approval.rejected.reason}
                    </div>
                  )}
                  {status === 'approved' && activity.approval?.approved?.remarks && (
                    <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                        <strong>Remarks:</strong> {activity.approval.approved.remarks}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.activityType?.title || "Unknown Type"}
                    </Badge>
                    {/* Display points if available in activityType */}
                    {activity.activityType?.points && (
                        <span className="font-medium text-primary">
                        +{activity.activityType.points} pts
                        </span>
                    )}
                  </div>

                  {/* Display some details if relevant */}
                  {activity.details && Object.keys(activity.details).length > 0 && (
                     <div className="flex flex-wrap gap-1 mb-3">
                        {Object.entries(activity.details).slice(0, 3).map(([key, val]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                                {key}: {String(val)}
                            </Badge>
                        ))}
                     </div>
                  )}

                  {activity.attachments && activity.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activity.attachments.map((file, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 bg-transparent"
                          onClick={() => window.open(file.url, "_blank")}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {file.original_filename || "Attachment"}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          )})}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activities found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
