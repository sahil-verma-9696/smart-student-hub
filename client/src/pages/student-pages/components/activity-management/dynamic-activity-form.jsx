import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { Plus, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import useActivityForm from "../../hooks/useActivityForm";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateSize);

export default function DynamicActivityForm({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const { activityTypes, loading, submitting, submitActivity } = useActivityForm();

  const handleTypeChange = (typeId) => {
    const type = activityTypes.find((t) => t._id === typeId);
    setSelectedType(type);
    setFormData({});
    setError(null);
  };

  const handleFieldChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [fieldKey]: value,
      },
    }));
  };

  const handleBasicFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    // Validate basic fields
    if (!selectedType) {
      setError("Please select an activity type");
      return false;
    }
    if (!formData.title?.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.location?.trim()) {
      setError("Location is required");
      return false;
    }

    // Validate dynamic fields based on formSchema
    if (selectedType.formSchema && selectedType.formSchema.length > 0) {
      for (const field of selectedType.formSchema) {
        if (field.required) {
          const value = formData.details?.[field.key];
          if (!value || (typeof value === "string" && !value.trim())) {
            setError(`${field.label} is required`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      const activityData = {
        activityTypeId: selectedType._id,
        title: formData.title,
        description: formData.description || "",
        location: formData.location,
        locationType: formData.locationType || "Other",
        details: formData.details || {},
        skills: formData.skills?.split(",").map((s) => s.trim()).filter(Boolean) || [],
        creditsEarned: parseFloat(formData.creditsEarned) || 0,
        externalUrl: formData.externalUrl || "",
        isPublic: formData.isPublic || false,
      };

      await submitActivity(activityData, files);
      
      toast.success("Activity submitted successfully!");
      
      // Reset form
      setFormData({});
      setSelectedType(null);
      setFiles([]);
      setOpen(false);
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Failed to submit activity");
      toast.error(err.message || "Failed to submit activity");
    }
  };

  const renderDynamicField = (field) => {
    const value = formData.details?.[field.key] || "";

    switch (field.type) {
      case "text":
        return (
          <Input
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            required={field.required}
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) => handleFieldChange(field.key, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!value}
              onCheckedChange={(checked) => handleFieldChange(field.key, checked)}
            />
            <Label className="text-sm font-normal">{field.label}</Label>
          </div>
        );

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit New Activity</DialogTitle>
          <DialogDescription>
            Fill in the activity details based on the selected type
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Activity Type Selection */}
          <div className="space-y-2">
            <Label>Activity Type *</Label>
            <Select
              value={selectedType?._id}
              onValueChange={handleTypeChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type._id} value={type._id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{type.name}</span>
                      {type.category && (
                        <span className="text-xs text-muted-foreground">
                          {type.category}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedType?.description && (
              <p className="text-sm text-muted-foreground">
                {selectedType.description}
              </p>
            )}
          </div>

          {selectedType && (
            <>
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={formData.title || ""}
                    onChange={(e) => handleBasicFieldChange("title", e.target.value)}
                    placeholder="Enter activity title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input
                    value={formData.location || ""}
                    onChange={(e) => handleBasicFieldChange("location", e.target.value)}
                    placeholder="Where did this activity take place?"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => handleBasicFieldChange("description", e.target.value)}
                  placeholder="Provide details about the activity"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location Type</Label>
                  <Select
                    value={formData.locationType || "Other"}
                    onValueChange={(val) => handleBasicFieldChange("locationType", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="On-Campus">On-Campus</SelectItem>
                      <SelectItem value="Off-Campus">Off-Campus</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Credits Earned (Min: {selectedType.minCredit}, Max: {selectedType.maxCredit})
                  </Label>
                  <Input
                    type="number"
                    step="0.5"
                    min={selectedType.minCredit}
                    max={selectedType.maxCredit}
                    value={formData.creditsEarned || ""}
                    onChange={(e) => handleBasicFieldChange("creditsEarned", e.target.value)}
                    placeholder="Credits earned"
                  />
                </div>
              </div>

              {/* Dynamic Fields from formSchema */}
              {selectedType.formSchema && selectedType.formSchema.length > 0 && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-sm">
                    {selectedType.name} Specific Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedType.formSchema.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label>
                          {field.label} {field.required && "*"}
                        </Label>
                        {renderDynamicField(field)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Fields */}
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label>Skills Acquired (comma-separated)</Label>
                  <Input
                    value={formData.skills || ""}
                    onChange={(e) => handleBasicFieldChange("skills", e.target.value)}
                    placeholder="e.g., Leadership, Communication, Python"
                  />
                </div>

                <div className="space-y-2">
                  <Label>External URL (optional)</Label>
                  <Input
                    type="url"
                    value={formData.externalUrl || ""}
                    onChange={(e) => handleBasicFieldChange("externalUrl", e.target.value)}
                    placeholder="https://example.com/proof"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Attachments (certificates, proofs, etc.)</Label>
                  <FilePond
                    files={files}
                    onupdatefiles={setFiles}
                    allowMultiple
                    maxFiles={5}
                    name="attachments"
                    labelIdle='Drag & Drop files or <span class="filepond--label-action">Browse</span>'
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.isPublic || false}
                    onCheckedChange={(checked) =>
                      handleBasicFieldChange("isPublic", checked)
                    }
                  />
                  <Label className="text-sm font-normal">
                    Make this activity public (visible to others)
                  </Label>
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedType || submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Activity"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
