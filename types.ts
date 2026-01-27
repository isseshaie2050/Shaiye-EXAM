
export enum SectionType {
  MCQ = 'Section A: Multiple Choice',
  SHORT_ANSWER = 'Section B: Short Answers',
  CALCULATION = 'Section C: Calculations',
  ESSAY = 'Section D: Essay/Composition',
  // English Exam Specific Sections
  READING = 'Part 1: Reading Comprehension',
  GRAMMAR = 'Part 2: Grammar',
  LITERATURE = 'Part 3: Literature',
  VOCABULARY = 'Part 4: Vocabulary',
  STRUCTURED = 'Section Two: Structured Questions',
  WRITING = 'Writing Skills'
}

export interface Question {
  id: string;
  section: SectionType;
  text: string;
  type: 'mcq' | 'text';
  options?: string[];
  correctAnswer: string;
  marks: number;
  explanation: string;
  diagramUrl?: string | string[];
  topic: string;
}

export interface Exam {
  id: string;
  year: number;
  subject: string; // This is the Display Label
  subjectKey: string; // This is the Database Key (e.g., 'islamic_studies')
  language?: 'english' | 'somali' | 'arabic';
  durationMinutes: number;
  questions: Question[];
  direction?: 'ltr' | 'rtl'; // Support for Arabic/Islamic Studies
  sectionPassages?: Record<string, string>; // Reading passages keyed by SectionType
  sectionImages?: Record<string, string>; // Images associated with a section (e.g. Reading Comprehension image)
  // Added for Admin created exams
  authority?: ExamAuthority;
  level?: EducationLevel;
  isCustom?: boolean; 
}

export interface UserAnswer {
  questionId: string;
  answer: string;
}

export interface ExamResult {
  examId: string;
  subject: string;
  year: number;
  score: number;
  maxScore: number;
  grade: string;
  date: string;
}

export interface SubjectConfig {
  key: string;      // Stable DB key: 'islamic_studies'
  label: string;    // Display: 'Islamic Studies'
  language: 'english' | 'somali' | 'arabic';
}

export type ExamAuthority = 'SOMALI_GOV' | 'PUNTLAND';
export type EducationLevel = 'FORM_IV' | 'STD_8';

export enum AppState {
  HOME = 'HOME', // Landing Page (Authority Selection)
  LEVEL_SELECT = 'LEVEL_SELECT', // Std 8 vs Form IV
  SUBJECT_SELECT = 'SUBJECT_SELECT', // Select Subject
  YEAR_SELECT = 'YEAR_SELECT', // Select Year
  DASHBOARD = 'DASHBOARD', // Student Dashboard
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_PANEL = 'ADMIN_PANEL',
  HISTORY = 'HISTORY',
  EXAM_OVERVIEW = 'EXAM_OVERVIEW',
  EXAM_ACTIVE = 'EXAM_ACTIVE',
  RESULTS = 'RESULTS',
  ABOUT = 'ABOUT',
  PRIVACY = 'PRIVACY',
  CONTACT = 'CONTACT'
}
