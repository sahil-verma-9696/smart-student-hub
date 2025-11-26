"use client";

import { useState } from "react";
import { StudentOverview } from "@/components/dashboard/student-overview";
import { AchievementStats } from "@/components/dashboard/achievement-stats";
import { AttendanceChart } from "@/pages/student-pages/attendance-chart";
import { RecentActivities } from "@/components/dashboard/recent-activities";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Default activities
const defaultActivities = [
  {
    id: 1,
    title: "Machine Learning Workshop",
    type: "Workshop",
    date: "2024-01-15",
    status: "approved",
    points: 10,
    description: "Attended 3-day ML workshop by Google AI",
  },
  {
    id: 2,
    title: "Hackathon - TechFest 2024",
    type: "Competition",
    date: "2024-01-10",
    status: "pending",
    points: 25,
    description: "Participated in 48-hour coding hackathon",
  },
];

export default function ScholarWindowPage() {
  const [activities, setActivities] = useState(defaultActivities);

  // Modal state
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    type: "",
    date: "",
    points: "",
    description: "",
  });

  // Submit new activity
  const handleSubmit = () => {
    const newActivity = {
      id: Date.now(),
      status: "pending",
      ...form,
    };

    // Add new activity at top
    setActivities((prev) => [newActivity, ...prev]);

    // Close modal
    setOpen(false);

    // Reset form
    setForm({
      title: "",
      type: "",
      date: "",
      points: "",
      description: "",
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-sm text-muted-foreground">
          Welcome back, John Doe
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StudentOverview onAddClick={() => setOpen(true)} />
            <RecentActivities
              activities={activities}
              onAddClick={() => setOpen(true)}
            />
          </div>

          <div className="space-y-6">
            <AchievementStats />
            <AttendanceChart present={22} absent={3} />
          </div>
        </div>
      </div>

      {/* ADD ACTIVITY MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Type</Label>
              <Input
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="Workshop, Competition, Certification..."
              />
            </div>

            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div>
              <Label>Points</Label>
              <Input
                type="number"
                value={form.points}
                onChange={(e) => setForm({ ...form, points: e.target.value })}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <Button className="w-full" onClick={handleSubmit}>
              Submit Activity
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
