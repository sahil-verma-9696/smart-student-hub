"use client";
import useAuthContext from "@/hooks/useAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  User,
} from "lucide-react";

export default function AdminProfilePage() {
  const { user } = useAuthContext();
  const {
    basicUserDetails,
    institute,
    employee_code,
    department,
    designation,
    createdAt,
    updatedAt,
  } = user || {};

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const { name, email, gender, contactInfo } = basicUserDetails || {};
  const { phone, alternatePhone, address } = contactInfo || {};
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "F";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            {/* Avatar */}
            <Avatar className="w-24 h-24 border-2 border-primary">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Header Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground text-balance">
                {name}
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                {designation}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="default" className="text-sm">
                  <Building2 className="w-3 h-3 mr-1" />
                  {department}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {employee_code}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-sm font-medium break-all">{email}</p>
                  </div>
                </div>

                {phone && (
                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Phone
                      </p>
                      <p className="text-sm font-medium">{phone}</p>
                    </div>
                  </div>
                )}

                {alternatePhone && (
                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Alt. Phone
                      </p>
                      <p className="text-sm font-medium">{alternatePhone}</p>
                    </div>
                  </div>
                )}

                {address && (
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Address
                      </p>
                      <p className="text-sm font-medium">{address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Personal Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Gender
                  </p>
                  <p className="text-sm font-medium capitalize">
                    {gender || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Member Since
                  </p>
                  <p className="text-sm font-medium">{formatDate(createdAt)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Professional Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Institute Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Institute Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                      Institute Name
                    </p>
                    <h3 className="text-2xl font-bold text-foreground">
                      {institute?.institute_name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Type
                      </p>
                      <p className="text-sm font-medium capitalize">
                        {institute?.institute_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Affiliated
                      </p>
                      <p className="text-sm font-medium">
                        {institute?.is_affiliated ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Email
                      </p>
                      <p className="text-sm font-medium break-all">
                        {institute?.official_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Phone
                      </p>
                      <p className="text-sm font-medium">
                        {institute?.official_phone}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Address
                    </p>
                    <p className="text-sm font-medium">
                      {institute?.address_line1}, {institute?.city},{" "}
                      {institute?.state} {institute?.pincode}
                    </p>
                  </div>

                  {institute?.is_affiliated && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          University
                        </p>
                        <p className="text-sm font-medium">
                          {institute?.affiliation_university}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          Affiliation ID
                        </p>
                        <p className="text-sm font-medium">
                          {institute?.affiliation_id}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Briefcase className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Designation
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {designation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Building2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Department
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <User className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Employee Code
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {employee_code}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Last Updated
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
