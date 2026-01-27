
import React from 'react';

interface InfoPageProps {
  onBack: () => void;
}

const PageLayout: React.FC<{ title: string; children: React.ReactNode; onBack: () => void }> = ({ title, children, onBack }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
    <header className="bg-blue-900 text-white py-6 px-6 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
            <span className="font-black text-2xl tracking-tight">Naajix</span>
            <span className="text-blue-400">|</span>
            <h1 className="text-lg font-medium opacity-90">{title}</h1>
        </div>
        <button onClick={onBack} className="text-sm bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded transition font-bold">
          Back Home
        </button>
      </div>
    </header>
    <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-12">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
        {children}
      </div>
    </main>
    <footer className="bg-blue-900 text-slate-400 py-8 px-6 text-center">
      <p className="text-sm">© 2026 Naajix. All Rights Reserved.</p>
    </footer>
  </div>
);

export const AboutPage: React.FC<InfoPageProps> = ({ onBack }) => {
  return (
    <PageLayout title="About Us" onBack={onBack}>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">About Naajix</h2>
      <p className="mb-4 leading-relaxed text-slate-600">
        <strong>Naajix</strong> is an educational technology platform designed to support Somali students in preparing for national and regional examinations with confidence.
      </p>
      <p className="mb-4 leading-relaxed text-slate-600">
        Our mission is to provide a structured, reliable, and accessible exam-preparation experience aligned with official curricula. Naajix offers students the opportunity to practice through well-organized mock exams, including multiple-choice questions, direct questions, comprehension passages, and image-based assessments.
      </p>
      <p className="mb-4 leading-relaxed text-slate-600">
        We serve learners preparing for <strong>Somali Government Examinations</strong> and <strong>Puntland State Examinations</strong>, specifically for <strong>Standard 8</strong> and <strong>Form IV</strong> levels. By combining quality content with a simple and user-friendly digital experience, Naajix helps students measure their readiness, identify strengths and weaknesses, and improve performance.
      </p>
      <p className="leading-relaxed text-slate-600">
        Naajix is built with a strong focus on accuracy, fairness, and data protection, ensuring a secure and dependable platform for students, teachers, and parents.
      </p>
    </PageLayout>
  );
};

export const PrivacyPage: React.FC<InfoPageProps> = ({ onBack }) => {
  return (
    <PageLayout title="Privacy Policy" onBack={onBack}>
      <p className="mb-6 leading-relaxed text-slate-600">
        At <strong>Naajix</strong>, we value your privacy and are committed to protecting your personal information.
      </p>

      <h3 className="text-xl font-bold text-slate-800 mb-3">Information We Collect</h3>
      <p className="mb-6 leading-relaxed text-slate-600">
        We may collect basic user information such as name, email address, education level, and exam activity to provide and improve our services.
      </p>

      <h3 className="text-xl font-bold text-slate-800 mb-3">How We Use Your Information</h3>
      <p className="mb-2 leading-relaxed text-slate-600">Your information is used solely to:</p>
      <ul className="list-disc pl-6 mb-6 text-slate-600 space-y-1">
        <li>Provide access to exams and results</li>
        <li>Track learning progress</li>
        <li>Improve platform performance and user experience</li>
        <li>Maintain platform security</li>
      </ul>
      <p className="mb-6 leading-relaxed text-slate-600">
        We do <strong>not</strong> sell, rent, or share personal data with third parties.
      </p>

      <h3 className="text-xl font-bold text-slate-800 mb-3">Data Security</h3>
      <p className="mb-6 leading-relaxed text-slate-600">
        Naajix uses appropriate technical and organizational measures to protect user data from unauthorized access, loss, or misuse. All data is stored securely and accessed only for legitimate educational purposes.
      </p>

      <h3 className="text-xl font-bold text-slate-800 mb-3">User Responsibility</h3>
      <p className="mb-6 leading-relaxed text-slate-600">
        Users are responsible for keeping their login credentials confidential. Any activity under a user account is the responsibility of the account holder.
      </p>

      <h3 className="text-xl font-bold text-slate-800 mb-3">Policy Updates</h3>
      <p className="leading-relaxed text-slate-600">
        This Privacy Policy may be updated from time to time. Continued use of Naajix indicates acceptance of any updates.
      </p>
    </PageLayout>
  );
};

export const ContactPage: React.FC<InfoPageProps> = ({ onBack }) => {
  return (
    <PageLayout title="Contact Us" onBack={onBack}>
      <p className="mb-6 leading-relaxed text-slate-600">
        If you have any questions, feedback, or support requests, please contact us at:
      </p>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 inline-block">
        <span className="font-bold text-slate-800">Email:</span>{' '}
        <a href="mailto:contact@naajix.com" className="text-blue-600 hover:underline font-medium">
          contact@naajix.com
        </a>
      </div>

      <p className="mt-6 leading-relaxed text-slate-600">
        We aim to respond to all inquiries as promptly as possible.
      </p>
    </PageLayout>
  );
};
