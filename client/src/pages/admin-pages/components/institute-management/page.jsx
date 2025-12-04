"use client";

import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  Building2,
  Phone,
  MapPin,
  ImageIcon,
  GraduationCap,
  Save,
  RotateCcw,
} from "lucide-react";

import { AcademicHierarchy } from "./academic-hierarchy";
import { AdminCredentialsSection } from "./admin-credentials-section";
import { ConfigField } from "./config-field";
import {
  instituteFormConfig,
  academicHierarchyConfig,
} from "./ui-config";
import { LogoUpload } from "./logo-upload";
import { initialData } from "./constants";

const iconMap = {
  building: <Building2 className="h-5 w-5" />,
  contact: <Phone className="h-5 w-5" />,
  map: <MapPin className="h-5 w-5" />,
  image: <ImageIcon className="h-5 w-5" />,
};

export function InstituteAdminPage() {
  const [data, setData] = useState(initialData);
  const [verifyingField, setVerifyingField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFieldChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProgramsChange = (programs) => {
    setData((prev) => ({ ...prev, programs }));
  };

  const handleLogoUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setData((prev) => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDepartmentsChange = (departments) => {
    setData((prev) => ({ ...prev, departments }));
  };

  const handleVerify = async (field) => {
    setVerifyingField(field);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setData((prev) => ({
      ...prev,
      verification: {
        ...prev.verification,
        [field]: { verified: true, verifiedAt: new Date().toISOString() },
      },
    }));
    setVerifyingField(null);
  };

  const handleSave = async () => {
    console.log(data, "data");
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const handleReset = () => {
    setData(initialData);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 🔥 Sticky Top Header */}
        <div className="sticky top-0 z-20 bg-background border-b py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Institute Settings
            </h2>
            <p className="text-muted-foreground mt-1">
              View and manage your institute information.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>

            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin border-2 rounded-full border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ===================== TAB VIEW ===================== */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="academic">Academic Details</TabsTrigger>
            <TabsTrigger value="admin">Admin Details</TabsTrigger>
          </TabsList>

          {/* ================================= BASIC DETAILS TAB ================================= */}
          <TabsContent value="basic">
            <div className="space-y-6">
              {instituteFormConfig.map((section) => (
                <Card key={section.id} className="border-border bg-card">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {iconMap[section.icon || "building"]}
                      </div>
                      <div>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {section.id === "branding" ? (
                      <LogoUpload
                        currentLogo={data.logo}
                        onUpload={handleLogoUpload}
                        onRemove={() => handleFieldChange("logo", "")}
                        editable={section.fields[0].editable}
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {section.fields.map((field) => (
                          <ConfigField
                            key={field.id}
                            config={field}
                            value={data[field.id]}
                            onChange={(val) => handleFieldChange(field.id, val)}
                            isVerified={
                              field.verification?.required
                                ? data.verification[field.id]?.verified
                                : undefined
                            }
                            onVerify={
                              field.verification?.required
                                ? () => handleVerify(field.id)
                                : undefined
                            }
                            isVerifying={verifyingField === field.id}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ================================= ACADEMIC TAB ================================= */}
          <TabsContent value="academic">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">
                      Academic Programs
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Manage departments, programs, degrees, branches,
                      specializations, years, semesters, and sections
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AcademicHierarchy
                  programs={data.programs}
                  departments={data.departments}
                  config={academicHierarchyConfig}
                  onProgramsChange={handleProgramsChange}
                  onDepartmentsChange={handleDepartmentsChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================================= ADMIN TAB ================================= */}
          <TabsContent value="admin">
            <AdminCredentialsSection
              data={data}
              onChange={handleFieldChange}
              onVerify={handleVerify}
              verifyingField={verifyingField}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
