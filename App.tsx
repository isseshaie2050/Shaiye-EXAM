
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, UserAnswer, Exam, ExamResult, ExamAuthority, EducationLevel, Student, UserRole } from './types';
import { ACADEMIC_YEARS, SUBJECT_CONFIG, EXAM_HIERARCHY } from './constants';
import { gradeBatch, formatFeedback } from './services/geminiService';
import { saveExamResult, getStudentExamHistory, logoutUser, validateCurrentSession, verifyAdminCredentials, logUserIn } from './services/storageService';
import { getExam, getAvailableYears } from './services/examService';
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

// Component to handle image loading and errors
const ExamImage: React.FC<{ src: string, alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError) return null;

  return (
    <img 
      src={src} 
      alt={alt} 
      className="max-w-full h-auto mb-4 rounded border border-gray-200" 
      onError={() => setHasError(true)}
      loading="eager"
    />
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.HOME);
  const viewRef = useRef<AppState>(AppState.HOME); // Ref to track view inside callbacks

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
  const [timeTaken, setTimeTaken] = useState(0);
  const [results, setResults] = useState<{ score: number, maxScore: number, feedback: any[], sectionScores: Record<string, {score: number, total: number}> } | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [gradingProgress, setGradingProgress] = useState(0);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examHistory, setExamHistory] = useState<ExamResult[]>([]);
  
  const [isPaused, setIsPaused] = useState(false);

  // Admin Login State
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // Keep viewRef in sync
  useEffect(() => { viewRef.current = view; }, [view]);

  // --- ROUTING ENGINE ---

  const buildUrl = (targetView: AppState, params?: { auth?: ExamAuthority, level?: EducationLevel, year?: number, subject?: string }) => {
      let url = '/';
      if (targetView === AppState.DASHBOARD) url = '/dashboard';
      else if (targetView === AppState.STUDENT_AUTH) url = '/login';
      else if (targetView === AppState.ADMIN_LOGIN) url = '/admin/login';
      else if (targetView === AppState.ADMIN_PANEL) url = '/admin/panel';
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
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p !== '');

    if (parts.length === 0) {
        setView(AppState.HOME);
        return;
    }

    const root = parts[0];

    if (root === 'dashboard') { setView(AppState.DASHBOARD); return; }
    if (root === 'login') { setView(AppState.STUDENT_AUTH); return; }
    if (root === 'about') { setView(AppState.ABOUT); return; }
    if (root === 'privacy') { setView(AppState.PRIVACY); return; }
    if (root === 'contact') { setView(AppState.CONTACT); return; }
    if (root === 'admin') {
        if (parts[1] === 'panel') setView(AppState.ADMIN_PANEL);
        else setView(AppState.ADMIN_LOGIN);
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
          // GUARD: Active Exam
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


  // Initial Load: Check for student/admin session
  useEffect(() => {
    const { user, role } = validateCurrentSession();
    if (user && role) {
      setCurrentStudent(user);
      setCurrentUserRole(role);
      // If admin, redirect to panel if not already there
      if (role === 'admin' && window.location.pathname === '/admin/login') {
         navigateTo(AppState.ADMIN_PANEL);
      }
    } else {
      logoutUser();
      setCurrentStudent(null);
      setCurrentUserRole(null);
    }
  }, [navigateTo]);

  // --- SESSION WATCHDOG ---
  useEffect(() => {
    // Periodically check if the session is still valid (Single Device + Idle Timeout)
    if (!currentStudent) return;

    const interval = setInterval(() => {
       const { user, role } = validateCurrentSession();
       if (!user) {
           // Session killed remotely or expired
           alert("Kalfadhigaaga waa la joojiyay sabab amni dartii ama waqti dheer oo aadan isticmaalin.");
           handleLogout();
           clearInterval(interval);
       }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [currentStudent]);


  // --- BRANDING: DYNAMIC BROWSER TITLES ---
  useEffect(() => {
    let title = "Naajix";
    switch (view) {
      case AppState.HOME:
        title = "Naajix | Home";
        break;
      case AppState.LEVEL_SELECT:
        title = selectedAuthority === 'SOMALI_GOV' ? "Naajix | Somali Government Exams" : "Naajix | Puntland State Exams";
        break;
      case AppState.YEAR_SELECT:
      case AppState.SUBJECT_SELECT:
        title = selectedLevel === 'FORM_IV' ? "Naajix | Form IV" : "Naajix | Standard 8";
        break;
      case AppState.EXAM_OVERVIEW:
      case AppState.EXAM_ACTIVE:
        title = activeExam ? `Naajix | ${activeExam.subject}` : "Naajix | Exam";
        break;
      case AppState.RESULTS:
        title = "Naajix | Exam Results";
        break;
      case AppState.DASHBOARD:
        title = "Naajix | Student Dashboard";
        break;
      case AppState.ADMIN_LOGIN:
      case AppState.ADMIN_PANEL:
        title = "Naajix | Admin Panel";
        break;
      case AppState.ABOUT:
        title = "Naajix | About Us";
        break;
      case AppState.PRIVACY:
        title = "Naajix | Privacy Policy";
        break;
      case AppState.CONTACT:
        title = "Naajix | Contact Us";
        break;
      case AppState.STUDENT_AUTH:
        title = "Naajix | Student Login";
        break;
      default:
        title = "Naajix";
    }
    document.title = title;
  }, [view, selectedAuthority, selectedLevel, activeExam]);

  useEffect(() => {
    if (currentStudent && currentUserRole === 'student') {
       setExamHistory(getStudentExamHistory(currentStudent.id));
    } else {
       setExamHistory([]);
    }
  }, [view, currentStudent, currentUserRole]);

  // Preload images when exam starts
  useEffect(() => {
    if (activeExam) {
      activeExam.questions.forEach((q) => {
        if (q.diagramUrl) {
          const urls = Array.isArray(q.diagramUrl) ? q.diagramUrl : [q.diagramUrl];
          urls.forEach((url) => {
            const img = new Image();
            img.src = url;
          });
        }
      });
    }
  }, [activeExam]);

  const handleSubmit = useCallback(async () => {
    if (!activeExam || !currentStudent) return;

    setIsGrading(true);
    setGradingProgress(0); // Reset progress
    setIsPaused(true);
    setTimeTaken((activeExam.durationMinutes * 60) - timeLeft);

    let totalScore = 0;
    const maxScore = activeExam.questions.reduce((sum, q) => sum + q.marks, 0);
    const feedbackList: any[] = [];
    const sectionScores: Record<string, { score: number, total: number }> = {};

    activeExam.questions.forEach(q => {
      if (!sectionScores[q.section]) {
        sectionScores[q.section] = { score: 0, total: 0 };
      }
      sectionScores[q.section].total += q.marks;
    });

    try {
      const mcqQuestions = activeExam.questions.filter(q => q.type === 'mcq');
      const textQuestions = activeExam.questions.filter(q => q.type !== 'mcq');
      const totalQuestionsCount = activeExam.questions.length;
      
      // 2. Grade MCQs locally (Instant)
      mcqQuestions.forEach(q => {
        const userAnswer = answers.find(a => a.questionId === q.id)?.answer || '';
        const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        const score = isCorrect ? q.marks : 0;
        
        const status = isCorrect ? (activeExam.language === 'somali' ? "✅ **Sax**" : "✅ **Correct**") : (activeExam.language === 'somali' ? "❌ **Qalad**" : "❌ **Incorrect**");
        const fbText = `${status}`;

        feedbackList.push({
          questionId: q.id,
          score,
          feedback: fbText,
          userAnswer,
          question: q
        });
        totalScore += score;
        sectionScores[q.section].score += score;
      });

      // Update progress after MCQs
      let processedCount = mcqQuestions.length;
      setGradingProgress(Math.round((processedCount / totalQuestionsCount) * 100));

      // 3. Prepare Text Questions for Batch Grading
      const textItemsToGrade = textQuestions
        .map(q => ({
          question: q,
          userAnswer: answers.find(a => a.questionId === q.id)?.answer || ''
        }))
        .filter(item => item.userAnswer.trim().length > 0);

      // Handle empty text answers immediately
      textQuestions.forEach(q => {
        const userAnswer = answers.find(a => a.questionId === q.id)?.answer || '';
        if (userAnswer.trim().length === 0) {
           const fbText = formatFeedback(q, 0, "No answer provided.", activeExam.language);
           feedbackList.push({
             questionId: q.id,
             score: 0,
             feedback: fbText,
             userAnswer: '',
             question: q
           });
           processedCount++;
        }
      });
      
      setGradingProgress(Math.round((processedCount / totalQuestionsCount) * 100));

      // 4. Call Batch API
      if (textItemsToGrade.length > 0) {
        const batchResults = await gradeBatch(
          textItemsToGrade, 
          activeExam.language,
          (completedBatchItems, totalBatchItems) => {
             // Calculate overall progress including MCQs and already processed items
             const currentTotal = processedCount + completedBatchItems;
             setGradingProgress(Math.round((currentTotal / totalQuestionsCount) * 100));
          }
        );
        
        textItemsToGrade.forEach(item => {
          const result = batchResults[item.question.id] || { score: 0, feedback: "Grading unavailable." };
          const fbText = formatFeedback(item.question, result.score, result.feedback, activeExam.language);
          
          feedbackList.push({
            questionId: item.question.id,
            score: result.score,
            feedback: fbText,
            userAnswer: item.userAnswer,
            question: item.question
          });
          
          totalScore += result.score;
          sectionScores[item.question.section].score += result.score;
        });
      }

      // Final progress update
      setGradingProgress(100);

      // Sort feedback
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

      saveExamResult(finalResult);
      setResults({ score: totalScore, maxScore, feedback: feedbackList, sectionScores });
      navigateTo(AppState.RESULTS);

    } catch (e) {
      console.error("Grading failed", e);
      alert("Error submitting exam. Please try again.");
    } finally {
      setIsGrading(false);
      setShowSubmitModal(false);
    }
  }, [activeExam, answers, timeLeft, currentStudent, navigateTo]);

  useEffect(() => {
    let timer: any;
    if (view === AppState.EXAM_ACTIVE && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (view === AppState.EXAM_ACTIVE && timeLeft === 0) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [view, timeLeft, isPaused, handleSubmit]);


  // --- NAVIGATION HANDLERS ---
  const handleAuthoritySelect = (authority: ExamAuthority) => {
      // Check Auth
      if (!currentStudent) {
         navigateTo(AppState.STUDENT_AUTH);
         return;
      }
      
      // CHECK SUBSCRIPTION ACCESS
      if (currentStudent.subscriptionPlan === 'BASIC') {
          // If basic user tries to access an authority they didn't select
          if (currentStudent.basicAuthority && currentStudent.basicAuthority !== authority) {
              alert(`Your Basic Plan only includes access to ${currentStudent.basicAuthority === 'SOMALI_GOV' ? 'Somali Gov' : 'Puntland'} exams. Please upgrade to Premium for full access.`);
              return; 
          }
      }
      
      // Use navigateTo instead of setView + setSelectedAuthority
      navigateTo(AppState.LEVEL_SELECT, { auth: authority });
  };

  const handleLevelSelect = (level: EducationLevel) => {
      navigateTo(AppState.YEAR_SELECT, { auth: selectedAuthority!, level: level });
  };

  const handleYearSelect = (year: number) => {
      navigateTo(AppState.SUBJECT_SELECT, { auth: selectedAuthority!, level: selectedLevel!, year: year });
  };

  const handleSubjectSelect = (subjectKey: string) => {
    navigateTo(AppState.EXAM_OVERVIEW, { auth: selectedAuthority!, level: selectedLevel!, year: selectedYear!, subject: subjectKey });
  };

  const startExam = () => {
    if (!currentStudent) {
        navigateTo(AppState.STUDENT_AUTH);
        return;
    }

    const examTemplate = getExam(selectedYear, selectedSubjectKey);
    
    if (!examTemplate) {
        alert("Exam not found for the selected year and subject.");
        return;
    }

    // --- SUBSCRIPTION LOGIC: LIMIT QUESTIONS ---
    let questionsToUse = examTemplate.questions;
    
    // Always shuffle first
    questionsToUse = shuffleArray([...questionsToUse]).map(q => {
        if (q.type === 'mcq' && q.options) {
            return { ...q, options: shuffleArray([...q.options]) };
        }
        return q;
    });

    if (currentStudent.subscriptionPlan === 'FREE') {
        // FREE: Limit to 5 random questions
        questionsToUse = questionsToUse.slice(0, 5);
    }

    const newExamInstance = { ...examTemplate, questions: questionsToUse };
    
    setActiveExam(newExamInstance);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    
    // Adjust time if truncated
    const timePerQ = examTemplate.durationMinutes / examTemplate.questions.length;
    const adjustedTime = Math.ceil(timePerQ * questionsToUse.length);
    setTimeLeft(adjustedTime * 60);

    setShowSubmitModal(false);
    setIsPaused(false);
    navigateTo(AppState.EXAM_ACTIVE, { auth: selectedAuthority!, level: selectedLevel!, year: selectedYear!, subject: selectedSubjectKey! });
  };

  const handleAnswer = (answer: string) => {
      if (!activeExam) return;
      const currentQ = activeExam.questions[currentQuestionIndex];
      
      setAnswers(prev => {
          const existing = prev.filter(a => a.questionId !== currentQ.id);
          return [...existing, { questionId: currentQ.id, answer }];
      });
  };
  
  const handleAdminLogin = () => {
      if (verifyAdminCredentials(adminUser, adminPass)) {
          // Log Admin In (Session Tracking)
          logUserIn({ id: 'admin-001', fullName: 'System Admin' } as Student, 'admin', 'password');
          setCurrentStudent({ id: 'admin-001', fullName: 'System Admin' } as Student);
          setCurrentUserRole('admin');
          navigateTo(AppState.ADMIN_PANEL);
          setAdminUser('');
          setAdminPass('');
      } else {
          alert('Invalid Admin Credentials');
      }
  };
  
  const handleNavigateToDashboard = () => {
      if (currentStudent && currentUserRole === 'student') {
          navigateTo(AppState.DASHBOARD);
      } else {
          navigateTo(AppState.STUDENT_AUTH);
      }
  };
  
  const handleLogout = () => {
      logoutUser();
      setCurrentStudent(null);
      setCurrentUserRole(null);
      navigateTo(AppState.HOME);
      alert("Waad ka baxday akoonkaaga si nabad ah");
  };

  // --- 1. LANDING PAGE ---
  if (view === AppState.HOME) {
    return <LandingPage onSelectAuthority={handleAuthoritySelect} onNavigate={(target) => {
        if(target === AppState.DASHBOARD) {
            handleNavigateToDashboard();
        } else {
            navigateTo(target);
        }
    }} />;
  }
  
  // --- AUTH ---
  if (view === AppState.STUDENT_AUTH) {
      return (
        <StudentAuth 
            onLoginSuccess={(student) => {
                setCurrentStudent(student);
                setCurrentUserRole('student');
                navigateTo(AppState.HOME);
            }} 
            onCancel={() => navigateTo(AppState.HOME)}
        />
      );
  }
  
  // --- INFO PAGES ---
  if (view === AppState.ABOUT) {
    return <AboutPage onBack={() => navigateTo(AppState.HOME)} />;
  }
  
  if (view === AppState.PRIVACY) {
    return <PrivacyPage onBack={() => navigateTo(AppState.HOME)} />;
  }
  
  if (view === AppState.CONTACT) {
    return <ContactPage onBack={() => navigateTo(AppState.HOME)} />;
  }
  
  // --- STUDENT DASHBOARD ---
  if (view === AppState.DASHBOARD) {
      return <StudentDashboard onBack={() => navigateTo(AppState.HOME)} />;
  }

  // --- ADMIN LOGIN ---
  if (view === AppState.ADMIN_LOGIN) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
              <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                  <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-slate-900">Admin Portal</h2>
                      <p className="text-slate-500">Secure Access Only</p>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                          <input 
                            type="text" 
                            value={adminUser}
                            onChange={(e) => setAdminUser(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="username"
                        />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                          <input 
                             type="password" 
                            value={adminPass}
                            onChange={(e) => setAdminPass(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="••••••••"
                        />
                      </div>
                      <button 
                        onClick={handleAdminLogin}
                        className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow-lg"
                      >
                          Login to Admin Panel
                      </button>
                      <button 
                        onClick={() => navigateTo(AppState.HOME)}
                        className="w-full py-3 text-slate-500 hover:text-slate-700 transition"
                      >
                          Cancel
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // --- ADMIN PANEL ---
  if (view === AppState.ADMIN_PANEL) {
      return <AdminPanel onLogout={handleLogout} />;
  }

  // --- 2. LEVEL SELECTION (Std 8 vs Form IV) ---
  if (view === AppState.LEVEL_SELECT) {
      return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <button onClick={() => navigateTo(AppState.HOME)} className="mb-8 text-blue-600 hover:underline flex items-center gap-1">
                    ← Back to Authority
                </button>
                <div className="mb-6 text-center">
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">Logged in as: {currentStudent?.fullName}</span>
                    <div className="mt-2">
                       <span className={`text-xs font-bold px-2 py-1 rounded uppercase text-white ${currentStudent?.subscriptionPlan === 'PREMIUM' ? 'bg-purple-600' : currentStudent?.subscriptionPlan === 'BASIC' ? 'bg-blue-600' : 'bg-slate-400'}`}>
                           {currentStudent?.subscriptionPlan} Plan
                       </span>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">Dooro Heerka Waxbarashada</h1>
                <p className="text-center text-slate-500 mb-10">Select Education Level for {selectedAuthority === 'SOMALI_GOV' ? 'Somali Federal Govt' : 'Puntland State'}</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div 
                        onClick={() => handleLevelSelect('STD_8')}
                        className="bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-blue-500 cursor-pointer transition transform hover:-translate-y-1 group"
                    >
                        <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">🏫</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Standard 8</h2>
                        <p className="text-slate-500 mb-6">Dugsiga Dhexe (Middle School)</p>
                        <button className="w-full py-3 bg-blue-50 text-blue-700 font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">Dooro</button>
                    </div>

                    <div 
                        onClick={() => handleLevelSelect('FORM_IV')}
                        className="bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-blue-500 cursor-pointer transition transform hover:-translate-y-1 group"
                    >
                        <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">🎓</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Form IV</h2>
                        <p className="text-slate-500 mb-6">Dugsiga Sare (Secondary School)</p>
                        <button className="w-full py-3 bg-blue-50 text-blue-700 font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">Dooro</button>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- 3. YEAR SELECTION ---
  if (view === AppState.YEAR_SELECT) {
    const availableYears = selectedSubjectKey 
        ? getAvailableYears(selectedSubjectKey, selectedAuthority!, selectedLevel!)
        : ACADEMIC_YEARS; // Fallback if subject not selected yet (though logic suggests flow order)

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center pt-20">
            <div className="max-w-lg w-full">
                <button onClick={() => navigateTo(AppState.LEVEL_SELECT, { auth: selectedAuthority! })} className="mb-8 text-blue-600 hover:underline">← Back to Levels</button>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Select Exam Year</h1>
                <p className="text-slate-500 mb-8">
                  {selectedAuthority === 'SOMALI_GOV' ? 'Somali Govt' : 'Puntland'} • {selectedLevel === 'FORM_IV' ? 'Form IV' : 'Standard 8'}
                </p>
                
                <div className="space-y-3">
                  {ACADEMIC_YEARS.slice().reverse().map(year => (
                      <button
                          key={year}
                          onClick={() => handleYearSelect(year)}
                          className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition text-left flex justify-between items-center shadow-sm group"
                      >
                          <span className="font-bold text-lg text-slate-700 group-hover:text-blue-800">{year} Exam</span>
                          <span className="text-gray-400 group-hover:text-blue-500">→</span>
                      </button>
                  ))}
                  {/* Note: The new dynamic system filters by year in getExam, but listing all academic years is generally safe as getExam handles missing data */}
                </div>
            </div>
        </div>
    );
  }

  // --- 4. SUBJECT SELECTION ---
  if (view === AppState.SUBJECT_SELECT) {
      const allowedSubjects = EXAM_HIERARCHY[selectedAuthority!][selectedLevel!];
      
      return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigateTo(AppState.YEAR_SELECT, { auth: selectedAuthority!, level: selectedLevel! })} className="text-blue-600 hover:underline">← Back to Years</button>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                        {selectedAuthority === 'SOMALI_GOV' ? 'Somali Govt' : 'Puntland'} • {selectedLevel === 'FORM_IV' ? 'Form IV' : 'Standard 8'} • {selectedYear}
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-8">Select Subject</h1>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allowedSubjects.map(key => {
                        const config = SUBJECT_CONFIG[key];
                        if (!config) return null;
                        return (
                            <button
                                key={key}
                                onClick={() => handleSubjectSelect(key)}
                                className="p-5 border rounded-xl hover:shadow-lg hover:border-blue-400 transition bg-white text-left flex flex-col justify-between group h-32"
                            >
                                <span className="font-bold text-lg text-slate-800 group-hover:text-blue-700">{config.label}</span>
                                <span className="text-xs text-gray-400 uppercase bg-gray-50 self-start px-2 py-1 rounded">{config.language.slice(0, 3)}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
      );
  }

  // --- 5. EXAM OVERVIEW ---
  if (view === AppState.EXAM_OVERVIEW) {
      // Fetch using key
      const exam = getExam(selectedYear, selectedSubjectKey);
      
      if (!exam) return (
        <div className="p-8 text-center mt-20">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Exam Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find the {selectedSubjectKey} exam for {selectedYear}.</p>
            <div className="flex justify-center gap-4">
                <button onClick={() => navigateTo(AppState.SUBJECT_SELECT, { auth: selectedAuthority!, level: selectedLevel!, year: selectedYear! })} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Back to Subjects</button>
                {/* Debug hint for demo purposes if static data is missing */}
            </div>
        </div>
      );
      
      // Calculate Question Count based on Plan
      const questionCount = currentStudent?.subscriptionPlan === 'FREE' ? 5 : exam.questions.length;
      const duration = currentStudent?.subscriptionPlan === 'FREE' 
         ? Math.ceil((exam.durationMinutes / exam.questions.length) * 5)
         : exam.durationMinutes;

      return (
          <div className="p-8 max-w-2xl mx-auto text-center mt-10">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">📝</div>
              <h1 className="text-3xl font-bold mb-2 text-slate-900">{exam.subject} ({exam.year})</h1>
              <p className="text-gray-600 mb-8 font-medium bg-gray-100 inline-block px-4 py-1 rounded-full">{questionCount} Questions • {duration} Minutes</p>
              
              {currentStudent?.subscriptionPlan === 'FREE' && (
                  <div className="bg-orange-50 p-4 mb-4 rounded border border-orange-200 text-sm text-orange-800 font-bold">
                      ⚠️ Free Plan: You will receive 5 random questions. Upgrade for full exam.
                  </div>
              )}

              <div className="bg-yellow-50 p-6 rounded-xl text-left mb-8 border border-yellow-100 shadow-sm">
                  <h3 className="font-bold mb-3 text-yellow-800 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Instructions
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-yellow-900">
                      <li>Read all questions carefully.</li>
                      <li>For multiple choice, select the best answer.</li>
                      <li>For written questions, type your answer in the box provided.</li>
                      <li>The exam will auto-submit when the timer reaches zero.</li>
                  </ul>
              </div>

              <button onClick={startExam} className="w-full sm:w-auto px-10 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg transition transform hover:-translate-y-0.5">
                  Start Exam
              </button>
              <br/>
              <button onClick={() => navigateTo(AppState.SUBJECT_SELECT, { auth: selectedAuthority!, level: selectedLevel!, year: selectedYear! })} className="mt-6 text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
          </div>
      );
  }

  // --- 6. EXAM RESULTS ---
  if (view === AppState.RESULTS && results) {
      return (
          <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
              <div className="bg-white p-8 rounded-xl shadow-lg border text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2 text-slate-800">Exam Results</h2>
                  <div className={`text-6xl font-black mb-2 ${results.score/results.maxScore >= 0.5 ? 'text-green-600' : 'text-red-600'}`}>{results.grade}</div>
                  <p className="text-xl text-gray-600 font-mono">{Math.round(results.score)} / {results.maxScore} Marks</p>
              </div>

              <div className="space-y-6">
                  {results.feedback.map((item, idx) => (
                      <div key={idx} className={`p-6 rounded-xl border shadow-sm bg-white ${item.score > 0 ? 'border-green-100' : 'border-red-100'}`}>
                          <div className="flex justify-between mb-4 items-center">
                              <span className="font-bold text-slate-700 bg-gray-100 px-3 py-1 rounded text-sm">Question {idx + 1}</span>
                              <span className={`font-mono text-sm font-bold px-2 py-1 rounded ${item.score > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.score}/{item.question.marks}</span>
                          </div>
                          
                          {/* Question Text */}
                          <div className={`mb-4 font-medium text-lg text-slate-900 leading-relaxed whitespace-pre-wrap ${activeExam?.direction === 'rtl' ? 'text-2xl font-serif text-right' : ''}`}>
                            <FormattedText text={item.question.text} />
                          </div>

                          {/* User Answer */}
                          <div className={`mb-4 p-3 rounded bg-gray-50 text-sm text-gray-700 border border-gray-100 ${activeExam?.direction === 'rtl' ? 'text-right' : ''}`}>
                            <span className="font-bold block text-xs text-gray-400 uppercase mb-1">Your Answer</span> 
                            {item.userAnswer || <i className="text-gray-400">(No Answer)</i>}
                          </div>

                          {/* Grading Feedback Section */}
                          <div className={`text-sm bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4 text-blue-900 ${activeExam?.direction === 'rtl' ? 'text-xl text-right font-serif' : ''}`}>
                             <p className="font-bold text-blue-400 text-xs mb-1 uppercase">Feedback</p>
                             <FormattedText text={item.feedback} />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Separated Model Answer Section */}
                            <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-green-900">
                                <p className="font-bold text-green-600 text-xs mb-2 uppercase">
                                    {activeExam?.language === 'somali' ? 'Jawaabta Saxda ah' : activeExam?.language === 'arabic' ? 'الإجابة النموذجية' : 'Model Answer'}
                                </p>
                                <div className={`${activeExam?.direction === 'rtl' ? 'text-xl font-serif text-right' : ''}`}>
                                    <FormattedText text={item.question.correctAnswer} />
                                </div>
                            </div>

                            {/* Separated Explanation Section */}
                            {item.question.explanation && (
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                    <p className="font-bold text-gray-500 text-xs mb-2 uppercase">
                                        {activeExam?.language === 'somali' ? 'Faahfaahin' : activeExam?.language === 'arabic' ? 'التفسير' : 'Explanation'}
                                    </p>
                                    <div className={`${activeExam?.direction === 'rtl' ? 'text-xl font-serif text-right' : ''}`}>
                                        <FormattedText text={item.question.explanation} />
                                    </div>
                                </div>
                            )}
                          </div>
                      </div>
                  ))}
              </div>

              <div className="mt-12 text-center pb-10">
                  <button onClick={() => navigateTo(AppState.HOME)} className="px-8 py-3 bg-blue-800 text-white rounded-lg font-bold hover:bg-blue-900 shadow-lg transition">Back to Exam Selection</button>
              </div>
          </div>
      );
  }

  // --- 7. ACTIVE EXAM ---
  if (view === AppState.EXAM_ACTIVE) {
      // Handle page reload or direct access when activeExam is null
      if (!activeExam) {
          // If we have params but no exam object (e.g. reload), try to reload it or fallback
          // Ideally we would reconstruct it, but random shuffling might be an issue.
          // For now, redirect to overview.
          // Using useEffect to avoid render-phase updates
          return (
             <div className="p-8 text-center mt-20">
                 <h2 className="text-xl font-bold mb-4">Exam Session Interrupted</h2>
                 <p className="mb-4">Please restart the exam from the overview page.</p>
                 <button onClick={() => navigateTo(AppState.EXAM_OVERVIEW, { auth: selectedAuthority!, level: selectedLevel!, year: selectedYear!, subject: selectedSubjectKey! })} className="px-6 py-2 bg-blue-600 text-white rounded">Go to Overview</button>
             </div>
          );
      }

      const question = activeExam.questions[currentQuestionIndex];
      const userAnswer = answers.find(a => a.questionId === question.id)?.answer || '';
      const hasAnswered = userAnswer.trim().length > 0;
      const isRtl = activeExam.direction === 'rtl';

      if (isGrading) {
          return (
              <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-8 text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">Grading Exam...</h2>
                  
                  {/* Progress Bar Container */}
                  <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
                    <div 
                        className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end" 
                        style={{ width: `${gradingProgress}%` }}
                    >
                    </div>
                  </div>
                  
                  <div className="text-xl font-bold text-blue-800 mb-2">{gradingProgress}%</div>
                  <p className="text-gray-500 text-sm">Processing results securely using Naajix AI.</p>
              </div>
          );
      }

      return (
          <div className="flex flex-col h-screen bg-gray-50">
              {/* Header */}
              <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center z-10 sticky top-0">
                  <div className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <span className="text-blue-900 font-black">Naajix</span>
                    <span className="text-gray-300">|</span>
                    {activeExam.subject}
                  </div>
                  <div className={`font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-blue-800'}`}>
                      {formatTime(timeLeft)}
                  </div>
                  <button 
                      onClick={() => {
                        if(confirm("Are you sure you want to quit? Your progress will be lost.")) {
                           setSelectedYear(null);
                           setSelectedSubjectKey(null);
                           setActiveExam(null);
                           setAnswers([]);
                           navigateTo(AppState.HOME);
                        }
                      }} 
                      className="px-4 py-1.5 bg-white text-red-600 rounded border border-red-200 hover:bg-red-50 font-bold text-sm transition"
                  >
                      Exit
                  </button>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                  <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-200 min-h-[500px] flex flex-col" dir={activeExam.direction}>
                      
                      {/* Section Header */}
                      <div className="mb-6 pb-4 border-b">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-500">{question.section}</span>
                          <div className="flex justify-between items-end mt-1">
                              <span className="text-sm text-gray-400">Question {currentQuestionIndex + 1} of {activeExam.questions.length}</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}</span>
                          </div>
                      </div>

                      {/* Section Image - New Feature */}
                      {activeExam.sectionImages && activeExam.sectionImages[question.section] && (
                          <div className="mb-6">
                              <ExamImage 
                                src={activeExam.sectionImages[question.section]} 
                                alt="Section Reference Image" 
                              />
                          </div>
                      )}

                      {/* Passage if any */}
                      {activeExam.sectionPassages && activeExam.sectionPassages[question.section] && (
                          <div className={`mb-6 p-5 bg-blue-50 border border-blue-100 rounded-lg leading-relaxed whitespace-pre-line text-slate-800 shadow-sm ${isRtl ? 'text-2xl font-serif leading-loose text-right' : 'text-sm'}`}>
                              {activeExam.sectionPassages[question.section]}
                          </div>
                      )}

                      {/* Question */}
                      <h2 className={`font-medium mb-6 whitespace-pre-wrap text-slate-900 ${isRtl ? 'text-3xl leading-loose font-serif' : 'text-xl leading-relaxed'}`}>
                        <FormattedText text={question.text} />
                      </h2>
                      
                      {/* Diagram(s) */}
                      {question.diagramUrl && (
                          <div className="mb-6">
                              {Array.isArray(question.diagramUrl) ? (
                                  question.diagramUrl.map((url, index) => (
                                      <ExamImage 
                                        key={index} 
                                        src={url} 
                                        alt={`Diagram ${index + 1}`} 
                                      />
                                  ))
                              ) : (
                                  <ExamImage 
                                    src={question.diagramUrl} 
                                    alt="Diagram" 
                                  />
                              )}
                          </div>
                      )}

                      {/* Inputs */}
                      <div className="mt-4 flex-1">
                          {question.type === 'mcq' && question.options ? (
                              <div className="space-y-3">
                                  {question.options.map((opt, i) => (
                                      <label key={i} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${userAnswer === opt ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm' : 'hover:bg-gray-50 border-gray-200'}`}>
                                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${userAnswer === opt ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                                            {userAnswer === opt && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                          </div>
                                          <input 
                                              type="radio" 
                                              name={`q-${question.id}`} 
                                              value={opt} 
                                              checked={userAnswer === opt}
                                              onChange={() => handleAnswer(opt)}
                                              className="hidden"
                                          />
                                          <span className={`text-slate-800 ${isRtl ? 'text-3xl font-serif' : 'text-base font-medium'}`}>{opt}</span>
                                      </label>
                                  ))}
                              </div>
                          ) : (
                              <textarea 
                                  className={`w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-sm ${isRtl ? 'text-2xl font-serif' : 'text-base'}`}
                                  placeholder={isRtl ? "اكتب إجابتك هنا..." : "Type your answer here..."}
                                  value={userAnswer}
                                  onChange={(e) => handleAnswer(e.target.value)}
                              />
                          )}
                      </div>
                  </div>
              </div>

              {/* Footer Nav */}
              <div className="bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                  <div className="max-w-3xl mx-auto flex justify-between items-center">
                      <button 
                          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                          disabled={currentQuestionIndex === 0}
                          className="px-6 py-2.5 rounded-lg font-medium text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                      >
                          Previous
                      </button>
                      
                      <div className="flex gap-2">
                          {currentQuestionIndex === activeExam.questions.length - 1 ? (
                              <button 
                                  onClick={() => setShowSubmitModal(true)} 
                                  disabled={!hasAnswered}
                                  className={`px-8 py-2.5 rounded-lg font-bold shadow-lg transition transform active:scale-95 ${!hasAnswered ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                              >
                                  Submit All
                              </button>
                          ) : (
                              <button 
                                  onClick={() => setCurrentQuestionIndex(prev => Math.min(activeExam.questions.length - 1, prev + 1))}
                                  disabled={!hasAnswered}
                                  className={`px-8 py-2.5 rounded-lg font-bold shadow-md transition transform active:scale-95 ${!hasAnswered ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                              >
                                  Next
                              </button>
                          )}
                      </div>
                  </div>
              </div>

              {/* Submit Modal */}
              {showSubmitModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
                      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all scale-100">
                          <h3 className="text-2xl font-bold mb-2 text-slate-800">Ready to Submit?</h3>
                          <p className="text-slate-600 mb-6">You have answered <span className="font-bold text-blue-600">{answers.length}</span> out of <span className="font-bold">{activeExam.questions.length}</span> questions.</p>
                          <div className="flex gap-3 justify-end">
                              <button onClick={() => setShowSubmitModal(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">Back</button>
                              <button onClick={handleSubmit} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md transition">Confirm Submit</button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  return <div>Loading...</div>;
};

function calculateGrade(score: number, max: number): string {
  const percentage = (score / max) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 80) return 'B+';
  if (percentage >= 75) return 'B';
  if (percentage >= 70) return 'B-';
  if (percentage >= 65) return 'C+';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

export default App;
