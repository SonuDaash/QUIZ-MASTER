export const APP_NAME = 'Smart Mind';
export const APP_SUBTITLE = 'National Inter-School Quiz Training';
export const APP_TAGLINE = 'Learn • Practice • Improve • Compete';
export const SCHOOL_NAME = 'Royal Academy';
export const ADMIN_EMAIL = 'kinglasted23@gmail.com';

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
};

export const MASTERY_LABELS: Record<string, string> = {
  weak: 'Weak',
  developing: 'Developing',
  strong: 'Strong',
  mastered: 'Mastered',
};

export const QUESTION_TYPE_LABELS: Record<string, string> = {
  mcq: 'Multiple Choice',
  direct_answer: 'Direct Answer',
  true_false: 'True / False',
  fill_blank: 'Fill in the Blank',
  rapid_fire: 'Rapid Fire',
  buzzer: 'Buzzer',
  audio_visual: 'Audio Visual',
  image_id: 'Image Identification',
  audio_id: 'Audio Identification',
  sequence: 'Sequence',
  match: 'Match',
  numerical: 'Numerical',
  reasoning: 'Reasoning',
};

export const VERIFICATION_LABELS: Record<string, string> = {
  verified: 'Verified',
  needs_review: 'Needs Review',
  rejected: 'Rejected',
};

export const CATEGORY_ICONS: Record<string, string> = {
  'Academic': 'GraduationCap',
  'General Knowledge': 'Globe',
  'Current Affairs': 'Newspaper',
  'Intelligence & Reasoning': 'Brain',
  'Audio-Visual': 'Eye',
  'Special Topics': 'Star',
};

export const DEFAULT_QUIZ_COUNT = 20;
export const RAPID_FIRE_TIME = 60; // seconds
export const DEFAULT_QUESTION_TIME = 30; // seconds
export const DAILY_CHALLENGE_COUNT = 10;
