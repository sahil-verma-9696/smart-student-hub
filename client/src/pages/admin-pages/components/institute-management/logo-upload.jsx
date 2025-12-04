import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon } from "lucide-react";

export function LogoUpload({
  currentLogo,
  onUpload,
  onRemove,
  editable = true,
}) {
  const [preview, setPreview] = useState(currentLogo || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!editable) return;

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all
          ${isDragging ? "border-primary bg-primary/5" : "border-border"}
          ${
            editable
              ? "cursor-pointer hover:border-primary/50"
              : "cursor-not-allowed opacity-60"
          }
        `}
        onDragOver={(e) => {
          e.preventDefault();
          if (editable) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => editable && fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
              <img
                src={preview || "/placeholder.svg"}
                alt="Institute logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Logo uploaded
              </p>
              <p className="text-xs text-muted-foreground">
                Click to change or drag a new image
              </p>
            </div>
            {editable && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-3 rounded-full bg-muted">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {editable
                  ? "Drop your logo here or click to browse"
                  : "No logo uploaded"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 2MB (min 200x200px)
              </p>
            </div>
            {editable && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          disabled={!editable}
        />
      </div>
    </div>
  );
}
