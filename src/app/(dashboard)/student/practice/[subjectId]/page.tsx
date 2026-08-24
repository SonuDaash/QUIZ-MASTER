'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Play, Clock, Target, Loader2, Sparkles } from 'lucide-react';
import { getSubjects, getTopics } from '@/lib/firebase/firestore';
import { useAuth } from '@/components/auth-provider';
import type { Subject, Topic } from '@/lib/types';

export default function SubjectPracticeConfigPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function loadSubjectData() {
      try {
        const [allSubjects, allTopics] = await Promise.all([
          getSubjects(),
          getTopics(subjectId),
        ]);
        const found = allSubjects.find(s => s.id === subjectId);
        setSubject(found || { id: subjectId, name: 'Subject Practice', description: null, display_order: 1, category_id: null });
        setTopics(allTopics);
      } catch (err) {
        console.error('Error loading subject details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSubjectData();
  }, [subjectId]);

  const handleStartQuiz = async () => {
    setStarting(true);
    try {
      const res = await fetch('/api/quiz/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          sessionType: 'practice',
          subjectId: subjectId === 'all' ? undefined : subjectId,
          topicId: selectedTopicId === 'all' ? undefined : selectedTopicId,
          difficultyFilter: selectedDifficulty === 'all' ? undefined : selectedDifficulty,
          questionCount: Number(questionCount),
        }),
      });

      const data = await res.json();
      if (data.session?.id) {
        router.push(`/student/quiz/${data.session.id}`);
      } else {
        router.push(`/student/quiz/session_${Date.now()}`);
      }
    } catch (err) {
      console.error('Error starting quiz session:', err);
      router.push(`/student/quiz/session_${Date.now()}`);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/student/practice" className="hover:text-slate-900 flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Subjects
        </Link>
        <span>/</span>
        <span className="font-medium text-slate-900">{subject?.name || 'Practice Drill'}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{subject?.name || 'Subject Practice'}</h1>
          <p className="text-slate-500 mt-1">
            {subject?.description || 'Customizable practice quiz tailored for PABSON competition preparation.'}
          </p>
        </div>
        <Button 
          size="lg" 
          disabled={starting}
          onClick={handleStartQuiz}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto font-semibold cursor-pointer shadow-md"
        >
          {starting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Play className="mr-2 h-5 w-5" />
          )}
          Launch Practice Quiz ({questionCount} Qs)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Configure Quiz Parameters</CardTitle>
            <CardDescription>Select topic, difficulty level, and length</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Topic Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Select Topic</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTopicId('all')}
                  className={`p-3 rounded-lg border text-xs font-medium text-left transition-all ${
                    selectedTopicId === 'all'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  All Topics Combined
                </button>
                {topics.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTopicId(t.id)}
                    className={`p-3 rounded-lg border text-xs font-medium text-left transition-all ${
                      selectedTopicId === t.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Difficulty Level</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'all', label: 'Mixed' },
                  { key: 'easy', label: 'Easy' },
                  { key: 'medium', label: 'Medium' },
                  { key: 'hard', label: 'Hard' },
                ].map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setSelectedDifficulty(d.key)}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                      selectedDifficulty === d.key
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Number of Questions</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                      questionCount === num
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {num} Questions
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice Mode Highlights Card */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="text-lg">Drill Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-slate-600">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Timed Countdown</strong>
                Each question features a 30-second timer matching competition standard.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <Target className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Instant Explanations</strong>
                Learn immediately from detailed solution breakdowns.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Automatic Notebook</strong>
                Incorrect answers are automatically recorded into &quot;My Mistakes&quot;.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
