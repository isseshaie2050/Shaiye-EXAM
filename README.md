
# Naajix - Somali National Examination Platform

A professional, simulated examination platform designed for Form IV (Grade 12) and Standard 8 students in Somalia. This application provides a realistic exam environment with timed sessions, multiple subjects, and AI-powered grading for open-ended questions.

## 🌟 Features

*   **Comprehensive Subject Support**: Includes Mathematics, Physics, Chemistry, Biology, History, Geography, Business, ICT, English, Arabic, and Islamic Studies.
*   **Realistic Simulation**: Timed exams with strict submission rules.
*   **Multi-Section Support**: Handles Multiple Choice (MCQ), Structured Questions, Reading Comprehension, and Essays.
*   **AI Grading**: Uses **Google Gemini API** to grade open-ended/essay questions and provide detailed feedback in English, Somali, or Arabic.
*   **Instant Feedback**: Immediate scoring and explanations for all questions.
*   **Performance Tracking**: Saves exam history and calculates grades locally.
*   **Bilingual Support**: Interface adapts for English and Arabic/Somali (RTL/LTR support).

## 🚀 Technologies

*   **Frontend**: React 19 (ESM via `importmap`), TypeScript
*   **Styling**: Tailwind CSS
*   **AI**: Google GenAI SDK (Gemini 2.5/3 series)
*   **Backend**: Firebase (Authentication, Firestore)
*   **Build**: No build step required for dev (ESM) / Standard React build for production.

## 🛠️ Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/isseshaie2050/Naajix.git
    cd Naajix
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    *   Create a `.env` file in the root directory.
    *   Add your Google Gemini API key:
        ```
        API_KEY=your_google_gemini_api_key_here
        ```

4.  **Firebase Setup**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Create a new project.
    *   Enable **Authentication** (Email/Password & Google).
    *   Enable **Firestore Database** (start in Test Mode).
    *   Go to Project Settings, copy your **firebaseConfig** object.
    *   Open `services/firebase.ts` and paste your config there.

5.  **Run the Application**
    ```bash
    npm start
    ```

## 📚 Exam Structure

The platform currently includes the National Exam curriculum:
*   **Science**: Physics, Biology, Chemistry, Math
*   **Arts/Humanities**: History, Geography, Business
*   **Languages**: English, Arabic, Somali
*   **Technology**: ICT
*   **Religion**: Islamic Studies

## 📄 License

© 2026 Naajix. All Rights Reserved.
