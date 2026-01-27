
import React, { useState, useEffect } from 'react';
import { getStudentExamHistory, getSubjectStats, logoutUser, upgradeStudentSubscription, validateCurrentSession } from '../services/storageService';
import { SubscriptionPlan, ExamAuthority, Student } from '../types';

interface Props {
  onBack: () => void;
}

const StudentDashboard: React.FC<Props> = ({ onBack }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
      // Async load user data
      const loadData = async () => {
          const { user } = await validateCurrentSession();
          
          if (user) {
              setStudent(user);
              // Fetch exam history linked to this user from Supabase
              const h = await getStudentExamHistory(user.id);
              setHistory(h);
              // Calculate stats
              const s = await getSubjectStats(user.id);
              setStats(s);
          }
          setLoading(false);
      };
      loadData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Loading your profile...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Access Denied. Please log in.</div>;

  const overallAverage = stats.length > 0 
    ? Math.round(stats.reduce((acc, curr) => acc + curr.average, 0) / stats.length) 
    : 0;
  
  const handleLogout = async () => {
      await logoutUser();
      onBack(); 
      // Force reload to clear any residual state
      window.location.reload(); 
  };

  const getDaysRemaining = () => {
      if (!student.subscriptionEndDate) return 0;
      const now = new Date();
      const end = new Date(student.subscriptionEndDate);
      const diffTime = end.getTime() - now.getTime();
      return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0; 
  };

  const daysRemaining = getDaysRemaining();

  const handleUpgrade = async (plan: SubscriptionPlan, authority?: ExamAuthority) => {
      if (!confirm(`Are you sure you want to upgrade to ${plan}? This is a simulation.`)) return;
      
      const updated = await upgradeStudentSubscription(student.id, plan, authority);
      if (updated) {
          setStudent(updated);
          setShowUpgradeModal(false);
          alert(`Successfully subscribed to ${plan} plan!`);
      } else {
          alert("Upgrade failed. Please check your connection.");
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-4">
             <div className="text-blue-900 font-black text-2xl tracking-tight">Naajix</div>
             <button onClick={onBack} className="text-sm text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                ← Home
             </button>
          </div>
          <div className="text-right flex items-center gap-4">
             <div className="text-right">
                <h1 className="text-xl font-bold text-slate-900">Student Dashboard</h1>
                <p className="text-xs text-slate-500 font-bold">Welcome, {student.fullName}</p>
             </div>
             <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded hover:bg-red-100 transition">
                 Logout
             </button>
          </div>
        </div>

        {/* --- SUBSCRIPTION STATUS BAR --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl 
                    ${student.subscriptionPlan === 'PREMIUM' ? 'bg-purple-600' : student.subscriptionPlan === 'BASIC' ? 'bg-blue-600' : 'bg-slate-400'}`}>
                    {student.subscriptionPlan[0]}
                </div>
                <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Current Plan</div>
                    <div className="text-2xl font-black text-slate-800">{student.subscriptionPlan}</div>
                    {student.subscriptionPlan !== 'FREE' && (
                        <div className={`text-xs font-bold ${daysRemaining <= 5 ? 'text-red-500 animate-pulse' : 'text-green-600'}`}>
                            {daysRemaining} days remaining
                        </div>
                    )}
                </div>
            </div>

            {student.subscriptionPlan === 'BASIC' && student.basicAuthority && (
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-center">
                    <div className="text-xs text-blue-500 font-bold uppercase">Locked Authority</div>
                    <div className="font-bold text-blue-900">{student.basicAuthority === 'SOMALI_GOV' ? 'Somali Gov' : 'Puntland'}</div>
                </div>
            )}

            <button 
                onClick={() => setShowUpgradeModal(true)}
                className={`px-6 py-3 rounded-lg font-bold text-white shadow-lg transition transform hover:-translate-y-0.5 
                ${student.subscriptionPlan === 'PREMIUM' ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}`}
            >
                {student.subscriptionPlan === 'FREE' ? 'Upgrade Plan 🚀' : 'Extend / Manage'}
            </button>
        </div>

        {/* 1. Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Exams Taken</div>
                <div className="text-4xl font-black text-blue-900">{history.length}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Overall Average</div>
                <div className={`text-4xl font-black ${overallAverage >= 50 ? 'text-green-600' : 'text-orange-500'}`}>{overallAverage}%</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Subjects Attempted</div>
                <div className="text-4xl font-black text-purple-600">{stats.length}</div>
            </div>
        </div>

        {/* 2. Performance Graph */}
        {student.subscriptionPlan === 'FREE' ? (
             <div className="bg-slate-100 p-8 rounded-xl border border-slate-200 text-center mb-8 relative overflow-hidden">
                 <div className="relative z-10">
                    <h3 className="text-lg font-bold text-slate-500 mb-2">Detailed Analytics Locked 🔒</h3>
                    <p className="text-slate-400 mb-4">Upgrade to Basic or Premium to see subject performance charts.</p>
                    <button onClick={() => setShowUpgradeModal(true)} className="text-blue-600 font-bold hover:underline">View Plans</button>
                 </div>
                 <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
             </div>
        ) : (
            stats.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Subject Performance</h3>
                    <div className="flex items-end space-x-4 h-64 overflow-x-auto pb-2">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center group min-w-[60px] flex-1">
                                <div className="relative w-full flex justify-center items-end h-full bg-gray-50 rounded-t-lg overflow-hidden">
                                    <div 
                                        className={`w-full max-w-[40px] transition-all duration-1000 ${stat.average >= 50 ? 'bg-blue-500' : 'bg-red-400'}`} 
                                        style={{ height: `${stat.average}%` }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded">
                                            {stat.average}%
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs font-bold text-slate-600 truncate w-full text-center" title={stat.subject}>
                                    {stat.subject}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        )}

        {/* 3. Recent History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-slate-800">Recent Exam History</h3>
            </div>
            {history.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No exams taken yet. Go take your first exam!</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-gray-50 text-slate-900 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Score</th>
                                <th className="px-6 py-4">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.map((record, idx) => (
                                <tr key={idx} className="hover:bg-blue-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{record.subject} ({record.year})</td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono">{Math.round(record.score)} / {record.maxScore}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${['A+','A','B+','B'].includes(record.grade) ? 'bg-green-100 text-green-700' : record.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {record.grade}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* UPGRADE MODAL */}
        {showUpgradeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                    <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                        <div>
                             <h2 className="text-2xl font-black">Naajix Plans</h2>
                             <p className="text-blue-200 text-sm">Invest in your future. Cancel anytime.</p>
                        </div>
                        <button onClick={() => setShowUpgradeModal(false)} className="text-gray-400 hover:text-white">✕</button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
                        <div className="grid md:grid-cols-3 gap-6">
                            
                            {/* FREE PLAN */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                                <div className="text-slate-500 font-bold uppercase text-xs mb-2">Starter</div>
                                <div className="text-3xl font-black text-slate-800 mb-4">Free</div>
                                <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-600">
                                    <li className="flex items-start gap-2"><span>✅</span> Access Somali Gov & Puntland</li>
                                    <li className="flex items-start gap-2"><span>❗</span> <strong>Limit: 5 Questions</strong> per exam</li>
                                    <li className="flex items-start gap-2"><span>❗</span> Random questions only</li>
                                    <li className="flex items-start gap-2"><span>❌</span> No Analytics</li>
                                </ul>
                                <button disabled className="w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-lg cursor-not-allowed">Current Plan</button>
                            </div>

                            {/* BASIC PLAN */}
                            <div className="bg-white p-6 rounded-xl border-2 border-blue-500 shadow-lg flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Popular</div>
                                <div className="text-blue-600 font-bold uppercase text-xs mb-2">Basic</div>
                                <div className="flex items-baseline mb-4">
                                    <span className="text-4xl font-black text-slate-900">$2</span>
                                    <span className="text-slate-500 ml-1">/mo</span>
                                </div>
                                <ul className="space-y-3 mb-6 flex-1 text-sm text-slate-600">
                                    <li className="flex items-start gap-2"><span>✅</span> <strong>Full Exams (40+ Qs)</strong></li>
                                    <li className="flex items-start gap-2"><span>✅</span> All Subjects (Std 8 & Form 4)</li>
                                    <li className="flex items-start gap-2"><span>❗</span> <strong>Select ONE Authority:</strong></li>
                                    <li className="pl-6 text-xs text-slate-500">Choose Somali Gov OR Puntland. Cannot switch for 30 days.</li>
                                </ul>
                                
                                <div className="space-y-2 mt-auto">
                                    <button 
                                        onClick={() => handleUpgrade('BASIC', 'SOMALI_GOV')}
                                        className="w-full py-2 bg-blue-50 text-blue-700 border border-blue-200 font-bold rounded hover:bg-blue-100 transition text-sm"
                                    >
                                        Select Somali Gov ($2)
                                    </button>
                                    <button 
                                        onClick={() => handleUpgrade('BASIC', 'PUNTLAND')}
                                        className="w-full py-2 bg-green-50 text-green-700 border border-green-200 font-bold rounded hover:bg-green-100 transition text-sm"
                                    >
                                        Select Puntland ($2)
                                    </button>
                                </div>
                            </div>

                            {/* PREMIUM PLAN */}
                            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-2xl flex flex-col text-white">
                                <div className="text-purple-400 font-bold uppercase text-xs mb-2">Ultimate</div>
                                <div className="flex items-baseline mb-4">
                                    <span className="text-4xl font-black">$3</span>
                                    <span className="text-slate-400 ml-1">/mo</span>
                                </div>
                                <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-300">
                                    <li className="flex items-start gap-2"><span className="text-green-400">✔</span> <strong>Everything in Basic</strong></li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✔</span> <strong>Access BOTH Authorities</strong></li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✔</span> Somali Gov AND Puntland</li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✔</span> Advanced Analytics</li>
                                    <li className="flex items-start gap-2"><span className="text-green-400">✔</span> Priority Grading</li>
                                </ul>
                                <button 
                                    onClick={() => handleUpgrade('PREMIUM')}
                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition shadow-lg mt-auto"
                                >
                                    Get Premium Access ($3)
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;
