'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Trophy,
  BookOpen,
  Zap,
  Bell,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Play,
  Info,
  Globe,
  Compass,
  Atom,
  Flame,
  Award,
  BarChart3,
  Shield,
} from 'lucide-react';
import { soundFx } from '@/lib/audio';

export default function LandingPage() {
  // Interactive mini sample question on the hero section
  const [selectedSampleOpt, setSelectedSampleOpt] = useState<string | null>(null);
  const [sampleAnswered, setSampleAnswered] = useState(false);

  const handleSampleChoice = (label: string) => {
    setSelectedSampleOpt(label);
    setSampleAnswered(true);
    if (label === 'C') {
      soundFx.playCorrect();
    } else {
      soundFx.playIncorrect();
    }
  };

  const syllabus = [
    {
      title: 'Academic Curriculum',
      desc: 'Mathematics, Science, English, & Social Studies for Grades 8-10.',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Nepal Parichaya & Heritage',
      desc: 'Geography, National Parks, Constitution, Culture & History of Nepal.',
      icon: Compass,
      color: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      title: 'Science & Technology',
      desc: 'Space Missions, Physics, Genetics, Robotics & Computing.',
      icon: Atom,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Current Affairs & Events',
      desc: 'National & International summits, awards, agreements & leaders.',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Sports & Olympics',
      desc: 'World Cup, Asian Games, National records, trophies & athletes.',
      icon: Trophy,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Audio-Visual Identification',
      desc: 'Faces, landmarks, flags, audio clips, and scientific apparatus.',
      icon: Eye,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  const competitionRounds = [
    { name: 'General Round', time: '30s / Question', icon: BookOpen, tag: 'Accuracy' },
    { name: 'Science Drill', time: '30s / Question', icon: Atom, tag: 'Deduction' },
    { name: 'Audio Visual', time: '25s / Question', icon: Eye, tag: 'Observation' },
    { name: 'Rapid Fire', time: '60s Blitz Sprint', icon: Zap, tag: 'Speed' },
    { name: 'Buzzer Championship', time: '15s Post-Buzz', icon: Bell, tag: 'Reaction' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 space-y-20 pb-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-slate-50 pt-16 pb-20 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Core Value Proposition & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Official PABSON Training Portal 2083
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1e3a5f] leading-[1.1]">
                  Train Smarter. <br />
                  <span className="text-blue-600">Win the Championship.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  The official preparation platform for <strong>PABSON Smart Mind Inter-School Quiz Competition 2083</strong>. Master timed drills, Spacebar buzzer rounds, and full mock championship simulations.
                </p>

                {/* 3 Main CTAs Required */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-[#1e3a5f] hover:bg-[#152840] text-white font-black min-h-[48px] px-8 text-base shadow-md cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      Start Practice <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <Link href="/demo">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white border-transparent font-bold min-h-[48px] px-6 text-base shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <Play className="w-4 h-4 mr-2" /> Try Demo Quiz
                    </Button>
                  </Link>

                  <Link href="/about">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="w-full sm:w-auto text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-semibold min-h-[48px] px-5 text-base cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <Info className="w-4 h-4 mr-2" /> Learn About Format
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1,000+ Verified Questions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Spacebar Buzzer Trainer
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free Public Demo
                  </span>
                </div>
              </div>

              {/* Right Column: Live Interactive Question Showcase */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-xs font-black uppercase text-blue-700 tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500" /> Interactive Sample Question
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono bg-slate-50">
                      Nepal Parichaya
                    </Badge>
                  </div>

                  <p className="text-base font-bold text-slate-900 leading-snug">
                    Which national park in Nepal was the first to be established and is renowned for the conservation of the One-horned Rhinoceros?
                  </p>

                  {/* 4 Clickable Options */}
                  <div className="space-y-2">
                    {[
                      { label: 'A', text: 'Bardia National Park' },
                      { label: 'B', text: 'Sagarmatha National Park' },
                      { label: 'C', text: 'Chitwan National Park' },
                      { label: 'D', text: 'Langtang National Park' },
                    ].map((opt) => {
                      const isCorrect = opt.label === 'C';
                      const isSelected = selectedSampleOpt === opt.label;

                      let optClass =
                        'w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all min-h-[44px] cursor-pointer ';

                      if (sampleAnswered) {
                        if (isCorrect) {
                          optClass += 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                        } else if (isSelected && !isCorrect) {
                          optClass += 'bg-rose-50 border-rose-400 text-rose-900';
                        } else {
                          optClass += 'bg-slate-50 border-slate-200 text-slate-400';
                        }
                      } else {
                        optClass += 'bg-white border-slate-200 text-slate-700 hover:border-blue-500 hover:bg-blue-50/50';
                      }

                      return (
                        <button
                          key={opt.label}
                          disabled={sampleAnswered}
                          onClick={() => handleSampleChoice(opt.label)}
                          className={optClass}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                              {opt.label}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {sampleAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Instant Explanation on Click */}
                  {sampleAnswered && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-1 animate-fade-in">
                      <p className="font-bold text-blue-800">💡 Explanation:</p>
                      <p>
                        Established in 1973 (2030 BS), Chitwan National Park is Nepal’s first national park and a UNESCO World Heritage site.
                      </p>
                    </div>
                  )}

                  <div className="pt-2 text-center">
                    <Link
                      href="/demo"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      Try Full 5-Question Demo Quiz Without Login →
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6 SYLLABUS CATEGORIES SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none font-bold px-3 py-1 text-xs uppercase">
              Curated Curriculum
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">Comprehensive Syllabus Coverage</h2>
            <p className="text-sm sm:text-base text-slate-600">
              Structured in accordance with national secondary education boards and PABSON championship rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {syllabus.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5 COMPETITION ROUNDS SHOWCASE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1e3a5f] rounded-3xl p-8 sm:p-12 text-white space-y-8 shadow-xl">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <Badge className="bg-amber-400 text-slate-950 hover:bg-amber-400 font-extrabold uppercase px-3 py-0.5 text-xs">
                Championship Format
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-black">5 Distinct Competition Rounds</h2>
              <p className="text-xs sm:text-sm text-blue-200">
                Each round trains a critical tournament skill: speed, accuracy, or buzzer reaction.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {competitionRounds.map((r, i) => {
                const RIcon = r.icon;
                return (
                  <div
                    key={r.name}
                    className="p-4 bg-white/10 rounded-2xl border border-white/15 backdrop-blur flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-amber-300">ROUND 0{i + 1}</span>
                        <Badge variant="outline" className="text-[10px] text-white border-white/30">
                          {r.tag}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-base text-white">{r.name}</h4>
                    </div>
                    <div className="text-xs text-blue-200 font-medium pt-2 border-t border-white/10">
                      ⏱️ {r.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* LIVE LEADERBOARD SNIPPET & STATS PREVIEW */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-none font-bold text-xs uppercase">
              Live School Rankings
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              Compete With 200+ Member Schools
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every practice session, rapid fire sprint, and mock tournament earns XP for your school on the global championship leaderboard.
            </p>
            <div className="pt-2">
              <Link href="/leaderboard">
                <Button className="bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold min-h-[44px] px-6 cursor-pointer">
                  <Trophy className="w-4 h-4 mr-2 text-amber-400" /> View Full Leaderboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Card className="border border-slate-200 shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-xs font-bold uppercase text-slate-500">Top Performing Schools</span>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">2083 Season</Badge>
                </div>

                <div className="space-y-3">
                  {[
                    { rank: '🥇', name: 'Little Angels’ School, Lalitpur', score: '3,840 pts', acc: '94% Accuracy' },
                    { rank: '🥈', name: 'St. Xavier’s School, Jawalakhel', score: '3,720 pts', acc: '92% Accuracy' },
                    { rank: '🥉', name: 'Budhanilkantha School, Kathmandu', score: '3,650 pts', acc: '91% Accuracy' },
                  ].map((s) => (
                    <div
                      key={s.name}
                      className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{s.rank}</span>
                        <div>
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-slate-500 text-[11px]">{s.acc}</p>
                        </div>
                      </div>
                      <span className="font-black text-blue-900 font-mono">{s.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900 to-[#1e3a5f] text-white text-center space-y-6 shadow-2xl">
            <h2 className="text-3xl sm:text-5xl font-black">Begin Your Championship Journey</h2>
            <p className="text-blue-200 max-w-xl mx-auto text-sm sm:text-base">
              Try the free demo quiz now without creating an account, or sign in to save your personal mistake notebook and climb the ranks.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/demo">
                <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-8 min-h-[48px] shadow-lg cursor-pointer">
                  Try 5-Question Demo Quiz
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 font-bold px-8 min-h-[48px] cursor-pointer">
                  Create Student Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
