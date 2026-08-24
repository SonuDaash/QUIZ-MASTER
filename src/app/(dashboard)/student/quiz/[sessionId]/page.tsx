'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuizPlayer, QuizQuestionData, QuizResults } from '@/components/quiz/quiz-player';
import { QuizResultsComponent } from '@/components/quiz/quiz-results';
import { getQuestions, recordStudentMistake } from '@/lib/firebase/firestore';
import { useAuth } from '@/components/auth-provider';
import { RefreshCw } from 'lucide-react';

const FALLBACK_QUESTIONS: QuizQuestionData[] = [
  {
    id: 'q1',
    question_text: 'What is the highest mountain peak in the world?',
    question_type: 'mcq',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'Mount Everest (Sagarmatha) is the highest peak at 8,848.86 meters above sea level.',
    options: [
      { id: 'o1', option_text: 'K2', option_label: 'A' },
      { id: 'o2', option_text: 'Kangchenjunga', option_label: 'B' },
      { id: 'o3', option_text: 'Mount Everest', option_label: 'C', is_correct: true },
      { id: 'o4', option_text: 'Lhotse', option_label: 'D' }
    ]
  },
  {
    id: 'q2',
    question_text: 'Which organelle is known as the powerhouse of the cell?',
    question_type: 'mcq',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'Mitochondria generate most of the chemical energy needed to power the cell.',
    options: [
      { id: 'o1', option_text: 'Ribosome', option_label: 'A' },
      { id: 'o2', option_text: 'Mitochondria', option_label: 'B', is_correct: true },
      { id: 'o3', option_text: 'Nucleus', option_label: 'C' },
      { id: 'o4', option_text: 'Golgi Apparatus', option_label: 'D' }
    ]
  },
  {
    id: 'q3',
    question_text: 'What does "HTML" stand for in Computer Science?',
    question_type: 'mcq',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'HTML stands for HyperText Markup Language.',
    options: [
      { id: 'o1', option_text: 'Hyper Text Multiple Language', option_label: 'A' },
      { id: 'o2', option_text: 'Hyper Text Markup Language', option_label: 'B', is_correct: true },
      { id: 'o3', option_text: 'High Tech Modern Language', option_label: 'C' },
      { id: 'o4', option_text: 'Hyper Transfer Markup Language', option_label: 'D' }
    ]
  },
  {
    id: 'q4',
    question_text: 'Water boils at 100 degrees Celsius at sea level.',
    question_type: 'tf',
    difficulty: 'easy',
    time_limit: 20,
    explanation: 'At standard atmospheric pressure (1 atm, at sea level), the boiling point of water is 100°C.',
    options: [
      { id: 'o1', option_text: 'True', option_label: 'T', is_correct: true },
      { id: 'o2', option_text: 'False', option_label: 'F' }
    ]
  },
  {
    id: 'q5',
    question_text: 'What is the chemical symbol for Gold?',
    question_type: 'direct',
    difficulty: 'medium',
    time_limit: 35,
    explanation: 'The chemical symbol for Gold is Au, derived from Latin "aurum".',
    options: [
      { id: 'o1', option_text: 'Au', option_label: '', is_correct: true }
    ]
  }
];

export default function QuizSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const sessionId = params?.sessionId as string;

  const [questions, setQuestions] = useState<QuizQuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<QuizResults | null>(null);

  useEffect(() => {
    async function loadQuizQuestions() {
      try {
        const firestoreQuestions = await getQuestions({ limitCount: 15 });
        if (firestoreQuestions.length > 0) {
          const formatted: QuizQuestionData[] = firestoreQuestions.map(q => ({
            id: q.id,
            question_text: q.question_text,
            question_type: q.question_type || 'mcq',
            difficulty: q.difficulty || 'easy',
            time_limit: q.time_limit || 30,
            explanation: q.explanation || '',
            options: (q.options || []).map((opt: any) => ({
              id: opt.id,
              option_text: opt.option_text,
              option_label: opt.option_label,
              is_correct: opt.is_correct,
            })),
          }));
          setQuestions(formatted);
        } else {
          setQuestions(FALLBACK_QUESTIONS);
        }
      } catch (err) {
        console.error('Error fetching quiz questions:', err);
        setQuestions(FALLBACK_QUESTIONS);
      } finally {
        setLoading(false);
      }
    }
    loadQuizQuestions();
  }, [sessionId]);

  const handleQuizComplete = async (quizResults: QuizResults) => {
    setResults(quizResults);

    // Save to Firestore via API
    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          responses: quizResults.responses.map((r, i) => ({
            questionId: r.questionId,
            selectedAnswer: r.selectedAnswer,
            isCorrect: r.isCorrect,
            isSkipped: r.isSkipped,
            responseTimeMs: r.responseTimeMs,
            marksAwarded: r.isCorrect ? 1 : 0,
            questionOrder: i + 1,
          })),
        }),
      });

      // Record mistakes into student_mistakes
      if (user) {
        for (const resp of quizResults.responses) {
          if (!resp.isCorrect && !resp.isSkipped) {
            const questionData = questions.find(q => q.id === resp.questionId);
            await recordStudentMistake(
              user.id,
              resp.questionId,
              resp.selectedAnswer || 'Incorrect',
              questionData ? { question_text: questionData.question_text, explanation: questionData.explanation } : undefined
            );
          }
        }
      }
    } catch (e) {
      console.error('Error submitting quiz results:', e);
    }
  };

  const handleRetry = () => {
    setResults(null);
    router.refresh();
  };

  const handleBackToDashboard = () => {
    router.push('/student');
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium">Preparing questions for your session...</p>
      </div>
    );
  }

  if (results) {
    return (
      <QuizResultsComponent
        results={results}
        onRetry={handleRetry}
        onGoBack={handleBackToDashboard}
      />
    );
  }

  return (
    <QuizPlayer
      questions={questions}
      sessionType="Practice Drill"
      onComplete={handleQuizComplete}
    />
  );
}
