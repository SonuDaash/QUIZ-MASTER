-- ============================================
-- SMART MIND — Database Schema
-- Migration 001: Initial Schema
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student', 'teacher')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- STUDENTS
-- ============================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  grade INT CHECK (grade BETWEEN 7 AND 10),
  section TEXT,
  school TEXT DEFAULT 'Royal Academy',
  student_code TEXT UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_grade ON students(grade);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- SUBJECTS
-- ============================================
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subjects_category ON subjects(category_id);

-- ============================================
-- TOPICS
-- ============================================
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  grade_range INT[] DEFAULT '{7,8,9,10}',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_topics_subject ON topics(subject_id);

-- ============================================
-- QUESTIONS
-- ============================================
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'mcq' CHECK (question_type IN (
    'mcq', 'direct_answer', 'true_false', 'fill_blank',
    'rapid_fire', 'buzzer', 'audio_visual', 'image_id',
    'audio_id', 'sequence', 'match', 'numerical', 'reasoning'
  )),
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  grade_min INT DEFAULT 7,
  grade_max INT DEFAULT 10,
  marks INT DEFAULT 1,
  negative_marks NUMERIC DEFAULT 0,
  time_limit INT DEFAULT 30,
  source TEXT,
  explanation TEXT,
  verification_status TEXT DEFAULT 'needs_review' CHECK (verification_status IN ('verified', 'needs_review', 'rejected')),
  active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_questions_category ON questions(category_id);
CREATE INDEX idx_questions_subject ON questions(subject_id);
CREATE INDEX idx_questions_topic ON questions(topic_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_type ON questions(question_type);
CREATE INDEX idx_questions_status ON questions(verification_status);
CREATE INDEX idx_questions_active ON questions(active);

-- ============================================
-- QUESTION OPTIONS (for MCQ, True/False)
-- ============================================
CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_label TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0
);

CREATE INDEX idx_options_question ON question_options(question_id);

-- ============================================
-- QUESTION ANSWERS (for non-MCQ)
-- ============================================
CREATE TABLE question_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  accepted_alternatives TEXT[] DEFAULT '{}'
);

CREATE INDEX idx_answers_question ON question_answers(question_id);

-- ============================================
-- QUESTION MEDIA
-- ============================================
CREATE TABLE question_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'audio', 'video')),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_media_question ON question_media(question_id);

-- ============================================
-- QUIZ SESSIONS
-- ============================================
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL DEFAULT 'practice' CHECK (session_type IN (
    'practice', 'test', 'rapid_fire', 'buzzer', 'mock_competition',
    'daily_challenge', 'adaptive', 'mistake_review'
  )),
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  difficulty_filter TEXT,
  total_questions INT NOT NULL DEFAULT 10,
  time_limit INT,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  score NUMERIC DEFAULT 0,
  max_score NUMERIC DEFAULT 0,
  accuracy NUMERIC DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_sessions_student ON quiz_sessions(student_id);
CREATE INDEX idx_sessions_status ON quiz_sessions(status);
CREATE INDEX idx_sessions_type ON quiz_sessions(session_type);

-- ============================================
-- QUIZ RESPONSES
-- ============================================
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
  student_answer TEXT,
  is_correct BOOLEAN,
  is_skipped BOOLEAN DEFAULT false,
  response_time_ms INT,
  marks_awarded NUMERIC DEFAULT 0,
  question_order INT,
  answered_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_responses_session ON quiz_responses(session_id);
CREATE INDEX idx_responses_question ON quiz_responses(question_id);
CREATE INDEX idx_responses_correct ON quiz_responses(is_correct);

-- ============================================
-- TOPIC MASTERY
-- ============================================
CREATE TABLE topic_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  total_attempts INT DEFAULT 0,
  correct_attempts INT DEFAULT 0,
  accuracy NUMERIC DEFAULT 0,
  mastery_level TEXT DEFAULT 'weak' CHECK (mastery_level IN ('weak', 'developing', 'strong', 'mastered')),
  avg_response_time_ms INT,
  last_practiced TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, topic_id)
);

CREATE INDEX idx_mastery_student ON topic_mastery(student_id);
CREATE INDEX idx_mastery_topic ON topic_mastery(topic_id);

-- ============================================
-- STUDENT MISTAKES
-- ============================================
CREATE TABLE student_mistakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  wrong_answer TEXT,
  attempt_count INT DEFAULT 1,
  last_attempted TIMESTAMPTZ DEFAULT now(),
  resolved BOOLEAN DEFAULT false,
  UNIQUE(student_id, question_id)
);

CREATE INDEX idx_mistakes_student ON student_mistakes(student_id);
CREATE INDEX idx_mistakes_resolved ON student_mistakes(resolved);

-- ============================================
-- DAILY CHALLENGES
-- ============================================
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE NOT NULL UNIQUE,
  questions UUID[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- MOCK COMPETITIONS
-- ============================================
CREATE TABLE mock_competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  rounds JSONB NOT NULL DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'in_progress', 'completed')),
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- MOCK RESULTS
-- ============================================
CREATE TABLE mock_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES mock_competitions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  round_scores JSONB DEFAULT '{}',
  total_score NUMERIC DEFAULT 0,
  accuracy NUMERIC DEFAULT 0,
  rank INT,
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_mock_results_competition ON mock_results(competition_id);
CREATE INDEX idx_mock_results_student ON mock_results(student_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER mastery_updated_at
  BEFORE UPDATE ON topic_mastery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Calculate mastery level from accuracy
CREATE OR REPLACE FUNCTION calculate_mastery_level(accuracy_pct NUMERIC)
RETURNS TEXT AS $$
BEGIN
  IF accuracy_pct >= 90 THEN RETURN 'mastered';
  ELSIF accuracy_pct >= 70 THEN RETURN 'strong';
  ELSIF accuracy_pct >= 50 THEN RETURN 'developing';
  ELSE RETURN 'weak';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update topic mastery after quiz response
CREATE OR REPLACE FUNCTION update_topic_mastery()
RETURNS TRIGGER AS $$
DECLARE
  v_student_id UUID;
  v_topic_id UUID;
  v_subject_id UUID;
  v_total INT;
  v_correct INT;
  v_accuracy NUMERIC;
  v_avg_time INT;
BEGIN
  -- Get student_id from session
  SELECT qs.student_id, q.topic_id, q.subject_id
  INTO v_student_id, v_topic_id, v_subject_id
  FROM quiz_sessions qs
  JOIN questions q ON q.id = NEW.question_id
  WHERE qs.id = NEW.session_id;

  IF v_topic_id IS NULL THEN RETURN NEW; END IF;

  -- Calculate stats
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE qr.is_correct = true),
    ROUND(COUNT(*) FILTER (WHERE qr.is_correct = true)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1),
    ROUND(AVG(qr.response_time_ms))
  INTO v_total, v_correct, v_accuracy, v_avg_time
  FROM quiz_responses qr
  JOIN quiz_sessions qs ON qs.id = qr.session_id
  JOIN questions q ON q.id = qr.question_id
  WHERE qs.student_id = v_student_id
    AND q.topic_id = v_topic_id
    AND qr.is_skipped = false;

  -- Upsert mastery
  INSERT INTO topic_mastery (student_id, topic_id, subject_id, total_attempts, correct_attempts, accuracy, mastery_level, avg_response_time_ms, last_practiced)
  VALUES (v_student_id, v_topic_id, v_subject_id, v_total, v_correct, COALESCE(v_accuracy, 0), calculate_mastery_level(COALESCE(v_accuracy, 0)), v_avg_time, now())
  ON CONFLICT (student_id, topic_id)
  DO UPDATE SET
    total_attempts = EXCLUDED.total_attempts,
    correct_attempts = EXCLUDED.correct_attempts,
    accuracy = EXCLUDED.accuracy,
    mastery_level = EXCLUDED.mastery_level,
    avg_response_time_ms = EXCLUDED.avg_response_time_ms,
    last_practiced = now(),
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_quiz_response_mastery
  AFTER INSERT ON quiz_responses
  FOR EACH ROW EXECUTE FUNCTION update_topic_mastery();

-- Track student mistakes
CREATE OR REPLACE FUNCTION track_student_mistake()
RETURNS TRIGGER AS $$
DECLARE
  v_student_id UUID;
BEGIN
  IF NEW.is_correct = false AND NEW.is_skipped = false THEN
    SELECT student_id INTO v_student_id
    FROM quiz_sessions WHERE id = NEW.session_id;

    INSERT INTO student_mistakes (student_id, question_id, wrong_answer, attempt_count, last_attempted)
    VALUES (v_student_id, NEW.question_id, NEW.student_answer, 1, now())
    ON CONFLICT (student_id, question_id)
    DO UPDATE SET
      wrong_answer = EXCLUDED.wrong_answer,
      attempt_count = student_mistakes.attempt_count + 1,
      last_attempted = now(),
      resolved = false;
  ELSIF NEW.is_correct = true THEN
    SELECT student_id INTO v_student_id
    FROM quiz_sessions WHERE id = NEW.session_id;

    UPDATE student_mistakes
    SET resolved = true
    WHERE student_id = v_student_id AND question_id = NEW.question_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_quiz_response_mistake
  AFTER INSERT ON quiz_responses
  FOR EACH ROW EXECUTE FUNCTION track_student_mistake();
