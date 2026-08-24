'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Timer, CheckCircle, XCircle, SkipForward, Play, Zap, Flame, Trophy, RotateCcw } from 'lucide-react';
import { getQuestions } from '@/lib/firebase/firestore';
import { soundFx } from '@/lib/audio';

const DEFAULT_RAPID_QUESTIONS = [
  { q: 'Capital of Japan?', a: 'Tokyo' },
  { q: 'Chemical symbol for Gold?', a: 'Au' },
  { q: 'Largest planet in solar system?', a: 'Jupiter' },
  { q: 'Who painted Mona Lisa?', a: 'Leonardo da Vinci' },
  { q: 'How many bones in human body?', a: '206' },
  { q: 'Capital of Australia?', a: 'Canberra' },
  { q: 'Who discovered gravity?', a: 'Isaac Newton' },
  { q: 'Largest ocean on Earth?', a: 'Pacific Ocean' },
  { q: 'How many districts in Nepal?', a: '77' },
  { q: 'What is the currency of Japan?', a: 'Yen' },
];

export default function RapidFirePage() {
  const [questions, setQuestions] = useState(DEFAULT_RAPID_QUESTIONS);
  const [status, setStatus] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answerInput, setAnswerInput] = useState('');
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, passed: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadFirestoreQuestions() {
      try {
        const firestoreData = await getQuestions({ limitCount: 20 });
        if (firestoreData.length >= 5) {
          const formatted = firestoreData.map(q => {
            const correctOpt = q.options?.find((o: any) => o.is_correct);
            const ansText = correctOpt ? correctOpt.option_text : (q.answers?.[0]?.answer_text || 'Yes');
            return {
              q: q.question_text,
              a: ansText,
            };
          });
          setQuestions(formatted);
        }
      } catch (e) {
        console.error('Error fetching rapid fire questions:', e);
      }
    }
    loadFirestoreQuestions();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && status === 'playing') {
      setStatus('finished');
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  useEffect(() => {
    if (status === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status, currentIndex]);

  const handleStart = () => {
    setStatus('playing');
    setStats({ correct: 0, wrong: 0, passed: 0 });
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(60);
    setCurrentIndex(0);
    setAnswerInput('');
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswerInput('');
    } else {
      setStatus('finished');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!answerInput.trim()) return;

    const currentQ = questions[currentIndex];
    const isCorrect = currentQ.a.toLowerCase().trim().includes(answerInput.toLowerCase().trim()) ||
                      answerInput.toLowerCase().trim().includes(currentQ.a.toLowerCase().trim());

    if (isCorrect) {
      if (streak + 1 >= 3 && (streak + 1) % 3 === 0) {
        soundFx.playStreak();
      } else {
        soundFx.playCorrect();
      }
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });
    } else {
      soundFx.playIncorrect();
      setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
      setStreak(0);
    }

    nextQuestion();
  };

  const handlePass = () => {
    setStats(prev => ({ ...prev, passed: prev.passed + 1 }));
    setStreak(0);
    nextQuestion();
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Zap className="h-8 w-8 text-amber-500 fill-amber-500" /> Rapid Fire Sprint
        </h1>
        <p className="text-slate-500 mt-1">Answer as many questions as you can in 60 seconds!</p>
      </div>

      {status === 'ready' && (
        <Card className="text-center p-8 bg-gradient-to-b from-blue-50/50 to-white border-blue-200">
          <CardContent className="space-y-6 pt-6">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Zap className="h-10 w-10 fill-amber-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Ready for the 60-Second Challenge?</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Type your answer and hit <kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-xs">Enter</kbd>, or press Pass to skip.
              </p>
            </div>
            <Button size="lg" onClick={handleStart} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 shadow-md cursor-pointer">
              <Play className="mr-2 h-5 w-5 fill-current" /> Start Rapid Fire
            </Button>
          </CardContent>
        </Card>
      )}

      {status === 'playing' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center gap-2 font-mono text-2xl font-bold text-slate-800">
              <Timer className={`h-6 w-6 ${timeLeft <= 10 ? 'text-red-500 animate-bounce' : 'text-blue-600'}`} />
              <span className={timeLeft <= 10 ? 'text-red-500' : ''}>{timeLeft}s</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Flame className="w-4 h-4 fill-amber-500" /> {streak} Streak
              </div>
              <div className="text-sm font-semibold text-slate-600">
                Q {currentIndex + 1} / {questions.length}
              </div>
            </div>
          </div>

          <Card className="border-2 border-slate-200 shadow-md">
            <CardContent className="p-8 space-y-6">
              <div className="min-h-[100px] flex items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-slate-900 leading-snug">
                  {questions[currentIndex]?.q}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  ref={inputRef}
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="Type your answer here..."
                  className="text-lg text-center h-12 border-2 focus-visible:ring-amber-500"
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePass}
                    className="flex-1 text-slate-600 hover:bg-slate-100"
                  >
                    <SkipForward className="mr-2 h-4 w-4" /> Pass
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#1e3a5f] hover:bg-[#152840] text-white font-semibold"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {status === 'finished' && (
        <Card className="text-center p-8 bg-white border-slate-200 shadow-lg">
          <CardContent className="space-y-6 pt-4">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="h-10 w-10 text-amber-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Sprint Complete!</h2>
              <p className="text-slate-500 mt-1">Here is how you performed in 60 seconds</p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-3xl font-extrabold text-emerald-700">{stats.correct}</p>
                <p className="text-xs font-semibold text-emerald-800 mt-1">Correct</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                <p className="text-3xl font-extrabold text-rose-700">{stats.wrong}</p>
                <p className="text-xs font-semibold text-rose-800 mt-1">Wrong</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-3xl font-extrabold text-amber-700">{maxStreak}</p>
                <p className="text-xs font-semibold text-amber-800 mt-1">Max Streak</p>
              </div>
            </div>

            <Button size="lg" onClick={handleStart} className="bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold px-8 cursor-pointer">
              <RotateCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
