
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
  subject: string;
  language?: 'english' | 'somali' | 'arabic';
  durationMinutes: number;
  questions: Question[];
  direction?: 'ltr' | 'rtl'; // Support for Arabic/Islamic Studies
  sectionPassages?: Record<string, string>; // Reading passages keyed by SectionType
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

export enum AppState {
  HOME = 'HOME',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  YEAR_SELECT = 'YEAR_SELECT',
  SUBJECT_SELECT = 'SUBJECT_SELECT',
  LANGUAGE_SELECT = 'LANGUAGE_SELECT',
  EXAM_OVERVIEW = 'EXAM_OVERVIEW',
  EXAM_ACTIVE = 'EXAM_ACTIVE',
  RESULTS = 'RESULTS'
}
