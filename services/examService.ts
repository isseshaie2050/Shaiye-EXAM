
import { Exam, ExamAuthority, EducationLevel } from '../types';
import { EXAM_DATABASE as STATIC_DATABASE } from '../constants';

// Local cache to keep 'getExam' synchronous for UI rendering performance
let DYNAMIC_CACHE: Record<string, Exam> = {};

export const fetchDynamicExams = async () => {
    // Database disabled - No dynamic exams fetched
    DYNAMIC_CACHE = {};
};

export const saveDynamicExam = async (exam: Exam) => {
  const key = `${exam.year}_${exam.subjectKey}`;
  exam.isCustom = true;
  
  // Update Local Cache only (No persistence)
  DYNAMIC_CACHE[key] = exam;
};

export const getAllExams = (): Exam[] => {
    const staticExams = Object.values(STATIC_DATABASE);
    const dynamicExams = Object.values(DYNAMIC_CACHE);
    return [...dynamicExams, ...staticExams]; 
};

export const getExam = (year: number | null, subjectKey: string | null): Exam | undefined => {
  if (!year || !subjectKey) return undefined;
  
  const key = `${year}_${subjectKey}`;
  
  // Check Dynamic First (Admin created in-memory)
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
