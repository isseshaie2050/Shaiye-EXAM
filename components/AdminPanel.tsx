
import React, { useState } from 'react';
import { AppState, Exam, Question, SectionType, SubjectConfig, ExamAuthority, EducationLevel } from '../types';
import { SUBJECT_CONFIG, EXAM_HIERARCHY } from '../constants';
import { saveDynamicExam, getAllExams } from '../services/examService';

interface Props {
  onLogout: () => void;
}

const AdminPanel: React.FC<Props> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create'>('dashboard');
  
  // Dashboard Data
  const allExams = getAllExams();
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
            onClick={() => setActiveTab('create')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'create' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            Manage Exams
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
                
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 font-bold uppercase text-xs">Total Exams</div>
                        <div className="text-4xl font-black text-slate-800 mt-2">{allExams.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 font-bold uppercase text-xs">Total Questions</div>
                        <div className="text-4xl font-black text-blue-600 mt-2">{totalQuestions}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 font-bold uppercase text-xs">Authorities Active</div>
                        <div className="text-4xl font-black text-green-600 mt-2">2</div>
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

        {activeTab === 'create' && <CreateExamForm />}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: CREATE EXAM FORM ---
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
