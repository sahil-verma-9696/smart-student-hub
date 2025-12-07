"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Facebook, Share2 } from "lucide-react";

export default function ShareAchivos() {
  const [logText, setLogText] = useState("Waiting...");
  const [postText, setPostText] = useState("Hello from Main App!");
  const [imageUrls, setImageUrls] = useState("");
  const [useFb, setUseFb] = useState(true);
  const [useX, setUseX] = useState(true);
  const [imageCarousel, setImageCarousel] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const iframeRef = useRef(null);

  const log = (msg) => {
    setLogText((prev) => msg + "\n" + prev);
    console.log("[MainApp]", msg);
  };

  const connect = (platform) => {
    log(`Requesting Login Popup for ${platform}...`);
    iframeRef.current?.contentWindow.postMessage(
      {
        type: "SOCIAL_AGENT_CONNECT",
        payload: { platform },
      },
      "*"
    );
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e) => {
    const fileInput = e.target;
    const files = [];

    if (fileInput?.files.length > 0) {
      log(`Processing ${fileInput.files.length} local images...`);
      for (const file of fileInput.files) {
        const b64 = await fileToBase64(file);
        files.push(b64);
      }
    }

    setImageCarousel(files);
    setCurrentImageIndex(0);
  };

  const triggerAgent = async () => {
    const platforms = [];
    if (useFb) platforms.push("facebook");
    if (useX) platforms.push("x");

    const files = imageCarousel;

    const urls = imageUrls
      .split(",")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length) log(`Found ${urls.length} image URLs...`);

    const command = {
      type: "SOCIAL_AGENT_TRIGGER",
      payload: {
        platforms,
        text: postText,
        images_url: urls,
        files,
      },
    };

    log(`Sending TRIGGER to ${platforms.join(", ")}...`);
    iframeRef.current?.contentWindow.postMessage(command, "*");
  };

  // Listen for agent response
  if (typeof window !== "undefined") {
    window.addEventListener("message", (event) => {
      const msg = event.data;
      if (msg.type === "SOCIAL_AGENT_RESPONSE") {
        const icon = msg.status === "done" ? "✅" : "❌";
        log(`${icon} Finished ${msg.platform}: ${msg.status}`);
        if (msg.status === "error")
          log("Details: " + JSON.stringify(msg.details));
      }
    });
  }

  const nextImage = () => {
    if (imageCarousel.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % imageCarousel.length);
    }
  };

  const prevImage = () => {
    if (imageCarousel.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? imageCarousel.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Share Achievements</h1>
        <p className="text-muted-foreground mb-8">
          Share your achievements on social media platforms
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CENTER: IMAGE CAROUSEL & DESCRIPTION */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Image Display */}
                <div className="relative bg-muted aspect-square flex items-center justify-center overflow-hidden">
                  {imageCarousel.length > 0 ? (
                    <>
                      <img
                        src={
                          imageCarousel[currentImageIndex] || "/placeholder.svg"
                        }
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      {/* Navigation Controls */}
                      {imageCarousel.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                            aria-label="Previous image"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                            aria-label="Next image"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </>
                      )}
                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {imageCarousel.length}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Share2 size={48} className="mx-auto mb-2 opacity-50" />
                      <p>No images selected</p>
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {imageCarousel.length > 1 && (
                  <div className="flex gap-2 p-4 bg-muted/50 overflow-x-auto">
                    {imageCarousel.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded border-2 transition ${
                          currentImageIndex === idx
                            ? "border-primary"
                            : "border-transparent hover:border-muted-foreground"
                        }`}
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description Card */}
            <Card>
              <CardHeader>
                <CardTitle>Post Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={5}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Write what you want to share about your achievement..."
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDEBAR: CONTROLS & SHARE */}
          <div className="space-y-6">
            {/* Image Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Local Files</label>
                  <Input
                    type="file"
                    id="postImages"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload multiple photos
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URLs</label>
                  <Textarea
                    rows={3}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.png"
                    value={imageUrls}
                    onChange={(e) => setImageUrls(e.target.value)}
                    className="text-sm resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Platform Selection Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share On</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="facebook"
                    checked={useFb}
                    onCheckedChange={setUseFb}
                  />
                  <label
                    htmlFor="facebook"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Facebook size={18} className="text-[#4267B2]" />
                    <span>Facebook</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="twitter"
                    checked={useX}
                    onCheckedChange={setUseX}
                  />
                  <label
                    htmlFor="twitter"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="w-4 h-4 bg-black rounded-sm" />
                    <span>X (Twitter)</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Connect Accounts Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connect Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => connect("facebook")}
                  className="w-full bg-[#4267B2] hover:bg-[#365899]"
                >
                  Connect Facebook
                </Button>
                <Button
                  onClick={() => connect("x")}
                  className="w-full bg-black hover:bg-gray-800"
                >
                  Connect X
                </Button>
              </CardContent>
            </Card>

            {/* Post Button */}
            <Button onClick={triggerAgent} size="lg" className="w-full">
              Share Now
            </Button>

            {/* Activity Log Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-black text-green-400 p-3 rounded h-[200px] overflow-y-auto text-xs font-mono">
                  {logText}
                </pre>
              </CardContent>
            </Card>

            {/* Setup Guide Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="./extension.zip"
                  download="extension.zip"
                  className="block text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
                >
                  Download Extension
                </a>
                <p className="text-xs text-muted-foreground">
                  1. Download & Unzip <br />
                  2. Chrome → Extensions → Load Unpacked
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden iframe for agent communication */}
        <div className="hidden">
          <iframe
            ref={iframeRef}
            src="https://corneous-hyperplastic-finnegan.ngrok-free.dev/static/agent_bridge/index.html"
          />
        </div>
      </div>
    </div>
  );
}
