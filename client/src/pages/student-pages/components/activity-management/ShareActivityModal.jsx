import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    ChevronLeft,
    ChevronRight,
    Facebook,
    Linkedin,
    Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShareActivityModal({ open, onOpenChange, activity }) {
    const [logText, setLogText] = useState("Waiting...");
    const [postText, setPostText] = useState("");
    const [useFb, setUseFb] = useState(true);
    const [useX, setUseX] = useState(true);
    const [useLinkedIn, setUseLinkedIn] = useState(false);

    // Images
    const [imageCarousel, setImageCarousel] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const iframeRef = useRef(null);

    // Pre-fill from activity
    useEffect(() => {
        if (activity && open) {
            setPostText(
                `Excited to share that I participated in "${activity.title}"! 🚀\n\n${activity.description || ""}\n\n#StudentAchievements #SmartStudentHub`
            );

            if (activity.attachments?.length > 0) {
                // Assume attachments have a 'url' property
                setImageCarousel(activity.attachments.map((a) => a.url));
            } else {
                setImageCarousel([]);
            }
            setCurrentImageIndex(0);
            setLogText("Ready to share...");
        }
    }, [activity, open]);

    const log = (msg) => {
        setLogText((prev) => msg + "\n" + prev);
        console.log("[ShareModal]", msg);
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
    // TRIGGER POST
    // ------------------------------------------------------------------
    const triggerAgent = () => {
        const platforms = [];
        if (useFb) platforms.push("facebook");
        if (useX) platforms.push("x");
        if (useLinkedIn) platforms.push("linkedin");

        if (platforms.length === 0) {
            log("Please select at least one platform.");
            return;
        }

        const payload = {
            platforms,
            text: postText,
            images_url: imageCarousel, // Passing URLs directly
            files: [], // If we had base64 files
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
                log(`${icon} ${msg.platform?.toUpperCase()} → ${msg.status}`);

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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Share Activity</DialogTitle>
                    <DialogDescription>
                        Share "{activity?.title}" to your social networks.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* LEFT: PREVIEW & TEXT */}
                    <div className="space-y-4">
                        {/* IMAGE PREVIEW */}
                        <div className="relative bg-muted aspect-video rounded-md flex items-center justify-center overflow-hidden border">
                            {imageCarousel.length > 0 ? (
                                <>
                                    <img
                                        src={imageCarousel[currentImageIndex]}
                                        className="w-full h-full object-contain"
                                        alt="Activity Preview"
                                    />
                                    {imageCarousel.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground p-4">
                                    <Share2 size={32} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No images attached to this activity</p>
                                </div>
                            )}
                        </div>

                        {/* DESCRIPTION */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Post Text</label>
                            <Textarea
                                rows={5}
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                placeholder="Write something nicely..."
                            />
                        </div>
                    </div>

                    {/* RIGHT: CONTROLS */}
                    <div className="space-y-6">

                        {/* PLATFORMS */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Target Platforms</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Checkbox checked={useFb} onCheckedChange={setUseFb} />
                                    <Facebook size={18} className="text-blue-600" />
                                    <span className="text-sm">Facebook</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Checkbox checked={useX} onCheckedChange={setUseX} />
                                    <div className="w-4 h-4 bg-black rounded-sm" />
                                    <span className="text-sm">X (Twitter)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Checkbox checked={useLinkedIn} onCheckedChange={setUseLinkedIn} />
                                    <Linkedin size={18} className="text-blue-700" />
                                    <span className="text-sm">LinkedIn</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ACTIONS */}
                        <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" size="sm" onClick={() => connect("facebook")} className="text-xs">
                                Conn FB
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => connect("x")} className="text-xs">
                                Conn X
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => connect("linkedin")} className="text-xs">
                                Conn LI
                            </Button>
                        </div>

                        <Button onClick={triggerAgent} className="w-full" size="lg">
                            Share Now
                        </Button>

                        {/* LOGS */}
                        <div className="bg-black text-green-400 p-3 rounded h-[120px] overflow-y-auto text-xs font-mono">
                            {logText}
                        </div>

                    </div>
                </div>

                {/* HIDDEN AGENT IFRAME */}
                <iframe
                    ref={iframeRef}
                    className="hidden"
                    src="https://corneous-hyperplastic-finnegan.ngrok-free.dev/static/agent_bridge/index.html"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                ></iframe>

            </DialogContent>
        </Dialog>
    );
}
