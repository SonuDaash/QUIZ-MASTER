'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  GraduationCap,
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
  HelpCircle,
  Award,
  Layers,
  Check,
  ChevronRight,
  RefreshCw,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import { soundFx } from '@/lib/audio';
import { getQuestions } from '@/lib/firebase/firestore';
import { COMPREHENSIVE_QUESTION_BANK, type PracticeQuestion } from '@/lib/data/default-questions';

export default function HomePage() {
  // Questions state
  const [allQuestions, setAllQuestions] = useState<PracticeQuestion[]>(COMPREHENSIVE_QUESTION_BANK);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Practice session states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{
    [qId: string]: {
      selectedOptionLabel: string | null;
      isCorrect: boolean;
      timeSpentSec: number;
    };
  }>({});
  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  
  // Session settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuestionDrawer, setShowQuestionDrawer] = useState(false);

  // Load questions from Firestore merged with fallback
  useEffect(() => {
    async function loadFirestoreQuestions() {
      setLoadingQuestions(true);
      try {
        const firestoreQs = await getQuestions({});
        if (firestoreQs && firestoreQs.length > 0) {
          const mappedFirestore: PracticeQuestion[] = firestoreQs.map((fq) => ({
            id: fq.id,
            question_text: fq.question_text,
            category: fq.subject_id === 'subj_sci' ? 'Science' :
                      fq.subject_id === 'subj_geo' ? 'Geography' :
                      fq.subject_id === 'subj_hist' ? 'History' :
                      fq.subject_id === 'subj_math' ? 'Mathematics' :
                      fq.subject_id === 'subj_comp' ? 'Computer & Tech' :
                      fq.subject_id === 'subj_ca' ? 'Current Affairs' : 'General Knowledge',
            subject_id: fq.subject_id,
            difficulty: (fq.difficulty as any) || 'easy',
            time_limit: fq.time_limit || 30,
            explanation: fq.explanation || 'Verified answer for PABSON competition syllabus.',
            question_options: (((fq as any).question_options || fq.options) && ((fq as any).question_options || fq.options).length > 0)
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

          // Merge without duplicate IDs
          const existingIds = new Set(mappedFirestore.map(q => q.id));
          const combined = [
            ...mappedFirestore,
            ...COMPREHENSIVE_QUESTION_BANK.filter(q => !existingIds.has(q.id)),
          ];
          setAllQuestions(combined);
        }
      } catch (err) {
        console.error('Error fetching questions, using built-in bank:', err);
      } finally {
        setLoadingQuestions(false);
      }
    }
    loadFirestoreQuestions();
  }, []);

  // Filtered questions based on chosen category
  const activeQuestions = useMemo(() => {
    if (selectedCategory === 'All') return allQuestions;
    return allQuestions.filter(q => q.category === selectedCategory);
  }, [allQuestions, selectedCategory]);

  const currentQ = activeQuestions[currentIndex] || activeQuestions[0];

  // Reset answer selection when question changes
  useEffect(() => {
    if (!currentQ) return;
    const previousAnswer = userAnswers[currentQ.id];
    if (previousAnswer) {
      setSelectedOptionLabel(previousAnswer.selectedOptionLabel);
      setIsAnswerSubmitted(true);
      setIsTimerPaused(true);
    } else {
      setSelectedOptionLabel(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(currentQ.time_limit || 30);
      setIsTimerPaused(false);
    }
  }, [currentIndex, currentQ, userAnswers]);

  // Timer countdown
  useEffect(() => {
    if (!timerEnabled || isCompleted || isTimerPaused || isAnswerSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSelectOption(null);
          return 0;
        }
        if (soundEnabled && prev <= 6) {
          soundFx.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerEnabled, isCompleted, isTimerPaused, isAnswerSubmitted, soundEnabled]);

  // Handle Option Click
  const handleSelectOption = useCallback((optLabel: string | null) => {
    if (isAnswerSubmitted || !currentQ) return;

    const correctOpt = currentQ.question_options.find(o => o.is_correct);
    const isCorrect = optLabel !== null && correctOpt?.option_label === optLabel;
    const timeSpent = Math.max(1, (currentQ.time_limit || 30) - timeLeft);

    if (soundEnabled) {
      if (isCorrect) soundFx.playCorrect();
      else soundFx.playIncorrect();
    }

    setSelectedOptionLabel(optLabel);
    setIsAnswerSubmitted(true);
    setIsTimerPaused(true);

    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        selectedOptionLabel: optLabel,
        isCorrect,
        timeSpentSec: timeSpent,
      },
    }));
  }, [isAnswerSubmitted, currentQ, timeLeft, soundEnabled]);

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    if (index >= 0 && index < activeQuestions.length) {
      setCurrentIndex(index);
    }
  };

  const handleRestart = (onlyMissed = false) => {
    if (onlyMissed) {
      const missedIds = new Set(
        Object.entries(userAnswers)
          .filter(([_, ans]) => !ans.isCorrect)
          .map(([qId]) => qId)
      );
      const filtered = allQuestions.filter(q => missedIds.has(q.id));
      if (filtered.length > 0) {
        setAllQuestions(filtered);
      }
    }
    setUserAnswers({});
    setCurrentIndex(0);
    setSelectedOptionLabel(null);
    setIsAnswerSubmitted(false);
    setTimeLeft(30);
    setIsTimerPaused(false);
    setIsCompleted(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setUserAnswers({});
    setSelectedOptionLabel(null);
    setIsAnswerSubmitted(false);
    setIsCompleted(false);
  };

  // Metrics
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
  const incorrectCount = Object.values(userAnswers).filter(a => !a.isCorrect && a.selectedOptionLabel !== null).length;
  const skippedCount = Object.values(userAnswers).filter(a => a.selectedOptionLabel === null).length;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const progressPercent = activeQuestions.length > 0 ? ((currentIndex + 1) / activeQuestions.length) * 100 : 0;

  // Categories list
  const categories = [
    { name: 'All', label: '🎯 All Questions', count: allQuestions.length },
    { name: 'Nepal Parichaya', label: '🇳🇵 Nepal Parichaya', count: allQuestions.filter(q => q.category === 'Nepal Parichaya').length },
    { name: 'Science', label: '🔬 Science & Nature', count: allQuestions.filter(q => q.category === 'Science').length },
    { name: 'Geography', label: '🗺️ World Geography', count: allQuestions.filter(q => q.category === 'Geography').length },
    { name: 'History', label: '🏛️ History', count: allQuestions.filter(q => q.category === 'History').length },
    { name: 'Mathematics', label: '📐 Mathematics', count: allQuestions.filter(q => q.category === 'Mathematics').length },
    { name: 'Computer & Tech', label: '💻 Computer & ICT', count: allQuestions.filter(q => q.category === 'Computer & Tech').length },
    { name: 'Current Affairs', label: '⚡ Current Affairs', count: allQuestions.filter(q => q.category === 'Current Affairs').length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100">
      <PublicHeader />

      <main className="flex-1 pb-16">
        {/* HERO / NOTICE BANNER */}
        <section className="bg-gradient-to-r from-[#1e3a5f] via-blue-900 to-[#1e3a5f] text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-blue-950 shadow-md">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                Free Practice Portal • No Student Login Required
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                PABSON Smart Mind Quiz Practice 2083
              </h1>
              <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
                Test your knowledge across all subjects in <strong>one single attempt</strong> with instant solutions and zero sign-in barriers!
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shrink-0">
              <div className="text-center">
                <p className="text-[10px] text-blue-200 uppercase font-bold">Total Questions</p>
                <p className="text-xl font-black text-amber-300">{allQuestions.length}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-[10px] text-blue-200 uppercase font-bold">Completed</p>
                <p className="text-xl font-black text-emerald-300">{answeredCount}/{activeQuestions.length}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-[10px] text-blue-200 uppercase font-bold">Accuracy</p>
                <p className="text-xl font-black text-white">{accuracy}%</p>
              </div>
            </div>
          </div>
        </section>

        {/* SUBJECT SELECTION BAR */}
        <section className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 uppercase mr-1 shrink-0 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Category:
              </span>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1e3a5f] text-white shadow-sm ring-2 ring-blue-400/40'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* MAIN TEST CONTAINER */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {!isCompleted && currentQ ? (
            <div className="space-y-5 animate-fade-in">
              {/* TOP CONTROLS & STATUS BAR */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold px-3 py-1 text-xs">
                    {currentQ.category}
                  </Badge>
                  <span className="text-sm font-extrabold text-slate-800">
                    Question <span className="text-blue-600 font-mono text-base">{currentIndex + 1}</span> of {activeQuestions.length}
                  </span>
                </div>

                {/* Score Ticker & Toggles */}
                <div className="flex items-center gap-3">
                  {/* Live Mini Score */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold font-mono text-slate-700">
                    <span className="text-emerald-600">✓ {correctCount}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-rose-600">✗ {incorrectCount}</span>
                  </div>

                  {/* Timer Toggle & Display */}
                  {timerEnabled && (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold border transition-colors ${
                        timeLeft <= 5
                          ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{timeLeft}s</span>
                    </div>
                  )}

                  {/* Sound FX Toggle */}
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  {/* Question Navigator Drawer Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQuestionDrawer(!showQuestionDrawer)}
                    className="text-xs font-bold cursor-pointer h-8 px-2.5"
                  >
                    <Layers className="w-3.5 h-3.5 mr-1 text-blue-600" />
                    All ({activeQuestions.length})
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <Progress value={progressPercent} className="h-2 bg-slate-200 rounded-full" />

              {/* POPUP QUESTION NAVIGATOR GRID */}
              {showQuestionDrawer && (
                <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-md space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-blue-600" /> Jump to Question
                    </span>
                    <span className="text-xs text-slate-500">
                      🟢 Correct • 🔴 Incorrect • ⚪ Unanswered
                    </span>
                  </div>

                  <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2 max-h-48 overflow-y-auto p-1">
                    {activeQuestions.map((q, idx) => {
                      const ans = userAnswers[q.id];
                      const isCurrent = idx === currentIndex;
                      let btnColor = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';

                      if (ans) {
                        if (ans.isCorrect) btnColor = 'bg-emerald-500 text-white font-bold border-emerald-600';
                        else if (ans.selectedOptionLabel === null) btnColor = 'bg-amber-400 text-slate-950 font-bold';
                        else btnColor = 'bg-rose-500 text-white font-bold border-rose-600';
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            handleJumpToQuestion(idx);
                            setShowQuestionDrawer(false);
                          }}
                          className={`h-9 rounded-xl text-xs border flex items-center justify-center font-mono transition-all cursor-pointer ${btnColor} ${
                            isCurrent ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 shadow-sm' : ''
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* QUESTION CARD */}
              <Card className="border border-slate-200 shadow-lg rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  {/* Question Text */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">Q{currentIndex + 1}.</span>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono bg-slate-50">
                        {currentQ.difficulty} • 1 Mark
                      </Badge>
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                      {currentQ.question_text}
                    </h2>
                  </div>

                  {/* 4 Interactive Option Buttons */}
                  <div className="grid grid-cols-1 gap-3">
                    {currentQ.question_options.map((opt) => {
                      const isSelected = selectedOptionLabel === opt.option_label;
                      const isCorrectAnswer = opt.is_correct;

                      let btnStyle =
                        'w-full min-h-[52px] p-4 rounded-xl border-2 font-medium flex items-center justify-between transition-all duration-150 text-left cursor-pointer ';

                      if (isAnswerSubmitted) {
                        if (isCorrectAnswer) {
                          btnStyle += 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm';
                        } else if (isSelected && !isCorrectAnswer) {
                          btnStyle += 'bg-rose-50 border-rose-500 text-rose-950 font-semibold';
                        } else {
                          btnStyle += 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                        }
                      } else if (isSelected) {
                        btnStyle += 'bg-blue-50 border-blue-600 text-blue-950 font-bold';
                      } else {
                        btnStyle +=
                          'bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-xs';
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={isAnswerSubmitted}
                          onClick={() => handleSelectOption(opt.option_label)}
                          className={btnStyle}
                        >
                          <div className="flex items-center gap-3.5">
                            <span
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                                isAnswerSubmitted && isCorrectAnswer
                                  ? 'bg-emerald-600 text-white'
                                  : isAnswerSubmitted && isSelected && !isCorrectAnswer
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {opt.option_label}
                            </span>
                            <span className="text-sm sm:text-base font-semibold leading-snug">
                              {opt.option_text}
                            </span>
                          </div>

                          {isAnswerSubmitted && isCorrectAnswer && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          )}
                          {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* INSTANT EXPLANATION BANNER */}
                  {isAnswerSubmitted && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1.5 text-xs sm:text-sm text-blue-950 animate-fade-in">
                      <div className="flex items-center gap-1.5 font-black text-blue-900">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Official Solution & Explanation:</span>
                      </div>
                      <p className="leading-relaxed pl-5">{currentQ.explanation}</p>
                    </div>
                  )}
                </CardContent>

                {/* BOTTOM NAVIGATION ACTIONS */}
                <div className="bg-slate-50 border-t border-slate-100 p-4 sm:px-8 flex flex-wrap items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    disabled={currentIndex === 0}
                    onClick={handlePrevious}
                    className="text-xs font-bold cursor-pointer h-10 px-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {!isAnswerSubmitted && (
                      <Button
                        variant="ghost"
                        onClick={() => handleSelectOption(null)}
                        className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer h-10 px-3"
                      >
                        Skip Question
                      </Button>
                    )}

                    <Button
                      onClick={handleNext}
                      className="bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold text-xs sm:text-sm h-10 px-6 cursor-pointer shadow-md"
                    >
                      {currentIndex < activeQuestions.length - 1 ? (
                        <>
                          Next Question <ArrowRight className="w-4 h-4 ml-1.5" />
                        </>
                      ) : (
                        <>
                          Finish Attempt & View Scorecard <Award className="w-4 h-4 ml-1.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            /* COMPREHENSIVE SCORECARD ATTEMPT REPORT */
            <div className="space-y-6 animate-fade-in">
              <Card className="border border-slate-200 shadow-xl overflow-hidden rounded-3xl">
                {/* Header Trophy Banner */}
                <div className="bg-gradient-to-br from-[#1e3a5f] via-blue-900 to-[#1e3a5f] text-white p-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg">
                    <Trophy className="w-9 h-9" />
                  </div>
                  <Badge className="bg-amber-400 text-slate-950 font-extrabold uppercase px-3 py-1 text-xs">
                    Attempt Complete
                  </Badge>
                  <h1 className="text-3xl sm:text-4xl font-black">Your Practice Scorecard</h1>
                  
                  <div className="flex items-baseline justify-center gap-2 pt-1">
                    <span className="text-6xl font-black text-amber-300 font-mono">{correctCount}</span>
                    <span className="text-2xl text-blue-200 font-semibold font-mono">/ {activeQuestions.length}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-blue-200 max-w-md mx-auto">
                    {accuracy >= 80
                      ? '🌟 Outstanding performance! Excellent mastery across the competition syllabus.'
                      : accuracy >= 50
                      ? '👍 Great effort! Review the missed questions below to sharpen your final score.'
                      : '📚 Keep practicing! Frequent drills in all subjects will boost your championship speed and accuracy.'}
                  </p>
                </div>

                <CardContent className="p-6 sm:p-8 space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3.5 bg-slate-50 border rounded-2xl">
                      <p className="text-xs font-semibold text-slate-500">Accuracy</p>
                      <p className="text-2xl font-black text-blue-900 mt-1 font-mono">{accuracy}%</p>
                    </div>
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <p className="text-xs font-semibold text-emerald-700">Correct</p>
                      <p className="text-2xl font-black text-emerald-700 mt-1 font-mono">{correctCount}</p>
                    </div>
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl">
                      <p className="text-xs font-semibold text-rose-700">Incorrect</p>
                      <p className="text-2xl font-black text-rose-700 mt-1 font-mono">{incorrectCount}</p>
                    </div>
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
                      <p className="text-xs font-semibold text-amber-700">Skipped</p>
                      <p className="text-2xl font-black text-amber-700 mt-1 font-mono">{skippedCount}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button
                      onClick={() => handleRestart(false)}
                      className="bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold h-11 px-6 rounded-xl cursor-pointer shadow-md"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" /> Retake All Questions ({activeQuestions.length})
                    </Button>

                    {incorrectCount + skippedCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => handleRestart(true)}
                        className="border-rose-300 text-rose-700 hover:bg-rose-50 font-bold h-11 px-5 rounded-xl cursor-pointer"
                      >
                        <Flame className="w-4 h-4 mr-2 text-rose-600" /> Retry Missed Questions Only ({incorrectCount + skippedCount})
                      </Button>
                    )}
                  </div>

                  {/* DETAILED QUESTION REVIEW LIST */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" /> Question-by-Question Review
                    </h3>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {activeQuestions.map((q, idx) => {
                        const ans = userAnswers[q.id];
                        const correctOpt = q.question_options.find(o => o.is_correct);
                        const isCorrect = ans?.isCorrect;

                        return (
                          <div
                            key={q.id}
                            className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 transition-all ${
                              isCorrect
                                ? 'bg-emerald-50/50 border-emerald-200'
                                : 'bg-rose-50/50 border-rose-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p className="font-bold text-slate-900">
                                <span className="font-mono text-slate-500 mr-1.5">{idx + 1}.</span>
                                {q.question_text}
                              </p>
                              {isCorrect ? (
                                <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold shrink-0">
                                  ✓ Correct
                                </Badge>
                              ) : (
                                <Badge className="bg-rose-100 text-rose-800 border-none font-bold shrink-0">
                                  ✗ {ans?.selectedOptionLabel ? 'Incorrect' : 'Skipped'}
                                </Badge>
                              )}
                            </div>

                            <div className="text-xs text-slate-600 space-y-0.5">
                              <p>
                                🎯 Correct Answer: <strong className="text-emerald-700">{correctOpt?.option_label}. {correctOpt?.option_text}</strong>
                              </p>
                              {ans?.selectedOptionLabel && !isCorrect && (
                                <p>
                                  Your Choice: <span className="text-rose-600 font-semibold">{ans.selectedOptionLabel}</span>
                                </p>
                              )}
                              <p className="text-slate-500 pt-1 border-t border-slate-200/50">
                                💡 <em>{q.explanation}</em>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* SYLLABUS HIGHLIGHTS */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Comprehensive Curriculum Covered</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Designed according to PABSON national quiz championship guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Nepal Parichaya', desc: 'Geography, History, Culture & Constitution of Nepal', icon: Compass, color: 'text-rose-600 bg-rose-50' },
              { title: 'Science & Nature', desc: 'Physics, Chemistry, Biology & Space Missions', icon: Atom, color: 'text-emerald-600 bg-emerald-50' },
              { title: 'Math & Logic', desc: 'Arithmetic, Algebra, Geometry & Mental Aptitude', icon: Sparkles, color: 'text-blue-600 bg-blue-50' },
              { title: 'Current Affairs', desc: 'National & Global Summits, Sports, Technology', icon: Zap, color: 'text-amber-600 bg-amber-50' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
