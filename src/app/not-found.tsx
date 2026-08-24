'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Home, Play, LogIn, ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-blue-600 flex items-center justify-center text-white mx-auto shadow-lg">
          <GraduationCap className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold text-amber-600 uppercase tracking-widest">
            Page Not Found · 404 Error
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Looks Like You Went Off Course!
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The page or question round you are looking for does not exist or has been relocated.
          </p>
        </div>

        <Card className="border border-slate-200 shadow-sm text-left">
          <CardContent className="p-4 space-y-2 text-xs text-slate-600">
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" /> Helpful Shortcuts:
            </p>
            <ul className="space-y-1.5 pl-5 list-disc text-slate-700">
              <li>
                Take the public 5-question demo: <Link href="/demo" className="text-blue-600 font-bold hover:underline">/demo</Link>
              </li>
              <li>
                Read about rules and round formats: <Link href="/about" className="text-blue-600 font-bold hover:underline">/about</Link>
              </li>
              <li>
                Access your student/admin portal: <Link href="/login" className="text-blue-600 font-bold hover:underline">/login</Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Quick Action Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold min-h-[44px] px-6 cursor-pointer">
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
          <Link href="/demo" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full border-slate-300 font-semibold min-h-[44px] px-6 cursor-pointer">
              <Play className="w-4 h-4 mr-2 text-emerald-600" /> Try Demo Quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
