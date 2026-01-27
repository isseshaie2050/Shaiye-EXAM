
import React, { useState } from 'react';
import { Exam, Question, SectionType, SubjectConfig, ExamAuthority, EducationLevel } from '../types';
import { SUBJECT_CONFIG } from '../constants';
import { saveDynamicExam, getAllExams } from '../services/examService';
import { getAllStudents, getAllExamResults, exportDataToCSV, getLoginHistory, getActiveSessions, forceLogoutUser } from '../services/storageService';

interface Props {
  onLogout: () => void;
}

const AdminPanel: React.FC<Props> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'bulk' | 'data' | 'security'>('dashboard');
  
  // Dashboard Data
  const allExams = getAllExams();
  const allStudents = getAllStudents();
  const allResults = getAllExamResults();
  const loginHistory = getLoginHistory();
  const activeSessions = getActiveSessions();
  const totalQuestions = allExams.reduce((acc, curr) => acc + curr.questions.length, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
        <div className="p-6 text-white font-bold text-lg tracking-tight border-b border-slate-800 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            Naajix – Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            Security & Sessions
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'data' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            Student Data
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'create' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            Manage Exams (Manual)
          </button>
          <button 
            onClick={() => setActiveTab('bulk')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'bulk' ? 'bg-purple-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            Bulk Upload 🚀
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
           <button onClick={onLogout} className="w-full px-4 py-2 text-red-400 hover:text-white hover:bg-red-900 rounded transition text-sm font-bold">Sign Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {activeTab === 'dashboard' && (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-slate-800">Platform Overview</h2>
                
                <div className="grid grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 font-bold uppercase text-xs">Total Students</div>
                        <div className="text-4xl font-black text-slate-800 mt-2">{allStudents.length}</div>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 font-bold uppercase text-xs">Active Sessions</div>
                        <div className="text-4xl font-black text-purple-600 mt-2">{activeSessions.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 font-bold uppercase text-xs">Total Exams</div>
                        <div className="text-4xl font-black text-blue-600 mt-2">{allExams.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 font-bold uppercase text-xs">Total Questions</div>
                        <div className="text-4xl font-black text-green-600 mt-2">{totalQuestions}</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Recent Login Activity</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                             <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-xs sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Time</th>
                                    <th className="px-4 py-3">IP</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loginHistory.slice(0, 5).map((log, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-bold">{log.userName}</td>
                                        <td className="px-4 py-3 capitalize">{log.role}</td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{new Date(log.loginTime).toLocaleString()}</td>
                                        <td className="px-4 py-3 font-mono text-xs">{log.ipAddress}</td>
                                        <td className="px-4 py-3">
                                            {log.isActive ? (
                                                <span className="text-green-600 font-bold text-xs">Active</span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Closed ({log.terminationReason})</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'security' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-slate-800">Security & Sessions</h2>
                </div>

                {/* Active Sessions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-slate-800">Active Sessions ({activeSessions.length})</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                             <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-xs sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Session ID</th>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Device</th>
                                    <th className="px-4 py-3">Last Active</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {activeSessions.length === 0 ? (
                                    <tr><td colSpan={6} className="p-4 text-center text-gray-400">No active sessions.</td></tr>
                                ) : (
                                    activeSessions.map((s, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-4 py-2 font-mono text-xs text-gray-500">{s.deviceSessionId}</td>
                                            <td className="px-4 py-2 font-bold">{s.userId}</td>
                                            <td className="px-4 py-2 capitalize">{s.role}</td>
                                            <td className="px-4 py-2 text-xs">{s.deviceName}</td>
                                            <td className="px-4 py-2 text-xs text-gray-500">{new Date(s.lastActiveAt).toLocaleString()}</td>
                                            <td className="px-4 py-2">
                                                <button 
                                                    onClick={() => {
                                                        if(confirm('Are you sure you want to force logout this user?')) {
                                                            forceLogoutUser(s.userId);
                                                            window.location.reload(); 
                                                        }
                                                    }}
                                                    className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded hover:bg-red-200"
                                                >
                                                    Force Logout
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Login History */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-slate-800">Login History (Audit Log)</h3>
                    </div>
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="w-full text-left text-sm">
                             <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-xs sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Time</th>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Method</th>
                                    <th className="px-4 py-3">IP Address</th>
                                    <th className="px-4 py-3">Device Info</th>
                                    <th className="px-4 py-3">Duration</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loginHistory.map((log, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="px-4 py-2 text-xs text-gray-500">{new Date(log.loginTime).toLocaleString()}</td>
                                        <td className="px-4 py-2 font-bold">
                                            {log.userName}
                                            <span className="block text-xs text-gray-400 font-normal capitalize">{log.role}</span>
                                        </td>
                                        <td className="px-4 py-2 capitalize">{log.loginMethod}</td>
                                        <td className="px-4 py-2 font-mono text-xs">{log.ipAddress}</td>
                                        <td className="px-4 py-2 text-xs truncate max-w-[200px]" title={log.deviceInfo}>{log.deviceInfo}</td>
                                        <td className="px-4 py-2 text-xs">
                                            {log.logoutTime ? (
                                                Math.round((new Date(log.logoutTime).getTime() - new Date(log.loginTime).getTime()) / 60000) + ' mins'
                                            ) : (
                                                <span className="text-green-600 font-bold">Active</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-xs">
                                            {log.isActive ? (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Online</span>
                                            ) : (
                                                <span className="text-gray-500">
                                                    {log.terminationReason === 'user_logout' ? 'Logged Out' : 
                                                     log.terminationReason === 'device_conflict' ? 'Overwritten' : 
                                                     log.terminationReason === 'admin_force' ? 'Banned' : 'Timed Out'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
        )}

        {activeTab === 'data' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-slate-800">Data Management</h2>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-800">Registered Students</h3>
                        <button onClick={() => exportDataToCSV('students')} className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition">
                            Download CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto max-h-64 overflow-y-auto">
                        <table className="w-full text-left text-sm">
                             <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-xs sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Plan</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Expires</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {allStudents.length === 0 ? (
                                    <tr><td colSpan={5} className="p-4 text-center text-gray-400">No students found.</td></tr>
                                ) : (
                                    allStudents.map((s, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-4 py-2 font-bold">{s.fullName}</td>
                                            <td className="px-4 py-2 font-mono">{s.phone}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold 
                                                    ${s.subscriptionPlan === 'PREMIUM' ? 'bg-purple-100 text-purple-700' : 
                                                      s.subscriptionPlan === 'BASIC' ? 'bg-blue-100 text-blue-700' : 
                                                      'bg-gray-100 text-gray-700'}`}>
                                                    {s.subscriptionPlan}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                 <span className={`text-xs font-bold ${s.subscriptionStatus === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                                                     {s.subscriptionStatus.toUpperCase()}
                                                 </span>
                                            </td>
                                            <td className="px-4 py-2 text-gray-500 text-xs">
                                                {s.subscriptionEndDate ? new Date(s.subscriptionEndDate).toLocaleDateString() : '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Exam Results Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-800">Exam Results Log</h3>
                        <button onClick={() => exportDataToCSV('results')} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 transition">
                            Download CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="w-full text-left text-sm">
                             <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-xs sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Student</th>
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="px-4 py-3">Score</th>
                                    <th className="px-4 py-3">Grade</th>
                                    <th className="px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {allResults.length === 0 ? (
                                    <tr><td colSpan={5} className="p-4 text-center text-gray-400">No results found.</td></tr>
                                ) : (
                                    allResults.map((r, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-4 py-2 font-bold">{r.studentName}</td>
                                            <td className="px-4 py-2">{r.subject} ({r.year})</td>
                                            <td className="px-4 py-2 font-mono">{Math.round(r.score)}/{r.maxScore}</td>
                                            <td className="px-4 py-2">
                                                 <span className={`px-2 py-0.5 rounded text-xs font-bold ${['A+','A','B+','B'].includes(r.grade) ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                                                    {r.grade}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-gray-500 text-xs">{new Date(r.date).toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
        )}

        {activeTab === 'create' && <CreateExamForm />}
        
        {activeTab === 'bulk' && <BulkUploadForm />}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: CREATE EXAM FORM ---
const CreateExamForm: React.FC = () => {
    const [authority, setAuthority] = useState<ExamAuthority>('SOMALI_GOV');
    const [level, setLevel] = useState<EducationLevel>('FORM_IV');
    const [subjectKey, setSubjectKey] = useState<string>('math');
    const [year, setYear] = useState<number>(2026);
    const [duration, setDuration] = useState<number>(120);
    const [language, setLanguage] = useState<'english'|'somali'|'arabic'>('english');
    
    // Questions State
    const [questions, setQuestions] = useState<Question[]>([]);
    
    // Temp Question Input
    const [qText, setQText] = useState('');
    const [qType, setQType] = useState<'mcq'|'text'>('mcq');
    const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
    const [qCorrect, setQCorrect] = useState('');
    const [qMarks, setQMarks] = useState(1);
    const [qSection, setQSection] = useState<SectionType>(SectionType.MCQ);
    const [qTopic, setQTopic] = useState('');
    const [qExplanation, setQExplanation] = useState('');

    const addQuestion = () => {
        if (!qText || !qCorrect) {
            alert("Question text and correct answer are required.");
            return;
        }

        const newQ: Question = {
            id: `q-${Date.now()}`,
            section: qSection,
            text: qText,
            type: qType,
            options: qType === 'mcq' ? qOptions.filter(o => o.trim() !== '') : undefined,
            correctAnswer: qCorrect,
            marks: qMarks,
            topic: qTopic || 'General',
            explanation: qExplanation
        };

        setQuestions([...questions, newQ]);
        
        // Reset Inputs
        setQText('');
        setQCorrect('');
        setQOptions(['', '', '', '']);
        setQExplanation('');
    };

    const handleSaveExam = () => {
        if (questions.length === 0) {
            alert("Add at least one question.");
            return;
        }

        const subjectLabel = SUBJECT_CONFIG[subjectKey]?.label || subjectKey;

        const newExam: Exam = {
            id: `${subjectKey}-${year}-custom`,
            year,
            subject: subjectLabel,
            subjectKey,
            language,
            durationMinutes: duration,
            questions,
            authority,
            level,
            direction: language === 'arabic' ? 'rtl' : 'ltr',
            isCustom: true
        };

        saveDynamicExam(newExam);
        alert("Exam Saved Successfully!");
        setQuestions([]);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Create New Exam</h2>
            
            {/* Exam Metadata */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-1">Authority</label>
                    <select value={authority} onChange={(e) => setAuthority(e.target.value as ExamAuthority)} className="w-full p-2 border rounded">
                        <option value="SOMALI_GOV">Somali Govt</option>
                        <option value="PUNTLAND">Puntland</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Level</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)} className="w-full p-2 border rounded">
                        <option value="FORM_IV">Form IV</option>
                        <option value="STD_8">Standard 8</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Subject</label>
                    <select value={subjectKey} onChange={(e) => setSubjectKey(e.target.value)} className="w-full p-2 border rounded">
                        {Object.values(SUBJECT_CONFIG).map(s => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Year</label>
                    <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))} className="w-full p-2 border rounded" />
                </div>
                 <div>
                    <label className="block text-sm font-bold mb-1">Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="w-full p-2 border rounded">
                        <option value="english">English</option>
                        <option value="somali">Somali</option>
                        <option value="arabic">Arabic</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-bold mb-1">Duration (Minutes)</label>
                    <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="w-full p-2 border rounded" />
                </div>
            </div>

            {/* Question Editor */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="font-bold text-lg border-b pb-2">Add Question</h3>
                
                <div>
                    <label className="block text-sm font-bold mb-1">Question Text</label>
                    <textarea value={qText} onChange={e => setQText(e.target.value)} className="w-full p-2 border rounded h-24" placeholder="Enter question here..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Type</label>
                        <select value={qType} onChange={(e) => setQType(e.target.value as any)} className="w-full p-2 border rounded">
                            <option value="mcq">Multiple Choice</option>
                            <option value="text">Short Answer / Text</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Section</label>
                        <select value={qSection} onChange={(e) => setQSection(e.target.value as SectionType)} className="w-full p-2 border rounded">
                            <option value={SectionType.MCQ}>Section A (MCQ)</option>
                            <option value={SectionType.SHORT_ANSWER}>Section B (Short Answer)</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-bold mb-1">Marks</label>
                        <input type="number" value={qMarks} onChange={e => setQMarks(parseInt(e.target.value))} className="w-full p-2 border rounded" />
                    </div>
                     <div>
                        <label className="block text-sm font-bold mb-1">Topic (Optional)</label>
                        <input type="text" value={qTopic} onChange={e => setQTopic(e.target.value)} className="w-full p-2 border rounded" />
                    </div>
                </div>

                {qType === 'mcq' && (
                    <div className="grid grid-cols-2 gap-2">
                        {qOptions.map((opt, i) => (
                            <input 
                                key={i}
                                type="text" 
                                value={opt} 
                                onChange={e => {
                                    const newOpts = [...qOptions];
                                    newOpts[i] = e.target.value;
                                    setQOptions(newOpts);
                                }}
                                className="w-full p-2 border rounded"
                                placeholder={`Option ${i+1}`}
                            />
                        ))}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold mb-1">Correct Answer</label>
                    <input type="text" value={qCorrect} onChange={e => setQCorrect(e.target.value)} className="w-full p-2 border rounded" placeholder="Exact answer string" />
                </div>
                 <div>
                    <label className="block text-sm font-bold mb-1">Explanation (Feedback)</label>
                    <input type="text" value={qExplanation} onChange={e => setQExplanation(e.target.value)} className="w-full p-2 border rounded" />
                </div>

                <button onClick={addQuestion} className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Add Question to List</button>
            </div>

            {/* Questions List Preview */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-slate-700 mb-4">Questions ({questions.length})</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {questions.map((q, i) => (
                        <div key={i} className="bg-white p-3 rounded border text-sm flex justify-between">
                            <span className="truncate w-3/4 font-bold">{i+1}. {q.text}</span>
                            <span className="text-gray-500">{q.marks} marks</span>
                        </div>
                    ))}
                </div>
                <button onClick={handleSaveExam} className="w-full mt-4 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700">
                    Save Exam to Database
                </button>
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: BULK UPLOAD ---
const BulkUploadForm: React.FC = () => {
    const [authority, setAuthority] = useState<ExamAuthority>('SOMALI_GOV');
    const [level, setLevel] = useState<EducationLevel>('FORM_IV');
    const [subjectKey, setSubjectKey] = useState<string>('math');
    const [year, setYear] = useState<number>(2026);
    const [duration, setDuration] = useState<number>(120);
    const [language, setLanguage] = useState<'english'|'somali'|'arabic'>('english');
    
    const [mcqCsv, setMcqCsv] = useState('');
    
    const handleBulkUpload = () => {
        if (!mcqCsv) {
            alert("Please paste CSV data.");
            return;
        }

        const lines = mcqCsv.trim().split('\n');
        const questions: Question[] = [];

        lines.forEach((line, index) => {
            // Simple CSV parsing (Warning: doesn't handle commas inside quotes)
            const parts = line.split(',');
            if (parts.length >= 7) {
                const [text, opt1, opt2, opt3, opt4, correct, marksStr] = parts;
                questions.push({
                    id: `bulk-${Date.now()}-${index}`,
                    section: SectionType.MCQ,
                    text: text.trim(),
                    type: 'mcq',
                    options: [opt1.trim(), opt2.trim(), opt3.trim(), opt4.trim()],
                    correctAnswer: correct.trim(),
                    marks: parseInt(marksStr) || 1,
                    explanation: '',
                    topic: 'General'
                });
            }
        });

        if (questions.length === 0) {
            alert("No valid questions parsed.");
            return;
        }

        const subjectLabel = SUBJECT_CONFIG[subjectKey]?.label || subjectKey;
        const newExam: Exam = {
            id: `${subjectKey}-${year}-bulk`,
            year,
            subject: subjectLabel,
            subjectKey,
            language,
            durationMinutes: duration,
            questions,
            authority,
            level,
            direction: language === 'arabic' ? 'rtl' : 'ltr',
            isCustom: true
        };

        saveDynamicExam(newExam);
        alert(`Successfully imported ${questions.length} questions!`);
        setMcqCsv('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Bulk Upload (CSV)</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold mb-1">Authority</label>
                    <select value={authority} onChange={(e) => setAuthority(e.target.value as ExamAuthority)} className="w-full p-2 border rounded">
                        <option value="SOMALI_GOV">Somali Govt</option>
                        <option value="PUNTLAND">Puntland</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Level</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)} className="w-full p-2 border rounded">
                        <option value="FORM_IV">Form IV</option>
                        <option value="STD_8">Standard 8</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Subject</label>
                    <select value={subjectKey} onChange={(e) => setSubjectKey(e.target.value)} className="w-full p-2 border rounded">
                        {Object.values(SUBJECT_CONFIG).map(s => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Year</label>
                    <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))} className="w-full p-2 border rounded" />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold mb-2">Paste MCQ Data (CSV)</h3>
                <p className="text-xs text-gray-500 mb-2">Format: Question, OptA, OptB, OptC, OptD, CorrectAnswer, Marks</p>
                <textarea 
                    value={mcqCsv}
                    onChange={e => setMcqCsv(e.target.value)}
                    className="w-full h-64 p-4 border rounded font-mono text-xs"
                    placeholder={`What is 2+2?, 1, 2, 3, 4, 4, 1\nCapital of Somalia?, Hargeisa, Kismayo, Mogadishu, Baidoa, Mogadishu, 1`}
                />
                <button onClick={handleBulkUpload} className="mt-4 w-full py-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-700">
                    Parse & Upload Exam
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;
