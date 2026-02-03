
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, UserAnswer, Exam, ExamResult, ExamAuthority, EducationLevel, Student, UserRole, Question, SectionType } from './types';
import { ACADEMIC_YEARS, SUBJECT_CONFIG, EXAM_HIERARCHY } from './constants';
import { gradeBatch, formatFeedback } from './services/geminiService';
import { saveExamResult, logoutUser, validateCurrentSession, verifyAdminCredentials, subscribeToSessionUpdates } from './services/storageService';
import { getExam, fetchDynamicExams, getAvailableYears } from './services/examService';
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
  const [gradingProgress, setGradingProgress] = useState(0);
  const [gradingMessage, setGradingMessage] = useState("Analyzing answers...");
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Keep viewRef in sync
  useEffect(() => { viewRef.current = view; }, [view]);

  // --- APP INITIALIZATION ---
  useEffect(() => {
    const init = async () => {
        try {
            const sessionData = await validateCurrentSession();
            if (sessionData.user && sessionData.role) {
                setCurrentStudent(sessionData.user);
                setCurrentUserRole(sessionData.role);
            }
            await fetchDynamicExams();
        } catch (e) {
            console.error("Initialization error", e);
        } finally {
            setLoadingApp(false);
        }
    };
    init();
  }, []);

  // --- NAVIGATION HANDLERS ---
  
  const handleSelectAuthority = (authority: ExamAuthority) => {
      setSelectedAuthority(authority);
      setView(AppState.LEVEL_SELECT);
  };

  const handleLevelSelect = (level: EducationLevel) => {
      setSelectedLevel(level);
      setView(AppState.SUBJECT_SELECT);
  };

  const handleSubjectSelect = (subjectKey: string) => {
      setSelectedSubjectKey(subjectKey);
      setView(AppState.YEAR_SELECT);
  };

  const handleYearSelect = (year: number) => {
      setSelectedYear(year);
      startExam(year);
  };

  const startExam = (year: number) => {
      if (!selectedSubjectKey) return;
      const exam = getExam(year, selectedSubjectKey);
      if (exam) {
          // If free plan, limit questions
          let questionsToUse = exam.questions;
          if (currentStudent && currentStudent.subscriptionPlan === 'FREE') {
              questionsToUse = shuffleArray(exam.questions).slice(0, 5); // 5 random questions
          }

          setActiveExam({ ...exam, questions: questionsToUse });
          setAnswers([]);
          setResults(null);
          setTimeLeft(exam.durationMinutes * 60);
          setCurrentQuestionIndex(0);
          setView(AppState.EXAM_ACTIVE);
      } else {
          alert("Exam not found!");
      }
  };

  // --- EXAM LOGIC ---

  useEffect(() => {
      if (view === AppState.EXAM_ACTIVE && timeLeft > 0) {
          const timer = setInterval(() => {
              setTimeLeft(prev => {
                  if (prev <= 1) {
                      clearInterval(timer);
                      handleSubmitExam();
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
          return () => clearInterval(timer);
      }
  }, [view, timeLeft]);

  const handleAnswer = (questionId: string, answer: string) => {
      setAnswers(prev => {
          const existing = prev.findIndex(a => a.questionId === questionId);
          if (existing >= 0) {
              const newAnswers = [...prev];
              newAnswers[existing] = { questionId, answer };
              return newAnswers;
          }
          return [...prev, { questionId, answer }];
      });
  };

  const handleSubmitExam = async () => {
      if (!activeExam) return;
      
      setIsGrading(true);
      setGradingMessage("AI is reviewing your answers...");
      
      const itemsToGrade = activeExam.questions.map(q => ({
          question: q,
          userAnswer: answers.find(a => a.questionId === q.id)?.answer || ""
      }));

      // Grade using AI Service
      const gradedResults = await gradeBatch(itemsToGrade, activeExam.language || 'english', (completed, total) => {
          setGradingProgress(Math.round((completed / total) * 100));
      });

      let totalScore = 0;
      let maxTotalScore = 0;
      const sectionScores: Record<string, {score: number, total: number}> = {};
      const feedbackList: any[] = [];

      activeExam.questions.forEach(q => {
          const grade = gradedResults[q.id] || { score: 0, feedback: "Not graded" };
          
          totalScore += grade.score;
          maxTotalScore += q.marks;

          // Section stats
          if (!sectionScores[q.section]) sectionScores[q.section] = { score: 0, total: 0 };
          sectionScores[q.section].score += grade.score;
          sectionScores[q.section].total += q.marks;

          feedbackList.push({
              questionId: q.id,
              text: q.text,
              userAnswer: answers.find(a => a.questionId === q.id)?.answer || "(No Answer)",
              score: grade.score,
              maxMarks: q.marks,
              feedback: formatFeedback(q, grade.score, grade.feedback, activeExam.language),
              correctAnswer: q.correctAnswer
          });
      });

      const finalGrade = calculateGrade(totalScore, maxTotalScore);
      
      const resultData: ExamResult = {
          id: `${currentStudent?.id}-${activeExam.id}-${Date.now()}`,
          studentId: currentStudent?.id || 'guest',
          studentName: currentStudent?.fullName || 'Guest',
          examId: activeExam.id,
          subject: activeExam.subject,
          year: activeExam.year,
          score: totalScore,
          maxScore: maxTotalScore,
          grade: finalGrade,
          date: new Date().toISOString()
      };

      if (currentStudent) {
          await saveExamResult(resultData);
      }

      setResults({
          score: totalScore,
          maxScore: maxTotalScore,
          feedback: feedbackList,
          sectionScores,
          grade: finalGrade
      });

      setIsGrading(false);
      setView(AppState.RESULTS);
  };

  // --- RENDER HELPERS ---

  if (loadingApp) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="loading-ring w-12 h-12"></div></div>;
  }

  // --- VIEWS ---

  if (view === AppState.ADMIN_PANEL && currentUserRole === 'admin') {
      return <AdminPanel onLogout={() => { logoutUser(); setView(AppState.HOME); window.location.reload(); }} />;
  }

  if (view === AppState.DASHBOARD && currentStudent) {
      return <StudentDashboard onBack={() => setView(AppState.HOME)} onLogout={() => { setView(AppState.HOME); window.location.reload(); }} />;
  }

  if (view === AppState.STUDENT_AUTH) {
      return <StudentAuth 
          onLoginSuccess={(s) => { 
              setCurrentStudent(s); 
              setCurrentUserRole((s as any).role === 'admin' ? 'admin' : 'student');
              if ((s as any).role === 'admin') setView(AppState.ADMIN_PANEL);
              else setView(AppState.DASHBOARD);
          }} 
          onCancel={() => setView(AppState.HOME)} 
      />;
  }

  if (view === AppState.ABOUT) return <AboutPage onBack={() => setView(AppState.HOME)} />;
  if (view === AppState.PRIVACY) return <PrivacyPage onBack={() => setView(AppState.HOME)} />;
  if (view === AppState.CONTACT) return <ContactPage onBack={() => setView(AppState.HOME)} />;

  if (view === AppState.EXAM_ACTIVE && activeExam) {
      if (isGrading) {
          return (
              <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                  <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                      <div className="text-4xl mb-4">🤖</div>
                      <h2 className="text-xl font-bold text-slate-800 mb-2">{gradingMessage}</h2>
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                          <div className="bg-blue-600 h-4 rounded-full transition-all duration-300" style={{ width: `${gradingProgress}%` }}></div>
                      </div>
                      <p className="text-sm text-slate-500">{gradingProgress}% Complete</p>
                  </div>
              </div>
          );
      }

      const q = activeExam.questions[currentQuestionIndex];
      const isLast = currentQuestionIndex === activeExam.questions.length - 1;
      const currentAns = answers.find(a => a.questionId === q.id)?.answer || '';

      return (
          <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
              <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col min-h-[80vh]">
                  {/* Exam Header */}
                  <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                      <div>
                          <h2 className="font-bold text-lg">{activeExam.subject} ({activeExam.year})</h2>
                          <div className="text-sm opacity-80">Question {currentQuestionIndex + 1} of {activeExam.questions.length}</div>
                      </div>
                      <div className={`text-xl font-mono font-bold ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
                          {formatTime(timeLeft)}
                      </div>
                  </div>

                  {/* Question Area */}
                  <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                      <div className="mb-2 text-xs font-bold text-blue-600 uppercase tracking-wide">{q.section}</div>
                      
                      {/* Passage (if any) */}
                      {activeExam.sectionPassages && activeExam.sectionPassages[q.section] && (
                          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-slate-700 leading-relaxed italic rounded-r">
                              {activeExam.sectionPassages[q.section]}
                          </div>
                      )}

                      {/* Image (if any) */}
                      {q.diagramUrl && (
                          Array.isArray(q.diagramUrl) ? 
                            q.diagramUrl.map((url, idx) => <ExamImage key={idx} src={url} alt={`Diagram for Q${q.id}`} />) : 
                            <ExamImage src={q.diagramUrl} alt={`Diagram for Q${q.id}`} />
                      )}

                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-snug" dir={activeExam.direction || 'ltr'}>
                          {q.text}
                      </h3>

                      {q.type === 'mcq' && q.options ? (
                          <div className="grid gap-3">
                              {q.options.map((opt, idx) => (
                                  <button
                                      key={idx}
                                      onClick={() => handleAnswer(q.id, opt)}
                                      className={`p-4 text-left rounded-lg border-2 transition-all ${currentAns === opt ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                  >
                                      <div className="flex items-center gap-3">
                                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${currentAns === opt ? 'border-blue-600' : 'border-gray-300'}`}>
                                              {currentAns === opt && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                                          </div>
                                          <span className="text-slate-700 font-medium" dir={activeExam.direction || 'ltr'}>{opt}</span>
                                      </div>
                                  </button>
                              ))}
                          </div>
                      ) : (
                          <textarea
                              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition min-h-[200px] text-lg text-slate-800 bg-gray-50"
                              placeholder="Type your answer here..."
                              value={currentAns}
                              onChange={(e) => handleAnswer(q.id, e.target.value)}
                              dir={activeExam.direction || 'ltr'}
                          />
                      )}
                  </div>

                  {/* Navigation Footer */}
                  <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
                      <button 
                          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                          disabled={currentQuestionIndex === 0}
                          className="px-6 py-2 rounded-lg font-bold text-slate-600 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
                      >
                          Previous
                      </button>

                      <div className="hidden md:flex gap-1">
                          {activeExam.questions.map((_, idx) => (
                              <div 
                                  key={idx} 
                                  className={`w-2 h-2 rounded-full ${idx === currentQuestionIndex ? 'bg-blue-600' : answers.find(a => a.questionId === activeExam.questions[idx].id) ? 'bg-green-400' : 'bg-gray-300'}`}
                              ></div>
                          ))}
                      </div>

                      {isLast ? (
                          <button 
                              onClick={handleSubmitExam}
                              className="px-6 py-2 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 shadow-md transition"
                          >
                              Submit Exam
                          </button>
                      ) : (
                          <button 
                              onClick={() => setCurrentQuestionIndex(prev => Math.min(activeExam.questions.length - 1, prev + 1))}
                              className="px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition"
                          >
                              Next
                          </button>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  // --- RESULTS VIEW ---
  
  if (view === AppState.RESULTS && results) {
      return (
          <div className="min-h-screen bg-gray-50 p-6 font-sans">
              <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-blue-900 p-8 text-center text-white">
                      <h2 className="text-3xl font-black mb-2">Exam Results</h2>
                      <div className="text-blue-200 font-bold text-lg">{activeExam?.subject} ({activeExam?.year})</div>
                  </div>
                  
                  <div className="p-8">
                      <div className="flex flex-col md:flex-row justify-center gap-8 mb-10">
                           <div className="text-center">
                               <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Score</div>
                               <div className="text-5xl font-black text-slate-800">{Math.round(results.score)} <span className="text-2xl text-slate-400">/ {results.maxScore}</span></div>
                           </div>
                           <div className="text-center">
                               <div className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Grade</div>
                               <div className={`text-5xl font-black ${['A+','A','A-','B+'].includes(results.grade) ? 'text-green-500' : results.grade === 'F' ? 'text-red-500' : 'text-blue-500'}`}>
                                   {results.grade}
                               </div>
                           </div>
                      </div>
                      
                      {/* Breakdown */}
                      <div className="mb-8">
                          <h3 className="font-bold text-slate-700 border-b pb-2 mb-4">Section Breakdown</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {Object.entries(results.sectionScores).map(([section, stats], idx) => (
                                  <div key={idx} className="bg-gray-50 p-4 rounded border border-gray-100 flex justify-between items-center">
                                      <span className="text-sm font-bold text-slate-600">{section}</span>
                                      <span className="text-sm font-mono font-bold text-slate-800">{Math.round(stats.score)}/{stats.total}</span>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Feedback List */}
                      <div>
                          <h3 className="font-bold text-slate-700 border-b pb-2 mb-4">Detailed Feedback</h3>
                          <div className="space-y-6">
                              {results.feedback.map((item, idx) => (
                                  <div key={idx} className={`p-6 rounded-lg border-l-4 ${item.score === item.maxMarks ? 'bg-green-50 border-green-500' : item.score === 0 ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'}`}>
                                      <div className="flex justify-between items-start mb-2">
                                          <div className="font-bold text-slate-700 text-sm">Question {idx + 1}</div>
                                          <div className="text-xs font-bold uppercase tracking-wide opacity-70">
                                              {item.score}/{item.maxMarks} Marks
                                          </div>
                                      </div>
                                      <div className="text-lg font-medium text-slate-800 mb-3" dir={activeExam?.direction || 'ltr'}>{item.text}</div>
                                      
                                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                                          <div className="bg-white p-3 rounded border border-gray-200">
                                              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Your Answer</div>
                                              <div className="text-slate-800 text-sm whitespace-pre-wrap" dir={activeExam?.direction || 'ltr'}>{item.userAnswer}</div>
                                          </div>
                                          {item.correctAnswer && (
                                               <div className="bg-white p-3 rounded border border-gray-200">
                                                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Correct Answer</div>
                                                  <div className="text-slate-800 text-sm whitespace-pre-wrap" dir={activeExam?.direction || 'ltr'}>{item.correctAnswer}</div>
                                              </div>
                                          )}
                                      </div>

                                      <div className="bg-white/50 p-4 rounded text-sm text-slate-700 leading-relaxed border border-gray-100" dir={activeExam?.direction || 'ltr'}>
                                          <strong className="block text-slate-900 mb-1">Feedback:</strong>
                                          <FormattedText text={item.feedback} />
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div className="mt-10 flex justify-center gap-4">
                          <button onClick={() => setView(AppState.DASHBOARD)} className="px-8 py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow-lg">
                              Go to Dashboard
                          </button>
                          <button onClick={() => setView(AppState.HOME)} className="px-8 py-3 bg-gray-100 text-slate-600 font-bold rounded-lg hover:bg-gray-200 transition">
                              Back to Home
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- DEFAULT VIEW (HOME & SELECTION MODALS) ---
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
        <LandingPage 
            onSelectAuthority={handleSelectAuthority} 
            onNavigate={(v) => setView(v)}
            student={currentStudent}
        />
        
        {/* Level Selection Modal */}
        {view === AppState.LEVEL_SELECT && (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full animate-fade-in-up">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Select Education Level</h2>
                    <div className="grid gap-4">
                        <button onClick={() => handleLevelSelect('FORM_IV')} className="p-6 border-2 border-slate-100 rounded-xl hover:bg-blue-50 hover:border-blue-500 transition group text-left">
                            <div className="text-lg font-bold text-slate-800 group-hover:text-blue-700">Form IV (Secondary)</div>
                            <div className="text-sm text-slate-500">High School Final Year</div>
                        </button>
                        <button onClick={() => handleLevelSelect('STD_8')} className="p-6 border-2 border-slate-100 rounded-xl hover:bg-green-50 hover:border-green-500 transition group text-left">
                            <div className="text-lg font-bold text-slate-800 group-hover:text-green-700">Standard 8 (Primary)</div>
                            <div className="text-sm text-slate-500">Middle School Final Year</div>
                        </button>
                    </div>
                    <button onClick={() => setView(AppState.HOME)} className="mt-8 text-slate-400 hover:text-slate-600 font-bold text-sm w-full text-center">Cancel</button>
                </div>
            </div>
        )}

        {/* Subject Selection Modal */}
        {view === AppState.SUBJECT_SELECT && selectedAuthority && selectedLevel && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
                    <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">Select Subject</h2>
                    <p className="text-center text-slate-500 mb-8">{selectedAuthority.replace('_', ' ')} • {selectedLevel.replace('_', ' ')}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {EXAM_HIERARCHY[selectedAuthority][selectedLevel].map(subjectKey => (
                            <button 
                                key={subjectKey}
                                onClick={() => handleSubjectSelect(subjectKey)} 
                                className="p-4 border-2 border-slate-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-500 transition font-bold text-slate-700 hover:text-indigo-700 capitalize flex flex-col items-center gap-2 text-center"
                            >
                                {/* Simple icons based on subject key */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${['math','physics','chemistry'].includes(subjectKey) ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {subjectKey[0].toUpperCase()}
                                </div>
                                {SUBJECT_CONFIG[subjectKey]?.label || subjectKey}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setView(AppState.LEVEL_SELECT)} className="mt-8 text-slate-400 hover:text-slate-600 font-bold text-sm w-full text-center">Back</button>
                </div>
            </div>
        )}

        {/* Year Selection Modal */}
        {view === AppState.YEAR_SELECT && (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full animate-fade-in-up">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Select Exam Year</h2>
                    <div className="grid gap-3">
                        {selectedSubjectKey && selectedAuthority && selectedLevel && getAvailableYears(selectedSubjectKey, selectedAuthority, selectedLevel).map(year => (
                             <button 
                                key={year}
                                onClick={() => handleYearSelect(year)} 
                                className="p-4 border-2 border-slate-100 rounded-xl hover:bg-blue-50 hover:border-blue-500 transition font-black text-lg text-slate-700 hover:text-blue-700 text-center"
                            >
                                {year}
                            </button>
                        ))}
                        {(!selectedSubjectKey || !selectedAuthority || !selectedLevel || getAvailableYears(selectedSubjectKey!, selectedAuthority!, selectedLevel!).length === 0) && (
                            <div className="text-center text-slate-500 py-4">No exams available for this selection.</div>
                        )}
                    </div>
                    <button onClick={() => setView(AppState.SUBJECT_SELECT)} className="mt-8 text-slate-400 hover:text-slate-600 font-bold text-sm w-full text-center">Back</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default App;
