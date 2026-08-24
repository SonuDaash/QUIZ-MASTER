// Database types
export type UserRole = 'admin' | 'student' | 'teacher';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type VerificationStatus = 'verified' | 'needs_review' | 'rejected';
export type MasteryLevel = 'weak' | 'developing' | 'strong' | 'mastered';
export type QuestionType = 
  | 'mcq' | 'direct_answer' | 'true_false' | 'fill_blank'
  | 'rapid_fire' | 'buzzer' | 'audio_visual' | 'image_id'
  | 'audio_id' | 'sequence' | 'match' | 'numerical' | 'reasoning';
export type SessionType = 
  | 'practice' | 'test' | 'rapid_fire' | 'buzzer' | 'mock_competition'
  | 'daily_challenge' | 'adaptive' | 'mistake_review';
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';
export type MediaType = 'image' | 'audio' | 'video';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Student {
  id: string;
  user_id: string | null;
  name: string;
  grade: number;
  section: string | null;
  school: string;
  student_code: string | null;
  active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
}

export interface Subject {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  display_order: number;
  // Joined
  category?: Category;
  topics?: Topic[];
  question_count?: number;
}

export interface Topic {
  id: string;
  subject_id: string;
  name: string;
  description: string | null;
  grade_range: number[];
  display_order: number;
  // Joined
  subject?: Subject;
  question_count?: number;
  mastery?: TopicMastery;
}

export interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  difficulty: Difficulty;
  category_id: string | null;
  subject_id: string | null;
  topic_id: string | null;
  grade_min: number;
  grade_max: number;
  marks: number;
  negative_marks: number;
  time_limit: number;
  source: string | null;
  explanation: string | null;
  verification_status: VerificationStatus;
  active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
  subject?: Subject;
  topic?: Topic;
  options?: QuestionOption[];
  answers?: QuestionAnswer[];
  media?: QuestionMedia[];
}

export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  option_label: string;
  is_correct: boolean;
  display_order: number;
}

export interface QuestionAnswer {
  id: string;
  question_id: string;
  answer_text: string;
  accepted_alternatives: string[];
}

export interface QuestionMedia {
  id: string;
  question_id: string;
  media_type: MediaType;
  file_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  created_at: string;
}

export interface QuizSession {
  id: string;
  student_id: string;
  session_type: SessionType;
  subject_id: string | null;
  topic_id: string | null;
  difficulty_filter: string | null;
  total_questions: number;
  time_limit: number | null;
  status: SessionStatus;
  score: number;
  max_score: number;
  accuracy: number;
  started_at: string;
  completed_at: string | null;
  metadata: Record<string, unknown>;
}

export interface QuizResponse {
  id: string;
  session_id: string;
  question_id: string;
  student_answer: string | null;
  is_correct: boolean | null;
  is_skipped: boolean;
  response_time_ms: number | null;
  marks_awarded: number;
  question_order: number;
  answered_at: string;
  // Joined
  question?: Question;
}

export interface TopicMastery {
  id: string;
  student_id: string;
  topic_id: string;
  subject_id: string | null;
  total_attempts: number;
  correct_attempts: number;
  accuracy: number;
  mastery_level: MasteryLevel;
  avg_response_time_ms: number | null;
  last_practiced: string | null;
  updated_at: string;
  // Joined
  topic?: Topic;
  subject?: Subject;
}

export interface StudentMistake {
  id: string;
  student_id: string;
  question_id: string;
  wrong_answer: string | null;
  attempt_count: number;
  last_attempted: string;
  resolved: boolean;
  // Joined
  question?: Question;
}

export interface DailyChallenge {
  id: string;
  challenge_date: string;
  questions: string[];
  created_at: string;
}

export interface MockCompetition {
  id: string;
  name: string;
  created_by: string | null;
  rounds: MockRound[];
  status: string;
  scheduled_at: string | null;
  created_at: string;
}

export interface MockRound {
  name: string;
  type: string;
  question_count: number;
  time_limit: number;
  is_buzzer: boolean;
}

export interface MockResult {
  id: string;
  competition_id: string;
  student_id: string;
  round_scores: Record<string, number>;
  total_score: number;
  accuracy: number;
  rank: number | null;
  completed_at: string | null;
}

// UI Types
export interface DashboardStats {
  totalQuestions: number;
  verifiedQuestions: number;
  totalStudents: number;
  testsCompleted: number;
  averageAccuracy: number;
}

export interface StudentProgress {
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  avgResponseTime: number;
}

export interface SubjectCardData {
  subject: Subject;
  topicNames: string[];
  questionCount: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  student_id: string;
  student_name: string;
  school: string;
  grade: number;
  points: number;
  quizzes_taken: number;
  accuracy: number;
}
