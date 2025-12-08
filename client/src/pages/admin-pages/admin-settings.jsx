import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Shield, UserCog, Database } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Settings</h1>

      {/* PROFILE SETTINGS */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCog className="w-5 h-5 text-blue-500"/> Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Admin Name</Label>
            <Input placeholder="Enter your name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="admin@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input type="text" placeholder="9876543210" />
          </div>
          <Button className="mt-2">Save Changes</Button>
        </CardContent>
      </Card>

      {/* NOTIFICATION SETTINGS */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-yellow-500"/> Notification Settings</CardTitle>
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
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-red-500"/> Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Change Password</Label>
            <Input type="password" placeholder="New password" />
          </div>
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input type="password" placeholder="Confirm password" />
          </div>
          <Button className="mt-2 bg-red-600 hover:bg-red-700">Update Password</Button>
        </CardContent>
      </Card>

      {/* SYSTEM SETTINGS */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5 text-green-600"/> System Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
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

          <Button className="mt-2">Save System Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
