
import { ExamResult, Student, SubscriptionPlan, ExamAuthority, ActiveSession, LoginSession, UserRole } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'naajix_students',
  CURRENT_SESSION: 'naajix_client_session_token', // Stores { userId, sessionId }
  ACTIVE_SESSIONS_DB: 'naajix_server_active_sessions', // Simulates Server DB of active sessions
  LOGIN_HISTORY_DB: 'naajix_login_history', // Permanent Audit Log
  EXAM_HISTORY: 'naajix_exam_history_v2', 
  DYNAMIC_EXAMS: 'naajix_dynamic_exams',
  OTP_CACHE: 'naajix_otp_cache' // Temp storage for OTPs
};

// --- SESSION MANAGEMENT (SINGLE DEVICE ENFORCEMENT & HISTORY) ---

const getActiveSessionsDB = (): Record<string, ActiveSession> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSIONS_DB);
    return stored ? JSON.parse(stored) : {};
  } catch (e) { return {}; }
};

const saveActiveSessionsDB = (db: Record<string, ActiveSession>) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS_DB, JSON.stringify(db));
};

const getLoginHistoryDB = (): LoginSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOGIN_HISTORY_DB);
    return stored ? JSON.parse(stored) : [];
  } catch (e) { return []; }
};

const saveLoginHistoryDB = (history: LoginSession[]) => {
  localStorage.setItem(STORAGE_KEYS.LOGIN_HISTORY_DB, JSON.stringify(history));
};

// Helper: Mock IP and Device info
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let device = 'Desktop';
  if (/mobile/i.test(ua)) device = 'Mobile';
  else if (/tablet/i.test(ua)) device = 'Tablet';
  
  let os = 'Unknown OS';
  if (ua.indexOf("Win") !== -1) os = "Windows";
  if (ua.indexOf("Mac") !== -1) os = "MacOS";
  if (ua.indexOf("Linux") !== -1) os = "Linux";
  if (ua.indexOf("Android") !== -1) os = "Android";
  if (ua.indexOf("like Mac") !== -1) os = "iOS";

  return `${device} (${os}) - ${navigator.platform}`;
};

const getIPAddress = () => {
    // In a real app, this comes from the server request
    return '197.xxx.xxx.xxx (Mogadishu, SO)';
};

// Core Login Function
export const logUserIn = (user: Student | { id: string, fullName: string }, role: UserRole, method: 'email' | 'google' | 'password'): void => {
  const db = getActiveSessionsDB();
  const history = getLoginHistoryDB();
  
  const existingSession = db[user.id];

  // 1. Single Device Rule: Invalidate old session
  if (existingSession) {
    // Update old history record
    const oldHistoryIndex = history.findIndex(h => h.id === existingSession.loginSessionId);
    if (oldHistoryIndex !== -1) {
        history[oldHistoryIndex].isActive = false;
        history[oldHistoryIndex].logoutTime = new Date().toISOString();
        history[oldHistoryIndex].terminationReason = 'device_conflict';
    }
  }

  // 2. Create New Session IDs
  const deviceSessionId = `dev_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const loginSessionId = `hist_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  // 3. Create History Record
  const newHistory: LoginSession = {
      id: loginSessionId,
      userId: user.id,
      userName: user.fullName,
      role,
      deviceSessionId,
      loginMethod: method,
      ipAddress: getIPAddress(),
      deviceInfo: getDeviceInfo(),
      loginTime: new Date().toISOString(),
      isActive: true,
      terminationReason: 'active'
  };
  
  history.unshift(newHistory); // Add to top
  saveLoginHistoryDB(history);

  // 4. Create Active Session Record
  // Expiry: Admin 12h, Student 30d
  const expiryDate = new Date();
  if (role === 'admin') expiryDate.setHours(expiryDate.getHours() + 12);
  else expiryDate.setDate(expiryDate.getDate() + 30);

  const newActiveSession: ActiveSession = {
      userId: user.id,
      role,
      deviceSessionId,
      loginSessionId,
      deviceName: getDeviceInfo(),
      ipAddress: getIPAddress(),
      lastActiveAt: new Date().toISOString(),
      expiresAt: expiryDate.toISOString()
  };

  db[user.id] = newActiveSession;
  saveActiveSessionsDB(db);

  // 5. Set Client Cookie
  const clientToken = {
    userId: user.id,
    role,
    sessionId: deviceSessionId,
    studentData: role === 'student' ? user : undefined
  };
  localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(clientToken));
};

export const checkDeviceConflict = (userId: string): ActiveSession | null => {
  const db = getActiveSessionsDB();
  return db[userId] || null;
};

// Validate Session (Runs on App Load & Watchdog)
export const validateCurrentSession = (): { user: Student | null, role: UserRole | null } => {
  try {
    const clientTokenStr = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (!clientTokenStr) return { user: null, role: null };
    
    const clientToken = JSON.parse(clientTokenStr);
    const { userId, sessionId, role, studentData } = clientToken;

    const db = getActiveSessionsDB();
    const serverSession = db[userId];

    // Check 1: Session exists on server
    if (!serverSession) {
      logoutLocalOnly();
      return { user: null, role: null };
    }

    // Check 2: Device Conflict (Session ID match)
    if (serverSession.deviceSessionId !== sessionId) {
      logoutLocalOnly(); // Log out this device, it's been kicked
      return { user: null, role: null };
    }

    // Check 3: Expiry Time (Absolute)
    if (new Date() > new Date(serverSession.expiresAt)) {
        terminateSession(userId, 'timeout');
        return { user: null, role: null };
    }

    // Check 4: Idle Timeout (30 mins)
    const lastActive = new Date(serverSession.lastActiveAt);
    const now = new Date();
    const diffMins = (now.getTime() - lastActive.getTime()) / 60000;
    if (diffMins > 30) {
        terminateSession(userId, 'timeout');
        return { user: null, role: null };
    }

    // Update Last Active
    serverSession.lastActiveAt = new Date().toISOString();
    saveActiveSessionsDB(db);

    // Return Data
    let user = null;
    if (role === 'student') {
        const freshStudent = getAllStudentsRaw().find(s => s.id === userId);
        user = freshStudent ? checkSubscriptionStatus(freshStudent) : studentData;
        // Update local cache if changed
        if (freshStudent && JSON.stringify(freshStudent) !== JSON.stringify(clientToken.studentData)) {
            clientToken.studentData = freshStudent;
            localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(clientToken));
        }
    } else {
        // Admin
        user = { id: 'admin', fullName: 'System Administrator' } as Student;
    }

    return { user, role };

  } catch (e) {
    return { user: null, role: null };
  }
};

// Terminate Session (Server Side)
const terminateSession = (userId: string, reason: 'user_logout' | 'device_conflict' | 'timeout' | 'admin_force') => {
    const db = getActiveSessionsDB();
    const session = db[userId];
    
    if (session) {
        // Update History
        const history = getLoginHistoryDB();
        const histIndex = history.findIndex(h => h.id === session.loginSessionId);
        if (histIndex !== -1) {
            history[histIndex].isActive = false;
            history[histIndex].logoutTime = new Date().toISOString();
            history[histIndex].terminationReason = reason;
            saveLoginHistoryDB(history);
        }

        // Remove Active Session
        delete db[userId];
        saveActiveSessionsDB(db);
    }
    
    // If it's the current user, clear local
    const clientTokenStr = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (clientTokenStr) {
        const { userId: currentId } = JSON.parse(clientTokenStr);
        if (currentId === userId) logoutLocalOnly();
    }
};

const logoutLocalOnly = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
};

export const logoutUser = () => {
    const clientTokenStr = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (clientTokenStr) {
        const { userId } = JSON.parse(clientTokenStr);
        terminateSession(userId, 'user_logout');
    }
};

export const forceLogoutUser = (userId: string) => {
    terminateSession(userId, 'admin_force');
};

export const getLoginHistory = (): LoginSession[] => {
    return getLoginHistoryDB();
};

export const getActiveSessions = (): ActiveSession[] => {
    return Object.values(getActiveSessionsDB());
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

export const verifyAdminCredentials = (u: string, p: string): boolean => {
    return u === 'naajixapp' && p === 'SHaaciyeyare@!123';
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

// Deprecated: use logoutUser instead
export const logoutStudent = logoutUser;

export const getCurrentStudent = (): Student | null => {
  const { user, role } = validateCurrentSession();
  if (role === 'student') return user;
  return null;
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
