"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Eye,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Hourglass,
} from "lucide-react";

const mockActivities = [
  {
    id: 1,
    title: "Machine Learning Workshop",
    type: "Workshop",
    organizer: "Google AI",
    date: "2024-01-15",
    status: "approved",
    points: 10,
    description:
      "Comprehensive 3-day workshop on ML fundamentals and applications",
    skills: ["Python", "TensorFlow", "Data Analysis"],
    files: ["certificate.pdf", "project_report.pdf"],
  },
  {
    id: 2,
    title: "Hackathon - TechFest 2024",
    type: "Competition",
    organizer: "IEEE Student Chapter",
    date: "2024-01-10",
    status: "pending",
    points: 25,
    description:
      "48-hour coding hackathon focused on sustainable technology solutions",
    skills: ["React", "Node.js", "MongoDB"],
    files: ["participation_certificate.pdf"],
  },
  {
    id: 3,
    title: "AWS Cloud Practitioner",
    type: "Certification",
    organizer: "Amazon Web Services",
    date: "2024-01-08",
    status: "approved",
    points: 15,
    description:
      "Official AWS certification demonstrating cloud computing knowledge",
    skills: ["Cloud Computing", "AWS Services", "DevOps"],
    files: ["aws_certificate.pdf"],
  },
  {
    id: 4,
    title: "Blood Donation Camp Volunteer",
    type: "Community Service",
    organizer: "Red Cross Society",
    date: "2024-01-05",
    status: "approved",
    points: 5,
    description:
      "Volunteered at college blood donation drive, helped with registration",
    skills: ["Leadership", "Communication", "Social Service"],
    files: ["volunteer_certificate.pdf"],
  },
  {
    id: 5,
    title: "Research Paper on AI in Healthcare",
    type: "Research",
    organizer: "International Journal of AI",
    date: "2024-01-03",
    status: "pending",
    points: 30,
    description:
      "Published research paper on machine learning applications in medical diagnosis",
    skills: ["Research", "Academic Writing", "AI/ML"],
    files: ["research_paper.pdf", "publication_proof.pdf"],
  },
];

const getStatusIcon = (status) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "pending":
      return <Hourglass className="h-4 w-4 text-yellow-500" />;
    case "rejected":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function ActivityList({ activities = [] }) {
  if (!activities) return null;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredActivities = activities?.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || activity.status === statusFilter;
    const matchesType =
      typeFilter === "all" || activity.type.toLowerCase() === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="competition">Competition</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
              <SelectItem value="community service">
                Community Service
              </SelectItem>
              <SelectItem value="research">Research</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {filteredActivities?.map((activity) => (
            <div
              key={activity.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(activity.status)}
                    <h3 className="font-semibold text-foreground">
                      {activity.title}
                    </h3>
                    <Badge
                      className={`text-xs ${getStatusColor(activity.status)}`}
                    >
                      {activity.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {activity.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(activity.dateStart).toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.activityType}
                    </Badge>
                  </div>

                  {activity?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {activity.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {activity?.files?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activity.files.map((file, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 bg-transparent"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {file}
                        </Button>
                      ))}
                    </div>
                  )}

                  {activity?.attachments.map((attachment) => {
                    if (attachment.resourceType === "image") {
                      return (
                        <div key={attachment._id}>
                          <img
                            src={attachment.url}
                            alt={attachment.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      );
                    }
                    return (
                      <div key={attachment._id}>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {attachment.name}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activities found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
