"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { AuthButtons } from '@/components/auth/auth-buttons';
import { useAuth } from '@/lib/hooks/use-auth';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();

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
            {!loading && user && (
              <Link href="/verify" className="text-sm font-medium hover:text-primary">
                Verify
              </Link>
            )}
            <AuthButtons />
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
              {!loading && user && (
                <Link href="/verify" className="text-sm font-medium hover:text-primary">
                  Verify
                </Link>
              )}
              <div className="pt-2">
                <AuthButtons />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}