"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto bg-gradient-to-r from-[#9333EA] to-[#9333EA]/80 
        rounded-2xl p-12 sm:p-16 text-center transform transition-all duration-700 
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} 
        hover:shadow-2xl hover:scale-[1.02]`}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-300">
          Ready to Transform Student Record Management?
        </h2>

        <p className="text-white text-lg mb-8 max-w-2xl mx-auto transition-opacity duration-500">
          Join the revolution in educational technology. Get started with Smart Student Hub today and streamline your institution's student activity management.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white hover:bg-white/90 text-[#9333EA] transition-transform duration-300 hover:scale-105"
          >
            Get Started Today
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-[#9333EA] text-[#9333EA] hover:bg-[#9333EA]/10 transition-transform duration-300 hover:scale-105"
          >
            Schedule Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
