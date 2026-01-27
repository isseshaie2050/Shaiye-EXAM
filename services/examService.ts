
import { Exam, ExamAuthority, EducationLevel } from '../types';
import { EXAM_DATABASE as STATIC_DATABASE } from '../constants';
import { supabase } from './supabaseClient';

// Local cache to keep 'getExam' synchronous for UI rendering performance
let DYNAMIC_CACHE: Record<string, Exam> = {};

export const fetchDynamicExams = async () => {
    const { data, error } = await supabase.from('custom_exams').select('*');
    if (!error && data) {
        const cache: Record<string, Exam> = {};
        data.forEach((row: any) => {
            const exam = row.exam_data as Exam;
            // Ensure ID match
            const key = `${exam.year}_${exam.subjectKey}`;
            cache[key] = exam;
        });
        DYNAMIC_CACHE = cache;
    }
};

export const saveDynamicExam = async (exam: Exam) => {
  const key = `${exam.year}_${exam.subjectKey}`;
  exam.isCustom = true;
  
  // Update Cache
  DYNAMIC_CACHE[key] = exam;

  // Save to DB
  const { error } = await supabase.from('custom_exams').upsert({
      id: exam.id, // Use exam ID as primary key
      year: exam.year,
      subject_key: exam.subjectKey,
      exam_data: exam
  });

  if (error) console.error("Failed to save exam to DB", error);
};

export const getAllExams = (): Exam[] => {
    const staticExams = Object.values(STATIC_DATABASE);
    const dynamicExams = Object.values(DYNAMIC_CACHE);
    return [...dynamicExams, ...staticExams]; 
};

export const getExam = (year: number | null, subjectKey: string | null): Exam | undefined => {
  if (!year || !subjectKey) return undefined;
  
  const key = `${year}_${subjectKey}`;
  
  // Check Dynamic First (Admin created)
  if (DYNAMIC_CACHE[key]) {
      return DYNAMIC_CACHE[key];
  }

  // Fallback to Static
  return STATIC_DATABASE[key];
};

export const getAvailableYears = (subjectKey: string, authority: ExamAuthority, level: EducationLevel): number[] => {
    const all = getAllExams();
    const years = new Set<number>();
    
    all.forEach(exam => {
        if (exam.subjectKey === subjectKey) {
            if (exam.isCustom) {
                if (exam.authority === authority && exam.level === level) {
                    years.add(exam.year);
                }
            } else {
                years.add(exam.year);
            }
        }
    });

    return Array.from(years).sort((a, b) => b - a);
};
