'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header
      className="
        sticky top-0 z-50 
        border-b border-white/10 
        bg-black/30 backdrop-blur-xl 
        animate-headerDrop
      "
    >
      <nav className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-md">
            <span className="text-white font-semibold text-lg">S</span>
          </div>
          <span className="font-semibold text-xl text-white hidden sm:inline tracking-wide">
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
                text-gray-300 hover:text-white 
                relative group transition 
                tracking-wide
              "
            >
              {item}
              <span className="
                absolute left-0 -bottom-1 h-[2px] w-0 
                bg-teal-400 rounded-full 
                transition-all duration-300 
                group-hover:w-full
              "></span>
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            className="
              absolute top-16 left-0 right-0 
              bg-black/70 backdrop-blur-xl 
              border-b border-white/10 
              p-5 md:hidden flex flex-col gap-6 
              animate-mobileMenu
            "
          >
            {["Features", "About", "Team"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-white text-lg tracking-wide"
              >
                {item}
              </a>
            ))}
          </div>
        )}

      </nav>
    </header>
  )
}
