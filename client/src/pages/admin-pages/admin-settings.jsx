import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Shield, UserCog, Database } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="px-8 py-6 w-full">
      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold text-center mb-8">Admin Settings</h1>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

        {/* PROFILE SETTINGS */}
        <Card className="shadow-lg border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCog className="w-5 h-5 text-blue-500" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Admin Name</Label>
              <Input placeholder="Enter your name" />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="admin@example.com" />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input type="text" placeholder="9876543210" />
            </div>

            <Button className="mt-2 w-full bg-black text-white">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* NOTIFICATION SETTINGS */}
        <Card className="shadow-lg border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-yellow-500" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>New Student Registrations</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label>Faculty Updates</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label>Important Alerts</Label>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* SECURITY SETTINGS */}
        <Card className="shadow-lg border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-red-500" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>New Password</Label>
              <Input type="password" placeholder="Enter new password" />
            </div>

            <div>
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="Confirm new password" />
            </div>

            <Button className="mt-2 w-full bg-red-600 text-white">
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* SYSTEM SETTINGS */}
        <Card className="shadow-lg border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="w-5 h-5 text-green-600" />
              System Settings
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label>Data Backup Frequency</Label>
              <select className="border rounded-lg p-2 w-full">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Auto Backup</Label>
              <Switch />
            </div>

            <Button className="mt-2 w-full bg-black text-white">
              Save System Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
