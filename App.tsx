import React, { useState, useEffect, useCallback } from 'react';
import { AppState, UserAnswer, SectionType, Question, Exam, ExamResult } from './types';
import { ACADEMIC_YEARS, SUBJECTS, getExam } from './constants';
import { gradeOpenEndedResponse } from './services/geminiService';
import { saveExamResult, getExamHistory, getSubjectStats } from './services/storageService';

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

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.HOME);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
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
  const [dashboardStats, setDashboardStats] = useState<any[]>([]);

  const baseExam = getExam(selectedYear, selectedSubject);

  useEffect(() => {
    setExamHistory(getExamHistory());
    setDashboardStats(getSubjectStats());
  }, [view]); 

  useEffect(() => {
    let timer: any;
    if (view === AppState.EXAM_ACTIVE && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (view === AppState.EXAM_ACTIVE && timeLeft === 0) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  const startExam = () => {
    const examTemplate = getExam(selectedYear, selectedSubject);
    if (!examTemplate) return;

    const shuffledQuestions = examTemplate.questions.map(q => {
      if (q.type === 'mcq' && q.options) {
        return { ...q, options: shuffleArray([...q.options]) };
      }
      return q;
    });

    const newExamInstance = { ...examTemplate, questions: shuffledQuestions };
    
    setActiveExam(newExamInstance);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setTimeLeft(examTemplate.durationMinutes * 60);
    setShowSubmitModal(false);
    setView(AppState.EXAM_ACTIVE);
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== questionId);
      return [...filtered, { questionId, answer: value }];
    });
  };

  const handleTrySubmit = () => {
    setShowSubmitModal(true);
  };

  const handleSubmit = async () => {
    if (!activeExam) return;
    setShowSubmitModal(false);
    
    // Calculate time taken
    const totalSeconds = activeExam.durationMinutes * 60;
    setTimeTaken(totalSeconds - timeLeft);

    setView(AppState.RESULTS);
    setIsGrading(true);
    setGradingProgress(0);
    
    let totalScore = 0;
    const maxScore = activeExam.questions.reduce((sum, q) => sum + q.marks, 0);
    const feedbackList = [];
    const sectionScores: Record<string, {score: number, total: number}> = {};

    // Initialize section scores
    activeExam.questions.forEach(q => {
        if(!sectionScores[q.section]) {
            sectionScores[q.section] = { score: 0, total: 0 };
        }
        sectionScores[q.section].total += q.marks;
    });

    let processedCount = 0;
    const totalQuestions = activeExam.questions.length;

    for (const q of activeExam.questions) {
      const userAnswer = answers.find(a => a.questionId === q.id)?.answer || "";
      
      // Add slight delay for AI requests to prevent 429 Quota errors for Open Ended questions
      if (q.type !== 'mcq') {
        await new Promise(resolve => setTimeout(resolve, 2000)); 
      }

      const result = await gradeOpenEndedResponse(q, userAnswer);
      
      totalScore += result.score;
      if (sectionScores[q.section]) {
          sectionScores[q.section].score += result.score;
      }

      feedbackList.push({
        ...q,
        studentAnswer: userAnswer,
        awardedMarks: result.score,
        feedback: result.feedback,
        isCorrect: result.score === q.marks
      });

      processedCount++;
      setGradingProgress(Math.round((processedCount / totalQuestions) * 100));
    }

    const finalResult = { score: Math.round(totalScore), maxScore, feedback: feedbackList, sectionScores };
    setResults(finalResult);

    const percentage = (finalResult.score / maxScore) * 100;
    let grade = 'F';
    if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    saveExamResult({
      examId: activeExam.id,
      subject: activeExam.subject,
      year: activeExam.year,
      score: finalResult.score,
      maxScore,
      grade,
      date: new Date().toLocaleDateString()
    });

    setIsGrading(false);
  };

  // --- RENDER METHODS ---

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 bg-slate-50">
      <div className="mb-12">
        <div className="bg-blue-600 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl border-4 border-white">
           <span className="text-white font-black text-4xl">S</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-blue-900 mb-2">SHAIYE EXAMS</h1>
        <p className="text-slate-500 uppercase tracking-[0.2em] text-xs font-bold">Federal Republic of Somalia</p>
        <p className="text-blue-600 font-medium mt-1">Form IV National Examination Platform</p>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full space-y-4">
        <button 
          onClick={() => setView(AppState.YEAR_SELECT)}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white px-10 py-5 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95"
        >
          Enter Portal
        </button>
        <div className="flex gap-2">
           <button 
             onClick={() => setView(AppState.DASHBOARD)}
             className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm transition-all border border-slate-200"
           >
             📊 Dashboard
           </button>
           <button 
             onClick={() => setView(AppState.HISTORY)}
             className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm transition-all border border-slate-200"
           >
             📜 History
           </button>
        </div>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-2">Authorized Access Only</p>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-4xl mx-auto py-12 px-4">
       <button onClick={() => setView(AppState.HOME)} className="mb-6 text-slate-400 hover:text-blue-600 font-bold text-sm uppercase tracking-widest flex items-center gap-2"><span>←</span> Back Home</button>
       <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
         <span className="text-blue-600">📊</span> Performance Analytics
       </h2>
       
       {dashboardStats.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            <div className="text-4xl mb-4">📉</div>
            <p className="font-medium">No exam data available yet.</p>
            <p className="text-sm mt-2">Complete an exam to see your analytics dashboard.</p>
            <button 
              onClick={() => setView(AppState.YEAR_SELECT)}
              className="mt-6 bg-blue-100 text-blue-700 px-6 py-2 rounded-lg font-bold hover:bg-blue-200 transition-colors"
            >
              Take an Exam
            </button>
          </div>
       ) : (
         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Visual Bar Graph */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
              <h3 className="text-lg font-bold text-slate-700 mb-8 flex justify-between items-center">
                <span>Subject Performance Overview</span>
                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-widest">Average Score %</span>
              </h3>
              <div className="flex items-end justify-between h-64 gap-2 sm:gap-4 pb-2">
                 {dashboardStats.map((stat) => (
                   <div key={stat.subject} className="flex flex-col items-center flex-1 h-full justify-end group cursor-default">
                     <div className="relative w-full max-w-[50px] flex flex-col justify-end h-full">
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs py-2 px-3 rounded-lg font-bold transition-all shadow-xl whitespace-nowrap z-10 pointer-events-none mb-2">
                          {stat.average}% 
                          <span className="block text-[9px] font-normal opacity-80">{stat.attempts} exams taken</span>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                        </div>
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-1000 relative hover:brightness-110 ${stat.average >= 80 ? 'bg-gradient-to-t from-green-600 to-green-400' : stat.average >= 60 ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-gradient-to-t from-orange-600 to-orange-400'}`}
                          style={{ height: `${Math.max(stat.average, 5)}%` }}
                        >
                        </div>
                     </div>
                     <p className="mt-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide text-center truncate w-full transform -rotate-45 sm:rotate-0 origin-top-left sm:origin-center translate-y-2 sm:translate-y-0">{stat.subject.substring(0, 3)}</p>
                   </div>
                 ))}
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-6 mt-10">Detailed Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {dashboardStats.map((stat) => (
                <div key={stat.subject} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700">{stat.subject}</h3>
                    <span className="text-xs font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{stat.attempts} Tests</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-3">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${stat.average >= 80 ? 'bg-green-500' : stat.average >= 60 ? 'bg-blue-500' : 'bg-orange-500'}`}
                      style={{ width: `${stat.average}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-end">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Performance</span>
                     <p className="text-right font-black text-3xl text-slate-900">{stat.average}<span className="text-sm align-top text-slate-400 ml-1">%</span></p>
                  </div>
                </div>
              ))}
            </div>
         </div>
       )}
    </div>
  );

  const renderHistory = () => (
    <div className="max-w-4xl mx-auto py-12 px-4">
       <button onClick={() => setView(AppState.HOME)} className="mb-6 text-slate-400 hover:text-blue-600 font-bold text-sm uppercase tracking-widest flex items-center gap-2"><span>←</span> Back Home</button>
       <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
         <span className="text-blue-600">📜</span> Exam History
       </h2>
       <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
         {examHistory.length === 0 ? (
           <div className="p-16 text-center text-slate-400">
             <p className="text-lg">No past exams found.</p>
             <button 
                onClick={() => setView(AppState.YEAR_SELECT)}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                Start your first exam
              </button>
           </div>
         ) : (
           <div className="divide-y divide-slate-100">
             {examHistory.map((exam, idx) => (
               <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${exam.grade === 'A' ? 'bg-green-100 text-green-700' : exam.grade === 'B' ? 'bg-blue-100 text-blue-700' : exam.grade === 'C' ? 'bg-indigo-100 text-indigo-700' : 'bg-red-100 text-red-700'}`}>
                      {exam.grade}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{exam.subject}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wide">
                        <span>{exam.year}</span>
                        <span>•</span>
                        <span>{exam.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">{exam.score}<span className="text-sm text-slate-400 font-bold">/{exam.maxScore}</span></p>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
                  </div>
               </div>
             ))}
           </div>
         )}
       </div>
    </div>
  );

  const renderYearSelect = () => (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <button onClick={() => setView(AppState.HOME)} className="mb-8 flex items-center text-slate-400 hover:text-blue-700 transition-colors font-black text-xs uppercase tracking-widest group">
        <span className="mr-2 text-lg transform group-hover:-translate-x-1 transition-transform">←</span> Back to Home
      </button>
      <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3"><span className="w-2 h-8 bg-blue-700 rounded-full"></span>Select Examination Year</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {ACADEMIC_YEARS.map(year => (
          <button 
            key={year}
            onClick={() => { setSelectedYear(year); setView(AppState.SUBJECT_SELECT); }}
            className={`p-6 border-2 rounded-xl text-xl font-bold transition-all shadow-sm ${year === 2025 ? 'bg-blue-50 border-blue-600 text-blue-800' : 'bg-white border-slate-200 hover:border-blue-400'}`}
          >
            {year}
            {year === 2025 && <span className="block text-[10px] font-bold text-blue-600 mt-2 bg-blue-100 px-2 py-0.5 rounded-full inline-block">LIVE SESSION</span>}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSubjectSelect = () => (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button onClick={() => setView(AppState.YEAR_SELECT)} className="mb-8 flex items-center text-slate-400 hover:text-blue-700 transition-colors font-black text-xs uppercase tracking-widest group">
        <span className="mr-2 text-lg transform group-hover:-translate-x-1 transition-transform">←</span> Back to Year Selection
      </button>
      <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3"><span className="w-2 h-8 bg-blue-700 rounded-full"></span>Available Subjects ({selectedYear})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {SUBJECTS.map(subject => (
          <button 
            key={subject}
            onClick={() => { setSelectedSubject(subject); setView(AppState.EXAM_OVERVIEW); }}
            className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 text-left font-bold transition-all flex justify-between items-center"
          >
            <span>{subject}</span>
            <span className="text-blue-200 text-2xl">→</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderExamOverview = () => {
    if (!baseExam) {
      return (
        <div className="max-w-2xl mx-auto py-12 px-4">
          <button onClick={() => setView(AppState.SUBJECT_SELECT)} className="mb-8 flex items-center text-slate-400 hover:text-blue-700 transition-colors font-black text-xs uppercase tracking-widest group">
            <span className="mr-2 text-lg transform group-hover:-translate-x-1 transition-transform">←</span> Back to Subjects
          </button>
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🚫</div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Paper Not Accessible</h2>
            <p className="text-slate-500 font-medium text-sm mb-8">The {selectedYear} {selectedSubject} examination paper is currently locked.</p>
            <button onClick={() => setView(AppState.SUBJECT_SELECT)} className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors">Select Another Subject</button>
          </div>
        </div>
      );
    }

    const totalMarks = baseExam.questions.reduce((sum, q) => sum + q.marks, 0);

    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <button onClick={() => setView(AppState.SUBJECT_SELECT)} className="mb-8 flex items-center text-slate-400 hover:text-blue-700 transition-colors font-black text-xs uppercase tracking-widest group">
          <span className="mr-2 text-lg transform group-hover:-translate-x-1 transition-transform">←</span> Back to Subjects
        </button>
        <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-700"></div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedSubject}</h2>
          <p className="text-slate-500 font-bold text-sm mb-8 tracking-widest uppercase">Academic Year {selectedYear}</p>
          <div className="space-y-4 mb-10 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Allocated Time</span><span className="font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border">{baseExam.durationMinutes} Minutes</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Total Paper Marks</span><span className="font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border">{totalMarks} Marks</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Language Direction</span><span className="font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border uppercase">{baseExam.direction === 'rtl' ? 'Right-to-Left (Arabic)' : 'Left-to-Right'}</span></div>
          </div>
          <button onClick={startExam} className="w-full bg-blue-900 hover:bg-black text-white py-5 rounded-xl font-black uppercase tracking-widest shadow-xl transition-all">Enter Exam Hall</button>
        </div>
      </div>
    );
  };

  const renderActiveExam = () => {
    if (!activeExam) return null;
    const q = activeExam.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === activeExam.questions.length - 1;
    const isRtl = activeExam.direction === 'rtl';
    
    // Check if the current question has an answer
    const currentAnswerEntry = answers.find(a => a.questionId === q.id);
    const hasAnswered = currentAnswerEntry && currentAnswerEntry.answer.trim().length > 0;

    // Check for Reading Passage
    const passage = activeExam.sectionPassages?.[q.section];

    return (
      <div className="flex flex-col min-h-screen bg-slate-100" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Submit Modal Overlay */}
        {showSubmitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
                    <h3 className="text-2xl font-black text-slate-900 mb-4">Submit Examination?</h3>
                    <p className="text-slate-600 mb-8 font-medium">Are you sure you want to submit your examination? You will not be able to change your answers after submission.</p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setShowSubmitModal(false)}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl font-bold transition-colors"
                        >
                            Continue Exam
                        </button>
                        <button 
                            onClick={handleSubmit}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-lg transition-colors"
                        >
                            Submit Now
                        </button>
                    </div>
                </div>
            </div>
        )}

        <div className="sticky top-0 bg-blue-900 text-white p-4 shadow-xl z-20 flex items-center justify-between border-b border-blue-800">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => { if(confirm("Are you sure you want to exit the exam? Your progress will be lost.")) setView(AppState.HOME); }}
                className="bg-blue-800 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
            >
                ← Home
            </button>
            <div className="bg-white text-blue-900 font-black px-2 py-1 rounded text-sm">F4</div>
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <h3 className="font-black text-xs tracking-widest uppercase">{selectedSubject}</h3>
              <p className="text-[10px] text-blue-300 font-bold">CANDIDATE: SH-82710</p>
            </div>
          </div>
          <div className={`px-5 py-2 rounded-lg font-mono text-2xl font-bold border-2 ${timeLeft < 600 ? 'bg-red-600 animate-pulse border-red-400 text-white' : 'bg-blue-800 border-blue-700 text-blue-100'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full p-4 flex-1 flex flex-col justify-center">
          <div className="exam-paper p-8 md:p-12 rounded-2xl border-2 border-slate-200 shadow-xl bg-white min-h-[60vh] flex flex-col relative overflow-hidden">
            {/* Left Border Accent */}
            <div className={`absolute top-0 bottom-0 w-2 ${hasAnswered ? 'bg-green-500' : 'bg-red-500'} left-0 transition-colors duration-500`}></div>

            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                  <h4 className="text-blue-900 font-black text-lg">Question {currentQuestionIndex + 1}</h4>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">[{q.marks} mark]</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${hasAnswered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {hasAnswered ? 'Answered' : 'Unanswered'}
              </span>
            </div>

            <div className="flex-1 pl-4">
               {/* Reading Passage Display */}
               {passage && (
                 <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto max-h-80 shadow-inner">
                   <h3 className={`text-sm font-black text-slate-500 mb-2 uppercase tracking-widest ${isRtl ? 'text-right' : 'text-left'}`}>Reading Passage</h3>
                   <div className={`leading-relaxed text-slate-800 whitespace-pre-wrap ${isRtl ? 'font-serif text-xl' : 'text-base'}`}>
                     {passage}
                   </div>
                 </div>
               )}

               <h3 className={`text-xl md:text-2xl font-bold text-slate-900 leading-relaxed mb-8 whitespace-pre-wrap ${isRtl ? 'font-serif text-2xl' : ''}`}>
                 {q.text}
               </h3>
               
               {q.diagramUrl && (
                  <div className="mb-8 p-10 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">[ DIAGRAM: {q.diagramUrl} ]</p>
                  </div>
               )}

               {q.type === 'mcq' ? (
                  <div className="grid grid-cols-1 gap-4">
                    {q.options?.map((opt, i) => {
                      const isSelected = answers.find(a => a.questionId === q.id)?.answer === opt;
                      return (
                        <button 
                          key={opt}
                          onClick={() => handleAnswer(q.id, opt)}
                          className={`text-left p-5 border rounded-lg flex items-center gap-4 transition-all group ${isSelected ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300 group-hover:border-slate-400'}`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <span className={`font-medium text-lg ${isSelected ? 'text-blue-900' : 'text-slate-700'} ${isRtl ? 'font-serif text-xl' : ''}`}>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
               ) : (
                  <textarea 
                    className={`w-full p-6 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:bg-blue-50 outline-none min-h-[200px] text-lg transition-all resize-none ${isRtl ? 'font-serif text-2xl' : ''}`}
                    placeholder={isRtl ? "اكتب إجابتك هنا..." : "Type your answer here..."}
                    value={answers.find(a => a.questionId === q.id)?.answer || ""}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    dir={isRtl ? 'rtl' : 'ltr'}
                  />
               )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center pl-4">
               <button 
                 onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                 disabled={currentQuestionIndex === 0}
                 className="px-6 py-3 rounded-lg font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
               >
                 {isRtl ? '→ السابق (Back)' : '← Back'}
               </button>
               
               {isLastQuestion ? (
                 <button 
                   onClick={handleTrySubmit}
                   disabled={!hasAnswered}
                   className="bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all"
                 >
                   {isRtl ? 'إنهاء (Finish)' : 'Finish Exam'}
                 </button>
               ) : (
                 <button 
                   onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                   disabled={!hasAnswered}
                   className="bg-blue-900 hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all"
                 >
                   {isRtl ? 'التالي (Next) ←' : 'Next →'}
                 </button>
               )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (isGrading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
          <div className="w-20 h-20 border-8 border-slate-200 border-t-blue-700 rounded-full animate-spin mb-8 shadow-xl"></div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Evaluating Script</h2>
          <p className="text-slate-500 mt-4 font-bold uppercase tracking-widest text-xs">National Marking Protocol Active</p>
          {/* Progress Indicator */}
          <div className="w-64 h-2 bg-slate-200 rounded-full mt-6 overflow-hidden">
             <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${gradingProgress}%` }}></div>
          </div>
          <p className="mt-2 text-sm text-slate-400 font-mono">{gradingProgress}%</p>
        </div>
      );
    }

    if (!results) return null;

    const percentage = (results.score / results.maxScore) * 100;
    let grade = 'F';
    let color = 'text-red-600';
    if (percentage >= 80) { grade = 'A'; color = 'text-green-600'; }
    else if (percentage >= 70) { grade = 'B'; color = 'text-blue-600'; }
    else if (percentage >= 60) { grade = 'C'; color = 'text-green-600'; } 
    else if (percentage >= 50) { grade = 'D'; color = 'text-orange-600'; }

    // Use summary data matching the screenshot structure
    const sectionA = results.sectionScores[SectionType.MCQ] || {score: 0, total: 0};
    const sectionB = results.sectionScores[SectionType.SHORT_ANSWER] || {score: 0, total: 0};
    const sectionC = results.sectionScores[SectionType.CALCULATION] || {score: 0, total: 0};

    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        
        <h1 className="text-4xl font-serif text-slate-900 text-center font-bold mb-8">Examination Results</h1>
        
        <div className="text-center mb-12">
            <h2 className={`text-8xl font-black ${color} tracking-tighter mb-2`}>{results.score}<span className="text-4xl text-slate-300">/{results.maxScore}</span></h2>
            <h3 className="text-2xl font-bold text-slate-600">Grade: {grade}</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Section A (MCQs)</p>
                <p className="text-2xl font-black text-slate-800">{sectionA.score}/{sectionA.total}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Section B (Short)</p>
                <p className="text-2xl font-black text-slate-800">{sectionB.score}/{sectionB.total}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Section C (Calc)</p>
                <p className="text-2xl font-black text-slate-800">{sectionC.score}/{sectionC.total}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Time Taken</p>
                <p className="text-2xl font-black text-slate-800">{formatTime(timeTaken)}</p>
            </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-8 font-serif border-b pb-4">Detailed Feedback</h2>

        <div className="space-y-6">
          {results.feedback.map((f, i) => (
            <div 
                key={f.id} 
                className={`border rounded-xl p-6 ${f.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                dir={activeExam?.direction === 'rtl' ? 'rtl' : 'ltr'}
            >
              <h4 className={`font-bold text-slate-900 mb-4 text-lg ${activeExam?.direction === 'rtl' ? 'font-serif text-2xl' : ''}`}>Question {i + 1}: {f.text}</h4>
              
              <div className="space-y-2 mb-4">
                  <p className="text-sm"><span className="font-bold text-slate-600">Your Answer:</span> <span className={`font-medium ${activeExam?.direction === 'rtl' ? 'font-serif text-lg' : ''}`}>{f.studentAnswer}</span></p>
                  <p className="text-sm"><span className="font-bold text-slate-600">Correct Answer:</span> <span className={`font-medium ${activeExam?.direction === 'rtl' ? 'font-serif text-lg' : ''}`}>{f.correctAnswer}</span></p>
              </div>

              <div className={`bg-white/60 p-4 rounded-lg leading-relaxed font-medium ${activeExam?.direction === 'rtl' ? 'text-lg font-serif text-slate-800' : 'text-sm text-slate-700'}`}>
                  {/* Properly render the markdown returned by the AI */}
                  <div className="whitespace-pre-wrap">{f.feedback}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col md:flex-row gap-4 mb-20">
          <button onClick={() => startExam()} className="flex-1 bg-white border-2 border-blue-700 text-blue-700 hover:bg-blue-50 py-4 rounded-lg font-bold text-lg transition-all">Retake Examination</button>
          <button onClick={() => setView(AppState.HOME)} className="flex-1 bg-blue-800 hover:bg-blue-900 text-white py-4 rounded-lg font-bold text-lg transition-all shadow-lg">Back to Home</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-100 selection:text-blue-900">
      {view !== AppState.RESULTS && (
          <nav className="bg-white border-b-2 border-slate-200 px-6 py-5 flex justify-between items-center sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">S</div>
              <span className="font-black text-xl tracking-tighter text-slate-900">SHAIYE EXAMS</span>
            </div>
            {view !== AppState.HOME && view !== AppState.EXAM_ACTIVE && (
              <button onClick={() => setView(AppState.HOME)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">Close Session</button>
            )}
          </nav>
      )}

      <main>
        {view === AppState.HOME && renderHome()}
        {view === AppState.DASHBOARD && renderDashboard()}
        {view === AppState.HISTORY && renderHistory()}
        {view === AppState.YEAR_SELECT && renderYearSelect()}
        {view === AppState.SUBJECT_SELECT && renderSubjectSelect()}
        {view === AppState.EXAM_OVERVIEW && renderExamOverview()}
        {view === AppState.EXAM_ACTIVE && renderActiveExam()}
        {view === AppState.RESULTS && renderResults()}
      </main>
    </div>
  );
};

export default App;