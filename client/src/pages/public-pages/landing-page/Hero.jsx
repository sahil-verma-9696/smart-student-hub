import { useState } from "react";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AuthModal from "../AuthModal";

export default function Hero({ onGetStarted }) {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F4ED]">
      <div className="max-w-4xl mx-auto text-center">

        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-[#0B234A] leading-tight">
          Centralized Student Activity <br />
          <span className="text-[#2A4F8E]">Records Management Platform</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
          A unified digital solution for Higher Educational Institutions to
          securely manage, track, and validate student achievements and activities.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Button
            size="lg"
            className="bg-[#2A4F8E] hover:bg-[#1E3A6A] text-white shadow-md px-7 py-6 text-base"
            onClick={onGetStarted}
          >
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-[#2A4F8E] text-[#2A4F8E] hover:bg-[#2A4F8E]/10 px-7 py-6 text-base"
          >
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-10 mt-16 justify-center max-w-md mx-auto border-t border-gray-300 pt-10">
          <div>
            <p className="text-4xl font-bold text-orange-500">100+</p>
            <p className="text-gray-600">HEIs Supported</p>
          </div>

          <div>
            <p className="text-4xl font-bold text-[#1B5E20]">50K+</p>
            <p className="text-gray-600">Students Managed</p>
          </div>
        </div>

      </div>
    </section>
  );
}
