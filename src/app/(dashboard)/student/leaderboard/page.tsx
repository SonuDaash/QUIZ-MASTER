'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Timer, Target, School, RefreshCw, Award } from 'lucide-react';
import { getLeaderboard } from '@/lib/firebase/firestore';
import type { LeaderboardEntry } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | '10' | '9' | '8'>('all');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getLeaderboard(50);
        setLeaderboard(data);
      } catch (e) {
        console.error('Error loading leaderboard:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = leaderboard.filter(e => filter === 'all' || String(e.grade) === filter);

  const top1 = filtered[0];
  const top2 = filtered[1];
  const top3 = filtered[2];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-1">
          <Award className="w-3.5 h-3.5" /> PABSON Championship Rankings
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] tracking-tight">
          Quiz Masters Leaderboard
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          See where you stand across top schools and contestants this season.
        </p>

        {/* Filter Pills */}
        <div className="flex justify-center gap-2 pt-2">
          {['all', '10', '9', '8'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-[#1e3a5f] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'All Grades' : `Grade ${f}`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          Loading leaderboard rankings...
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {filtered.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Rank 2 */}
              <Card className="order-2 md:order-1 bg-gradient-to-b from-slate-50 to-slate-100 border-2 border-slate-200">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-slate-200 rounded-full flex items-center justify-center mb-3 border-4 border-white shadow-sm">
                    <Medal className="h-8 w-8 text-slate-500" />
                  </div>
                  <Badge variant="outline" className="text-[10px] mb-1 font-bold">#2 SILVER</Badge>
                  <h3 className="font-bold text-base text-slate-800">{top2.student_name}</h3>
                  <p className="text-xs text-slate-500">{top2.school}</p>
                  <p className="text-2xl font-black text-[#1e3a5f] my-2">{top2.points} pts</p>
                  <div className="flex justify-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center"><Target className="w-3 h-3 mr-1 text-blue-600" /> {top2.accuracy}%</span>
                    <span className="flex items-center"><Trophy className="w-3 h-3 mr-1 text-amber-600" /> {top2.quizzes_taken} tests</span>
                  </div>
                </CardContent>
              </Card>

              {/* Rank 1 */}
              <Card className="order-1 md:order-2 transform md:-translate-y-4 shadow-xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white relative overflow-hidden">
                <div className="absolute top-0 w-full h-2 bg-amber-400" />
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-3 border-4 border-white shadow-md">
                    <Trophy className="h-10 w-10 text-amber-600" />
                  </div>
                  <Badge className="bg-amber-500 text-slate-950 text-[10px] mb-1 font-extrabold hover:bg-amber-500">
                    #1 CHAMPION
                  </Badge>
                  <h3 className="font-bold text-lg text-slate-900">{top1.student_name}</h3>
                  <p className="text-xs text-slate-500">{top1.school}</p>
                  <p className="text-3xl font-black text-amber-600 my-2">{top1.points} pts</p>
                  <div className="flex justify-center gap-4 text-xs text-slate-600 font-medium bg-amber-100/50 py-1.5 rounded-lg mx-2">
                    <span className="flex items-center"><Target className="w-3.5 h-3.5 mr-1 text-amber-700" /> {top1.accuracy}% Acc</span>
                    <span className="flex items-center"><Trophy className="w-3.5 h-3.5 mr-1 text-amber-700" /> {top1.quizzes_taken} tests</span>
                  </div>
                </CardContent>
              </Card>

              {/* Rank 3 */}
              <Card className="order-3 md:order-3 bg-gradient-to-b from-orange-50 to-white border-2 border-orange-200">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-3 border-4 border-white shadow-sm">
                    <Medal className="h-8 w-8 text-amber-700" />
                  </div>
                  <Badge variant="outline" className="text-[10px] mb-1 font-bold text-amber-800 border-amber-300">#3 BRONZE</Badge>
                  <h3 className="font-bold text-base text-slate-800">{top3.student_name}</h3>
                  <p className="text-xs text-slate-500">{top3.school}</p>
                  <p className="text-2xl font-black text-orange-700 my-2">{top3.points} pts</p>
                  <div className="flex justify-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center"><Target className="w-3 h-3 mr-1 text-blue-600" /> {top3.accuracy}%</span>
                    <span className="flex items-center"><Trophy className="w-3 h-3 mr-1 text-amber-600" /> {top3.quizzes_taken} tests</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Full Table */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-16 text-center">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-center">Tests</TableHead>
                  <TableHead className="text-center">Accuracy</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="text-center font-bold text-slate-600">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">{item.student_name}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{item.school}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[11px] font-normal">
                        Grade {item.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-slate-600 text-sm">{item.quizzes_taken}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-emerald-600 text-sm">{item.accuracy}%</span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-[#1e3a5f] text-base">{item.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
