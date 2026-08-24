'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Printer, Download, ArrowLeft, BookOpen, CheckSquare, FileText, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { getQuestions, getSubjects } from '@/lib/firebase/firestore';
import type { Question, Subject } from '@/lib/types';

export default function ExportQuizPaperPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [paperTitle, setPaperTitle] = useState('PABSON Inter-School Quiz Championship 2083');
  const [schoolName, setSchoolName] = useState('Central Organizing Committee');
  const [examTime, setExamTime] = useState('45 Minutes');
  const [fullMarks, setFullMarks] = useState('50');
  const [viewMode, setViewMode] = useState<'paper' | 'omr' | 'solutions'>('paper');

  useEffect(() => {
    async function loadData() {
      const [qData, sData] = await Promise.all([
        getQuestions({ limitCount: 50 }),
        getSubjects(),
      ]);
      setQuestions(qData);
      setSubjects(sData);
    }
    loadData();
  }, []);

  const filteredQuestions = questions.filter(q =>
    selectedSubject === 'all' || q.subject_id === selectedSubject
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Control Panel (Hidden during Print) */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/questions">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Printable Exam Paper Generator</h1>
              <p className="text-slate-500 text-sm">Generate clean, print-ready PDF exam question sheets and answer keys.</p>
            </div>
          </div>
          <Button onClick={handlePrint} className="bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold px-6 shadow-md cursor-pointer">
            <Printer className="w-4 h-4 mr-2" /> Print / Save as PDF
          </Button>
        </div>

        {/* Configuration Bar */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-blue-600" /> Exam Header & Layout Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Exam / Event Name</label>
                <Input value={paperTitle} onChange={(e) => setPaperTitle(e.target.value)} className="text-xs" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">School / Organization</label>
                <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="text-xs" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Duration</label>
                <Input value={examTime} onChange={(e) => setExamTime(e.target.value)} className="text-xs" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Subject Filter</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full text-xs h-9 border rounded-md px-2 bg-white"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex gap-2 pt-2 border-t">
              <Button
                size="sm"
                variant={viewMode === 'paper' ? 'default' : 'outline'}
                onClick={() => setViewMode('paper')}
                className={viewMode === 'paper' ? 'bg-[#1e3a5f] text-white text-xs' : 'text-xs'}
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Question Paper
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'omr' ? 'default' : 'outline'}
                onClick={() => setViewMode('omr')}
                className={viewMode === 'omr' ? 'bg-[#1e3a5f] text-white text-xs' : 'text-xs'}
              >
                <CheckSquare className="w-3.5 h-3.5 mr-1.5" /> OMR Answer Sheet
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'solutions' ? 'default' : 'outline'}
                onClick={() => setViewMode('solutions')}
                className={viewMode === 'solutions' ? 'bg-[#1e3a5f] text-white text-xs' : 'text-xs'}
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Coordinator Solutions Key
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PRINTABLE PAPER DOCUMENT */}
      <div className="bg-white p-8 sm:p-12 border rounded-xl shadow-lg print:shadow-none print:border-none print:p-0 text-slate-900">
        {/* Paper Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-6 space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600">{schoolName}</h2>
          <h1 className="text-2xl font-black uppercase text-slate-900">{paperTitle}</h1>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 pt-2">
            <span>Time: {examTime}</span>
            <span>Subject: {selectedSubject === 'all' ? 'General & Curriculum' : subjects.find(s => s.id === selectedSubject)?.name}</span>
            <span>Full Marks: {fullMarks}</span>
          </div>
        </div>

        {/* Student Info Line (Printed) */}
        <div className="grid grid-cols-3 gap-4 text-xs font-semibold border-b border-slate-300 pb-3 mb-6">
          <div>Student Name: _______________________</div>
          <div>Roll No / Code: ____________</div>
          <div>School: _______________________</div>
        </div>

        {/* VIEW 1: QUESTION PAPER */}
        {viewMode === 'paper' && (
          <div className="space-y-6">
            <div className="text-xs italic text-slate-500 font-serif">
              Instructions: Read each question carefully. Select the most appropriate option (A, B, C, or D) for each question.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-8 gap-y-6">
              {filteredQuestions.map((q, idx) => (
                <div key={q.id} className="space-y-2 break-inside-avoid">
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    <span className="font-extrabold mr-1">{idx + 1}.</span> {q.question_text}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pl-4 text-xs text-slate-800">
                    {(q.options || []).map((opt, oIdx) => (
                      <div key={opt.id || oIdx} className="flex items-center gap-1.5">
                        <span className="font-bold">({opt.option_label || String.fromCharCode(65 + oIdx)})</span>
                        <span>{opt.option_text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: OMR SHEET */}
        {viewMode === 'omr' && (
          <div className="space-y-6">
            <div className="text-xs text-center font-bold uppercase tracking-wider text-slate-700 border-b pb-2">
              Optical Mark Recognition (OMR) Answer Response Grid
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-4">
              {filteredQuestions.map((q, idx) => (
                <div key={q.id} className="flex items-center justify-between p-2 border rounded text-xs">
                  <span className="font-bold w-6">Q{idx + 1}</span>
                  <div className="flex gap-1.5 font-mono">
                    {['A', 'B', 'C', 'D'].map((bubble) => (
                      <div
                        key={bubble}
                        className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center font-bold text-[10px]"
                      >
                        {bubble}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: SOLUTIONS KEY */}
        {viewMode === 'solutions' && (
          <div className="space-y-6">
            <div className="text-xs text-center font-bold uppercase tracking-wider bg-slate-100 p-2 rounded">
              Coordinator Official Answer Key & Explanations Guide
            </div>

            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => {
                const correctOpt = q.options?.find(o => o.is_correct);
                return (
                  <div key={q.id} className="p-3 border rounded-lg bg-slate-50/50 space-y-1 text-xs">
                    <p className="font-bold text-slate-900">
                      {idx + 1}. {q.question_text}
                    </p>
                    <p className="text-emerald-700 font-bold">
                      Correct Answer: Option {correctOpt?.option_label || 'A'} — {correctOpt?.option_text || q.answers?.[0]?.answer_text}
                    </p>
                    {q.explanation && (
                      <p className="text-slate-500 italic">💡 {q.explanation}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
