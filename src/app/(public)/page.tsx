'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  BookOpen,
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Clock,
  Volume2,
  VolumeX,
  Compass,
  Atom,
  Award,
  Layers,
  Flame,
  Check,
  ChevronRight,
  Play,
  Pause,
  Target,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  Keyboard,
  Share2,
} from 'lucide-react';
import { soundFx } from '@/lib/audio';
import { getQuestions } from '@/lib/firebase/firestore';
import { COMPREHENSIVE_QUESTION_BANK, type PracticeQuestion } from '@/lib/data/default-questions';

type TrainingMode = 'general' | 'rapid' | 'buzzer' | 'audiovisual' | 'mock';

interface AnswerRecord {
  selectedOptionLabel: string | null;
  isCorrect: boolean;
  timeSpentSec: number;
  xpEarned: number;
}

export default function HomePage() {
  // Master Question Bank
  const [allQuestions, setAllQuestions] = useState<PracticeQuestion[]>(COMPREHENSIVE_QUESTION_BANK);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [trainingMode, setTrainingMode] = useState<TrainingMode>('general');

  // Practice State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: AnswerRecord }>({});
  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // HUD & Gamification Stats
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [dailyGoal] = useState(10); // Target 10 questions/day

  // Timer & Audio Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timerActive, setTimerActive] = useState(true);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);

  // Load questions from Firestore + default bank
  useEffect(() => {
    async function loadFirestoreQuestions() {
      try {
        const firestoreQs = await getQuestions({});
        if (firestoreQs && firestoreQs.length > 0) {
          const mappedFirestore: PracticeQuestion[] = firestoreQs.map((fq) => ({
            id: fq.id,
            question_text: fq.question_text,
            category:
              fq.subject_id === 'subj_sci'
                ? 'Science'
                : fq.subject_id === 'subj_geo'
                ? 'Geography'
                : fq.subject_id === 'subj_hist'
                ? 'History'
                : fq.subject_id === 'subj_math'
                ? 'Mathematics'
                : fq.subject_id === 'subj_comp'
                ? 'Computer & Tech'
                : fq.subject_id === 'subj_ca'
                ? 'Current Affairs'
                : 'General Knowledge',
            subject_id: fq.subject_id,
            difficulty: (fq.difficulty as any) || 'easy',
            time_limit: fq.time_limit || 30,
            explanation: fq.explanation || 'Official verified answer for the National Inter-School Quiz syllabus.',
            marks: fq.marks || 1,
            question_options:
              ((fq as any).question_options || fq.options) &&
              ((fq as any).question_options || fq.options).length > 0
                ? ((fq as any).question_options || fq.options).map((opt: any, idx: number) => ({
                    id: opt.id || `opt_${idx}`,
                    option_label: (opt.option_label || String.fromCharCode(65 + idx)) as 'A' | 'B' | 'C' | 'D',
                    option_text: opt.option_text,
                    is_correct: !!opt.is_correct,
                  }))
                : [
                    { id: '1', option_label: 'A' as const, option_text: 'Option A', is_correct: true },
                    { id: '2', option_label: 'B' as const, option_text: 'Option B', is_correct: false },
                  ],
          }));

          const existingIds = new Set(mappedFirestore.map((q) => q.id));
          const combined = [
            ...mappedFirestore,
            ...COMPREHENSIVE_QUESTION_BANK.filter((q) => !existingIds.has(q.id)),
          ];
          setAllQuestions(combined);
        }
      } catch (err) {
        console.error('Error fetching questions, using built-in bank:', err);
      }
    }
    loadFirestoreQuestions();
  }, []);

  // Filter questions based on Mode and Category
  const activeQuestions = useMemo(() => {
    let list = allQuestions;

    if (trainingMode === 'audiovisual') {
      list = list.filter((q) => !!q.image_url || q.category === 'Audio-Visual');
      if (list.length === 0) list = allQuestions.slice(0, 5);
    } else if (trainingMode === 'rapid') {
      list = list.slice(0, 15);
    } else if (trainingMode === 'buzzer') {
      list = list.slice(0, 20);
    } else if (trainingMode === 'mock') {
      list = list.slice(0, 20);
    }

    if (selectedCategory !== 'All' && trainingMode === 'general') {
      list = list.filter((q) => q.category === selectedCategory);
    }

    return list.length > 0 ? list : allQuestions;
  }, [allQuestions, selectedCategory, trainingMode]);

  const currentQ = activeQuestions[currentIndex] || activeQuestions[0];

  // Set time limit according to mode
  const getModeTimeLimit = useCallback(
    (q: PracticeQuestion) => {
      if (trainingMode === 'rapid') return 15;
      if (trainingMode === 'buzzer') return 10;
      return q?.time_limit || 30;
    },
    [trainingMode]
  );

  // Synchronize selection state when question changes
  useEffect(() => {
    if (!currentQ) return;
    const prevAnswer = userAnswers[currentQ.id];
    if (prevAnswer) {
      setSelectedOptionLabel(prevAnswer.selectedOptionLabel);
      setIsAnswerSubmitted(true);
    } else {
      setSelectedOptionLabel(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(getModeTimeLimit(currentQ));
    }
  }, [currentIndex, currentQ, userAnswers, getModeTimeLimit]);

  // Live Countdown Timer
  useEffect(() => {
    if (!timerActive || isAnswerSubmitted || isTimerPaused || isCompleted) return;

    if (timeLeft <= 0) {
      // Time expired: auto submit as incorrect
      handleSubmitAnswer(null, true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 5 && prev > 1 && soundEnabled) {
          soundFx.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerActive, isAnswerSubmitted, isTimerPaused, isCompleted, soundEnabled]);

  // Submit Answer Logic
  const handleSubmitAnswer = useCallback(
    (chosenLabel: string | null, timedOut = false) => {
      if (isAnswerSubmitted || !currentQ) return;

      const chosenOption = currentQ.question_options.find((o) => o.option_label === chosenLabel);
      const isCorrect = chosenOption ? !!chosenOption.is_correct : false;
      const timeSpent = getModeTimeLimit(currentQ) - Math.max(0, timeLeft);

      // XP calculation: 50 base XP + streak bonus + time speed bonus
      let earnedXp = 0;
      if (isCorrect) {
        earnedXp = 50 + streak * 10 + (timeLeft > 15 ? 15 : 0);
        if (soundEnabled) {
          if (streak >= 3) soundFx.playStreak();
          else soundFx.playCorrect();
        }
        setStreak((prev) => {
          const next = prev + 1;
          if (next > maxStreak) setMaxStreak(next);
          return next;
        });
        setTotalXp((prev) => prev + earnedXp);
      } else {
        if (soundEnabled) soundFx.playIncorrect();
        // Buzzer mode penalty
        if (trainingMode === 'buzzer') {
          earnedXp = -10;
          setTotalXp((prev) => Math.max(0, prev - 10));
        }
        setStreak(0);
      }

      setSelectedOptionLabel(chosenLabel);
      setIsAnswerSubmitted(true);

      setUserAnswers((prev) => ({
        ...prev,
        [currentQ.id]: {
          selectedOptionLabel: chosenLabel,
          isCorrect,
          timeSpentSec: timeSpent,
          xpEarned: earnedXp,
        },
      }));
    },
    [isAnswerSubmitted, currentQ, getModeTimeLimit, timeLeft, streak, maxStreak, soundEnabled, trainingMode]
  );

  // Keyboard navigation shortcuts (A, B, C, D / 1, 2, 3, 4 / Space / Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      const key = e.key.toUpperCase();
      if (!isAnswerSubmitted && currentQ) {
        let label: 'A' | 'B' | 'C' | 'D' | null = null;
        if (key === 'A' || key === '1') label = 'A';
        else if (key === 'B' || key === '2') label = 'B';
        else if (key === 'C' || key === '3') label = 'C';
        else if (key === 'D' || key === '4') label = 'D';

        if (label) {
          const opt = currentQ.question_options.find((o) => o.option_label === label);
          if (opt) {
            e.preventDefault();
            handleSubmitAnswer(label);
          }
        }
      } else if (isAnswerSubmitted) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswerSubmitted, currentQ, handleSubmitAnswer]);

  // Next / Previous Navigation
  const handleNextQuestion = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = (newMode?: TrainingMode) => {
    setUserAnswers({});
    setCurrentIndex(0);
    setSelectedOptionLabel(null);
    setIsAnswerSubmitted(false);
    setIsCompleted(false);
    setStreak(0);
    if (newMode) setTrainingMode(newMode);
  };

  // Performance Aggregate Calculations
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.values(userAnswers).filter((a) => a.isCorrect).length;
  const incorrectCount = answeredCount - correctCount;
  const accuracyPct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 100;
  const completionPct = Math.round((answeredCount / activeQuestions.length) * 100);

  // Available unique categories
  const categories = ['All', 'Nepal Parichaya', 'Mathematics', 'History', 'Geography', 'Science', 'Computer & Tech', 'Current Affairs', 'Audio-Visual'];

  // Top School Leaderboard Data
  const topSchools = [
    { rank: 1, name: 'Little Angels’ School', district: 'Lalitpur', points: '14,820', accuracy: '94.2%', trend: '▲ +1', isUserSchool: false },
    { rank: 2, name: 'St. Xavier’s School', district: 'Lalitpur', points: '13,950', accuracy: '92.8%', trend: '—', isUserSchool: false },
    { rank: 3, name: 'Budhanilkantha School', district: 'Kathmandu', points: '13,410', accuracy: '91.5%', trend: '▼ -1', isUserSchool: false },
    { rank: 4, name: 'Your School / Student Hub', district: 'Kathmandu Valley', points: `${11500 + totalXp}`, accuracy: `${accuracyPct}%`, trend: '▲ +3', isUserSchool: true },
    { rank: 5, name: 'Apex Life School', district: 'Bhaktapur', points: '12,180', accuracy: '89.4%', trend: '▲ +2', isUserSchool: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100">
      <PublicHeader />

      {/* TRAINING COCKPIT HERO HEADER */}
      <section className="bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/50 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  🏆 Smart Mind Championship 2083
                </Badge>
                <span className="text-xs text-slate-400 font-medium">Free Student Practice Cockpit</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Interactive Competition Training Cockpit
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                Train on genuine championship questions, test your reflexes, master Nepal Parichaya & Science, and elevate your school’s standing. Zero login barrier.
              </p>
            </div>

            {/* Overall Live Stats HUD Chips */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-slate-800/90 p-3 rounded-lg border border-slate-700/80 shadow-md">
              <div className="text-center px-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Streak</span>
                <span className="text-base sm:text-lg font-black text-amber-400 flex items-center justify-center gap-0.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {streak}
                </span>
              </div>
              <div className="text-center px-1 border-l border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
                <span className="text-base sm:text-lg font-black text-emerald-400">
                  {accuracyPct}%
                </span>
              </div>
              <div className="text-center px-1 border-l border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">XP Points</span>
                <span className="text-base sm:text-lg font-black text-blue-400">
                  +{totalXp}
                </span>
              </div>
              <div className="text-center px-1 border-l border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Rank</span>
                <span className="text-base sm:text-lg font-black text-indigo-300">
                  #4
                </span>
              </div>
            </div>
          </div>

          {/* MODE SELECTOR BAR */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Quiz Modes">
              <button
                type="button"
                role="tab"
                aria-selected={trainingMode === 'general'}
                onClick={() => handleRestart('general')}
                className={`text-xs font-bold px-3 py-2 rounded-md transition-all flex items-center gap-1.5 cursor-pointer border ${
                  trainingMode === 'general'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                General Practice
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={trainingMode === 'rapid'}
                onClick={() => handleRestart('rapid')}
                className={`text-xs font-bold px-3 py-2 rounded-md transition-all flex items-center gap-1.5 cursor-pointer border ${
                  trainingMode === 'rapid'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                Rapid Fire (15s)
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={trainingMode === 'buzzer'}
                onClick={() => handleRestart('buzzer')}
                className={`text-xs font-bold px-3 py-2 rounded-md transition-all flex items-center gap-1.5 cursor-pointer border ${
                  trainingMode === 'buzzer'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-rose-300" />
                Buzzer Round (±Pts)
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={trainingMode === 'audiovisual'}
                onClick={() => handleRestart('audiovisual')}
                className={`text-xs font-bold px-3 py-2 rounded-md transition-all flex items-center gap-1.5 cursor-pointer border ${
                  trainingMode === 'audiovisual'
                    ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                Audio-Visual
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={trainingMode === 'mock'}
                onClick={() => handleRestart('mock')}
                className={`text-xs font-bold px-3 py-2 rounded-md transition-all flex items-center gap-1.5 cursor-pointer border ${
                  trainingMode === 'mock'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                Mock Final (20 Qs)
              </button>
            </div>

            {/* Quick Controls: Audio & Palette */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFx.toggleMute();
                  setSoundEnabled(!soundEnabled);
                }}
                className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                title="Toggle Sound Effects"
                aria-label="Toggle Sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span className="hidden sm:inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQuestionPalette(!showQuestionPalette)}
                className="p-1.5 px-2.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                title="Jump to Question"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Q-Grid ({answeredCount}/{activeQuestions.length})</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN COCKPIT WORKSPACE */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Category Filter Chips for General Mode */}
        {trainingMode === 'general' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" aria-label="Categories">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Subject:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                }}
                className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors shrink-0 cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* QUESTION GRID DRAWER / PALETTE (TOGGLEABLE) */}
        {showQuestionPalette && (
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Question Palette ({activeQuestions.length} Total)
                </span>
                <Badge variant="outline" className="text-[10px] font-bold text-slate-500">
                  {trainingMode.toUpperCase()} MODE
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> {correctCount} Correct
                </span>
                <span className="flex items-center gap-1 text-rose-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> {incorrectCount} Missed
                </span>
                <span className="flex items-center gap-1 text-slate-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-slate-300" /> {activeQuestions.length - answeredCount} Pending
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1.5 max-h-48 overflow-y-auto p-1">
              {activeQuestions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowQuestionPalette(false);
                    }}
                    className={`h-8 text-xs font-bold rounded-md flex items-center justify-center transition-all cursor-pointer border ${
                      isCurrent
                        ? 'ring-2 ring-blue-600 ring-offset-1 font-black bg-blue-100 text-blue-900 border-blue-400'
                        : ans
                        ? ans.isCorrect
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* LIVE QUIZ PLAYING AREA OR COMPLETION SCORECARD */}
        {!isCompleted && currentQ ? (
          <div className="space-y-4">
            {/* PROGRESS & TIMER BAR */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold px-2 py-0.5 rounded">
                  Question {currentIndex + 1} of {activeQuestions.length}
                </Badge>
                <Badge variant="outline" className="text-xs font-semibold text-slate-600 dark:text-slate-300 rounded">
                  {currentQ.category}
                </Badge>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Difficulty: <strong className="capitalize text-slate-700 dark:text-slate-300">{currentQ.difficulty}</strong>
                </span>
              </div>

              {/* Timer Bar & Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
                  <span className={`font-mono text-sm ${timeLeft <= 5 ? 'text-rose-600 font-black' : 'text-slate-700 dark:text-slate-300'}`}>
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
                  aria-label={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
                >
                  {isTimerPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* QUESTION CARD */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* Multimedia Image if present (Audio-Visual Mode) */}
                {currentQ.image_url && (
                  <div className="w-full max-h-72 relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 flex items-center justify-center">
                    <img
                      src={currentQ.image_url}
                      alt={currentQ.question_text}
                      className="max-h-72 w-full object-contain"
                      loading="eager"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      📷 Clue Image
                    </div>
                  </div>
                )}

                {/* Question Text */}
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {currentQ.question_text}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Keyboard className="w-3.5 h-3.5" />
                    <span>Press <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-mono font-bold">A</kbd>, <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-mono font-bold">B</kbd>, <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-mono font-bold">C</kbd>, or <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-mono font-bold">D</kbd> on your keyboard to answer instantly</span>
                  </div>
                </div>

                {/* OPTIONS LIST */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Options">
                  {currentQ.question_options.map((opt) => {
                    const isSelected = selectedOptionLabel === opt.option_label;
                    const showResult = isAnswerSubmitted;
                    const isCorrect = opt.is_correct;

                    let btnStyle =
                      'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

                    if (showResult) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold ring-2 ring-rose-500/20';
                      } else {
                        btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isAnswerSubmitted}
                        onClick={() => handleSubmitAnswer(opt.option_label)}
                        className={`min-h-[52px] p-3.5 rounded-lg border text-left flex items-center justify-between gap-3 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                              showResult && isCorrect
                                ? 'bg-emerald-600 text-white'
                                : showResult && isSelected && !isCorrect
                                ? 'bg-rose-600 text-white'
                                : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-xs'
                            }`}
                          >
                            {opt.option_label}
                          </span>
                          <span className="text-sm font-medium leading-tight">{opt.option_text}</span>
                        </div>

                        {showResult && (
                          <div className="shrink-0">
                            {isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : isSelected && !isCorrect ? (
                              <XCircle className="w-5 h-5 text-rose-600" />
                            ) : null}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* POST-ANSWER EXPLANATION & NEXT ACTION */}
                {isAnswerSubmitted && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                    <div
                      className={`p-4 rounded-lg border flex items-start gap-3 ${
                        userAnswers[currentQ.id]?.isCorrect
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                      }`}
                      aria-live="polite"
                    >
                      <div className="shrink-0 mt-0.5">
                        {userAnswers[currentQ.id]?.isCorrect ? (
                          <Check className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                        ) : (
                          <HelpCircle className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-black uppercase tracking-wider ${
                              userAnswers[currentQ.id]?.isCorrect
                                ? 'text-emerald-800 dark:text-emerald-300'
                                : 'text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            {userAnswers[currentQ.id]?.isCorrect ? 'Correct Answer! (+50 XP)' : 'Official Solution:'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                          {currentQ.explanation}
                        </p>
                      </div>
                    </div>

                    {/* ACTION NAVIGATION BAR */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={handlePrevQuestion}
                        disabled={currentIndex === 0}
                        className="w-full sm:w-auto text-xs font-semibold rounded-lg border-slate-300 dark:border-slate-700"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Previous
                      </Button>

                      <Button
                        onClick={handleNextQuestion}
                        className="w-full sm:w-auto min-h-[42px] px-6 bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold text-xs sm:text-sm rounded-lg shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>{currentIndex < activeQuestions.length - 1 ? 'Next Question' : 'Complete Drill & View Score'}</span>
                        <ArrowRight className="w-4 h-4" />
                        <kbd className="hidden sm:inline bg-white/20 text-white px-1.5 py-0.5 rounded text-[10px] font-mono ml-1">
                          Space / ↵
                        </kbd>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : isCompleted ? (
          /* COMPLETION SCORECARD */
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-[#1e3a5f] to-blue-700 text-white p-8 text-center space-y-3">
              <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
                {accuracyPct >= 80 ? '🥇' : accuracyPct >= 60 ? '🥈' : '🎖️'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">Training Drill Completed!</h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto">
                {accuracyPct >= 80
                  ? 'Outstanding performance! You are performing at top championship tier.'
                  : 'Solid effort! Review your missed questions below to master the syllabus.'}
              </p>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-8">
              {/* Stat Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="text-xs text-slate-500 font-bold uppercase block">Accuracy</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600">{accuracyPct}%</span>
                  <span className="text-[11px] text-slate-400 block">{correctCount} of {activeQuestions.length} correct</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="text-xs text-slate-500 font-bold uppercase block">XP Earned</span>
                  <span className="text-2xl sm:text-3xl font-black text-blue-600">+{totalXp}</span>
                  <span className="text-[11px] text-slate-400 block">Season points</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="text-xs text-slate-500 font-bold uppercase block">Max Streak</span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-500">{maxStreak}🔥</span>
                  <span className="text-[11px] text-slate-400 block">Combo answers</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="text-xs text-slate-500 font-bold uppercase block">School Standing</span>
                  <span className="text-2xl sm:text-3xl font-black text-indigo-600">#4</span>
                  <span className="text-[11px] text-slate-400 block">Kathmandu Valley</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button
                  onClick={() => handleRestart('general')}
                  className="bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold text-xs sm:text-sm rounded-lg px-5 min-h-[42px] cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Practice Again (All Questions)
                </Button>

                <Button
                  onClick={() => handleRestart('rapid')}
                  variant="outline"
                  className="border-amber-400 text-amber-900 bg-amber-50 hover:bg-amber-100 font-bold text-xs sm:text-sm rounded-lg px-5 min-h-[42px] cursor-pointer flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-amber-600" /> Try Rapid Fire Round
                </Button>

                <Link href="/leaderboard">
                  <Button
                    variant="outline"
                    className="border-slate-300 font-bold text-xs sm:text-sm rounded-lg px-5 min-h-[42px] cursor-pointer flex items-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-amber-500" /> View Championship Leaderboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* DAILY TRAINING GOAL & WEAK TOPIC SMART DRILLS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> Daily Student Mission
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {Math.min(answeredCount, dailyGoal)} / {dailyGoal} Solved
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Daily 10-Question Championship Drill
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Consistency builds champions. Solve at least 10 mixed questions every day to sharpen recall speed for buzzer and rapid rounds.
              </p>
            </div>
            <div className="space-y-1.5">
              <Progress value={Math.min(100, Math.round((answeredCount / dailyGoal) * 100))} className="h-2 rounded" />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Progress: {Math.round((answeredCount / dailyGoal) * 100)}%</span>
                <span>Reward: +100 Bonus XP</span>
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Smart Drill Recommendation
                </span>
                <Badge className="bg-amber-100 text-amber-800 border-none text-[10px] font-bold">
                  Recommended
                </Badge>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Nepal Parichaya & Geography Speed Drills
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Nepal Parichaya contributes 25% of all points in the final rounds. Strengthen national parks, historical milestones, and heritage facts.
              </p>
            </div>
            <Button
              onClick={() => {
                setSelectedCategory('Nepal Parichaya');
                setTrainingMode('general');
                setCurrentIndex(0);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              variant="outline"
              className="w-full text-xs font-bold rounded-lg border-slate-300 hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Start Nepal Parichaya Drill →
            </Button>
          </Card>
        </section>

        {/* PRACTICE HUB SUBJECT CARDS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                Syllabus & Subject Practice Hub
              </h2>
              <p className="text-xs text-slate-500">
                Targeted practice modules across all official quiz categories.
              </p>
            </div>
            <Link href="/about#syllabus" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View Syllabus Breakdown →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Nepal Parichaya', cat: 'Nepal Parichaya', count: '280+ Questions', desc: 'Heritage, geography, national parks, constitution, and historical treaties.', icon: Compass, color: 'text-rose-600 bg-rose-50 border-rose-200' },
              { title: 'Science & Technology', cat: 'Science', count: '340+ Questions', desc: 'Physics, biology, space discoveries, astronomy, and AI innovations.', icon: Atom, color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { title: 'World Geography & Climate', cat: 'Geography', count: '250+ Questions', desc: 'Mountains, major river systems, capital cities, oceans, and landmarks.', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
              { title: 'History & Civilizations', cat: 'History', count: '220+ Questions', desc: 'Ancient kingdoms, unification of Nepal, world wars, and peace treaties.', icon: Award, color: 'text-amber-600 bg-amber-50 border-amber-200' },
              { title: 'Mathematics & Logic', cat: 'Mathematics', count: '210+ Questions', desc: 'Mental arithmetic, sequences, spatial logic, and speed calculations.', icon: Zap, color: 'text-purple-600 bg-purple-50 border-purple-200' },
              { title: 'Current Affairs & Sports', cat: 'Current Affairs', count: '300+ Questions', desc: 'National awards, Olympic records, recent global summits, and summits.', icon: Trophy, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
            ].map((subject) => {
              const IconComp = subject.icon;
              return (
                <Card
                  key={subject.title}
                  onClick={() => {
                    setSelectedCategory(subject.cat);
                    setTrainingMode('general');
                    setCurrentIndex(0);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${subject.color}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold text-slate-500">
                      {subject.count}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                    {subject.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {subject.desc}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                    <span>Practice Category</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* INTER-SCHOOL COMPETITIVE LEADERBOARD PREVIEW */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                  Inter-School Championship Standings
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time benchmark aggregating practice accuracy, streak streaks, and speed drills.
              </p>
            </div>
            <Link href="/leaderboard">
              <Button variant="outline" className="text-xs font-bold rounded-lg border-slate-300 cursor-pointer">
                View Full Leaderboard (50+ Schools) →
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Leaderboard Preview">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">School Name</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3 text-right">Accuracy</th>
                  <th className="py-2.5 px-3 text-right">Points</th>
                  <th className="py-2.5 px-3 text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {topSchools.map((sch) => (
                  <tr
                    key={sch.name}
                    className={`transition-colors ${
                      sch.isUserSchool
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 font-bold text-blue-900 dark:text-blue-200'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded font-black text-xs ${
                        sch.rank === 1 ? 'bg-amber-100 text-amber-800' :
                        sch.rank === 2 ? 'bg-slate-200 text-slate-800' :
                        sch.rank === 3 ? 'bg-amber-50 text-amber-700' : 'text-slate-500'
                      }`}>
                        #{sch.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold flex items-center gap-2">
                      <span>{sch.name}</span>
                      {sch.isUserSchool && (
                        <Badge className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Your Benchmark
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{sch.district}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600">{sch.accuracy}</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900 dark:text-slate-100">{sch.points}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[11px] font-bold ${
                        sch.trend.startsWith('▲') ? 'text-emerald-600' :
                        sch.trend.startsWith('▼') ? 'text-rose-600' : 'text-slate-400'
                      }`}>
                        {sch.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* WHY STUDENTS, SCHOOLS, & COORDINATORS LOVE SMART MIND */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Zero Login for Students</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Immediate free access on any phone, tablet, or PC. Instant explanation and verified curriculum solutions without password roadblocks.
            </p>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">True Competition Simulation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Practice across Rapid Fire (15s timers), Buzzer rounds (penalty calculations), and Multimedia rounds to build tournament-ready reflexes.
            </p>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Administrator Tools</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Quiz coordinators can securely access the backend portal via <code>/admin</code> to upload questions, generate PDF question papers, and track metrics.
            </p>
          </Card>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
