"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Clock, CheckCircle } from "lucide-react";

// ----------------------------------------------
// CONFIG (Color mapping for types)
// ----------------------------------------------
const TYPE_COLORS = {
  default: "bg-blue-500",
  workshop: "bg-green-500",
  hackathon: "bg-purple-500",
  custom: "bg-orange-500",
};

// ----------------------------------------------
// MOCK MONTHLY DATA (until backend supports it)
// ----------------------------------------------
const MONTHLY_STATS = [
  { month: "Jan", activities: 5, points: 85 },
  { month: "Dec", activities: 3, points: 45 },
  { month: "Nov", activities: 7, points: 120 },
  { month: "Oct", activities: 4, points: 60 },
];

// ----------------------------------------------
// HELPERS
// ----------------------------------------------
function getColorForType(type) {
  return TYPE_COLORS[type] || "bg-gray-400";
}

function formatCategoryStats(types = {}, total = 1) {
  return Object.entries(types).map(([key, count]) => ({
    key,
    category: key.charAt(0).toUpperCase() + key.slice(1),
    count,
    color: getColorForType(key),
    percentage: (count / total) * 100,
  }));
}

function formatStatusRows(status) {
  return [
    { label: "Approved", value: status?.approved, color: "bg-green-500" },
    { label: "Pending", value: status?.pending, color: "bg-yellow-500" },
    { label: "Rejected", value: status?.rejected, color: "bg-red-500" },
  ];
}

// ----------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------
export function ActivityStats({ activityStats = {} }) {
  if (!activityStats) return null;

  const { status = {}, types = {}, trendingActivityType } = activityStats;

  // Prepare formatted data
  const totalActivities = status?.total || 0;
  const categoryStats = formatCategoryStats(types, totalActivities);
  const statusRows = formatStatusRows(status);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------ */}
      {/* OVERALL SUMMARY */}
      {/* ------------------------------------------------------ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Activity Summary
          </CardTitle>
          <CardDescription>Your activity statistics overview</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Top Summary */}
          <div className="grid grid-cols-2 gap-4">
            <SummaryBox title="Total Activities" value={totalActivities} />
            <SummaryBox title="Points Earned" value={160} secondary />
          </div>

          {/* Monthly Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Monthly Goal</span>
              <span>5/8 activities</span>
            </div>
            <Progress value={62.5} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------ */}
      {/* STATUS BREAKDOWN */}
      {/* ------------------------------------------------------ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Status Breakdown
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {statusRows.map((row) => (
            <StatusRow key={row.label} {...row} />
          ))}
        </CardContent>
      </Card>

      {/* ------------------------------------------------------ */}
      {/* CATEGORY BREAKDOWN */}
      {/* ------------------------------------------------------ */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Activities by type</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {categoryStats.map((category) => (
            <CategoryRow key={category.key} {...category} />
          ))}
        </CardContent>
      </Card>

      {/* ------------------------------------------------------ */}
      {/* TRENDING ACTIVITY */}
      {/* ------------------------------------------------------ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Trending Activity
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {trendingActivityType
              ? trendingActivityType.charAt(0).toUpperCase() +
                trendingActivityType.slice(1)
              : "None"}
          </Badge>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------ */}
      {/* MONTHLY TREND */}
      {/* ------------------------------------------------------ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-chart-1" />
            Monthly Trend
          </CardTitle>
          <CardDescription>Last 4 months activity</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {MONTHLY_STATS.map((month) => (
            <MonthlyRow key={month.month} {...month} />
          ))}
        </CardContent>
      </Card>

      {/* ------------------------------------------------------ */}
      {/* QUICK TIPS */}
      {/* ------------------------------------------------------ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-chart-2" />
            Quick Tips
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Upload clear certificates for faster approval</p>
          <p>• Add detailed descriptions to showcase learning</p>
          <p>• Tag relevant skills to build your profile</p>
          <p>• Submit activities within 30 days of completion</p>
        </CardContent>
      </Card>
    </div>
  );
}

//
// ------------------------------------------------------
// SMALL SUB-COMPONENTS (Pure UI, No Logic)
// ------------------------------------------------------
//

function SummaryBox({ title, value, secondary }) {
  return (
    <div className="text-center p-3 border rounded-lg">
      <div
        className={`text-2xl font-bold ${
          secondary ? "text-secondary" : "text-primary"
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{title}</div>
    </div>
  );
}

function StatusRow({ label, value = 0, color }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span className="text-sm">{label}</span>
      </div>
      <Badge variant="secondary">{value}</Badge>
    </div>
  );
}

function CategoryRow({ category, count, color, percentage }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span>{category}</span>
        <span>{count} activities</span>
      </div>

      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function MonthlyRow({ month, activities, points }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{month}</span>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{activities} activities</span>
        <span>•</span>
        <span>{points} pts</span>
      </div>
    </div>
  );
}
