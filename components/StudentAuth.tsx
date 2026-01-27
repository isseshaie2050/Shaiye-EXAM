
import React, { useState } from 'react';
import { EducationLevel, Student } from '../types';
import { logUserIn, registerStudent, loginWithGoogle } from '../services/storageService';

interface StudentAuthProps {
  onLoginSuccess: (student: Student) => void;
  onCancel: () => void;
}

const StudentAuth: React.FC<StudentAuthProps> = ({ onLoginSuccess, onCancel }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Registration Success State
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [level, setLevel] = useState<EducationLevel>('FORM_IV');
  
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const res = await loginWithGoogle();
    if (!res.success) {
        setLoading(false);
        setError(res.error || "Google login failed.");
    }
    // If success, Supabase will redirect the page automatically.
  };

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      const res = await logUserIn(email, password);
      
      setLoading(false);
      if (res.success && res.user) {
          onLoginSuccess(res.user);
      } else {
          if (res.error?.includes('Invalid login credentials')) {
               setError("Incorrect email or password.");
          } else if (res.error?.includes('Email not confirmed')) {
               setError("Please confirm your email address before logging in.");
          } else {
               setError(res.error || 'Login failed. Please check your credentials.');
          }
      }
  };

  const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!fullName || !school || !phone || !email || !password) {
          setError('Please fill all fields.');
          return;
      }
      
      if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
      }

      setLoading(true);

      const newStudent: Student = {
          id: '', // Will be assigned by DB
          fullName,
          email,
          phone,
          school,
          level,
          registeredAt: new Date().toISOString(),
          authProvider: 'email',
          subscriptionPlan: 'FREE',
          subscriptionStatus: 'active'
      };

      const res = await registerStudent(newStudent, password);
      
      setLoading(false);
      if (res.success) {
          setRegistrationSuccess(true);
          if (res.requiresConfirmation) {
              setConfirmationRequired(true);
          }
      } else {
          setError(res.error || "Registration failed. Please try again.");
      }
  };

  if (registrationSuccess) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center border border-gray-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Registration Successful!</h2>
                {confirmationRequired ? (
                    <div className="mb-6">
                        <p className="text-slate-600 mb-4">We have sent a confirmation link to <strong>{email}</strong>.</p>
                        <p className="text-sm text-blue-600 font-bold bg-blue-50 p-4 rounded-lg border border-blue-100">Please check your email and click the link to activate your account before logging in.</p>
                    </div>
                ) : (
                    <p className="text-slate-600 mb-6">Your account has been created successfully.</p>
                )}
                
                <button 
                    onClick={() => {
                        setRegistrationSuccess(false);
                        setIsRegistering(false); 
                        setPassword(''); 
                    }}
                    className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow-lg"
                >
                    Proceed to Login
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-blue-900 p-6 text-center">
          <h2 className="text-2xl font-black text-white mb-1">Naajix Portal</h2>
          <p className="text-blue-200 text-sm">Secure Student Access</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center font-bold animate-pulse">
              {error}
            </div>
          )}

          {/* GLOBAL GOOGLE SIGN IN (Available on both Login & Register) */}
          <div className="mb-6">
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 bg-white text-slate-700 border border-slate-300 font-bold rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-3"
              >
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                 {isRegistering ? 'Sign up with Google' : 'Continue with Google'}
              </button>
              
              <div className="flex items-center gap-4 my-6">
                 <div className="h-px bg-slate-200 flex-1"></div>
                 <span className="text-xs text-slate-400 font-bold uppercase">Or use Email</span>
                 <div className="h-px bg-slate-200 flex-1"></div>
              </div>
          </div>

          {!isRegistering ? (
              // LOGIN FORM
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" required 
                      value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="student@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                    <input 
                      type="password" required 
                      value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="••••••••"
                    />
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow-lg disabled:opacity-50">
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="text-center mt-4">
                      <span className="text-slate-500 text-sm">New student? </span>
                      <button type="button" onClick={() => { setIsRegistering(true); setError(''); }} className="text-blue-600 font-bold text-sm hover:underline">
                          Create an Account
                      </button>
                </div>
              </form>
          ) : (
              // REGISTER FORM
              <form onSubmit={handleRegister} className="space-y-4">
                  <div className="text-center mb-4">
                      <h3 className="font-bold text-slate-800 text-lg">Create Email Account</h3>
                  </div>
                  
                  <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-2 border rounded" placeholder="Ahmed Ali" />
                  </div>
                  
                   <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
                   </div>

                  <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                      <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded" placeholder="615xxxxxx" />
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">School Name</label>
                      <input type="text" required value={school} onChange={e => setSchool(e.target.value)} className="w-full p-2 border rounded" placeholder="Secondary School" />
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Grade Level</label>
                      <select value={level} onChange={e => setLevel(e.target.value as EducationLevel)} className="w-full p-2 border rounded bg-white">
                          <option value="FORM_IV">Form IV (Secondary)</option>
                          <option value="STD_8">Standard 8 (Middle)</option>
                      </select>
                  </div>

                   <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Create Password (Min 6 chars)</label>
                      <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" />
                   </div>

                  <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg mt-4 disabled:opacity-50">
                      {loading ? 'Creating Account...' : 'Sign Up'}
                  </button>
                  <button type="button" onClick={() => { setIsRegistering(false); setError(''); }} className="w-full py-2 text-slate-500 font-bold text-sm">
                      Back to Login
                  </button>
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
