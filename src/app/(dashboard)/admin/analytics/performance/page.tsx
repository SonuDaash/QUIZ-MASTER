'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Target, TrendingUp, Lightbulb } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const studentAccuracyData = [
  { name: 'Aarav S.', accuracy: 82 },
  { name: 'Priya T.', accuracy: 78 },
  { name: 'Rohan P.', accuracy: 86 },
  { name: 'Sita M.', accuracy: 72 },
  { name: 'Bikash K.', accuracy: 91 },
]

const subjectAccuracyData = [
  { subject: 'Math', accuracy: 75 },
  { subject: 'Science', accuracy: 82 },
  { subject: 'History', accuracy: 68 },
  { subject: 'Geography', accuracy: 88 },
  { subject: 'Literature', accuracy: 79 },
]

const weeklyTrendData = [
  { week: 'Week 1', avgScore: 65 },
  { week: 'Week 2', avgScore: 68 },
  { week: 'Week 3', avgScore: 74 },
  { week: 'Week 4', avgScore: 81 },
]

export default function PerformanceAnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-navy-900">Performance Analytics</h1>
        <p className="text-muted-foreground mt-1">AI-powered insights and training recommendations.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="bg-blue-50/50 border-b border-blue-100/50 pb-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Training Insights</CardTitle>
            </div>
            <CardDescription>Auto-generated analysis of student performance</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold mr-3 shrink-0 mt-0.5">1</span>
                <p className="text-sm text-gray-700"><strong>Aarav</strong> is strong in Nepal Geography but weak in Mathematics.</p>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold mr-3 shrink-0 mt-0.5">2</span>
                <p className="text-sm text-gray-700"><strong>Priya</strong> has high accuracy but slow response time.</p>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold mr-3 shrink-0 mt-0.5">3</span>
                <p className="text-sm text-gray-700"><strong>Rohan</strong> performs well in normal quizzes but struggles in buzzer rounds.</p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-green-100 shadow-sm">
          <CardHeader className="bg-green-50/50 border-b border-green-100/50 pb-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Recommended Training</CardTitle>
            </div>
            <CardDescription>Suggested focus areas for tomorrow's session</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="flex items-center p-3 bg-white border rounded-lg shadow-sm">
                <Lightbulb className="h-4 w-4 text-amber-500 mr-3" />
                <span className="text-sm font-medium">Mathematics — Algebra</span>
              </li>
              <li className="flex items-center p-3 bg-white border rounded-lg shadow-sm">
                <Lightbulb className="h-4 w-4 text-amber-500 mr-3" />
                <span className="text-sm font-medium">Science — Electricity</span>
              </li>
              <li className="flex items-center p-3 bg-white border rounded-lg shadow-sm">
                <Lightbulb className="h-4 w-4 text-amber-500 mr-3" />
                <span className="text-sm font-medium">Buzzer Practice (Speed Drills)</span>
              </li>
              <li className="flex items-center p-3 bg-white border rounded-lg shadow-sm">
                <Lightbulb className="h-4 w-4 text-amber-500 mr-3" />
                <span className="text-sm font-medium">Current Affairs Revision</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Student Accuracy Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentAccuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Subject-wise Accuracy</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAccuracyData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} fontSize={12} width={80} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="accuracy" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-base font-semibold">Weekly Improvement Trend</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} domain={['dataMin - 10', 'dataMax + 10']} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="avgScore" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
