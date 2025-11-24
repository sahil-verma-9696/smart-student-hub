"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from '@/components/ui/card';
import { BarChart3, Users, Lock, Zap, FileText, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Centralized Management',
    description: 'Manage all student records from a single unified platform across multiple HEIs'
  },
  {
    icon: BarChart3,
    title: 'Comprehensive Analytics',
    description: 'Real-time insights and detailed reports on student activities and performance'
  },
  {
    icon: Lock,
    title: 'Secure & Compliant',
    description: 'Government-grade security with full data privacy and compliance standards'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Instant synchronization across all institutions with live data tracking'
  },
  {
    icon: FileText,
    title: 'Digital Records',
    description: 'Complete digitization of student activity records for easy access and archival'
  },
  {
    icon: CheckCircle,
    title: 'Verification Ready',
    description: 'Built-in verification workflows for seamless validation and certification'
  }
];

export default function Features() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Scroll Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className={`px-4 py-20 sm:px-6 lg:px-8 
      bg-purple-50 dark:bg-purple-900/20 transition-all duration-700
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
    >
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Everything you need to streamline student activity management across your institution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 border-border bg-white/60 dark:bg-gray-900/40
                backdrop-blur-sm hover:shadow-xl hover:-translate-y-2 
                transition-all duration-500 rounded-2xl hover:border-purple-400/70"
              >
                <div className="inline-block p-3 rounded-lg bg-purple-200/40 dark:bg-purple-800/40 mb-6 transition-transform duration-300 hover:scale-110">
                  <Icon className="w-6 h-6 text-purple-700 dark:text-purple-300" />
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
