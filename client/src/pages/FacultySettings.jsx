"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Bell, KeyRound } from "lucide-react";

export default function FacultySettings() {
  const [notifications, setNotifications] = useState("enabled");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border border-purple-600 bg-purple-50 text-black rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-y-auto max-h-[500px]">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-900" />
            <KeyRound className="w-5 h-5 text-purple-800" />
            <CardTitle className="text-purple-800">Settings</CardTitle>
          </div>
          <CardDescription className="text-black">
            Manage notifications and update your password
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-2">
          {/* Notifications */}
          <div className="space-y-2">
            <Label className="text-purple-700">Email Notifications</Label>
            <Select value={notifications} onValueChange={setNotifications}>
              <SelectTrigger className="bg-purple-900 text-white hover:bg-purple-400">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent className="bg-purple-400 text-white">
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-black hover:text-purple-700 transition-colors duration-300">
              <KeyRound className="w-5 h-5" /> Change Password
            </h2>

            <div className="space-y-2">
              <Label className="text-purple-700">Current Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-purple-50 text-white border-purple-700 hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300"
              />

              <Label className="text-purple-700">New Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-purple-50 text-white border-purple-700 hover:border-purple-500 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300"
              />
            </div>

            <Button className="bg-purple-900 hover:bg-purple-500 text-white border-none transition-transform transform hover:scale-105">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
