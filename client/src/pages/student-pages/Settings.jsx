"use client";

import { useState } from "react";
import useAuthContext from "@/hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Phone, RotateCcw, Save } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    name: user?.basicUserDetails?.name || "",
    email: user?.basicUserDetails?.email || "",
    phone: user?.basicUserDetails?.contactInfo?.phone || "",
    alternatePhone: user?.basicUserDetails?.contactInfo?.alternatePhone || "",
    address: user?.basicUserDetails?.contactInfo?.address || "",
  });
  const [originalData] = useState(formData);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData(originalData);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Replace with your actual API endpoint to save changes
      console.log("[v0] Saving user data:", formData);
      // await fetch('/api/faculty/settings', { method: 'PUT', body: JSON.stringify(formData) })
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("[v0] Error saving changes:", error);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2 bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            View and manage your information.
          </p>
          <div className="mt-6 border-b border-border" />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="personal">Personal Details</TabsTrigger>
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
            <TabsTrigger value="institutional">
              Institutional Details
            </TabsTrigger>
          </TabsList>

          {/* Personal Details Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Editable: Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="bg-background border-input"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your personal name
                    </p>
                  </div>

                  {/* Read-only: Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={formData.email}
                        disabled
                        className="bg-muted border-border cursor-not-allowed"
                      />
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-muted">
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V17a2 2 0 01-2 2h-1C9.716 19 3 12.284 3 5z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Editable: Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="bg-background border-input"
                    />
                    <p className="text-xs text-muted-foreground">
                      Primary contact number
                    </p>
                  </div>

                  {/* Editable: Alternate Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Alternate Phone
                    </label>
                    <Input
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="bg-background border-input"
                    />
                    <p className="text-xs text-muted-foreground">
                      Secondary contact number
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Manage your contact details and verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Editable: Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your full address"
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your residential or office address
                  </p>
                </div>

                {/* Read-only: Phone Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Primary Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={formData.phone}
                        disabled
                        className="bg-muted border-border cursor-not-allowed"
                      />
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-muted">
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V17a2 2 0 01-2 2h-1C9.716 19 3 12.284 3 5z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Edit in Personal Details
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Alternate Phone
                    </label>
                    <Input
                      value={formData.alternatePhone}
                      disabled
                      className="bg-muted border-border cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      Edit in Personal Details
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Institutional Details Tab */}
          <TabsContent value="institutional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Institutional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Read-only: Employee Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      student_id <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={user?.student_id || ""}
                        disabled
                        className="bg-muted border-border cursor-not-allowed"
                      />
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-muted">
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V17a2 2 0 01-2 2h-1C9.716 19 3 12.284 3 5z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      System generated ID - cannot be changed
                    </p>
                  </div>

                  {/* Read-only: Department */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={user?.department || ""}
                        disabled
                        className="bg-muted border-border cursor-not-allowed"
                      />
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-muted">
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V17a2 2 0 01-2 2h-1C9.716 19 3 12.284 3 5z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Department cannot be changed
                    </p>
                  </div>

                  {/* Read-only: Institute */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Institute <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={user?.institute?.institute_name || ""}
                        disabled
                        className="bg-muted border-border cursor-not-allowed"
                      />
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-muted">
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V17a2 2 0 01-2 2h-1C9.716 19 3 12.284 3 5z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Institute cannot be changed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}