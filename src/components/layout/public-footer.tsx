import React from 'react';
import Link from 'next/link';
import { GraduationCap, Shield, BookOpen, Trophy, Sparkles } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Summary */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black shadow">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">SMART MIND</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official training and mock competition platform for the PABSON Smart Mind Inter-School Quiz Championship 2083.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Free Online Practice for Students
            </div>
          </div>

          {/* Quick Practice Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Student Practice</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Practice All Questions (No Login)
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-white transition-colors">
                  Inter-School Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Syllabus Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Information</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Competition Format & Rules
                </Link>
              </li>
              <li>
                <Link href="/about#syllabus" className="hover:text-white transition-colors">
                  Curriculum Breakdown
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-white transition-colors">
                  Participating Schools
                </Link>
              </li>
            </ul>
          </div>

          {/* Coordinator Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Administrators</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quiz coordinators and administrators can log in to manage questions, review submissions, and export exam papers.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" /> Admin Portal Login →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2083 PABSON Smart Mind Quiz Championship. Free student access.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-400 transition-colors">
              Home Practice
            </Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              Rules & Guidelines
            </Link>
            <Link href="/login" className="hover:text-slate-400 transition-colors">
              Admin Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
