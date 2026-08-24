'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Clock, CheckCircle2, XCircle, SkipForward, ArrowLeft, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuizResults as QuizResultsType } from './quiz-player';

interface QuizResultsProps {
  results: QuizResultsType;
  subjectName?: string;
  topicName?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export function QuizResultsComponent({ results, subjectName, topicName, onRetry, onGoBack }: QuizResultsProps) {
  const { totalQuestions, correct, incorrect, skipped, accuracy, avgResponseTime } = results;

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    return `${m}m ${s % 60}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto p-4 w-full">
      <Card className="w-full shadow-lg border-primary/10">
        <CardHeader className="text-center pb-2">
          {(subjectName || topicName) && (
            <div className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-1">
              {subjectName} {topicName && `· ${topicName}`}
            </div>
          )}
          <CardTitle className="text-3xl font-bold text-primary">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-4">
          <div className="flex justify-center">
            <div className="relative flex items-center justify-center w-48 h-48 rounded-full border-8 border-muted">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8%"
                  className={cn(
                    "transition-all duration-1000 ease-out",
                    accuracy >= 80 ? "text-green-500" : accuracy >= 50 ? "text-amber-500" : "text-red-500"
                  )}
                  strokeDasharray={`${(accuracy / 100) * 283} 283`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <div className="text-4xl font-bold">{Math.round(accuracy)}%</div>
                <div className="text-sm text-muted-foreground font-medium">Accuracy</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-3 bg-muted/50 rounded-xl">
              <Target className="w-6 h-6 text-primary mb-2" />
              <div className="text-2xl font-bold">{totalQuestions}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-green-500/10 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-700">{correct}</div>
              <div className="text-xs text-green-600/80">Correct</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-red-500/10 rounded-xl">
              <XCircle className="w-6 h-6 text-red-600 mb-2" />
              <div className="text-2xl font-bold text-red-700">{incorrect}</div>
              <div className="text-xs text-red-600/80">Incorrect</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-amber-500/10 rounded-xl">
              <SkipForward className="w-6 h-6 text-amber-600 mb-2" />
              <div className="text-2xl font-bold text-amber-700">{skipped}</div>
              <div className="text-xs text-amber-600/80">Skipped</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Avg. Response Time: {formatTime(avgResponseTime)}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {onGoBack && (
              <Button variant="outline" className="flex-1" onClick={onGoBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subjects
              </Button>
            )}
            {onRetry && (
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={onRetry}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Practice Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
