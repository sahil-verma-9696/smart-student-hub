"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AuthModal from '@/components/publicComponents/AuthModal';

export default function Hero({ onGetStarted }) {
  const [authOpen, setAuthOpen] = useState(false);

  // ------------------- Scroll Animation Setup -------------------
  const sectionsRef = useRef([]);
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => [...prev, entry.target.id]);
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionsRef.current.forEach((sec) => sec && observer.observe(sec));
    return () => observer.disconnect();
  }, []);
  // --------------------------------------------------------------

  return (
    <section
      className="relative px-4 py-20 sm:px-6 lg:px-8 overflow-hidden 
      bg-gradient-to-b from-purple-50 via-purple-100/50 to-purple-200/40
      dark:from-purple-900/20 dark:via-purple-900/10 dark:to-purple-900/30"
      id="hero-section"
      ref={(el) => (sectionsRef.current[0] = el)}
    >
      <div className="max-w-7xl mx-auto">

        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-700 
          ${visible.includes("hero-section") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >

          {/* Left Content */}
          <div className="space-y-6">

            <div className="inline-block transition-all duration-300 hover:scale-105">
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 
              text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50">
                Government Initiative • J&K Higher Education
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight transition-all duration-500 hover:scale-[1.01]">
              Centralized Student Activity{" "}
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 
              hover:bg-purple-200 dark:hover:bg-purple-900/50 px-2 py-1 rounded-lg transition-all duration-300">
                Records Platform
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Smart Student Hub revolutionizes how Higher Educational Institutions manage comprehensive
              student activity records. A unified digital platform designed for the Government of Jammu
              and Kashmir's Higher Education Department.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">

              <Button
                size="lg"
                className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 
                hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-transform duration-300 hover:scale-105"
                onClick={onGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="transition-transform duration-300 hover:scale-105"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
              <div className="transition-all duration-300 hover:scale-105">
                <p className="text-3xl font-bold text-foreground">100+</p>
                <p className="text-sm text-muted-foreground">HEIs Supported</p>
              </div>
              <div className="transition-all duration-300 hover:scale-105">
                <p className="text-3xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Students Managed</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div
            className="relative h-96 sm:h-full bg-gradient-to-br from-purple-100/40 to-purple-200/40 
            dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-border flex items-center 
            justify-center transition-transform duration-500 hover:scale-[1.03] hover:shadow-2xl"
          >
            <div className="text-center space-y-4">
              <div className="inline-block px-6 py-3 rounded-lg bg-purple-200/40 border border-purple-300/40 
              dark:bg-purple-900/30 dark:border-purple-700/40 transition-all duration-300 hover:scale-105">
                <p className="text-sm font-semibold bg-purple-100 dark:bg-purple-900/30 
                text-purple-700 dark:text-purple-300 px-3 py-1 rounded-lg">
                  Platform Features
                </p>
              </div>
              <p className="text-muted-foreground">Comprehensive Activity Tracking</p>
            </div>
          </div>

          {/* Modal */}
          <AuthModal open={authOpen} onOpenChange={setAuthOpen} />

        </div>
      </div>
    </section>
  );
}
