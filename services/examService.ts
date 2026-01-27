
import { Exam, ExamAuthority, EducationLevel } from '../types';
import { EXAM_DATABASE as STATIC_DATABASE, SUBJECT_CONFIG } from '../constants';

const DYNAMIC_EXAMS_KEY = 'naajix_dynamic_exams';

// Helper to get dynamic exams from storage
const getDynamicExams = (): Record<string, Exam> => {
  try {
    const stored = localStorage.getItem(DYNAMIC_EXAMS_KEY);
    return stored ? (JSON.parse(stored) as Record<string, Exam>) : {};
  } catch (e) {
    console.error("Failed to load dynamic exams", e);
    return {};
  }
};

export const saveDynamicExam = (exam: Exam) => {
  const current = getDynamicExams();
  // Key format: YEAR_SUBJECTKEY_AUTHORITY_LEVEL (Extended key for uniqueness in dynamic context)
  // However, the app uses getExam(year, subjectKey). 
  // To support the hierarchical nav properly, we stick to the key convention or filter.
  
  // For simplicity in this app structure, we will overwrite based on Year+SubjectKey
  // But strictly, we should check Authority/Level. 
  
  const key = `${exam.year}_${exam.subjectKey}`;
  
  // Tag it
  exam.isCustom = true;

  current[key] = exam;
  localStorage.setItem(DYNAMIC_EXAMS_KEY, JSON.stringify(current));
};

export const getAllExams = (): Exam[] => {
    const staticExams = Object.values(STATIC_DATABASE);
    const dynamicExams = Object.values(getDynamicExams());
    return [...dynamicExams, ...staticExams]; // Dynamic takes precedence in retrieval if we merged keys, but here we list all
};

export const getExam = (year: number | null, subjectKey: string | null): Exam | undefined => {
  if (!year || !subjectKey) return undefined;
  
  const key = `${year}_${subjectKey}`;
  const dynamicExams = getDynamicExams();
  
  // Check Dynamic First (Admin created)
  if (dynamicExams[key]) {
      return dynamicExams[key];
  }

  // Fallback to Static
  return STATIC_DATABASE[key];
};

export const checkExamExists = (year: number, subjectKey: string): boolean => {
  const key = `${year}_${subjectKey}`;
  const dynamic = getDynamicExams();
  return !!dynamic[key] || !!STATIC_DATABASE[key];
};

export const getAvailableYears = (subjectKey: string, authority: ExamAuthority, level: EducationLevel): number[] => {
    const all = getAllExams();
    // Filter exams that match subject. 
    // Note: Static exams in constants.tsx don't have authority/level properties explicitly set on the object 
    // (they are mapped via EXAM_HIERARCHY). 
    // We assume static exams apply if they are in the hierarchy.
    
    // For admin created exams, we check the specific properties.
    
    const years = new Set<number>();
    
    all.forEach(exam => {
        if (exam.subjectKey === subjectKey) {
            if (exam.isCustom) {
                // Strict check for custom exams
                if (exam.authority === authority && exam.level === level) {
                    years.add(exam.year);
                }
            } else {
                // For static exams, we assume they are available if the subject is allowed in that hierarchy
                // (The UI handles the hierarchy filtering before calling this usually)
                years.add(exam.year);
            }
        }
    });

    return Array.from(years).sort((a, b) => b - a);
};
