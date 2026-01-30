
import React, { useState } from 'react';
import { EducationLevel, Student } from '../types';
import { logUserIn, registerStudent, loginWithGoogle, sendPasswordResetEmail } from '../services/storageService';

interface StudentAuthProps {
  onLoginSuccess: (student: Student) => void;
  onCancel: () => void;
}

const StudentAuth: React.FC<StudentAuthProps> = ({ onLoginSuccess, onCancel }) => {
  // Views: 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'
  const [viewState, setViewState] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'>('LOGIN');
  const [loading, setLoading] = useState(false);
  
  // Success States
  const [resetEmailSent, setResetEmailSent] = useState(false);

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
          id: '', 
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
          if (res.user) {
              // AUTO LOGIN AND REDIRECT
              onLoginSuccess(res.user);
          } else {
             // Fallback to login screen if user object missing (rare)
             setViewState('LOGIN');
             setError('Registration successful! Please log in.');
          }
      } else {
          setError(res.error || "Registration failed. Please try again.");
      }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if (!email) {
          setError("Please enter your email address.");
          return;
      }
      setLoading(true);
      const res = await sendPasswordResetEmail(email);
      setLoading(false);
      
      if (res.success) {
          setResetEmailSent(true);
      } else {
          setError(res.error || "Failed to send reset email. Please verify the address.");
      }
  };

  // --- RENDER STATES ---

  if (resetEmailSent) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center border border-gray-100">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                     <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Check Your Email</h2>
                <p className="text-slate-600 mb-6">We have sent a password reset link to <strong>{email}</strong>.</p>
                <button 
                    onClick={() => {
                        setResetEmailSent(false);
                        setViewState('LOGIN');
                    }}
                    className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow-lg"
                >
                    Back to Login
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

          {/* VIEW: LOGIN */}
          {viewState === 'LOGIN' && (
              <div className="space-y-4">
                  
                  {/* Google Login Button */}
                  <button 
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-3 bg-white text-slate-700 border border-slate-300 font-bold rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-3"
                  >
                     <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                        <path d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                     </svg>
                     Continue with Google
                  </button>

                  <div className="flex items-center gap-4 my-2">
                     <div className="h-px bg-slate-200 flex-1"></div>
                     <span className="text-xs text-slate-400 font-bold uppercase">Or Login with Email</span>
                     <div className="h-px bg-slate-200 flex-1"></div>
                  </div>

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
                        <div className="text-right mt-1">
                             <button type="button" onClick={() => { setViewState('FORGOT_PASSWORD'); setError(''); }} className="text-xs text-blue-600 font-bold hover:underline">
                                Forgot Password?
                             </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow-lg disabled:opacity-50">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </form>

                  <div className="text-center mt-4">
                      <span className="text-slate-500 text-sm">New student? </span>
                      <button type="button" onClick={() => { setViewState('REGISTER'); setError(''); }} className="text-blue-600 font-bold text-sm hover:underline">
                          Create Account
                      </button>
                  </div>
              </div>
          )}

          {/* VIEW: REGISTER */}
          {viewState === 'REGISTER' && (
              <form onSubmit={handleRegister} className="space-y-4">
                  
                   {/* Google Signup Button */}
                   <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-3 bg-white text-slate-700 border border-slate-300 font-bold rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-3 mb-4"
                  >
                     <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                        <path d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                     </svg>
                     Sign up with Google
                  </button>

                  <div className="flex items-center gap-4 mb-4">
                     <div className="h-px bg-slate-200 flex-1"></div>
                     <span className="text-xs text-slate-400 font-bold uppercase">Or Register with Email</span>
                     <div className="h-px bg-slate-200 flex-1"></div>
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
                      {loading ? 'Creating Account...' : 'Sign Up & Login'}
                  </button>
                  <button type="button" onClick={() => { setViewState('LOGIN'); setError(''); }} className="w-full py-2 text-slate-500 font-bold text-sm">
                      Back to Login
                  </button>
              </form>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {viewState === 'FORGOT_PASSWORD' && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="text-center mb-6">
                      <h3 className="font-bold text-slate-800 text-lg">Reset Password</h3>
                      <p className="text-xs text-slate-500 mt-1">Enter your email to receive a reset link.</p>
                  </div>

                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                      <input 
                          type="email" required 
                          value={email} onChange={e => setEmail(e.target.value)} 
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                          placeholder="student@example.com"
                      />
                  </div>

                  <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg mt-2 disabled:opacity-50">
                      {loading ? 'Sending...' : 'Send Verification Link'}
                  </button>

                  <button type="button" onClick={() => { setViewState('LOGIN'); setError(''); }} className="w-full py-2 text-slate-500 font-bold text-sm">
                      Cancel
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
