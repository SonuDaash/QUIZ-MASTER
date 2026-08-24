'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, PlayCircle, CheckCircle2, Medal, BrainCircuit, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';

const MOCK_ROUNDS = [
  { id: 1, title: 'GENERAL CURRICULUM ROUND', desc: '10 Questions · Standard Scoring', status: 'available', type: 'standard' },
  { id: 2, title: 'SCIENCE & TECH ACCELERATION', desc: '10 Questions · Intermediate Drills', status: 'available', type: 'standard' },
  { id: 3, title: 'AUDIO / VISUAL MULTIMEDIA', desc: '5 Questions · Image & Sound identification', status: 'available', type: 'av' },
  { id: 4, title: 'RAPID FIRE ROUND', desc: '20 Questions · 60 Seconds blitz sprint', status: 'available', type: 'rapid' },
  { id: 5, title: 'BUZZER ROUND', desc: 'Fastest reaction lockout simulation', status: 'available', type: 'buzzer' },
];

export default function MockCompetitionPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleStartRound = async (round: typeof MOCK_ROUNDS[0]) => {
    if (round.type === 'rapid') {
      router.push('/student/rapid-fire');
    } else if (round.type === 'buzzer') {
      router.push('/student/buzzer');
    } else if (round.type === 'av') {
      router.push('/student/audio-visual');
    } else {
      try {
        const res = await fetch('/api/quiz/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            sessionType: 'mock',
            questionCount: 10,
          }),
        });
        const data = await res.json();
        if (data.session?.id) {
          router.push(`/student/quiz/${data.session.id}`);
        } else {
          router.push(`/student/quiz/mock_${Date.now()}`);
        }
      } catch (err) {
        console.error('Error starting round:', err);
        router.push(`/student/quiz/mock_${Date.now()}`);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-4 pb-20 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-700 rounded-full">
          <Medal className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#1e3a5f] uppercase tracking-wide">
          PABSON Smart Mind
        </h1>
        <h2 className="text-lg text-slate-500 font-medium">Grand Mock Competition Simulation</h2>
      </div>

      <div className="space-y-4">
        {MOCK_ROUNDS.map((round) => (
          <Card key={round.id} className="border-slate-200 hover:border-blue-400 hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-black shrink-0">
                  {round.id}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Round {round.id}</p>
                  <h3 className="font-bold text-lg text-slate-900 leading-snug">
                    {round.title}
                  </h3>
                  <div className="flex items-center text-xs text-slate-500">
                    <BrainCircuit className="w-3.5 h-3.5 mr-1 text-blue-600" />
                    {round.desc}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleStartRound(round)}
                className="bg-[#1e3a5f] hover:bg-[#152840] text-white font-semibold cursor-pointer shrink-0"
              >
                <PlayCircle className="w-4 h-4 mr-1.5" /> Start Round
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
