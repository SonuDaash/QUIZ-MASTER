import React from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Flame, Users, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Championship Leaderboard | PABSON Smart Mind 2083',
  description: 'View the live rankings and performance records of schools and students in the PABSON Inter-School Quiz Championship 2083.',
};

export default function PublicLeaderboardPage() {
  const topSchools = [
    { rank: 1, name: 'Little Angels’ School', location: 'Hattiban, Lalitpur', points: '14,820', accuracy: '94.2%', badge: '🥇 1st Place' },
    { rank: 2, name: 'St. Xavier’s School', location: 'Jawalakhel, Lalitpur', points: '13,950', accuracy: '92.8%', badge: '🥈 2nd Place' },
    { rank: 3, name: 'Budhanilkantha School', location: 'Budhanilkantha, Kathmandu', points: '13,410', accuracy: '91.5%', badge: '🥉 3rd Place' },
    { rank: 4, name: 'Apex Life School', location: 'Suryabinayak, Bhaktapur', points: '12,180', accuracy: '89.4%', badge: 'Top 5' },
    { rank: 5, name: 'Pragya Secondary School', location: 'Pokhara, Kaski', points: '11,890', accuracy: '88.1%', badge: 'Top 5' },
    { rank: 6, name: 'Delhi Public School', location: 'Dharan, Sunsari', points: '11,450', accuracy: '87.6%', badge: 'Top 10' },
    { rank: 7, name: 'GEMS School', location: 'Dhapakhel, Lalitpur', points: '10,920', accuracy: '86.9%', badge: 'Top 10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 border-none font-bold px-3 py-1 text-xs uppercase">
            🏆 2083 Season Standings
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Inter-School Championship Leaderboard
          </h1>
          <p className="text-sm text-slate-600">
            Real-time standings based on speed accuracy, buzzer performance, and mock round aggregates.
          </p>
        </div>

        {/* Podium Display (Top 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
          {/* 2nd Place */}
          <Card className="border-2 border-slate-300 bg-white order-2 md:order-1 shadow-sm text-center p-6 space-y-3">
            <span className="text-4xl">🥈</span>
            <div>
              <Badge variant="outline" className="text-[11px] font-bold text-slate-700">Rank #2</Badge>
              <h3 className="font-bold text-slate-900 mt-1">{topSchools[1].name}</h3>
              <p className="text-xs text-slate-500">{topSchools[1].location}</p>
            </div>
            <p className="text-2xl font-black text-slate-800">{topSchools[1].points} pts</p>
            <p className="text-xs font-semibold text-emerald-600">{topSchools[1].accuracy} Accuracy</p>
          </Card>

          {/* 1st Place (Center Gold) */}
          <Card className="border-2 border-amber-400 bg-gradient-to-b from-amber-50 to-white order-1 md:order-2 shadow-lg text-center p-8 space-y-3 scale-105">
            <span className="text-5xl">🥇</span>
            <div>
              <Badge className="bg-amber-500 text-slate-950 font-black text-xs">CHAMPION LEAD</Badge>
              <h3 className="font-black text-lg text-slate-900 mt-2">{topSchools[0].name}</h3>
              <p className="text-xs text-slate-600">{topSchools[0].location}</p>
            </div>
            <p className="text-3xl font-black text-amber-600">{topSchools[0].points} pts</p>
            <p className="text-xs font-bold text-emerald-600">{topSchools[0].accuracy} Accuracy</p>
          </Card>

          {/* 3rd Place */}
          <Card className="border-2 border-amber-700/30 bg-white order-3 shadow-sm text-center p-6 space-y-3">
            <span className="text-4xl">🥉</span>
            <div>
              <Badge variant="outline" className="text-[11px] font-bold text-amber-800">Rank #3</Badge>
              <h3 className="font-bold text-slate-900 mt-1">{topSchools[2].name}</h3>
              <p className="text-xs text-slate-500">{topSchools[2].location}</p>
            </div>
            <p className="text-2xl font-black text-slate-800">{topSchools[2].points} pts</p>
            <p className="text-xs font-semibold text-emerald-600">{topSchools[2].accuracy} Accuracy</p>
          </Card>
        </div>

        {/* Full Table */}
        <Card className="border border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Complete School Standings
            </CardTitle>
            <span className="text-xs text-slate-500 font-mono">Updated Live</span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs">
              {topSchools.map((s) => (
                <div key={s.rank} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 font-mono font-bold text-slate-400 text-sm">{s.rank}</span>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                      <p className="text-slate-500">{s.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-sm">{s.points} pts</p>
                    <p className="text-emerald-600 font-semibold">{s.accuracy}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Join CTA */}
        <div className="p-8 bg-slate-900 text-white rounded-2xl text-center space-y-4 shadow-md">
          <h2 className="text-xl font-bold">Want Your School to Compete on the Leaderboard?</h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Log in to your student profile or register your school team to start earning championship points in daily challenge sprints.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/register">
              <Button className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold min-h-[44px] px-6 cursor-pointer">
                Register Student Account <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
