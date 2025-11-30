import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react";

export default function ConfigField({
  config,
  value,
  onChange,
  isVerified,
  onVerify,
  isVerifying,
}) {
  const [error, setError] = useState(null);

  const validateField = (val) => {
    if (config.required && !val) {
      setError("This field is required");
      return false;
    }
    if (config.validation?.pattern) {
      const regex = new RegExp(config.validation.pattern);
      if (!regex.test(val)) {
        setError("Invalid format");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      validateField(val);
    }
    onChange(val);
  };

  const renderVerificationButton = () => {
    if (!config.verification?.required) return null;

    if (isVerified) {
      return (
        <Badge
          variant="outline"
          className="bg-success/10 text-success border-success/30 gap-1"
        >
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </Badge>
      );
    }

    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onVerify}
        disabled={isVerifying || !value}
        className="gap-1 border-warning text-warning hover:bg-warning/10 hover:text-warning bg-transparent"
      >
        {isVerifying ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Send className="h-3 w-3" />
        )}
        Verify
      </Button>
    );
  };

  const renderField = () => {
    if (!config.editable) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 bg-muted/50 border border-border rounded-md text-muted-foreground">
            {value || "Not set"}
          </div>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
      );
    }

    switch (config.type) {
      case "textarea":
        return (
          <Textarea
            id={config.id}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={config.placeholder}
            className="bg-input border-border"
          />
        );

      case "select":
        return (
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder={config.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "email":
      case "phone":
        return (
          <div className="flex items-center gap-2">
            <Input
              id={config.id}
              type={config.type === "email" ? "email" : "tel"}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={config.placeholder}
              className="flex-1 bg-input border-border"
            />
            {renderVerificationButton()}
          </div>
        );

      default:
        return (
          <Input
            id={config.id}
            type={config.type}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={config.placeholder}
            className="bg-input border-border"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={config.id}
          className="text-sm font-medium text-foreground"
        >
          {config.label}
          {config.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {!config.editable && (
          <Badge
            variant="secondary"
            className="text-xs bg-muted text-muted-foreground"
          >
            Read-only
          </Badge>
        )}
      </div>
      {renderField()}
      {config.description && (
        <p className="text-xs text-muted-foreground">{config.description}</p>
      )}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
