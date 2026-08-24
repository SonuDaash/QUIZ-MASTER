'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Flame, Target, Trophy, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

export default function DailyChallengePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const handleStartDaily = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quiz/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          sessionType: 'daily_challenge',
          questionCount: 5,
        }),
      });
      const data = await res.json();
      if (data.session?.id) {
        router.push(`/student/quiz/${data.session.id}`);
      } else {
        router.push(`/student/quiz/daily_${Date.now()}`);
      }
    } catch (err) {
      console.error('Error starting daily challenge:', err);
      router.push(`/student/quiz/daily_${Date.now()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center text-blue-600 font-semibold text-sm mb-1">
            <Calendar className="mr-2 h-4 w-4" />
            {today}
          </div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] tracking-tight">Daily Challenge</h1>
        </div>
        <div className="flex items-center bg-amber-50 text-amber-700 px-3.5 py-1.5 rounded-full font-bold text-sm border border-amber-200">
          <Flame className="mr-1.5 h-4 w-4 text-amber-500 fill-amber-500" />
          5 Day Streak
        </div>
      </div>

      <Card className="border-2 shadow-lg overflow-hidden">
        <div className="p-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Today&apos;s Featured Drill
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Curriculum & GK Rapid Blitz</h3>
            <p className="text-slate-600 mt-2 text-sm leading-relaxed">
              Test your knowledge across science, geography, history, and general awareness with 5 curated questions. Your score directly boosts your global streak & leaderboard ranking!
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-slate-700 bg-slate-50 px-4 py-3 rounded-xl border">
              <Target className="mr-3 h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-400">Questions</p>
                <p className="font-bold text-sm">5 Questions</p>
              </div>
            </div>
            <div className="flex items-center text-slate-700 bg-slate-50 px-4 py-3 rounded-xl border">
              <Trophy className="mr-3 h-5 w-5 text-amber-500" />
              <div>
                <p className="text-xs text-slate-400">Reward</p>
                <p className="font-bold text-sm">+25 Points</p>
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            disabled={loading}
            onClick={handleStartDaily}
            className="w-full bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold h-12 shadow-md cursor-pointer text-base"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-5 w-5" />
            )}
            Start Today&apos;s Challenge
          </Button>
        </div>
      </Card>
    </div>
  );
}
