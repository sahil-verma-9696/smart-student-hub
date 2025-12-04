import { useState } from "react";
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
import { ActivityConfig } from "./constants";
import { useActivityPageContext } from "../../hooks/useActivityPageContext";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateSize
);

/* ----------------------------------------------------
  Helper: sanitize payload based on current activity config
-----------------------------------------------------*/
function sanitizePayload(data, cfg) {
  const allowedFieldNames = new Set(cfg.fields.map((f) => f.name));

  const trimmed = {};
  Object.entries(data).forEach(([key, value]) => {
    if (allowedFieldNames.has(key)) {
      // optional: skip completely empty values
      if (value !== undefined && value !== null && value !== "") {
        trimmed[key] = value;
      }
    }
  });

  return trimmed;
}

export function ActivityTracker() {
  /***************************************
   * ******** States ********************
   **************************************/
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [activityType, setActivityType] = useState("default");
  const [customFields, setCustomFields] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  /***************************************
   * ******** Custom & Helpers hooks *****
   **************************************/
  const { postActivity } = useActivityPageContext();

  /****************************************************
   * ********** Form Hooks ********************
   ****************************************************/
  const form = useForm({
    defaultValues: {},
    shouldUnregister: true, // let RHF unregister unmounted fields
  });

  const cfg =
    activityType === "custom"
      ? {
          ...ActivityConfig.custom,
          fields: [...ActivityConfig.custom.fields, ...customFields],
        }
      : ActivityConfig[activityType] || ActivityConfig.default;

  const addCustomField = () => {
    const newField = {
      name: `custom_${customFields.length + 1}`,
      label: `Custom Field ${customFields.length + 1}`,
      type: "text",
    };
    setCustomFields((p) => [...p, newField]);
  };

  /****************************************************
   * ********** Handlers ********************
   ****************************************************/

  /** Submit handler */
  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);

      // Trim data so only fields belonging to this cfg remain
      const sanitized = sanitizePayload(data, cfg);

      const payload = {
        ...sanitized,
        activityType, // send selected type to backend
      };

      console.log("Final Payload:", payload);

      // call backend
      await postActivity(payload, files);

      // reset UI
      form.reset({});
      setFiles([]);
      setCustomFields([]);
      setActivityType("default");
      setOpen(false);
    } catch (err) {
      // you can integrate toast here
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const uiGrid =
    activityType === "default"
      ? "grid grid-cols-1 gap-8"
      : "grid grid-cols-1 lg:grid-cols-2 gap-8";

  const handleActivityTypeChange = (v) => {
    setActivityType(v);
    setCustomFields([]);
    // clear form values when switching type so UI also resets
    form.reset({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">
          Add Activity
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full p-6">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {/* GRID SYSTEM */}
          <div className={uiGrid}>
            {/* LEFT PANEL */}
            <div className="space-y-6">
              <Label className="mb-2 block text-sm">Activity Type</Label>
              <Select
                value={activityType}
                onValueChange={handleActivityTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ActivityConfig).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v.label}
                    </SelectItem>
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
                  key={String(activityType) + customFields.length}
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 22 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 border-l pl-6 h-[450px] overflow-y-auto"
                >
                  <h2 className="text-lg font-semibold">
                    {activityType === "custom"
                      ? "Custom Activity Fields"
                      : `${String(activityType).toUpperCase()} Details`}
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
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Posting..." : "Post Activity"}
            </Button>
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
        <Select
          onValueChange={(v) => form.setValue(field.name, v)}
          // RHF: ensure value in form state
          defaultValue={form.getValues(field.name)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
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
