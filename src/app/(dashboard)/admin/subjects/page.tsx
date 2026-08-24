'use client';

import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Layers, Trash2, RefreshCw, Layers3, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getSubjects, getTopics, createSubject, createTopic, deleteSubject } from '@/lib/firebase/firestore';
import type { Subject, Topic } from '@/lib/types';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDesc, setNewSubjectDesc] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [subs, tops] = await Promise.all([
        getSubjects(),
        getTopics(),
      ]);
      setSubjects(subs);
      setTopics(tops);
      if (subs.length > 0 && !selectedSubjectId) {
        setSelectedSubjectId(subs[0].id);
      }
    } catch (err) {
      console.error('Error loading subjects/topics:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    setSaving(true);
    try {
      const id = await createSubject({
        name: newSubjectName.trim(),
        description: newSubjectDesc.trim() || null,
        display_order: subjects.length + 1,
      });
      setSubjects(prev => [...prev, {
        id,
        name: newSubjectName.trim(),
        description: newSubjectDesc.trim() || null,
        display_order: subjects.length + 1,
        category_id: null,
      }]);
      setNewSubjectName('');
      setNewSubjectDesc('');
      setShowAddSubject(false);
    } catch (err) {
      console.error('Failed to create subject:', err);
      alert('Error creating subject.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim() || !selectedSubjectId) return;
    setSaving(true);
    try {
      const id = await createTopic({
        subject_id: selectedSubjectId,
        name: newTopicName.trim(),
        description: null,
        grade_range: [7, 8, 9, 10],
        display_order: topics.length + 1,
      });
      setTopics(prev => [...prev, {
        id,
        subject_id: selectedSubjectId,
        name: newTopicName.trim(),
        description: null,
        grade_range: [7, 8, 9, 10],
        display_order: topics.length + 1,
      }]);
      setNewTopicName('');
      setShowAddTopic(false);
    } catch (err) {
      console.error('Failed to create topic:', err);
      alert('Error creating topic.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    try {
      await deleteSubject(id);
      setSubjects(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete subject:', err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Subjects & Topics</h1>
          <p className="text-slate-500 mt-1">Manage syllabus structure, subject classifications, and subtopics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddTopic(true)} className="cursor-pointer">
            <Layers className="mr-2 h-4 w-4" /> Add Topic
          </Button>
          <Button onClick={() => setShowAddSubject(true)} className="bg-[#1e3a5f] hover:bg-[#152840] text-white cursor-pointer">
            <Plus className="mr-2 h-4 w-4" /> Add Subject
          </Button>
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-blue-950">Add New Subject</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowAddSubject(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subName">Subject Name *</Label>
                  <Input
                    id="subName"
                    required
                    placeholder="e.g. Science, Mathematics, GK"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subDesc">Description</Label>
                  <Input
                    id="subDesc"
                    placeholder="Brief description of the subject..."
                    value={newSubjectDesc}
                    onChange={(e) => setNewSubjectDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddSubject(false)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {saving ? 'Saving...' : 'Create Subject'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Topic Modal */}
      {showAddTopic && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-indigo-950">Add New Topic</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowAddTopic(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topSub">Parent Subject *</Label>
                  <select
                    id="topSub"
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topName">Topic Name *</Label>
                  <Input
                    id="topName"
                    required
                    placeholder="e.g. Nepal Geography, Algebra, Optics"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddTopic(false)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {saving ? 'Saving...' : 'Create Topic'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            Loading subjects and topics from Firestore...
          </div>
        ) : subjects.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-500 bg-white rounded-lg border">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            No subjects created yet. Click &quot;Add Subject&quot; to begin.
          </div>
        ) : (
          subjects.map((subject) => {
            const subjectTopics = topics.filter(t => t.subject_id === subject.id);
            return (
              <Card key={subject.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      {subject.name}
                    </CardTitle>
                    {subject.description && (
                      <CardDescription className="text-xs">{subject.description}</CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="text-slate-400 hover:text-red-600"
                    title="Delete subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Topics ({subjectTopics.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {subjectTopics.length > 0 ? (
                      subjectTopics.map(t => (
                        <Badge key={t.id} variant="secondary" className="bg-slate-100 text-slate-700 font-normal">
                          {t.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No topics assigned yet</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
