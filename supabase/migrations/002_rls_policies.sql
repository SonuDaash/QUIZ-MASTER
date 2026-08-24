-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_results ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- STUDENTS
CREATE POLICY "Students view own record" ON students FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins manage students" ON students FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- CATEGORIES, SUBJECTS, TOPICS (read by all authenticated, write by admin)
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Anyone can read subjects" ON subjects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage subjects" ON subjects FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Anyone can read topics" ON topics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage topics" ON topics FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- QUESTIONS (students see only verified+active, admins see all)
CREATE POLICY "Students read verified questions" ON questions FOR SELECT USING (
  (active = true AND verification_status = 'verified') OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins manage questions" ON questions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- QUESTION OPTIONS
CREATE POLICY "Authenticated read options" ON question_options FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage options" ON question_options FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- QUESTION ANSWERS
CREATE POLICY "Admins manage answers" ON question_answers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- QUESTION MEDIA
CREATE POLICY "Authenticated read media" ON question_media FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage media" ON question_media FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- QUIZ SESSIONS
CREATE POLICY "Students own sessions" ON quiz_sessions FOR ALL USING (
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
);
CREATE POLICY "Admins read all sessions" ON quiz_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- QUIZ RESPONSES
CREATE POLICY "Students own responses" ON quiz_responses FOR ALL USING (
  session_id IN (
    SELECT qs.id FROM quiz_sessions qs
    JOIN students s ON s.id = qs.student_id
    WHERE s.user_id = auth.uid()
  )
);
CREATE POLICY "Admins read all responses" ON quiz_responses FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- TOPIC MASTERY
CREATE POLICY "Students own mastery" ON topic_mastery FOR SELECT USING (
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
);
CREATE POLICY "Admins read all mastery" ON topic_mastery FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- STUDENT MISTAKES
CREATE POLICY "Students own mistakes" ON student_mistakes FOR SELECT USING (
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
);
CREATE POLICY "Admins read all mistakes" ON student_mistakes FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- DAILY CHALLENGES
CREATE POLICY "Authenticated read challenges" ON daily_challenges FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage challenges" ON daily_challenges FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- MOCK COMPETITIONS
CREATE POLICY "Authenticated read competitions" ON mock_competitions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage competitions" ON mock_competitions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- MOCK RESULTS
CREATE POLICY "Students own results" ON mock_results FOR SELECT USING (
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
);
CREATE POLICY "Admins read all results" ON mock_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
