'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCcw, BookX, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { getStudentMistakes, resolveStudentMistake } from '@/lib/firebase/firestore';
import type { StudentMistake } from '@/lib/types';

export default function MistakeBook() {
  const { user } = useAuth();
  const [mistakes, setMistakes] = useState<StudentMistake[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMistakes() {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getStudentMistakes(user.id);
      setMistakes(data);
    } catch (err) {
      console.error('Error fetching mistakes:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMistakes();
  }, [user]);

  const handleResolve = async (id: string) => {
    try {
      await resolveStudentMistake(id);
      setMistakes(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error resolving mistake:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Mistakes Vault</h1>
          <p className="text-slate-500 mt-1">Review questions you missed previously and master key concepts.</p>
        </div>
        {mistakes.length > 0 && (
          <Link href="/student/practice">
            <Button className="bg-[#1e3a5f] hover:bg-[#152840] text-white cursor-pointer">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Practice Drill ({mistakes.length} mistakes)
            </Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCcw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          Loading your mistake notebook...
        </div>
      ) : mistakes.length === 0 ? (
        <Card className="bg-slate-50 border-dashed text-center py-16">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-emerald-100 text-emerald-700 rounded-full shadow-sm">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-800">Your Mistake Notebook is Clear!</h3>
              <p className="text-slate-500 max-w-md text-sm">
                Awesome work! Any questions you miss during practice tests will be automatically captured here for targeted review.
              </p>
            </div>
            <Link href="/student/practice">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-2 cursor-pointer">
                Start Practice Drill
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {mistakes.map((m) => (
            <Card key={m.id} className="border-slate-200 hover:border-blue-300 transition-all">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-[10px] font-normal uppercase">
                      Wrong Answer
                    </Badge>
                    <span className="text-xs text-slate-400">
                      Attempted {m.attempt_count || 1} time{(m.attempt_count || 1) > 1 ? 's' : ''}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-base">
                    {m.question?.question_text || `Question ID: ${m.question_id}`}
                  </h4>
                  {m.wrong_answer && (
                    <p className="text-xs text-red-600">
                      Your answer: <span className="font-medium underline">{m.wrong_answer}</span>
                    </p>
                  )}
                  {m.question?.explanation && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-md border">
                      💡 <strong>Explanation:</strong> {m.question.explanation}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResolve(m.id)}
                  className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 shrink-0 cursor-pointer text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Mastered
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
