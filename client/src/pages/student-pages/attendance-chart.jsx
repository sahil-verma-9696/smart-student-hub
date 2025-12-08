"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function AttendanceChart({ present = 20, absent = 5 }) {
  const data = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
  ];

  const COLORS = ["#16a34a", "#dc2626"]; // green & red

  const total = present + absent;
  const percentage = ((present / total) * 100).toFixed(1);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Attendance Overview</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#16a34a] rounded-full"></span>
            Present: {present}
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#dc2626] rounded-full"></span>
            Absent: {absent}
          </div>
        </div>

        <div className="mt-3 text-lg font-semibold">
          Total Attendance: {percentage}%
        </div>
      </CardContent>
    </Card>
  );
}
