/**
 * Firebase Firestore Seed Script for Smart Mind
 * Run with: node scripts/seed-firebase.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local if present
const envPath = join(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

let app;
const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');

if (existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
  console.log(`🔑 Using service account key file: ${serviceAccountPath}`);
  app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
} else {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'smart-mind-app';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (clientEmail && privateKey && privateKey.includes('BEGIN PRIVATE KEY') && !privateKey.includes('...')) {
    app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  } else {
    app = initializeApp({ projectId });
  }
}

const db = getFirestore(app);

const DEFAULT_SUBJECTS = [
  { id: 'subj_geo', name: 'Geography', description: 'World & Nepal Geography, Landforms, Rivers', display_order: 1 },
  { id: 'subj_hist', name: 'History', description: 'Ancient, Medieval, and Modern History', display_order: 2 },
  { id: 'subj_sci', name: 'General Science', description: 'Physics, Chemistry, Biology & Environment', display_order: 3 },
  { id: 'subj_math', name: 'Mathematics', description: 'Arithmetic, Algebra, Geometry & Mensuration', display_order: 4 },
  { id: 'subj_comp', name: 'Computer & ICT', description: 'Computer Basics, Internet, AI & Programming', display_order: 5 },
  { id: 'subj_eng', name: 'English Language', description: 'Grammar, Vocabulary, Comprehension', display_order: 6 },
  { id: 'subj_ca', name: 'Current Affairs', description: 'National and International Events, Sports & Awards', display_order: 7 },
];

const DEFAULT_TOPICS = [
  { id: 'top_nep_geo', subject_id: 'subj_geo', name: 'Nepal Geography', grade_range: [7, 8, 9, 10], display_order: 1 },
  { id: 'top_wld_geo', subject_id: 'subj_geo', name: 'World Geography', grade_range: [7, 8, 9, 10], display_order: 2 },
  { id: 'top_sci_bio', subject_id: 'subj_sci', name: 'Biology & Human Body', grade_range: [7, 8, 9, 10], display_order: 1 },
  { id: 'top_sci_phy', subject_id: 'subj_sci', name: 'Physics & Energy', grade_range: [7, 8, 9, 10], display_order: 2 },
  { id: 'top_sci_chem', subject_id: 'subj_sci', name: 'Chemistry & Matter', grade_range: [7, 8, 9, 10], display_order: 3 },
  { id: 'top_math_alg', subject_id: 'subj_math', name: 'Algebra & Equations', grade_range: [7, 8, 9, 10], display_order: 1 },
];

const DEFAULT_QUESTIONS = [
  {
    id: 'q_geo_01',
    question_text: 'What is the highest mountain peak in the world?',
    question_type: 'mcq',
    difficulty: 'easy',
    subject_id: 'subj_geo',
    topic_id: 'top_nep_geo',
    marks: 1,
    negative_marks: 0,
    time_limit: 30,
    explanation: 'Mount Everest (Sagarmatha) is the highest peak at 8,848.86 meters above sea level.',
    verification_status: 'verified',
    active: true,
    question_options: [
      { id: 'opt_1', option_text: 'K2', option_label: 'A', is_correct: false, display_order: 1 },
      { id: 'opt_2', option_text: 'Kangchenjunga', option_label: 'B', is_correct: false, display_order: 2 },
      { id: 'opt_3', option_text: 'Mount Everest', option_label: 'C', is_correct: true, display_order: 3 },
      { id: 'opt_4', option_text: 'Lhotse', option_label: 'D', is_correct: false, display_order: 4 },
    ],
  },
  {
    id: 'q_sci_01',
    question_text: 'Which organelle is known as the powerhouse of the cell?',
    question_type: 'mcq',
    difficulty: 'easy',
    subject_id: 'subj_sci',
    topic_id: 'top_sci_bio',
    marks: 1,
    negative_marks: 0,
    time_limit: 30,
    explanation: 'Mitochondria generate most of the chemical energy needed to power the cell.',
    verification_status: 'verified',
    active: true,
    question_options: [
      { id: 'opt_5', option_text: 'Ribosome', option_label: 'A', is_correct: false, display_order: 1 },
      { id: 'opt_6', option_text: 'Mitochondria', option_label: 'B', is_correct: true, display_order: 2 },
      { id: 'opt_7', option_text: 'Nucleus', option_label: 'C', is_correct: false, display_order: 3 },
      { id: 'opt_8', option_text: 'Golgi Apparatus', option_label: 'D', is_correct: false, display_order: 4 },
    ],
  },
  {
    id: 'q_comp_01',
    question_text: 'What does "HTML" stand for?',
    question_type: 'mcq',
    difficulty: 'easy',
    subject_id: 'subj_comp',
    marks: 1,
    negative_marks: 0,
    time_limit: 30,
    explanation: 'HTML stands for HyperText Markup Language, the standard markup for documents designed to be displayed in a web browser.',
    verification_status: 'verified',
    active: true,
    question_options: [
      { id: 'opt_9', option_text: 'Hyper Text Multiple Language', option_label: 'A', is_correct: false, display_order: 1 },
      { id: 'opt_10', option_text: 'Hyper Text Markup Language', option_label: 'B', is_correct: true, display_order: 2 },
      { id: 'opt_11', option_text: 'High Tech Modern Language', option_label: 'C', is_correct: false, display_order: 3 },
      { id: 'opt_12', option_text: 'Hyper Transfer Markup Language', option_label: 'D', is_correct: false, display_order: 4 },
    ],
  }
];

async function seed() {
  console.log('🚀 Starting Firestore seed for Smart Mind...');

  // 1. Seed Subjects
  console.log('📦 Seeding Subjects...');
  for (const subj of DEFAULT_SUBJECTS) {
    await db.collection('subjects').doc(subj.id).set(subj, { merge: true });
    console.log(`  ✓ Subject: ${subj.name}`);
  }

  // 2. Seed Topics
  console.log('📦 Seeding Topics...');
  for (const topic of DEFAULT_TOPICS) {
    await db.collection('topics').doc(topic.id).set(topic, { merge: true });
    console.log(`  ✓ Topic: ${topic.name}`);
  }

  // 3. Seed Questions
  console.log('📦 Seeding Questions...');
  for (const q of DEFAULT_QUESTIONS) {
    await db.collection('questions').doc(q.id).set(q, { merge: true });
    console.log(`  ✓ Question: ${q.question_text.slice(0, 30)}...`);
  }

  console.log('✅ Firestore seeding completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
