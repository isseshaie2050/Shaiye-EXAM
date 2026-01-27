
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

    // Fetch Profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error || !profile) {
      // If auth exists but no profile, maybe it's a raw user or admin check
      // For now, return null to force re-login or handle gracefully
      return { user: null, role: null };
    }

    const student: Student = {
        id: profile.id,
        fullName: profile.full_name,
        email: session.user.email,
        phone: profile.phone,
        school: profile.school,
        level: profile.education_level,
        registeredAt: session.user.created_at,
        authProvider: 'email',
        subscriptionPlan: profile.subscription_plan,
        subscriptionStatus: profile.subscription_status,
        subscriptionStartDate: profile.subscription_end_date, // Using end date field loosely for mapping
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
             return { success: false, error: "Login successful, but profile not found. Please contact support." };
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
    // We pass metadata options so data is available in Supabase Auth user object immediately
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
        // 2. Create Profile
        // Note: If email confirmation is ON, data.session might be null, but we can still write to public.profiles 
        // if your RLS policy allows it (e.g., allow insert for authenticated users OR anon users).
        // Since we are using the anon key, we depend on the RLS Policy set in Supabase SQL editor.
        // If the policy is strict (only authenticated), this insert might fail if session is null.
        // Assuming the SQL provided earlier: `create policy "Public profiles access" on public.profiles for all using (true);` handles this.
        
        const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: student.fullName,
            phone: student.phone,
            school: student.school,
            education_level: student.level,
            subscription_plan: 'FREE',
            role: 'student'
        });

        if (profileError) {
            // Ignore duplicate key error (if user double clicked)
            if (profileError.code !== '23505') {
                 return { success: false, error: "Account created but profile setup failed: " + profileError.message };
            }
        }
        
        // If session is null, it means email confirmation is required
        if (!data.session) {
            return { success: true, requiresConfirmation: true };
        }

        return { success: true };
    }

    return { success: false, error: "Unknown registration error" };
};

export const verifyAdminCredentials = (u: string, p: string): boolean => {
    // Keep admin strictly hardcoded/local for now as requested to ensure safety
    // Or you can migrate admin to Supabase profiles with role='admin'
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

    // Map back to Student type
    return {
        id: data.id,
        fullName: data.full_name,
        // ... other fields mapped partially for UI update
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
  
  // Map snake_case DB to camelCase Type
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
      feedback: {} // Storing feedback details if needed, simplifed for now
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
        email: 'Hidden', // Email is in auth.users, hard to fetch via simple client query without admin rights
        phone: p.phone,
        school: p.school,
        level: p.education_level,
        subscriptionPlan: p.subscription_plan,
        subscriptionStatus: p.subscription_status,
        registeredAt: '',
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

// --- LEGACY/PLACEHOLDER (For type compatibility where simple sync was used) ---
export const getActiveSessions = () => []; // Supabase manages this internally
export const getLoginHistory = () => [];   // Supabase Auth Logs available in dashboard
export const forceLogoutUser = async (uid: string) => { console.log("Admin force logout requires Supabase Admin API"); };
export const exportDataToCSV = (type: 'students' | 'results') => { alert("Exporting feature requires backend logic update."); };
