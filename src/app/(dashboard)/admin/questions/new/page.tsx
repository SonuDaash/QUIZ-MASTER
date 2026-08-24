'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, X, Loader2 } from 'lucide-react';
import { createQuestion, getSubjects } from '@/lib/firebase/firestore';
import type { Subject } from '@/lib/types';

export default function NewQuestionPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('mcq');
  const [subjectId, setSubjectId] = useState('');
  const [topicName, setTopicName] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);
  const [timeLimit, setTimeLimit] = useState(30);
  const [explanation, setExplanation] = useState('');
  const [isVerified, setIsVerified] = useState(true);

  // MCQ Options
  const [options, setOptions] = useState([
    { label: 'A', text: '', isCorrect: true },
    { label: 'B', text: '', isCorrect: false },
    { label: 'C', text: '', isCorrect: false },
    { label: 'D', text: '', isCorrect: false },
  ]);

  // Direct / True-False answer
  const [directAnswer, setDirectAnswer] = useState('');
  const [tfAnswer, setTfAnswer] = useState('true');

  // Media / Image attachment
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');

  useEffect(() => {
    async function loadSubjects() {
      const data = await getSubjects();
      setSubjects(data);
      if (data.length > 0) setSubjectId(data[0].id);
    }
    loadSubjects();
  }, []);

  const handleOptionTextChange = (index: number, text: string) => {
    const updated = [...options];
    updated[index].text = text;
    setOptions(updated);
  };

  const handleCorrectOptionChange = (index: number) => {
    const updated = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      alert('Please enter question text.');
      return;
    }

    setLoading(true);
    try {
      let formattedOptions: any[] = [];
      let formattedAnswers: any[] = [];

      if (questionType === 'mcq') {
        formattedOptions = options.map((opt, idx) => ({
          id: `opt_${idx + 1}`,
          option_label: opt.label,
          option_text: opt.text || `Option ${opt.label}`,
          is_correct: opt.isCorrect,
          display_order: idx + 1,
        }));
      } else if (questionType === 'tf') {
        formattedOptions = [
          { id: 'opt_true', option_label: 'A', option_text: 'True', is_correct: tfAnswer === 'true', display_order: 1 },
          { id: 'opt_false', option_label: 'B', option_text: 'False', is_correct: tfAnswer === 'false', display_order: 2 },
        ];
      } else {
        formattedAnswers = [
          { id: 'ans_1', answer_text: directAnswer, accepted_alternatives: [] }
        ];
      }

      const mediaPayload: any[] = imageUrl.trim() ? [
        {
          id: `med_${Date.now()}`,
          question_id: '',
          media_type: 'image',
          file_url: imageUrl.trim(),
          thumbnail_url: null,
          caption: null,
          created_at: new Date().toISOString(),
        }
      ] : [];

      await createQuestion({
        question_text: questionText,
        question_type: questionType as any,
        difficulty: difficulty as any,
        subject_id: subjectId || null,
        marks: Number(marks),
        negative_marks: Number(negativeMarks),
        time_limit: Number(timeLimit),
        explanation: explanation || null,
        verification_status: isVerified ? 'verified' : 'needs_review',
        active: true,
        options: formattedOptions as any,
        answers: formattedAnswers as any,
        media: mediaPayload,
      });

      router.push('/admin/questions');
    } catch (err) {
      console.error('Error saving question:', err);
      alert('Failed to save question to Firestore.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create New Question</h1>
            <p className="text-sm text-slate-500">Add a new question to Cloud Firestore question repository.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-[#1e3a5f] hover:bg-[#152840] text-white cursor-pointer">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Question
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Question Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question Text *</Label>
                <Textarea 
                  id="question" 
                  required
                  placeholder="Enter the question text here..." 
                  className="min-h-[120px] text-base"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Question Type</Label>
                <select 
                  id="type"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="direct">Direct Answer</option>
                  <option value="tf">True / False</option>
                </select>
              </div>

              {questionType === 'mcq' && (
                <div className="space-y-3 pt-2">
                  <Label>MCQ Options (Select the radio button for the correct answer)</Label>
                  {options.map((opt, idx) => (
                    <div key={opt.label} className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="correctAnswer" 
                        checked={opt.isCorrect}
                        onChange={() => handleCorrectOptionChange(idx)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1 flex items-center">
                        <span className="w-8 font-semibold text-slate-500">{opt.label}.</span>
                        <Input 
                          placeholder={`Enter option ${opt.label}`}
                          value={opt.text}
                          onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                          required={idx < 2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {questionType === 'tf' && (
                <div className="space-y-3 pt-2">
                  <Label>Correct Answer</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="tfAnswer" 
                        value="true" 
                        checked={tfAnswer === 'true'} 
                        onChange={() => setTfAnswer('true')} 
                        className="h-4 w-4 text-blue-600" 
                      />
                      True
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="tfAnswer" 
                        value="false" 
                        checked={tfAnswer === 'false'} 
                        onChange={() => setTfAnswer('false')} 
                        className="h-4 w-4 text-blue-600" 
                      />
                      False
                    </label>
                  </div>
                </div>
              )}

              {questionType === 'direct' && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="directAns">Accepted Answer *</Label>
                  <Input
                    id="directAns"
                    placeholder="Enter the exact answer text..."
                    value={directAnswer}
                    onChange={(e) => setDirectAnswer(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Audio-Visual Image Attachment */}
              <div className="space-y-2 pt-2">
                <Label htmlFor="imageUpload">Image Attachment (Optional for Audio-Visual Questions)</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      id="imageUpload"
                      placeholder="Paste Image URL (or upload below)..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border flex items-center gap-1 cursor-pointer shrink-0">
                      Upload File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              setImageUrl(evt.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {imageUrl && (
                    <div className="relative border rounded-lg p-2 bg-slate-50 flex items-center justify-between">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt="Preview" className="h-20 object-contain rounded" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageUrl('')}
                        className="text-red-500 hover:bg-red-50 text-xs"
                      >
                        Remove Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea 
                  id="explanation" 
                  placeholder="Explain the correct answer. This will be shown to students after answering." 
                  className="min-h-[90px]"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categorization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <select 
                  id="subject" 
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select subject...</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select 
                  id="difficulty" 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scoring & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="verified" className="cursor-pointer">Mark as Verified</Label>
                <Switch 
                  id="verified" 
                  checked={isVerified}
                  onCheckedChange={setIsVerified}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="marks">Marks</Label>
                  <Input 
                    id="marks" 
                    type="number" 
                    value={marks} 
                    onChange={(e) => setMarks(Number(e.target.value))}
                    min="1" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="negMarks">Neg. Marks</Label>
                  <Input 
                    id="negMarks" 
                    type="number" 
                    value={negativeMarks} 
                    onChange={(e) => setNegativeMarks(Number(e.target.value))}
                    step="0.25" 
                    min="0" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                <Input 
                  id="timeLimit" 
                  type="number" 
                  value={timeLimit} 
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  min="5" 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
