'use client';

import { useEffect, useState } from 'react';
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Zap, Bell, AlertTriangle, Calendar, ArrowRight, Sparkles, Target, Flame } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { getSubjects, getStudentMistakes } from "@/lib/firebase/firestore";
import type { Subject, StudentMistake } from "@/lib/types";

const QUICK_ACCESS = [
  { title: "Practice Mode", desc: "Topic-wise test drills", icon: BookOpen, href: "/student/practice", color: "text-blue-600", bg: "bg-blue-50" },
  { title: "Mock Quiz", desc: "Full competition simulation", icon: Trophy, href: "/student/mock", color: "text-amber-600", bg: "bg-amber-50" },
  { title: "Rapid Fire", desc: "60-second blitz sprint", icon: Zap, href: "/student/rapid-fire", color: "text-purple-600", bg: "bg-purple-50" },
  { title: "Buzzer Round", desc: "Reaction time training", icon: Bell, href: "/student/buzzer", color: "text-rose-600", bg: "bg-rose-50" },
  { title: "My Mistakes", desc: "Revision notebook", icon: AlertTriangle, href: "/student/mistakes", color: "text-orange-600", bg: "bg-orange-50" },
  { title: "Daily Challenge", desc: "Daily 5 questions", icon: Calendar, href: "/student/daily-challenge", color: "text-emerald-600", bg: "bg-emerald-50" },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function StudentDashboardPage() {
  const greeting = getGreeting();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [mistakes, setMistakes] = useState<StudentMistake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [subs, mists] = await Promise.all([
          getSubjects(),
          user ? getStudentMistakes(user.id) : Promise.resolve([]),
        ]);
        setSubjects(subs);
        setMistakes(mists);
      } catch (err) {
        console.error('Error loading student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#1e3a5f] to-blue-800 text-white p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider bg-blue-500/30 px-2.5 py-0.5 rounded-full border border-blue-400/30">
              National Quiz Training 2083
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full">
              <Flame className="w-3.5 h-3.5" /> 5 Day Streak
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            {greeting}, {user?.name || 'Student'}!
          </h1>
          <p className="text-blue-100 text-sm max-w-xl">
            Welcome back to your practice portal. Choose a quiz mode or practice specific syllabus topics.
          </p>
        </div>
        <Link href="/student/practice">
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 shadow-md cursor-pointer shrink-0">
            Start Practice <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* Grid: Progress & Quick Modes */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Progress Card */}
        <Card className="md:col-span-1 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Accuracy</CardTitle>
            <CardDescription>Overall performance across practice drills</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6 pt-2">
            <ProgressRing value={84} size={160} strokeWidth={12} colorClass="text-blue-600" />
            
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="flex flex-col items-center p-2.5 bg-slate-50 rounded-xl border">
                <span className="text-xl font-bold text-slate-900">120</span>
                <span className="text-[11px] text-slate-500 font-medium">Attempted</span>
              </div>
              <div className="flex flex-col items-center p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-xl font-bold text-emerald-700">101</span>
                <span className="text-[11px] text-emerald-600 font-medium">Correct</span>
              </div>
              <div className="flex flex-col items-center p-2.5 bg-rose-50 rounded-xl border border-rose-100">
                <span className="text-xl font-bold text-rose-700">19</span>
                <span className="text-[11px] text-rose-600 font-medium">Mistakes</span>
              </div>
              <div className="flex flex-col items-center p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-xl font-bold text-blue-700">3.4s</span>
                <span className="text-[11px] text-blue-600 font-medium">Avg Speed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Modes Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_ACCESS.map((mode) => {
            const Icon = mode.icon;
            return (
              <Link key={mode.title} href={mode.href} className="block group">
                <Card className="h-full border-slate-200 hover:border-blue-400 hover:shadow-md transition-all">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${mode.bg} ${mode.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {mode.title}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                      </div>
                      <p className="text-xs text-slate-500">{mode.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Subject Wise Practice Drill Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Subject Practice Hub</CardTitle>
            <CardDescription>Select any subject to launch targeted quiz practice</CardDescription>
          </div>
          <Link href="/student/practice">
            <Button variant="ghost" size="sm" className="text-xs text-blue-600">
              View All Subjects <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {subjects.map((sub) => (
              <Link key={sub.id} href={`/student/practice/${sub.id}`}>
                <div className="p-4 rounded-xl border bg-slate-50/50 hover:bg-white hover:border-blue-500 hover:shadow-sm transition-all space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900">{sub.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{sub.description || 'Comprehensive syllabus questions'}</p>
                  <div className="text-[11px] font-semibold text-blue-600 flex items-center pt-1">
                    Practice Now <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
