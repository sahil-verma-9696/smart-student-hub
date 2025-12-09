"use client";

import { useState } from "react";
import { useGlobalContext } from "@/contexts/global-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Loader2, Download, FileText } from "lucide-react";

export function PortfolioPreview() {
  const { USER_ID, BACKEND_URL } = useGlobalContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    model_type: "gemini",
    template_type: "standard",
    job_description: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!USER_ID) {
      alert("Student ID not found. Please log in again.");
      return;
    }



    if (!formData.job_description.trim()) {
      alert("Please enter a job description.");
      return;
    }

    setIsGenerating(true);
    try {
      const endpoint = `${BACKEND_URL}/student/${USER_ID}/portfolio-proxy`;
      console.log("Submitting portfolio generation request:", {
        url: endpoint,
        data: formData
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server API Error:", response.status, errorText);
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
      }

      // Handle PDF download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `portfolio_${formData.template_type}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating portfolio:", error);
      alert(`Generation Failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Fastfolo
          </CardTitle>
          <CardDescription>
            Generate a custom portfolio tailored to a specific job description.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Model Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="model_type">AI Model</Label>
            <Select
              value={formData.model_type}
              onValueChange={(value) => handleInputChange("model_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Gemini (Cloud)</SelectItem>
                <SelectItem value="local">Local (LLM)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the AI model to use for generating your portfolio content.
            </p>
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template_type">Template Style</Label>
            <Select
              value={formData.template_type}
              onValueChange={(value) => handleInputChange("template_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latex">Premium (LaTeX)</SelectItem>
                <SelectItem value="standard">Standard (HTML)</SelectItem>
                <SelectItem value="ats">ATS Friendly (Text)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose "Premium" for a professional LaTeX design or "ATS Friendly" for automated systems.
            </p>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="job_description">Job Description</Label>
            <Textarea
              id="job_description"
              placeholder="Paste the job description here..."
              className="min-h-[200px]"
              value={formData.job_description}
              onChange={(e) =>
                handleInputChange("job_description", e.target.value)
              }
            />
            <p className="text-xs text-muted-foreground">
              Our AI will analyze this description to tailor your portfolio content.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Portfolio...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate & Download PDF
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
