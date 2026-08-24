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
import {
  Plus,
  Upload,
  Search,
  Trash2,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  FileText,
} from 'lucide-react';
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(50);

  async function fetchQuestions() {
    setLoading(true);
    try {
      // Fetch ALL questions without artificial limit
      const [qData, sData] = await Promise.all([
        getQuestions({}),
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

  // Filter questions across ALL loaded questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question_text?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || q.subject_id === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSubject, selectedDifficulty, pageSize]);

  // Paginate questions
  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredQuestions.length / (pageSize as number)) || 1;
  const startIndex = pageSize === 'all' ? 0 : (currentPage - 1) * (pageSize as number);
  const endIndex = pageSize === 'all' ? filteredQuestions.length : Math.min(startIndex + (pageSize as number), filteredQuestions.length);
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

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

  // Select All on current view vs Select All filtered
  const handleToggleSelectCurrentPage = () => {
    const pageIds = paginatedQuestions.map(q => q.id);
    const allPageSelected = pageIds.every(id => selectedIds.has(id));

    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageIds.forEach(id => next.delete(id));
      } else {
        pageIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    setSelectedIds(new Set(filteredQuestions.map(q => q.id)));
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

  const isCurrentPageAllSelected = paginatedQuestions.length > 0 && paginatedQuestions.every(q => selectedIds.has(q.id));
  const isCurrentPageSomeSelected = paginatedQuestions.some(q => selectedIds.has(q.id)) && !isCurrentPageAllSelected;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Question Bank</h1>
          <p className="text-slate-500 mt-1">
            Manage and organize your question repository (<span className="font-bold text-slate-900">{questions.length} total questions</span> in Firestore).
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/questions/export">
            <Button variant="outline" className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
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
        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder={`Search ${questions.length} questions by text...`}
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

          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-xs text-slate-500 whitespace-nowrap font-medium">Per Page:</label>
            <select
              value={String(pageSize)}
              onChange={(e) => setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-2 py-2 border rounded-md text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="250">250</option>
              <option value="500">500</option>
              <option value="all">All ({filteredQuestions.length})</option>
            </select>
          </div>

          <Button variant="ghost" size="icon" onClick={fetchQuestions} title="Refresh questions" className="shrink-0">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* BULK ACTION BAR */}
        {selectedIds.size > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg gap-2 animate-fade-in">
            <div className="flex items-center gap-3">
              <Badge className="bg-red-600 text-white font-bold px-2.5 py-0.5">
                {selectedIds.size} Selected
              </Badge>
              <span className="text-xs text-red-800 font-medium">
                Selected across your question repository
              </span>
              {selectedIds.size < filteredQuestions.length && (
                <button
                  onClick={handleSelectAllFiltered}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Select all {filteredQuestions.length} matching questions
                </button>
              )}
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

        {/* Range and count indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-800">{filteredQuestions.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
            <strong className="text-slate-800">{endIndex}</strong> of{' '}
            <strong className="text-slate-800">{filteredQuestions.length}</strong> matching questions
            {filteredQuestions.length !== questions.length && ` (filtered from ${questions.length} total)`}
          </span>
          {pageSize !== 'all' && (
            <span>
              Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
              <strong className="text-slate-800">{totalPages}</strong>
            </span>
          )}
        </div>

        {/* Questions Table */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                {/* Select All Checkbox on Current Page */}
                <TableHead className="w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isCurrentPageAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isCurrentPageSomeSelected;
                    }}
                    onChange={handleToggleSelectCurrentPage}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    title={isCurrentPageAllSelected ? "Deselect page" : "Select current page"}
                  />
                </TableHead>
                <TableHead className="w-[45%]">Question Text</TableHead>
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
                    Loading all questions from Firestore...
                  </TableCell>
                </TableRow>
              ) : paginatedQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    No questions found matching your filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedQuestions.map((q) => {
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

        {/* Pagination Bar */}
        {pageSize !== 'all' && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                title="First Page"
                className="h-8 px-2"
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="h-8 text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              <div className="flex items-center gap-1 px-2 text-xs font-mono">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded text-xs font-semibold ${
                        currentPage === pageNum
                          ? 'bg-[#1e3a5f] text-white'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="h-8 text-xs font-semibold"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                title="Last Page"
                className="h-8 px-2"
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
