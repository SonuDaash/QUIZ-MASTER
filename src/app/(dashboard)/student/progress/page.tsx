'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { subject: 'Science', accuracy: 82 },
  { subject: 'Math', accuracy: 65 },
  { subject: 'History', accuracy: 90 },
  { subject: 'English', accuracy: 78 },
  { subject: 'ICT', accuracy: 88 },
];

const topicMastery = [
  { topic: 'Nepal Geography', score: 91, status: 'Mastered', color: 'text-green-600', bg: 'bg-green-100' },
  { topic: 'Nepal History', score: 84, status: 'Strong', color: 'text-blue-600', bg: 'bg-blue-100' },
  { topic: 'Physics', score: 63, status: 'Developing', color: 'text-amber-600', bg: 'bg-amber-100' },
  { topic: 'Mathematics', score: 47, status: 'Weak', color: 'text-red-600', bg: 'bg-red-100' },
];

export default function StudentProgress() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your Progress</h1>
        <p className="text-slate-500 mt-1">Track your performance and mastery over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Improvement</p>
              <h3 className="text-2xl font-bold text-slate-900">+13%</h3>
              <p className="text-xs text-green-600 font-medium">61% → 74% this week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Avg Response Time</p>
              <h3 className="text-2xl font-bold text-slate-900">4.8s</h3>
              <p className="text-xs text-green-600 font-medium">-0.5s faster</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Overall Accuracy</p>
              <h3 className="text-2xl font-bold text-slate-900">76%</h3>
              <p className="text-xs text-slate-500 font-medium">Out of 1,240 questions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Topics Mastered</p>
              <h3 className="text-2xl font-bold text-slate-900">12</h3>
              <p className="text-xs text-slate-500 font-medium">Keep it up!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accuracy by Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#3b82f6" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accuracy by Difficulty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-green-700">Easy</span>
                <span className="font-bold text-slate-700">94%</span>
              </div>
              <Progress value={94} className="h-3 [&>div]:bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-amber-700">Medium</span>
                <span className="font-bold text-slate-700">76%</span>
              </div>
              <Progress value={76} className="h-3 [&>div]:bg-amber-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-red-700">Hard</span>
                <span className="font-bold text-slate-700">51%</span>
              </div>
              <Progress value={51} className="h-3 [&>div]:bg-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topic Mastery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topicMastery.map((topic, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${topic.bg} ${topic.color}`}>
                    {topic.score}%
                  </div>
                  <span className="font-medium text-slate-800">{topic.topic}</span>
                </div>
                <div className={`text-sm font-semibold ${topic.color}`}>
                  {topic.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
