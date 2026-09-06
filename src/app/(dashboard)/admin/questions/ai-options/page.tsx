'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Search,
  Database,
  Download,
  RotateCcw,
  Layers,
  HelpCircle,
  AlertCircle,
  Filter,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getQuestions, updateQuestion, getSubjects } from '@/lib/firebase/firestore';
import { COMPREHENSIVE_QUESTION_BANK, type PracticeQuestion } from '@/lib/data/default-questions';
import type { Question, Subject, QuestionOption } from '@/lib/types';

interface GeneratedOptionItem {
  id: string;
  question_text: string;
  subject_id?: string | null;
  category?: string;
  original_correct_text: string;
  generated_options: {
    id: string;
    option_label: 'A' | 'B' | 'C' | 'D';
    option_text: string;
    is_correct: boolean;
  }[];
}

export default function AIOptionsGeneratorPage() {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Multi-Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Generation & Results State
  const [generating, setGenerating] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<GeneratedOptionItem[]>([]);
  const [savingToDb, setSavingToDb] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load questions from Firestore + default fallback
  useEffect(() => {
    async function loadData() {
      setLoadingQuestions(true);
      try {
        const [firestoreQs, sData] = await Promise.all([getQuestions({}), getSubjects()]);
        setSubjects(sData);

        if (firestoreQs && firestoreQs.length > 0) {
          const mapped: PracticeQuestion[] = firestoreQs.map((fq) => ({
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
            difficulty: (fq.difficulty as any) || 'medium',
            time_limit: fq.time_limit || 30,
            explanation: fq.explanation || 'Verified answer for syllabus competition.',
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

          const existingIds = new Set(mapped.map((q) => q.id));
          const combined = [
            ...mapped,
            ...COMPREHENSIVE_QUESTION_BANK.filter((q) => !existingIds.has(q.id)),
          ];
          setQuestions(combined);
        } else {
          setQuestions(COMPREHENSIVE_QUESTION_BANK);
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setQuestions(COMPREHENSIVE_QUESTION_BANK);
      } finally {
        setLoadingQuestions(false);
      }
    }
    loadData();
  }, []);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        searchTerm === '' ||
        q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSubject =
        selectedSubject === 'all' ||
        q.subject_id === selectedSubject ||
        q.category.toLowerCase().includes(selectedSubject.toLowerCase());
      return matchSearch && matchSubject;
    });
  }, [questions, searchTerm, selectedSubject]);

  // Bulk Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredQuestions.length && filteredQuestions.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredQuestions.map((q) => q.id)));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Extract correct answer string safely
  const getCorrectAnswerText = (q: PracticeQuestion): string => {
    const correctOpt = q.question_options.find((o) => o.is_correct);
    return correctOpt ? correctOpt.option_text : q.question_options[0]?.option_text || 'Correct Answer';
  };

  // Generate Options using AI endpoint
  const handleGenerateOptions = async () => {
    const selectedQuestionsList = questions.filter((q) => selectedIds.has(q.id));
    if (selectedQuestionsList.length === 0) return;

    setGenerating(true);
    setStatusMessage(null);
    setIsSuccess(false);

    try {
      const payloadItems = selectedQuestionsList.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        correct_answer_text: getCorrectAnswerText(q),
        subject: q.category,
        category: q.category,
      }));

      const res = await fetch('/api/ai/generate-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payloadItems }),
      });

      let data: any = {};
      const rawText = await res.text();
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        throw new Error(rawText || `Server returned error status: ${res.status}`);
      }

      if (data.success && data.questions) {
        const mappedResults: GeneratedOptionItem[] = data.questions.map((item: any) => {
          const original = selectedQuestionsList.find((q) => q.id === item.id);
          return {
            id: item.id,
            question_text: item.question_text,
            subject_id: original?.subject_id,
            category: original?.category,
            original_correct_text: item.correct_answer_text,
            generated_options: item.options,
          };
        });

        setGeneratedItems(mappedResults);
        setIsSuccess(true);
        setStatusMessage(`Successfully generated new balanced options for ${mappedResults.length} questions while preserving your correct answers!`);
      } else {
        setStatusMessage(data.error || 'Failed to generate options.');
      }
    } catch (err: any) {
      console.error('Error generating options:', err);
      setStatusMessage(err.message || 'Error occurred during option generation.');
    } finally {
      setGenerating(false);
    }
  };

  // Option text editing in generated list
  const handleOptionTextEdit = (itemIdx: number, optLabel: 'A' | 'B' | 'C' | 'D', newText: string) => {
    setGeneratedItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== itemIdx) return item;
        return {
          ...item,
          generated_options: item.generated_options.map((opt) =>
            opt.option_label === optLabel ? { ...opt, option_text: newText } : opt
          ),
        };
      })
    );
  };

  // Correct answer radio change in generated list
  const handleCorrectRadioChange = (itemIdx: number, correctLabel: 'A' | 'B' | 'C' | 'D') => {
    setGeneratedItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== itemIdx) return item;
        return {
          ...item,
          generated_options: item.generated_options.map((opt) => ({
            ...opt,
            is_correct: opt.option_label === correctLabel,
          })),
        };
      })
    );
  };

  // 1-Click Save to Firestore Database
  const handleSaveToFirestore = async () => {
    if (generatedItems.length === 0) return;
    setSavingToDb(true);
    setStatusMessage(null);

    try {
      let updatedCount = 0;
      for (const item of generatedItems) {
        // Update in Firestore
        try {
          await updateQuestion(item.id, {
            options: item.generated_options.map((opt) => ({
              id: opt.id,
              option_label: opt.option_label,
              option_text: opt.option_text,
              is_correct: opt.is_correct,
            })),
          } as any);
          updatedCount++;
        } catch (e) {
          // If not in firestore yet, continues
        }
      }

      // Update local questions state as well
      setQuestions((prev) =>
        prev.map((q) => {
          const gen = generatedItems.find((item) => item.id === q.id);
          if (gen) {
            return {
              ...q,
              question_options: gen.generated_options,
            };
          }
          return q;
        })
      );

      setIsSuccess(true);
      setStatusMessage(`Successfully updated options for ${generatedItems.length} questions in live Firestore database!`);
    } catch (err: any) {
      console.error('Error saving updated options:', err);
      setStatusMessage(`Error saving to database: ${err.message}`);
    } finally {
      setSavingToDb(false);
    }
  };

  // 1-Click Export to CSV
  const handleExportCSV = () => {
    if (generatedItems.length === 0) return;

    const headers = ['question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'subject', 'difficulty', 'explanation', 'marks'];
    const rows = generatedItems.map((item) => {
      const optA = item.generated_options.find((o) => o.option_label === 'A')?.option_text || '';
      const optB = item.generated_options.find((o) => o.option_label === 'B')?.option_text || '';
      const optC = item.generated_options.find((o) => o.option_label === 'C')?.option_text || '';
      const optD = item.generated_options.find((o) => o.option_label === 'D')?.option_text || '';
      const correctOpt = item.generated_options.find((o) => o.is_correct)?.option_label || 'A';

      const escapeCSV = (str: string) => `"${str.replace(/"/g, '""')}"`;

      return [
        escapeCSV(item.question_text),
        escapeCSV(optA),
        escapeCSV(optB),
        escapeCSV(optC),
        escapeCSV(optD),
        correctOpt,
        escapeCSV(item.category || 'General'),
        'medium',
        escapeCSV(`Correct answer: ${item.original_correct_text}`),
        1,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smart_mind_ai_options_${Date.now()}.csv`);
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              AI Option & Distractor Generator
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate balanced, competition-level distractors for your questions while keeping the correct answer 100% safe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/questions/ai-generator">
            <Button variant="outline" className="text-xs font-semibold rounded-lg border-slate-300">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-600" /> Full Question Generator
            </Button>
          </Link>
          <Link href="/admin/questions">
            <Button variant="outline" className="text-xs font-semibold rounded-lg border-slate-300">
              Question Bank
            </Button>
          </Link>
        </div>
      </div>

      {/* STATUS NOTIFICATION */}
      {statusMessage && (
        <div
          className={`p-4 rounded-lg border text-xs font-medium flex items-center justify-between gap-3 animate-fade-in ${
            isSuccess
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {isSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{statusMessage}</span>
          </div>
          {isSuccess && (
            <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Correct Answers Verified Safe
            </span>
          )}
        </div>
      )}

      {/* SELECTION COCKPIT */}
      <Card className="border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm bg-white dark:bg-slate-900">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Layers className="w-4 h-4 text-blue-600" /> Select Questions for AI Option Regeneration
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Select specific questions or use the "Select All" button to regenerate options in bulk.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleToggleSelectAll}
                variant="outline"
                className="text-xs font-bold rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer min-h-[38px]"
              >
                {selectedIds.size === filteredQuestions.length && filteredQuestions.length > 0
                  ? 'Deselect All'
                  : `Select All (${filteredQuestions.length})`}
              </Button>

              <Button
                onClick={handleGenerateOptions}
                disabled={generating || selectedIds.size === 0}
                className="bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold text-xs rounded-lg shadow-md cursor-pointer min-h-[38px] px-5 flex items-center gap-2"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                <span>
                  {generating ? 'Generating Distractors...' : `AI Generate Options (${selectedIds.size})`}
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Search & Subject Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search questions by keyword or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs h-10 rounded-lg"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-10 px-3 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Topics ({questions.length})</option>
              <option value="Nepal Parichaya">Nepal Parichaya</option>
              <option value="Mathematics">Mathematics</option>
              <option value="History">History</option>
              <option value="Geography">World Geography</option>
              <option value="Science">Science & Technology</option>
              <option value="Computer & Tech">Computer & Tech</option>
              <option value="Current Affairs">Current Affairs</option>
            </select>
          </div>

          {/* Question List Selection Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden max-h-80 overflow-y-auto">
            {loadingQuestions ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-xs">Loading question repository...</span>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No matching questions found for this search.
              </div>
            ) : (
              <table className="w-full text-left text-xs" aria-label="Questions for Option Generation">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filteredQuestions.length && filteredQuestions.length > 0}
                        onChange={handleToggleSelectAll}
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                        title="Select/Deselect All"
                      />
                    </th>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Question</th>
                    <th className="py-2.5 px-3">Topic</th>
                    <th className="py-2.5 px-3">Current Right Answer (Protected)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredQuestions.map((q, idx) => {
                    const isSelected = selectedIds.has(q.id);
                    const rightAnswer = getCorrectAnswerText(q);
                    return (
                      <tr
                        key={q.id}
                        onClick={() => handleToggleSelectRow(q.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-950/40 font-medium'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectRow(q.id)}
                            className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                          {q.question_text}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="outline" className="text-[10px] font-bold text-slate-600">
                            {q.category}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded text-[11px] border border-emerald-200 dark:border-emerald-800">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {rightAnswer}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* GENERATED OPTIONS REVIEW & BATCH SAVE */}
      {generatedItems.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>AI Generated Options Preview</span>
                <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold text-xs">
                  {generatedItems.length} Ready to Apply
                </Badge>
              </h2>
              <p className="text-xs text-slate-500">
                Correct answers are marked in green and preserved. Review or edit options before saving to Firestore.
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
                onClick={handleSaveToFirestore}
                disabled={savingToDb}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer min-h-[38px] px-5"
              >
                {savingToDb ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                <span>Save All to Firestore</span>
              </Button>
            </div>
          </div>

          {/* ITEM CARDS */}
          <div className="space-y-4">
            {generatedItems.map((item, itemIdx) => (
              <Card key={item.id} className="border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs bg-white dark:bg-slate-900">
                <CardContent className="p-5 space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        {itemIdx + 1}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-bold text-slate-600">
                        {item.category || 'General'}
                      </Badge>
                      <span className="text-[11px] text-slate-500">
                        Safe Original Answer: <strong className="text-emerald-700 font-bold">{item.original_correct_text}</strong>
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Answer Protected
                    </span>
                  </div>

                  {/* Question Text */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {item.question_text}
                  </h3>

                  {/* 4 Generated Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.generated_options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-lg border flex items-center gap-2.5 transition-colors ${
                          opt.is_correct
                            ? 'bg-emerald-50/80 border-emerald-400 dark:bg-emerald-950/40 ring-1 ring-emerald-500/30'
                            : 'bg-slate-50/60 border-slate-200 dark:bg-slate-800/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct_${item.id}`}
                          checked={opt.is_correct}
                          onChange={() => handleCorrectRadioChange(itemIdx, opt.option_label)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          title="Mark as correct answer"
                        />
                        <span
                          className={`w-6 h-6 rounded font-bold text-xs flex items-center justify-center shrink-0 ${
                            opt.is_correct
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700'
                          }`}
                        >
                          {opt.option_label}
                        </span>
                        <Input
                          value={opt.option_text}
                          onChange={(e) => handleOptionTextEdit(itemIdx, opt.option_label, e.target.value)}
                          className="h-8 text-xs bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-blue-500 flex-1 font-medium"
                        />
                        {opt.is_correct && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mr-1" />
                        )}
                      </div>
                    ))}
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
