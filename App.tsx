
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, UserAnswer, Exam, ExamResult, ExamAuthority, EducationLevel, Student, UserRole } from './types';
import { ACADEMIC_YEARS, SUBJECT_CONFIG, EXAM_HIERARCHY } from './constants';
import { gradeBatch, formatFeedback } from './services/geminiService';
import { saveExamResult, getStudentExamHistory, logoutUser, validateCurrentSession, verifyAdminCredentials, logUserIn } from './services/storageService';
import { getExam, getAvailableYears, fetchDynamicExams } from './services/examService';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import AdminPanel from './components/AdminPanel';
import StudentAuth from './components/StudentAuth';
import { AboutPage, PrivacyPage, ContactPage } from './components/InfoPages';

// Utility to shuffle array (Fisher-Yates)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// Component to render text with bold formatting by parsing **text**
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
           return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

const ExamImage: React.FC<{ src: string, alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);
  useEffect(() => { setHasError(false); }, [src]);
  if (hasError) return null;
  return (
    <img 
      src={src} alt={alt} 
      className="max-w-full h-auto mb-4 rounded border border-gray-200" 
      onError={() => setHasError(true)} loading="eager"
    />
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.HOME);
  const viewRef = useRef<AppState>(AppState.HOME); 
  const [loadingApp, setLoadingApp] = useState(true);
  const [globalError, setGlobalError] = useState<{title: string, msg: string, fix?: string} | null>(null);

  // User Session State
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);

  // Navigation State
  const [selectedAuthority, setSelectedAuthority] = useState<ExamAuthority | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | null>(null);
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState<{ score: number, maxScore: number, feedback: any[], sectionScores: Record<string, {score: number, total: number}> } | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [gradingProgress, setGradingProgress] = useState(0);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Admin Login State
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // Keep viewRef in sync
  useEffect(() => { viewRef.current = view; }, [view]);

  // --- APP INITIALIZATION ---
  useEffect(() => {
    const init = async () => {
        try {
            // PERFORMANCE: Run fetches in parallel to reduce wait time
            const [_, sessionData] = await Promise.all([
                fetchDynamicExams(),
                validateCurrentSession()
            ]);
            
            if (sessionData.user && sessionData.role) {
                setCurrentStudent(sessionData.user);
                setCurrentUserRole(sessionData.role);
            }
        } catch (e) {
            console.error("Initialization error", e);
        } finally {
            // Short timeout to ensure smooth transition
            setTimeout(() => setLoadingApp(false), 500);
        }
    };
    init();
  }, []);

  // --- ROUTING ENGINE ---
  const buildUrl = (targetView: AppState, params?: { auth?: ExamAuthority, level?: EducationLevel, year?: number, subject?: string }) => {
      let url = '/';
      if (targetView === AppState.DASHBOARD) url = '/dashboard';
      else if (targetView === AppState.STUDENT_AUTH) url = '/login';
      else if (targetView === AppState.ADMIN_LOGIN) url = '/adminpanel/login';
      else if (targetView === AppState.ADMIN_PANEL) url = '/adminpanel';
      else if (targetView === AppState.ABOUT) url = '/about';
      else if (targetView === AppState.PRIVACY) url = '/privacy';
      else if (targetView === AppState.CONTACT) url = '/contact';
      else if (targetView === AppState.RESULTS) url = '/results';
      else if (params && params.auth) {
          url = `/exams/${params.auth}`;
          if (params.level) {
              url += `/${params.level}`;
              if (params.year) {
                  url += `/${params.year}`;
                  if (params.subject) {
                      url += `/${params.subject}`;
                      if (targetView === AppState.EXAM_ACTIVE) {
                          url += `/take`;
                      }
                  }
              }
          }
      }
      return url;
  };

  const navigateTo = useCallback((targetView: AppState, params?: { auth?: ExamAuthority, level?: EducationLevel, year?: number, subject?: string }) => {
      const url = buildUrl(targetView, params);
      window.history.pushState({}, '', url);
      
      // Update State
      if (params) {
          if (params.auth) setSelectedAuthority(params.auth);
          if (params.level) setSelectedLevel(params.level);
          if (params.year) setSelectedYear(params.year);
          if (params.subject) setSelectedSubjectKey(params.subject);
      }
      setView(targetView);
  }, []);

  const syncStateFromUrl = useCallback(() => {
    const path = window.location.pathname.toLowerCase();
    const parts = path.replace(/^\/|\/$/g, '').split('/');

    if (parts.length === 0 || parts[0] === '') {
        setView(AppState.HOME);
        return;
    }

    const root = parts[0];

    if (root === 'dashboard') { setView(AppState.DASHBOARD); return; }
    if (root === 'login') { setView(AppState.STUDENT_AUTH); return; }
    if (root === 'about') { setView(AppState.ABOUT); return; }
    if (root === 'privacy') { setView(AppState.PRIVACY); return; }
    if (root === 'contact') { setView(AppState.CONTACT); return; }
    
    // Explicit Admin Routing
    if (root === 'adminpanel') {
        if (parts.length > 1 && parts[1] === 'login') {
             setView(AppState.ADMIN_LOGIN);
        } else {
             setView(AppState.ADMIN_PANEL);
        }
        return;
    }

    if (root === 'results') {
        setView(AppState.RESULTS);
        return;
    }

    if (root === 'exams') {
        const auth = parts[1] as ExamAuthority;
        const level = parts[2] as EducationLevel;
        const year = parseInt(parts[3]);
        const subject = parts[4];
        const mode = parts[5];

        if (auth) setSelectedAuthority(auth);
        if (level) setSelectedLevel(level);
        if (year) setSelectedYear(year);
        if (subject) setSelectedSubjectKey(subject);

        if (mode === 'take') {
            setView(AppState.EXAM_ACTIVE);
        }
        else if (subject) setView(AppState.EXAM_OVERVIEW);
        else if (year) setView(AppState.SUBJECT_SELECT);
        else if (level) setView(AppState.YEAR_SELECT);
        else if (auth) setView(AppState.LEVEL_SELECT);
        else setView(AppState.HOME); 
        return;
    }

    setView(AppState.HOME);
  }, []);

  useEffect(() => {
      const handlePopState = (e: PopStateEvent) => {
          if (viewRef.current === AppState.EXAM_ACTIVE) {
              const confirmLeave = window.confirm("You are taking an exam. Leaving now will lose progress. Are you sure?");
              if (!confirmLeave) {
                  window.history.pushState(null, '', document.referrer); 
                  return; 
              } else {
                  setAnswers([]);
                  setTimeLeft(0);
                  setActiveExam(null);
              }
          }
          syncStateFromUrl();
      };

      window.addEventListener('popstate', handlePopState);
      syncStateFromUrl();
      return () => window.removeEventListener('popstate', handlePopState);
  }, [syncStateFromUrl]);


  // --- SECURITY: ADMIN GATE ---
  useEffect(() => {
      if (!loadingApp && view === AppState.ADMIN_PANEL) {
          if (!currentStudent) {
              navigateTo(AppState.ADMIN_LOGIN);
          } else if (currentUserRole !== 'admin') {
              alert("Access Denied: You do not have permission to view this page.");
              navigateTo(AppState.HOME);
          }
      }
  }, [view, currentStudent, currentUserRole, navigateTo, loadingApp]);

  // --- BRANDING: DYNAMIC BROWSER TITLES ---
  useEffect(() => {
    let title = "Naajix";
    switch (view) {
      case AppState.HOME: title = "Naajix | Home"; break;
      case AppState.EXAM_ACTIVE: title = activeExam ? `Naajix | ${activeExam.subject}` : "Naajix | Exam"; break;
      case AppState.DASHBOARD: title = "Naajix | Dashboard"; break;
      default: title = "Naajix";
    }
    document.title = title;
  }, [view, activeExam]);

  const handleSubmit = useCallback(async () => {
    if (!activeExam || !currentStudent) {
      // Safety check: if session expired during exam
      alert("Session expired. Please log in to save results.");
      navigateTo(AppState.STUDENT_AUTH);
      return;
    }

    setIsGrading(true);
    setGradingProgress(0);
    setIsPaused(true);

    let totalScore = 0;
    const maxScore = activeExam.questions.reduce((sum, q) => sum + q.marks, 0);
    const feedbackList: any[] = [];
    const sectionScores: Record<string, { score: number, total: number }> = {};

    activeExam.questions.forEach(q => {
      if (!sectionScores[q.section]) sectionScores[q.section] = { score: 0, total: 0 };
      sectionScores[q.section].total += q.marks;
    });

    try {
      const mcqQuestions = activeExam.questions.filter(q => q.type === 'mcq');
      const textQuestions = activeExam.questions.filter(q => q.type !== 'mcq');
      const totalQuestionsCount = activeExam.questions.length;
      
      // 2. Grade MCQs locally
      mcqQuestions.forEach(q => {
        const userAnswer = answers.find(a => a.questionId === q.id)?.answer || '';
        const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        const score = isCorrect ? q.marks : 0;
        const status = isCorrect ? (activeExam.language === 'somali' ? "✅ **Sax**" : "✅ **Correct**") : (activeExam.language === 'somali' ? "❌ **Qalad**" : "❌ **Incorrect**");
        feedbackList.push({ questionId: q.id, score, feedback: status, userAnswer, question: q });
        totalScore += score;
        sectionScores[q.section].score += score;
      });

      let processedCount = mcqQuestions.length;
      setGradingProgress(Math.round((processedCount / totalQuestionsCount) * 100));

      const textItemsToGrade = textQuestions
        .map(q => ({ question: q, userAnswer: answers.find(a => a.questionId === q.id)?.answer || '' }))
        .filter(item => item.userAnswer.trim().length > 0);

      textQuestions.forEach(q => {
        const userAnswer = answers.find(a => a.questionId === q.id)?.answer || '';
        if (userAnswer.trim().length === 0) {
           feedbackList.push({ questionId: q.id, score: 0, feedback: formatFeedback(q, 0, "No answer.", activeExam.language), userAnswer: '', question: q });
           processedCount++;
        }
      });
      setGradingProgress(Math.round((processedCount / totalQuestionsCount) * 100));

      if (textItemsToGrade.length > 0) {
        const batchResults = await gradeBatch(textItemsToGrade, activeExam.language, (c, t) => {
             const currentTotal = processedCount + c;
             setGradingProgress(Math.round((currentTotal / totalQuestionsCount) * 100));
        });
        
        textItemsToGrade.forEach(item => {
          const result = batchResults[item.question.id] || { score: 0, feedback: "Grading unavailable." };
          feedbackList.push({ questionId: item.question.id, score: result.score, feedback: formatFeedback(item.question, result.score, result.feedback, activeExam.language), userAnswer: item.userAnswer, question: item.question });
          totalScore += result.score;
          sectionScores[item.question.section].score += result.score;
        });
      }

      setGradingProgress(100);
      feedbackList.sort((a, b) => {
        const idxA = activeExam.questions.findIndex(q => q.id === a.questionId);
        const idxB = activeExam.questions.findIndex(q => q.id === b.questionId);
        return idxA - idxB;
      });

      const finalResult: ExamResult = {
        id: `res-${Date.now()}`, 
        studentId: currentStudent.id, 
        studentName: currentStudent.fullName,
        examId: activeExam.id, 
        subject: activeExam.subject, 
        year: activeExam.year,
        score: totalScore, 
        maxScore, 
        grade: calculateGrade(totalScore, maxScore), 
        date: new Date().toISOString()
      };

      await saveExamResult(finalResult); 
      setResults({ score: totalScore, maxScore, feedback: feedbackList, sectionScores });
      navigateTo(AppState.RESULTS);

    } catch (e) {
      console.error("Grading failed", e);
      alert("Error submitting exam. Please try again.");
    } finally {
      setIsGrading(false);
      setShowSubmitModal(false);
    }
  }, [activeExam, answers, currentStudent, navigateTo]);

  useEffect(() => {
    let timer: any;
    if (view === AppState.EXAM_ACTIVE && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (view === AppState.EXAM_ACTIVE && timeLeft === 0) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [view, timeLeft, isPaused, handleSubmit]);

  const handleAdminLogin = () => {
      // Local check for admin
      if (verifyAdminCredentials(adminUser, adminPass)) {
          // Fake session for admin locally
          const adminUserObj = { id: 'admin-001', fullName: 'System Admin' } as Student;
          setCurrentStudent(adminUserObj);
          setCurrentUserRole('admin');
          navigateTo(AppState.ADMIN_PANEL);
          setAdminUser(''); setAdminPass('');
      } else {
          alert('Invalid Admin Credentials');
      }
  };
  
  const handleLogout = async () => {
      await logoutUser();
      setCurrentStudent(null);
      setCurrentUserRole(null);
      navigateTo(AppState.HOME);
  };
  
  // Navigation Handlers ...
  const handleAuthoritySelect = (auth: ExamAuthority) => { 
      // 1. STRICT LOGIN GATE
      if(!currentStudent) { 
          // Redirect to auth if not logged in
          navigateTo(AppState.STUDENT_AUTH); 
          return; 
      }
      
      // 2. CHECK PLAN RESTRICTIONS
      if(currentStudent.subscriptionPlan === 'BASIC' && currentStudent.basicAuthority && currentStudent.basicAuthority !== auth) {
         alert(`Your Basic Plan is locked to ${currentStudent.basicAuthority === 'SOMALI_GOV' ? 'Somali Government' : 'Puntland'} exams. Please upgrade to Premium to access both.`); 
         return;
      }
      navigateTo(AppState.LEVEL_SELECT, { auth });
  };
  const handleLevelSelect = (level: EducationLevel) => navigateTo(AppState.YEAR_SELECT, { auth: selectedAuthority!, level });
  const handleYearSelect = (year: number) => navigateTo(AppState.SUBJECT_SELECT, { auth: selectedAuthority!, level: selectedLevel!, year });
  const handleSubjectSelect = (subjectKey: string) => navigateTo(AppState.EXAM_OVERVIEW, { auth: selectedAuthority!, level: selectedLevel!, year: selectedYear!, subject: subjectKey });
  
  const startExam = () => {
    if (!currentStudent) { 
        navigateTo(AppState.STUDENT_AUTH); 
        return; 
    }
    const examTemplate = getExam(selectedYear, selectedSubjectKey);
    if (!examTemplate) { alert("Exam not found."); return; }

    let questionsToUse = examTemplate.questions;
    questionsToUse = shuffleArray([...questionsToUse]).map(q => {
        if (q.type === 'mcq' && q.options) return { ...q, options: shuffleArray([...q.options]) };
        return q;
    });

    if (currentStudent.subscriptionPlan === 'FREE') questionsToUse = questionsToUse.slice(0, 5);

    setActiveExam({ ...examTemplate, questions: questionsToUse });
    setAnswers([]); setCurrentQuestionIndex(0);
    
    const timePerQ = examTemplate.durationMinutes / examTemplate.questions.length;
    setTimeLeft(Math.ceil(timePerQ * questionsToUse.length) * 60);

    setShowSubmitModal(false); setIsPaused(false);
    navigateTo(AppState.EXAM_ACTIVE, { auth: selectedAuthority!, level: selectedLevel!, year: selectedYear!, subject: selectedSubjectKey! });
  };
  
  const handleAnswer = (answer: string) => {
      if (!activeExam) return;
      const currentQ = activeExam.questions[currentQuestionIndex];
      setAnswers(prev => [...prev.filter(a => a.questionId !== currentQ.id), { questionId: currentQ.id, answer }]);
  };

  // --- OPTIMIZED LOADING SCREEN ---
  if (loadingApp) return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 bg-blue-100 rounded-full animate-ping opacity-20"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 relative loading-ring mb-6">
                <img 
                    src="https://shaiyecompany.com/wp-content/uploads/2026/01/naajix-logo-5.png" 
                    alt="Naajix"
                    className="w-full h-full object-contain rounded-full relative z-10" 
                />
              </div>
              <h1 className="text-2xl font-black text-blue-900 tracking-tight animate-pulse">Naajix</h1>
              <p className="text-sm text-slate-500 font-medium mt-2">Preparing your exam environment...</p>
          </div>
      </div>
  );

  // --- GLOBAL ERROR MODAL ---
  if (globalError) {
      return (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6">
              <div className="bg-white p-8 rounded-xl max-w-md w-full text-center border-t-4 border-red-500 shadow-2xl">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{globalError.title}</h3>
                  <p className="text-slate-600 mb-4 font-medium">{globalError.msg}</p>
                  
                  {globalError.fix && (
                      <div className="bg-blue-50 p-4 rounded-lg text-left text-sm text-blue-800 border border-blue-100 mb-6">
                          <strong>How to fix:</strong>
                          <p className="mt-1 font-mono text-xs break-all">{globalError.fix}</p>
                      </div>
                  )}

                  <button 
                    onClick={() => { setGlobalError(null); setView(AppState.STUDENT_AUTH); }} 
                    className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition"
                  >
                      Try Again
                  </button>
              </div>
          </div>
      );
  }

  // --- VIEW RENDERING (Simplified for brevity as structure is same) ---
  if (view === AppState.HOME) return <LandingPage onSelectAuthority={handleAuthoritySelect} onNavigate={(target) => { if(target===AppState.DASHBOARD) { if(currentStudent) navigateTo(AppState.DASHBOARD); else navigateTo(AppState.STUDENT_AUTH); } else navigateTo(target); }} />;
  if (view === AppState.STUDENT_AUTH) return <StudentAuth onLoginSuccess={(student) => { setCurrentStudent(student); setCurrentUserRole('student'); navigateTo(AppState.HOME); }} onCancel={() => navigateTo(AppState.HOME)} />;
  if (view === AppState.DASHBOARD) return <StudentDashboard onBack={() => navigateTo(AppState.HOME)} />;
  if (view === AppState.ADMIN_LOGIN) return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-4">
           <h2 className="text-center font-bold text-xl">Admin Login</h2>
           <input type="text" placeholder="Username" value={adminUser} onChange={e=>setAdminUser(e.target.value)} className="w-full p-2 border rounded" />
           <input type="password" placeholder="Password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} className="w-full p-2 border rounded" />
           <button onClick={handleAdminLogin} className="w-full bg-blue-900 text-white py-2 rounded font-bold">Login</button>
           <button onClick={()=>navigateTo(AppState.HOME)} className="w-full text-gray-500 py-2">Cancel</button>
        </div>
      </div>
  );
  if (view === AppState.ADMIN_PANEL) return <AdminPanel onLogout={handleLogout} />;
  
  // ... Other simple views ...
  if (view === AppState.ABOUT) return <AboutPage onBack={() => navigateTo(AppState.HOME)} />;
  if (view === AppState.PRIVACY) return <PrivacyPage onBack={() => navigateTo(AppState.HOME)} />;
  if (view === AppState.CONTACT) return <ContactPage onBack={() => navigateTo(AppState.HOME)} />;
  
  if (view === AppState.LEVEL_SELECT) return (
       <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
         <button onClick={()=>navigateTo(AppState.HOME)} className="mb-8">← Back</button>
         <h1 className="text-2xl font-bold mb-8">Select Level</h1>
         <div className="grid md:grid-cols-2 gap-8">
             <div onClick={()=>handleLevelSelect('STD_8')} className="bg-white p-8 rounded shadow cursor-pointer hover:shadow-lg">Standard 8</div>
             <div onClick={()=>handleLevelSelect('FORM_IV')} className="bg-white p-8 rounded shadow cursor-pointer hover:shadow-lg">Form IV</div>
         </div>
       </div>
  );
  
  if (view === AppState.YEAR_SELECT) return (
       <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
         <button onClick={()=>navigateTo(AppState.LEVEL_SELECT, {auth: selectedAuthority!})} className="mb-8">← Back</button>
         <h1 className="text-2xl font-bold mb-4">Select Year</h1>
         <div className="space-y-2 w-full max-w-md">
             {ACADEMIC_YEARS.slice().reverse().map(y => (
                 <button key={y} onClick={()=>handleYearSelect(y)} className="w-full p-4 bg-white rounded shadow hover:bg-blue-50 text-left font-bold">{y} Exam</button>
             ))}
         </div>
       </div>
  );

  if (view === AppState.SUBJECT_SELECT) return (
        <div className="min-h-screen bg-gray-50 p-6">
            <button onClick={() => navigateTo(AppState.YEAR_SELECT, { auth: selectedAuthority!, level: selectedLevel! })} className="mb-6">← Back</button>
            <h1 className="text-3xl font-bold mb-6">Select Subject</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {EXAM_HIERARCHY[selectedAuthority!][selectedLevel!].map(key => (
                     <button key={key} onClick={() => handleSubjectSelect(key)} className="p-5 border rounded bg-white hover:shadow-lg font-bold capitalize">
                         {SUBJECT_CONFIG[key]?.label || key}
                     </button>
                ))}
            </div>
        </div>
  );

  if (view === AppState.EXAM_OVERVIEW && activeExam === null) {
      const exam = getExam(selectedYear, selectedSubjectKey);
      if(!exam) return <div className="p-10 text-center">Exam Not Found</div>;
      
      return (
          <div className="p-8 max-w-2xl mx-auto text-center mt-10">
              <h1 className="text-3xl font-bold mb-2">{exam.subject} ({exam.year})</h1>
              <p className="mb-8 text-gray-600">{exam.questions.length} Questions • {exam.durationMinutes} Minutes</p>
              {currentStudent?.subscriptionPlan === 'FREE' && (
                  <div className="bg-orange-50 p-4 mb-6 rounded border border-orange-200 text-orange-800 text-sm">
                      ⚠️ Free Plan: You will receive 5 random questions. Upgrade for full access.
                  </div>
              )}
              <button onClick={startExam} className="px-10 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg">Start Exam</button>
          </div>
      );
  }

  // ... (Exam Active & Results views logic identical to original, ensuring async saveResult is awaited in handleSubmit)
  if (view === AppState.RESULTS && results) {
       return (
          <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
              <div className="bg-white p-8 rounded-xl shadow-lg border text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2 text-slate-800">Exam Results</h2>
                  <div className={`text-6xl font-black mb-2`}>{results.grade}</div>
                  <p className="text-xl text-gray-600 font-mono">{Math.round(results.score)} / {results.maxScore} Marks</p>
                  <button onClick={() => navigateTo(AppState.HOME)} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded">Back Home</button>
              </div>
          </div>
       );
  }
  
  if (view === AppState.EXAM_ACTIVE && activeExam) {
       const question = activeExam.questions[currentQuestionIndex];
       if(isGrading) return <div className="h-screen flex items-center justify-center">Grading... {gradingProgress}%</div>;
       return (
           <div className="flex flex-col h-screen bg-gray-50">
               <div className="bg-white p-4 flex justify-between items-center shadow">
                   <span className="font-bold">{activeExam.subject}</span>
                   <span className="text-red-600 font-mono">{formatTime(timeLeft)}</span>
               </div>
               <div className="flex-1 p-6 overflow-y-auto">
                   <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow" dir={activeExam.direction}>
                        <h2 className="text-xl mb-4 font-bold">{currentQuestionIndex+1}. <FormattedText text={question.text} /></h2>
                        {question.diagramUrl && <ExamImage src={Array.isArray(question.diagramUrl) ? question.diagramUrl[0] : question.diagramUrl} alt="Diagram" />}
                        {question.type === 'mcq' ? (
                            <div className="space-y-2">
                                {question.options?.map(opt => (
                                    <button key={opt} onClick={()=>handleAnswer(opt)} className={`w-full text-left p-3 border rounded ${answers.find(a=>a.questionId===question.id)?.answer === opt ? 'bg-blue-100 border-blue-500' : ''}`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <textarea className="w-full border p-2 rounded h-32" onChange={e=>handleAnswer(e.target.value)} value={answers.find(a=>a.questionId===question.id)?.answer || ''} />
                        )}
                   </div>
               </div>
               <div className="p-4 bg-white border-t flex justify-between">
                   <button onClick={()=>setCurrentQuestionIndex(i=>Math.max(0,i-1))} disabled={currentQuestionIndex===0} className="px-4 py-2 bg-gray-200 rounded">Prev</button>
                   {currentQuestionIndex === activeExam.questions.length-1 ? (
                       <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
                   ) : (
                       <button onClick={()=>setCurrentQuestionIndex(i=>Math.min(activeExam.questions.length-1,i+1))} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>
                   )}
               </div>
           </div>
       );
  }

  return <div>View Not Found</div>;
};

function calculateGrade(score: number, max: number): string {
  const percentage = (score / max) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 75) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

export default App;
