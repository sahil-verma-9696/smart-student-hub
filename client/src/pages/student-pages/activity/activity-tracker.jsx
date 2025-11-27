"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X } from "lucide-react";

// FilePond imports
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Register plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateSize
);

const activityTypes = [
  { value: "workshop", label: "Workshop/Seminar" },
  { value: "conference", label: "Conference" },
  { value: "certification", label: "Certification" },
  { value: "competition", label: "Competition" },
  { value: "internship", label: "Internship" },
  { value: "research", label: "Research" },
  { value: "community", label: "Community Service" },
  { value: "leadership", label: "Leadership Role" },
  { value: "publication", label: "Publication" },
  { value: "mooc", label: "MOOC / Online Course" },
];

const activitySchema = {
  workshop: [
    { name: "organizer", label: "Organizer", type: "text" },
    { name: "duration", label: "Duration", type: "text" },
  ],
  conference: [
    { name: "organizer", label: "Organizer", type: "text" },
    { name: "location", label: "Location", type: "text" },
  ],
  certification: [
    { name: "issued_by", label: "Issued By", type: "text" },
    { name: "credential_id", label: "Credential ID", type: "text" },
  ],
};

export function ActivityTracker() {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [files, setFiles] = useState([]); // FilePond files
  const [dynamicData, setDynamicData] = useState({});

  const selectedSchema = type ? activitySchema[type] || [] : [];

  const handleSubmit = (e) => {
    e.preventDefault();

    const uploadedFiles = files.map((f) => f.file);

    console.log({
      title,
      type,
      files: uploadedFiles,
      dynamicData,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader>
          <CardTitle>Activity Tracker</CardTitle>
          <CardDescription>
            Log achievements, certifications, events & more
          </CardDescription>
        </CardHeader>
      </Card>
      <DialogTrigger asChild>
        <Button size="sm" className={"w-full"}>Add Activity</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md w-full p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold">Add Activity</DialogTitle>
          <p className="text-xs text-muted-foreground">
            Log achievements, certifications, events & more
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* FLEX LAYOUT */}
          <div className="flex gap-6">

            {/* LEFT SIDE */}
            <div className="w-1/2 space-y-4">
              
              {/* TITLE */}
              <div className="space-y-1">
                <Label>Activity Title *</Label>
                <Input
                  placeholder="e.g., AI Workshop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* FILEPOND UPLOADER */}
              <div className="space-y-1">
                <Label>Media (optional)</Label>

                <FilePond
                  files={files}
                  onupdatefiles={setFiles}
                  allowMultiple={true}
                  allowReorder={true}
                  maxFiles={5}
                  name="files"
                  labelIdle='Drag & Drop or <span class="filepond--label-action">Browse</span>'
                  className="rounded-md"
                />
              </div>

              {/* ACTIVITY TYPE */}
              <div className="space-y-1">
                <Label>Select Activity Type *</Label>
                <Select
                  value={type}
                  onValueChange={(v) => {
                    setType(v);
                    setDynamicData({});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>

                  <SelectContent>
                    {activityTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* RIGHT SIDE CASCADER */}
            {type && (
              <div className="w-1/2 space-y-4 border-l pl-4 animate-in fade-in slide-in-from-left-2">

                <p className="text-sm font-medium text-primary">
                  Details for {activityTypes.find((a) => a.value === type)?.label}
                </p>

                <div className="space-y-4">
                  {selectedSchema.map((field) => (
                    <div key={field.name} className="space-y-1">
                      <Label className="text-xs">{field.label}</Label>

                      {field.type === "text" && (
                        <Input
                          placeholder={field.placeholder}
                          onChange={(e) =>
                            setDynamicData({
                              ...dynamicData,
                              [field.name]: e.target.value,
                            })
                          }
                        />
                      )}

                      {field.type === "textarea" && (
                        <Textarea
                          placeholder={field.placeholder}
                          onChange={(e) =>
                            setDynamicData({
                              ...dynamicData,
                              [field.name]: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* FOOTER */}
          <DialogFooter className="mt-4 gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
