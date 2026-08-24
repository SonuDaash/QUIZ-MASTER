-- ============================================
-- SMART MIND — Seed Data
-- ============================================

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (name, description, icon, display_order) VALUES
  ('Academic', 'Core academic subjects from the school curriculum', 'GraduationCap', 1),
  ('General Knowledge', 'Facts about Nepal, the world, personalities, and more', 'Globe', 2),
  ('Current Affairs', 'Recent national and international events', 'Newspaper', 3),
  ('Intelligence & Reasoning', 'Logic, pattern recognition, and analytical thinking', 'Brain', 4),
  ('Audio-Visual', 'Identify images, sounds, flags, maps, and more', 'Eye', 5),
  ('Special Topics', 'Specialized preparation topics', 'Star', 6);

-- ============================================
-- SUBJECTS
-- ============================================

-- Academic
INSERT INTO subjects (category_id, name, description, display_order)
SELECT c.id, s.name, s.description, s.display_order
FROM categories c,
(VALUES
  ('Science', 'Physics, Chemistry, Biology and Environmental Science', 1),
  ('Mathematics', 'Arithmetic, Algebra, Geometry and Statistics', 2),
  ('English', 'Grammar, Vocabulary, Literature and Comprehension', 3),
  ('Social Studies', 'History, Geography, Civics and Economics', 4),
  ('Computer / ICT', 'Computer Science, Programming, Internet and Digital Literacy', 5),
  ('Environment', 'Environmental science, ecology, and conservation', 6),
  ('Health & Life Skills', 'Health education, nutrition, safety, and life skills', 7)
) AS s(name, description, display_order)
WHERE c.name = 'Academic';

-- General Knowledge
INSERT INTO subjects (category_id, name, description, display_order)
SELECT c.id, s.name, s.description, s.display_order
FROM categories c,
(VALUES
  ('Nepal — History', 'Historical events, rulers, and movements of Nepal', 1),
  ('Nepal — Geography', 'Physical features, districts, rivers, and mountains of Nepal', 2),
  ('Nepal — Culture', 'Festivals, traditions, languages, and ethnic groups', 3),
  ('Nepal — Heritage', 'UNESCO sites, monuments, temples, and heritage of Nepal', 4),
  ('World — Rivers', 'Major rivers of the world', 5),
  ('World — Mountains', 'Mountain ranges, peaks, and geography', 6),
  ('World — Currencies', 'Currencies of different countries', 7),
  ('World — Capitals', 'Capital cities of countries around the world', 8),
  ('Famous Personalities', 'Notable figures from history, science, literature, and more', 9)
) AS s(name, description, display_order)
WHERE c.name = 'General Knowledge';

-- Current Affairs
INSERT INTO subjects (category_id, name, description, display_order)
SELECT c.id, s.name, s.description, s.display_order
FROM categories c,
(VALUES
  ('National Events', 'Major recent events in Nepal', 1),
  ('International Events', 'Major world events and developments', 2),
  ('Science & Technology News', 'Latest discoveries and technology trends', 3),
  ('Sports', 'National and international sports events and records', 4),
  ('Awards & Recognitions', 'Nobel Prize, national awards, and honors', 5),
  ('Discoveries & Inventions', 'Important scientific discoveries and inventions', 6),
  ('Environment & Issues', 'Environmental concerns and contemporary issues', 7)
) AS s(name, description, display_order)
WHERE c.name = 'Current Affairs';

-- Intelligence & Reasoning
INSERT INTO subjects (category_id, name, description, display_order)
SELECT c.id, s.name, s.description, s.display_order
FROM categories c,
(VALUES
  ('Logical Reasoning', 'Pattern recognition, sequences, and logical deduction', 1),
  ('Verbal Reasoning', 'Word puzzles, analogies, and language logic', 2),
  ('Numerical Reasoning', 'Number patterns, series, and mathematical logic', 3),
  ('Spatial Reasoning', 'Shapes, visual patterns, and spatial awareness', 4)
) AS s(name, description, display_order)
WHERE c.name = 'Intelligence & Reasoning';

-- Audio-Visual
INSERT INTO subjects (category_id, name, description, display_order)
SELECT c.id, s.name, s.description, s.display_order
FROM categories c,
(VALUES
  ('Personalities', 'Identify famous people from photographs', 1),
  ('Places & Monuments', 'Identify famous places and monuments', 2),
  ('Flags', 'Identify national and international flags', 3),
  ('Logos & Symbols', 'Identify organization logos and symbols', 4),
  ('Maps', 'Identify countries, regions, and features from maps', 5),
  ('Scientific Images', 'Identify scientific diagrams, instruments, and phenomena', 6),
  ('Sounds & Music', 'Identify sounds, music, and audio clips', 7)
) AS s(name, description, display_order)
WHERE c.name = 'Audio-Visual';

-- ============================================
-- TOPICS (sample for key subjects)
-- ============================================

-- Science Topics
INSERT INTO topics (subject_id, name, description, display_order)
SELECT s.id, t.name, t.description, t.display_order
FROM subjects s,
(VALUES
  ('Force & Motion', 'Newton''s laws, types of forces, friction', 1),
  ('Electricity', 'Current, voltage, resistance, circuits', 2),
  ('Light', 'Reflection, refraction, lenses, mirrors', 3),
  ('Sound', 'Waves, frequency, pitch, echo', 4),
  ('Heat & Temperature', 'Conduction, convection, radiation', 5),
  ('Cell Biology', 'Cell structure, organelles, cell division', 6),
  ('Human Body', 'Organ systems, digestion, circulation', 7),
  ('Chemistry Basics', 'Elements, compounds, reactions, acids & bases', 8),
  ('Earth & Space', 'Solar system, planets, atmosphere', 9),
  ('Ecology', 'Ecosystems, food chains, biodiversity', 10)
) AS t(name, description, display_order)
WHERE s.name = 'Science';

-- Mathematics Topics
INSERT INTO topics (subject_id, name, description, display_order)
SELECT s.id, t.name, t.description, t.display_order
FROM subjects s,
(VALUES
  ('Arithmetic', 'Basic operations, fractions, decimals, percentages', 1),
  ('Algebra', 'Equations, expressions, polynomials', 2),
  ('Geometry', 'Shapes, angles, area, volume, theorems', 3),
  ('Statistics', 'Mean, median, mode, data representation', 4),
  ('Number System', 'Integers, rational numbers, real numbers', 5),
  ('Mensuration', 'Perimeter, area, surface area, volume', 6),
  ('Set Theory', 'Sets, operations, Venn diagrams', 7),
  ('Trigonometry', 'Ratios, identities, applications', 8)
) AS t(name, description, display_order)
WHERE s.name = 'Mathematics';

-- Nepal Geography Topics
INSERT INTO topics (subject_id, name, description, display_order)
SELECT s.id, t.name, t.description, t.display_order
FROM subjects s,
(VALUES
  ('Physical Regions', 'Terai, Hilly, Himalayan regions', 1),
  ('Rivers & Lakes', 'Major rivers, lakes, and water bodies', 2),
  ('Mountains & Peaks', 'Himalayan peaks and mountain ranges', 3),
  ('Districts & Provinces', 'Administrative divisions of Nepal', 4),
  ('National Parks', 'Protected areas and wildlife reserves', 5),
  ('Climate & Weather', 'Climate zones and weather patterns', 6)
) AS t(name, description, display_order)
WHERE s.name = 'Nepal — Geography';

-- Computer/ICT Topics
INSERT INTO topics (subject_id, name, description, display_order)
SELECT s.id, t.name, t.description, t.display_order
FROM subjects s,
(VALUES
  ('Computer Fundamentals', 'Hardware, software, input/output devices', 1),
  ('Operating Systems', 'Windows, Linux, functions of OS', 2),
  ('Internet & Networking', 'Internet basics, protocols, networking', 3),
  ('Programming Basics', 'Algorithms, flowcharts, basic coding', 4),
  ('Database', 'Data storage, DBMS concepts', 5),
  ('Cyber Security', 'Online safety, viruses, encryption', 6),
  ('Digital Literacy', 'Digital tools, online collaboration', 7)
) AS t(name, description, display_order)
WHERE s.name = 'Computer / ICT';

-- Nepal History Topics
INSERT INTO topics (subject_id, name, description, display_order)
SELECT s.id, t.name, t.description, t.display_order
FROM subjects s,
(VALUES
  ('Ancient Nepal', 'Licchavi, Kirat, and early kingdoms', 1),
  ('Medieval Nepal', 'Malla dynasty, kingdoms of Kathmandu Valley', 2),
  ('Unification', 'Prithvi Narayan Shah and unification of Nepal', 3),
  ('Rana Period', 'Rana rule and social reforms', 4),
  ('Democracy Movement', 'People''s movements and democratic changes', 5),
  ('Modern Nepal', 'Republic, constitution, and recent history', 6)
) AS t(name, description, display_order)
WHERE s.name = 'Nepal — History';

-- Discoveries & Inventions Topics
INSERT INTO topics (subject_id, name, description, display_order)
SELECT s.id, t.name, t.description, t.display_order
FROM subjects s,
(VALUES
  ('Scientific Discoveries', 'Major scientific breakthroughs', 1),
  ('Inventions', 'Important inventions and their inventors', 2),
  ('Medical Discoveries', 'Vaccines, medicines, and medical milestones', 3),
  ('Technology Milestones', 'Key technological achievements', 4)
) AS t(name, description, display_order)
WHERE s.name = 'Discoveries & Inventions';

-- ============================================
-- SAMPLE QUESTIONS
-- ============================================

-- Get category and subject IDs for sample questions
DO $$
DECLARE
  v_cat_academic UUID;
  v_cat_gk UUID;
  v_cat_current UUID;
  v_sub_science UUID;
  v_sub_math UUID;
  v_sub_nepal_geo UUID;
  v_sub_nepal_hist UUID;
  v_sub_capitals UUID;
  v_sub_sports UUID;
  v_sub_discoveries UUID;
  v_sub_computer UUID;
  v_topic_cell UUID;
  v_topic_algebra UUID;
  v_topic_rivers UUID;
  v_topic_unification UUID;
  v_topic_force UUID;
  v_topic_electricity UUID;
  v_topic_human_body UUID;
  v_topic_geometry UUID;
  v_topic_arithmetic UUID;
  v_topic_districts UUID;
  v_topic_mountains UUID;
  v_q_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO v_cat_academic FROM categories WHERE name = 'Academic';
  SELECT id INTO v_cat_gk FROM categories WHERE name = 'General Knowledge';
  SELECT id INTO v_cat_current FROM categories WHERE name = 'Current Affairs';

  -- Get subject IDs
  SELECT id INTO v_sub_science FROM subjects WHERE name = 'Science';
  SELECT id INTO v_sub_math FROM subjects WHERE name = 'Mathematics';
  SELECT id INTO v_sub_nepal_geo FROM subjects WHERE name = 'Nepal — Geography';
  SELECT id INTO v_sub_nepal_hist FROM subjects WHERE name = 'Nepal — History';
  SELECT id INTO v_sub_capitals FROM subjects WHERE name = 'World — Capitals';
  SELECT id INTO v_sub_sports FROM subjects WHERE name = 'Sports';
  SELECT id INTO v_sub_discoveries FROM subjects WHERE name = 'Discoveries & Inventions';
  SELECT id INTO v_sub_computer FROM subjects WHERE name = 'Computer / ICT';

  -- Get topic IDs
  SELECT id INTO v_topic_cell FROM topics WHERE name = 'Cell Biology';
  SELECT id INTO v_topic_algebra FROM topics WHERE name = 'Algebra';
  SELECT id INTO v_topic_rivers FROM topics WHERE name = 'Rivers & Lakes';
  SELECT id INTO v_topic_unification FROM topics WHERE name = 'Unification';
  SELECT id INTO v_topic_force FROM topics WHERE name = 'Force & Motion';
  SELECT id INTO v_topic_electricity FROM topics WHERE name = 'Electricity';
  SELECT id INTO v_topic_human_body FROM topics WHERE name = 'Human Body';
  SELECT id INTO v_topic_geometry FROM topics WHERE name = 'Geometry';
  SELECT id INTO v_topic_arithmetic FROM topics WHERE name = 'Arithmetic';
  SELECT id INTO v_topic_districts FROM topics WHERE name = 'Districts & Provinces';
  SELECT id INTO v_topic_mountains FROM topics WHERE name = 'Mountains & Peaks';

  -- =====================
  -- SCIENCE QUESTIONS
  -- =====================

  -- Q1: Powerhouse of the cell
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, topic_id, explanation, source, verification_status)
  VALUES ('What is the powerhouse of the cell?', 'mcq', 'easy', v_cat_academic, v_sub_science, v_topic_cell,
    'Mitochondria are called the powerhouse of the cell because they generate most of the cell''s supply of ATP (adenosine triphosphate), which is used as a source of chemical energy.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'Nucleus', 'A', false, 1),
    (v_q_id, 'Ribosome', 'B', false, 2),
    (v_q_id, 'Mitochondria', 'C', true, 3),
    (v_q_id, 'Cell Wall', 'D', false, 4);

  -- Q2: Unit of force
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, topic_id, explanation, source, verification_status)
  VALUES ('What is the SI unit of force?', 'mcq', 'easy', v_cat_academic, v_sub_science, v_topic_force,
    'The SI unit of force is Newton (N), named after Sir Isaac Newton. 1 Newton is the force needed to accelerate 1 kg of mass at 1 m/s².',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'Joule', 'A', false, 1),
    (v_q_id, 'Newton', 'B', true, 2),
    (v_q_id, 'Pascal', 'C', false, 3),
    (v_q_id, 'Watt', 'D', false, 4);

  -- Q3: Ohm's Law
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, topic_id, explanation, source, verification_status)
  VALUES ('According to Ohm''s Law, what is the relationship between voltage (V), current (I), and resistance (R)?', 'mcq', 'medium', v_cat_academic, v_sub_science, v_topic_electricity,
    'Ohm''s Law states that V = IR, meaning voltage equals current multiplied by resistance.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'V = I / R', 'A', false, 1),
    (v_q_id, 'V = I × R', 'B', true, 2),
    (v_q_id, 'V = I + R', 'C', false, 3),
    (v_q_id, 'V = I² × R', 'D', false, 4);

  -- Q4: Largest organ
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, topic_id, explanation, source, verification_status)
  VALUES ('What is the largest organ of the human body?', 'mcq', 'easy', v_cat_academic, v_sub_science, v_topic_human_body,
    'The skin is the largest organ of the human body, covering about 1.5-2 square meters in adults.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'Liver', 'A', false, 1),
    (v_q_id, 'Heart', 'B', false, 2),
    (v_q_id, 'Skin', 'C', true, 3),
    (v_q_id, 'Brain', 'D', false, 4);

  -- Q5: Newton's Third Law
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, topic_id, explanation, source, verification_status)
  VALUES ('Newton''s Third Law of Motion states that:', 'mcq', 'medium', v_cat_academic, v_sub_science, v_topic_force,
    'Newton''s Third Law states that for every action, there is an equal and opposite reaction. This means forces always come in pairs.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'A body at rest stays at rest', 'A', false, 1),
    (v_q_id, 'Force equals mass times acceleration', 'B', false, 2),
    (v_q_id, 'For every action there is an equal and opposite reaction', 'C', true, 3),
    (v_q_id, 'Energy cannot be created or destroyed', 'D', false, 4);

  -- =====================
  -- MATHEMATICS QUESTIONS
  -- =====================

  -- Q6: Solve equation
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, topic_id, explanation, source, verification_status)
  VALUES ('If 3x + 7 = 22, what is the value of x?', 'mcq', 'easy', v_cat_academic, v_sub_math, v_topic_algebra,
    '3x + 7 = 22 → 3x = 15 → x = 5',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, '3', 'A', false, 1),
    (v_q_id, '5', 'B', true, 2),
    (v_q_id, '7', 'C', false, 3),
    (v_q_id, '15', 'D', false, 4);

  -- Q7: Triangle angles
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, topic_id, explanation, source, verification_status)
  VALUES ('The sum of all angles in a triangle is:', 'mcq', 'easy', v_cat_academic, v_sub_math, v_topic_geometry,
    'The sum of interior angles of a triangle is always 180 degrees. This is a fundamental property of Euclidean geometry.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, '90°', 'A', false, 1),
    (v_q_id, '180°', 'B', true, 2),
    (v_q_id, '270°', 'C', false, 3),
    (v_q_id, '360°', 'D', false, 4);

  -- Q8: Percentage
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, topic_id, explanation, source, verification_status)
  VALUES ('What is 25% of 240?', 'mcq', 'easy', v_cat_academic, v_sub_math, v_topic_arithmetic,
    '25% of 240 = 0.25 × 240 = 60',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, '40', 'A', false, 1),
    (v_q_id, '50', 'B', false, 2),
    (v_q_id, '60', 'C', true, 3),
    (v_q_id, '80', 'D', false, 4);

  -- =====================
  -- NEPAL GEOGRAPHY
  -- =====================

  -- Q9: Longest river
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, topic_id, explanation, source, verification_status)
  VALUES ('Which is the longest river of Nepal?', 'mcq', 'easy', v_cat_gk, v_sub_nepal_geo, v_topic_rivers,
    'The Karnali River (also called Ghaghara in India) is the longest river of Nepal, flowing approximately 507 km within Nepal.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'Koshi', 'A', false, 1),
    (v_q_id, 'Karnali', 'B', true, 2),
    (v_q_id, 'Gandaki', 'C', false, 3),
    (v_q_id, 'Bagmati', 'D', false, 4);

  -- Q10: Number of provinces
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, topic_id, explanation, source, verification_status)
  VALUES ('How many provinces does Nepal have?', 'mcq', 'easy', v_cat_gk, v_sub_nepal_geo, v_topic_districts,
    'Nepal is divided into 7 provinces as per the Constitution of Nepal 2015.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, '5', 'A', false, 1),
    (v_q_id, '7', 'B', true, 2),
    (v_q_id, '9', 'C', false, 3),
    (v_q_id, '14', 'D', false, 4);

  -- Q11: Highest peak
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, topic_id, explanation, source, verification_status)
  VALUES ('Mount Everest is located in which mountain range?', 'mcq', 'easy', v_cat_gk, v_sub_nepal_geo, v_topic_mountains,
    'Mount Everest (8,848.86 m) is located in the Mahalangur Himal sub-range of the Himalayas, on the border of Nepal and Tibet.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'Andes', 'A', false, 1),
    (v_q_id, 'Alps', 'B', false, 2),
    (v_q_id, 'Himalayas', 'C', true, 3),
    (v_q_id, 'Rocky Mountains', 'D', false, 4);

  -- =====================
  -- NEPAL HISTORY
  -- =====================

  -- Q12: Unification
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, topic_id, explanation, source, verification_status)
  VALUES ('Who is known as the unifier of modern Nepal?', 'mcq', 'easy', v_cat_gk, v_sub_nepal_hist, v_topic_unification,
    'Prithvi Narayan Shah, the king of Gorkha, unified the various small kingdoms to form modern Nepal. He conquered Kathmandu Valley in 1768-69.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'Jayasthiti Malla', 'A', false, 1),
    (v_q_id, 'Prithvi Narayan Shah', 'B', true, 2),
    (v_q_id, 'Jung Bahadur Rana', 'C', false, 3),
    (v_q_id, 'Tribhuvan Bir Bikram Shah', 'D', false, 4);

  -- =====================
  -- WORLD CAPITALS
  -- =====================

  -- Q13
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, explanation, source, verification_status)
  VALUES ('What is the capital of Japan?', 'mcq', 'easy', v_cat_gk, v_sub_capitals,
    'Tokyo has been the capital of Japan since 1868. It is one of the most populous metropolitan areas in the world.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'Osaka', 'A', false, 1),
    (v_q_id, 'Tokyo', 'B', true, 2),
    (v_q_id, 'Kyoto', 'C', false, 3),
    (v_q_id, 'Hiroshima', 'D', false, 4);

  -- Q14
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, explanation, source, verification_status)
  VALUES ('What is the capital of Australia?', 'mcq', 'medium', v_cat_gk, v_sub_capitals,
    'Canberra is the capital of Australia, not Sydney or Melbourne as commonly assumed. It was purpose-built as the capital in the early 20th century.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'Sydney', 'A', false, 1),
    (v_q_id, 'Melbourne', 'B', false, 2),
    (v_q_id, 'Canberra', 'C', true, 3),
    (v_q_id, 'Perth', 'D', false, 4);

  -- =====================
  -- DISCOVERIES & INVENTIONS
  -- =====================

  -- Q15
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, explanation, source, verification_status)
  VALUES ('Who invented the telephone?', 'mcq', 'easy', v_cat_current, v_sub_discoveries,
    'Alexander Graham Bell is credited with inventing the first practical telephone in 1876.',
    'Royal Academy Discoveries & Inventions Bank', 'needs_review')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'Thomas Edison', 'A', false, 1),
    (v_q_id, 'Alexander Graham Bell', 'B', true, 2),
    (v_q_id, 'Nikola Tesla', 'C', false, 3),
    (v_q_id, 'Guglielmo Marconi', 'D', false, 4);

  -- Q16
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, explanation, source, verification_status)
  VALUES ('Who discovered penicillin?', 'mcq', 'easy', v_cat_current, v_sub_discoveries,
    'Alexander Fleming discovered penicillin in 1928, which became the first widely used antibiotic.',
    'Royal Academy Discoveries & Inventions Bank', 'needs_review')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'Louis Pasteur', 'A', false, 1),
    (v_q_id, 'Alexander Fleming', 'B', true, 2),
    (v_q_id, 'Edward Jenner', 'C', false, 3),
    (v_q_id, 'Robert Koch', 'D', false, 4);

  -- =====================
  -- COMPUTER / ICT
  -- =====================

  -- Q17
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, explanation, source, verification_status)
  VALUES ('What does CPU stand for?', 'mcq', 'easy', v_cat_academic, v_sub_computer,
    'CPU stands for Central Processing Unit. It is the primary component of a computer that performs most of the processing.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'Central Processing Unit', 'A', true, 1),
    (v_q_id, 'Computer Personal Unit', 'B', false, 2),
    (v_q_id, 'Central Program Utility', 'C', false, 3),
    (v_q_id, 'Computer Processing Unit', 'D', false, 4);

  -- =====================
  -- DIRECT ANSWER QUESTIONS
  -- =====================

  -- Q18: Direct answer
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, explanation, source, verification_status)
  VALUES ('In which year was Nepal declared a Federal Democratic Republic?', 'direct_answer', 'medium', v_cat_gk, v_sub_nepal_hist,
    'Nepal was declared a Federal Democratic Republic on May 28, 2008 (Jestha 15, 2065 BS), ending 240 years of monarchy.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_answers (question_id, answer_text, accepted_alternatives) VALUES
    (v_q_id, '2008', ARRAY['2008 AD', '2065 BS', '2065']);

  -- Q19: True/False
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, explanation, source, verification_status)
  VALUES ('The speed of light is approximately 3 × 10⁸ m/s.', 'true_false', 'easy', v_cat_academic, v_sub_science,
    'The speed of light in vacuum is approximately 299,792,458 m/s, which is roughly 3 × 10⁸ m/s.',
    'PABSON Preparation', 'verified')
  RETURNING id INTO v_q_id;
  INSERT INTO question_options (question_id, option_text, option_label, is_correct, display_order) VALUES
    (v_q_id, 'True', 'A', true, 1),
    (v_q_id, 'False', 'B', false, 2);

  -- Q20: Rapid fire style
  INSERT INTO questions (question_text, question_type, difficulty, category_id, subject_id, explanation, source, verification_status, time_limit)
  VALUES ('What is the chemical symbol for Gold?', 'rapid_fire', 'easy', v_cat_academic, v_sub_science,
    'The chemical symbol for Gold is Au, from the Latin word "Aurum".',
    'PABSON Preparation', 'verified', 10)
  RETURNING id INTO v_q_id;
  INSERT INTO question_answers (question_id, answer_text, accepted_alternatives) VALUES
    (v_q_id, 'Au', ARRAY['au', 'AU']);

END $$;
