
import React, { useState, useRef } from 'react';
import { AppState, Exam, Question, SectionType, SubjectConfig, ExamAuthority, EducationLevel } from '../types';
import { SUBJECT_CONFIG, EXAM_HIERARCHY } from '../constants';
import { saveDynamicExam, getAllExams, checkExamExists } from '../services/examService';
import { getAllStudents, getAllExamResults, exportDataToCSV } from '../services/storageService';

interface Props {
  onLogout: () => void;
}

const AdminPanel: React.FC<Props> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'bulk' | 'data'>('dashboard');
  
  // Dashboard Data
  const allExams = getAllExams();
  const allStudents = getAllStudents();
  const allResults = getAllExamResults();
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
                        <div className="text-slate-500 font-bold uppercase text-xs">Exams Taken</div>
                        <div className="text-4xl font-black text-purple-600 mt-2">{allResults.length}</div>
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
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Exam Repository</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-xs">
                                <tr>
                                    <th className="px-4 py-3">Exam ID</th>
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="px-4 py-3">Year</th>
                                    <th className="px-4 py-3">Questions</th>
                                    <th className="px-4 py-3">Source</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {allExams.map((exam, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-mono text-xs">{exam.id}</td>
                                        <td className="px-4 py-3 font-bold">{exam.subject}</td>
                                        <td className="px-4 py-3">{exam.year}</td>
                                        <td className="px-4 py-3">{exam.questions.length}</td>
                                        <td className="px-4 py-3">
                                            {exam.isCustom ? (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">Dynamic</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">Static</span>
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

// --- SUB-COMPONENT: BULK UPLOAD ---
const BulkUploadForm: React.FC = () => {
    const [authority, setAuthority] = useState<ExamAuthority>('SOMALI_GOV');
    const [level, setLevel] = useState<EducationLevel>('FORM_IV');
    const [subjectKey, setSubjectKey] = useState<string>('math');
    const [year, setYear] = useState<number>(2026);
    const [duration, setDuration] = useState<number>(120);
    const [language, setLanguage] = useState<'english'|'somali'|'arabic'>('english');
    
    const [mcqCsv, setMcqCsv] = useState('');
    const [structuredCsv, setStructuredCsv] = useState('');
    
    const [previewData, setPreviewData] = useState<Question[]>([]);
    const [error, setError] = useState<string | null>(null);

    const parseCSV = (text: string, type: 'mcq' | 'text'): Question[] => {
        const lines = text.trim().split('\n');
        const questions: Question[] = [];
        
        // Skip header if it exists
        const startIdx = lines[0].toLowerCase().includes('question_text') ? 1 : 0;

        for (let i = startIdx; i < lines.length; i++) {
            // Simple comma split (Assuming no commas in text for this basic parser, or handle simple quotes)
            // A more robust regex for CSV matching:
            const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            // Fallback simplistic split
            const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            
            if (cols.length < 2) continue; // Skip empty rows

            if (type === 'mcq') {
                // Expected: q_num, text, optA, optB, optC, optD, correct_letter (A/B/C/D)
                if (cols.length < 7) continue; 
                
                const qText = cols[1];
                const options = [cols[2], cols[3], cols[4], cols[5]];
                const correctLetter = cols[6].toUpperCase(); // A, B, C, D
                
                let correctAns = '';
                if (correctLetter === 'A') correctAns = options[0];
                else if (correctLetter === 'B') correctAns = options[1];
                else if (correctLetter === 'C') correctAns = options[2];
                else if (correctLetter === 'D') correctAns = options[3];
                else correctAns = correctLetter; // Fallback if they typed the full answer

                questions.push({
                    id: `bulk-mcq-${Date.now()}-${i}`,
                    section: SectionType.MCQ,
                    type: 'mcq',
                    text: qText,
                    options: options,
                    correctAnswer: correctAns,
                    marks: 1,
                    explanation: 'Uploaded via Bulk Tool',
                    topic: 'General'
                });
            } else {
                // Structured: q_num, text
                const qText = cols[1];
                questions.push({
                    id: `bulk-struct-${Date.now()}-${i}`,
                    section: SectionType.SHORT_ANSWER,
                    type: 'text',
                    text: qText,
                    correctAnswer: 'Teacher Review Required', // Or add column for model answer
                    marks: 5, // Default for structured
                    explanation: 'Uploaded via Bulk Tool',
                    topic: 'General'
                });
            }
        }
        return questions;
    };

    const handlePreview = () => {
        setError(null);
        setPreviewData([]);

        // 1. Validation: Check Exists
        if (checkExamExists(year, subjectKey)) {
            setError(`❌ An exam for ${SUBJECT_CONFIG[subjectKey].label} (${year}) already exists! Overwriting is blocked to prevent data loss.`);
            return;
        }

        try {
            const mcqs = mcqCsv ? parseCSV(mcqCsv, 'mcq') : [];
            const structs = structuredCsv ? parseCSV(structuredCsv, 'text') : [];
            
            if (mcqs.length === 0 && structs.length === 0) {
                setError("❌ No valid data found in CSV inputs.");
                return;
            }

            setPreviewData([...mcqs, ...structs]);
        } catch (e) {
            setError("❌ Error parsing CSV data. Please check format.");
        }
    };

    const handleSave = () => {
        if (previewData.length === 0) return;

        const config = SUBJECT_CONFIG[subjectKey];
        const newExam: Exam = {
            id: `bulk-${year}-${subjectKey}-${Date.now()}`,
            year,
            subject: config.label,
            subjectKey: subjectKey,
            language,
            durationMinutes: duration,
            questions: previewData,
            direction: language === 'arabic' ? 'rtl' : 'ltr',
            authority,
            level,
            isCustom: true
        };

        saveDynamicExam(newExam);
        alert(`✅ Successfully uploaded exam with ${previewData.length} questions!`);
        
        // Reset
        setPreviewData([]);
        setMcqCsv('');
        setStructuredCsv('');
    };

    const downloadTemplate = () => {
        const csvContent = "data:text/csv;charset=utf-8,question_number,question_text,option_a,option_b,option_c,option_d,correct_answer\n1,What is 2+2?,3,4,5,6,B\n2,Capital of Somalia?,Hargeisa,Mogadishu,Kismayo,Bosaso,B";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "naajix_mcq_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Bulk Exam Upload</h2>
            <p className="text-slate-500 mb-6 text-sm">Upload full exams via CSV. Please ensure no duplicate exams exist for the selected year.</p>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 grid md:grid-cols-3 gap-6">
                {/* Metadata Selectors (Same as manual) */}
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Authority</label>
                    <select value={authority} onChange={(e) => setAuthority(e.target.value as ExamAuthority)} className="w-full p-2 border rounded">
                        <option value="SOMALI_GOV">Somali Government</option>
                        <option value="PUNTLAND">Puntland State</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Level</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)} className="w-full p-2 border rounded">
                        <option value="FORM_IV">Form IV</option>
                        <option value="STD_8">Standard 8</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Subject</label>
                    <select value={subjectKey} onChange={(e) => setSubjectKey(e.target.value)} className="w-full p-2 border rounded">
                        {EXAM_HIERARCHY[authority][level].map(key => (
                            <option key={key} value={key}>{SUBJECT_CONFIG[key].label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Year</label>
                    <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full p-2 border rounded" />
                </div>
                 <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="w-full p-2 border rounded">
                        <option value="english">English</option>
                        <option value="somali">Somali</option>
                        <option value="arabic">Arabic</option>
                    </select>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* MCQs Input */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">1. Upload MCQs (CSV)</h3>
                        <button onClick={downloadTemplate} className="text-xs text-blue-600 hover:underline">Download Template</button>
                    </div>
                    <textarea 
                        className="w-full h-40 p-3 border rounded text-xs font-mono bg-gray-50"
                        placeholder={`Paste CSV content here...\nFormat: num, question, A, B, C, D, correct_letter`}
                        value={mcqCsv}
                        onChange={(e) => setMcqCsv(e.target.value)}
                    ></textarea>
                    <input 
                        type="file" 
                        accept=".csv"
                        className="mt-2 text-xs"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (evt) => setMcqCsv(evt.target?.result as string);
                                reader.readAsText(file);
                            }
                        }} 
                    />
                </div>

                {/* Structured Input */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">2. Upload Structured Qs (CSV)</h3>
                    <textarea 
                        className="w-full h-40 p-3 border rounded text-xs font-mono bg-gray-50"
                        placeholder={`Paste CSV content here...\nFormat: num, question_text`}
                        value={structuredCsv}
                        onChange={(e) => setStructuredCsv(e.target.value)}
                    ></textarea>
                     <input 
                        type="file" 
                        accept=".csv"
                        className="mt-2 text-xs"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (evt) => setStructuredCsv(evt.target?.result as string);
                                reader.readAsText(file);
                            }
                        }} 
                    />
                </div>
            </div>

            <div className="mt-8 flex gap-4">
                <button 
                    onClick={handlePreview}
                    className="px-6 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition"
                >
                    Validate & Preview
                </button>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="mt-6 p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg font-bold">
                    {error}
                </div>
            )}

            {/* PREVIEW & SAVE */}
            {previewData.length > 0 && !error && (
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
                    <h3 className="text-xl font-bold text-green-900 mb-4">Ready to Save</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div className="p-3 bg-white rounded border">
                            <span className="font-bold text-slate-500 block text-xs uppercase">Total Questions</span>
                            <span className="text-2xl font-black">{previewData.length}</span>
                        </div>
                        <div className="p-3 bg-white rounded border">
                            <span className="font-bold text-slate-500 block text-xs uppercase">Breakdown</span>
                            <span className="block">MCQs: {previewData.filter(q => q.type === 'mcq').length}</span>
                            <span className="block">Written: {previewData.filter(q => q.type === 'text').length}</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSave}
                        className="w-full py-4 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 shadow-lg transition"
                    >
                        Confirm & Upload Exam
                    </button>
                </div>
            )}
        </div>
    );
};

// --- SUB-COMPONENT: CREATE EXAM FORM (Existing) ---
const CreateExamForm: React.FC = () => {
    // Form State
    const [authority, setAuthority] = useState<ExamAuthority>('SOMALI_GOV');
    const [level, setLevel] = useState<EducationLevel>('FORM_IV');
    const [subjectKey, setSubjectKey] = useState<string>('math');
    const [year, setYear] = useState<number>(2026);
    const [duration, setDuration] = useState<number>(120);
    const [language, setLanguage] = useState<'english'|'somali'|'arabic'>('english');
    
    // Question Builder State
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQText, setNewQText] = useState('');
    const [newQType, setNewQType] = useState<'mcq' | 'text'>('mcq');
    const [newQSection, setNewQSection] = useState<SectionType>(SectionType.MCQ);
    const [newQMarks, setNewQMarks] = useState(1);
    const [newQCorrect, setNewQCorrect] = useState('');
    const [newQOptions, setNewQOptions] = useState(['', '', '', '']); // 4 options for MCQ
    const [newQImage, setNewQImage] = useState('');

    const addQuestion = () => {
        const q: Question = {
            id: `q-${Date.now()}`,
            text: newQText,
            type: newQType,
            section: newQSection,
            marks: newQMarks,
            correctAnswer: newQCorrect,
            explanation: "Added via Admin Panel",
            topic: "General",
            diagramUrl: newQImage || undefined,
            options: newQType === 'mcq' ? newQOptions.filter(o => o.trim() !== '') : undefined
        };
        setQuestions([...questions, q]);
        // Reset
        setNewQText('');
        setNewQCorrect('');
        setNewQOptions(['', '', '', '']);
    };

    const handleSaveExam = () => {
        if (questions.length === 0) {
            alert("Please add at least one question.");
            return;
        }
        
        const config = SUBJECT_CONFIG[subjectKey];
        
        const newExam: Exam = {
            id: `custom-${year}-${subjectKey}-${Date.now()}`,
            year,
            subject: config.label,
            subjectKey: subjectKey,
            language,
            durationMinutes: duration,
            questions: questions,
            direction: language === 'arabic' ? 'rtl' : 'ltr',
            authority,
            level,
            isCustom: true
        };

        saveDynamicExam(newExam);
        alert("Exam Saved Successfully!");
        setQuestions([]);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Exam</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Authority</label>
                    <select value={authority} onChange={(e) => setAuthority(e.target.value as ExamAuthority)} className="w-full p-2 border rounded">
                        <option value="SOMALI_GOV">Somali Government</option>
                        <option value="PUNTLAND">Puntland State</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Level</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)} className="w-full p-2 border rounded">
                        <option value="FORM_IV">Form IV</option>
                        <option value="STD_8">Standard 8</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Subject</label>
                    <select value={subjectKey} onChange={(e) => setSubjectKey(e.target.value)} className="w-full p-2 border rounded">
                        {EXAM_HIERARCHY[authority][level].map(key => (
                            <option key={key} value={key}>{SUBJECT_CONFIG[key].label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Year</label>
                    <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full p-2 border rounded" />
                </div>
                 <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="w-full p-2 border rounded">
                        <option value="english">English</option>
                        <option value="somali">Somali</option>
                        <option value="arabic">Arabic</option>
                    </select>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 border-l-4 border-l-blue-500">
                <h3 className="font-bold text-lg mb-4">Add Questions</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <select value={newQType} onChange={(e) => setNewQType(e.target.value as any)} className="p-2 border rounded">
                        <option value="mcq">Multiple Choice</option>
                        <option value="text">Text / Essay</option>
                    </select>
                    <select value={newQSection} onChange={(e) => setNewQSection(e.target.value as any)} className="p-2 border rounded">
                         {Object.values(SectionType).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                
                <textarea 
                    placeholder="Question Text (Supports **markdown**)" 
                    value={newQText} 
                    onChange={(e) => setNewQText(e.target.value)}
                    className="w-full p-3 border rounded mb-4 h-24"
                />
                
                 <input 
                    type="text" 
                    placeholder="Image URL (Optional)" 
                    value={newQImage} 
                    onChange={(e) => setNewQImage(e.target.value)} 
                    className="w-full p-2 border rounded mb-4" 
                />

                {newQType === 'mcq' && (
                    <div className="space-y-2 mb-4">
                        <p className="text-xs font-bold uppercase text-slate-500">Options</p>
                        {newQOptions.map((opt, i) => (
                            <input 
                                key={i} 
                                placeholder={`Option ${i+1}`} 
                                value={opt}
                                onChange={(e) => {
                                    const next = [...newQOptions];
                                    next[i] = e.target.value;
                                    setNewQOptions(next);
                                }}
                                className="w-full p-2 border rounded"
                            />
                        ))}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <input 
                        placeholder="Correct Answer" 
                        value={newQCorrect}
                        onChange={(e) => setNewQCorrect(e.target.value)}
                        className="w-full p-2 border rounded bg-green-50 border-green-200 placeholder-green-700"
                    />
                    <input 
                        type="number"
                        placeholder="Marks"
                        value={newQMarks}
                        onChange={(e) => setNewQMarks(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <button onClick={addQuestion} className="w-full py-2 bg-slate-800 text-white font-bold rounded hover:bg-slate-900 transition">
                    + Add Question to Exam
                </button>
            </div>

            {/* Preview Added Questions */}
            {questions.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                    <h3 className="font-bold mb-4">Questions Added ({questions.length})</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {questions.map((q, i) => (
                            <div key={i} className="p-3 border rounded flex justify-between items-center text-sm">
                                <span className="truncate flex-1 font-medium">{i+1}. {q.text}</span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">{q.type}</span>
                                <span className="text-xs bg-blue-100 px-2 py-1 rounded ml-2 text-blue-700">{q.marks} marks</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t">
                        <button onClick={handleSaveExam} className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 shadow-lg transition">
                            💾 Save & Publish Exam
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPanel;
