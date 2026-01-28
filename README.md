
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
    *   *Note: Never commit your `.env` file to GitHub!*

4.  **Database Setup (Supabase)**
    *   Go to your Supabase Dashboard -> SQL Editor.
    *   Run the following SQL to set up tables and security policies. This script handles existing policies to avoid errors:

    ```sql
    -- 1. PROFILES TABLE
    create table if not exists public.profiles (
      id uuid references auth.users on delete cascade not null primary key,
      email text,
      full_name text,
      phone text,
      school text,
      education_level text,
      subscription_plan text default 'FREE',
      subscription_status text default 'active',
      subscription_end_date timestamp with time zone,
      basic_authority text,
      role text default 'student',
      updated_at timestamp with time zone,
      created_at timestamp with time zone default timezone('utc'::text, now())
    );

    alter table public.profiles enable row level security;

    -- Drop policies if they exist to prevent errors
    drop policy if exists "Users can insert their own profile" on public.profiles;
    drop policy if exists "Users can view own profile" on public.profiles;
    drop policy if exists "Users can update own profile" on public.profiles;

    -- Re-create policies
    create policy "Users can insert their own profile" on public.profiles
      for insert with check ( auth.uid() = id );

    create policy "Users can view own profile" on public.profiles
      for select using ( auth.uid() = id );

    create policy "Users can update own profile" on public.profiles
      for update using ( auth.uid() = id );

    -- 2. EXAM RESULTS TABLE
    create table if not exists public.exam_results (
      id text primary key,
      student_id uuid references public.profiles(id),
      student_name text,
      exam_id text,
      subject text,
      year int,
      score float,
      max_score float,
      grade text,
      date timestamp with time zone,
      feedback jsonb
    );

    alter table public.exam_results enable row level security;

    drop policy if exists "Users can view own results" on public.exam_results;
    drop policy if exists "Users can insert own results" on public.exam_results;

    create policy "Users can view own results" on public.exam_results
      for select using ( auth.uid() = student_id );

    create policy "Users can insert own results" on public.exam_results
      for insert with check ( auth.uid() = student_id );
      
    -- 3. CUSTOM EXAMS TABLE (For Admin)
    create table if not exists public.custom_exams (
        id text primary key,
        year int,
        subject_key text,
        exam_data jsonb
    );

    alter table public.custom_exams enable row level security;
    
    drop policy if exists "Public read exams" on public.custom_exams;
    create policy "Public read exams" on public.custom_exams for select using ( true );
    
    drop policy if exists "Admin insert exams" on public.custom_exams;
    create policy "Admin insert exams" on public.custom_exams for insert with check ( true );
    
    drop policy if exists "Admin update exams" on public.custom_exams;
    create policy "Admin update exams" on public.custom_exams for update using ( true );
    ```

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
