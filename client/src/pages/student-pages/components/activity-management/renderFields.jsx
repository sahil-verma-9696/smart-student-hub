import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import React from "react";

export function renderFields(field, form) {
  const { register, getValues, setValue } = form;

  switch (field.type) {
    // ---------------------------
    // BASIC INPUTS
    // ---------------------------
    case "text":
    case "number":
      return <Input type={field.type} {...register(field.name)} />;

    case "textarea":
      return <Textarea rows={4} {...register(field.name)} />;

    case "date":
      return <Input type="date" {...register(field.name)} />;

    // ---------------------------
    // SELECT INPUT
    // ---------------------------
    case "select":
      return (
        <Select
          onValueChange={(v) => setValue(field.name, v)}
          defaultValue={getValues(field.name)}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || "Select"} />
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

    // ---------------------------
    // RADIO INPUT
    // ---------------------------
    case "radio":
      return (
        <div className="space-y-2">
          {field.options?.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input type="radio" value={opt.value} {...register(field.name)} />
              {opt.label}
            </label>
          ))}
        </div>
      );

    // ---------------------------
    // TAGS (Skill Input)
    // like hackathon_skill = ["python", "js"]
    // ---------------------------
    case "tags":
      return <TagsInput field={field} form={form} />;

    // ---------------------------
    // UNKNOWN TYPE
    // ---------------------------
    default:
      return (
        <div className="text-red-500">Unknown field type: {field.type}</div>
      );
  }
}

function TagsInput({ field, form }) {
  const { getValues, setValue } = form;
  const values = getValues(field.name) || [];
  const [input, setInput] = React.useState("");

  const addTag = () => {
    if (!input.trim()) return;
    const newTags = [...values, input.trim()];
    setValue(field.name, newTags);
    setInput("");
  };

  const removeTag = (tag) => {
    const newTags = values.filter((t) => t !== tag);
    setValue(field.name, newTags);
  };

  return (
    <div className="space-y-2">
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {values.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <X
              size={12}
              className="cursor-pointer"
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>

      {/* Add new tag */}
      <div className="flex gap-2">
        <Input
          value={input}
          placeholder={field.placeholder || "Add skill..."}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-1 rounded bg-primary text-white"
        >
          Add
        </button>
      </div>
    </div>
  );
}
