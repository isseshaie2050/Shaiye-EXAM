
import { ExamResult, Student, SubscriptionPlan, ExamAuthority, ActiveSession } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'naajix_students',
  CURRENT_SESSION: 'naajix_client_session_token', // Stores { userId, sessionId }
  ACTIVE_SESSIONS_DB: 'naajix_server_active_sessions', // Simulates Server DB of active sessions
  EXAM_HISTORY: 'naajix_exam_history_v2', 
  DYNAMIC_EXAMS: 'naajix_dynamic_exams',
  OTP_CACHE: 'naajix_otp_cache' // Temp storage for OTPs
};

// --- SESSION MANAGEMENT (SINGLE DEVICE ENFORCEMENT) ---

const getActiveSessionsDB = (): Record<string, ActiveSession> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSIONS_DB);
    return stored ? JSON.parse(stored) : {};
  } catch (e) { return {}; }
};

const saveActiveSessionsDB = (db: Record<string, ActiveSession>) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS_DB, JSON.stringify(db));
};

export const checkDeviceConflict = (userId: string): ActiveSession | null => {
  const db = getActiveSessionsDB();
  // Check if there is an active session for this user
  if (db[userId]) {
    return db[userId];
  }
  return null;
};

export const createNewSession = (student: Student): void => {
  const db = getActiveSessionsDB();
  const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // 1. Create Server-Side Session Record
  const newSession: ActiveSession = {
    userId: student.id,
    deviceSessionId: newSessionId,
    deviceName: getDeviceName(),
    ipAddress: '192.168.x.x', // Simulated
    lastActiveAt: new Date().toISOString()
  };
  
  db[student.id] = newSession;
  saveActiveSessionsDB(db);

  // 2. Set Client-Side Cookie/Token
  const clientToken = {
    userId: student.id,
    sessionId: newSessionId,
    studentData: student // Cache student data for easy access
  };
  localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(clientToken));
};

export const validateCurrentSession = (): Student | null => {
  try {
    // 1. Get Client Token
    const clientTokenStr = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (!clientTokenStr) return null;
    
    const clientToken = JSON.parse(clientTokenStr);
    const { userId, sessionId, studentData } = clientToken;

    // 2. Check "Server" DB
    const db = getActiveSessionsDB();
    const serverSession = db[userId];

    if (!serverSession) {
      // Session expired on server
      logoutStudent();
      return null;
    }

    if (serverSession.deviceSessionId !== sessionId) {
      // CONFLICT: Server has a different session ID -> Another device logged in
      logoutStudent();
      return null; 
    }

    // 3. Update Last Active
    serverSession.lastActiveAt = new Date().toISOString();
    saveActiveSessionsDB(db);

    // 4. Return cached student data (refreshed from DB for plan accuracy)
    const freshStudent = getAllStudentsRaw().find(s => s.id === userId);
    if (freshStudent) {
        // Update client cache if plan changed
        if (JSON.stringify(freshStudent) !== JSON.stringify(studentData)) {
            clientToken.studentData = freshStudent;
            localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(clientToken));
        }
        return checkSubscriptionStatus(freshStudent);
    }

    return null;
  } catch (e) {
    return null;
  }
};

const getDeviceName = () => {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'Mobile Device';
  if (/iPad|Android/i.test(ua)) return 'Tablet';
  return 'Desktop Computer';
};

// --- AUTHENTICATION & OTP ---

export const findStudentByEmail = (email: string): Student | undefined => {
  const students = getAllStudentsRaw();
  return students.find(s => s.email?.toLowerCase() === email.toLowerCase());
};

export const generateOTP = (email: string): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const cache = { code: otp, email, expires: Date.now() + 5 * 60 * 1000 }; // 5 mins
  localStorage.setItem(STORAGE_KEYS.OTP_CACHE, JSON.stringify(cache));
  
  // SIMULATE EMAIL SENDING
  console.log(`[Naajix Mailer] Sending OTP to ${email}: ${otp}`);
  setTimeout(() => {
    alert(`📧 Koodh xaqiijin (Verification Code) ayaa laguu soo diray email-kaaga:\n\n${otp}`);
  }, 500);

  return otp;
};

export const verifyOTP = (inputCode: string): boolean => {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.OTP_CACHE);
    if (!cached) return false;
    const { code, expires } = JSON.parse(cached);
    
    if (Date.now() > expires) return false;
    return code === inputCode;
  } catch (e) { return false; }
};

// --- SUBSCRIPTION HELPERS ---

const checkSubscriptionStatus = (student: Student): Student => {
  if (student.subscriptionPlan === 'FREE') return student;

  const now = new Date();
  const endDate = student.subscriptionEndDate ? new Date(student.subscriptionEndDate) : null;

  if (endDate && now > endDate) {
    const updated: Student = {
      ...student,
      subscriptionPlan: 'FREE',
      subscriptionStatus: 'expired',
      basicAuthority: undefined,
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
  }
};

// --- STUDENT CRUD ---

const getAllStudentsRaw = (): Student[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return stored ? JSON.parse(stored) : [];
  } catch (e) { return []; }
};

export const registerStudent = (student: Student): void => {
  const students = getAllStudentsRaw();
  // Double check email uniqueness
  if (students.some(s => s.email === student.email)) {
      throw new Error("Email already registered");
  }

  // Default to FREE plan
  const newStudent: Student = {
      ...student,
      subscriptionPlan: 'FREE',
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date().toISOString()
  };
  
  students.push(newStudent);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

export const logoutStudent = (): void => {
  const clientTokenStr = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
  if (clientTokenStr) {
      const { userId } = JSON.parse(clientTokenStr);
      // Remove from server active sessions
      const db = getActiveSessionsDB();
      delete db[userId];
      saveActiveSessionsDB(db);
  }
  localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
};

export const getCurrentStudent = (): Student | null => {
  // Now proxies to validateCurrentSession for security
  return validateCurrentSession();
};

export const getAllStudents = (): Student[] => {
  const students = getAllStudentsRaw();
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
    history.unshift(result);
    localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(history));
  } catch (error) { console.error(error); }
};

export const getAllExamResults = (): ExamResult[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EXAM_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) { return []; }
};

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

export const exportDataToCSV = (type: 'students' | 'results') => {
  let data: any[] = [];
  let headers: string[] = [];
  let filename = '';

  if (type === 'students') {
    data = getAllStudents();
    headers = ['ID', 'Full Name', 'Email', 'Phone', 'School', 'Level', 'Plan', 'Status'];
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
         return `${row.id},"${row.fullName}","${row.email}","${row.phone}","${row.school}",${row.level},${row.subscriptionPlan},${row.subscriptionStatus}`;
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
