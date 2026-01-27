
import React, { useState } from 'react';
import { AppState, EducationLevel, Student } from '../types';
import { loginStudent, registerStudent } from '../services/storageService';

interface StudentAuthProps {
  onLoginSuccess: (student: Student) => void;
  onCancel: () => void;
}

const StudentAuth: React.FC<StudentAuthProps> = ({ onLoginSuccess, onCancel }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [level, setLevel] = useState<EducationLevel>('FORM_IV');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter your phone number.');
      return;
    }

    const student = loginStudent(phone);
    if (student) {
      onLoginSuccess(student);
    } else {
      setError('Student not found. Please register first.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !school) {
      setError('All fields are required.');
      return;
    }

    const newStudent: Student = {
      id: `STU-${Date.now()}`,
      fullName,
      phone,
      school,
      level,
      registeredAt: new Date().toISOString()
    };

    registerStudent(newStudent);
    onLoginSuccess(newStudent);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100">
        <div className="bg-blue-900 p-6 text-center">
          <h2 className="text-2xl font-black text-white mb-1">Naajix Student Portal</h2>
          <p className="text-blue-200 text-sm">Access exams, track progress, and succeed.</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          {isRegistering ? (
            <form onSubmit={handleRegister} className="space-y-4">
               <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Ahmed Ali"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number (Login ID)</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 615xxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">School Name</label>
                <input 
                  type="text" 
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Mogadishu Secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Grade Level</label>
                <select 
                  value={level} 
                  onChange={(e) => setLevel(e.target.value as EducationLevel)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="FORM_IV">Form IV (Secondary)</option>
                  <option value="STD_8">Standard 8 (Middle)</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg mt-2">
                Create Account
              </button>
              <div className="text-center mt-4">
                <span className="text-slate-500 text-sm">Already have an account? </span>
                <button type="button" onClick={() => { setIsRegistering(false); setError(''); }} className="text-blue-600 font-bold text-sm hover:underline">
                  Login here
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow-lg mt-2">
                Login
              </button>
              <div className="text-center mt-4">
                <span className="text-slate-500 text-sm">New student? </span>
                <button type="button" onClick={() => { setIsRegistering(true); setError(''); }} className="text-blue-600 font-bold text-sm hover:underline">
                  Register here
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 border-t pt-4 text-center">
             <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 text-sm font-medium">
               Cancel & Return Home
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAuth;
