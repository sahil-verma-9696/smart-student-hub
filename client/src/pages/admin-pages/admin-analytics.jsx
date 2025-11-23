import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VictoryPie, VictoryBar, VictoryChart, VictoryLine, VictoryArea, VictoryTheme } from "victory";

export default function AdminAnalyticsPage() {
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
            <VictoryPie
              colorScale={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]}
              data={[
                { x: "CSE", y: 45 },
                { x: "ECE", y: 30 },
                { x: "IT", y: 15 },
                { x: "ME", y: 10 }
              ]}
              innerRadius={60}
              labelRadius={95}
              style={{ labels: { fill: "#4b5563", fontSize: 14 } }}
            />
          </CardContent>
        </Card>

        

        {/* BAR – Year-wise Strength */}
        <Card className="shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle>Year-wise Student Strength</CardTitle>
          </CardHeader>
          <CardContent>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
              <VictoryBar
                style={{ data: { fill: "#3b82f6" } }}
                data={[
                  { x: "1st", y: 320 },
                  { x: "2nd", y: 280 },
                  { x: "3rd", y: 260 },
                  { x: "4th", y: 210 }
                ]}
              />
            </VictoryChart>
          </CardContent>
        </Card>

        {/* BAR – Faculty Distribution */}
        <Card className="shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle>Faculty Distribution by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
              <VictoryBar
                style={{ data: { fill: "#10b981" } }}
                data={[
                  { x: "CSE", y: 18 },
                  { x: "ECE", y: 16 },
                  { x: "IT", y: 12 },
                  { x: "ME", y: 10 }
                ]}
              />
            </VictoryChart>
          </CardContent>
        </Card>

        {/* LINE – Attendance Trend */}
        <Card className="shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle>Attendance Trend Over Months</CardTitle>
          </CardHeader>
          <CardContent>
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryLine
                style={{ data: { stroke: "#6366f1" } }}
                data={[
                  { x: "Jan", y: 75 },
                  { x: "Feb", y: 78 },
                  { x: "Mar", y: 80 },
                  { x: "Apr", y: 85 },
                  { x: "May", y: 86 }
                ]}
              />
            </VictoryChart>
          </CardContent>
        </Card>

        {/* AREA – Event Participation */}
        <Card className="shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle>Event Participation Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryArea
                style={{ data: { fill: "#f59e0b", stroke: "#d97706" } }}
                data={[
                  { x: "2019", y: 50 },
                  { x: "2020", y: 80 },
                  { x: "2021", y: 120 },
                  { x: "2022", y: 150 },
                  { x: "2023", y: 210 }
                ]}
              />
            </VictoryChart>
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
