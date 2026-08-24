'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTimer } from '@/hooks/use-timer';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  seconds: number;
  onTimeUp: () => void;
  isPaused?: boolean;
  className?: string;
}

export function QuizTimer({ seconds: initialSeconds, onTimeUp, isPaused = false, className }: QuizTimerProps) {
  const { seconds, start, pause, reset } = useTimer({
    initialSeconds,
    onTimeUp,
    autoStart: !isPaused,
  });

  useEffect(() => {
    if (isPaused) {
      pause();
    } else {
      start();
    }
  }, [isPaused, start, pause]);

  useEffect(() => {
    reset(initialSeconds);
    if (!isPaused) {
      start();
    }
  }, [initialSeconds, reset, start, isPaused]);

  const percentage = (seconds / initialSeconds) * 100;
  
  let colorClass = 'text-primary';
  let bgClass = 'bg-primary/20';
  let indicatorClass = 'bg-primary';

  if (percentage <= 25) {
    colorClass = 'text-red-500';
    bgClass = 'bg-red-500/20';
    indicatorClass = 'bg-red-500';
  } else if (percentage <= 50) {
    colorClass = 'text-amber-500';
    bgClass = 'bg-amber-500/20';
    indicatorClass = 'bg-amber-500';
  }

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('flex items-center gap-2 font-mono text-lg font-medium', colorClass, className)}>
      <Clock className="w-5 h-5" />
      <span>{formatTime(seconds)}</span>
      <div className={cn("hidden sm:block h-2 w-24 rounded-full overflow-hidden", bgClass)}>
        <div 
          className={cn("h-full transition-all duration-1000 linear", indicatorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
