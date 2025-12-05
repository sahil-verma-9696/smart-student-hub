import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VictoryPie, VictoryBar, VictoryChart, VictoryLine, VictoryArea, VictoryTheme } from "victory";
import axios from "axios";
import { env } from "@/env/config";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${env.SERVER_URL}/api/admin/dashboard/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        // Set empty data structure on error to prevent rendering issues
        setData({
          studentDistribution: [],
          studentYearlyStrength: [],
          facultyDistribution: [],
          attendanceTrend: [],
          activityGrowth: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading analytics...</div>;
  if (!data) return <div className="p-8">Failed to load analytics.</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Analytics — Overview</h1>

      {/* GRID OF REAL CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE CHART – Department-wise Students */}
        <Card className="shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle>Department-wise Student Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {data.studentDistribution && data.studentDistribution.length > 0 ? (
              <VictoryPie
                colorScale={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]}
                data={data.studentDistribution}
                innerRadius={60}
                labelRadius={95}
                style={{ labels: { fill: "#4b5563", fontSize: 14 } }}
              />
            ) : (
              <div className="text-center py-10 text-gray-500">No student data available</div>
            )}
          </CardContent>
        </Card>

        {/* BAR – Year-wise Strength */}
        <Card className="shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle>Year-wise Student Strength</CardTitle>
          </CardHeader>
          <CardContent>
            {data.studentYearlyStrength && data.studentYearlyStrength.length > 0 ? (
              <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryBar
                  style={{ data: { fill: "#3b82f6" } }}
                  data={data.studentYearlyStrength}
                />
              </VictoryChart>
            ) : (
              <div className="text-center py-10 text-gray-500">No year-wise data available</div>
            )}
          </CardContent>
        </Card>

        {/* BAR – Faculty Distribution */}
        <Card className="shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle>Faculty Distribution by Department</CardTitle>
          </CardHeader>
          <CardContent>
            {data.facultyDistribution && data.facultyDistribution.length > 0 ? (
              <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryBar
                  style={{ data: { fill: "#10b981" } }}
                  data={data.facultyDistribution}
                />
              </VictoryChart>
            ) : (
              <div className="text-center py-10 text-gray-500">No faculty data available</div>
            )}
          </CardContent>
        </Card>

        {/* LINE – Attendance Trend (Dummy Data for now) */}
        <Card className="shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle>Attendance Trend Over Months</CardTitle>
          </CardHeader>
          <CardContent>
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryLine
                style={{ data: { stroke: "#6366f1" } }}
                data={data.attendanceTrend}
              />
            </VictoryChart>
          </CardContent>
        </Card>

        {/* AREA – Event Participation Growth */}
        <Card className="shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle>Activity Growth (Last 5 Years)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.activityGrowth && data.activityGrowth.length > 0 ? (
              <VictoryChart theme={VictoryTheme.material}>
                <VictoryArea
                  style={{ data: { fill: "#f59e0b", stroke: "#d97706" } }}
                  data={data.activityGrowth}
                />
              </VictoryChart>
            ) : (
              <div className="text-center py-10 text-gray-500">No activity data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* INSIGHTS BELOW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li>• CSE – 92% Result</li>
              <li>• ECE – 88% Result</li>
              <li>• IT – 85% Result</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Insights & Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <p>• Attendance improved by 7% this semester</p>
            <p>• First-year enrollment highest in 4 years</p>
            <p>• Faculty workload more balanced this year</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
