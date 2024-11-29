"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">InstantVerify.in</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-sm font-medium hover:text-primary">Features</Link>
            <Link href="/#services" className="text-sm font-medium hover:text-primary">Services</Link>
            <Link href="/#pricing" className="text-sm font-medium hover:text-primary">Pricing</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">Contact</Link>
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/#features" className="text-sm font-medium hover:text-primary">Features</Link>
              <Link href="/#services" className="text-sm font-medium hover:text-primary">Services</Link>
              <Link href="/#pricing" className="text-sm font-medium hover:text-primary">Pricing</Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary">Contact</Link>
              <Link href="/login">
                <Button variant="outline" size="sm" className="w-full">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}