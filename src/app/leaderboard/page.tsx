import React from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Championship Leaderboard | Smart Mind 2083',
  description: 'View the live rankings and performance records of schools and students in the Inter-School Quiz Championship 2083.',
};

export default function PublicLeaderboardPage() {
  const topSchools = [
    { rank: 1, name: 'Little Angels’ School', location: 'Hattiban, Lalitpur', points: '14,820', accuracy: '94.2%', badge: '🥇 1st Place', trend: '▲ +1' },
    { rank: 2, name: 'St. Xavier’s School', location: 'Jawalakhel, Lalitpur', points: '13,950', accuracy: '92.8%', badge: '🥈 2nd Place', trend: '—' },
    { rank: 3, name: 'Budhanilkantha School', location: 'Budhanilkantha, Kathmandu', points: '13,410', accuracy: '91.5%', badge: '🥉 3rd Place', trend: '▼ -1' },
    { rank: 4, name: 'Apex Life School', location: 'Suryabinayak, Bhaktapur', points: '12,180', accuracy: '89.4%', badge: 'Top 5', trend: '▲ +2' },
    { rank: 5, name: 'Pragya Secondary School', location: 'Pokhara, Kaski', points: '11,890', accuracy: '88.1%', badge: 'Top 5', trend: '—' },
    { rank: 6, name: 'Delhi Public School', location: 'Dharan, Sunsari', points: '11,450', accuracy: '87.6%', badge: 'Top 10', trend: '▲ +1' },
    { rank: 7, name: 'GEMS School', location: 'Dhapakhel, Lalitpur', points: '10,920', accuracy: '86.9%', badge: 'Top 10', trend: '▼ -2' },
    { rank: 8, name: 'KMC School', location: 'Balkumari, Lalitpur', points: '10,480', accuracy: '86.1%', badge: 'Top 10', trend: '▲ +3' },
    { rank: 9, name: 'Shuvatara School', location: 'Sanepa, Lalitpur', points: '10,120', accuracy: '85.4%', badge: 'Top 10', trend: '—' },
    { rank: 10, name: 'Rato Bangala School', location: 'Patan Dhoka, Lalitpur', points: '9,890', accuracy: '84.8%', badge: 'Top 10', trend: '▼ -1' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100">
      <PublicHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-bold px-2.5 py-0.5 text-xs uppercase rounded-md">
            🏆 2083 Season Standings
          </Badge>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Inter-School Championship Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Real-time standings aggregating speed, accuracy, and practice performance.
          </p>
        </div>

        {/* Podium Display (Top 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-2">
          {/* 2nd Place */}
          <Card className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 order-2 md:order-1 shadow-sm text-center p-5 space-y-2 rounded-lg">
            <span className="text-3xl">🥈</span>
            <div>
              <Badge variant="outline" className="text-[10px] font-bold text-slate-700 dark:text-slate-300 rounded">Rank #2</Badge>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-1">{topSchools[1].name}</h3>
              <p className="text-[11px] text-slate-500">{topSchools[1].location}</p>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-slate-200">{topSchools[1].points} pts</p>
            <p className="text-xs font-semibold text-emerald-600">{topSchools[1].accuracy} Accuracy</p>
          </Card>

          {/* 1st Place (Center Gold) */}
          <Card className="border-2 border-amber-400 bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 order-1 md:order-2 shadow-md text-center p-6 space-y-2.5 rounded-lg md:-translate-y-2">
            <span className="text-4xl">🥇</span>
            <div>
              <Badge className="bg-amber-500 text-slate-950 font-black text-[11px] rounded">CHAMPION LEAD</Badge>
              <h3 className="font-black text-base text-slate-900 dark:text-slate-100 mt-1.5">{topSchools[0].name}</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">{topSchools[0].location}</p>
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{topSchools[0].points} pts</p>
            <p className="text-xs font-bold text-emerald-600">{topSchools[0].accuracy} Accuracy</p>
          </Card>

          {/* 3rd Place */}
          <Card className="border border-amber-700/30 bg-white dark:bg-slate-900 order-3 shadow-sm text-center p-5 space-y-2 rounded-lg">
            <span className="text-3xl">🥉</span>
            <div>
              <Badge variant="outline" className="text-[10px] font-bold text-amber-800 dark:text-amber-400 rounded">Rank #3</Badge>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-1">{topSchools[2].name}</h3>
              <p className="text-[11px] text-slate-500">{topSchools[2].location}</p>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-slate-200">{topSchools[2].points} pts</p>
            <p className="text-xs font-semibold text-emerald-600">{topSchools[2].accuracy} Accuracy</p>
          </Card>
        </div>

        {/* Full Table */}
        <Card className="border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 py-3.5 px-5 flex flex-row items-center justify-between">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Complete Participating School Standings
            </CardTitle>
            <span className="text-[11px] text-slate-500 font-mono">Live Sync Active</span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" aria-label="Full Leaderboard">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] bg-slate-50/50 dark:bg-slate-800/30">
                    <th className="py-2.5 px-4">Rank</th>
                    <th className="py-2.5 px-4">School</th>
                    <th className="py-2.5 px-4">Location</th>
                    <th className="py-2.5 px-4 text-right">Accuracy</th>
                    <th className="py-2.5 px-4 text-right">Points</th>
                    <th className="py-2.5 px-4 text-center">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {topSchools.map((s) => (
                    <tr key={s.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-500 font-mono">#{s.rank}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{s.name}</td>
                      <td className="py-3 px-4 text-slate-500">{s.location}</td>
                      <td className="py-3 px-4 text-right font-semibold text-emerald-600">{s.accuracy}</td>
                      <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-slate-100">{s.points}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[11px] font-bold ${
                          s.trend.startsWith('▲') ? 'text-emerald-600' :
                          s.trend.startsWith('▼') ? 'text-rose-600' : 'text-slate-400'
                        }`}>
                          {s.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Practice CTA Banner */}
        <div className="p-6 bg-[#1e3a5f] text-white rounded-lg text-center space-y-3 shadow-md">
          <h2 className="text-lg font-bold">Boost Your School’s Ranking</h2>
          <p className="text-xs text-blue-100 max-w-lg mx-auto leading-relaxed">
            Every correct answer in the Training Cockpit adds points and boosts your school benchmark.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <Link href="/">
              <Button className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg min-h-[40px] px-5 cursor-pointer">
                <Zap className="w-3.5 h-3.5 mr-1 text-slate-950" /> Start Training Cockpit <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
