'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Users,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { getQuestions } from '@/lib/firebase/firestore';
import { soundFx } from '@/lib/audio';
import type { Question } from '@/lib/types';

interface Team {
  id: string;
  name: string;
  score: number;
}

export default function StageProjectorView() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedOptionsCount, setRevealedOptionsCount] = useState(4);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [buzzedTeam, setBuzzedTeam] = useState<string | null>(null);

  const [teams, setTeams] = useState<Team[]>([
    { id: 't1', name: 'Team Everest', score: 10 },
    { id: 't2', name: 'Team Annapurna', score: 12 },
    { id: 't3', name: 'Team Lhotse', score: 8 },
    { id: 't4', name: 'Team Makalu', score: 14 },
  ]);

  useEffect(() => {
    async function loadStageQuestions() {
      const data = await getQuestions({});
      if (data.length > 0) {
        setQuestions(data);
      }
    }
    loadStageQuestions();
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 6 && prev > 1) {
            soundFx.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      soundFx.playIncorrect();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Keyboard Stage Controls (Space: Start/Pause, Enter: Reveal, 1-4: Teams, B: Buzzer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsTimerRunning(prev => !prev);
      } else if (e.code === 'Enter') {
        e.preventDefault();
        revealAnswer();
      } else if (e.key === 'ArrowRight') {
        nextQuestion();
      } else if (e.key === 'ArrowLeft') {
        prevQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions, showAnswer]);

  const currentQ = questions[currentIndex];

  const revealAnswer = () => {
    setShowAnswer(true);
    setIsTimerRunning(false);
    soundFx.playCorrect();
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      setTimeLeft(30);
      setIsTimerRunning(false);
      setBuzzedTeam(null);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
      setTimeLeft(30);
      setIsTimerRunning(false);
      setBuzzedTeam(null);
    }
  };

  const updateTeamScore = (teamId: string, delta: number) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, score: Math.max(0, t.score + delta) } : t));
    if (delta > 0) soundFx.playCorrect();
    else soundFx.playIncorrect();
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const options = currentQ?.options || [
    { id: '1', option_label: 'A', option_text: 'Option A', is_correct: true },
    { id: '2', option_label: 'B', option_text: 'Option B', is_correct: false },
    { id: '3', option_label: 'C', option_text: 'Option C', is_correct: false },
    { id: '4', option_label: 'D', option_text: 'Option D', is_correct: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 select-none">
      {/* Top Bar (Stage Header & Timer) */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Badge className="bg-amber-500 text-slate-950 text-xs font-black uppercase px-3 py-1">
            PABSON LIVE STAGE
          </Badge>
          <span className="text-slate-400 font-mono text-sm">
            ROUND 1 · QUESTION {currentIndex + 1} OF {questions.length || 10}
          </span>
        </div>

        {/* Big Circular/Digital Countdown Timer */}
        <div className="flex items-center gap-4">
          <div className={`px-6 py-2 rounded-2xl font-mono text-4xl font-black border-2 transition-all ${
            timeLeft <= 5 ? 'border-red-500 bg-red-950/80 text-red-400 animate-pulse' :
            isTimerRunning ? 'border-blue-500 bg-blue-950/60 text-blue-300' :
            'border-slate-700 bg-slate-900 text-slate-400'
          }`}>
            {timeLeft}s
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsTimerRunning(prev => !prev)}
            className="text-slate-200 border-slate-700 hover:bg-slate-800"
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleFullscreen}
            className="text-slate-400 hover:text-white"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Center Question Area */}
      <div className="max-w-5xl mx-auto w-full py-8 space-y-8">
        {/* Optional Media Image Preview */}
        {currentQ?.media && currentQ.media.length > 0 && currentQ.media[0].file_url && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentQ.media[0].file_url}
              alt="Media question"
              className="max-h-64 object-contain rounded-xl border-4 border-slate-800 shadow-2xl"
            />
          </div>
        )}

        {/* Question Text Box */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-900/90 border-2 border-slate-700 shadow-2xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-100 leading-tight">
            {currentQ?.question_text || 'Loading question for stage presentation...'}
          </h1>
        </div>

        {/* Options Grid (2x2 Big Stage Tiles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.slice(0, revealedOptionsCount).map((opt, idx) => {
            const isCorrect = opt.is_correct;
            let cardStyle = "p-6 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 ";

            if (showAnswer) {
              if (isCorrect) {
                cardStyle += "bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-900/50 scale-[1.02]";
              } else {
                cardStyle += "bg-slate-900/40 border-slate-800 text-slate-600 opacity-40";
              }
            } else {
              cardStyle += "bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600";
            }

            return (
              <div key={opt.id || idx} className={cardStyle}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shrink-0 ${
                  showAnswer && isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-amber-400'
                }`}>
                  {opt.option_label || String.fromCharCode(65 + idx)}
                </div>
                <span className="text-xl sm:text-2xl font-bold flex-1">{opt.option_text}</span>
                {showAnswer && isCorrect && <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
              </div>
            );
          })}
        </div>

        {/* Explanation Reveal */}
        {showAnswer && currentQ?.explanation && (
          <div className="p-4 bg-blue-950/40 border border-blue-800 rounded-xl text-blue-200 text-center animate-fade-in text-base">
            💡 <strong>Explanation:</strong> {currentQ.explanation}
          </div>
        )}
      </div>

      {/* Bottom Controls & Team Scoreboard */}
      <div className="border-t border-slate-800 pt-4 space-y-4">
        {/* Team Score Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {teams.map((t) => (
            <div key={t.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">{t.name}</p>
                <p className="text-2xl font-black text-amber-400">{t.score} pts</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => updateTeamScore(t.id, -1)}
                  className="w-7 h-7 bg-red-950 hover:bg-red-900 text-red-300 font-bold rounded flex items-center justify-center text-xs"
                >
                  -1
                </button>
                <button
                  onClick={() => updateTeamScore(t.id, 2)}
                  className="w-7 h-7 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-bold rounded flex items-center justify-center text-xs"
                >
                  +2
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation & Action Triggers */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={prevQuestion} disabled={currentIndex === 0} className="border-slate-700 text-slate-300">
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button size="sm" variant="outline" onClick={nextQuestion} disabled={currentIndex >= questions.length - 1} className="border-slate-700 text-slate-300">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="flex gap-3 items-center">
            <Button
              onClick={revealAnswer}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 shadow-md"
            >
              <Eye className="w-4 h-4 mr-1.5" /> Reveal Correct Answer (Enter)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
