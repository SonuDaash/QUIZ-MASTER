'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Play, Check, X, Timer, Trophy, Zap, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { getQuestions } from '@/lib/firebase/firestore';
import { soundFx } from '@/lib/audio';

const DEFAULT_BUZZER_QUESTIONS = [
  { q: "Which planet is known as the Red Planet?", a: "Mars" },
  { q: "What is the highest mountain peak in the world?", a: "Mount Everest" },
  { q: "Who wrote Romeo and Juliet?", a: "William Shakespeare" },
  { q: "What is the capital city of Australia?", a: "Canberra" },
  { q: "What is the chemical formula for table salt?", a: "NaCl" },
];

export default function BuzzerTrainingPage() {
  const [questions, setQuestions] = useState(DEFAULT_BUZZER_QUESTIONS);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'reading' | 'buzzed' | 'result'>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [answerTimeLeft, setAnswerTimeLeft] = useState(10);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const firestoreQuestions = await getQuestions({ limitCount: 15 });
        if (firestoreQuestions.length >= 3) {
          setQuestions(firestoreQuestions.map(q => {
            const opt = q.options?.find((o: any) => o.is_correct);
            return {
              q: q.question_text,
              a: opt ? opt.option_text : (q.answers?.[0]?.answer_text || 'Correct Answer'),
            };
          }));
        }
      } catch (e) {
        console.error('Error loading buzzer questions:', e);
      }
    }
    loadQuestions();
  }, []);

  // Timer countdown when buzzed
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'buzzed' && answerTimeLeft > 0) {
      timer = setInterval(() => setAnswerTimeLeft((prev) => prev - 1), 1000);
    } else if (status === 'buzzed' && answerTimeLeft === 0) {
      handleJudgement(false);
    }
    return () => clearInterval(timer);
  }, [status, answerTimeLeft]);

  // Spacebar buzzer event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && status === 'reading') {
        e.preventDefault();
        triggerBuzz();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, questionStartTime]);

  const handleStartQuestion = () => {
    setStatus('reading');
    setReactionTime(null);
    setFeedback(null);
    setQuestionStartTime(Date.now());
    setAnswerTimeLeft(10);
  };

  const triggerBuzz = () => {
    if (status !== 'reading') return;
    soundFx.playBuzzer();
    const timeToBuzz = ((Date.now() - questionStartTime) / 1000);
    setReactionTime(Number(timeToBuzz.toFixed(2)));
    setStatus('buzzed');
  };

  const handleJudgement = (isCorrect: boolean) => {
    if (isCorrect) {
      soundFx.playCorrect();
      setScore(prev => prev + 2);
      setFeedback('Correct! +2 points awarded.');
    } else {
      soundFx.playIncorrect();
      setScore(prev => Math.max(0, prev - 1));
      setFeedback('Incorrect or time expired. -1 point deducted.');
    }
    setStatus('result');
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      handleStartQuestion();
    } else {
      setCurrentIndex(0);
      setStatus('idle');
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-8 w-8 text-rose-500" /> Buzzer Round Training
          </h1>
          <p className="text-slate-500 mt-1">Practice fast reaction speed. Hit <kbd className="px-2 py-0.5 bg-slate-200 rounded font-mono text-xs font-bold">Spacebar</kbd> or click the Buzzer!</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span className="text-sm text-slate-600 font-medium">Score:</span>
          <span className="text-xl font-bold text-slate-900">{score} pts</span>
        </div>
      </div>

      {status === 'idle' && (
        <Card className="text-center p-8 bg-gradient-to-b from-rose-50/50 to-white border-rose-200">
          <CardContent className="space-y-6 pt-6">
            <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-md animate-pulse">
              <Bell className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Buzzer Round Simulation</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Read the question on screen. The moment you know the answer, hit the <strong>SPACEBAR</strong> or tap the Buzzer button. Correct: <strong>+2 pts</strong> | Wrong: <strong>-1 pt</strong>.
              </p>
            </div>
            <Button size="lg" onClick={handleStartQuestion} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 shadow-md cursor-pointer">
              <Play className="mr-2 h-5 w-5" /> Start Buzzer Round
            </Button>
          </CardContent>
        </Card>
      )}

      {status === 'reading' && (
        <div className="space-y-6">
          <Card className="border-2 border-slate-200 shadow-md">
            <CardContent className="p-8 space-y-4 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                {currentQ?.q}
              </h2>
            </CardContent>
          </Card>

          {/* Big Buzzer Button */}
          <div className="flex flex-col items-center justify-center py-6">
            <button
              onClick={triggerBuzz}
              className="w-48 h-48 rounded-full bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white shadow-2xl border-8 border-rose-300 transform active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer group"
            >
              <Bell className="w-16 h-16 group-hover:animate-bounce mb-2" />
              <span className="text-xl font-black tracking-widest uppercase">HIT BUZZER</span>
              <span className="text-[10px] opacity-80 mt-1">(OR PRESS SPACEBAR)</span>
            </button>
          </div>
        </div>
      )}

      {status === 'buzzed' && (
        <div className="space-y-6">
          <div className="bg-rose-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 animate-pulse" />
              <div>
                <h3 className="font-extrabold text-lg">BUZZED! Lockout Active</h3>
                <p className="text-xs text-rose-100">Reaction Time: <strong>{reactionTime}s</strong></p>
              </div>
            </div>
            <div className="text-2xl font-mono font-black bg-rose-700 px-3 py-1 rounded-lg">
              {answerTimeLeft}s
            </div>
          </div>

          <Card className="border-2 border-slate-200">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">{currentQ?.q}</h3>
              <div className="p-4 bg-slate-50 border rounded-xl">
                <span className="text-xs text-slate-400 font-semibold uppercase">Answer Reveal:</span>
                <p className="text-xl font-bold text-slate-800 mt-1">{currentQ?.a}</p>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={() => handleJudgement(false)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  <X className="mr-2 h-5 w-5" /> Incorrect (-1)
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleJudgement(true)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <Check className="mr-2 h-5 w-5" /> Correct (+2)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {status === 'result' && (
        <Card className="text-center p-8 bg-white border-slate-200 shadow-md">
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <Badge className="text-sm font-semibold uppercase px-3 py-1">
                {feedback}
              </Badge>
              <p className="text-slate-500 text-sm mt-2">
                Reaction speed: <strong>{reactionTime} seconds</strong>
              </p>
            </div>

            <Button size="lg" onClick={handleNext} className="bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold px-8 cursor-pointer">
              Next Question <Play className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
