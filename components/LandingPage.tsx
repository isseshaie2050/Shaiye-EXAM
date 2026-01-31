
import React, { useState, useEffect } from 'react';
import { ExamAuthority, AppState, Student } from '../types';

interface LandingPageProps {
  onSelectAuthority: (authority: ExamAuthority) => void;
  onNavigate: (view: AppState) => void;
  student: Student | null;
}

const HERO_SLIDES = [
  {
    id: 2,
    url: "https://shaiyecompany.com/wp-content/uploads/2026/01/landing-page-1.png",
    alt: "National examination setting"
  },
  {
    id: 3,
    url: "https://shaiyecompany.com/wp-content/uploads/2026/01/landing-page-2.png",
    alt: "Digital learning on Naajix"
  },
  {
    id: 4,
    url: "https://shaiyecompany.com/wp-content/uploads/2026/01/landing-page-3.png",
    alt: "Student collaboration"
  },
  {
    id: 5,
    url: "https://shaiyecompany.com/wp-content/uploads/2026/01/landing-page-4.png",
    alt: "Online examination interface"
  },
  {
    id: 6,
    url: "https://shaiyecompany.com/wp-content/uploads/2026/01/landing-page-5.png",
    alt: "Somali education future"
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ onSelectAuthority, onNavigate, student }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); // Change every 5 seconds for faster rotation with more images
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900 overflow-x-hidden">
      
      {/* 1. Dynamic Hero Section */}
      {/* Mobile: Stacked Layout (Image Top, Content Bottom). Desktop: Absolute Overlay. */}
      <header className="relative flex flex-col md:block md:min-h-[750px] bg-blue-900 overflow-hidden">
        
        {/* Navigation Overlay */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
           <div 
             className="text-white font-black text-2xl tracking-tight cursor-pointer hover:opacity-80 transition drop-shadow-md"
             onClick={() => onNavigate(AppState.HOME)}
           >
             Naajix
           </div>
           
           <div className="flex items-center gap-4">
               {student && (
                   <span className="hidden md:block text-white font-bold text-shadow-md bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                       Welcome back, {student.fullName.split(' ')[0]}! 👋
                   </span>
               )}
               <button 
                  onClick={() => onNavigate(AppState.DASHBOARD)}
                  className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-bold hover:bg-white hover:text-blue-900 transition shadow-lg"
                >
                  Student Portal
                </button>
           </div>
        </div>

        {/* Background Slider Wrapper */}
        {/* Mobile: Relative height (45vh). Desktop: Absolute full fill. */}
        <div className="relative w-full h-[45vh] md:absolute md:inset-0 md:h-full z-0">
          {HERO_SLIDES.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
               {/* Mobile: object-cover with center position to avoid aggressive cropping on sides */}
               <img 
                 src={slide.url} 
                 alt={slide.alt}
                 className={`w-full h-full object-cover object-center transition-transform duration-[6000ms] ease-out ${index === currentSlide ? 'scale-110' : 'scale-100'}`}
               />
            </div>
          ))}
          {/* Mobile Tint to ensure nav visibility if image is light */}
          <div className="absolute inset-0 bg-black/20 md:hidden"></div>
        </div>

        {/* Desktop Brand Overlays (Hidden on Mobile) */}
        <div className="hidden md:block absolute inset-0 bg-blue-900/90 mix-blend-multiply z-10"></div>
        <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/50 to-gray-50 z-20"></div>

        {/* Hero Content */}
        {/* Mobile: Solid Blue BG, stacked below image. Desktop: Transparent, centered over image. */}
        <div className="relative z-30 w-full md:max-w-5xl md:mx-auto text-center px-6 flex flex-col items-center py-12 md:pt-10 md:h-full md:justify-center bg-blue-900 md:bg-transparent">
          
          {/* Animated Logo Container with SOLID WHITE Circle Background */}
          <div className="w-48 md:w-80 mb-8 md:mb-10 animate-fade-in-up flex justify-center">
             <div className="bg-white rounded-full p-4 md:p-8 shadow-2xl flex items-center justify-center aspect-square">
                 <img 
                    src="https://shaiyecompany.com/wp-content/uploads/2026/01/naajix-logo-5.png" 
                    alt="Naajix Logo" 
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
             </div>
          </div>

          <div className="space-y-6 md:space-y-8 mb-10 md:mb-14">
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/30 px-6 py-2 md:px-8 md:py-3 rounded-full text-sm md:text-2xl font-black tracking-widest uppercase text-white shadow-xl mb-2 md:mb-4">
              The #1 Exam Platform for Somalia
            </div>
            
            <h1 className="text-3xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
              Master Your Exams.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Build Your Future.</span>
            </h1>
            
            <p className="text-blue-100 md:text-blue-50 text-base md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
              Professional preparation for <strong>Form IV</strong> & <strong>Standard 8</strong> national examinations. 
              Real past papers, AI grading, and instant results.
            </p>
          </div>
          
          <button 
             onClick={() => document.getElementById('authorities')?.scrollIntoView({behavior: 'smooth'})}
             className="group relative px-8 py-4 md:px-10 md:py-5 bg-white text-blue-900 rounded-2xl font-black text-lg md:text-xl hover:shadow-2xl hover:shadow-blue-900/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
              <span className="relative z-10 flex items-center gap-3">
                Start Practicing Now
                <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
              <div className="absolute inset-0 bg-gray-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
          </button>
        </div>
      </header>

      {/* 2. Authority Selection (Cards) */}
      {/* Negative margin pulls cards up. Adjusted for mobile to prevent overlap. */}
      <section id="authorities" className="py-20 px-6 relative z-30 -mt-10 md:-mt-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 w-full">
            
            {/* Somali Gov Card */}
            <div 
              onClick={() => onSelectAuthority('SOMALI_GOV')}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 cursor-pointer hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 group transform hover:-translate-y-2 flex flex-col items-center text-center h-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">Somali Government</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">Official curriculum exams for Federal Government schools. Includes past papers and predicted questions.</p>
              <div className="mt-auto flex gap-3">
                 <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md uppercase tracking-wider">Form IV</span>
                 <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md uppercase tracking-wider">Standard 8</span>
              </div>
            </div>

            {/* Puntland Card */}
            <div 
              onClick={() => onSelectAuthority('PUNTLAND')}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 cursor-pointer hover:shadow-2xl hover:border-green-500/30 transition-all duration-300 group transform hover:-translate-y-2 flex flex-col items-center text-center h-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
              <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-green-700 transition-colors">Puntland State</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">Comprehensive coverage of Puntland regional examinations with specific subject modules.</p>
              <div className="mt-auto flex gap-3">
                 <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md uppercase tracking-wider">Form IV</span>
                 <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md uppercase tracking-wider">Standard 8</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Stats & Trust (New) */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
              <div>
                  <div className="text-3xl font-black text-blue-900">5,000+</div>
                  <div className="text-sm text-slate-500 font-medium uppercase mt-1">Students</div>
              </div>
              <div>
                  <div className="text-3xl font-black text-blue-900">12+</div>
                  <div className="text-sm text-slate-500 font-medium uppercase mt-1">Subjects</div>
              </div>
              <div>
                  <div className="text-3xl font-black text-blue-900">24/7</div>
                  <div className="text-sm text-slate-500 font-medium uppercase mt-1">AI Grading</div>
              </div>
              <div>
                  <div className="text-3xl font-black text-blue-900">100%</div>
                  <div className="text-sm text-slate-500 font-medium uppercase mt-1">Free to Start</div>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Features Grid */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900">Everything You Need to Succeed</h2>
             <p className="text-slate-500 mt-2 max-w-2xl mx-auto">We combine traditional curriculum with modern technology to give you the best advantage.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h4 className="font-bold text-lg mb-2 text-slate-800">Official Exam Format</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Questions are formatted exactly like the real Ministry exams, helping you get comfortable with the structure.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h4 className="font-bold text-lg mb-2 text-slate-800">AI-Powered Grading</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Our advanced AI grades your essays and short answers instantly, providing personalized feedback.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h4 className="font-bold text-lg mb-2 text-slate-800">Detailed Analytics</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Track your progress over time. Identify your weak subjects and improve where it matters most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing Plans */}
      <section className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900">Simple, Affordable Pricing</h2>
                <p className="text-slate-500 mt-2">Invest in your education with our flexible plans.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* FREE PLAN */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition flex flex-col">
                    <div className="text-slate-500 font-bold uppercase text-xs mb-2 tracking-wide">Starter</div>
                    <div className="text-4xl font-black text-slate-800 mb-6">Free</div>
                    <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-600">
                        <li className="flex items-start gap-3"><span className="text-green-500 font-bold">✓</span> Access Somali Gov & Puntland</li>
                        <li className="flex items-start gap-3"><span className="text-green-500 font-bold">✓</span> <strong>5 Random Questions</strong> (Try It)</li>
                        <li className="flex items-start gap-3"><span className="text-orange-500 font-bold">!</span> Random questions only</li>
                        <li className="flex items-start gap-3"><span className="text-red-400 font-bold">✕</span> No Detailed Analytics</li>
                    </ul>
                    <button onClick={() => onNavigate(AppState.STUDENT_AUTH)} className="w-full py-3 bg-gray-100 text-slate-600 font-bold rounded-xl hover:bg-gray-200 transition">
                        Start Free
                    </button>
                </div>

                {/* BASIC PLAN */}
                <div className="bg-white p-8 rounded-2xl border-2 border-blue-500 shadow-xl relative overflow-hidden flex flex-col transform md:-translate-y-4 z-10">
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Most Popular</div>
                    <div className="text-blue-600 font-bold uppercase text-xs mb-2 tracking-wide">Basic</div>
                    <div className="flex items-baseline mb-6">
                        <span className="text-5xl font-black text-slate-900">$3</span>
                        <span className="text-slate-500 ml-1 font-medium">/month</span>
                    </div>
                    <div className="text-xs text-green-600 font-bold mb-4 bg-green-50 px-2 py-1 rounded inline-block">Save vs $40</div>
                    <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-600">
                        <li className="flex items-start gap-3"><span className="text-green-500 font-bold">✓</span> <strong>Full Exams (40+ Qs)</strong></li>
                        <li className="flex items-start gap-3"><span className="text-green-500 font-bold">✓</span> <strong>Access Std 8 AND Form 4</strong></li>
                        <li className="flex items-start gap-3"><span className="text-blue-500 font-bold">ℹ</span> <strong>Select ONE Authority:</strong></li>
                        <li className="pl-7 text-xs text-slate-400">Unlock either Somali Gov (Both Levels) OR Puntland (Both Levels).</li>
                    </ul>
                    <button onClick={() => onNavigate(AppState.STUDENT_AUTH)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                        Get Basic
                    </button>
                </div>

                {/* PREMIUM PLAN */}
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl flex flex-col text-white hover:-translate-y-1 transition hover:shadow-purple-900/20 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">Save 90% (vs $80)</div>
                    <div className="text-purple-400 font-bold uppercase text-xs mb-2 tracking-wide">Ultimate Access</div>
                    <div className="flex items-baseline mb-6">
                        <span className="text-5xl font-black">$6</span>
                        <span className="text-slate-400 ml-1 font-medium">/month</span>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
                        <li className="flex items-start gap-3"><span className="text-green-400 font-bold">✓</span> <strong>Everything in Basic</strong></li>
                        <li className="flex items-start gap-3"><span className="text-green-400 font-bold">✓</span> <strong>Access ALL 4 Categories</strong></li>
                        <li className="pl-7 text-xs text-slate-400 mb-1">Somali Gov (Std8 & Form4) + Puntland (Std8 & Form4)</li>
                        <li className="flex items-start gap-3"><span className="text-green-400 font-bold">✓</span> Advanced Analytics</li>
                        <li className="flex items-start gap-3"><span className="text-green-400 font-bold">✓</span> Priority AI Grading</li>
                    </ul>
                    <button onClick={() => onNavigate(AppState.STUDENT_AUTH)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg">
                        Get Premium
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-white border-t border-gray-200 text-slate-500 py-10 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="block text-blue-900 text-xl font-black mb-1">Naajix</span>
            <span className="text-sm">© 2026 Naajix. All Rights Reserved.</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => onNavigate(AppState.PRIVACY)} className="hover:text-blue-600 transition">Privacy Policy</button>
            <button onClick={() => onNavigate(AppState.CONTACT)} className="hover:text-blue-600 transition">Contact Us</button>
            <button onClick={() => onNavigate(AppState.ABOUT)} className="hover:text-blue-600 transition">About</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
