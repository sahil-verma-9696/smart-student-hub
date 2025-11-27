"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
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

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateSize
);

/* ----------------------------------------------------
 ACTIVITY CONFIG
-----------------------------------------------------*/
export const ActivityConfig = {
  default: {
    label: "Default",
    fields: [
      { name: "title", label: "Title", type: "text", section: "basic" },
      { name: "description", label: "Description", type: "textarea", section: "basic" },
    ],
  },

  hackathon: {
    label: "Hackathon",
    fields: [
      // BASIC
      { name: "title", label: "Title", type: "text", section: "basic" },
      { name: "description", label: "Description", type: "textarea", section: "basic" },

      // DETAILS
      {
        name: "level",
        label: "Level",
        type: "select",
        section: "details",
        options: [
          { label: "College Level", value: "college" },
          { label: "State Level", value: "state" },
          { label: "National Level", value: "national" },
        ],
      },
      {
        name: "participantType",
        label: "Participation",
        type: "radio",
        section: "details",
        options: [
          { label: "Solo", value: "solo" },
          { label: "Team", value: "team" },
        ],
      },
      { name: "deadline", label: "Submission Deadline", type: "date", section: "details" },
      { name: "organizer", label: "Organizer", type: "text", section: "details" },
      { name: "teamMember", label: "Team Member", type: "text", section: "details" },
    ],
  },

  workshop: {
    label: "Workshop",
    fields: [
      // BASIC
      { name: "title", label: "Title", type: "text", section: "basic" },
      { name: "description", label: "Description", type: "textarea", section: "basic" },

      // DETAILS
      { name: "speaker", label: "Speaker", type: "text", section: "details" },
      { name: "duration", label: "Duration", type: "text", section: "details" },
      {
        name: "mode",
        label: "Mode",
        type: "select",
        section: "details",
        options: [
          { label: "Online", value: "online" },
          { label: "Offline", value: "offline" },
        ],
      },
      {
        name: "certificate",
        label: "Certificate Provided",
        type: "checkbox",
        section: "details",
      },
    ],
  },

  internship: {
    label: "Internship",
    fields: [
      // BASIC
      { name: "title", label: "Internship Title", type: "text", section: "basic" },
      { name: "description", label: "Description", type: "textarea", section: "basic" },

      // DETAILS
      { name: "company", label: "Company", type: "text", section: "details" },
      { name: "role", label: "Role", type: "text", section: "details" },
      { name: "duration", label: "Duration", type: "text", section: "details" },
      { name: "startDate", label: "Start Date", type: "date", section: "details" },
      { name: "endDate", label: "End Date", type: "date", section: "details" },
      {
        name: "paid",
        label: "Paid Internship",
        type: "radio",
        section: "details",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
    ],
  },

  certification: {
    label: "Certification",
    fields: [
      { name: "title", label: "Certification Name", type: "text", section: "basic" },
      { name: "description", label: "Description", type: "textarea", section: "basic" },

      { name: "issuedBy", label: "Issued By", type: "text", section: "details" },
      { name: "credentialId", label: "Credential ID", type: "text", section: "details" },
      { name: "issueDate", label: "Issue Date", type: "date", section: "details" },
      {
        name: "validity",
        label: "Valid For (Months)",
        type: "number",
        section: "details",
      },
    ],
  },

  research: {
    label: "Research",
    fields: [
      { name: "title", label: "Research Title", type: "text", section: "basic" },
      { name: "abstract", label: "Abstract", type: "textarea", section: "basic" },

      { name: "supervisor", label: "Supervisor", type: "text", section: "details" },
      { name: "domain", label: "Domain", type: "text", section: "details" },
      {
        name: "published",
        label: "Published",
        type: "checkbox",
        section: "details",
      },
      { name: "publishDate", label: "Publish Date", type: "date", section: "details" },
    ],
  },

  publication: {
    label: "Publication",
    fields: [
      { name: "title", label: "Paper Title", type: "text", section: "basic" },
      { name: "abstract", label: "Abstract", type: "textarea", section: "basic" },

      { name: "journal", label: "Journal/Conference", type: "text", section: "details" },
      {
        name: "indexing",
        label: "Indexing",
        type: "select",
        section: "details",
        options: [
          { label: "Scopus", value: "scopus" },
          { label: "SCI", value: "sci" },
          { label: "UGC", value: "ugc" },
        ],
      },
      { name: "doi", label: "DOI", type: "text", section: "details" },
      { name: "year", label: "Publication Year", type: "number", section: "details" },
    ],
  },

  leadership: {
    label: "Leadership",
    fields: [
      { name: "title", label: "Position", type: "text", section: "basic" },
      { name: "description", label: "Role Description", type: "textarea", section: "basic" },

      { name: "club", label: "Club / Organization", type: "text", section: "details" },
      { name: "duration", label: "Duration", type: "text", section: "details" },
      {
        name: "responsibilities",
        label: "Responsibilities",
        type: "textarea",
        section: "details",
      },
    ],
  },

  community: {
    label: "Community Service",
    fields: [
      { name: "title", label: "Activity Title", type: "text", section: "basic" },
      { name: "description", label: "Description", type: "textarea", section: "basic" },

      { name: "hours", label: "Service Hours", type: "number", section: "details" },
      { name: "location", label: "Location", type: "text", section: "details" },
      {
        name: "impact",
        label: "Impact Summary",
        type: "textarea",
        section: "details",
      },
    ],
  },

  conference: {
    label: "Conference",
    fields: [
      { name: "title", label: "Conference Title", type: "text", section: "basic" },
      { name: "description", label: "Description", type: "textarea", section: "basic" },

      { name: "location", label: "Location", type: "text", section: "details" },
      { name: "attendedOn", label: "Attended On", type: "date", section: "details" },
      {
        name: "participationType",
        label: "Participation",
        type: "select",
        section: "details",
        options: [
          { label: "Attendee", value: "attendee" },
          { label: "Speaker", value: "speaker" },
          { label: "Panelist", value: "panelist" },
        ],
      },
    ],
  },

  competition: {
    label: "Competition",
    fields: [
      { name: "title", label: "Competition Name", type: "text", section: "basic" },
      { name: "description", label: "Description", type: "textarea", section: "basic" },

      { name: "rank", label: "Rank / Position", type: "number", section: "details" },
      { name: "category", label: "Category", type: "text", section: "details" },
      {
        name: "teamSize",
        label: "Team Size",
        type: "number",
        section: "details",
      },
    ],
  },

  custom: {
    label: "Custom",
    fields: [
      { name: "title", label: "Title", type: "text", section: "basic" },
      { name: "description", label: "Description", type: "textarea", section: "basic" },
      // user-added dynamic fields will be appended here
    ],
  },
};


export function ActivityTracker() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [activityType, setActivityType] = useState("default");

  const [customFields, setCustomFields] = useState([]);

  const form = useForm();
  const cfg =
    activityType === "custom"
      ? { ...ActivityConfig.custom, fields: [...ActivityConfig.custom.fields, ...customFields] }
      : ActivityConfig[activityType];

  const addCustomField = () => {
    const newField = {
      name: `custom_${customFields.length + 1}`,
      label: `Custom Field ${customFields.length + 1}`,
      type: "text",
    };
    setCustomFields((p) => [...p, newField]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">Add Activity</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full p-6">
        <form onSubmit={form.handleSubmit((d) => console.log(d))}>
          {/* GRID SYSTEM */}
          <div className={
            activityType === "default"
              ? "grid grid-cols-1 gap-8"
              : "grid grid-cols-1 lg:grid-cols-2 gap-8"
          }>
            
            {/* LEFT PANEL */}
            <div className="space-y-6">
              <Label className="mb-2 block text-sm">Activity Type</Label>
              <Select
                value={activityType}
                onValueChange={(v) => {
                  setActivityType(v);
                  setCustomFields([]);
                }}
              >
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ActivityConfig).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* BASE FIELDS */}
              {cfg.fields.slice(0, 2).map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label}</Label>
                  {renderField(field, form)}
                </div>
              ))}

              {/* FILE UPLOAD */}
              <div className="rounded-lg border p-3">
                <FilePond
                  files={files}
                  onupdatefiles={setFiles}
                  allowMultiple
                  maxFiles={5}
                  name="media"
                  className="w-full"
                  labelIdle='📁 Drag & Drop or <span class="filepond--label-action">Browse</span>'
                />
              </div>
            </div>

            {/* RIGHT PANEL */}
            <AnimatePresence mode="popLayout">
              {activityType !== "default" && (
                <motion.div
                  key={activityType + customFields.length}
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 22 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 border-l pl-6 h-[450px] overflow-y-auto"
                >
                  <h2 className="text-lg font-semibold">
                    {activityType === "custom"
                      ? "Custom Activity Fields"
                      : `${activityType.toUpperCase()} Details`}
                  </h2>

                  {/* RIGHT PANEL FIELDS */}
                  {cfg.fields.slice(2).map((field, i) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.18 }}
                      className="space-y-2"
                    >
                      <Label>{field.label}</Label>
                      {renderField(field, form)}
                    </motion.div>
                  ))}

                  {/* CUSTOM ADD FIELD BUTTON */}
                  {activityType === "custom" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCustomField}
                    >
                      + Add Field
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" className="w-full">Save Activity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------------------------------
 UNIVERSAL FIELD RENDERER
-----------------------------------------------------*/
function renderField(field, form) {
  const common = form.register(field.name);

  switch (field.type) {
    case "text":
    case "number":
      return <Input type={field.type} {...common} />;
    case "textarea":
      return <Textarea rows={4} {...common} />;
    case "select":
      return (
        <Select onValueChange={(v) => form.setValue(field.name, v)}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "radio":
      return (
        <div className="space-y-1">
          {field.options?.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input type="radio" value={opt.value} {...common} />
              {opt.label}
            </label>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-2">
          <input type="checkbox" {...common} />
          {field.label}
        </label>
      );
    case "date":
      return <Input type="date" {...common} />;
    default:
      return <div className="text-red-500">Unknown field</div>;
  }
}
