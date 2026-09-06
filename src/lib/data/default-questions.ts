export interface PracticeQuestion {
  id: string;
  question_text: string;
  category: string;
  subject_id?: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit?: number;
  explanation: string;
  marks?: number;
  image_url?: string;
  question_options: {
    id: string;
    option_label: 'A' | 'B' | 'C' | 'D';
    option_text: string;
    is_correct: boolean;
  }[];
}

export const COMPREHENSIVE_QUESTION_BANK: PracticeQuestion[] = [
  // ==========================================
  // 1. NEPAL PARICHAYA & HERITAGE
  // ==========================================
  {
    id: 'np_01',
    question_text: 'Which national park in Nepal was the first to be established and is renowned for the conservation of the One-horned Rhinoceros?',
    category: 'Nepal Parichaya',
    subject_id: 'subj_geo',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'Established in 1973 (2030 BS), Chitwan National Park is Nepal’s first national park and a UNESCO World Heritage site.',
    marks: 1,
    question_options: [
      { id: 'np_01_a', option_label: 'A', option_text: 'Bardia National Park', is_correct: false },
      { id: 'np_01_b', option_label: 'B', option_text: 'Sagarmatha National Park', is_correct: false },
      { id: 'np_01_c', option_label: 'C', option_text: 'Chitwan National Park', is_correct: true },
      { id: 'np_01_d', option_label: 'D', option_text: 'Langtang National Park', is_correct: false },
    ],
  },
  {
    id: 'np_02',
    question_text: 'What is the official height of Mount Everest (Sagarmatha) measured jointly by Nepal and China in December 2020?',
    category: 'Nepal Parichaya',
    subject_id: 'subj_geo',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'In December 2020, Nepal and China officially announced the new height of Mount Everest as 8,848.86 meters.',
    marks: 1,
    question_options: [
      { id: 'np_02_a', option_label: 'A', option_text: '8,844.43 meters', is_correct: false },
      { id: 'np_02_b', option_label: 'B', option_text: '8,848.86 meters', is_correct: true },
      { id: 'np_02_c', option_label: 'C', option_text: '8,850.00 meters', is_correct: false },
      { id: 'np_02_d', option_label: 'D', option_text: '8,846.50 meters', is_correct: false },
    ],
  },
  {
    id: 'np_03',
    question_text: 'Which is the deepest gorge in the world, carved between the Dhaulagiri and Annapurna massifs in Nepal?',
    category: 'Nepal Parichaya',
    subject_id: 'subj_geo',
    difficulty: 'medium',
    time_limit: 30,
    explanation: 'The Kali Gandaki Gorge (Andha Galchi) is considered the deepest river gorge in the world, carved by the Kali Gandaki River.',
    marks: 1,
    question_options: [
      { id: 'np_03_a', option_label: 'A', option_text: 'Arun Valley Gorge', is_correct: false },
      { id: 'np_03_b', option_label: 'B', option_text: 'Kali Gandaki Gorge', is_correct: true },
      { id: 'np_03_c', option_label: 'C', option_text: 'Trishuli Canyon', is_correct: false },
      { id: 'np_03_d', option_label: 'D', option_text: 'Marsyangdi Valley', is_correct: false },
    ],
  },
  {
    id: 'np_04',
    question_text: 'Which lake in Nepal is located at one of the highest elevations in the world (4,919 m) in Manang district?',
    category: 'Nepal Parichaya',
    subject_id: 'subj_geo',
    difficulty: 'medium',
    time_limit: 30,
    explanation: 'Tilicho Lake is located at an altitude of 4,919 meters in the Manang district of Nepal.',
    marks: 1,
    question_options: [
      { id: 'np_04_a', option_label: 'A', option_text: 'Rara Lake', is_correct: false },
      { id: 'np_04_b', option_label: 'B', option_text: 'Shey Phoksundo Lake', is_correct: false },
      { id: 'np_04_c', option_label: 'C', option_text: 'Tilicho Lake', is_correct: true },
      { id: 'np_04_d', option_label: 'D', option_text: 'Gosainkunda Lake', is_correct: false },
    ],
  },
  {
    id: 'np_05',
    question_text: 'Which is the longest river running entirely within the sovereign territory of Nepal?',
    category: 'Nepal Parichaya',
    subject_id: 'subj_geo',
    difficulty: 'medium',
    time_limit: 30,
    explanation: 'The Karnali River is the longest river in Nepal, measuring approximately 507 km within Nepalese territory.',
    marks: 1,
    question_options: [
      { id: 'np_05_a', option_label: 'A', option_text: 'Sapta Koshi', is_correct: false },
      { id: 'np_05_b', option_label: 'B', option_text: 'Sapta Gandaki', is_correct: false },
      { id: 'np_05_c', option_label: 'C', option_text: 'Karnali River', is_correct: true },
      { id: 'np_05_d', option_label: 'D', option_text: 'Mahakali River', is_correct: false },
    ],
  },
  {
    id: 'np_06',
    question_text: 'Which district of Nepal is celebrated as the "District of 52 Lakes and 53 Hills"?',
    category: 'Nepal Parichaya',
    subject_id: 'subj_geo',
    difficulty: 'hard',
    time_limit: 30,
    explanation: 'Rukum district in Western Nepal is culturally celebrated for having 52 lakes and 53 hills.',
    marks: 2,
    question_options: [
      { id: 'np_06_a', option_label: 'A', option_text: 'Mustang', is_correct: false },
      { id: 'np_06_b', option_label: 'B', option_text: 'Rukum', is_correct: true },
      { id: 'np_06_c', option_label: 'C', option_text: 'Dolpa', is_correct: false },
      { id: 'np_06_d', option_label: 'D', option_text: 'Solukhumbu', is_correct: false },
    ],
  },

  // ==========================================
  // 2. MATHEMATICS & LOGICAL REASONING
  // ==========================================
  {
    id: 'math_01',
    question_text: 'What is the sum of the interior angles of a regular hexagon (6-sided polygon)?',
    category: 'Mathematics',
    subject_id: 'subj_math',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'Using the polygon angle formula: (n - 2) * 180°. For a hexagon (n=6), (6 - 2) * 180° = 4 * 180° = 720°.',
    marks: 1,
    question_options: [
      { id: 'math_01_a', option_label: 'A', option_text: '540°', is_correct: false },
      { id: 'math_01_b', option_label: 'B', option_text: '720°', is_correct: true },
      { id: 'math_01_c', option_label: 'C', option_text: '900°', is_correct: false },
      { id: 'math_01_d', option_label: 'D', option_text: '1080°', is_correct: false },
    ],
  },
  {
    id: 'math_02',
    question_text: 'What is the value of the hypotenuse in a right-angled triangle with base = 6 cm and height = 8 cm?',
    category: 'Mathematics',
    subject_id: 'subj_math',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'According to the Pythagorean theorem: c = √(6² + 8²) = √(36 + 64) = √100 = 10 cm.',
    marks: 1,
    question_options: [
      { id: 'math_02_a', option_label: 'A', option_text: '9 cm', is_correct: false },
      { id: 'math_02_b', option_label: 'B', option_text: '10 cm', is_correct: true },
      { id: 'math_02_c', option_label: 'C', option_text: '12 cm', is_correct: false },
      { id: 'math_02_d', option_label: 'D', option_text: '14 cm', is_correct: false },
    ],
  },
  {
    id: 'math_03',
    question_text: 'If the radius of a circle is doubled, by what factor does its surface area increase?',
    category: 'Mathematics',
    subject_id: 'subj_math',
    difficulty: 'medium',
    time_limit: 30,
    explanation: 'Area of circle = πr². If radius becomes 2r, new area = π(2r)² = 4πr², which is 4 times the original area.',
    marks: 1,
    question_options: [
      { id: 'math_03_a', option_label: 'A', option_text: '2 times', is_correct: false },
      { id: 'math_03_b', option_label: 'B', option_text: '4 times', is_correct: true },
      { id: 'math_03_c', option_label: 'C', option_text: '8 times', is_correct: false },
      { id: 'math_03_d', option_label: 'D', option_text: '16 times', is_correct: false },
    ],
  },
  {
    id: 'math_04',
    question_text: 'Find the next number in the arithmetic-square sequence: 1, 4, 9, 16, 25, 36, ... ?',
    category: 'Mathematics',
    subject_id: 'subj_math',
    difficulty: 'easy',
    time_limit: 20,
    explanation: 'This is the sequence of consecutive positive squares: 1², 2², 3², 4², 5², 6², 7² = 49.',
    marks: 1,
    question_options: [
      { id: 'math_04_a', option_label: 'A', option_text: '45', is_correct: false },
      { id: 'math_04_b', option_label: 'B', option_text: '48', is_correct: false },
      { id: 'math_04_c', option_label: 'C', option_text: '49', is_correct: true },
      { id: 'math_04_d', option_label: 'D', option_text: '56', is_correct: false },
    ],
  },

  // ==========================================
  // 3. HISTORY & CIVILIZATIONS
  // ==========================================
  {
    id: 'hist_01',
    question_text: 'Who was the first King of unified modern Nepal, establishing the capital at Kathmandu in 1768 AD?',
    category: 'History',
    subject_id: 'subj_hist',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'King Prithvi Narayan Shah of Gorkha unified the fragmented principalities into modern Nepal in 1768 AD (1825 BS).',
    marks: 1,
    question_options: [
      { id: 'hist_01_a', option_label: 'A', option_text: 'Prithvi Narayan Shah', is_correct: true },
      { id: 'hist_01_b', option_label: 'B', option_text: 'Tribhuvan Bir Bikram Shah', is_correct: false },
      { id: 'hist_01_c', option_label: 'C', option_text: 'Mahendra Bir Bikram Shah', is_correct: false },
      { id: 'hist_01_d', option_label: 'D', option_text: 'Birendra Bir Bikram Shah', is_correct: false },
    ],
  },
  {
    id: 'hist_02',
    question_text: 'Which historic treaty ended the Anglo-Nepalese War between the Kingdom of Nepal and the British East India Company in 1816?',
    category: 'History',
    subject_id: 'subj_hist',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'The Treaty of Sugauli was ratified in March 1816, establishing the modern international boundaries of Nepal.',
    marks: 1,
    question_options: [
      { id: 'hist_02_a', option_label: 'A', option_text: 'Treaty of Betrawati', is_correct: false },
      { id: 'hist_02_b', option_label: 'B', option_text: 'Treaty of Sugauli', is_correct: true },
      { id: 'hist_02_c', option_label: 'C', option_text: 'Treaty of Thapathali', is_correct: false },
      { id: 'hist_02_d', option_label: 'D', option_text: 'Treaty of Lahore', is_correct: false },
    ],
  },
  {
    id: 'hist_03',
    question_text: 'In which year did the historic Kot Parva (Kot Massacre) occur in Kathmandu, leading to the rise of the Rana Regime?',
    category: 'History',
    subject_id: 'subj_hist',
    difficulty: 'medium',
    time_limit: 30,
    explanation: 'The Kot Massacre occurred on September 14, 1846 (1903 BS), through which Jung Bahadur Rana established 104 years of autocratic Rana rule.',
    marks: 1,
    question_options: [
      { id: 'hist_03_a', option_label: 'A', option_text: '1816 AD (1872 BS)', is_correct: false },
      { id: 'hist_03_b', option_label: 'B', option_text: '1846 AD (1903 BS)', is_correct: true },
      { id: 'hist_03_c', option_label: 'C', option_text: '1901 AD (1958 BS)', is_correct: false },
      { id: 'hist_03_d', option_label: 'D', option_text: '1951 AD (2007 BS)', is_correct: false },
    ],
  },
  {
    id: 'hist_04',
    question_text: 'Who was the first elected Prime Minister of Nepal following the historic 2015 BS general elections?',
    category: 'History',
    subject_id: 'subj_hist',
    difficulty: 'medium',
    time_limit: 30,
    explanation: 'Bishweshwar Prasad (B.P.) Koirala became the first democratically elected Prime Minister of Nepal in 1959 (2016 BS).',
    marks: 1,
    question_options: [
      { id: 'hist_04_a', option_label: 'A', option_text: 'Matrika Prasad Koirala', is_correct: false },
      { id: 'hist_04_b', option_label: 'B', option_text: 'Bishweshwar Prasad (B.P.) Koirala', is_correct: true },
      { id: 'hist_04_c', option_label: 'C', option_text: 'Tanka Prasad Acharya', is_correct: false },
      { id: 'hist_04_d', option_label: 'D', option_text: 'Subarna Shumsher Rana', is_correct: false },
    ],
  },

  // ==========================================
  // 4. WORLD GEOGRAPHY & ENVIRONMENT
  // ==========================================
  {
    id: 'geo_01',
    question_text: 'Which is the largest hot desert on Earth, spanning over 9 million square kilometers across Northern Africa?',
    category: 'Geography',
    subject_id: 'subj_geo',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'The Sahara Desert is the world’s largest non-polar hot desert, covering roughly 31% of the African continent.',
    marks: 1,
    question_options: [
      { id: 'geo_01_a', option_label: 'A', option_text: 'Gobi Desert', is_correct: false },
      { id: 'geo_01_b', option_label: 'B', option_text: 'Sahara Desert', is_correct: true },
      { id: 'geo_01_c', option_label: 'C', option_text: 'Kalahari Desert', is_correct: false },
      { id: 'geo_01_d', option_label: 'D', option_text: 'Atacama Desert', is_correct: false },
    ],
  },
  {
    id: 'geo_02',
    question_text: 'Which river holds the record for having the largest volume of water discharge into the world’s oceans?',
    category: 'Geography',
    subject_id: 'subj_geo',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'The Amazon River in South America discharges approximately 209,000 cubic meters of water per second, more than any other river.',
    marks: 1,
    question_options: [
      { id: 'geo_02_a', option_label: 'A', option_text: 'Nile River', is_correct: false },
      { id: 'geo_02_b', option_label: 'B', option_text: 'Amazon River', is_correct: true },
      { id: 'geo_02_c', option_label: 'C', option_text: 'Yangtze River', is_correct: false },
      { id: 'geo_02_d', option_label: 'D', option_text: 'Mississippi River', is_correct: false },
    ],
  },
  {
    id: 'geo_03',
    question_text: 'Which is the largest landlocked country in the world by total surface area?',
    category: 'Geography',
    subject_id: 'subj_geo',
    difficulty: 'medium',
    time_limit: 30,
    explanation: 'Kazakhstan in Central Asia is the largest landlocked country on Earth, covering 2.72 million square kilometers.',
    marks: 1,
    question_options: [
      { id: 'geo_03_a', option_label: 'A', option_text: 'Mongolia', is_correct: false },
      { id: 'geo_03_b', option_label: 'B', option_text: 'Kazakhstan', is_correct: true },
      { id: 'geo_03_c', option_label: 'C', option_text: 'Bolivia', is_correct: false },
      { id: 'geo_03_d', option_label: 'D', option_text: 'Chad', is_correct: false },
    ],
  },
  {
    id: 'geo_04',
    question_text: 'Which strait connects the Mediterranean Sea to the Atlantic Ocean, separating Spain from Morocco?',
    category: 'Geography',
    subject_id: 'subj_geo',
    difficulty: 'medium',
    time_limit: 30,
    explanation: 'The Strait of Gibraltar connects the Atlantic Ocean to the Mediterranean Sea and separates Europe from Africa.',
    marks: 1,
    question_options: [
      { id: 'geo_04_a', option_label: 'A', option_text: 'Strait of Malacca', is_correct: false },
      { id: 'geo_04_b', option_label: 'B', option_text: 'Strait of Gibraltar', is_correct: true },
      { id: 'geo_04_c', option_label: 'C', option_text: 'Bering Strait', is_correct: false },
      { id: 'geo_04_d', option_label: 'D', option_text: 'Bosphorus Strait', is_correct: false },
    ],
  },

  // ==========================================
  // 5. SCIENCE & TECHNOLOGY
  // ==========================================
  {
    id: 'sci_01',
    question_text: 'Which cellular organelle is known as the "Powerhouse of the Cell" because it synthesizes ATP?',
    category: 'Science',
    subject_id: 'subj_sci',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'Mitochondria generate most of the chemical energy needed by eukaryotic cells through cellular respiration.',
    marks: 1,
    question_options: [
      { id: 'sci_01_a', option_label: 'A', option_text: 'Ribosome', is_correct: false },
      { id: 'sci_01_b', option_label: 'B', option_text: 'Mitochondria', is_correct: true },
      { id: 'sci_01_c', option_label: 'C', option_text: 'Endoplasmic Reticulum', is_correct: false },
      { id: 'sci_01_d', option_label: 'D', option_text: 'Golgi Complex', is_correct: false },
    ],
  },
  {
    id: 'sci_02',
    question_text: 'What is the speed of light in vacuum in SI units (rounded to the nearest million meters per second)?',
    category: 'Science',
    subject_id: 'subj_sci',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'The speed of light in vacuum is defined as exactly 299,792,458 meters per second (approx 3 x 10⁸ m/s).',
    marks: 1,
    question_options: [
      { id: 'sci_02_a', option_label: 'A', option_text: '150,000,000 m/s', is_correct: false },
      { id: 'sci_02_b', option_label: 'B', option_text: '300,000,000 m/s', is_correct: true },
      { id: 'sci_02_c', option_label: 'C', option_text: '450,000,000 m/s', is_correct: false },
      { id: 'sci_02_d', option_label: 'D', option_text: '600,000,000 m/s', is_correct: false },
    ],
  },
  {
    id: 'sci_03',
    question_text: 'Which chemical element has the lowest atomic number (Atomic Number = 1) in the Periodic Table?',
    category: 'Science',
    subject_id: 'subj_sci',
    difficulty: 'easy',
    time_limit: 20,
    explanation: 'Hydrogen (H) has an atomic number of 1 and is the lightest and most abundant chemical element in the universe.',
    marks: 1,
    question_options: [
      { id: 'sci_03_a', option_label: 'A', option_text: 'Helium', is_correct: false },
      { id: 'sci_03_b', option_label: 'B', option_text: 'Hydrogen', is_correct: true },
      { id: 'sci_03_c', option_label: 'C', option_text: 'Lithium', is_correct: false },
      { id: 'sci_03_d', option_label: 'D', option_text: 'Beryllium', is_correct: false },
    ],
  },
  {
    id: 'sci_04',
    question_text: 'Which metal is in liquid state at standard room temperature and pressure (25°C)?',
    category: 'Science',
    subject_id: 'subj_sci',
    difficulty: 'easy',
    time_limit: 30,
    explanation: 'Mercury (Hg) is the only metallic element that is liquid at standard conditions for temperature and pressure.',
    marks: 1,
    question_options: [
      { id: 'sci_04_a', option_label: 'A', option_text: 'Gallium', is_correct: false },
      { id: 'sci_04_b', option_label: 'B', option_text: 'Mercury', is_correct: true },
      { id: 'sci_04_c', option_label: 'C', option_text: 'Bromine', is_correct: false },
      { id: 'sci_04_d', option_label: 'D', option_text: 'Lead', is_correct: false },
    ],
  },

  // ==========================================
  // 6. COMPUTER & INFORMATION TECHNOLOGY
  // ==========================================
  {
    id: 'comp_01',
    question_text: 'What does the networking acronym "HTTP" stand for in web browsers and internet protocols?',
    category: 'Computer & Tech',
    subject_id: 'subj_comp',
    difficulty: 'easy',
    time_limit: 25,
    explanation: 'HTTP stands for HyperText Transfer Protocol, the foundational protocol used by the World Wide Web.',
    marks: 1,
    question_options: [
      { id: 'comp_01_a', option_label: 'A', option_text: 'High-speed Text Transfer Path', is_correct: false },
      { id: 'comp_01_b', option_label: 'B', option_text: 'HyperText Transfer Protocol', is_correct: true },
      { id: 'comp_01_c', option_label: 'C', option_text: 'Hyper Transfer Terminal Packet', is_correct: false },
      { id: 'comp_01_d', option_label: 'D', option_text: 'Host Text Transmission Port', is_correct: false },
    ],
  },
  {
    id: 'comp_02',
    question_text: 'Which memory type in computer systems is volatile and loses its contents when power is turned off?',
    category: 'Computer & Tech',
    subject_id: 'subj_comp',
    difficulty: 'easy',
    time_limit: 25,
    explanation: 'RAM (Random Access Memory) is primary volatile memory that requires constant electrical power to retain data.',
    marks: 1,
    question_options: [
      { id: 'comp_02_a', option_label: 'A', option_text: 'ROM (Read Only Memory)', is_correct: false },
      { id: 'comp_02_b', option_label: 'B', option_text: 'RAM (Random Access Memory)', is_correct: true },
      { id: 'comp_02_c', option_label: 'C', option_text: 'SSD (Solid State Drive)', is_correct: false },
      { id: 'comp_02_d', option_label: 'D', option_text: 'Flash Memory', is_correct: false },
    ],
  },

  // ==========================================
  // 7. CURRENT AFFAIRS & GENERAL KNOWLEDGE
  // ==========================================
  {
    id: 'ca_01',
    question_text: 'Which country hosted the 33rd Summer Olympic Games in July-August 2024?',
    category: 'Current Affairs',
    subject_id: 'subj_ca',
    difficulty: 'easy',
    time_limit: 25,
    explanation: 'The 2024 Summer Olympics (Paris 2024) were held in Paris, France.',
    marks: 1,
    question_options: [
      { id: 'ca_01_a', option_label: 'A', option_text: 'Tokyo, Japan', is_correct: false },
      { id: 'ca_01_b', option_label: 'B', option_text: 'Paris, France', is_correct: true },
      { id: 'ca_01_c', option_label: 'C', option_text: 'Los Angeles, USA', is_correct: false },
      { id: 'ca_01_d', option_label: 'D', option_text: 'Brisbane, Australia', is_correct: false },
    ],
  },
  {
    id: 'ca_02',
    question_text: 'Which international organization with 193 member states was established on 24 October 1945 in San Francisco?',
    category: 'Current Affairs',
    subject_id: 'subj_ca',
    difficulty: 'easy',
    time_limit: 25,
    explanation: 'The United Nations (UN) was founded on October 24, 1945, after World War II to maintain international peace and security.',
    marks: 1,
    question_options: [
      { id: 'ca_02_a', option_label: 'A', option_text: 'World Bank', is_correct: false },
      { id: 'ca_02_b', option_label: 'B', option_text: 'United Nations (UN)', is_correct: true },
      { id: 'ca_02_c', option_label: 'C', option_text: 'World Trade Organization (WTO)', is_correct: false },
      { id: 'ca_02_d', option_label: 'D', option_text: 'International Monetary Fund (IMF)', is_correct: false },
    ],
  },

  // ==========================================
  // 8. AUDIO-VISUAL & MULTIMEDIA ROUND
  // ==========================================
  {
    id: 'av_01',
    question_text: 'Identify the iconic UNESCO World Heritage site known as the "Monkey Temple" situated on a hilltop in the Kathmandu Valley.',
    category: 'Audio-Visual',
    subject_id: 'subj_hist',
    difficulty: 'easy',
    time_limit: 25,
    explanation: 'Swayambhunath Stupa, famously referred to as the Monkey Temple, is an ancient religious architecture atop a hill in Kathmandu Valley.',
    marks: 2,
    image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    question_options: [
      { id: 'av_01_a', option_label: 'A', option_text: 'Boudhanath Stupa', is_correct: false },
      { id: 'av_01_b', option_label: 'B', option_text: 'Swayambhunath Stupa', is_correct: true },
      { id: 'av_01_c', option_label: 'C', option_text: 'Pashupatinath Temple', is_correct: false },
      { id: 'av_01_d', option_label: 'D', option_text: 'Changunarayan Temple', is_correct: false },
    ],
  },
  {
    id: 'av_02',
    question_text: 'Which celestial body in our solar system is depicted with prominent icy rings orbiting around its equator?',
    category: 'Audio-Visual',
    subject_id: 'subj_sci',
    difficulty: 'easy',
    time_limit: 20,
    explanation: 'Saturn has the most extensive and visible ring system of any planet in our solar system.',
    marks: 2,
    image_url: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&w=800&q=80',
    question_options: [
      { id: 'av_02_a', option_label: 'A', option_text: 'Jupiter', is_correct: false },
      { id: 'av_02_b', option_label: 'B', option_text: 'Saturn', is_correct: true },
      { id: 'av_02_c', option_label: 'C', option_text: 'Uranus', is_correct: false },
      { id: 'av_02_d', option_label: 'D', option_text: 'Neptune', is_correct: false },
    ],
  },
  {
    id: 'av_03',
    question_text: 'Identify the state national flower of Nepal (Rhododendron arboreum) depicted in national emblems.',
    category: 'Nepal Parichaya',
    subject_id: 'subj_geo',
    difficulty: 'easy',
    time_limit: 25,
    explanation: 'Lali Gurans (Rhododendron arboreum) is the official national flower of Nepal.',
    marks: 2,
    image_url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    question_options: [
      { id: 'av_03_a', option_label: 'A', option_text: 'Lali Gurans (Rhododendron)', is_correct: true },
      { id: 'av_03_b', option_label: 'B', option_text: 'Lotus (Kamal)', is_correct: false },
      { id: 'av_03_c', option_label: 'C', option_text: 'Sayapatri (Marigold)', is_correct: false },
      { id: 'av_03_d', option_label: 'D', option_text: 'Sunakhari (Orchid)', is_correct: false },
    ],
  },
];
