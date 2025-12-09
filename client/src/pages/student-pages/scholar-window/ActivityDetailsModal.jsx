import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Tag, LinkIcon, FileIcon, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function ActivityDetailsModal({ activity, isOpen, onClose }) {
    if (!activity) return null;

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case "APPROVED":
                return "bg-green-100 text-green-800 border-green-200";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "REJECTED":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-xl font-bold">
                                {activity.title}
                            </DialogTitle>
                            <DialogDescription className="mt-1 flex items-center gap-2">
                                <Badge variant="outline">
                                    {activity.activityTypeId?.name ||
                                        activity.activityType ||
                                        "Activity"}
                                </Badge>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">
                                    {new Date(
                                        activity.createdAt || activity.updatedAt
                                    ).toLocaleDateString()}
                                </span>
                            </DialogDescription>
                        </div>
                        <Badge className={getStatusColor(activity.status)}>
                            {activity.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Credits & Stats */}
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground">Credits Earned</div>
                            <div className="text-2xl font-bold text-primary">
                                {activity.credits_earned || activity.creditsEarned || 0}
                            </div>
                        </div>
                        <Separator orientation="vertical" className="h-10" />
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground">Type</div>
                            <div className="font-medium capitalize">
                                {activity.activityTypeId?.name ||
                                    activity.activityType ||
                                    "General"}
                            </div>
                        </div>
                        <Separator orientation="vertical" className="h-10" />
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground">Submission Date</div>
                            <div className="font-medium">
                                {new Date(
                                    activity.createdAt || activity.updatedAt
                                ).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Description</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {activity.description || "No description provided."}
                        </p>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-2 gap-4">
                        {activity.location && (
                            <div className="space-y-1">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Location
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {activity.location}
                                </p>
                            </div>
                        )}

                        {/* If there are skills/tags */}
                        {activity.skills && activity.skills.length > 0 && (
                            <div className="space-y-1 col-span-2">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <Tag className="h-4 w-4" /> Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {activity.skills.map((skill, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Attachments */}
                        {activity.attachments && activity.attachments.length > 0 && (
                            <div className="space-y-2 col-span-2">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <FileIcon className="h-4 w-4" /> Attachments
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {activity.attachments.map((att, i) => (
                                        <a
                                            key={i}
                                            href={att.secureUrl || att.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 p-2 border rounded hover:bg-muted/50 transition-colors group"
                                        >
                                            <div className="bg-primary/10 p-2 rounded">
                                                <FileIcon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{att.originalFilename || "Attachment"}</p>
                                                <p className="text-xs text-muted-foreground uppercase">{att.format || "FILE"}</p>
                                            </div>
                                            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Remarks/Feedback if rejected or approved with notes */}
                    {activity.remarks && (
                        <div className={`p-4 rounded-lg bg-muted text-sm`}>
                            <h4 className="font-semibold mb-1">Feedback/Remarks</h4>
                            <p className="text-muted-foreground">{activity.remarks}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog >
    );
}
