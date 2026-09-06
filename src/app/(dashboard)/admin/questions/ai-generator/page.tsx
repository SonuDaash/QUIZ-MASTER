'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Download,
  Database,
  Trash2,
  Plus,
  RefreshCw,
  HelpCircle,
  Clock,
  Layers,
  Award,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createQuestion } from '@/lib/firebase/firestore';

interface GeneratedOption {
  id: string;
  option_label: 'A' | 'B' | 'C' | 'D';
  option_text: string;
  is_correct: boolean;
}

interface GeneratedQuestion {
  id: string;
  question_text: string;
  category: string;
  subject_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit: number;
  explanation: string;
  marks: number;
  image_url?: string;
  question_options: GeneratedOption[];
}

export default function AIGeneratorPage() {
  const router = useRouter();

  // Generator Config
  const [topic, setTopic] = useState('Nepal Parichaya');
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [roundType, setRoundType] = useState<'general' | 'rapid' | 'buzzer' | 'audiovisual'>('general');
  const [count, setCount] = useState<number>(5);

  // Generation state
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setStatusMessage(null);
    setSavedSuccess(false);

    try {
      const selectedTopic = topic === 'Custom' ? customTopic || 'General Knowledge' : topic;
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          difficulty,
          roundType,
          count,
        }),
      });

      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
        setStatusMessage(`Successfully generated ${data.questions.length} competition questions!`);
      } else {
        setStatusMessage(data.error || 'Failed to generate questions.');
      }
    } catch (err: any) {
      console.error('Generation failed:', err);
      setStatusMessage(err.message || 'Error communicating with AI generator service.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionTextChange = (qIndex: number, optLabel: 'A' | 'B' | 'C' | 'D', newText: string) => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== qIndex) return q;
        return {
          ...q,
          question_options: q.question_options.map((opt) =>
            opt.option_label === optLabel ? { ...opt, option_text: newText } : opt
          ),
        };
      })
    );
  };

  const handleCorrectOptionChange = (qIndex: number, correctLabel: 'A' | 'B' | 'C' | 'D') => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== qIndex) return q;
        return {
          ...q,
          question_options: q.question_options.map((opt) => ({
            ...opt,
            is_correct: opt.option_label === correctLabel,
          })),
        };
      })
    );
  };

  const handleDeleteQuestion = (qIndex: number) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== qIndex));
  };

  // 1-Click Save to Firestore Database
  const handleSaveToDatabase = async () => {
    if (questions.length === 0) return;
    setSaving(true);
    setStatusMessage(null);

    try {
      let savedCount = 0;
      for (const q of questions) {
        await createQuestion({
          question_text: q.question_text,
          subject_id: q.subject_id,
          difficulty: q.difficulty,
          time_limit: q.time_limit,
          marks: q.marks,
          explanation: q.explanation,
          image_url: q.image_url,
          options: q.question_options.map((opt) => ({
            option_label: opt.option_label,
            option_text: opt.option_text,
            is_correct: opt.is_correct,
          })),
        } as any);
        savedCount++;
      }

      setSavedSuccess(true);
      setStatusMessage(`Successfully saved ${savedCount} questions directly to live Firestore database!`);
    } catch (err: any) {
      console.error('Error saving questions:', err);
      setStatusMessage(`Database save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // 1-Click Export to CSV
  const handleExportCSV = () => {
    if (questions.length === 0) return;

    const headers = ['question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'subject', 'difficulty', 'explanation', 'marks'];
    const rows = questions.map((q) => {
      const optA = q.question_options.find((o) => o.option_label === 'A')?.option_text || '';
      const optB = q.question_options.find((o) => o.option_label === 'B')?.option_text || '';
      const optC = q.question_options.find((o) => o.option_label === 'C')?.option_text || '';
      const optD = q.question_options.find((o) => o.option_label === 'D')?.option_text || '';
      const correctOpt = q.question_options.find((o) => o.is_correct)?.option_label || 'A';

      const escapeCSV = (str: string) => `"${str.replace(/"/g, '""')}"`;

      return [
        escapeCSV(q.question_text),
        escapeCSV(optA),
        escapeCSV(optB),
        escapeCSV(optC),
        escapeCSV(optD),
        correctOpt,
        escapeCSV(q.category),
        q.difficulty,
        escapeCSV(q.explanation),
        q.marks,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smart_mind_ai_questions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/questions" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              AI Question Generator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Instantly generate competition-grade questions for Nepal Parichaya, Science, and National Curriculum.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/questions/import">
            <Button variant="outline" className="text-xs font-semibold rounded-lg border-slate-300">
              CSV Importer
            </Button>
          </Link>
          <Link href="/admin/questions">
            <Button variant="outline" className="text-xs font-semibold rounded-lg border-slate-300">
              Question Bank
            </Button>
          </Link>
        </div>
      </div>

      {/* CONFIGURATION COCKPIT */}
      <Card className="border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm bg-white dark:bg-slate-900">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Zap className="w-4 h-4 text-amber-500" /> Generation Parameters
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Configure syllabus topic, round format, and number of questions to generate.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Topic Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Syllabus Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-10 px-3 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Nepal Parichaya">🇳🇵 Nepal Parichaya & Heritage</option>
                <option value="Science & Technology">🔬 Science & Technology</option>
                <option value="World Geography">🌍 World Geography & Climate</option>
                <option value="History">📜 History & Civilizations</option>
                <option value="Mathematics">🔢 Mathematics & Logic</option>
                <option value="Computer & Tech">💻 Computer & ICT</option>
                <option value="Custom">✨ Custom Topic...</option>
              </select>
            </div>

            {/* Custom Topic Input if selected */}
            {topic === 'Custom' && (
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Custom Topic / Prompt
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Nepali Literature & Bhanubhakta, Space Exploration..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="h-10 text-xs rounded-lg"
                />
              </div>
            )}

            {/* Round Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Target Round Format
              </label>
              <select
                value={roundType}
                onChange={(e) => setRoundType(e.target.value as any)}
                className="w-full h-10 px-3 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="general">Standard (30s time limit)</option>
                <option value="rapid">Rapid Fire (15s speed round)</option>
                <option value="buzzer">Buzzer Round (± penalty)</option>
                <option value="audiovisual">Audio-Visual (Image-based)</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Difficulty Tier
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full h-10 px-3 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="easy">Easy (Fundamentals)</option>
                <option value="medium">Medium (Inter-School Standard)</option>
                <option value="hard">Hard (Finals Tier)</option>
              </select>
            </div>

            {/* Question Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Quantity
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full h-10 px-3 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions (Full Paper)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Generates questions with verified syllabus answers, 4 options, and explanations.
            </span>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-lg min-h-[42px] px-6 shadow-md cursor-pointer flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate Questions with AI</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* STATUS NOTIFICATION */}
      {statusMessage && (
        <div
          className={`p-4 rounded-lg border text-xs font-medium flex items-center justify-between gap-3 animate-fade-in ${
            savedSuccess
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-blue-50 text-blue-800 border-blue-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
          {savedSuccess && (
            <Link href="/admin/questions" className="underline font-bold text-emerald-900 hover:text-emerald-950">
              View Question Bank →
            </Link>
          )}
        </div>
      )}

      {/* GENERATED QUESTIONS LIST & ACTIONS */}
      {questions.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Generated Questions</span>
                <Badge className="bg-blue-100 text-blue-800 border-none font-bold text-xs">
                  {questions.length} Items Ready
                </Badge>
              </h2>
              <p className="text-xs text-slate-500">
                Review and edit any options below before saving to live database or exporting.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="text-xs font-bold rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer min-h-[38px]"
              >
                <Download className="w-4 h-4 text-slate-600" /> Export CSV
              </Button>

              <Button
                onClick={handleSaveToDatabase}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer min-h-[38px] px-4"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                <span>Save All to Firestore</span>
              </Button>
            </div>
          </div>

          {/* QUESTION CARDS */}
          <div className="space-y-4">
            {questions.map((q, qIdx) => (
              <Card key={q.id} className="border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs bg-white dark:bg-slate-900">
                <CardContent className="p-5 space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        {qIdx + 1}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-bold text-slate-600">
                        {q.category}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] capitalize text-slate-500">
                        {q.difficulty}
                      </Badge>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {q.time_limit}s
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(qIdx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      title="Remove question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Question Text
                    </label>
                    <Input
                      value={q.question_text}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuestions((prev) =>
                          prev.map((item, idx) => (idx === qIdx ? { ...item, question_text: val } : item))
                        );
                      }}
                      className="font-semibold text-xs sm:text-sm rounded-lg"
                    />
                  </div>

                  {/* Options (A, B, C, D) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.question_options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-lg border flex items-center gap-2.5 transition-colors ${
                          opt.is_correct
                            ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/30'
                            : 'bg-slate-50/50 border-slate-200 dark:bg-slate-800/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct_${q.id}`}
                          checked={opt.is_correct}
                          onChange={() => handleCorrectOptionChange(qIdx, opt.option_label)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          title="Set as correct answer"
                        />
                        <span className="w-5 h-5 rounded bg-white dark:bg-slate-700 border border-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {opt.option_label}
                        </span>
                        <Input
                          value={opt.option_text}
                          onChange={(e) => handleOptionTextChange(qIdx, opt.option_label, e.target.value)}
                          className="h-8 text-xs bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  <div className="space-y-1 pt-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" /> Educational Explanation
                    </label>
                    <Input
                      value={q.explanation}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuestions((prev) =>
                          prev.map((item, idx) => (idx === qIdx ? { ...item, explanation: val } : item))
                        );
                      }}
                      className="text-xs text-slate-600 dark:text-slate-300 rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
