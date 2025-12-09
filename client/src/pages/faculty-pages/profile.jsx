import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Building, BookOpen, Hash } from "lucide-react";
import useAuthContext from "@/hooks/useAuthContext";

export default function FacultyProfile() {
    const { user } = useAuthContext();

    const userDetails = user?.basicUserDetails || {};
    const facultyDetails = user?.facultyDetails || {};

    return (
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-500 mt-2">Manage your account settings and view your profile details</p>
                    </div>
                </div>

                <Card className="border-2 border-black shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                                <User className="h-10 w-10 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{userDetails.name || 'Faculty Member'}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                    <Mail className="h-4 w-4" />
                                    {userDetails.email || 'email@example.com'}
                                </CardDescription>
                                <div className="flex gap-2 mt-3">
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">Faculty</Badge>
                                    {user?.institute?.name && (
                                        <Badge variant="outline" className="border-blue-200 text-blue-700">
                                            {user.institute.name}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-gray-500" />
                            Academic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                                    <Building className="h-4 w-4" /> Department
                                </p>
                                <p className="font-medium text-lg">{user?.department || 'Not Assigned'}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Joined Date
                                </p>
                                <p className="font-medium text-lg">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                                    <Hash className="h-4 w-4" /> Faculty ID
                                </p>
                                <p className="font-medium text-lg">{user?._id?.substring(0, 8)}...</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
