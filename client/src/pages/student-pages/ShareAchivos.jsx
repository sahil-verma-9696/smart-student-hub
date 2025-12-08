
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Linkedin,
  Share2,
} from "lucide-react";

export default function ShareAchivos() {
  const [logText, setLogText] = useState("Waiting...");
  const [postText, setPostText] = useState("Hello from Main App!");
  const [imageUrls, setImageUrls] = useState("");
  const [useFb, setUseFb] = useState(true);
  const [useX, setUseX] = useState(true);
  const [useLinkedIn, setUseLinkedIn] = useState(false);
  const [imageCarousel, setImageCarousel] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const iframeRef = useRef(null);

  const log = (msg) => {
    setLogText((prev) => msg + "\n" + prev);
    console.log("[MainApp]", msg);
  };

  // ------------------------------------------------------------------
  // CONNECT ACCOUNT
  // ------------------------------------------------------------------
  const connect = (platform) => {
    log(`Requesting login popup for ${platform}...`);

    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "SOCIAL_AGENT_CONNECT",
        payload: { platform },
      },
      "*"
    );
  };

  // ------------------------------------------------------------------
  // IMAGE HANDLER
  // ------------------------------------------------------------------
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const files = [...e.target.files];
    const base64Images = [];

    for (const file of files) {
      const b64 = await fileToBase64(file);
      base64Images.push(b64);
    }

    log(`Uploaded ${base64Images.length} images`);
    setImageCarousel(base64Images);
    setCurrentImageIndex(0);
  };

  // ------------------------------------------------------------------
  // TRIGGER POST
  // ------------------------------------------------------------------
  const triggerAgent = () => {
    const platforms = [];
    if (useFb) platforms.push("facebook");
    if (useX) platforms.push("x");
    if (useLinkedIn) platforms.push("linkedin");

    const urlList = imageUrls
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);

    const payload = {
      platforms,
      text: postText,
      images_url: urlList,
      files: imageCarousel,
    };

    log(`Triggering post for: ${platforms.join(", ")}`);

    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "SOCIAL_AGENT_TRIGGER",
        payload,
      },
      "*"
    );
  };

  // ------------------------------------------------------------------
  // LISTEN FOR AGENT RESPONSES
  // ------------------------------------------------------------------
  useEffect(() => {
    const handler = (event) => {
      const msg = event.data;
      if (!msg?.type) return;

      if (msg.type === "SOCIAL_AGENT_RESPONSE") {
        const icon = msg.status === "done" ? "✅" : "❌";
        log(`${icon} ${msg.platform.toUpperCase()} → ${msg.status}`);

        if (msg.status === "error") {
          log("Error Details: " + JSON.stringify(msg.details));
        }
      }
    };

    window.addEventListener("message", handler);

    return () => window.removeEventListener("message", handler);
  }, []);

  // ------------------------------------------------------------------
  // CAROUSEL
  // ------------------------------------------------------------------
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
          Share your achievements on social platforms
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-muted aspect-square flex items-center justify-center overflow-hidden">
                  {imageCarousel.length > 0 ? (
                    <>
                      <img
                        src={imageCarousel[currentImageIndex]}
                        className="w-full h-full object-contain"
                      />

                      {/* NAV */}
                      {imageCarousel.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Share2 size={48} className="mx-auto mb-2 opacity-50" />
                      <p>No images selected</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* DESCRIPTION */}
            <Card>
              <CardHeader>
                <CardTitle>Post Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={5}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SECTION */}
          <div className="space-y-6">
            {/* IMAGE INPUT */}
            <Card>
              <CardHeader>
                <CardTitle>Add Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
                <Textarea
                  rows={3}
                  placeholder="https://example.com/img.png"
                  value={imageUrls}
                  onChange={(e) => setImageUrls(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* PLATFORM SELECT */}
            <Card>
              <CardHeader>
                <CardTitle>Share On</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox checked={useFb} onCheckedChange={setUseFb} />
                  <Facebook size={18} className="text-blue-600" />
                  Facebook
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox checked={useX} onCheckedChange={setUseX} />
                  <div className="w-4 h-4 bg-black" />X (Twitter)
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={useLinkedIn}
                    onCheckedChange={setUseLinkedIn}
                  />
                  <Linkedin size={18} className="text-blue-700" />
                  LinkedIn
                </div>
              </CardContent>
            </Card>

            {/* CONNECT */}
            <Card>
              <CardHeader>
                <CardTitle>Connect Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => connect("facebook")}
                  className="w-full bg-blue-600"
                >
                  Connect Facebook
                </Button>
                <Button
                  onClick={() => connect("x")}
                  className="w-full bg-black"
                >
                  Connect X
                </Button>
                <Button
                  onClick={() => connect("linkedin")}
                  className="w-full bg-blue-700"
                >
                  Connect LinkedIn
                </Button>
              </CardContent>
            </Card>

            <Button onClick={triggerAgent} size="lg" className="w-full">
              Share Now
            </Button>

            {/* LOGS */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-black text-green-400 p-3 rounded h-[200px] overflow-y-auto text-xs">
                  {logText}
                </pre>
              </CardContent>
            </Card>

            {/* SETUP */}
            <Card>
              <CardHeader>
                <CardTitle>Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href="/extension.zip"
                  download="extension.zip"
                  className="block text-center bg-green-600 text-white py-2 rounded"
                >
                  Download Extension
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* HIDDEN IFRAME */}
        <iframe
          ref={iframeRef}
          className="hidden"
          src="https://corneous-hyperplastic-finnegan.ngrok-free.dev/static/agent_bridge/index.html"
          sandbox="allow-scripts allow-same-origin allow-popups"
        ></iframe>
      </div>
    </div>
  );
}