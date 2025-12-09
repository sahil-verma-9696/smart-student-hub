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
import { ActivityConfig } from "./constants";
import { useActivityPageContext } from "../../hooks/useActivityPageContext";
import { renderFields } from "./renderFields";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateSize
);

export function ActivityTracker() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [activityType, setActivityType] = useState("default");

  const [customKey, setCustomKey] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [customPairs, setCustomPairs] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  const { postActivity } = useActivityPageContext();

  const form = useForm({
    defaultValues: {},
    shouldUnregister: true,
  });

  const cfg = ActivityConfig[activityType] || ActivityConfig.default;

  const handleAddCustomField = () => {
    if (!customKey.trim() || !customValue.trim()) return;

    setCustomPairs((prev) => [
      ...prev,
      { key: customKey.trim(), value: customValue.trim() },
    ]);

    setCustomKey("");
    setCustomValue("");
  };

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);

      const fieldObj = {};
      customPairs.forEach((pair) => {
        fieldObj[pair.key] = pair.value;
      });

      const payload =
        activityType === "custom"
          ? {
              title: data.title,
              description: data.description,
              activityType: "custom",
              fields: fieldObj,
            }
          : { ...data, activityType };

      await postActivity(payload, files);

      form.reset({});
      setFiles([]);
      setCustomKey("");
      setCustomValue("");
      setCustomPairs([]);
      setActivityType("default");
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">
          Add Activity
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl w-full p-6 max-h-[85vh] overflow-y-auto">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* HEADER AREA */}
          <div className="space-y-3">
            <Label className="font-medium">Activity Type</Label>
            <Select
              value={activityType}
              onValueChange={(v) => {
                setActivityType(v);
                setCustomPairs([]);
                setCustomKey("");
                setCustomValue("");
                form.reset({});
              }}
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
          </div>

          {/* LAYOUT */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT PANEL */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...form.register("title")} />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={4} {...form.register("description")} />
              </div>

              <div className="rounded-lg border p-4 bg-muted/30">
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
            <AnimatePresence>
              <motion.div
                key={activityType}
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 22 }}
                transition={{ duration: 0.25 }}
                className="flex-1 space-y-6 border-l pl-6 max-h-[60vh] overflow-y-auto"
              >
                {/* NON-CUSTOM TYPES */}
                {activityType !== "custom" && activityType !== "default" && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">
                      {activityType.toUpperCase()} Details
                    </h2>

                    {cfg.fields.slice(2).map((field, i) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="space-y-2"
                      >
                        <Label>{field.label}</Label>
                        {renderFields(field, form)}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* CUSTOM TYPE */}
                {activityType === "custom" && (
                  <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
                    <h2 className="text-lg font-semibold">
                      Custom Activity Fields
                    </h2>

                    <div className="space-y-2">
                      <Label>Field Key</Label>
                      <Input
                        placeholder="e.g. github"
                        value={customKey}
                        onChange={(e) => setCustomKey(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Field Value</Label>
                      <Input
                        placeholder="e.g. https://github.com/me"
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                      />
                    </div>

                    <Button type="button" onClick={handleAddCustomField}>
                      + Add Custom Field
                    </Button>

                    {customPairs.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {customPairs.map((pair, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between bg-white p-2 rounded border shadow-sm"
                          >
                            <span className="font-semibold">{pair.key}</span>
                            <span>{pair.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* FOOTER */}
          <DialogFooter>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Posting..." : "Post Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


