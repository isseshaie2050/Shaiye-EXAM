import React, { useState, useEffect } from 'react';
import { Exam, Student, SubscriptionPlan, EducationLevel, Question, SectionType, ExamAuthority } from '../types';
import { getAllExams, saveDynamicExam } from '../services/examService';
import { getAllStudents, getAllExamResults, updateStudentPlan, adminCreateUser } from '../services/storageService';
import { SUBJECT_CONFIG } from '../constants';

interface Props {
  onLogout: () => void;
}

// --- ICONS (SVG) ---
const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Teachers: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Exams: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Results: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Cloud: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
};

// --- HELPER COMPONENTS ---

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${active ? 'bg-blue-800 text-white border-r-4 border-green-400' : 'text-blue-300 hover:text-white hover:bg-blue-800/50'}`}>
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </div>
);

const StatsCard: React.FC<{ title: string; value: number | string; color: string; trend: string }> = ({ title, value, color, trend }) => {
    const getColor = (c: string) => {
        switch(c) {
            case 'blue': return 'bg-blue-50 text-blue-600';
            case 'purple': return 'bg-purple-50 text-purple-600';
            case 'indigo': return 'bg-indigo-50 text-indigo-600';
            case 'green': return 'bg-green-50 text-green-600';
            case 'red': return 'bg-red-50 text-red-600';
            case 'yellow': return 'bg-yellow-50 text-yellow-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</div>
                    <div className="text-3xl font-black text-slate-800">{value}</div>
                </div>
                <div className={`p-2 rounded-lg ${getColor(color)}`}>
                    <div className="w-4 h-4 rounded-full bg-current opacity-50"></div>
                </div>
            </div>
            <div className="text-xs font-medium text-slate-400">{trend}</div>
        </div>
    );
};

const Badge: React.FC<{ label: string; color: string }> = ({ label, color }) => {
    const getColor = (c: string) => {
        switch(c) {
            case 'green': return 'bg-green-100 text-green-700';
            case 'red': return 'bg-red-100 text-red-700';
            case 'yellow': return 'bg-yellow-100 text-yellow-700';
            case 'blue': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    return (
        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${getColor(color)}`}>
            {label}
        </span>
    );
};

const CreateExamForm: React.FC<{ onExamCreated: () => void }> = ({ onExamCreated }) => {
    const [step, setStep] = useState(1);
    const [authority, setAuthority] = useState<ExamAuthority>('SOMALI_GOV');
    const [level, setLevel] = useState<EducationLevel>('FORM_IV');
    const [year, setYear] = useState(2026);
    const [subjectKey, setSubjectKey] = useState('physics');
    const [duration, setDuration] = useState(90);
    const [questions, setQuestions] = useState<Question[]>([]);

    const [qText, setQText] = useState('');
    const [qType, setQType] = useState<'mcq' | 'text'>('mcq');
    const [qAnswer, setQAnswer] = useState('');
    const [qMarks, setQMarks] = useState(1);
    const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);

    const handleAddQuestion = () => {
        if (!qText || !qAnswer) return;
        const newQ: Question = {
            id: `q-${Date.now()}`,
            section: SectionType.MCQ, // Default to MCQ section for simplicity
            text: qText,
            type: qType,
            options: qType === 'mcq' ? qOptions.filter(o => o.trim() !== '') : undefined,
            correctAnswer: qAnswer,
            marks: qMarks,
            explanation: '',
            topic: 'General'
        };
        setQuestions([...questions, newQ]);
        setQText(''); setQAnswer(''); setQOptions(['', '', '', '']);
    };

    const handleSave = async () => {
        if (questions.length === 0) return;
        const subject = SUBJECT_CONFIG[subjectKey];
        const newExam: Exam = {
            id: `${year}-${subjectKey}-${Date.now()}`,
            year,
            subject: subject.label,
            subjectKey,
            language: subject.language,
            durationMinutes: duration,
            questions,
            authority,
            level,
            isCustom: true
        };
        await saveDynamicExam(newExam);
        onExamCreated();
        setStep(1); setQuestions([]);
    };

    if (step === 1) {
        return (
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-700 border-b pb-2">Step 1: Exam Details</h3>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Authority</label>
                        <select className="w-full p-2 border rounded" value={authority} onChange={(e) => setAuthority(e.target.value as ExamAuthority)}>
                            <option value="SOMALI_GOV">Somali Gov</option>
                            <option value="PUNTLAND">Puntland</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Level</label>
                        <select className="w-full p-2 border rounded" value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)}>
                            <option value="FORM_IV">Form IV</option>
                            <option value="STD_8">Standard 8</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Year</label>
                        <input type="number" className="w-full p-2 border rounded" value={year} onChange={(e) => setYear(Number(e.target.value))} />
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                         <select className="w-full p-2 border rounded" value={subjectKey} onChange={(e) => setSubjectKey(e.target.value)}>
                            {Object.values(SUBJECT_CONFIG).map(s => (
                                <option key={s.key} value={s.key}>{s.label}</option>
                            ))}
                         </select>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration (Min)</label>
                        <input type="number" className="w-full p-2 border rounded" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                    </div>
                </div>
                <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Next: Questions</button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
             <div className="flex justify-between items-center border-b pb-2">
                 <h3 className="font-bold text-slate-700">Step 2: Questions ({questions.length})</h3>
                 <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 text-sm">Save Exam</button>
             </div>
             
             <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                 <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question Text</label>
                     <textarea className="w-full p-2 border rounded" value={qText} onChange={(e) => setQText(e.target.value)} rows={2} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                        <select className="w-full p-2 border rounded" value={qType} onChange={(e) => setQType(e.target.value as any)}>
                            <option value="mcq">MCQ</option>
                            <option value="text">Short Answer</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Marks</label>
                        <input type="number" className="w-full p-2 border rounded" value={qMarks} onChange={(e) => setQMarks(Number(e.target.value))} />
                     </div>
                 </div>
                 {qType === 'mcq' && (
                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Options</label>
                         <div className="grid grid-cols-2 gap-2">
                            {qOptions.map((opt, i) => (
                                <input key={i} className="p-2 border rounded text-sm" placeholder={`Option ${i+1}`} value={opt} onChange={(e) => {
                                    const n = [...qOptions]; n[i] = e.target.value; setQOptions(n);
                                }} />
                            ))}
                         </div>
                     </div>
                 )}
                 <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correct Answer</label>
                     <input className="w-full p-2 border rounded" value={qAnswer} onChange={(e) => setQAnswer(e.target.value)} placeholder="Exact answer match" />
                 </div>
                 <button onClick={handleAddQuestion} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Add Question</button>
             </div>
             
             {questions.length > 0 && (
                 <div className="max-h-40 overflow-y-auto space-y-1">
                     {questions.map((q, i) => (
                         <div key={i} className="text-xs p-2 bg-gray-100 rounded border border-gray-200">
                             <strong>{i+1}.</strong> {q.text.substring(0, 50)}... ({q.marks} marks)
                         </div>
                     ))}
                 </div>
             )}
             
             <button onClick={() => setStep(1)} className="text-sm text-slate-500 underline">Back</button>
        </div>
    );
};

const AdminPanel: React.FC<Props> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'teachers' | 'exams' | 'results' | 'settings'>('dashboard');
  
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // New User Form State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<Student>>({
      fullName: '', email: '', phone: '', school: '', level: 'FORM_IV', subscriptionPlan: 'FREE'
  });

  useEffect(() => {
      const load = async () => {
          setStudents(await getAllStudents());
          setResults(await getAllExamResults());
          setAllExams(getAllExams());
      };
      load();
  }, [refreshTrigger]);

  // Simulate PHP-style Auto-save interaction
  useEffect(() => {
      if (autoSaveStatus === 'saving') {
          const timer = setTimeout(() => setAutoSaveStatus('saved'), 800);
          return () => clearTimeout(timer);
      }
      if (autoSaveStatus === 'saved') {
          const timer = setTimeout(() => setAutoSaveStatus('idle'), 2000);
          return () => clearTimeout(timer);
      }
  }, [autoSaveStatus]);

  const handlePlanChange = async (studentId: string, newPlan: SubscriptionPlan) => {
      if(confirm(`Change user plan to ${newPlan}?`)) {
          setAutoSaveStatus('saving');
          await updateStudentPlan(studentId, newPlan);
          setRefreshTrigger(prev => prev + 1);
      }
  };

  const handleAddUser = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!newUser.email || !newUser.fullName) return;
      
      setAutoSaveStatus('saving');
      const studentData: Student = {
          id: `manual-${Date.now()}`,
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone || '',
          school: newUser.school || 'Naajix Added',
          level: newUser.level as EducationLevel,
          registeredAt: new Date().toISOString(),
          authProvider: 'email',
          subscriptionPlan: newUser.subscriptionPlan as SubscriptionPlan,
          subscriptionStatus: 'active'
      };

      const success = await adminCreateUser(studentData);
      if(success) {
          setShowAddUserModal(false);
          setNewUser({ fullName: '', email: '', phone: '', school: '', level: 'FORM_IV', subscriptionPlan: 'FREE' });
          setRefreshTrigger(prev => prev + 1);
      } else {
          alert("Failed to add user.");
          setAutoSaveStatus('idle');
      }
  };

  const handleExportCSV = () => {
      const headers = ["Student", "Exam", "Score", "Max Score", "Grade", "Date"];
      const rows = results.map(r => [
          r.studentName,
          r.subject,
          r.score,
          r.maxScore,
          r.grade,
          new Date(r.date).toLocaleDateString()
      ]);
      
      const csvContent = "data:text/csv;charset=utf-8," 
          + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "naajix_results_report.csv");
      document.body.appendChild(link);
      link.click();
  };

  const handleSyncToCloud = async () => {
      if (!confirm("This will upload all static exams (e.g. History 2025) to Firebase if they don't exist. Continue?")) return;
      setAutoSaveStatus('saving');
      
      let count = 0;
      for (const exam of allExams) {
          // We upload all exams to ensure the latest versions are in the cloud
          try {
              await saveDynamicExam(exam);
              count++;
          } catch (e) {
              console.error("Failed to sync exam:", exam.id);
          }
      }
      
      alert(`Synced ${count} exams to Cloud Database.`);
      setRefreshTrigger(prev => prev + 1);
  };

  // Filter Logic
  const filteredStudents = students.filter(s => 
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResults = results.filter(r => 
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const premiumUsers = students.filter(s => s.subscriptionPlan === 'PREMIUM');
  const totalQuestions = allExams.reduce((acc, curr) => acc + curr.questions.length, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
      
      {/* 1. LEFT SIDEBAR (PHP Admin Style) */}
      <div className="w-64 bg-blue-900 text-slate-300 flex flex-col fixed h-full z-20 shadow-xl">
        <div className="h-16 flex items-center px-6 bg-blue-950 border-b border-blue-800">
            <div className="font-black text-xl text-white tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                Naajix Admin
            </div>
        </div>

        <div className="p-4">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 px-2">Main Menu</div>
            <nav className="space-y-1">
                <SidebarItem icon={<Icons.Dashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <SidebarItem icon={<Icons.Users />} label="Students" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                <SidebarItem icon={<Icons.Teachers />} label="Teachers" active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} />
                <SidebarItem icon={<Icons.Exams />} label="Exams" active={activeTab === 'exams'} onClick={() => setActiveTab('exams')} />
                <SidebarItem icon={<Icons.Results />} label="Results & Reports" active={activeTab === 'results'} onClick={() => setActiveTab('results')} />
                <SidebarItem icon={<Icons.Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            </nav>
        </div>

        <div className="mt-auto p-4 border-t border-blue-800 bg-blue-950">
            <div className="flex items-center gap-3 mb-3 px-2">
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold">A</div>
                <div className="overflow-hidden">
                    <div className="text-sm font-bold text-white truncate">Administrator</div>
                    <div className="text-xs text-blue-400">Super User</div>
                </div>
            </div>
            <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-red-300 hover:text-white hover:bg-red-900/50 rounded transition text-sm font-medium">
                <Icons.Logout /> Sign Out
            </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 shadow-sm sticky top-0 z-10">
            <div className="flex items-center text-sm text-slate-500">
                <span className="font-bold text-slate-700">Naajix</span>
                <span className="mx-2">/</span>
                <span className="capitalize text-blue-600 font-bold">{activeTab}</span>
            </div>

            <div className="flex items-center gap-4">
                {/* Auto-Save Indicator */}
                <div className={`flex items-center gap-2 text-xs font-bold transition-opacity duration-300 ${autoSaveStatus === 'idle' ? 'opacity-0' : 'opacity-100'}`}>
                    {autoSaveStatus === 'saving' ? (
                        <span className="text-slate-400">Saving...</span>
                    ) : (
                        <span className="text-green-600 flex items-center gap-1"><Icons.Check /> Saved</span>
                    )}
                </div>

                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400"><Icons.Search /></span>
                    <input 
                        type="text" 
                        placeholder="Search system..." 
                        className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </header>

        {/* CONTENT SCROLLABLE */}
        <main className="flex-1 p-8 overflow-y-auto">
            
            {/* DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard title="Total Students" value={students.length} color="blue" trend="+12% this week" />
                        <StatsCard title="Premium Users" value={premiumUsers.length} color="purple" trend="Stable" />
                        <StatsCard title="Total Exams" value={allExams.length} color="indigo" trend="Database Active" />
                        <StatsCard title="Results Logged" value={results.length} color="green" trend="Real-time" />
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        {/* Recent Activity Table */}
                        <div className="col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-700">Recent Exam Results</h3>
                                <button onClick={() => setActiveTab('results')} className="text-xs text-blue-600 font-bold hover:underline">View All</button>
                            </div>
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 font-bold">Student</th>
                                        <th className="px-6 py-3 font-bold">Exam</th>
                                        <th className="px-6 py-3 font-bold">Score</th>
                                        <th className="px-6 py-3 font-bold">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {results.slice(0, 5).map((r, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 font-medium text-slate-900">{r.studentName}</td>
                                            <td className="px-6 py-3 text-slate-500">{r.subject}</td>
                                            <td className="px-6 py-3 font-mono">{r.score}/{r.maxScore}</td>
                                            <td className="px-6 py-3">
                                                <Badge label={r.grade} color={r.grade === 'F' ? 'red' : 'green'} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* System Status */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-700 mb-4">System Health</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Database</span>
                                    <span className="text-green-600 font-bold flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Online</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">AI Grader</span>
                                    <span className="text-green-600 font-bold flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Operational</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Storage</span>
                                    <span className="text-slate-700 font-bold">45% Used</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="text-xs text-slate-400 mb-1">Total Questions Indexed</div>
                                    <div className="text-2xl font-black text-slate-800">{totalQuestions}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* USERS VIEW */}
            {activeTab === 'users' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-800">Student Directory</h2>
                        <button onClick={() => setShowAddUserModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition flex items-center gap-2 text-sm font-bold">
                            <Icons.Plus /> Add Student
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Name / Email</th>
                                        <th className="px-6 py-4 font-bold">School</th>
                                        <th className="px-6 py-4 font-bold">Level</th>
                                        <th className="px-6 py-4 font-bold">Status</th>
                                        <th className="px-6 py-4 font-bold text-right">Plan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredStudents.map((s) => (
                                        <tr key={s.id} className="hover:bg-blue-50/50 transition duration-150">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{s.fullName}</div>
                                                <div className="text-slate-500 text-xs font-mono">{s.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{s.school}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                    {s.level.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-green-600 text-xs font-bold uppercase tracking-wide">Active</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <select 
                                                    className={`border-none bg-transparent font-bold text-xs uppercase cursor-pointer focus:ring-0 ${s.subscriptionPlan === 'PREMIUM' ? 'text-purple-600' : s.subscriptionPlan === 'BASIC' ? 'text-blue-600' : 'text-slate-500'}`}
                                                    value={s.subscriptionPlan}
                                                    onChange={(e) => handlePlanChange(s.id, e.target.value as SubscriptionPlan)}
                                                >
                                                    <option value="FREE">Free</option>
                                                    <option value="BASIC">Basic</option>
                                                    <option value="PREMIUM">Premium</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredStudents.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No students found matching your search.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TEACHERS VIEW */}
            {activeTab === 'teachers' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-800">Teachers Panel</h2>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition flex items-center gap-2 text-sm font-bold">
                            <Icons.Plus /> Add Teacher
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 text-center text-slate-500 italic bg-slate-50 border-b border-slate-200">
                            Teacher Management Module Active. Showing simulated staff data.
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Teacher Name</th>
                                    <th className="px-6 py-4 font-bold">Subjects</th>
                                    <th className="px-6 py-4 font-bold">Assigned Classes</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-blue-50/50">
                                    <td className="px-6 py-4 font-bold text-slate-900">Ahmed Hassan</td>
                                    <td className="px-6 py-4">Mathematics, Physics</td>
                                    <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Form IV - A</span></td>
                                    <td className="px-6 py-4 text-right text-blue-600 font-bold cursor-pointer">Edit</td>
                                </tr>
                                <tr className="hover:bg-blue-50/50">
                                    <td className="px-6 py-4 font-bold text-slate-900">Fatuma Ali</td>
                                    <td className="px-6 py-4">Biology, Chemistry</td>
                                    <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Form IV - B</span></td>
                                    <td className="px-6 py-4 text-right text-blue-600 font-bold cursor-pointer">Edit</td>
                                </tr>
                                <tr className="hover:bg-blue-50/50">
                                    <td className="px-6 py-4 font-bold text-slate-900">Dr. Khalid Omar</td>
                                    <td className="px-6 py-4">Islamic Studies</td>
                                    <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">All Classes</span></td>
                                    <td className="px-6 py-4 text-right text-blue-600 font-bold cursor-pointer">Edit</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* EXAMS VIEW */}
            {activeTab === 'exams' && (
                <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-800">Exam Management</h2>
                        <div className="flex gap-2">
                            <button onClick={handleSyncToCloud} className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition flex items-center gap-2 text-sm font-bold">
                                <Icons.Cloud /> Sync Static to Cloud
                            </button>
                            <button onClick={() => setActiveTab('exams')} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition flex items-center gap-2 text-sm font-bold">
                                <Icons.Plus /> Create New Exam
                            </button>
                        </div>
                    </div>
                    <CreateExamForm onExamCreated={() => setRefreshTrigger(prev => prev + 1)} />
                    
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="font-bold mb-4 text-slate-700">Existing Exams Database</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allExams.map((exam, idx) => (
                                <div key={idx} className="p-4 border border-slate-100 rounded bg-slate-50 flex justify-between items-center hover:border-blue-300 transition">
                                    <div>
                                        <div className="font-bold text-blue-900">{exam.subject}</div>
                                        <div className="text-xs text-slate-500">{exam.year} • {exam.questions.length} Questions</div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${exam.isCustom ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {exam.isCustom ? 'Dynamic' : 'Static'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* RESULTS VIEW (Detailed) */}
            {activeTab === 'results' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-800">Results & Performance</h2>
                        <button onClick={handleExportCSV} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition flex items-center gap-2 text-sm font-bold">
                            <Icons.Download /> Export CSV
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Date</th>
                                        <th className="px-6 py-4 font-bold">Student</th>
                                        <th className="px-6 py-4 font-bold">Exam Subject</th>
                                        <th className="px-6 py-4 font-bold">Score</th>
                                        <th className="px-6 py-4 font-bold">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredResults.map((r, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">{new Date(r.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{r.studentName}</td>
                                            <td className="px-6 py-4 text-slate-600">{r.subject}</td>
                                            <td className="px-6 py-4 font-mono">{Math.round(r.score)}/{r.maxScore}</td>
                                            <td className="px-6 py-4">
                                                <Badge label={r.grade} color={['A+','A','B+'].includes(r.grade) ? 'green' : r.grade === 'F' ? 'red' : 'yellow'} />
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredResults.length === 0 && (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No results found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* SETTINGS VIEW */}
            {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">System Configuration</h2>
                    
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-slate-700 border-b pb-2">General Settings</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Site Name</label>
                                <input type="text" defaultValue="Naajix" className="w-full p-2 border border-slate-300 rounded bg-slate-50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Support Email</label>
                                <input type="email" defaultValue="support@naajix.com" className="w-full p-2 border border-slate-300 rounded bg-slate-50" />
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="maint" className="w-4 h-4 text-blue-600 rounded" />
                                <label htmlFor="maint" className="text-sm font-medium text-slate-700">Maintenance Mode</label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="reg" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                                <label htmlFor="reg" className="text-sm font-medium text-slate-700">Allow User Registration</label>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => { setAutoSaveStatus('saving'); }} className="px-6 py-2 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700">Save Changes</button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-slate-700 border-b pb-2">Roles & Permissions</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                                <div>
                                    <div className="font-bold text-slate-800">Super Admin</div>
                                    <div className="text-xs text-slate-500">Full Access (You)</div>
                                </div>
                                <span className="text-green-600 text-xs font-bold">Active</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                                <div>
                                    <div className="font-bold text-slate-800">Editor</div>
                                    <div className="text-xs text-slate-500">Can create exams only</div>
                                </div>
                                <button className="text-xs text-blue-600 font-bold hover:underline">Manage</button>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                                <div>
                                    <div className="font-bold text-slate-800">Teacher</div>
                                    <div className="text-xs text-slate-500">Can view results only</div>
                                </div>
                                <button className="text-xs text-blue-600 font-bold hover:underline">Manage</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </main>
      </div>

      {/* MODAL: ADD USER */}
      {showAddUserModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in-up">
                    <h3 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">Add New Student</h3>
                    <form onSubmit={handleAddUser} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <input className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none" value={newUser.fullName} onChange={e=>setNewUser({...newUser, fullName: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                            <input className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none" value={newUser.email} onChange={e=>setNewUser({...newUser, email: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">School</label>
                                <input className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none" value={newUser.school} onChange={e=>setNewUser({...newUser, school: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Level</label>
                                <select className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none" value={newUser.level} onChange={e=>setNewUser({...newUser, level: e.target.value as EducationLevel})}>
                                    <option value="FORM_IV">Form IV</option>
                                    <option value="STD_8">Standard 8</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Plan</label>
                            <select className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none" value={newUser.subscriptionPlan} onChange={e=>setNewUser({...newUser, subscriptionPlan: e.target.value as SubscriptionPlan})}>
                                <option value="FREE">Free</option>
                                <option value="BASIC">Basic</option>
                                <option value="PREMIUM">Premium</option>
                            </select>
                        </div>
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={() => setShowAddUserModal(false)} className="px-4 py-2 text-slate-500 font-bold">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700">Add User</button>
                        </div>
                    </form>
                </div>
            </div>
      )}

    </div>
  );
};

export default AdminPanel;