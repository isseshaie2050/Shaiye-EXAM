
import { ExamResult, Student, SubscriptionPlan, ExamAuthority, UserRole } from '../types';
import { auth, db } from './firebase';
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
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from "firebase/firestore";

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

    // Fetch profile from Firestore
    const userDocRef = doc(db, "profiles", currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const profile = userDocSnap.data();
        const student: Student = {
            id: currentUser.uid,
            fullName: profile.full_name,
            email: currentUser.email || '',
            phone: profile.phone || '',
            school: profile.school || '',
            level: profile.education_level || 'FORM_IV',
            registeredAt: profile.created_at || new Date().toISOString(),
            authProvider: currentUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
            subscriptionPlan: profile.subscription_plan || 'FREE',
            subscriptionStatus: profile.subscription_status || 'active',
            subscriptionEndDate: profile.subscription_end_date,
            basicAuthority: profile.basic_authority
        };
        return { user: student, role: (profile.role as UserRole) || 'student' };
    } else {
        // Handle case where auth exists but profile doc doesn't (e.g. first Google Login)
        // We create a default profile here
        const name = currentUser.displayName || currentUser.email?.split('@')[0] || 'Student';
        const newProfile = {
             full_name: name,
             email: currentUser.email,
             phone: '',
             school: 'Not Specified',
             education_level: 'FORM_IV',
             subscription_plan: 'FREE',
             subscription_status: 'active',
             role: 'student',
             created_at: new Date().toISOString()
        };
        
        await setDoc(userDocRef, newProfile);
        
        const student: Student = {
            id: currentUser.uid,
            fullName: name,
            email: currentUser.email || '',
            phone: '',
            school: 'Not Specified',
            level: 'FORM_IV',
            registeredAt: new Date().toISOString(),
            authProvider: 'google',
            subscriptionPlan: 'FREE',
            subscriptionStatus: 'active'
        };
        return { user: student, role: 'student' };
    }

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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Fetch Profile
        const userDocRef = doc(db, "profiles", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const profile = userDocSnap.data();
            const student: Student = {
                id: uid,
                fullName: profile.full_name,
                email: email,
                phone: profile.phone,
                school: profile.school,
                level: profile.education_level,
                registeredAt: profile.created_at,
                authProvider: 'email',
                subscriptionPlan: profile.subscription_plan,
                subscriptionStatus: profile.subscription_status,
                subscriptionEndDate: profile.subscription_end_date,
                basicAuthority: profile.basic_authority
            };
            return { success: true, user: student };
        }
        
        return { success: true }; // Profile might be created on validateSession
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const registerStudent = async (student: Student, password: string): Promise<{ success: boolean, error?: string, requiresConfirmation?: boolean }> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, student.email!, password);
        const user = userCredential.user;

        // Update Display Name
        await updateProfile(user, { displayName: student.fullName });

        // Create Profile Document in Firestore
        await setDoc(doc(db, "profiles", user.uid), {
             full_name: student.fullName,
             email: student.email,
             phone: student.phone,
             school: student.school,
             education_level: student.level,
             subscription_plan: 'FREE',
             subscription_status: 'active',
             role: 'student',
             created_at: new Date().toISOString()
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
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

// --- SUBSCRIPTION HELPERS ---

export const upgradeStudentSubscription = async (studentId: string, plan: SubscriptionPlan, authority?: ExamAuthority) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30); 

    try {
        const userDocRef = doc(db, "profiles", studentId);
        await updateDoc(userDocRef, {
            subscription_plan: plan,
            subscription_status: 'active',
            subscription_end_date: endDate.toISOString(),
            basic_authority: authority || null
        });

        // Return updated data structure
        const snap = await getDoc(userDocRef);
        const data = snap.data();
        if (!data) return null;

        return {
            id: studentId,
            fullName: data.full_name,
            email: data.email,
            phone: data.phone,
            school: data.school,
            level: data.education_level,
            subscriptionPlan: data.subscription_plan,
            subscriptionStatus: data.subscription_status,
            basicAuthority: data.basic_authority,
            subscriptionEndDate: data.subscription_end_date,
            authProvider: 'email', // Simplified re-return
            registeredAt: data.created_at
        } as Student;

    } catch (error) {
        console.error("Upgrade failed", error);
        return null;
    }
};

// --- DATA FETCHING ---

export const getStudentExamHistory = async (studentId: string): Promise<ExamResult[]> => {
    try {
        const q = query(
            collection(db, "exam_results"), 
            where("studentId", "==", studentId),
            orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        const results: ExamResult[] = [];
        querySnapshot.forEach((doc) => {
            results.push(doc.data() as ExamResult);
        });
        return results;
    } catch (error) {
        console.error("Error fetching history:", error);
        // Fallback if index is missing (Firestore requires index for where+orderBy)
        try {
             const q2 = query(collection(db, "exam_results"), where("studentId", "==", studentId));
             const snap = await getDocs(q2);
             const unsorted: ExamResult[] = [];
             snap.forEach(doc => unsorted.push(doc.data() as ExamResult));
             return unsorted.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } catch (e) {
            return [];
        }
    }
};

export const saveExamResult = async (result: ExamResult): Promise<void> => {
    try {
        // Use addDoc to auto-generate ID, or setDoc with result.id
        await setDoc(doc(db, "exam_results", result.id), result);
    } catch (error) {
        console.error("Failed to save result", error);
    }
};

export const getSubjectStats = async (studentId: string) => {
  const history = await getStudentExamHistory(studentId);
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

// --- ADMIN FETCHERS ---

export const getAllStudents = async (): Promise<Student[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "profiles"));
        const students: Student[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            students.push({
                id: doc.id,
                fullName: data.full_name,
                email: data.email || 'Hidden',
                phone: data.phone,
                school: data.school,
                level: data.education_level,
                subscriptionPlan: data.subscription_plan,
                subscriptionStatus: data.subscription_status,
                registeredAt: data.created_at || '',
                authProvider: 'email'
            });
        });
        return students;
    } catch (error) {
        return [];
    }
};

export const getAllExamResults = async (): Promise<ExamResult[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, "exam_results"));
        const results: ExamResult[] = [];
        querySnapshot.forEach((doc) => {
            results.push(doc.data() as ExamResult);
        });
        return results.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        return [];
    }
};

export const getActiveSessions = () => []; 
export const getLoginHistory = () => [];   
export const forceLogoutUser = async (uid: string) => {};
export const exportDataToCSV = (type: 'students' | 'results') => {};
