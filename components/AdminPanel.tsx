
import React, { useState, useEffect } from 'react';
import { Exam, Question, SectionType, SubjectConfig, ExamAuthority, EducationLevel, Student, SubscriptionPlan } from '../types';
import { SUBJECT_CONFIG } from '../constants';
import { saveDynamicExam, getAllExams } from '../services/examService';
import { getAllStudents, getAllExamResults, updateStudentPlan, adminCreateUser } from '../services/storageService';

interface Props {
  onLogout: () => void;
}

const AdminPanel: React.FC<Props> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'create' | 'data'>('dashboard');
  
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // New User Form State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<Student>>({
      fullName: '', email: '', phone: '', school: '', level: 'FORM_IV', subscriptionPlan: 'FREE'
  });

  useEffect(() => {
      // Async fetches
      const load = async () => {
          setStudents(await getAllStudents());
          setResults(await getAllExamResults());
          setAllExams(getAllExams());
      };
      load();
  }, [activeTab, refreshTrigger]);

  const handlePlanChange = async (studentId: string, newPlan: SubscriptionPlan) => {
      if(confirm(`Change user plan to ${newPlan}?`)) {
          await updateStudentPlan(studentId, newPlan);
          setRefreshTrigger(prev => prev + 1);
      }
  };

  const handleAddUser = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!newUser.email || !newUser.fullName) return;
      
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
          alert("User added to database successfully.");
          setShowAddUserModal(false);
          setNewUser({ fullName: '', email: '', phone: '', school: '', level: 'FORM_IV', subscriptionPlan: 'FREE' });
          setRefreshTrigger(prev => prev + 1);
      } else {
          alert("Failed to add user.");
      }
  };

  // Filter Users
  const premiumUsers = students.filter(s => s.subscriptionPlan === 'PREMIUM');
  const basicUsers = students.filter(s => s.subscriptionPlan === 'BASIC');
  const freeUsers = students.filter(s => s.subscriptionPlan === 'FREE');

  const totalQuestions = allExams.reduce((acc, curr) => acc + curr.questions.length, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
        <div className="p-6 text-white font-bold text-lg tracking-tight border-b border-slate-800 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            Naajix Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            👥 User Management
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'create' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            📝 Manage Exams
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
           <button onClick={onLogout} className="w-full px-4 py-2 text-red-400 hover:text-white hover:bg-red-900 rounded transition text-sm font-bold">Sign Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        
        {/* ADD USER MODAL */}
        {showAddUserModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4">Add User to Database</h3>
                    <form onSubmit={handleAddUser} className="space-y-4">
                        <input className="w-full p-2 border rounded" placeholder="Full Name" value={newUser.fullName} onChange={e=>setNewUser({...newUser, fullName: e.target.value})} required />
                        <input className="w-full p-2 border rounded" placeholder="Email" type="email" value={newUser.email} onChange={e=>setNewUser({...newUser, email: e.target.value})} required />
                        <input className="w-full p-2 border rounded" placeholder="Phone" value={newUser.phone} onChange={e=>setNewUser({...newUser, phone: e.target.value})} />
                        <select className="w-full p-2 border rounded" value={newUser.subscriptionPlan} onChange={e=>setNewUser({...newUser, subscriptionPlan: e.target.value as any})}>
                            <option value="FREE">Free Tier</option>
                            <option value="BASIC">Basic Tier</option>
                            <option value="PREMIUM">Premium Tier</option>
                        </select>
                        <div className="flex gap-2 justify-end mt-4">
                            <button type="button" onClick={()=>setShowAddUserModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add User</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {activeTab === 'dashboard' && (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-slate-800">Platform Overview</h2>
                <div className="grid grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 font-bold uppercase text-xs">Total Users</div>
                        <div className="text-4xl font-black text-slate-800 mt-2">{students.length}</div>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 font-bold uppercase text-xs">Premium Users</div>
                        <div className="text-4xl font-black text-purple-600 mt-2">{premiumUsers.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 font-bold uppercase text-xs">Total Exams</div>
                        <div className="text-4xl font-black text-blue-600 mt-2">{allExams.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-slate-500 font-bold uppercase text-xs">Questions DB</div>
                        <div className="text-4xl font-black text-green-600 mt-2">{totalQuestions}</div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'users' && (
             <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-slate-800">User Management</h2>
                    <button onClick={() => setShowAddUserModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 shadow-lg flex items-center gap-2">
                        <span>+</span> Add User
                    </button>
                </div>

                {/* 1. PREMIUM USERS TABLE */}
                <div className="bg-white rounded-xl shadow-lg border border-purple-200 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-white border-b border-purple-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-purple-800 flex items-center gap-2">
                            <span className="text-xl">💎</span> Premium Users ({premiumUsers.length})
                        </h3>
                    </div>
                    <UserTable users={premiumUsers} onPlanChange={handlePlanChange} color="purple" />
                </div>

                {/* 2. BASIC USERS TABLE */}
                <div className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-blue-800 flex items-center gap-2">
                            <span className="text-xl">📘</span> Basic Users ({basicUsers.length})
                        </h3>
                    </div>
                    <UserTable users={basicUsers} onPlanChange={handlePlanChange} color="blue" />
                </div>

                {/* 3. FREE USERS TABLE */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
                            <span className="text-xl">🆓</span> Free Users ({freeUsers.length})
                        </h3>
                    </div>
                    <UserTable users={freeUsers} onPlanChange={handlePlanChange} color="gray" />
                </div>
             </div>
        )}

        {activeTab === 'create' && <CreateExamForm onExamCreated={() => setRefreshTrigger(prev => prev + 1)} />}
      </div>
    </div>
  );
};

const UserTable: React.FC<{ users: Student[], onPlanChange: (id: string, plan: SubscriptionPlan) => void, color: string }> = ({ users, onPlanChange, color }) => {
    if (users.length === 0) return <div className="p-6 text-center text-gray-400 italic">No users in this tier.</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className={`bg-${color}-50 text-${color}-900 uppercase font-bold text-xs`}>
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">School</th>
                        <th className="px-6 py-3">Level</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-3 font-bold text-slate-800">{s.fullName}</td>
                            <td className="px-6 py-3 text-slate-600 font-mono text-xs">{s.email}</td>
                            <td className="px-6 py-3 text-slate-600">{s.school}</td>
                            <td className="px-6 py-3">
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{s.level.replace('_', ' ')}</span>
                            </td>
                            <td className="px-6 py-3 text-right">
                                <select 
                                    className="border border-gray-300 rounded px-2 py-1 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={s.subscriptionPlan}
                                    onChange={(e) => onPlanChange(s.id, e.target.value as SubscriptionPlan)}
                                >
                                    <option value="FREE">Free</option>
                                    <option value="BASIC">Basic</option>
                                    <option value="PREMIUM">Premium</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const CreateExamForm: React.FC<{ onExamCreated: () => void }> = ({ onExamCreated }) => {
    const [jsonInput, setJsonInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJsonUpload = async () => {
        if (!jsonInput) return;
        setLoading(true);
        try {
            const examData = JSON.parse(jsonInput);
            // Basic validation
            if (!examData.id || !examData.year || !examData.subjectKey || !examData.questions) {
                alert("Invalid Exam JSON format. Must contain id, year, subjectKey, and questions.");
                setLoading(false);
                return;
            }

            await saveDynamicExam(examData);
            alert(`Exam '${examData.subject}' (${examData.year}) saved to Firebase successfully!`);
            setJsonInput('');
            onExamCreated();
        } catch (e) {
            console.error(e);
            alert("Error parsing JSON or saving to Firebase. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
             <div className="flex justify-between items-end">
                 <h2 className="text-3xl font-bold text-slate-800">Add New Exam</h2>
             </div>
             
             <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg mb-4 text-slate-700">Paste Exam JSON</h3>
                <p className="text-sm text-slate-500 mb-4">
                    Paste the full JSON object for the exam here. This will save it to the Firebase database, ensuring it persists across reloads.
                </p>
                <textarea 
                    className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder='{ "id": "eng-2025", "year": 2025, "subject": "English", "subjectKey": "english", ... }'
                    value={jsonInput}
                    onChange={e => setJsonInput(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={handleJsonUpload} 
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg disabled:opacity-50 transition"
                    >
                        {loading ? 'Saving to Database...' : 'Save Exam to Firebase'}
                    </button>
                </div>
             </div>
        </div>
    );
};

export default AdminPanel;
