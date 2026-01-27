
import React, { useState } from 'react';
import { AppState, EducationLevel, Student, ActiveSession } from '../types';
import { 
    findStudentByEmail, 
    registerStudent, 
    checkDeviceConflict, 
    createNewSession, 
    generateOTP, 
    verifyOTP 
} from '../services/storageService';

interface StudentAuthProps {
  onLoginSuccess: (student: Student) => void;
  onCancel: () => void;
}

type AuthStep = 'LOGIN_CHOICE' | 'REGISTER_DETAILS' | 'OTP_VERIFY' | 'DEVICE_CONFLICT';

const StudentAuth: React.FC<StudentAuthProps> = ({ onLoginSuccess, onCancel }) => {
  const [step, setStep] = useState<AuthStep>('LOGIN_CHOICE');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [level, setLevel] = useState<EducationLevel>('FORM_IV');
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [authProvider, setAuthProvider] = useState<'email' | 'google'>('email');
  
  // Pending User State (Wait for OTP or Conflict)
  const [pendingStudent, setPendingStudent] = useState<Student | null>(null);
  const [conflictSession, setConflictSession] = useState<ActiveSession | null>(null);

  // --- ACTIONS ---

  const handleEmailLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      
      const student = findStudentByEmail(email);
      if (!student) {
          setError('Email not found. Please register.');
          return;
      }
      
      if (student.authProvider === 'email' && student.password !== password) {
          setError('Incorrect password.');
          return;
      }
      
      proceedToVerification(student);
  };

  const handleGoogleLogin = () => {
      // MOCK Google OAuth Flow
      const mockEmail = prompt("Simulating Google Login.\nEnter Gmail Address:", "student@gmail.com");
      if (!mockEmail) return;

      const student = findStudentByEmail(mockEmail);
      if (student) {
          // Existing user -> Verify
          proceedToVerification(student);
      } else {
          // New user -> Register
          setEmail(mockEmail);
          setAuthProvider('google');
          setStep('REGISTER_DETAILS');
      }
  };

  const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!fullName || !school || !phone) {
          setError('Please fill all fields.');
          return;
      }
      
      if (authProvider === 'email' && !password) {
          setError('Password is required.');
          return;
      }

      const newStudent: Student = {
          id: `STU-${Date.now()}`,
          fullName,
          email,
          phone,
          password: authProvider === 'email' ? password : undefined,
          school,
          level,
          registeredAt: new Date().toISOString(),
          authProvider,
          subscriptionPlan: 'FREE',
          subscriptionStatus: 'active'
      };

      // In a real app, we verify BEFORE saving. 
      // Here, we'll store in memory (pendingStudent) -> OTP -> Save to DB
      setPendingStudent(newStudent);
      generateOTP(email);
      setStep('OTP_VERIFY');
  };

  const proceedToVerification = (student: Student) => {
      setPendingStudent(student);
      
      // Check Single Device Rule
      const activeSession = checkDeviceConflict(student.id);
      if (activeSession) {
          setConflictSession(activeSession);
          setStep('DEVICE_CONFLICT');
      } else {
          generateOTP(student.email!);
          setStep('OTP_VERIFY');
      }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
      e.preventDefault();
      if (verifyOTP(otp)) {
          completeLogin();
      } else {
          setError('Invalid or expired code.');
      }
  };

  const handleForceLogout = () => {
      // User chose to kick other device
      if (pendingStudent) {
        // OTP is required even if force logging out (Security)
        generateOTP(pendingStudent.email!);
        setStep('OTP_VERIFY'); 
      }
  };

  const completeLogin = () => {
      if (!pendingStudent) return;
      
      // If registering new user
      if (!findStudentByEmail(pendingStudent.email!)) {
          registerStudent(pendingStudent);
      }

      // Create Session (this overwrites any old session in the DB, effectively kicking them)
      createNewSession(pendingStudent);
      onLoginSuccess(pendingStudent);
  };

  // --- RENDERERS ---

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
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center font-bold">
              {error}
            </div>
          )}

          {/* STEP 1: LOGIN CHOICE */}
          {step === 'LOGIN_CHOICE' && (
              <div className="space-y-6">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
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
                      <button type="submit" className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow-lg">
                          Login
                      </button>
                  </form>

                  <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                      <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
                  </div>

                  <button onClick={handleGoogleLogin} className="w-full py-3 border border-gray-300 bg-white text-slate-700 font-bold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Google
                  </button>

                  <div className="text-center mt-4">
                      <span className="text-slate-500 text-sm">New student? </span>
                      <button onClick={() => { setAuthProvider('email'); setStep('REGISTER_DETAILS'); setError(''); }} className="text-blue-600 font-bold text-sm hover:underline">
                          Register here
                      </button>
                  </div>
              </div>
          )}

          {/* STEP 2: REGISTER DETAILS */}
          {step === 'REGISTER_DETAILS' && (
              <form onSubmit={handleRegister} className="space-y-4">
                  <div className="text-center mb-4">
                      <h3 className="font-bold text-slate-800 text-lg">Create Account</h3>
                      <p className="text-xs text-slate-500">Please complete your profile</p>
                  </div>
                  
                  {authProvider === 'email' && (
                       <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
                       </div>
                  )}

                  <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-2 border rounded" placeholder="Ahmed Ali" />
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

                  {authProvider === 'email' && (
                       <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
                          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" />
                       </div>
                  )}

                  <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg mt-4">
                      Next: Verify Email
                  </button>
                  <button type="button" onClick={() => setStep('LOGIN_CHOICE')} className="w-full py-2 text-slate-500 font-bold text-sm">Cancel</button>
              </form>
          )}

          {/* STEP 3: OTP VERIFICATION */}
          {step === 'OTP_VERIFY' && (
              <form onSubmit={handleOtpVerify} className="space-y-6 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-3xl">📧</div>
                  <div>
                      <h3 className="font-bold text-slate-800 text-lg">Verify Email</h3>
                      <p className="text-sm text-slate-500 mt-2">
                          Koodh xaqiijin (OTP) ayaa loo diray <strong>{pendingStudent?.email}</strong>
                      </p>
                  </div>
                  
                  <input 
                      type="text" 
                      maxLength={6}
                      value={otp} 
                      onChange={e => setOtp(e.target.value.replace(/\D/g,''))} 
                      className="w-full p-4 border-2 border-blue-100 rounded-xl text-center text-2xl font-mono tracking-widest focus:border-blue-500 outline-none"
                      placeholder="000000"
                  />

                  <button type="submit" className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition shadow-lg">
                      Verify & Login
                  </button>
                  <button type="button" onClick={() => generateOTP(pendingStudent?.email!)} className="text-blue-600 text-sm font-bold hover:underline">
                      Resend Code
                  </button>
              </form>
          )}

          {/* STEP 4: DEVICE CONFLICT */}
          {step === 'DEVICE_CONFLICT' && conflictSession && (
              <div className="text-center space-y-6">
                   <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-3xl">⚠️</div>
                   <div>
                      <h3 className="font-bold text-slate-800 text-lg">Multiple Devices Detected</h3>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                          Akoonkaaga waxa uu hadda ka furan yahay qalab kale (<strong>{conflictSession.deviceName}</strong>). 
                          Nidaamka Naajix wuxuu ogol yahay hal qalab markiiba.
                      </p>
                      <p className="text-sm text-slate-600 mt-2 font-medium">
                          Ma rabtaa inaad halkaas ka xirto oo aad halkan ka gasho?
                      </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setStep('LOGIN_CHOICE')} className="py-3 border border-gray-300 text-slate-600 font-bold rounded-lg hover:bg-gray-50">
                          Cancel
                      </button>
                      <button onClick={handleForceLogout} className="py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-md">
                          Yes, Continue
                      </button>
                  </div>
              </div>
          )}

          {step === 'LOGIN_CHOICE' && (
               <div className="mt-8 border-t pt-4 text-center">
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 text-sm font-medium">
                    Cancel & Return Home
                    </button>
                </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAuth;
