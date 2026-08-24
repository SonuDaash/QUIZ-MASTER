'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Download,
  Loader2,
  Trash2,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { createQuestion } from '@/lib/firebase/firestore';

interface ParsedQuestionRow {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  subject: string;
  difficulty: string;
  explanation: string;
  marks: number;
  isValid: boolean;
  validationError?: string;
}

const SAMPLE_CSV = `question,option_a,option_b,option_c,option_d,correct_answer,subject,difficulty,explanation,marks
"What is the capital of Nepal?","Pokhara","Kathmandu","Lalitpur","Biratnagar","B","Geography","easy","Kathmandu is the capital and largest city of Nepal.",1
"Which gas do plants absorb during photosynthesis?","Oxygen","Nitrogen","Carbon Dioxide","Hydrogen","C","General Science","easy","Plants absorb Carbon Dioxide from the air.",1
"What is the square root of 144?","10","11","12","14","C","Mathematics","easy","12 x 12 = 144.",1
"Who was the first King of unified Nepal?","Prithvi Narayan Shah","Tribhuvan","Birendra","Mahendra","A","History","easy","Prithvi Narayan Shah unified the modern state of Nepal.",1
"What does CPU stand for?","Central Process Unit","Central Processing Unit","Core Processor Unit","Computer Personal Unit","B","Computer & ICT","easy","CPU stands for Central Processing Unit.",1`;

export default function ImportQuestionsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(0); // 0: Upload, 1: Preview & Validate, 2: Importing, 3: Success
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedQuestionRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Helper to parse CSV string into objects
  const parseCSV = (csvText: string): ParsedQuestionRow[] => {
    const lines = csvText.trim().split(/\r\n|\n/);
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
    const rows: ParsedQuestionRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Match CSV columns respecting quoted strings
      const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
      const values: string[] = [];
      let match;
      while ((match = regex.exec(line))) {
        let val = match[1] || '';
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1).replace(/""/g, '"');
        }
        values.push(val.trim());
        if (regex.lastIndex >= line.length) break;
      }

      const qText = values[0] || '';
      const optA = values[1] || '';
      const optB = values[2] || '';
      const optC = values[3] || '';
      const optD = values[4] || '';
      const correct = (values[5] || 'A').toUpperCase().trim();
      const subject = values[6] || 'General';
      const difficulty = (values[7] || 'easy').toLowerCase();
      const explanation = values[8] || '';
      const marks = parseInt(values[9], 10) || 1;

      let isValid = true;
      let validationError = '';

      if (!qText) {
        isValid = false;
        validationError = 'Missing question text';
      } else if (!optA || !optB) {
        isValid = false;
        validationError = 'Requires at least Option A and Option B';
      } else if (!['A', 'B', 'C', 'D'].includes(correct)) {
        isValid = false;
        validationError = 'Correct answer must be A, B, C, or D';
      }

      rows.push({
        id: `row_${i}`,
        question_text: qText,
        option_a: optA,
        option_b: optB,
        option_c: optC,
        option_d: optD,
        correct_answer: correct,
        subject,
        difficulty,
        explanation,
        marks,
        isValid,
        validationError,
      });
    }

    return rows;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.endsWith('.json')) {
        try {
          const jsonData = JSON.parse(content);
          const formatted: ParsedQuestionRow[] = (Array.isArray(jsonData) ? jsonData : [jsonData]).map((item, idx) => ({
            id: `json_${idx + 1}`,
            question_text: item.question_text || item.question || '',
            option_a: item.options?.[0]?.option_text || item.option_a || 'Option A',
            option_b: item.options?.[1]?.option_text || item.option_b || 'Option B',
            option_c: item.options?.[2]?.option_text || item.option_c || 'Option C',
            option_d: item.options?.[3]?.option_text || item.option_d || 'Option D',
            correct_answer: item.correct_answer || 'A',
            subject: item.subject || 'General',
            difficulty: item.difficulty || 'easy',
            explanation: item.explanation || '',
            marks: item.marks || 1,
            isValid: Boolean(item.question_text || item.question),
          }));
          setParsedRows(formatted);
          setCurrentStep(1);
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      } else {
        // Parse CSV
        const rows = parseCSV(content);
        if (rows.length === 0) {
          alert('Could not parse any valid question rows from CSV.');
          return;
        }
        setParsedRows(rows);
        setCurrentStep(1);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'smart_mind_sample_questions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartImport = async () => {
    const validRows = parsedRows.filter(r => r.isValid);
    if (validRows.length === 0) {
      alert('No valid rows to import.');
      return;
    }

    setImporting(true);
    setImportProgress(0);

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      const options = [
        { id: 'opt_1', option_label: 'A', option_text: row.option_a, is_correct: row.correct_answer === 'A', display_order: 1 },
        { id: 'opt_2', option_label: 'B', option_text: row.option_b, is_correct: row.correct_answer === 'B', display_order: 2 },
      ];
      if (row.option_c) {
        options.push({ id: 'opt_3', option_label: 'C', option_text: row.option_c, is_correct: row.correct_answer === 'C', display_order: 3 });
      }
      if (row.option_d) {
        options.push({ id: 'opt_4', option_label: 'D', option_text: row.option_d, is_correct: row.correct_answer === 'D', display_order: 4 });
      }

      try {
        await createQuestion({
          question_text: row.question_text,
          question_type: 'mcq',
          difficulty: (row.difficulty as any) || 'easy',
          marks: row.marks || 1,
          negative_marks: 0,
          time_limit: 30,
          explanation: row.explanation || null,
          verification_status: 'verified',
          active: true,
          options: options as any,
        });
      } catch (err) {
        console.error(`Error importing row ${i}:`, err);
      }

      setImportProgress(Math.round(((i + 1) / validRows.length) * 100));
    }

    setImporting(false);
    setCurrentStep(3); // Success
  };

  const validCount = parsedRows.filter(r => r.isValid).length;
  const errorCount = parsedRows.filter(r => !r.isValid).length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bulk Import Questions</h1>
          <p className="text-slate-500 mt-1">Upload CSV or JSON files to batch-insert questions directly into Firestore.</p>
        </div>
        <Button variant="outline" onClick={handleDownloadSample} className="flex items-center gap-1.5 cursor-pointer">
          <Download className="w-4 h-4 text-blue-600" />
          Download Sample CSV Template
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv, .json, text/csv, application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Step 0: Upload Card */}
      {currentStep === 0 && (
        <Card className="border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
              <UploadCloud className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Choose a file or drag & drop</h3>
              <p className="text-xs text-slate-500 mt-1">Supports standard CSV format and JSON arrays</p>
            </div>
            <Button
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold cursor-pointer"
            >
              Browse Files from Computer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Preview & Validate */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-2xl font-black text-emerald-800">{validCount}</p>
                  <p className="text-xs font-semibold text-emerald-600">Valid Rows</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-rose-50 border-rose-200">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
                <div>
                  <p className="text-2xl font-black text-rose-800">{errorCount}</p>
                  <p className="text-xs font-semibold text-rose-600">Errors</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-blue-900 truncate max-w-[150px]">{fileName}</p>
                  <p className="text-xs text-blue-600">{fileSize}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">File Preview ({parsedRows.length} Questions)</CardTitle>
                <CardDescription>Review questions before saving into Firestore</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(0)} className="text-xs text-slate-500">
                Choose Different File
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md max-h-[380px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0">
                    <TableRow>
                      <TableHead className="w-12">Status</TableHead>
                      <TableHead>Question Text</TableHead>
                      <TableHead>Correct Option</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Difficulty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedRows.map((row) => (
                      <TableRow key={row.id} className={!row.isValid ? 'bg-red-50/50' : ''}>
                        <TableCell>
                          {row.isValid ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <span title={row.validationError}>
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-slate-900 text-sm line-clamp-1">{row.question_text}</p>
                          <div className="flex gap-2 text-xs text-slate-500 mt-0.5">
                            <span>A: {row.option_a}</span> | <span>B: {row.option_b}</span>
                            {row.option_c && <span> | C: {row.option_c}</span>}
                          </div>
                          {!row.isValid && (
                            <p className="text-xs text-red-600 font-semibold mt-1">⚠️ {row.validationError}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800 font-bold border-none">
                            Option {row.correct_answer}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">{row.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] uppercase font-normal">
                            {row.difficulty}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline" onClick={() => setCurrentStep(0)}>
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button
                disabled={validCount === 0 || importing}
                onClick={handleStartImport}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Import {validCount} Questions to Firestore
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Step 3: Success Screen */}
      {currentStep === 3 && (
        <Card className="text-center p-12 bg-white border-emerald-200 shadow-md">
          <CardContent className="space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Import Completed Successfully!</h2>
              <p className="text-slate-500 mt-1 text-sm">
                {validCount} questions have been written to your Cloud Firestore repository.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => { setParsedRows([]); setCurrentStep(0); }}>
                Import Another File
              </Button>
              <Button
                onClick={() => router.push('/admin/questions')}
                className="bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold cursor-pointer"
              >
                Go to Question Bank <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
