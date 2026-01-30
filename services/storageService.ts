
import { ExamResult, Student, SubscriptionPlan, ExamAuthority, UserRole } from '../types';
import { auth } from './firebase';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
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

// Initialize Firestore
const db = getFirestore();

// --- DEVICE IDENTITY ---
const getDeviceId = (): string => {
    let id = localStorage.getItem('naajix_device_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('naajix_device_id', id);
    }
    return id;
};

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

    // Construct a profile from Auth data only (No DB)
    const student: Student = {
        id: currentUser.uid,
        fullName: currentUser.displayName || 'Student',
        email: currentUser.email || '',
        phone: '', 
        school: 'Not Specified',
        level: 'FORM_IV',
        registeredAt: new Date().toISOString(),
        authProvider: currentUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
        subscriptionPlan: 'FREE', 
        subscriptionStatus: 'active'
    };
    
    return { user: student, role: 'student' };

  } catch (e) {
    console.error("Session Validation Error", e);
    return { user: null, role: null };
  }
};

export const logoutUser = async () => {
    // Optional: Clear session record from DB on logout if desired, 
    // but usually we just sign out auth.
    await signOut(auth);
};

// --- DEVICE SESSION CONTROL ---

export const checkDeviceConflict = async (userId: string): Promise<boolean> => {
    try {
        const sessionRef = doc(db, 'sessions', userId);
        const sessionSnap = await getDoc(sessionRef);
        
        if (sessionSnap.exists()) {
            const data = sessionSnap.data();
            const currentDeviceId = getDeviceId();
            // If DB has a device ID and it's NOT this one, we have a conflict
            if (data.deviceId && data.deviceId !== currentDeviceId) {
                return true; 
            }
        }
        return false;
    } catch (error) {
        console.error("Error checking session:", error);
        return false; // Fail open if DB issue
    }
};

export const claimDeviceSession = async (userId: string) => {
    try {
        const currentDeviceId = getDeviceId();
        const sessionRef = doc(db, 'sessions', userId);
        await setDoc(sessionRef, {
            deviceId: currentDeviceId,
            lastLogin: new Date().toISOString(),
            platform: navigator.platform
        }, { merge: true });
    } catch (error) {
        console.error("Error claiming session:", error);
    }
};

// Returns a cleanup function (unsubscribe)
export const subscribeToSessionUpdates = (userId: string, onConflict: () => void) => {
    const sessionRef = doc(db, 'sessions', userId);
    return onSnapshot(sessionRef, (doc) => {
        const currentDeviceId = getDeviceId();
        if (doc.exists()) {
            const data = doc.data();
            // If the DB says a different device is active, trigger conflict
            if (data.deviceId && data.deviceId !== currentDeviceId) {
                onConflict();
            }
        }
    });
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

export const logUserIn = async (email: string, password: string): Promise<{ success: boolean, error?: string, user?: Student, conflict?: boolean }> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const currentUser = userCredential.user;

        // CHECK FOR CONFLICT BEFORE RETURNING SUCCESS
        const hasConflict = await checkDeviceConflict(currentUser.uid);
        
        const student: Student = {
            id: currentUser.uid,
            fullName: currentUser.displayName || 'Student',
            email: currentUser.email || '',
            phone: '', 
            school: 'Not Specified',
            level: 'FORM_IV',
            registeredAt: new Date().toISOString(),
            authProvider: 'email',
            subscriptionPlan: 'FREE', 
            subscriptionStatus: 'active'
        };

        if (hasConflict) {
            // Return success false, but indicate conflict so UI can show "Force Login" button
            return { success: false, conflict: true, user: student }; 
        }

        // No conflict, claim session immediately
        await claimDeviceSession(currentUser.uid);

        return { success: true, user: student };
    } catch (error: any) {
        console.error("Login Error:", error.code, error.message);
        let msg = error.message;
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            msg = "Email or password is incorrect";
        }
        return { success: false, error: msg };
    }
};

export const registerStudent = async (student: Student, password: string): Promise<{ success: boolean, error?: string, user?: Student, requiresConfirmation?: boolean }> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, student.email!, password);
        
        await updateProfile(userCredential.user, { displayName: student.fullName });

        // New user -> Claim session immediately
        await claimDeviceSession(userCredential.user.uid);

        const newStudent: Student = {
            ...student,
            id: userCredential.user.uid
        };

        return { success: true, user: newStudent };
    } catch (error: any) {
        console.error("Registration Error:", error.code, error.message);
        let msg = error.message;
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
    return null;
};

export const getStudentExamHistory = async (studentId: string): Promise<ExamResult[]> => {
    return [];
};

export const saveExamResult = async (result: ExamResult): Promise<void> => {
    console.log("Exam finished (Result not saved - DB disabled)", result);
};

export const getSubjectStats = async (studentId: string) => {
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
