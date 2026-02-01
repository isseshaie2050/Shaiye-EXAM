
import { Exam, ExamAuthority, EducationLevel } from '../types';
import { EXAM_DATABASE as STATIC_DATABASE } from '../constants';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; // Import initialized db

// Local cache to keep 'getExam' synchronous for UI rendering performance
let DYNAMIC_CACHE: Record<string, Exam> = {};

// Timeout wrapper to prevent long hangs on slow/offline connections
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error("Timeout"));
        }, ms);

        promise
            .then(value => {
                clearTimeout(timer);
                resolve(value);
            })
            .catch(reason => {
                clearTimeout(timer);
                reject(reason);
            });
    });
};

export const fetchDynamicExams = async () => {
    try {
        // Attempt to fetch with a 3-second timeout. 
        // If Firebase is unreachable (e.g., 10s wait), we fail fast to let the app load.
        const querySnapshot: any = await withTimeout(
            getDocs(collection(db, "exams")),
            3000
        );

        DYNAMIC_CACHE = {}; // Clear cache before refilling
        querySnapshot.forEach((doc: any) => {
            const exam = doc.data() as Exam;
            // Ensure compatibility with local structure
            const key = `${exam.year}_${exam.subjectKey}`;
            DYNAMIC_CACHE[key] = { ...exam, isCustom: true };
        });
        console.log("Loaded exams from Firebase:", Object.keys(DYNAMIC_CACHE));
    } catch (e: any) {
        // Graceful error handling for offline/guest/timeout scenarios
        if (e.message === "Timeout") {
             console.warn("Firebase connection timed out. Operating in offline mode with static exams.");
        } else if (e.code === 'permission-denied') {
             console.log("Guest user: Using static exams only (Cloud exams require login).");
        } else if (e.code === 'unavailable' || e.message?.includes('offline')) {
             console.warn("Firebase unavailable (offline). Using static exams.");
        } else {
             console.error("Error fetching exams from Firebase:", e);
        }
    }
};

export const saveDynamicExam = async (exam: Exam) => {
  const key = `${exam.year}_${exam.subjectKey}`;
  const docId = key; // Use Year_SubjectKey as the document ID for uniqueness
  
  // Mark as custom so it takes precedence or is treated as dynamic
  exam.isCustom = true;
  
  // 1. Update Local Cache (Optimistic UI update)
  DYNAMIC_CACHE[key] = exam;
  
  // 2. Persist to Firestore
  try {
      const examRef = doc(db, "exams", docId);
      await setDoc(examRef, exam);
      console.log("Exam saved to Firebase successfully:", docId);
  } catch (e) {
      console.error("Error saving exam to Firebase:", e);
      alert("Failed to save exam to cloud. Check console for permission errors.");
      throw e;
  }
};

export const getAllExams = (): Exam[] => {
    const staticExams = Object.values(STATIC_DATABASE);
    const dynamicExams = Object.values(DYNAMIC_CACHE);
    
    // Create a map to merge static and dynamic, preferring dynamic (Firebase) if keys match
    const merged: Record<string, Exam> = {};
    
    staticExams.forEach(e => {
        merged[`${e.year}_${e.subjectKey}`] = e;
    });
    
    dynamicExams.forEach(e => {
        merged[`${e.year}_${e.subjectKey}`] = e;
    });

    return Object.values(merged);
};

export const getExam = (year: number | null, subjectKey: string | null): Exam | undefined => {
  if (!year || !subjectKey) return undefined;
  
  const key = `${year}_${subjectKey}`;
  
  // Check Dynamic Cache First (includes Firebase data)
  if (DYNAMIC_CACHE[key]) {
      return DYNAMIC_CACHE[key];
  }

  // Fallback to Static Constants
  return STATIC_DATABASE[key];
};

export const getAvailableYears = (subjectKey: string, authority: ExamAuthority, level: EducationLevel): number[] => {
    const all = getAllExams();
    const years = new Set<number>();
    
    all.forEach(exam => {
        if (exam.subjectKey === subjectKey) {
            // For custom exams (from Firebase), check metadata if available
            // If metadata is missing, assume it's available for all to prevent hiding
            if (exam.isCustom) {
                if (exam.authority && exam.level) {
                    // If strict authority/level is set on the exam object
                    if (exam.authority === authority && exam.level === level) {
                        years.add(exam.year);
                    }
                } else {
                    // If no strict metadata, show for all (Legacy/Flexible behavior)
                    years.add(exam.year);
                }
            } else {
                // Static exams are generally available for all authorities mapped in EXAM_HIERARCHY
                years.add(exam.year);
            }
        }
    });

    return Array.from(years).sort((a, b) => b - a);
};
