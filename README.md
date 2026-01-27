
# Naajix

A professional, simulated examination platform designed for Standard 8 and  Form IV (Grade 12) students in Somalia. This application provides a realistic exam environment with timed sessions, multiple subjects, and AI-powered grading for open-ended questions.

## 🌟 Features

*   **Comprehensive Subject Support**: Includes Mathematics, Physics, Chemistry, Biology, History, Geography, Business, ICT, English, Arabic, and Islamic Studies.
*   **Realistic Simulation**: 2-hour timed exams with strict submission rules.
*   **Multi-Section Support**: Handles Multiple Choice (MCQ), Structured Questions, Reading Comprehension, and Essays.
*   **AI Grading**: Uses **Google Gemini API** to grade open-ended/essay questions and provide detailed feedback in English, Somali, or Arabic.
*   **Instant Feedback**: Immediate scoring and explanations for all questions.
*   **Performance Tracking**: Saves exam history and calculates grades locally.
*   **Bilingual Support**: Interface adapts for English and Arabic/Somali (RTL/LTR support).

## 🚀 Technologies

*   **Frontend**: React 19 (ESM via `importmap`), TypeScript
*   **Styling**: Tailwind CSS
*   **AI**: Google GenAI SDK (Gemini 1.5 Flash/Pro)
*   **Build**: No build step required for dev (ESM) / Standard React build for production.

## 🛠️ Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/isseshaie2050/Shaiye-EXAM.git
    cd Shaiye-EXAM
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
    *   *Note: Never commit your `.env` file to GitHub!*

4.  **Run the Application**
    ```bash
    npm start
    ```

## 📝 Git Commands used for this Repo

To push updates to this repository:

```bash
git add .
git commit -m "Update exam content"
git push origin main
```

### 🔐 Fix: "Sign in every time"
If GitHub asks for your username/password on every push, run the command below that matches your system:

**Replit / Linux / Mac:**
```bash
git config --global credential.helper store
```
*Note: You will need to sign in one last time after running this.*

**Windows:**
```bash
git config --global credential.helper manager
```

## 📚 Exam Structure (2025)

The platform currently includes the 2025 National Exam curriculum:
*   **Science**: Physics, Biology, Chemistry, Math
*   **Arts/Humanities**: History, Geography, Business
*   **Languages**: English, Arabic, Somali
*   **Technology**: ICT
*   **Religion**: Islamic Studies

## 📄 License

All Rights Reserved.
