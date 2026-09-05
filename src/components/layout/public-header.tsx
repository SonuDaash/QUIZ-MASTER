'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Sparkles,
  Menu,
  X,
  BookOpen,
  Trophy,
  Shield,
  Info,
  Lock,
} from 'lucide-react';

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-blue-600 rounded-lg p-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-blue-600 flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg leading-tight tracking-tight text-[#1e3a5f] dark:text-blue-400">
              SMART MIND
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 -mt-0.5">
              PABSON QUIZ 2083
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          <Link
            href="/"
            className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-blue-600 rounded-md px-2 py-1"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            Practice Hub
          </Link>

          <Link
            href="/leaderboard"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-blue-600 rounded-md px-2 py-1"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            Leaderboard
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-blue-600 rounded-md px-2 py-1"
          >
            <Info className="w-4 h-4 text-slate-500" />
            Format & Rules
          </Link>
        </nav>

        {/* Desktop CTA - Admin Login Only */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-700 font-bold text-xs sm:text-sm min-h-[40px] px-4 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4 text-indigo-600" />
              Admin Portal
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 min-h-[44px]"
          >
            <BookOpen className="w-5 h-5 text-blue-600" />
            Practice Hub (Free Drills)
          </Link>
          <Link
            href="/leaderboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 min-h-[44px]"
          >
            <Trophy className="w-5 h-5 text-amber-500" />
            Leaderboard
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 min-h-[44px]"
          >
            <Info className="w-5 h-5 text-slate-500" />
            Format & Rules
          </Link>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full min-h-[44px] text-sm font-bold justify-center border-slate-300">
                <Shield className="w-4 h-4 mr-2 text-indigo-600" /> Admin / Host Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
