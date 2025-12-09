import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Shield, User, Globe } from "lucide-react";
import useAuthContext from "@/hooks/useAuthContext";

export default function FacultySettingsPage() {
    const { user } = useAuthContext();

    return (
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500">Manage your preferences and account settings</p>
                </div>

                <Card className="border-2 border-black shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                            <div className="space-y-0.5">
                                <Label className="text-base">Email Notifications</Label>
                                <p className="text-sm text-gray-500">Receive emails about new activity assignments</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                            <div className="space-y-0.5">
                                <Label className="text-base">In-App Alerts</Label>
                                <p className="text-sm text-gray-500">Show alerts on dashboard</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-black shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Security
                        </CardTitle>
                        <CardDescription>Update your password and security preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <Button variant="outline" className="w-full">Change Password</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
