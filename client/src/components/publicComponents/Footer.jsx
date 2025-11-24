"use client";

import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  // Scroll animation
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <footer
      ref={ref}
      className={`
        px-4 py-12 sm:px-6 lg:px-8 border-t border-purple-300/40 
        bg-purple-50 dark:bg-purple-900/20 backdrop-blur-sm
        transition-all duration-700
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="transition-transform duration-500 hover:translate-x-1">
            <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-4">
              Smart Student Hub
            </h3>
            <p className="text-sm text-black dark:text-purple-300/70">
              Centralized digital platform for comprehensive student activity records
            </p>
          </div>

          <div className="transition-transform duration-500 hover:translate-x-1">
            <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-black dark:text-purple-300/70">
              <li><a href="#" className="hover:text-purple-900 dark:hover:text-purple-100 transition">Features</a></li>
              <li><a href="#" className="hover:text-purple-900 dark:hover:text-purple-100 transition">Pricing</a></li>
              <li><a href="#" className="hover:text-purple-900 dark:hover:text-purple-100 transition">Security</a></li>
            </ul>
          </div>

          <div className="transition-transform duration-500 hover:translate-x-1">
            <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-black dark:text-purple-300/70">
              <li><a href="#" className="hover:text-purple-900 dark:hover:text-purple-100 transition">About</a></li>
              <li><a href="#" className="hover:text-purple-900 dark:hover:text-purple-100 transition">Contact</a></li>
              <li><a href="#" className="hover:text-purple-900 dark:hover:text-purple-100 transition">Blog</a></li>
            </ul>
          </div>

          <div className="transition-transform duration-500 hover:translate-x-1">
            <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-black dark:text-purple-300/70">
              <li><a href="#" className="hover:text-purple-900 dark:hover:text-purple-100 transition">Privacy</a></li>
              <li><a href="#" className="hover:text-purple-900 dark:hover:text-purple-100 transition">Terms</a></li>
              <li><a href="#" className="hover:text-purple-900 dark:hover:text-purple-100 transition">Support</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-300/40 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-black dark:text-purple-300/70">
          <p className="hover:text-purple-900 dark:hover:text-purple-100 transition">
            &copy; 2025 Smart Student Hub. All rights reserved.
          </p>
          <p className="hover:text-purple-900 dark:hover:text-purple-100 transition">
            Government of Jammu & Kashmir, Higher Education Department
          </p>
        </div>

      </div>
    </footer>
  );
}
