"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { env } from "@/env/config";
import { useActivitiesApi } from "@/hooks/useActivitiesApi";
import FileUploader from "@/components/common/file-uploader";
import useAuthContext from "@/hooks/useAuthContext";
import { toast } from "react-hot-toast";

export function ActivityTracker() {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [activityTypes, setActivityTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { createActivity } = useActivitiesApi();

  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    details: {},
    attachments: [],
  });

  useEffect(() => {
    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        const res = await axios.get(`${env.SERVER_URL}/api/activity-types`);
        setActivityTypes(res.data);
      } catch (error) {
        console.error("Failed to fetch activity types", error);
        toast.error("Failed to load activity types");
        setActivityTypes([]); // Ensure empty array on error
      } finally {
        setLoadingTypes(false);
      }
    };

    if (isOpen) {
      fetchTypes();
    }
  }, [isOpen]);

  const selectedType = activityTypes.find((t) => t._id === selectedTypeId);

  const handleInputChange = (key, value, isDetail = false) => {
    if (isDetail) {
      setFormData((prev) => ({
        ...prev,
        details: { ...prev.details, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleFileUpload = (fileData) => {
    const attachment = {
      assetId: fileData.asset_id,
      publicId: fileData.public_id,
      version: fileData.version,
      versionId: fileData.version_id,
      signature: fileData.signature,
      format: fileData.format,
      width: fileData.width,
      height: fileData.height,
      resourceType: fileData.resource_type,
      bytes: fileData.bytes,
      url: fileData.url,
      secureUrl: fileData.secure_url,
      folder: fileData.folder,
      createdAtCloudinary: fileData.created_at,
      tags: fileData.tags,
      originalFilename: fileData.original_filename,
    };
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, attachment],
    }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTypeId) {
      toast.error("Please select an activity type");
      return;
    }
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        activityTypeId: selectedTypeId,
        title: formData.title,
        description: formData.description,
        details: formData.details,
        attachments: formData.attachments,
      };

      await createActivity(payload);

      toast.success("Activity submitted successfully!");
      setIsOpen(false);
      setFormData({
        title: "",
        description: "",
        details: {},
        attachments: [],
      });
      setSelectedTypeId("");
    } catch (error) {
      console.error("Submission error", error);
      const msg = error.response?.data?.message || error.message || "Failed to submit activity";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to determine if a field maps to top-level title/description
  const isTitleField = (key) => key === "title" || key === "projectTitle" || key === "eventName" || key === "courseName" || key === "paperTitle";
  const isDescriptionField = (key) => key === "description" || key === "summary";

  // Effect to sync dynamic fields to top-level if needed
  useEffect(() => {
    if (!selectedType) return;
    
    // If the selected type has a field that acts as title, sync it
    // Actually, better to just let the user input into the dynamic field, 
    // and we copy it to top-level title on submit or change.
    // But for simplicity, let's just render the dynamic form, and if a field matches 'title' concept,
    // we update the top-level title state.
  }, [selectedType]);


  const renderField = (field) => {
    const isTitle = isTitleField(field.key);
    const isDesc = isDescriptionField(field.key);
    
    // If it's a title/desc field, we bind to top-level state, otherwise details
    const value = isTitle ? formData.title : (isDesc ? formData.description : formData.details[field.key] || "");
    const onChange = (val) => handleInputChange(isTitle ? "title" : (isDesc ? "description" : field.key), val, !isTitle && !isDesc);

    if (field.type === "select") {
      return (
        <div className="space-y-2" key={field.key}>
          <Label>{field.label} {field.required && "*"}</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div className="space-y-2" key={field.key}>
          <Label>{field.label} {field.required && "*"}</Label>
          <Textarea
            placeholder={field.placeholder || field.label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        </div>
      );
    }

    if (field.type === "date") {
      return (
        <div className="space-y-2" key={field.key}>
          <Label>{field.label} {field.required && "*"}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onChange(date ? date.toISOString() : "")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    }

    return (
      <div className="space-y-2" key={field.key}>
        <Label>{field.label} {field.required && "*"}</Label>
        <Input
          type={field.type === "number" ? "number" : "text"}
          placeholder={field.placeholder || field.label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      </div>
    );
  };

  if (!isOpen) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add New Activity
          </CardTitle>
          <CardDescription>
            Document your participation in workshops, conferences,
            certifications, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsOpen(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Add New Activity</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Fill in the details of your activity for faculty review and approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Activity Type *</Label>
            <Select
              value={selectedTypeId}
              onValueChange={(val) => {
                setSelectedTypeId(val);
                setFormData({ title: "", description: "", details: {}, attachments: [] }); // Reset form on type change
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {loadingTypes ? (
                  <div className="p-2 flex justify-center"><Loader2 className="h-4 w-4 animate-spin" /></div>
                ) : (
                  activityTypes.map((type) => (
                    <SelectItem key={type._id} value={type._id}>
                      {type.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedType && (
              <p className="text-xs text-muted-foreground">
                {selectedType.description}
              </p>
            )}
          </div>

          {selectedType && (
            <>
              {/* Render Dynamic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedType.formSchema.map((field) => renderField(field))}
              </div>

              {/* Fallback Title/Description if not in schema */}
              {!selectedType.formSchema.some(f => isTitleField(f.key)) && (
                 <div className="space-y-2">
                   <Label>Activity Title *</Label>
                   <Input 
                     value={formData.title} 
                     onChange={(e) => handleInputChange("title", e.target.value)} 
                     required 
                   />
                 </div>
              )}
              
              {!selectedType.formSchema.some(f => isDescriptionField(f.key)) && (
                 <div className="space-y-2">
                   <Label>Description</Label>
                   <Textarea 
                     value={formData.description} 
                     onChange={(e) => handleInputChange("description", e.target.value)} 
                   />
                 </div>
              )}

              <div className="space-y-2">
                <Label>Attachments</Label>
                <FileUploader onUpload={handleFileUpload} />
                {formData.attachments.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span className="text-sm truncate">{file.original_filename || file.public_id}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit for Review
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
