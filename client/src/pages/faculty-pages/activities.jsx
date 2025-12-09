import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Loader2, Calendar, User, FileText, Download, ExternalLink } from "lucide-react";
import { activityAPI } from "@/services/api";
import useAuthContext from "@/hooks/useAuthContext";
import { toast } from "react-hot-toast";

export default function FacultyActivitiesPage() {
    const { user } = useAuthContext();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    useEffect(() => {
        const fetchActivities = async () => {
            if (!user?.institute?._id) return;

            try {
                setLoading(true);
                const response = await activityAPI.getActivities({
                    instituteId: user.institute._id
                });

                if (response && response.data) {
                    setActivities(response.data);
                } else if (Array.isArray(response)) {
                    setActivities(response);
                }
            } catch (error) {
                console.error("Error fetching activities", error);
                toast.error("Failed to load activities");
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [user]);

    const filteredActivities = activities.filter(activity => {
        const matchSearch = (activity.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (activity.student?.basicUserDetails?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchType = typeFilter === "all" || activity.activityType === typeFilter;

        return matchSearch && matchType;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Institute Activities</h1>
                        <p className="text-gray-500">View all student activities in your institute</p>
                    </div>
                </div>

                <Card className="border-2 border-black shadow-md">
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by title or student name..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="workshop">Workshop</SelectItem>
                                <SelectItem value="hackathon">Hackathon</SelectItem>
                                <SelectItem value="project">Project</SelectItem>
                                <SelectItem value="certification">Certification</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <CardContent className="p-0">
                        {filteredActivities.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No activities found matching your criteria.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredActivities.map((activity) => (
                                    <div key={activity._id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-lg text-gray-900">{activity.title}</h3>
                                                <Badge variant="outline" className="capitalize text-xs">
                                                    {activity.activityType}
                                                </Badge>
                                                <Badge
                                                    variant="secondary"
                                                    className={`capitalize text-xs ${activity.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                            activity.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-orange-100 text-orange-700'
                                                        }`}
                                                >
                                                    {activity.status}
                                                </Badge>
                                            </div>
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">{activity.description}</p>

                                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {activity.student?.basicUserDetails?.name || 'Unknown Student'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(activity.createdAt).toLocaleDateString()}
                                                </span>
                                                {activity.attachments?.length > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <FileText className="h-3 w-3" />
                                                        {activity.attachments.length} Attachments
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {activity.externalLinks?.length > 0 && (
                                                <Button variant="ghost" size="icon" title="External Links">
                                                    <ExternalLink className="h-4 w-4 text-blue-600" />
                                                </Button>
                                            )}
                                            <Button variant="outline" size="sm">
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
