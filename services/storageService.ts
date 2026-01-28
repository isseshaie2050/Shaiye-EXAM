
import { ExamResult, Student, SubscriptionPlan, ExamAuthority, ActiveSession, LoginSession, UserRole } from '../types';
import { supabase } from './supabaseClient';

// --- SESSION MANAGEMENT ---

// Validate Session (Async)
export const validateCurrentSession = async (): Promise<{ user: Student | null, role: UserRole | null }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      return { user: null, role: null };
    }

    // Attempt to fetch profile
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    // RECOVERY LOGIC: If profile is missing (e.g., first Google Login without backend trigger), create it
    if (!profile) {
         // Construct default profile for OAuth users
         const metadata = session.user.user_metadata || {};
         // Extract name from metadata or email
         const name = metadata.full_name || metadata.name || session.user.email?.split('@')[0] || 'Student';
         
         const newProfile = {
             id: session.user.id,
             full_name: name,
             email: session.user.email,
             phone: '', // OAuth doesn't usually provide phone
             school: 'Not Specified',
             education_level: 'FORM_IV', // Default level
             subscription_plan: 'FREE',
             subscription_status: 'active',
             role: 'student',
             updated_at: new Date().toISOString()
         };
         
         // Attempt to insert the missing profile
         const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .upsert(newProfile)
            .select()
            .single();
            
         if (!createError && createdProfile) {
             profile = createdProfile;
         } else {
             console.error("Failed to create profile for OAuth user", createError);
             // If we can't create a profile, we can't let them in as a valid student
             return { user: null, role: null };
         }
    }

    const student: Student = {
        id: profile.id,
        fullName: profile.full_name,
        email: session.user.email,
        phone: profile.phone,
        school: profile.school,
        level: profile.education_level,
        registeredAt: session.user.created_at,
        authProvider: session.user.app_metadata.provider === 'google' ? 'google' : 'email',
        subscriptionPlan: profile.subscription_plan,
        subscriptionStatus: profile.subscription_status,
        subscriptionStartDate: profile.subscription_end_date, // Using start as end for simplicity or if missing
        subscriptionEndDate: profile.subscription_end_date,
        basicAuthority: profile.basic_authority
    };

    return { user: student, role: (profile.role as UserRole) || 'student' };

  } catch (e) {
    console.error("Session Validation Error", e);
    return { user: null, role: null };
  }
};

export const logoutUser = async () => {
    await supabase.auth.signOut();
};

// --- AUTHENTICATION ---

export const loginWithGoogle = async () => {
    // Determine the redirect URL. In production, this must be whitelisted in Supabase Dashboard.
    const redirectUrl = window.location.origin; 
    
    console.log("Initiating Google Auth with Redirect URL:", redirectUrl);
    // NOTE: If you see 'redirect_uri_mismatch' error from Google:
    // 1. Go to Google Cloud Console > APIs & Services > Credentials
    // 2. Add "https://<PROJECT_REF>.supabase.co/auth/v1/callback" to Authorized redirect URIs
    
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        }
    });
    
    if (error) return { success: false, error: error.message };
    return { success: true };
};

export const logUserIn = async (email: string, password: string): Promise<{ success: boolean, error?: string, user?: Student }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) return { success: false, error: error.message };
    
    // Fetch profile immediately to confirm role/data
    if (data.user) {
         const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
         
         if (profileError || !profile) {
             // Try to recover if profile is missing (rare for email login if register worked, but safe to handle)
              return { success: false, error: "Login successful, but profile data is missing." };
         }

         const student: Student = {
             id: profile.id,
             fullName: profile.full_name,
             email: data.user.email,
             phone: profile.phone,
             school: profile.school,
             level: profile.education_level,
             registeredAt: data.user.created_at,
             authProvider: 'email',
             subscriptionPlan: profile.subscription_plan,
             subscriptionStatus: profile.subscription_status,
             subscriptionEndDate: profile.subscription_end_date,
             basicAuthority: profile.basic_authority
         };

         return { success: true, user: student };
    }
    return { success: true };
};

export const registerStudent = async (student: Student, password: string): Promise<{ success: boolean, error?: string, requiresConfirmation?: boolean }> => {
    // 1. Sign Up
    const { data, error } = await supabase.auth.signUp({
        email: student.email!,
        password: password,
        options: {
            data: {
                full_name: student.fullName,
                phone: student.phone,
                school: student.school,
                education_level: student.level,
            }
        }
    });

    if (error) return { success: false, error: error.message };

    if (data.user) {
        // SAFETY: If we have a session immediately (Email Confirm disabled), ensure profile exists
        if (data.session) {
             const { error: profileError } = await supabase.from('profiles').insert({
                 id: data.user.id,
                 full_name: student.fullName,
                 phone: student.phone,
                 school: student.school,
                 education_level: student.level,
                 email: student.email,
                 subscription_plan: 'FREE',
                 subscription_status: 'active',
                 role: 'student'
             });
             
             if (profileError) {
                 // Log but don't fail, usually means trigger handled it or duplicate
                 console.warn("Manual profile creation warning:", profileError.message);
             }
             return { success: true };
        }
        
        // If no session, it means confirmation email was sent
        return { success: true, requiresConfirmation: true };
    }

    return { success: false, error: "Unknown registration error" };
};

export const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean, error?: string }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin, // Redirects back to app
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
};

export const verifyAdminCredentials = (u: string, p: string): boolean => {
    // In a real app, admins should be in the DB with a role. This is a hardcoded fallback/demo.
    return u === 'naajixapp' && p === 'SHaaciyeyare@!123';
};

// --- SUBSCRIPTION HELPERS ---

export const upgradeStudentSubscription = async (studentId: string, plan: SubscriptionPlan, authority?: ExamAuthority) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30); 

    const { data, error } = await supabase.from('profiles').update({
        subscription_plan: plan,
        subscription_status: 'active',
        subscription_end_date: endDate.toISOString(),
        basic_authority: authority
    }).eq('id', studentId).select().single();

    if (error) {
        console.error("Upgrade failed", error);
        return null;
    }

    return {
        id: data.id,
        fullName: data.full_name,
        subscriptionPlan: data.subscription_plan,
        basicAuthority: data.basic_authority,
        subscriptionEndDate: data.subscription_end_date
    } as Student;
};

// --- DATA FETCHING ---

export const getStudentExamHistory = async (studentId: string): Promise<ExamResult[]> => {
  const { data, error } = await supabase
    .from('exam_results')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false });

  if (error) return [];
  
  return data.map((d: any) => ({
      id: d.id,
      studentId: d.student_id,
      studentName: d.student_name,
      examId: d.exam_id,
      subject: d.subject,
      year: d.year,
      score: d.score,
      maxScore: d.max_score,
      grade: d.grade,
      date: d.date
  }));
};

export const saveExamResult = async (result: ExamResult): Promise<void> => {
  const { error } = await supabase.from('exam_results').insert({
      student_id: result.studentId,
      student_name: result.studentName,
      exam_id: result.examId,
      subject: result.subject,
      year: result.year,
      score: result.score,
      max_score: result.maxScore,
      grade: result.grade,
      date: result.date,
      feedback: {} 
  });

  if (error) console.error("Failed to save result", error);
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
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) return [];
    return data.map((p: any) => ({
        id: p.id,
        fullName: p.full_name,
        email: p.email || 'Hidden',
        phone: p.phone,
        school: p.school,
        level: p.education_level,
        subscriptionPlan: p.subscription_plan,
        subscriptionStatus: p.subscription_status,
        registeredAt: p.created_at || '',
        authProvider: 'email'
    }));
};

export const getAllExamResults = async (): Promise<ExamResult[]> => {
    const { data, error } = await supabase.from('exam_results').select('*').order('date', { ascending: false });
    if (error) return [];
    return data.map((d: any) => ({
      id: d.id,
      studentId: d.student_id,
      studentName: d.student_name,
      examId: d.exam_id,
      subject: d.subject,
      year: d.year,
      score: d.score,
      maxScore: d.max_score,
      grade: d.grade,
      date: d.date
  }));
};

export const getActiveSessions = () => []; 
export const getLoginHistory = () => [];   
export const forceLogoutUser = async (uid: string) => {};
export const exportDataToCSV = (type: 'students' | 'results') => {};
