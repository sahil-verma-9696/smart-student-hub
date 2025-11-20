'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3b82f6] rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <span className="font-semibold text-xl text-foreground hidden sm:inline">Smart Student Hub</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition">Features</a>
          <a href="#problem" className="text-muted-foreground hover:text-foreground transition">About</a>
          <a href="#team" className="text-muted-foreground hover:text-foreground transition">Team</a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border p-4 md:hidden flex flex-col gap-4">
            <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
            <a href="#problem" className="text-muted-foreground hover:text-foreground">About</a>
            <a href="#team" className="text-muted-foreground hover:text-foreground">Team</a>
          </div>
        )}
      </nav>
    </header>
  )
}
