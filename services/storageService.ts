
import { ExamResult, Student, SubscriptionPlan, ExamAuthority, UserRole } from '../types';
import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile
} from "firebase/auth";

// --- SESSION MANAGEMENT ---

// Helper to wait for Firebase Auth to initialize
const waitForAuth = () => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
};

// Validate Session (Async)
export const validateCurrentSession = async (): Promise<{ user: Student | null, role: UserRole | null }> => {
  try {
    await waitForAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return { user: null, role: null };
    }

    // Since we are NOT using a database yet, we construct a default student profile
    // based on the Auth data.
    const student: Student = {
        id: currentUser.uid,
        fullName: currentUser.displayName || 'Student',
        email: currentUser.email || '',
        phone: '', // Not available in Auth
        school: 'Not Specified',
        level: 'FORM_IV', // Default
        registeredAt: new Date().toISOString(),
        authProvider: currentUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
        subscriptionPlan: 'FREE', // Default for now
        subscriptionStatus: 'active'
    };
    
    return { user: student, role: 'student' };

  } catch (e) {
    console.error("Session Validation Error", e);
    return { user: null, role: null };
  }
};

export const logoutUser = async () => {
    await signOut(auth);
};

// --- AUTHENTICATION ---

export const loginWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const logUserIn = async (email: string, password: string): Promise<{ success: boolean, error?: string, user?: Student }> => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error: any) {
        let msg = error.message;
        // Map Firebase error codes to specific messages
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            msg = "Email or password is incorrect";
        }
        return { success: false, error: msg };
    }
};

export const registerStudent = async (student: Student, password: string): Promise<{ success: boolean, error?: string, requiresConfirmation?: boolean }> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, student.email!, password);
        // Save the name to the Auth Profile since we aren't using a DB
        await updateProfile(userCredential.user, { displayName: student.fullName });

        return { success: true };
    } catch (error: any) {
        let msg = error.message;
        // Map Firebase error codes to specific messages
        if (error.code === 'auth/email-already-in-use') {
             msg = "User already exists. Please sign in";
        }
        return { success: false, error: msg };
    }
};

export const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean, error?: string }> => {
    try {
        await firebaseSendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const verifyAdminCredentials = (u: string, p: string): boolean => {
    return u === 'naajixapp' && p === 'SHaaciyeyare@!123';
};

// --- STUBS FOR DB FUNCTIONS (Disabled for Auth-Only Mode) ---

export const upgradeStudentSubscription = async (studentId: string, plan: SubscriptionPlan, authority?: ExamAuthority) => {
    // No-op without DB
    return null;
};

export const getStudentExamHistory = async (studentId: string): Promise<ExamResult[]> => {
    // No-op without DB
    return [];
};

export const saveExamResult = async (result: ExamResult): Promise<void> => {
    // No-op without DB
    console.log("Exam finished (Result not saved - DB disabled)", result);
};

export const getSubjectStats = async (studentId: string) => {
  // No-op without DB
  return [];
};

export const getAllStudents = async (): Promise<Student[]> => {
    return [];
};

export const getAllExamResults = async (): Promise<ExamResult[]> => {
    return [];
};

export const getActiveSessions = () => []; 
export const getLoginHistory = () => [];   
export const forceLogoutUser = async (uid: string) => {};
export const exportDataToCSV = (type: 'students' | 'results') => {};
