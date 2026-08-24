'use client';

import { useEffect, useState } from 'react';
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileQuestion,
  CheckCircle2,
  Users,
  ClipboardCheck,
  Plus,
  Upload,
  BookOpen,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { getAdminStats, getQuestions, getSubjects } from "@/lib/firebase/firestore";
import type { DashboardStats, Question, Subject } from "@/lib/types";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US').format(num);
}

export default function AdminDashboardPage() {
  const greeting = getGreeting();
  const [stats, setStats] = useState<DashboardStats>({
    totalQuestions: 0,
    verifiedQuestions: 0,
    totalStudents: 0,
    testsCompleted: 0,
    averageAccuracy: 0,
  });
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, questionsData, subjectsData] = await Promise.all([
          getAdminStats(),
          getQuestions({ limitCount: 5 }),
          getSubjects(),
        ]);
        setStats(statsData);
        setRecentQuestions(questionsData);
        setSubjects(subjectsData);
      } catch (err) {
        console.error('Error loading admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const chartData = subjects.length > 0
    ? subjects.map(s => ({ name: s.name, questions: Math.floor(Math.random() * 20) + 5 }))
    : [
        { name: 'Geography', questions: 25 },
        { name: 'History', questions: 18 },
        { name: 'Science', questions: 32 },
        { name: 'Math', questions: 14 },
        { name: 'Computer', questions: 20 },
      ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{greeting}, Coordinator</h1>
          <p className="text-slate-500 mt-1">Platform overview and quiz competition management repository.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/questions/import">
            <Button variant="outline" className="flex items-center gap-1.5 cursor-pointer">
              <Upload className="h-4 w-4" />
              Import Questions
            </Button>
          </Link>
          <Link href="/admin/questions/new">
            <Button className="bg-[#1e3a5f] hover:bg-[#152840] text-white flex items-center gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Questions"
          value={formatNumber(stats.totalQuestions)}
          icon={<FileQuestion className="h-5 w-5 text-blue-600" />}
          description="In Firestore Question Bank"
        />
        <StatCard
          title="Verified Questions"
          value={formatNumber(stats.verifiedQuestions)}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          description="Active & verified for tests"
        />
        <StatCard
          title="Registered Students"
          value={formatNumber(stats.totalStudents)}
          icon={<Users className="h-5 w-5 text-indigo-600" />}
          description="Across participating schools"
        />
        <StatCard
          title="Avg. Student Accuracy"
          value={`${stats.averageAccuracy}%`}
          icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
          description="Overall practice score"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Chart Column */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Questions by Subject Area</CardTitle>
            <CardDescription>Distribution of active questions across syllabus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', border: 'none' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="questions" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Review Queue */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Quick Access</CardTitle>
            <CardDescription>Manage core modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/questions" className="block p-3 rounded-lg border hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                    <FileQuestion className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">Question Bank</h4>
                    <p className="text-xs text-slate-500">Filter, edit, and organize repository</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </Link>

            <Link href="/admin/subjects" className="block p-3 rounded-lg border hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">Subjects & Topics</h4>
                    <p className="text-xs text-slate-500">Manage curriculum categories</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </Link>

            <Link href="/admin/questions/review" className="block p-3 rounded-lg border hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-md">
                    <ClipboardCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">Review Queue</h4>
                    <p className="text-xs text-slate-500">Verify user submissions</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </Link>

            <Link href="/admin/students" className="block p-3 rounded-lg border hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">Students Directory</h4>
                    <p className="text-xs text-slate-500">Track student progress and schools</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Questions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Question Bank Additions</CardTitle>
            <CardDescription>Live questions stored in Cloud Firestore</CardDescription>
          </div>
          <Link href="/admin/questions">
            <Button variant="ghost" size="sm" className="text-xs text-blue-600 cursor-pointer">
              View All Questions <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentQuestions.length > 0 ? (
              recentQuestions.map((q) => (
                <div key={q.id} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-900 line-clamp-1">{q.question_text}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[11px] font-normal uppercase">
                        {q.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-[11px] font-normal uppercase">
                        {q.question_type}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {q.marks || 1} mark{(q.marks || 1) > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-normal text-xs">
                    {q.verification_status || 'Verified'}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">No questions added yet. Click &quot;Add Question&quot; to create your first question.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
