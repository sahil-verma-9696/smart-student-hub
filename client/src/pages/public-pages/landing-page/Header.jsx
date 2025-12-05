"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="
        sticky top-0 z-50 
        bg-[#F8F4ED]/70 backdrop-blur-xl 
        border-b border-[#e4dcd2]
        shadow-[0_2px_12px_rgba(0,0,0,0.05)]
      "
    >
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* SIH Logo + Name */}
        <div className="flex items-center gap-3">
          <h1
            className="w-10 h-10 bg-amber-500 text-white font-extrabold 
               flex items-center justify-center rounded-lg text-2xl"
          >
            S
          </h1>

          <span className="font-semibold text-xl text-[#0B234A] tracking-wide">
            Smart Student Hub
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {["Features", "About", "Team"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="
                text-[#334155] hover:text-[#0B234A]
                relative group transition
                font-medium tracking-wide
              "
            >
              {item}
              <span
                className="
                  absolute left-0 -bottom-1 h-[2px] w-0 
                  bg-[#0B234A] rounded-full 
                  transition-all duration-300 
                  group-hover:w-full
                "
              ></span>
            </a>
          ))}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#0B234A]"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="
          md:hidden bg-[#FFFDF8] 
          border-t border-[#e4dcd2] 
          py-4 px-6 flex flex-col gap-4 shadow-sm
        "
        >
          {["Features", "About", "Team"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[#334155] font-medium hover:text-[#0B234A] transition"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
