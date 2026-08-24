'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Zap,
  BookOpen,
  Award,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';
import { soundFx } from '@/lib/audio';

interface DemoQuestion {
  id: string;
  category: string;
  question: string;
  options: { label: string; text: string }[];
  correct: string;
  explanation: string;
}

const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    id: 'demo_1',
    category: 'Nepal Parichaya',
    question: 'Which is the deepest gorge in the world, located between Dhaulagiri and Annapurna massifs in Nepal?',
    options: [
      { label: 'A', text: 'Arun Valley' },
      { label: 'B', text: 'Kali Gandaki Gorge' },
      { label: 'C', text: 'Trishuli Canyon' },
      { label: 'D', text: 'Marsyangdi Valley' },
    ],
    correct: 'B',
    explanation: 'The Kali Gandaki Gorge (Andha Galchi) is the deepest gorge in the world, carved by the Kali Gandaki River between Annapurna and Dhaulagiri.',
  },
  {
    id: 'demo_2',
    category: 'General Science',
    question: 'What is the powerhouse organelle of eukaryotic cells responsible for producing ATP?',
    options: [
      { label: 'A', text: 'Ribosome' },
      { label: 'B', text: 'Endoplasmic Reticulum' },
      { label: 'C', text: 'Mitochondria' },
      { label: 'D', text: 'Golgi Apparatus' },
    ],
    correct: 'C',
    explanation: 'Mitochondria generate most of the chemical energy needed to power the cell’s biochemical reactions through ATP production.',
  },
  {
    id: 'demo_3',
    category: 'World Geography',
    question: 'Which canal connects the Mediterranean Sea directly to the Red Sea?',
    options: [
      { label: 'A', text: 'Panama Canal' },
      { label: 'B', text: 'Suez Canal' },
      { label: 'C', text: 'Kiel Canal' },
      { label: 'D', text: 'Corinth Canal' },
    ],
    correct: 'B',
    explanation: 'Opened in 1869, the Suez Canal in Egypt connects the Mediterranean Sea to the Red Sea, providing the shortest maritime route between Europe and Asia.',
  },
  {
    id: 'demo_4',
    category: 'Space & Astronomy',
    question: 'Which planet in our solar system has the highest number of recognized natural satellites (moons)?',
    options: [
      { label: 'A', text: 'Jupiter' },
      { label: 'B', text: 'Saturn' },
      { label: 'C', text: 'Uranus' },
      { label: 'D', text: 'Neptune' },
    ],
    correct: 'B',
    explanation: 'Saturn leads our solar system with 146 officially recognized moons, surpassing Jupiter.',
  },
  {
    id: 'demo_5',
    category: 'Computing & Tech',
    question: 'What does the abbreviation "URL" stand for in web technology?',
    options: [
      { label: 'A', text: 'Uniform Resource Locator' },
      { label: 'B', text: 'Universal Routing Link' },
      { label: 'C', text: 'Unified Resource Line' },
      { label: 'D', text: 'Unit Retrieval Locator' },
    ],
    correct: 'A',
    explanation: 'URL stands for Uniform Resource Locator, representing the global address of documents and other resources on the World Wide Web.',
  },
];

export default function DemoQuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [answers, setAnswers] = useState<{ [qId: string]: { selected: string; isCorrect: boolean; timeTaken: number } }>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentQ = DEMO_QUESTIONS[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (isQuizCompleted || isTimerPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 6 && prev > 1) {
          soundFx.playTick();
        }
        if (prev <= 1) {
          handleOptionSubmit(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isTimerPaused, isQuizCompleted]);

  // Handle Answer Selection
  const handleOptionSubmit = (optLabel: string | null) => {
    if (isAnswerSubmitted) return;

    const timeSpent = Math.max(1, 30 - timeLeft);
    const isCorrect = optLabel === currentQ.correct;

    if (isCorrect) {
      soundFx.playCorrect();
    } else {
      soundFx.playIncorrect();
    }

    setSelectedOption(optLabel);
    setIsAnswerSubmitted(true);
    setIsTimerPaused(true);

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        selected: optLabel || 'SKIPPED',
        isCorrect,
        timeTaken: timeSpent,
      },
    }));
  };

  const handleNext = () => {
    if (currentIndex < DEMO_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(30);
      setIsTimerPaused(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setTimeLeft(30);
    setIsTimerPaused(false);
    setAnswers({});
    setIsQuizCompleted(false);
    setStartTime(Date.now());
  };

  // Summary Metrics
  const totalCorrect = Object.values(answers).filter((a) => a.isCorrect).length;
  const accuracy = Math.round((totalCorrect / DEMO_QUESTIONS.length) * 100);
  const totalTimeSpent = Object.values(answers).reduce((acc, a) => acc + a.timeTaken, 0);
  const avgSpeed = (totalTimeSpent / DEMO_QUESTIONS.length).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {!isQuizCompleted ? (
          <div className="space-y-6">
            {/* Top Bar (Progress & Timer) */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Badge variant="outline" className="w-fit mb-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border-blue-200">
                  {currentQ.category}
                </Badge>
                <h2 className="text-sm font-bold text-slate-700">
                  Demo Question {currentIndex + 1} of {DEMO_QUESTIONS.length}
                </h2>
              </div>

              {/* 30s Countdown Badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-sm font-bold border transition-colors ${
                  timeLeft <= 5
                    ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                    : 'bg-white text-slate-700 border-slate-200 shadow-sm'
                }`}
              >
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            <Progress
              value={((currentIndex + 1) / DEMO_QUESTIONS.length) * 100}
              className="h-2 bg-slate-200"
            />

            {/* Question Card */}
            <Card className="border border-slate-200 shadow-md">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </h1>

                {/* Options List */}
                <div className="grid grid-cols-1 gap-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedOption === opt.label;
                    const isCorrect = opt.label === currentQ.correct;

                    let btnClasses =
                      'w-full min-h-[48px] p-4 text-left rounded-xl border-2 font-medium flex items-center justify-between transition-all duration-200 cursor-pointer ';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnClasses += 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnClasses += 'bg-rose-50 border-rose-500 text-rose-900 opacity-80';
                      } else {
                        btnClasses += 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
                      }
                    } else if (isSelected) {
                      btnClasses += 'bg-blue-50 border-blue-600 text-blue-950 font-semibold';
                    } else {
                      btnClasses += 'bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/40';
                    }

                    return (
                      <button
                        key={opt.label}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleOptionSubmit(opt.label)}
                        className={btnClasses}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                              isAnswerSubmitted && isCorrect
                                ? 'bg-emerald-600 text-white'
                                : isAnswerSubmitted && isSelected && !isCorrect
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {opt.label}
                          </span>
                          <span className="text-sm sm:text-base">{opt.text}</span>
                        </div>

                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Banner */}
                {isAnswerSubmitted && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs sm:text-sm text-blue-900 animate-fade-in">
                    <p className="font-bold flex items-center gap-1.5 text-blue-800">
                      💡 Official Explanation:
                    </p>
                    <p className="leading-relaxed text-blue-950/80">{currentQ.explanation}</p>
                  </div>
                )}
              </CardContent>

              {isAnswerSubmitted && (
                <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 flex justify-between items-center rounded-b-xl">
                  <span className="text-xs text-slate-500">
                    {currentIndex < DEMO_QUESTIONS.length - 1
                      ? 'Click Next to continue the demo'
                      : 'You have answered all 5 sample questions!'}
                  </span>
                  <Button
                    onClick={handleNext}
                    className="bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold min-h-[44px] px-6 cursor-pointer"
                  >
                    {currentIndex < DEMO_QUESTIONS.length - 1 ? (
                      <>
                        Next Question <ArrowRight className="w-4 h-4 ml-1.5" />
                      </>
                    ) : (
                      <>
                        View Demo Results <Award className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        ) : (
          /* FINAL DEMO RESULTS SCREEN */
          <div className="space-y-8 animate-fade-in">
            <Card className="border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#1e3a5f] to-blue-900 text-white p-8 text-center space-y-3">
                <Badge className="bg-amber-400 text-slate-950 hover:bg-amber-400 font-extrabold uppercase px-3 py-1 text-xs">
                  Demo Evaluation Complete
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-black">Your Quiz Score</h1>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-black text-amber-300">{totalCorrect}</span>
                  <span className="text-2xl text-blue-200 font-semibold">/ {DEMO_QUESTIONS.length}</span>
                </div>
                <p className="text-xs text-blue-200 font-medium">
                  {accuracy >= 80
                    ? '🌟 Outstanding! Excellent multidisciplinary knowledge.'
                    : accuracy >= 60
                    ? '👍 Good performance! Targeted practice in weak areas will take you to the finals.'
                    : '📚 Keep practicing! Consistent training in Buzzer and Subject Drills will boost your score.'}
                </p>
              </div>

              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* Stats Summary Grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 bg-slate-50 border rounded-xl">
                    <p className="text-xs font-medium text-slate-500">Accuracy</p>
                    <p className="text-2xl font-black text-blue-950 mt-1">{accuracy}%</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 border rounded-xl">
                    <p className="text-xs font-medium text-slate-500">Total Time</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{totalTimeSpent}s</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 border rounded-xl">
                    <p className="text-xs font-medium text-slate-500">Avg Speed</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">{avgSpeed}s</p>
                  </div>
                </div>

                {/* Weak Topic Recommendations */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Recommended Training Focus
                  </div>
                  <ul className="text-xs text-amber-900 space-y-1.5 pl-5 list-disc">
                    {DEMO_QUESTIONS.filter((q) => !answers[q.id]?.isCorrect).map((q) => (
                      <li key={q.id}>
                        Review <strong>{q.category}</strong>: <em>{q.question.slice(0, 70)}...</em>
                      </li>
                    ))}
                    {DEMO_QUESTIONS.filter((q) => !answers[q.id]?.isCorrect).length === 0 && (
                      <li>
                        All categories passed! Recommended next step: Test your speed in <strong>Rapid Fire Blitz</strong>!
                      </li>
                    )}
                  </ul>
                </div>

                {/* Full Question Review Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" /> Question Review Breakdown
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {DEMO_QUESTIONS.map((q, idx) => {
                      const res = answers[q.id];
                      return (
                        <div
                          key={q.id}
                          className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                            res?.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-900">
                              {idx + 1}. {q.question}
                            </p>
                            <p className="text-slate-600">
                              Correct: <strong>Option {q.correct}</strong> · Your Answer:{' '}
                              <strong>Option {res?.selected}</strong> ({res?.timeTaken}s)
                            </p>
                          </div>
                          {res?.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Box */}
                <div className="p-6 bg-slate-900 text-white rounded-2xl text-center space-y-4 shadow-md">
                  <div>
                    <h3 className="text-lg font-black">Want to Track Your Full School Ranking?</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Register as a student to unlock 1,000+ competition questions, Spacebar Buzzer training, Mistake Vault, and daily championship leaderboards.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link href="/register">
                      <Button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-black min-h-[44px] px-6 cursor-pointer">
                        <GraduationCap className="w-4 h-4 mr-1.5" /> Create Free Student Account
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleRestart}
                      className="w-full sm:w-auto text-white border-slate-700 hover:bg-slate-800 min-h-[44px] cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 mr-1.5" /> Retake Demo Quiz
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
