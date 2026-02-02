
import { ExamResult, Student, SubscriptionPlan, ExamAuthority, UserRole } from '../types';
import { auth, db } from './firebase'; // Import db from centralized file
import { doc, getDoc, setDoc, onSnapshot, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile,
  User
} from "firebase/auth";

// --- VIP CONFIGURATION ---
// Super Admin Email
const VIP_EMAIL = "isseshaie2050@gmail.com";

// --- DEVICE IDENTITY ---
const getDeviceId = (): string => {
    let id = localStorage.getItem('naajix_device_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('naajix_device_id', id);
    }
    return id;
};

// --- HELPER: SYNC USER TO FIRESTORE ---
// This ensures the user document exists and has the correct plan
const syncUserToFirestore = async (user: User, additionalData?: Partial<Student>): Promise<Student> => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    let studentData: Student;

    // Check if this is the VIP user
    const isVip = user.email?.toLowerCase() === VIP_EMAIL.toLowerCase();

    if (userSnap.exists()) {
        // User exists, merge data
        const data = userSnap.data() as Student;
        
        // Force upgrade if VIP matches
        if (isVip && (data.subscriptionPlan !== 'PREMIUM')) {
            await updateDoc(userRef, { subscriptionPlan: 'PREMIUM' }); 
            data.subscriptionPlan = 'PREMIUM';
        }

        studentData = { ...data, id: user.uid };
    } else {
        // Create new user profile
        studentData = {
            id: user.uid,
            fullName: user.displayName || 'Student',
            email: user.email || '',
            phone: additionalData?.phone || '', 
            school: additionalData?.school || 'Not Specified',
            level: additionalData?.level || 'FORM_IV',
            registeredAt: new Date().toISOString(),
            authProvider: user.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
            // Auto-set Premium for VIP
            subscriptionPlan: isVip ? 'PREMIUM' : 'FREE', 
            subscriptionStatus: 'active'
        };
        await setDoc(userRef, studentData);
    }
    
    return studentData;
};

// --- SESSION MANAGEMENT ---

const waitForAuth = () => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
};

export const validateCurrentSession = async (): Promise<{ user: Student | null, role: UserRole | null }> => {
  try {
    await waitForAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return { user: null, role: null };
    }

    // Fetch full profile from Firestore
    const student = await syncUserToFirestore(currentUser);
    
    // Determine Role
    let role: UserRole = 'student';
    
    // Check various admin conditions
    if (
        currentUser.email?.toLowerCase() === VIP_EMAIL.toLowerCase() || 
        student.email?.toLowerCase() === VIP_EMAIL.toLowerCase() || 
        (student as any).role === 'admin'
    ) {
        role = 'admin';
    } else if (currentUser.displayName === 'System Admin') {
        role = 'admin'; // Fallback for the hardcoded admin login
    }
    
    return { user: student, role: role };

  } catch (e) {
    console.error("Session Validation Error", e);
    return { user: null, role: null };
  }
};

export const logoutUser = async () => {
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
            if (data.deviceId && data.deviceId !== currentDeviceId) {
                return true; 
            }
        }
        return false;
    } catch (error) {
        console.error("Error checking session:", error);
        return false;
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

export const subscribeToSessionUpdates = (userId: string, onConflict: () => void) => {
    const sessionRef = doc(db, 'sessions', userId);
    return onSnapshot(sessionRef, (doc) => {
        const currentDeviceId = getDeviceId();
        if (doc.exists()) {
            const data = doc.data();
            if (data.deviceId && data.deviceId !== currentDeviceId) {
                onConflict();
            }
        }
    });
};

// --- AUTHENTICATION ---

export const loginWithGoogle = async (): Promise<{ success: boolean, error?: string, user?: Student }> => {
    try {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        provider.setCustomParameters({ prompt: 'select_account' });

        const result = await signInWithPopup(auth, provider);
        
        // Sync with Firestore to get plan/role
        const student = await syncUserToFirestore(result.user);

        await claimDeviceSession(result.user.uid);

        return { success: true, user: student };
    } catch (error: any) {
        return { success: false, error: error.message || "Google Sign-In failed" };
    }
};

export const logUserIn = async (email: string, password: string): Promise<{ success: boolean, error?: string, user?: Student, conflict?: boolean }> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const currentUser = userCredential.user;

        const hasConflict = await checkDeviceConflict(currentUser.uid);
        
        // Sync with Firestore
        const student = await syncUserToFirestore(currentUser);

        if (hasConflict) {
            return { success: false, conflict: true, user: student }; 
        }

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

export const registerStudent = async (student: Student, password: string): Promise<{ success: boolean, error?: string, user?: Student }> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, student.email!, password);
        await updateProfile(userCredential.user, { displayName: student.fullName });

        // Create Profile in Firestore
        const newStudent = await syncUserToFirestore(userCredential.user, student);

        await claimDeviceSession(newStudent.id);

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

// --- ADMIN & DATA MANAGEMENT ---

export const adminCreateUser = async (data: Student): Promise<boolean> => {
    try {
        const manualId = data.id || `manual-${Date.now()}`;
        const userRef = doc(db, 'users', manualId);
        await setDoc(userRef, {
            ...data,
            id: manualId,
            registeredAt: new Date().toISOString()
        });
        return true;
    } catch (e) {
        console.error("Error creating user manually", e);
        return false;
    }
};

export const updateStudentPlan = async (studentId: string, plan: SubscriptionPlan, authority?: ExamAuthority): Promise<boolean> => {
    try {
        const userRef = doc(db, 'users', studentId);
        await updateDoc(userRef, {
            subscriptionPlan: plan,
            basicAuthority: authority || null,
            subscriptionStartDate: new Date().toISOString(),
            // Set end date to 1 year from now for simplicity
            subscriptionEndDate: new Date(Date.now() + 365*24*60*60*1000).toISOString()
        });
        return true;
    } catch (e) {
        console.error("Error updating plan", e);
        return false;
    }
};

// Alias for compatibility
export const upgradeStudentSubscription = updateStudentPlan;

export const getAllStudents = async (): Promise<Student[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const students: Student[] = [];
        querySnapshot.forEach((doc) => {
            students.push(doc.data() as Student);
        });
        return students;
    } catch (e) {
        console.error("Error getting students", e);
        return [];
    }
};

export const getAllExamResults = async (): Promise<ExamResult[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "results"));
        const results: ExamResult[] = [];
        querySnapshot.forEach((doc) => {
            results.push(doc.data() as ExamResult);
        });
        return results;
    } catch (e) {
        return [];
    }
};

export const saveExamResult = async (result: ExamResult): Promise<void> => {
    try {
        const resRef = doc(db, 'results', result.id);
        await setDoc(resRef, result);
    } catch (e) {
        console.error("Error saving result", e);
    }
};

export const getStudentExamHistory = async (studentId: string): Promise<ExamResult[]> => {
    try {
        const q = query(collection(db, "results"), where("studentId", "==", studentId));
        const querySnapshot = await getDocs(q);
        const results: ExamResult[] = [];
        querySnapshot.forEach((doc) => {
            results.push(doc.data() as ExamResult);
        });
        return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (e) {
        console.error("Error fetching history", e);
        return [];
    }
};

// Stubs
export const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean, error?: string }> => {
    try {
        await firebaseSendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const verifyAdminCredentials = (u: string, p: string): boolean => {
    // Check for specific admin email or a generic 'admin' username
    const validUser = u.toLowerCase() === VIP_EMAIL.toLowerCase() || u.toLowerCase() === 'admin';
    const validPass = p === 'Caaliya@!123';
    
    // IF VALID: Save this admin to a separate Firebase collection automatically
    if (validUser && validPass) {
        const adminData = {
            username: u,
            email: VIP_EMAIL,
            role: 'super_admin',
            lastLogin: new Date().toISOString(),
            accessLevel: 'full'
        };
        // Fire and forget save to 'system_admins' collection
        setDoc(doc(db, 'system_admins', 'super_admin'), adminData).catch(e => console.error("Admin sync failed", e));
    }

    return validUser && validPass;
};

export const getSubjectStats = async (studentId: string) => {
    try {
        const history = await getStudentExamHistory(studentId);
        const stats: Record<string, {sum: number, count: number}> = {};
        
        history.forEach(h => {
            if(!stats[h.subject]) stats[h.subject] = { sum: 0, count: 0 };
            const pct = (h.score / h.maxScore) * 100;
            stats[h.subject].sum += pct;
            stats[h.subject].count++;
        });

        return Object.keys(stats).map(subject => ({
            subject,
            average: Math.round(stats[subject].sum / stats[subject].count)
        }));
    } catch (e) {
        console.error("Error calculating stats", e);
        return [];
    }
};

export const getActiveSessions = () => []; 
export const getLoginHistory = () => [];   
export const forceLogoutUser = async (uid: string) => {};
export const exportDataToCSV = (type: 'students' | 'results') => {};
