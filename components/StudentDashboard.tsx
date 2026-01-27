
import React, { useState, useEffect } from 'react';
import { getStudentExamHistory, getSubjectStats, getCurrentStudent, logoutStudent } from '../services/storageService';
import { AppState } from '../types';

interface Props {
  onBack: () => void;
}

const StudentDashboard: React.FC<Props> = ({ onBack }) => {
  const student = getCurrentStudent();
  // If no student logged in (should be guarded by App.tsx, but safe check here)
  if (!student) return null;

  const history = getStudentExamHistory(student.id);
  const stats = getSubjectStats(student.id);

  const overallAverage = stats.length > 0 
    ? Math.round(stats.reduce((acc, curr) => acc + curr.average, 0) / stats.length) 
    : 0;
  
  const handleLogout = () => {
      logoutStudent();
      onBack(); // Effectively reloads app state via parent callback logic usually, or just goes home
      window.location.reload(); // Force reload to clear state cleanly
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-4">
             <div className="text-blue-900 font-black text-2xl tracking-tight">Naajix</div>
             <button onClick={onBack} className="text-sm text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                ← Home
             </button>
          </div>
          <div className="text-right flex items-center gap-4">
             <div>
                <h1 className="text-xl font-bold text-slate-900">Student Dashboard</h1>
                <p className="text-xs text-slate-500 font-bold">Welcome, {student.fullName}</p>
             </div>
             <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded hover:bg-red-100 transition">
                 Logout
             </button>
          </div>
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

        {/* 2. Performance Graph (CSS Bar Chart) */}
        {stats.length > 0 && (
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
                                <th className="px-6 py-4">Level / Year</th>
                                <th className="px-6 py-4">Score</th>
                                <th className="px-6 py-4">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.map((record, idx) => (
                                <tr key={idx} className="hover:bg-blue-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{record.subject}</td>
                                    <td className="px-6 py-4">{record.year}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono">{Math.round(record.score)} / {record.maxScore}</span>
                                        <span className="text-xs text-gray-400 ml-1">({Math.round((record.score/record.maxScore)*100)}%)</span>
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
      </div>
    </div>
  );
};

export default StudentDashboard;
