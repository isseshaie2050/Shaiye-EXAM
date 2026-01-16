
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

// Component to render text with bold formatting by parsing **text**
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  // Split by **text** pattern
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
           // Remove asterisks and render bold
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
      // Removed bg-gray-50, min-h-[50px], and border to prevent ugly placeholder box
      className="max-w-full h-auto mb-4 rounded" 
      onError={() => setHasError(true)}
      loading="eager"
    />
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.HOME);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'somali'>('english');
  
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
  
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setExamHistory(getExamHistory());
    setDashboardStats(getSubjectStats());
  }, [view]);

  // Preload images when exam starts
  useEffect(() => {
    if (activeExam) {
      // Preload all images in the exam to ensure instant loading during navigation
      // This runs in the background
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
    if (!activeExam) return;

    setIsGrading(true);
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
      let processedCount = 0;
      const totalQuestions = activeExam.questions.length;

      const resultsPromises = activeExam.questions.map(async (q) => {
        const userAnswer = answers.find(a => a.questionId === q.id)?.answer || '';
        const grading = await gradeOpenEndedResponse(q, userAnswer, activeExam.language);
        
        processedCount++;
        setGradingProgress(Math.round((processedCount / totalQuestions) * 100));

        return {
          questionId: q.id,
          score: grading.score,
          feedback: grading.feedback,
          userAnswer,
          question: q
        };
      });

      const gradedQuestions = await Promise.all(resultsPromises);

      gradedQuestions.forEach(g => {
        totalScore += g.score;
        sectionScores[g.question.section].score += g.score;
        feedbackList.push(g);
      });

      const finalResult: ExamResult = {
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
      setView(AppState.RESULTS);

    } catch (e) {
      console.error("Grading failed", e);
      alert("Error submitting exam. Please try again.");
    } finally {
      setIsGrading(false);
      setShowSubmitModal(false);
    }
  }, [activeExam, answers, timeLeft]);

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

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    if (subject === 'History') {
        setSelectedLanguage('somali');
    } else {
        setSelectedLanguage('english');
    }
    setView(AppState.EXAM_OVERVIEW);
  };

  const startExam = () => {
    const examTemplate = getExam(selectedYear, selectedSubject, selectedLanguage);
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
    setIsPaused(false);
    setView(AppState.EXAM_ACTIVE);
  };

  const handleAnswer = (answer: string) => {
      if (!activeExam) return;
      const currentQ = activeExam.questions[currentQuestionIndex];
      
      setAnswers(prev => {
          const existing = prev.filter(a => a.questionId !== currentQ.id);
          return [...existing, { questionId: currentQ.id, answer }];
      });
  };

  if (view === AppState.HOME) {
    return (
      <div className="p-8 max-w-4xl mx-auto font-sans">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Somali Federal Government Exams</h1>
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Academic Year</h2>
            <div className="flex flex-wrap gap-4 justify-center">
                {ACADEMIC_YEARS.map(year => (
                    <button 
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`px-6 py-2 rounded-full border ${selectedYear === year ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                        {year}
                    </button>
                ))}
            </div>
        </div>
        
        {selectedYear && (
            <div>
                <h2 className="text-xl font-semibold mb-4">Select Subject</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {SUBJECTS.map(subject => (
                        <button
                            key={subject}
                            onClick={() => handleSubjectSelect(subject)}
                            className="p-5 border rounded-lg hover:shadow-md transition bg-white text-left text-lg font-medium text-slate-800"
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {examHistory.length > 0 && (
            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4">Recent History</h2>
                <div className="space-y-2">
                    {examHistory.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex justify-between p-3 bg-gray-50 rounded border">
                            <span>{h.subject} ({h.year})</span>
                            <span className={`font-bold ${h.score/h.maxScore >= 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                                {h.grade} ({Math.round(h.score)}/{h.maxScore})
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    );
  }

  // Language select view removed as it is skipped

  if (view === AppState.EXAM_OVERVIEW) {
      const exam = getExam(selectedYear, selectedSubject, selectedLanguage);
      if (!exam) return <div className="p-8 text-center">Exam not found. <button onClick={() => setView(AppState.HOME)} className="text-blue-500 underline">Back</button></div>;

      return (
          <div className="p-8 max-w-2xl mx-auto text-center mt-10">
              <h1 className="text-3xl font-bold mb-2">{exam.subject} ({exam.year})</h1>
              <p className="text-gray-600 mb-8">{exam.questions.length} Questions • {exam.durationMinutes} Minutes</p>
              
              <div className="bg-yellow-50 p-6 rounded-lg text-left mb-8 border border-yellow-200">
                  <h3 className="font-bold mb-2">Instructions:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Read all questions carefully.</li>
                      <li>For multiple choice, select the best answer.</li>
                      <li>For written questions, type your answer in the box provided.</li>
                      <li>The exam will auto-submit when the timer reaches zero.</li>
                  </ul>
              </div>

              <button onClick={startExam} className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700">
                  Start Exam
              </button>
              <br/>
              <button onClick={() => setView(AppState.HOME)} className="mt-4 text-gray-500 underline">Cancel</button>
          </div>
      );
  }

  if (view === AppState.RESULTS && results) {
      return (
          <div className="p-6 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-lg border text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Exam Results</h2>
                  <div className="text-6xl font-black text-blue-900 mb-2">{results.grade}</div>
                  <p className="text-xl text-gray-600">{Math.round(results.score)} / {results.maxScore} Marks</p>
              </div>

              <div className="space-y-6">
                  {results.feedback.map((item, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border ${item.score > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                          <div className="flex justify-between mb-2">
                              <span className="font-bold text-gray-700">Question {idx + 1}</span>
                              <span className="font-mono text-sm">{item.score}/{item.question.marks}</span>
                          </div>
                          <div className={`mb-2 font-medium whitespace-pre-wrap ${activeExam?.direction === 'rtl' ? 'text-2xl font-serif' : ''}`}>
                            <FormattedText text={item.question.text} />
                          </div>
                          <p className="mb-2 text-sm text-gray-600"><span className="font-bold">Your Answer:</span> {item.userAnswer || <i>(No Answer)</i>}</p>
                          <div className={`text-sm bg-white p-3 rounded border ${activeExam?.direction === 'rtl' ? 'text-xl text-right font-serif' : ''}`}>
                             <FormattedText text={item.feedback} />
                          </div>
                      </div>
                  ))}
              </div>

              <div className="mt-8 text-center">
                  <button onClick={() => setView(AppState.HOME)} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Back to Home</button>
              </div>
          </div>
      );
  }

  if (view === AppState.EXAM_ACTIVE && activeExam) {
      const question = activeExam.questions[currentQuestionIndex];
      const userAnswer = answers.find(a => a.questionId === question.id)?.answer || '';
      const hasAnswered = userAnswer.trim().length > 0;
      const isRtl = activeExam.direction === 'rtl';

      if (isGrading) {
          return (
              <div className="flex flex-col items-center justify-center h-screen">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <h2 className="text-xl font-bold">Grading Exam...</h2>
                  <p className="text-gray-500">AI is analyzing your answers ({gradingProgress}%)</p>
              </div>
          );
      }

      return (
          <div className="flex flex-col h-screen bg-gray-50">
              {/* Header */}
              <div className="bg-white shadow p-4 flex justify-between items-center z-10">
                  <div className="font-bold text-lg">{activeExam.subject}</div>
                  <div className={`font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-800'}`}>
                      {formatTime(timeLeft)}
                  </div>
                  <button 
                      onClick={() => {
                        if(confirm("Are you sure you want to quit? Your progress will be lost.")) {
                           // Reset all selections to go back to the main home screen (Year Selection)
                           setSelectedYear(null);
                           setSelectedSubject(null);
                           setActiveExam(null);
                           setAnswers([]);
                           setView(AppState.HOME);
                        }
                      }} 
                      className="px-4 py-1 bg-gray-100 text-gray-700 rounded border border-gray-200 hover:bg-gray-200 font-bold text-sm"
                  >
                      Exit
                  </button>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                  <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-sm min-h-[500px] flex flex-col" dir={activeExam.direction}>
                      
                      {/* Section Header */}
                      <div className="mb-6 pb-4 border-b">
                          <span className="text-sm font-bold uppercase tracking-wider text-gray-500">{question.section}</span>
                          <div className="flex justify-between items-end mt-1">
                              <span className="text-xs text-gray-400">Question {currentQuestionIndex + 1} of {activeExam.questions.length}</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}</span>
                          </div>
                      </div>

                      {/* Passage if any */}
                      {activeExam.sectionPassages && activeExam.sectionPassages[question.section] && (
                          <div className={`mb-6 p-4 bg-gray-50 border rounded leading-relaxed whitespace-pre-line text-gray-700 ${isRtl ? 'text-2xl font-serif leading-loose text-right' : 'text-sm'}`}>
                              {activeExam.sectionPassages[question.section]}
                          </div>
                      )}

                      {/* Question */}
                      <h2 className={`font-medium mb-4 whitespace-pre-wrap ${isRtl ? 'text-3xl leading-loose font-serif' : 'text-lg md:text-xl leading-relaxed'}`}>
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
                                      <label key={i} className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${userAnswer === opt ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'hover:bg-gray-50'}`}>
                                          <input 
                                              type="radio" 
                                              name={`q-${question.id}`} 
                                              value={opt} 
                                              checked={userAnswer === opt}
                                              onChange={() => handleAnswer(opt)}
                                              className="w-5 h-5 text-blue-600"
                                          />
                                          <span className={`mx-3 ${isRtl ? 'text-3xl font-serif' : 'text-base'}`}>{opt}</span>
                                      </label>
                                  ))}
                              </div>
                          ) : (
                              <textarea 
                                  className={`w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${isRtl ? 'text-2xl font-serif' : 'text-base'}`}
                                  placeholder={isRtl ? "اكتب إجابتك هنا..." : "Type your answer here..."}
                                  value={userAnswer}
                                  onChange={(e) => handleAnswer(e.target.value)}
                              />
                          )}
                      </div>
                  </div>
              </div>

              {/* Footer Nav */}
              <div className="bg-white border-t p-4">
                  <div className="max-w-3xl mx-auto flex justify-between">
                      <button 
                          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                          disabled={currentQuestionIndex === 0}
                          className="px-6 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200"
                      >
                          Previous
                      </button>
                      
                      <div className="flex gap-2">
                          {currentQuestionIndex === activeExam.questions.length - 1 ? (
                              <button 
                                  onClick={() => setShowSubmitModal(true)} 
                                  disabled={!hasAnswered}
                                  className={`px-6 py-2 rounded font-bold ${!hasAnswered ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                              >
                                  Submit All
                              </button>
                          ) : (
                              <button 
                                  onClick={() => setCurrentQuestionIndex(prev => Math.min(activeExam.questions.length - 1, prev + 1))}
                                  disabled={!hasAnswered}
                                  className={`px-6 py-2 rounded font-bold ${!hasAnswered ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                              >
                                  Next
                              </button>
                          )}
                      </div>
                  </div>
              </div>

              {/* Submit Modal */}
              {showSubmitModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-xl max-w-sm w-full mx-4">
                          <h3 className="text-xl font-bold mb-2">Submit Exam?</h3>
                          <p className="text-gray-600 mb-6">You have answered {answers.length} out of {activeExam.questions.length} questions. Once submitted, you cannot change your answers.</p>
                          <div className="flex gap-3 justify-end">
                              <button onClick={() => setShowSubmitModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">Confirm Submit</button>
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
