'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, ArrowRight, RefreshCw, Atom, Globe, Calculator, Monitor, Mountain, Landmark, Newspaper } from 'lucide-react';
import { getSubjects, getTopics } from '@/lib/firebase/firestore';
import type { Subject, Topic } from '@/lib/types';

export default function SubjectExplorer() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [subs, tops] = await Promise.all([
          getSubjects(),
          getTopics(),
        ]);
        setSubjects(subs);
        setTopics(tops);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredSubjects = subjects.filter(s => {
    const subTopics = topics.filter(t => t.subject_id === s.id);
    return s.name.toLowerCase().includes(search.toLowerCase()) ||
           subTopics.some(t => t.name.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Practice Hub</h1>
          <p className="text-slate-500">Choose a subject to configure and launch targeted quiz practice drills.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search subjects or topics..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
          Loading subjects from Firestore...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => {
            const subTopics = topics.filter(t => t.subject_id === subject.id);
            return (
              <Card key={subject.id} className="flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">{subject.name}</CardTitle>
                    <p className="text-xs text-slate-400 font-medium">{subTopics.length} Topics Available</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {subject.description || 'Comprehensive question bank covering standard curriculum and competition topics.'}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {subTopics.slice(0, 4).map((topic) => (
                      <Badge key={topic.id} variant="secondary" className="text-[11px] font-normal bg-slate-100 text-slate-700">
                        {topic.name}
                      </Badge>
                    ))}
                    {subTopics.length > 4 && (
                      <Badge variant="outline" className="text-[11px] font-normal text-slate-400">
                        +{subTopics.length - 4} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t bg-slate-50/50">
                  <Link href={`/student/practice/${subject.id}`} className="w-full">
                    <Button className="w-full bg-[#1e3a5f] hover:bg-[#152840] text-white flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold">
                      Configure & Start Quiz <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
