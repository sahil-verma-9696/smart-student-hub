"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MapPin, Mail, Phone, User, Landmark } from "lucide-react";
import { useProfilePageContext } from "./contexts/profile-page-context";
import { RecentActivities } from "./scholar-window/recent-activities";

export default function Profile({ student }) {
  const { profileData: user } = useProfilePageContext();

  if (!user) return null;

  return (
    <div className=" max-w-screen   px-4 py-6 space-y-6">
      {/* ---------- PROFILE HEADER ---------- */}
      <Card className="shadow-sm">
        <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-start">
          {/* Profile Picture */}
          <Avatar className="h-24 w-24 border shadow">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>
              {user?.basicUserDetails?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-semibold">
              {user?.basicUserDetails?.name}
            </h2>

            <Badge variant="secondary" className="capitalize">
              {user?.basicUserDetails?.gender || "Not specified"}
            </Badge>

            {/* Contact Info */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> {user?.basicUserDetails?.email}
              </p>
              {user?.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> {user?.phone}
                </p>
              )}
              {user?.address && (
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {user?.address}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------- STUDENT DETAILS SECTION ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
          <DetailItem label="Roll Number" value={user?.roll_number} />
          <DetailItem
            label="Program"
            value={user?.academicDetails?.program?.name || "N/A"}
          />
          <DetailItem
            label="Degree"
            value={user?.academicDetails?.degree?.name || "N/A"}
          />
          <DetailItem
            label="Branch"
            value={user?.academicDetails?.branch?.name || "N/A"}
          />

          <DetailItem
            label="Specialization"
            value={user?.academicDetails?.specialization?.name}
          />

          <DetailItem
            label="Current Year"
            value={user?.academicDetails?.currentYear || "N/A"}
          />
        </CardContent>
      </Card>

      {/* ---------- ACTIVITIES SECTION ---------- */}
      <RecentActivities showAll={true} hideNavigation={true} studentId={user?._id} />
    </div>
  );
}

/* -------------------- SMALL COMPONENTS -------------------- */

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}

function ActivityItem({ title, description, date, icon }) {
  return (
    <div className="flex gap-4 items-start relative">
      {/* Dot Line */}
      <div className="flex flex-col items-center">
        <div className="h-3 w-3 rounded-full bg-primary" />
        <Separator orientation="vertical" className="h-full ml-[5px]" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <h4 className="font-semibold text-base flex items-center gap-2">
          {icon} {title}
        </h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}
