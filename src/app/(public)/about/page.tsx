import React from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  BookOpen,
  Zap,
  Bell,
  Eye,
  CheckCircle2,
  Users,
  Shield,
  Clock,
  Sparkles,
  Globe,
  Compass,
  Atom,
  Award,
} from 'lucide-react';

export const metadata = {
  title: 'About Smart Mind Quiz Championship 2083 | Rules, Format & Syllabus',
  description: 'Learn about the official Smart Mind Inter-School Quiz Competition format, round structures, syllabus categories, and preparation guidelines.',
};

export default function AboutPage() {
  const rounds = [
    {
      number: 'Round 1',
      title: 'General Curriculum Round',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      time: '30s per question',
      marks: '+2 for correct, 0 for pass',
      desc: 'Fundamental academic questions from Grade 8-10 curriculum including Mathematics, Social Studies, English, and Science.',
    },
    {
      number: 'Round 2',
      title: 'Science & Technology Drill',
      icon: Atom,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      time: '30s per question',
      marks: '+2 for correct, -1 for wrong (direct pass)',
      desc: 'Advanced questions covering Physics, Chemistry, Biology, Space Exploration, Computing & Artificial Intelligence.',
    },
    {
      number: 'Round 3',
      title: 'Audio-Visual Identification',
      icon: Eye,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      time: '25s per question',
      marks: '+4 for direct correct, +2 on bonus pass',
      desc: 'Identify historical personalities, monuments, national flags, geographical landmarks, and scientific diagrams from visual cues.',
    },
    {
      number: 'Round 4',
      title: 'Rapid Fire Blitz',
      icon: Zap,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      time: '60s per team',
      marks: '+2 for each correct in 60 seconds',
      desc: 'High-speed question sprint. Teams answer direct questions as quickly as possible in 60 seconds.',
    },
    {
      number: 'Round 5',
      title: 'Buzzer Championship Round',
      icon: Bell,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      time: '15s after buzz',
      marks: '+2 for correct, -1 for incorrect buzz',
      desc: 'The ultimate decider round. Any team can hit the buzzer. Fast reaction time and accuracy are critical.',
    },
  ];

  const syllabusCategories = [
    { name: 'Nepal Parichaya & History', count: '250+ Questions', icon: Compass, color: 'text-red-600 bg-red-50' },
    { name: 'World Geography & Exploration', count: '200+ Questions', icon: Globe, color: 'text-blue-600 bg-blue-50' },
    { name: 'Science, Space & Technology', count: '300+ Questions', icon: Atom, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Current Affairs & Global Events', count: '180+ Questions', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
    { name: 'Sports, Olympics & Records', count: '160+ Questions', icon: Trophy, color: 'text-indigo-600 bg-indigo-50' },
    { name: 'Literature, Art & Culture', count: '140+ Questions', icon: BookOpen, color: 'text-pink-600 bg-pink-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none font-bold px-3 py-1 text-xs uppercase tracking-wider">
            Official Guidelines & Format
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1e3a5f]">
            Smart Mind Quiz Championship 2083
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            The premier inter-school knowledge competition bringing together student scholars from across Nepal to compete in academic excellence, reaction speed, and multidisciplinary intellect.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link href="/">
              <Button className="bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold min-h-[44px] px-6 cursor-pointer">
                <Zap className="w-4 h-4 mr-2" /> Start Free Practice Drills
              </Button>
            </Link>
          </div>
        </div>

        {/* Competition Round Structure */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">5-Round Competition Structure</h2>
            <p className="text-sm text-slate-500 mt-1">
              Every round tests a unique cognitive ability: recall speed, logical deductions, visual memory, and split-second buzzer instincts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rounds.map((round) => {
              const Icon = round.icon;
              return (
                <Card key={round.number} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500">
                        {round.number}
                      </span>
                      <div className={`p-2 rounded-lg ${round.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900">{round.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs text-slate-600">
                    <p className="leading-relaxed">{round.desc}</p>
                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px] font-semibold text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{round.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>{round.marks}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Syllabus Categories Grid */}
        <div id="syllabus" className="space-y-8 bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Curated Syllabus Topics</h2>
            <p className="text-sm text-slate-500 mt-1">
              Verified question bank developed in accordance with national secondary education standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {syllabusCategories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3.5"
                >
                  <div className={`p-3 rounded-lg ${cat.color} shrink-0`}>
                    <CatIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{cat.name}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{cat.count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits for Students & Coordinators */}
        <div id="coordinators" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Benefits */}
          <Card className="border-blue-200 bg-blue-50/40">
            <CardHeader>
              <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
                <Users className="w-5 h-5" />
                <h3>For Participating Students</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p><strong>Instant Practice Drills:</strong> Practice all questions with instant solutions and explanations.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p><strong>Timed Practice Option:</strong> Test speed under competition pressure with countdown clocks.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p><strong>Comprehensive Syllabus:</strong> Thorough coverage of Nepal Parichaya, Science, History, Math, and Current Affairs.</p>
              </div>
            </CardContent>
          </Card>

          {/* Coordinator Benefits */}
          <Card className="border-indigo-200 bg-indigo-50/40">
            <CardHeader>
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-lg">
                <Shield className="w-5 h-5" />
                <h3>For School Quiz Coordinators</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p><strong>Live Stage Projector View:</strong> Cast high-contrast quiz screens directly to hall projectors with keyboard hotkeys.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p><strong>1-Click Printable PDF Generator:</strong> Instantly generate printed test papers and coordinator solutions.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p><strong>Bulk CSV/JSON Import:</strong> Add custom school questions with automatic format validation.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1e3a5f] to-blue-900 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-black">Ready to Begin Your Championship Training?</h2>
          <p className="text-blue-200 max-w-xl mx-auto text-sm sm:text-base">
            Practice all questions in one attempt right on the home page without requiring any login.
          </p>
          <div className="pt-2 flex justify-center">
            <Link href="/">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-8 min-h-[48px] shadow-lg cursor-pointer">
                Start Practicing Now
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
