
import { ExamResult, Student } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'naajix_students',
  CURRENT_STUDENT: 'naajix_current_student_session',
  EXAM_HISTORY: 'naajix_exam_history_v2', // v2 to avoid conflicts with old format
  DYNAMIC_EXAMS: 'naajix_dynamic_exams'
};

// --- STUDENT MANAGEMENT ---

export const registerStudent = (student: Student): void => {
  const students = getAllStudents();
  // Check if phone exists
  const existingIndex = students.findIndex(s => s.phone === student.phone);
  
  if (existingIndex >= 0) {
    // Update existing
    students[existingIndex] = { ...students[existingIndex], ...student };
  } else {
    // Add new
    students.push(student);
  }
  
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(student));
};

export const loginStudent = (phone: string): Student | null => {
  const students = getAllStudents();
  const student = students.find(s => s.phone === phone);
  if (student) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(student));
    return student;
  }
  return null;
};

export const logoutStudent = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
};

export const getCurrentStudent = (): Student | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

export const getAllStudents = (): Student[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

// --- EXAM RESULTS MANAGEMENT ---

export const saveExamResult = (result: ExamResult): void => {
  try {
    const history = getAllExamResults();
    history.unshift(result); // Add new result to the top
    localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save exam history", error);
  }
};

export const getAllExamResults = (): ExamResult[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EXAM_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load exam history", error);
    return [];
  }
};

// Get history only for the specific student
export const getStudentExamHistory = (studentId: string): ExamResult[] => {
  const allResults = getAllExamResults();
  return allResults.filter(r => r.studentId === studentId);
};

export const getSubjectStats = (studentId: string) => {
  const history = getStudentExamHistory(studentId);
  const subjects: Record<string, { totalScore: number, totalMax: number, count: number }> = {};

  history.forEach(h => {
    if (!subjects[h.subject]) {
      subjects[h.subject] = { totalScore: 0, totalMax: 0, count: 0 };
    }
    subjects[h.subject].totalScore += h.score;
    subjects[h.subject].totalMax += h.maxScore;
    subjects[h.subject].count += 1;
  });

  return Object.keys(subjects).map(sub => {
    const data = subjects[sub];
    return {
      subject: sub,
      average: Math.round((data.totalScore / data.totalMax) * 100),
      attempts: data.count
    };
  });
};

// --- EXPORT UTILS FOR ADMIN ---

export const exportDataToCSV = (type: 'students' | 'results') => {
  let data: any[] = [];
  let headers: string[] = [];
  let filename = '';

  if (type === 'students') {
    data = getAllStudents();
    headers = ['ID', 'Full Name', 'Phone', 'School', 'Level', 'Registered Date'];
    filename = 'naajix_students.csv';
  } else {
    data = getAllExamResults();
    headers = ['Result ID', 'Student Name', 'Subject', 'Year', 'Score', 'Max Score', 'Grade', 'Date'];
    filename = 'naajix_results.csv';
  }

  if (data.length === 0) return;

  const csvContent = [
    headers.join(','),
    ...data.map(row => {
      if (type === 'students') {
         return `${row.id},"${row.fullName}",${row.phone},"${row.school}",${row.level},${row.registeredAt}`;
      } else {
         return `${row.id},"${row.studentName}",${row.subject},${row.year},${row.score},${row.maxScore},${row.grade},${row.date}`;
      }
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
