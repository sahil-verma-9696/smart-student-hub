import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";

export function ActivityTypeForm({ activityType, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    minCredit: 0,
    maxCredit: 0,
    formSchema: [],
  });

  useEffect(() => {
    if (activityType) {
      setFormData({
        name: activityType.name || "",
        description: activityType.description || "",
        category: activityType.category || "",
        minCredit: activityType.minCredit || 0,
        maxCredit: activityType.maxCredit || 0,
        formSchema: activityType.formSchema || [],
      });
    }
  }, [activityType]);

  const validateForm = () => {
    if (formData.minCredit > formData.maxCredit) {
      toast.error("Minimum credit cannot be greater than maximum credit");
      return false;
    }

    const keys = new Set();
    for (const field of formData.formSchema) {
      if (!field.key || !field.key.trim()) {
        toast.error("All fields must have a key");
        return false;
      }
      if (!field.label || !field.label.trim()) {
        toast.error("All fields must have a label");
        return false;
      }
      
      if (keys.has(field.key)) {
        toast.error(`Duplicate field key found: ${field.key}`);
        return false;
      }
      keys.add(field.key);

      if ((field.type === "select" || field.type === "checkbox")) {
        const validOptions = field.options ? field.options.filter(opt => opt && opt.trim() !== "") : [];
        if (validOptions.length === 0) {
          toast.error(`Field "${field.label}" requires at least one valid option`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Clean up options (remove empty strings)
    const cleanedSchema = formData.formSchema.map(field => ({
        ...field,
        options: field.options ? field.options.filter(opt => opt && opt.trim() !== "") : []
    }));

    onSubmit({ ...formData, formSchema: cleanedSchema });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Add new field to formSchema
  const handleAddField = () => {
    setFormData((prev) => ({
      ...prev,
      formSchema: [
        ...prev.formSchema,
        {
          key: "",
          label: "",
          type: "text",
          required: false,
          placeholder: "",
          options: [],
        },
      ],
    }));
  };

  // Remove field from formSchema
  const handleRemoveField = (index) => {
    setFormData((prev) => ({
      ...prev,
      formSchema: prev.formSchema.filter((_, i) => i !== index),
    }));
  };

  // Update field in formSchema
  const handleFieldChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      formSchema: prev.formSchema.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Add option to select/checkbox field
  const handleAddOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      formSchema: prev.formSchema.map((item, i) =>
        i === index
          ? { ...item, options: [...(item.options || []), ""] }
          : item
      ),
    }));
  };

  // Remove option from select/checkbox field
  const handleRemoveOption = (fieldIndex, optionIndex) => {
    setFormData((prev) => ({
      ...prev,
      formSchema: prev.formSchema.map((item, i) =>
        i === fieldIndex
          ? {
              ...item,
              options: item.options.filter((_, oi) => oi !== optionIndex),
            }
          : item
      ),
    }));
  };

  // Update option value
  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      formSchema: prev.formSchema.map((item, i) =>
        i === fieldIndex
          ? {
              ...item,
              options: item.options.map((opt, oi) =>
                oi === optionIndex ? value : opt
              ),
            }
          : item
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Hackathon, Sports Event"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe this activity type..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minCredit">Min Credit</Label>
              <Input
                id="minCredit"
                type="number"
                min="0"
                placeholder="0"
                value={formData.minCredit}
                onChange={(e) =>
                  handleChange("minCredit", parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxCredit">Max Credit</Label>
              <Input
                id="maxCredit"
                type="number"
                min="0"
                placeholder="0"
                value={formData.maxCredit}
                onChange={(e) =>
                  handleChange("maxCredit", parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Form Fields */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Custom Form Fields</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddField}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.formSchema.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No custom fields added. Click "Add Field" to create dynamic form
              fields for this activity type.
            </p>
          ) : (
            formData.formSchema.map((field, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">
                      Field {index + 1}
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveField(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Field Key *</Label>
                      <Input
                        placeholder="e.g., companyName"
                        value={field.key}
                        onChange={(e) =>
                          handleFieldChange(index, "key", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Field Label *</Label>
                      <Input
                        placeholder="e.g., Company Name"
                        value={field.label}
                        onChange={(e) =>
                          handleFieldChange(index, "label", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Field Type *</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value) =>
                          handleFieldChange(index, "type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Placeholder</Label>
                      <Input
                        placeholder="e.g., Enter company name"
                        value={field.placeholder || ""}
                        onChange={(e) =>
                          handleFieldChange(index, "placeholder", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`required-${index}`}
                      checked={field.required}
                      onCheckedChange={(checked) =>
                        handleFieldChange(index, "required", checked)
                      }
                    />
                    <Label
                      htmlFor={`required-${index}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      Required field
                    </Label>
                  </div>

                  {/* Options for select/checkbox */}
                  {(field.type === "select" || field.type === "checkbox") && (
                    <div className="space-y-2 p-3 bg-muted rounded">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Options *</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddOption(index)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Option
                        </Button>
                      </div>
                      {field.options && field.options.length > 0 ? (
                        <div className="space-y-2">
                          {field.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex gap-2">
                              <Input
                                placeholder={`Option ${optIndex + 1}`}
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(
                                    index,
                                    optIndex,
                                    e.target.value
                                  )
                                }
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveOption(index, optIndex)
                                }
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Click "Add Option" to create choices
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : activityType ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
