"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CardContent, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Calendar,
  Download,
  CheckCircle,
  AlertCircle,
  Hourglass,
} from "lucide-react";
import { useActivityPageContext } from "@/pages/student-pages/hooks/useActivityPageContext";
import { Image } from "antd";

export function ActivityList() {
  /*************************************************************
   * ************* Access ActivityPageContext *******************
   * ************************************************************/
  const { activities, fetchFilteredActivities } = useActivityPageContext();

  const [searchParams, setSearchParams] = useSearchParams();

  /************************************************************
   * ************* Activity Filters ***********************
   * ***********************************************************/

  /** title filter */
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("title") || "*"
  );

  /** Status Filter */
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );

  /** activityType Filter */
  const [typeFilter, setTypeFilter] = useState(
    searchParams.get("activityType") || "all"
  );

  // 1. Update URL when filters change
  useEffect(() => {
    // Create Map for params
    const params = {};

    params.title = searchTerm;
    params.status = statusFilter;
    params.activityType = typeFilter;

    setSearchParams(params);
  }, [searchTerm, statusFilter, typeFilter]);

  // 2. Fetch backend-filtered data when URL changes
  useEffect(() => {
    const filters = {};

    const title = searchParams.get("title");
    const status = searchParams.get("status");
    const type = searchParams.get("activityType");

    if (title) filters.title = title;
    if (status) filters.status = status;
    if (type) filters.activityType = type;

    console.log(filters);

    fetchFilteredActivities(filters);
  }, [searchParams]);

  // backend already filtered the data
  const filteredActivities = activities;

  return (
    <div>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="hackathon">Hackathon</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities?.map((activity) => (
            <ActivityCard key={activity._id} activity={activity} />
          ))}
        </div>
      </CardContent>
    </div>
  );
}

function ActivityCard({ activity }) {
  const statusIcon = {
    approved: <CheckCircle className="h-4 w-4 text-green-500" />,
    pending: <Hourglass className="h-4 w-4 text-yellow-500" />,
    rejected: <AlertCircle className="h-4 w-4 text-red-500" />,
  }[activity.status];

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2">
        {statusIcon}
        <h3 className="font-semibold">{activity.title}</h3>
      </div>

      <p className="text-sm text-muted-foreground mt-2">
        {activity.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(activity.dateStart).toLocaleDateString()}
        </div>
        <Badge variant="outline">{activity.activityType}</Badge>
      </div>

      {/* Attachments */}
      {activity.attachments?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {activity.attachments.map((a) => (
            <Image
              key={a._id}
              src={a.url}
              alt={a.name}
              className="w-16 h-16 object-cover rounded-md"
            />
          ))}
        </div>
      )}
    </div>
  );
}
