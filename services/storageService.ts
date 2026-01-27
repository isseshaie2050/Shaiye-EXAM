
import { ExamResult, Student, SubscriptionPlan, ExamAuthority } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'naajix_students',
  CURRENT_STUDENT: 'naajix_current_student_session',
  EXAM_HISTORY: 'naajix_exam_history_v2', // v2 to avoid conflicts with old format
  DYNAMIC_EXAMS: 'naajix_dynamic_exams'
};

// --- SUBSCRIPTION HELPERS ---

const checkSubscriptionStatus = (student: Student): Student => {
  if (student.subscriptionPlan === 'FREE') return student;

  const now = new Date();
  const endDate = student.subscriptionEndDate ? new Date(student.subscriptionEndDate) : null;

  if (endDate && now > endDate) {
    // Expired: Downgrade to Free
    const updated: Student = {
      ...student,
      subscriptionPlan: 'FREE',
      subscriptionStatus: 'expired',
      basicAuthority: undefined, // Clear preference
    };
    updateStudentRecord(updated);
    return updated;
  }
  return student;
};

const updateStudentRecord = (updatedStudent: Student) => {
  const students = getAllStudentsRaw();
  const index = students.findIndex(s => s.id === updatedStudent.id);
  if (index !== -1) {
    students[index] = updatedStudent;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    
    // If this is the current session, update it too
    const current = getCurrentStudentRaw();
    if (current && current.id === updatedStudent.id) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(updatedStudent));
    }
  }
};

// --- STUDENT MANAGEMENT ---

const getAllStudentsRaw = (): Student[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const getCurrentStudentRaw = (): Student | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

export const registerStudent = (student: Student): void => {
  const students = getAllStudentsRaw();
  // Check if phone exists
  const existingIndex = students.findIndex(s => s.phone === student.phone);
  
  // Default to FREE plan
  const newStudent: Student = {
      ...student,
      subscriptionPlan: 'FREE',
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date().toISOString()
  };
  
  if (existingIndex >= 0) {
    // Update existing
    students[existingIndex] = { ...students[existingIndex], ...student }; // Keep existing plan if re-registering? Usually better to fail, but for now update info
  } else {
    // Add new
    students.push(newStudent);
  }
  
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(newStudent));
};

export const loginStudent = (phone: string): Student | null => {
  const students = getAllStudentsRaw();
  const student = students.find(s => s.phone === phone);
  if (student) {
    // Check expiry on login
    const checkedStudent = checkSubscriptionStatus(student);
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(checkedStudent));
    return checkedStudent;
  }
  return null;
};

export const logoutStudent = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
};

export const getCurrentStudent = (): Student | null => {
  const student = getCurrentStudentRaw();
  if (student) {
      // Check expiry whenever we retrieve the current student state
      return checkSubscriptionStatus(student);
  }
  return null;
};

export const getAllStudents = (): Student[] => {
  const students = getAllStudentsRaw();
  // Return updated statuses
  return students.map(s => checkSubscriptionStatus(s));
};

export const upgradeStudentSubscription = (studentId: string, plan: SubscriptionPlan, authority?: ExamAuthority) => {
    const students = getAllStudentsRaw();
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30); // 30 Days

        const updated: Student = {
            ...student,
            subscriptionPlan: plan,
            subscriptionStatus: 'active',
            subscriptionStartDate: startDate.toISOString(),
            subscriptionEndDate: endDate.toISOString(),
            basicAuthority: plan === 'BASIC' ? authority : undefined
        };
        updateStudentRecord(updated);
        return updated;
    }
    return null;
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
    headers = ['ID', 'Full Name', 'Phone', 'School', 'Level', 'Plan', 'Status', 'Expires'];
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
         const expiry = row.subscriptionEndDate ? new Date(row.subscriptionEndDate).toLocaleDateString() : 'N/A';
         return `${row.id},"${row.fullName}",${row.phone},"${row.school}",${row.level},${row.subscriptionPlan},${row.subscriptionStatus},${expiry}`;
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
