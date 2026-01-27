
import React from 'react';
import { ExamAuthority, AppState } from '../types';

interface LandingPageProps {
  onSelectAuthority: (authority: ExamAuthority) => void;
  onNavigate: (view: AppState) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectAuthority, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
      {/* 1. Hero Section */}
      <header className="bg-blue-900 text-white pt-24 md:pt-10 pb-16 px-6 relative overflow-hidden">
        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex flex-col md:flex-row justify-between items-center z-50 gap-4 md:gap-0 bg-blue-900/90 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none shadow-md md:shadow-none">
           {/* Branding: Always Visible Name */}
           <div className="w-full md:w-auto flex justify-between items-center">
             <div 
               className="text-white font-black text-2xl tracking-tight cursor-pointer hover:opacity-90 transition"
               onClick={() => onNavigate(AppState.HOME)}
             >
               Naajix
             </div>
             {/* Mobile-only menu toggles could go here, but for now we just show buttons below or inline */}
           </div>

           <div className="flex gap-4 w-full md:w-auto justify-end">
              <button 
                onClick={() => onNavigate(AppState.DASHBOARD)}
                className="text-xs md:text-sm font-bold text-blue-200 hover:text-white transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span className="hidden xs:inline">Student Dashboard</span>
                <span className="inline xs:hidden">Login</span>
              </button>
              <button 
                 onClick={() => onNavigate(AppState.ADMIN_LOGIN)}
                 className="text-xs md:text-sm font-bold text-blue-200 hover:text-white transition"
              >
                Admin
              </button>
           </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center mt-4 md:mt-10">
          {/* Logo with White Circle Background - Responsive Size */}
          <div className="w-24 h-24 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-2xl p-2 md:p-4">
             <img 
                src="https://shaiyecompany.com/wp-content/uploads/2026/01/naajix_logo-removebg-preview.png" 
                alt="Naajix Logo" 
                className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="inline-block bg-blue-800 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold tracking-wider mb-4 uppercase text-blue-200">
            Somali National Exam Platform
          </div>
          <p className="text-lg md:text-2xl font-medium text-blue-100 mb-2">
            "Ku Guuleyso Imtixaankaaga"
          </p>
          <p className="text-blue-200 mb-8 max-w-lg mx-auto leading-relaxed text-sm md:text-base">
            The professional preparation platform for Form IV & Standard 8 national exams.
          </p>
          
          <button 
             onClick={() => document.getElementById('authorities')?.scrollIntoView({behavior: 'smooth'})}
             className="px-6 md:px-8 py-3 md:py-3.5 bg-white text-blue-900 rounded-lg font-bold text-base md:text-lg hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2 w-full md:w-auto"
          >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              Bilow Imtixaan
          </button>
        </div>
      </header>

      {/* 2. Exam Authority Selection (The Core Flow) */}
      <section id="authorities" className="py-12 px-6 max-w-5xl mx-auto -mt-10 relative z-20">
        <h2 className="text-center text-xl font-bold text-white mb-6 drop-shadow-md">Select Exam Authority</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div 
            onClick={() => onSelectAuthority('SOMALI_GOV')}
            className="bg-white p-8 rounded-xl shadow-lg border-2 border-transparent cursor-pointer hover:shadow-2xl hover:border-blue-500 transition group flex flex-col items-center text-center h-full"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-700">Somali Government Exams</h3>
            <p className="text-slate-600 mb-4">Official Federal Government curriculum and past papers.</p>
            <div className="mt-auto flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500">Form IV</span>
              <span className="px-3 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500">Standard 8</span>
            </div>
          </div>

          <div 
            onClick={() => onSelectAuthority('PUNTLAND')}
            className="bg-white p-8 rounded-xl shadow-lg border-2 border-transparent cursor-pointer hover:shadow-2xl hover:border-green-500 transition group flex flex-col items-center text-center h-full"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-700 group-hover:bg-green-600 group-hover:text-white transition shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-green-700">Puntland State Exams</h3>
            <p className="text-slate-600 mb-4">Comprehensive coverage of Puntland State regional examinations.</p>
            <div className="mt-auto flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500">Form IV</span>
              <span className="px-3 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500">Standard 8</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-blue-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h4 className="font-bold text-lg mb-2">Official Style</h4>
              <p className="text-sm text-slate-600">Practice with questions formatted exactly like the real Ministry exams.</p>
            </div>
            
            <div className="p-4">
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-purple-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h4 className="font-bold text-lg mb-2">Rich Content</h4>
              <p className="text-sm text-slate-600">Includes MCQs, Structured Questions, and Image-based analysis.</p>
            </div>

            <div className="p-4">
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-green-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="font-bold text-lg mb-2">Instant Results</h4>
              <p className="text-sm text-slate-600">Get graded instantly with detailed feedback and performance tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trust Section */}
      <section className="py-12 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Trusted by Students & Teachers</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-600 text-sm font-medium">✅ Accurate Curriculum</span>
            <span className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-600 text-sm font-medium">✅ Secure Platform</span>
            <span className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-600 text-sm font-medium">✅ Mobile Optimized</span>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-blue-900 text-slate-400 py-10 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="block text-white text-xl font-bold mb-1">Naajix</span>
            <span className="text-sm">© 2026 All Rights Reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-blue-200">
            <button onClick={() => onNavigate(AppState.PRIVACY)} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={() => onNavigate(AppState.CONTACT)} className="hover:text-white transition">Contact Us</button>
            <button onClick={() => onNavigate(AppState.ABOUT)} className="hover:text-white transition">About</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
