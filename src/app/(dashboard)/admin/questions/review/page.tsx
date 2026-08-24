'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, Search, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getQuestions, reviewQuestion } from '@/lib/firebase/firestore';
import type { Question } from '@/lib/types';

export default function ReviewQueuePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  async function fetchReviewQuestions() {
    setLoading(true);
    try {
      const all = await getQuestions({});
      // Show questions that need review or all if few exist
      const needsReview = all.filter(q => q.verification_status === 'needs_review');
      setQuestions(needsReview.length > 0 ? needsReview : all);
    } catch (err) {
      console.error('Error loading review queue:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviewQuestions();
  }, []);

  const handleReview = async (id: string, status: 'verified' | 'rejected') => {
    setActionLoadingId(id);
    try {
      await reviewQuestion(id, status);
      setQuestions(prev => prev.map(q => q.id === id ? { ...q, verification_status: status } : q));
    } catch (err) {
      console.error('Error reviewing question:', err);
      alert('Failed to update question status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = questions.filter(q =>
    q.question_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Review Queue</h1>
          <p className="text-slate-500 mt-1">Review imported or submitted questions before activating them for tests.</p>
        </div>
        <Button variant="outline" onClick={fetchReviewQuestions} className="flex items-center gap-1.5 cursor-pointer">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search questions in queue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[50%]">Question</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead className="text-right">Verification Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading questions...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    Review queue is clear! All questions are verified.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>
                      <p className="font-medium text-slate-900 line-clamp-2">{q.question_text}</p>
                      {q.explanation && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">💡 {q.explanation}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px] font-normal uppercase">
                        {q.difficulty || 'Easy'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {q.question_type || 'MCQ'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs font-normal border-none ${
                          q.verification_status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : q.verification_status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {q.verification_status || 'needs_review'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoadingId === q.id || q.verification_status === 'rejected'}
                          onClick={() => handleReview(q.id, 'rejected')}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 h-8 px-2.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          disabled={actionLoadingId === q.id || q.verification_status === 'verified'}
                          onClick={() => handleReview(q.id, 'verified')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-2.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
