'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, ArrowRight, BookOpen, AlertCircle, Volume2, VolumeX, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuizTimer } from './quiz-timer';
import { soundFx } from '@/lib/audio';

export interface QuizQuestionData {
  id: string;
  question_text: string;
  question_type: string;
  difficulty: string;
  time_limit: number;
  explanation?: string;
  options?: { id: string; option_text: string; option_label: string; is_correct?: boolean }[];
  media?: { media_type: string; file_url: string; caption?: string }[];
}

export interface ResponseData {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  isSkipped: boolean;
  responseTimeMs: number;
}

export interface QuizResults {
  totalQuestions: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
  avgResponseTime: number;
  responses: ResponseData[];
}

interface QuizPlayerProps {
  questions: QuizQuestionData[];
  sessionType: string;
  subjectName?: string;
  topicName?: string;
  onComplete: (results: QuizResults) => void;
  timeLimit?: number;
}

export function QuizPlayer({ questions, sessionType, subjectName, topicName, onComplete, timeLimit }: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [directAnswer, setDirectAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  
  // Set start time on mount or when current index changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentIndex]);
  
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex) / questions.length) * 100;
  const qTimeLimit = currentQuestion?.time_limit || timeLimit || 60;

  const correctOption = useMemo(() => {
    if (!currentQuestion?.options) return null;
    return currentQuestion.options.find(o => o.is_correct) || currentQuestion.options[0]; 
  }, [currentQuestion]);

  const handleAnswerSubmit = useCallback((answer: string | null = selectedOption) => {
    if (showFeedback) return;
    
    const responseTimeMs = Date.now() - questionStartTime;
    const isSkipped = answer === null;
    let isCorrect = false;

    if (currentQuestion.question_type === 'mcq' || currentQuestion.question_type === 'tf') {
      isCorrect = answer === correctOption?.id;
    } else if (currentQuestion.question_type === 'direct') {
      isCorrect = answer?.trim().toLowerCase() === correctOption?.option_text?.toLowerCase();
    }

    if (isCorrect) {
      soundFx.playCorrect();
    } else if (!isSkipped) {
      soundFx.playIncorrect();
    }

    setResponses(prev => [...prev, {
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      isCorrect,
      isSkipped,
      responseTimeMs
    }]);

    setSelectedOption(answer);
    setShowFeedback(true);
  }, [showFeedback, questionStartTime, currentQuestion, correctOption, selectedOption]);

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      const correctCount = responses.filter(r => r.isCorrect).length;
      const incorrectCount = responses.filter(r => !r.isCorrect && !r.isSkipped).length;
      const skippedCount = responses.filter(r => r.isSkipped).length;
      const accuracy = responses.length > 0 ? (correctCount / responses.length) * 100 : 0;
      const avgTime = responses.length > 0 ? responses.reduce((acc, r) => acc + r.responseTimeMs, 0) / responses.length : 0;

      onComplete({
        totalQuestions: questions.length,
        correct: correctCount,
        incorrect: incorrectCount,
        skipped: skippedCount,
        accuracy,
        avgResponseTime: avgTime,
        responses
      });
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setDirectAnswer('');
      setShowFeedback(false);
    }
  }, [isLastQuestion, responses, onComplete, questions.length]);

  const handleTimeUp = useCallback(() => {
    if (!showFeedback) {
      handleAnswerSubmit(null);
    }
  }, [showFeedback, handleAnswerSubmit]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showFeedback && e.key === 'Enter') {
        handleNext();
        return;
      }
      
      if (!showFeedback && (currentQuestion.question_type === 'mcq' || currentQuestion.question_type === 'tf')) {
        const options = currentQuestion.options || [];
        const numKey = parseInt(e.key);
        if (!isNaN(numKey) && numKey > 0 && numKey <= options.length) {
          handleAnswerSubmit(options[numKey - 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFeedback, currentQuestion, handleNext, handleAnswerSubmit]);

  if (!currentQuestion) return null;

  const currentResponse = responses.find(r => r.questionId === currentQuestion.id);

  return (
    <div className="flex flex-col min-h-[80vh] max-w-3xl mx-auto p-4 md:p-6 w-full font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          {(subjectName || topicName) && (
            <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-1">
              {subjectName} {topicName && `· ${topicName}`}
            </div>
          )}
          <h2 className="text-lg font-semibold text-foreground">
            Question {String(currentIndex + 1).padStart(2, '0')} / {questions.length}
          </h2>
        </div>
        <QuizTimer 
          seconds={qTimeLimit} 
          onTimeUp={handleTimeUp} 
          isPaused={showFeedback}
        />
      </div>

      <Progress value={progress} className="h-2 mb-8 bg-muted" />

      <div className="flex-grow flex flex-col justify-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground leading-tight mb-8">
          {currentQuestion.question_text}
        </h1>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 w-full max-w-2xl mx-auto">
          {currentQuestion.question_type !== 'direct' && currentQuestion.options?.map((option, idx) => {
            const isSelected = selectedOption === option.id;
            const isCorrectAnswer = correctOption?.id === option.id;
            
            let btnClass = "relative flex items-center p-4 sm:p-5 w-full text-left bg-card hover:bg-accent hover:text-accent-foreground border-2 border-muted transition-all duration-200 rounded-xl group";
            
            if (showFeedback) {
              if (isCorrectAnswer) {
                btnClass = "relative flex items-center p-4 sm:p-5 w-full text-left bg-green-500/10 border-2 border-green-500 text-green-900 dark:text-green-100 rounded-xl";
              } else if (isSelected && !isCorrectAnswer) {
                btnClass = "relative flex items-center p-4 sm:p-5 w-full text-left bg-red-500/10 border-2 border-red-500 text-red-900 dark:text-red-100 rounded-xl opacity-75";
              } else {
                btnClass = "relative flex items-center p-4 sm:p-5 w-full text-left bg-card border-2 border-muted rounded-xl opacity-50";
              }
            } else if (isSelected) {
              btnClass = "relative flex items-center p-4 sm:p-5 w-full text-left bg-primary/10 border-2 border-primary text-primary-foreground rounded-xl";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSubmit(option.id)}
                disabled={showFeedback}
                className={btnClass}
              >
                <span className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-md bg-muted text-muted-foreground font-bold mr-4 shrink-0 transition-colors",
                  showFeedback && isCorrectAnswer && "bg-green-500 text-white",
                  showFeedback && isSelected && !isCorrectAnswer && "bg-red-500 text-white",
                  !showFeedback && "group-hover:bg-primary group-hover:text-primary-foreground"
                )}>
                  {option.option_label || String.fromCharCode(65 + idx)}
                </span>
                <span className="text-lg font-medium">{option.option_text}</span>
                
                {showFeedback && isCorrectAnswer && (
                  <CheckCircle2 className="w-6 h-6 text-green-500 absolute right-4" />
                )}
                {showFeedback && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-6 h-6 text-red-500 absolute right-4" />
                )}
              </button>
            );
          })}

          {currentQuestion.question_type === 'direct' && (
            <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
              <Input
                value={directAnswer}
                onChange={(e) => setDirectAnswer(e.target.value)}
                placeholder="Type your answer here..."
                disabled={showFeedback}
                className="text-lg p-6 rounded-xl border-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !showFeedback && directAnswer.trim()) {
                    handleAnswerSubmit(directAnswer);
                  }
                }}
              />
              {!showFeedback && (
                <Button 
                  onClick={() => handleAnswerSubmit(directAnswer)}
                  disabled={!directAnswer.trim()}
                  className="w-full py-6 text-lg rounded-xl"
                >
                  Submit Answer
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {showFeedback && currentResponse && (
        <div className="mt-auto animate-in slide-in-from-bottom-4 fade-in duration-300">
          <Card className={cn(
            "border-2 mb-4",
            currentResponse.isCorrect ? "bg-green-500/10 border-green-200 dark:border-green-900" : 
            currentResponse.isSkipped ? "bg-amber-500/10 border-amber-200 dark:border-amber-900" : 
            "bg-red-500/10 border-red-200 dark:border-red-900"
          )}>
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  {currentResponse.isCorrect ? (
                    <><CheckCircle2 className="w-6 h-6 text-green-600" /><span className="text-xl font-bold text-green-700 dark:text-green-400">Correct!</span></>
                  ) : currentResponse.isSkipped ? (
                    <><AlertCircle className="w-6 h-6 text-amber-600" /><span className="text-xl font-bold text-amber-700 dark:text-amber-400">Time's up!</span></>
                  ) : (
                    <><XCircle className="w-6 h-6 text-red-600" /><span className="text-xl font-bold text-red-700 dark:text-red-400">Incorrect</span></>
                  )}
                </div>
                
                {currentQuestion.explanation && (
                  <div className="flex gap-2 mt-3 text-sm text-muted-foreground bg-background/50 p-3 rounded-lg border">
                    <BookOpen className="w-5 h-5 shrink-0 text-primary" />
                    <p>{currentQuestion.explanation}</p>
                  </div>
                )}
                
                {!currentResponse.isCorrect && currentQuestion.question_type === 'direct' && (
                  <p className="mt-2 text-sm font-medium">Correct answer: <span className="font-bold">{correctOption?.option_text}</span></p>
                )}
              </div>
              
              <Button 
                onClick={handleNext} 
                className="w-full md:w-auto py-6 px-8 text-lg rounded-xl whitespace-nowrap bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shrink-0"
              >
                {isLastQuestion ? 'View Results' : 'Next Question'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
