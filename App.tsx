
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, UserAnswer, Exam, ExamResult, ExamAuthority, EducationLevel, Student, UserRole, Question } from './types';
import { ACADEMIC_YEARS, SUBJECT_CONFIG, EXAM_HIERARCHY } from './constants';
import { gradeBatch, formatFeedback } from './services/geminiService';
import { saveExamResult, logoutUser, validateCurrentSession, verifyAdminCredentials, subscribeToSessionUpdates } from './services/storageService';
import { getExam, fetchDynamicExams } from './services/examService';
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

const calculateGrade = (score: number, maxScore: number): string => {
  if (maxScore === 0) return 'F';
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 80) return 'A-';
  if (percentage >= 75) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 65) return 'B-';
  if (percentage >= 60) return 'C+';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

// Component to render text with bold formatting by parsing **text**
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  // This regex captures the text inside **...**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
           // Render bold without the stars
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
  const [results, setResults] = useState<{ score: number, maxScore: number, feedback: any[], sectionScores: Record<string, {score: number, total: number}>, grade: string } | null>(null);
  
  // Grading State
  const [isGrading, setIsGrading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [gradingProgress, setGradingProgress] = useState(0);
  const [gradingMessage, setGradingMessage] = useState("Analyzing answers...");
  
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
            // 1. Validate Session FIRST to establish Auth context
            const sessionData = await validateCurrentSession();
            
            if (sessionData.user && sessionData.role) {
                setCurrentStudent(sessionData.user);
                setCurrentUserRole(sessionData.role);
            }

            // 2. Fetch exams. If rules require auth, this might fail initially for guests
            // but will be retried in the useEffect below once currentStudent is set.
            await fetchDynamicExams();
            
        } catch (e) {
            console.error("Initialization warning:", e);
        } finally {
            setLoadingApp(false);
        }
    };
    init();
  }, []);

  // --- RE-FETCH EXAMS ON LOGIN ---
  useEffect(() => {
      if (currentStudent) {
          // When user authenticates, fetch the cloud exams which might be protected by Firestore rules
          // This fixes the issue where exams entered via Admin Panel are invisible to users
          fetchDynamicExams().catch(e => console.error("Background fetch failed", e));
      }
  }, [currentStudent]);

  // --- SESSION MONITORING (Single Device Enforcement) ---
  useEffect(() => {
      let unsubscribe: (() => void) | undefined;
      
      if (currentStudent && !globalError) {
          unsubscribe = subscribeToSessionUpdates(currentStudent.id, () => {
              setGlobalError({
                  title: "Device Switch Detected",
                  msg: "A new login was detected on another device. To protect your account security, this session has been paused.",
                  fix: "Continue here (Log out other device)"
              });
              setCurrentStudent(null);
          });
      }

      return () => {
          if (unsubscribe) unsubscribe();
      };
  }, [currentStudent, globalError]);

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
      
      // Update State immediately for responsiveness
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
        // Important: clear selections when going home
        setSelectedAuthority(null);
        setSelectedLevel(null);
        setSelectedYear(null);
        setSelectedSubjectKey(null);
        return;
    }

    const root = parts[0];

    if (root === 'dashboard') { setView(AppState.DASHBOARD); return; }
    if (root === 'login') { setView(AppState.STUDENT_AUTH); return; }
    if (root === 'about') { setView(AppState.ABOUT); return; }
    if (root === 'privacy') { setView(AppState.PRIVACY); return; }
    if (root === 'contact') { setView(AppState.CONTACT); return; }
    if (root === 'results') { setView(AppState.RESULTS); return; }
    
    // Explicit Admin Routing
    if (root === 'adminpanel') {
        if (parts.length > 1 && parts[1] === 'login') setView(AppState.ADMIN_LOGIN);
        else setView(AppState.ADMIN_PANEL);
        return;
    }

    // Exam Path Routing: /exams/[auth]/[level]/[year]/[subject]/[mode]
    if (root === 'exams') {
        const authParam = parts[1]?.toUpperCase() as ExamAuthority;
        const levelParam = parts[2]?.toUpperCase() as EducationLevel;
        const yearParam = parts[3] ? parseInt(parts[3]) : null;
        const subjectParam = parts[4] || null;
        const modeParam = parts[5] || null;

        // Validations to ensure we don't end up on blank pages
        const validAuth = authParam === 'SOMALI_GOV' || authParam === 'PUNTLAND';
        const validLevel = levelParam === 'FORM_IV' || levelParam === 'STD_8';
        
        // --- NAVIGATION STATE LOGIC ---
        // We set the state based on URL depth. Crucially, if a parameter is missing in the URL,
        // we MUST set the state to null to ensure the View renders correctly.
        
        setSelectedAuthority(validAuth ? authParam : null);
        
        // Depth 1: Authority only
        if (validAuth && !levelParam) {
            setSelectedLevel(null); setSelectedYear(null); setSelectedSubjectKey(null);
            setView(AppState.LEVEL_SELECT);
            return;
        }

        setSelectedLevel(validLevel ? levelParam : null);

        // Depth 2: Authority + Level
        if (validAuth && validLevel && !yearParam) {
            setSelectedYear(null); setSelectedSubjectKey(null);
            setView(AppState.YEAR_SELECT);
            return;
        }

        setSelectedYear(yearParam);

        // Depth 3: Auth + Level + Year
        if (validAuth && validLevel && yearParam && !subjectParam) {
            setSelectedSubjectKey(null);
            setView(AppState.SUBJECT_SELECT);
            return;
        }

        setSelectedSubjectKey(subjectParam);

        // Depth 4: Auth + Level + Year + Subject
        if (validAuth && validLevel && yearParam && subjectParam) {
            if (modeParam === 'take') {
                // Determine if we can really take the exam or need to load it
                if (!activeExam) {
                    // If refreshing on a /take URL, fallback to overview to load data
                    setView(AppState.EXAM_OVERVIEW);
                } else {
                    setView(AppState.EXAM_ACTIVE);
                }
            } else {
                setView(AppState.EXAM_OVERVIEW);
            }
            return;
        }
        
        // Fallback for weird URLs
        setView(AppState.HOME);
        return;
    }

    setView(AppState.HOME);
  }, [activeExam]);

  useEffect(() => {
      const handlePopState = (e: PopStateEvent) => {
          if (viewRef.current === AppState.EXAM_ACTIVE) {
              const confirmLeave = window.confirm("You are taking an exam. Leaving now will lose progress. Are you sure?");
              if (!confirmLeave) {
                  // User wants to STAY.
                   const examUrl = buildUrl(AppState.EXAM_ACTIVE, { 
                      auth: selectedAuthority!, 
                      level: selectedLevel!, 
                      year: selectedYear!, 
                      subject: selectedSubjectKey! 
                  });
                  window.history.pushState(null, '', examUrl);
                  return; 
              } else {
                  // User wants to LEAVE. Clean up active exam state.
                  setAnswers([]);
                  setTimeLeft(0);
                  setActiveExam(null);
                  // Allow syncStateFromUrl to handle the rest
              }
          }
          syncStateFromUrl();
      };

      window.addEventListener('popstate', handlePopState);
      syncStateFromUrl(); // Initial sync
      return () => window.removeEventListener('popstate', handlePopState);
  }, [syncStateFromUrl, selectedAuthority, selectedLevel, selectedYear, selectedSubjectKey]);


  // --- SECURITY: ADMIN GATE ---
  useEffect(() => {
      if (!loadingApp && view === AppState.ADMIN_PANEL) {
          if (!currentStudent) {
              navigateTo(AppState.ADMIN_LOGIN);
          } else if (currentUserRole !== 'admin') {
              // Redirect to login if user is not admin
              navigateTo(AppState.ADMIN_LOGIN);
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
      case AppState.RESULTS: title = "Naajix | Results"; break;
      default: title = "Naajix";
    }
    document.title = title;
  }, [view, activeExam]);

  const handleSubmit = useCallback(async () => {
    if (!activeExam || !currentStudent) {
      alert("Session expired. Please log in to save results.");
      navigateTo(AppState.STUDENT_AUTH);
      return;
    }

    setIsGrading(true);
    setGradingProgress(0);
    setGradingMessage("Connecting to AI Grader...");
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
        const status = isCorrect ? (activeExam.language === 'somali' ? "**Sax**" : "**Correct**") : (activeExam.language === 'somali' ? "**Qalad**" : "**Incorrect**");
        feedbackList.push({ 
            questionId: q.id, 
            score, 
            feedback: status, 
            userAnswer, 
            question: q 
        });
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
        setGradingMessage("Analyzing text responses...");
        const batchResults = await gradeBatch(textItemsToGrade, activeExam.language, (c, t) => {
             const currentTotal = processedCount + c;
             setGradingProgress(Math.round((currentTotal / totalQuestionsCount) * 100));
             // Cycle messages based on progress
             if (currentTotal / totalQuestionsCount > 0.8) setGradingMessage("Finalizing Results...");
             else if (currentTotal / totalQuestionsCount > 0.5) setGradingMessage("Comparing with Answer Key...");
        });
        
        textItemsToGrade.forEach(item => {
          const result = batchResults[item.question.id] || { score: 0, feedback: "Grading unavailable." };
          feedbackList.push({ questionId: item.question.id, score: result.score, feedback: formatFeedback(item.question, result.score, result.feedback, activeExam.language), userAnswer: item.userAnswer, question: item.question });
          totalScore += result.score;
          sectionScores[item.question.section].score += result.score;
        });
      }

      setGradingProgress(100);
      setGradingMessage("Saving Results...");
      feedbackList.sort((a, b) => {
        const idxA = activeExam.questions.findIndex(q => q.id === a.questionId);
        const idxB = activeExam.questions.findIndex(q => q.id === b.questionId);
        return idxA - idxB;
      });

      const finalGrade = calculateGrade(totalScore, maxScore);
      const finalResult: ExamResult = {
        id: `res-${Date.now()}`, 
        studentId: currentStudent.id, 
        studentName: currentStudent.fullName,
        examId: activeExam.id, 
        subject: activeExam.subject, 
        year: activeExam.year, 
        score: totalScore, 
        maxScore, 
        grade: finalGrade, 
        date: new Date().toISOString()
      };

      await saveExamResult(finalResult); 
      setResults({ score: totalScore, maxScore, feedback: feedbackList, sectionScores, grade: finalGrade });
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
      if (verifyAdminCredentials(adminUser, adminPass)) {
          // Identify the Super Admin
          const adminUserObj: Student = { 
              id: 'admin-super', 
              fullName: 'Super Admin', 
              email: 'isseshaie2050@gmail.com', 
              subscriptionPlan: 'PREMIUM',
              // Complete missing properties for Student type
              phone: '',
              school: 'System Admin',
              level: 'FORM_IV',
              registeredAt: new Date().toISOString(),
              authProvider: 'email',
              subscriptionStatus: 'active'
          };
          
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
      navigateTo(AppState.STUDENT_AUTH);
  };

  const handleExitExam = () => {
      if (window.confirm("⚠️ WARNING: You are about to cancel your exam.\n\nAll your progress will be lost and this attempt will not be saved. Are you sure you want to exit?")) {
          setActiveExam(null);
          setAnswers([]);
          setTimeLeft(0);
          navigateTo(AppState.DASHBOARD);
      }
  };
  
  // Navigation Handlers ...
  const handleAuthoritySelect = (auth: ExamAuthority) => { 
      if(!currentStudent) { 
          navigateTo(AppState.STUDENT_AUTH); 
          return; 
      }
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

    let questionsToUse: Question[] = [];

    if (currentStudent.subscriptionPlan === 'FREE') {
        // Free: Randomize order and take top 5
        questionsToUse = shuffleArray([...examTemplate.questions]).slice(0, 5);
    } else {
        // Basic/Premium: Keep original ASCENDING order (1, 2, 3...)
        questionsToUse = [...examTemplate.questions];
    }

    // Always shuffle options for MCQs to prevent position memorization (A, B, C, D)
    questionsToUse = questionsToUse.map(q => {
        if (q.type === 'mcq' && q.options) {
            return { ...q, options: shuffleArray([...q.options]) };
        }
        return q;
    });

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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 bg-blue-100 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 relative loading-ring mb-6">
                <img src="https://shaiyecompany.com/wp-content/uploads/2026/01/naajix-logo-5.png" alt="Naajix" className="w-full h-full object-contain rounded-full relative z-10" />
              </div>
              <h1 className="text-2xl font-black text-blue-900 tracking-tight animate-pulse">Naajix</h1>
              <p className="text-sm text-slate-500 font-medium mt-2">Preparing your exam environment...</p>
          </div>
      </div>
  );

  // --- GLOBAL ERROR MODAL (Friendly Session Warning) ---
  if (globalError) {
      return (
          <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{globalError.title}</h3>
                  <p className="text-slate-600 mb-6 font-medium leading-relaxed">{globalError.msg}</p>
                  <button onClick={() => { setGlobalError(null); setView(AppState.STUDENT_AUTH); }} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg">
                      {globalError.fix || "Login Again"}
                  </button>
              </div>
          </div>
      );
  }

  // --- VIEW RENDERING ---
  if (view === AppState.HOME) return <LandingPage student={currentStudent} onSelectAuthority={handleAuthoritySelect} onNavigate={(target) => { if(target===AppState.DASHBOARD) { if(currentStudent) navigateTo(AppState.DASHBOARD); else navigateTo(AppState.STUDENT_AUTH); } else navigateTo(target); }} />;
  if (view === AppState.STUDENT_AUTH) return <StudentAuth onLoginSuccess={(student) => { setCurrentStudent(student); setCurrentUserRole('student'); navigateTo(AppState.DASHBOARD); }} onCancel={() => navigateTo(AppState.HOME)} />;
  if (view === AppState.DASHBOARD) return <StudentDashboard onBack={() => { window.location.href = '/'; }} onLogout={() => { handleLogout(); navigateTo(AppState.STUDENT_AUTH); }} />;
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
  
  if (view === AppState.ABOUT) return <AboutPage onBack={() => navigateTo(AppState.HOME)} />;
  if (view === AppState.PRIVACY) return <PrivacyPage onBack={() => navigateTo(AppState.HOME)} />;
  if (view === AppState.CONTACT) return <ContactPage onBack={() => navigateTo(AppState.HOME)} />;
  
  if (view === AppState.LEVEL_SELECT) return (
       <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
         <button onClick={()=>navigateTo(AppState.HOME)} className="mb-8 font-bold text-slate-500 hover:text-blue-600">← Back to Home</button>
         <h1 className="text-2xl font-bold mb-8">Select Level</h1>
         <div className="grid md:grid-cols-2 gap-8">
             <div onClick={()=>handleLevelSelect('STD_8')} className="bg-white p-8 rounded-xl shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 transition text-center border border-gray-100">
                 <div className="text-4xl mb-4">📘</div>
                 <div className="font-black text-xl text-slate-800">Standard 8</div>
                 <div className="text-sm text-slate-500">Middle School</div>
             </div>
             <div onClick={()=>handleLevelSelect('FORM_IV')} className="bg-white p-8 rounded-xl shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 transition text-center border border-gray-100">
                 <div className="text-4xl mb-4">🎓</div>
                 <div className="font-black text-xl text-slate-800">Form IV</div>
                 <div className="text-sm text-slate-500">Secondary School</div>
             </div>
         </div>
       </div>
  );
  
  if (view === AppState.YEAR_SELECT) return (
       <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
         <button onClick={()=>navigateTo(AppState.LEVEL_SELECT, {auth: selectedAuthority!})} className="mb-8 font-bold text-slate-500 hover:text-blue-600">← Back to Levels</button>
         <h1 className="text-2xl font-bold mb-4">Select Year</h1>
         <div className="space-y-2 w-full max-w-md">
             {ACADEMIC_YEARS.slice().reverse().map(y => (
                 <button key={y} onClick={()=>handleYearSelect(y)} className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 text-left font-bold border border-gray-100 transition">
                     {y} Examination
                 </button>
             ))}
         </div>
       </div>
  );

  if (view === AppState.SUBJECT_SELECT) return (
        <div className="min-h-screen bg-gray-50 p-6">
            <button onClick={() => navigateTo(AppState.YEAR_SELECT, { auth: selectedAuthority!, level: selectedLevel! })} className="mb-6 font-bold text-slate-500 hover:text-blue-600">← Back to Years</button>
            <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">Select Subject</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {EXAM_HIERARCHY[selectedAuthority!][selectedLevel!].map(key => (
                     <button key={key} onClick={() => handleSubjectSelect(key)} className="p-6 border border-gray-100 rounded-xl bg-white hover:shadow-lg font-bold capitalize hover:bg-blue-50 transition flex flex-col items-center text-center">
                         <span className="text-sm text-slate-400 font-mono mb-2 uppercase">{selectedLevel === 'STD_8' ? 'Std 8' : 'Form 4'}</span>
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
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
              <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center border border-gray-100">
                  <div className="mb-6">
                     <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{selectedAuthority} • {selectedLevel}</span>
                  </div>
                  <h1 className="text-3xl font-black mb-2 text-slate-900">{exam.subject}</h1>
                  <h2 className="text-xl text-slate-500 font-bold mb-8">{exam.year} Examination</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-slate-50 rounded-lg">
                          <div className="text-2xl font-black text-slate-800">{exam.questions.length}</div>
                          <div className="text-xs text-slate-500 font-bold uppercase">Questions</div>
                      </div>
                       <div className="p-4 bg-slate-50 rounded-lg">
                          <div className="text-2xl font-black text-slate-800">{exam.durationMinutes}</div>
                          <div className="text-xs text-slate-500 font-bold uppercase">Minutes</div>
                      </div>
                  </div>

                  {currentStudent?.subscriptionPlan === 'FREE' && (
                      <div className="bg-orange-50 p-4 mb-6 rounded-lg border border-orange-200 text-orange-800 text-sm flex items-start gap-3 text-left">
                          <span className="text-xl">⚠️</span>
                          <div>
                              <strong>Free Plan Detected</strong>
                              <p className="mt-1">You will receive 5 random questions. Upgrade for full access.</p>
                          </div>
                      </div>
                  )}

                  <div className="space-y-3">
                      <button onClick={startExam} className="w-full px-10 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg hover:-translate-y-1 transition">
                          Start Exam
                      </button>
                      <button onClick={() => navigateTo(AppState.SUBJECT_SELECT, {auth: selectedAuthority!, level: selectedLevel!, year: selectedYear!})} className="w-full px-10 py-3 text-slate-500 font-bold hover:bg-gray-100 rounded-xl transition">
                          Cancel
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // --- RESULTS VIEW (Updated with Details) ---
  if (view === AppState.RESULTS && results) {
       return (
          <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
              <div className="bg-white p-8 rounded-xl shadow-lg border text-center mb-8 relative overflow-hidden">
                   {/* LOGO */}
                  <div className="flex justify-center mb-4">
                      <img src="https://shaiyecompany.com/wp-content/uploads/2026/01/naajix-logo-5.png" alt="Naajix" className="h-16 w-auto" />
                  </div>

                  <h2 className="text-2xl font-bold mb-2 text-slate-800">Exam Results</h2>
                  <div className={`text-6xl font-black mb-2 ${results.grade === 'F' ? 'text-red-600' : 'text-green-600'}`}>{results.grade}</div>
                  <p className="text-xl text-gray-600 font-mono">{Math.round(results.score)} / {results.maxScore} Marks</p>
              </div>

              {/* Specific Upgrade Banner for Free Users - TOP */}
              {currentStudent?.subscriptionPlan === 'FREE' && (
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl text-white shadow-2xl transform hover:scale-[1.02] transition-transform duration-300 border-2 border-yellow-400/50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-black text-yellow-300 mb-2 uppercase tracking-wide flex items-center justify-center md:justify-start gap-2">
                                <span>⚠️</span> Free Plan Limit Reached
                            </h3>
                            <p className="font-medium text-blue-100 text-lg">
                               Upgrade to unlock unlimited version of the exams and enter all exams without limit.
                            </p>
                        </div>
                        <button
                           onClick={() => navigateTo(AppState.DASHBOARD)}
                           className="whitespace-nowrap px-8 py-4 bg-yellow-400 text-blue-900 font-black rounded-lg hover:bg-yellow-300 transition shadow-lg text-lg flex items-center gap-2 animate-pulse"
                        >
                           <span>🚀</span> UPGRADE NOW
                        </button>
                    </div>
                </div>
              )}

              {/* Detailed Breakdown */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Detailed Analysis</h3>
                {results.feedback.map((item, idx) => (
                    <div key={idx} className={`p-6 rounded-lg border shadow-sm ${activeExam?.direction === 'rtl' ? 'text-right' : 'text-left'} ${item.score > 0 ? 'bg-white border-green-200' : 'bg-red-50 border-red-200'}`} dir={activeExam?.direction || 'ltr'}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-700">Question {idx + 1}</span>
                            <span className={`text-sm font-bold px-2 py-1 rounded ${item.score > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.score} / {item.question.marks} Marks
                            </span>
                        </div>
                        <p className="mb-4 text-slate-900 font-medium text-xl leading-relaxed"><FormattedText text={item.question.text} /></p>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                            <div className="bg-gray-50 p-4 rounded border border-gray-100">
                                <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Answer</span>
                                <span className={`text-lg font-black ${item.userAnswer ? "text-slate-900" : "text-gray-400 italic"}`}>
                                    {item.userAnswer || "No answer provided"}
                                </span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded border border-blue-100">
                                <span className="block text-xs font-bold text-blue-500 uppercase mb-1">Correct Answer</span>
                                <span className="text-lg font-black text-blue-900">{item.question.correctAnswer}</span>
                            </div>
                        </div>
                        
                        {/* 1. Official Explanation (from DB) */}
                         {item.question.explanation && (
                            <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-100">
                                <span className="block text-xs font-bold text-yellow-700 uppercase mb-1">Solution / Explanation</span>
                                <div className="text-slate-700 text-base">{item.question.explanation}</div>
                            </div>
                        )}

                        {/* 2. Naajix Evaluation (Renamed from AI Evaluation) */}
                        {item.feedback && (
                            <div className="mt-4 pt-4 border-t border-gray-200/50">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Naajix Evaluation</span>
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">AI Analysis</span>
                                </div>
                                <p className="text-xs text-slate-400 mb-3 italic">
                                    AI-powered feedback analyzing the accuracy and clarity of your response.
                                </p>
                                {/* Use FormattedText here to render bold markdown properly */}
                                <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-base">
                                    <FormattedText text={item.feedback} />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
              </div>

               {/* UPGRADE BUTTON FOR FREE USERS (BOTTOM) */}
               {currentStudent?.subscriptionPlan === 'FREE' && (
                  <div className="mt-10 mb-4 text-center">
                       <button
                           onClick={() => navigateTo(AppState.DASHBOARD)}
                           className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xl rounded-2xl hover:scale-105 transition-transform shadow-2xl animate-bounce"
                        >
                           ⭐ Unlock Full Exam Access (Upgrade) ⭐
                        </button>
                        <p className="mt-3 text-slate-500 text-sm">Get unlimited questions and advanced analytics.</p>
                  </div>
              )}

              <div className="text-center mt-8 pb-8 flex justify-center gap-4">
                 <button onClick={() => {
                     // Force refresh to clear state and go home
                     window.location.href = '/';
                 }} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg transition transform hover:-translate-y-1">Return to Dashboard</button>
              </div>
          </div>
       );
  }
  
  if (view === AppState.EXAM_ACTIVE && activeExam) {
       const question = activeExam.questions[currentQuestionIndex];
       const sectionPassage = activeExam.sectionPassages?.[question.section];
       
       // Calculate if current question is answered
       const currentAnswerEntry = answers.find(a => a.questionId === question.id);
       const isCurrentQuestionAnswered = currentAnswerEntry && currentAnswerEntry.answer.trim().length > 0;

       // Define dynamic font styles for readability
       const isArabic = activeExam.language === 'arabic';
       const questionClass = isArabic ? 'text-3xl leading-[1.8]' : 'text-2xl leading-relaxed';
       const passageClass = isArabic ? 'text-2xl leading-[2]' : 'text-lg leading-relaxed';
       const optionClass = isArabic ? 'text-2xl' : 'text-xl';
       const metadataClass = isArabic ? 'text-lg' : 'text-sm';

       // ANIMATED GRADING SCREEN
       if(isGrading) {
           return (
             <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <div className="w-24 h-24 mb-8 relative">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-600">
                        {gradingProgress}%
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2 animate-pulse">{gradingMessage}</h2>
                <p className="text-slate-500 max-w-md">Our AI is evaluating your answers and generating personalized feedback. This usually takes about 10-20 seconds.</p>
                <div className="mt-8 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-300 ease-out" style={{ width: `${gradingProgress}%` }}></div>
                </div>
             </div>
           );
       }

       return (
           <div className="flex flex-col h-screen bg-gray-50">
               <div className="bg-white p-4 flex justify-between items-center shadow sticky top-0 z-20">
                   <div className="flex items-center gap-4">
                       <span className="font-bold text-lg">{activeExam.subject}</span>
                       <span className={`font-mono font-bold text-xl ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>{formatTime(timeLeft)}</span>
                   </div>
                   <button 
                       onClick={handleExitExam} 
                       className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg border border-red-200 hover:bg-red-100 transition text-sm flex items-center gap-2"
                   >
                       <span>✕</span> Exit Exam
                   </button>
               </div>
               <div className="flex-1 p-6 overflow-y-auto">
                   <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100" dir={activeExam.direction}>
                        
                        {/* Persistent Reading Passage Display */}
                        {sectionPassage && (
                            <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg shadow-inner overflow-y-auto max-h-[400px]">
                                <div className="text-xs font-bold text-blue-500 uppercase mb-2 tracking-wide flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    Reading Passage
                                </div>
                                <div className={`text-slate-800 ${passageClass} whitespace-pre-wrap font-serif`}>
                                    <FormattedText text={sectionPassage} />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-6">
                             <span className={`${metadataClass} font-bold text-gray-400 uppercase tracking-wider`}>Question {currentQuestionIndex+1} of {activeExam.questions.length}</span>
                             <span className={`${metadataClass} font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded`}>{question.marks} Marks</span>
                        </div>
                        <h2 className={`${questionClass} mb-8 font-bold text-slate-800`}><FormattedText text={question.text} /></h2>
                        {question.diagramUrl && <ExamImage src={Array.isArray(question.diagramUrl) ? question.diagramUrl[0] : question.diagramUrl} alt="Diagram" />}
                        {question.type === 'mcq' ? (
                            <div className="space-y-4">
                                {question.options?.map((opt, idx) => (
                                    <button 
                                        key={idx} // Using Index as key to tolerate duplicate options without crashing
                                        onClick={()=>handleAnswer(opt)} 
                                        className={`w-full p-5 border rounded-lg transition-all ${activeExam.direction === 'rtl' ? 'text-right' : 'text-left'} ${optionClass} ${answers.find(a=>a.questionId===question.id)?.answer === opt ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm' : 'hover:bg-gray-50 border-gray-200'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <textarea 
                                className={`w-full border p-4 rounded-lg h-64 focus:ring-2 focus:ring-blue-500 outline-none ${optionClass}`} 
                                onChange={e=>handleAnswer(e.target.value)} 
                                value={answers.find(a=>a.questionId===question.id)?.answer || ''} 
                                placeholder="Type your answer here..."
                            />
                        )}
                   </div>
               </div>
               <div className="p-4 bg-white border-t flex justify-between items-center">
                   <button onClick={()=>setCurrentQuestionIndex(i=>Math.max(0,i-1))} disabled={currentQuestionIndex===0} className="px-6 py-2 bg-gray-100 text-slate-600 font-bold rounded-lg disabled:opacity-50 hover:bg-gray-200 transition">Previous</button>
                   
                   <div className="flex gap-2">
                       {/* Pagination Dots (Mobile hidden) */}
                       <div className="hidden md:flex gap-1 items-center">
                           {activeExam.questions.map((_, idx) => (
                               <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentQuestionIndex ? 'bg-blue-600' : answers.find(a=>a.questionId===activeExam.questions[idx].id) ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                           ))}
                       </div>
                   </div>

                   {currentQuestionIndex === activeExam.questions.length-1 ? (
                       <button 
                           onClick={handleSubmit} 
                           disabled={!isCurrentQuestionAnswered}
                           className={`px-6 py-2 font-bold rounded-lg shadow-lg transition ${!isCurrentQuestionAnswered ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                        >
                            Submit Exam
                        </button>
                   ) : (
                       <button 
                           onClick={()=>setCurrentQuestionIndex(i=>Math.min(activeExam.questions.length-1,i+1))} 
                           disabled={!isCurrentQuestionAnswered}
                           className={`px-6 py-2 font-bold rounded-lg transition ${!isCurrentQuestionAnswered ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            Next
                        </button>
                   )}
               </div>
           </div>
       );
  }

  return <div>View Not Found</div>;
};

export default App;
