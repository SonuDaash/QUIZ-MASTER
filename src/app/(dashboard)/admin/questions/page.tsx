'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Upload, Search, Trash2, CheckCircle, RefreshCw, AlertCircle, CheckSquare, Square, Loader2 } from 'lucide-react';
import { getQuestions, deleteQuestion, getSubjects } from '@/lib/firebase/firestore';
import type { Question, Subject } from '@/lib/types';

export default function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Multi-selection states
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  async function fetchQuestions() {
    setLoading(true);
    try {
      const [qData, sData] = await Promise.all([
        getQuestions({ limitCount: 100 }),
        getSubjects(),
      ]);
      setQuestions(qData);
      setSubjects(sData);
      setSelectedIds(new Set()); // Reset selection on reload
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question_text?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || q.subject_id === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  // Single Question Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    setDeletingId(id);
    try {
      await deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error('Error deleting question:', err);
      alert('Failed to delete question.');
    } finally {
      setDeletingId(null);
    }
  };

  // Select All / Deselect All
  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredQuestions.length && filteredQuestions.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredQuestions.map(q => q.id)));
    }
  };

  // Toggle single row selection
  const handleToggleSelectRow = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Bulk Delete Selected Questions
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    if (!confirm(`Are you sure you want to delete ${count} selected question${count > 1 ? 's' : ''}? This action cannot be undone.`)) {
      return;
    }

    setBulkDeleting(true);
    try {
      const idsToDelete = Array.from(selectedIds);
      await Promise.all(idsToDelete.map(id => deleteQuestion(id)));
      setQuestions(prev => prev.filter(q => !selectedIds.has(q.id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Error deleting selected questions:', err);
      alert('Failed to delete some questions.');
    } finally {
      setBulkDeleting(false);
    }
  };

  const isAllSelected = filteredQuestions.length > 0 && selectedIds.size === filteredQuestions.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < filteredQuestions.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Question Bank</h1>
          <p className="text-slate-500 mt-1">Manage and organize your question repository ({questions.length} total in Firestore).</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/questions/export">
            <Button variant="outline" className="cursor-pointer">
              Print / Export PDF
            </Button>
          </Link>
          <Link href="/admin/questions/import">
            <Button variant="outline" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </Link>
          <Link href="/admin/questions/new">
            <Button className="bg-[#1e3a5f] hover:bg-[#152840] text-white cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search question text..." 
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <Button variant="ghost" size="icon" onClick={fetchQuestions} title="Refresh questions" className="shrink-0">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* BULK ACTION BAR (Shown when 1 or more questions are selected) */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
            <div className="flex items-center gap-3">
              <Badge className="bg-red-600 text-white font-bold px-2.5 py-0.5">
                {selectedIds.size} Selected
              </Badge>
              <span className="text-xs text-red-800 font-medium hidden sm:inline">
                You have selected {selectedIds.size} of {filteredQuestions.length} questions
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-slate-600 hover:bg-red-100"
              >
                Deselect All
              </Button>
              <Button
                size="sm"
                disabled={bulkDeleting}
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {bulkDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Delete Selected ({selectedIds.size})
              </Button>
            </div>
          </div>
        )}

        {/* Questions Table */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                {/* Master Select All Checkbox */}
                <TableHead className="w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={handleToggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    title={isAllSelected ? "Deselect all" : "Select all"}
                  />
                </TableHead>
                <TableHead className="w-[45%]">Question</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading questions from Firestore...
                  </TableCell>
                </TableRow>
              ) : filteredQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    No questions found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuestions.map((q) => {
                  const isChecked = selectedIds.has(q.id);
                  return (
                    <TableRow key={q.id} className={isChecked ? 'bg-blue-50/40' : ''}>
                      {/* Single Row Selection Checkbox */}
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectRow(q.id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900 line-clamp-2">{q.question_text}</div>
                        {q.explanation && (
                          <div className="text-xs text-slate-400 mt-1 line-clamp-1">💡 {q.explanation}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={`text-[11px] font-normal uppercase ${
                            q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700' :
                            q.difficulty === 'medium' ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-700'
                          }`}
                        >
                          {q.difficulty || 'Easy'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 uppercase">
                          {q.question_type || 'MCQ'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold text-slate-700">{q.marks || 1}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-normal text-xs">
                          {q.verification_status || 'Verified'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deletingId === q.id || bulkDeleting}
                          onClick={() => handleDelete(q.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          title="Delete question"
                        >
                          {deletingId === q.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
