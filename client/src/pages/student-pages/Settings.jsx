"use client";

import { useState, useEffect } from "react";
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

export default function Settings() {
  const { user } = useAuthContext();

  const initialData = {
    name: user?.basicUserDetails?.name || "",
    email: user?.basicUserDetails?.email || "",
    phone: user?.basicUserDetails?.contactInfo?.phone || "",
    alternatePhone: user?.basicUserDetails?.contactInfo?.alternatePhone || "",
    address: user?.basicUserDetails?.contactInfo?.address || "",
  };

  const [formData, setFormData] = useState(initialData);
  const [originalData, setOriginalData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("personal");
  const [isSaving, setIsSaving] = useState(false);

  // Update original data when user object becomes available
  useEffect(() => {
    const updated = {
      name: user?.basicUserDetails?.name || "",
      email: user?.basicUserDetails?.email || "",
      phone: user?.basicUserDetails?.contactInfo?.phone || "",
      alternatePhone: user?.basicUserDetails?.contactInfo?.alternatePhone || "",
      address: user?.basicUserDetails?.contactInfo?.address || "",
    };

    setFormData(updated);
    setOriginalData(updated);
  }, [user]);

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
      console.log("Saving user data:", formData);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              Student Settings
            </h1>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2"
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

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full mb-8">
            <TabsTrigger value="personal">Personal Details</TabsTrigger>
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
            <TabsTrigger value="institutional">
              Institutional Details
            </TabsTrigger>
          </TabsList>

          {/* PERSONAL */}
          <TabsContent value="personal">
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
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your personal name
                    </p>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input value={formData.email} disabled />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone *</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  {/* Alt Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Alternate Phone
                    </label>
                    <Input
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTACT */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Manage your contact details</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* ADDRESS */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                  />
                </div>

                {/* SUMMARY ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Primary Phone *
                    </label>
                    <Input value={formData.phone} disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Alternate Phone
                    </label>
                    <Input value={formData.alternatePhone} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* INSTITUTIONAL */}
          <TabsContent value="institutional">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Institutional Information
                </CardTitle>
                <CardDescription>Your institute details</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Student ID *</label>
                    <Input value={user?.student_id || ""} disabled />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department *</label>
                    <Input value={user?.department || ""} disabled />
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
