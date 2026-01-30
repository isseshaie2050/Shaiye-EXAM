
import { Question } from "../types";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API Client
// We assume process.env.API_KEY is available as per environment configuration
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using the recommended model for basic text tasks
const MODEL = "gemini-3-flash-preview"; 

const INTER_BATCH_DELAY_MS = 1000; 

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- LOCAL GRADING LOGIC (Fallback) ---
function gradeLocally(question: Question, userAnswer: string): { score: number, feedback: string } {
    const normUser = userAnswer.toLowerCase().trim();
    const normCorrect = question.correctAnswer.toLowerCase().trim();
    
    // 1. Exact Match (Full marks)
    if (normUser === normCorrect) {
        return { score: question.marks, feedback: "✅ **Correct** (Exact Match)" };
    }

    // 2. Keyword Matching (Partial Grading)
    // Remove common stop words to focus on content
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'in', 'a', 'an', 'and', 'of', 'to', 'for', 'it', 'that'];
    const keywords = normCorrect.split(/[\s,.-]+/).filter(w => w.length > 3 && !stopWords.includes(w));
    
    if (keywords.length === 0) {
        // Fallback for very short answers or numbers
        return { score: 0, feedback: "⚠️ **Manual Review Required**" };
    }

    let matchCount = 0;
    keywords.forEach(word => {
        if (normUser.includes(word)) matchCount++;
    });

    const matchRatio = matchCount / keywords.length;
    let score = 0;
    let feedback = "❌ **Incorrect**";

    if (matchRatio >= 0.7) {
        score = question.marks;
        feedback = "✅ **Correct** (Keywords matched)";
    } else if (matchRatio >= 0.4) {
        score = Math.max(1, Math.floor(question.marks / 2));
        feedback = `⚠️ **Partially Correct** (Found key concepts)`;
    }

    return { 
        score, 
        feedback
    };
}

export async function gradeBatch(
  items: { question: Question; userAnswer: string }[],
  language: 'english' | 'somali' | 'arabic' = 'english',
  onProgress?: (completedCount: number, totalCount: number) => void
): Promise<Record<string, { score: number; feedback: string }>> {
  if (items.length === 0) return {};

  const results: Record<string, { score: number; feedback: string }> = {};

  // Batching logic
  const CHUNK_SIZE = 5;
  const chunks = [];
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    chunks.push(items.slice(i, i + CHUNK_SIZE));
  }

  let completedItems = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    // Construct Prompt
    const systemInstruction = `You are an expert teacher grading exams for high school students. Language: ${language}.
    
    Grading Rules:
    1. 0 for incorrect, partial marks for partial correctness, max marks for correct.
    2. **CRITICAL FOR CALCULATION SUBJECTS (Math, Physics, Chemistry, Business, Biology):** 
       - You MUST provide a **Step-by-Step Solution**. 
       - Break down the explanation into "Step 1", "Step 2", etc.
       - Show the formula used.
       - Explain the logic clearly so a student can understand HOW to solve it next time.
    3. For non-calculation subjects, explain the context of the answer briefly.
    4. Return ONLY a JSON object with a "grades" array.`;

    const userContent = JSON.stringify(chunk.map(c => ({
        id: c.question.id,
        subject: c.question.topic, // Implicitly passing topic to help context
        question: c.question.text,
        student_answer: c.userAnswer,
        correct_answer: c.question.correctAnswer,
        max_marks: c.question.marks
    })));

    const prompt = `Grade these answers. 
    JSON Schema: { "grades": [{ "id": "string", "score": number, "feedback": "detailed step-by-step feedback string" }] }
    
    Data: ${userContent}`;

    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            systemInstruction: systemInstruction
        }
      });

      const responseText = response.text;
      
      if (responseText) {
          const parsed = JSON.parse(responseText);
          parsed.grades?.forEach((g: any) => {
            const originalQ = chunk.find(c => c.question.id === g.id)?.question;
            const validScore = originalQ ? Math.min(Math.max(0, g.score), originalQ.marks) : 0;
            results[g.id] = { score: validScore, feedback: g.feedback };
          });
      }
      
      // Handle items missed by AI
      chunk.forEach(item => {
        if (!results[item.question.id]) {
             results[item.question.id] = gradeLocally(item.question, item.userAnswer);
        }
      });

    } catch (error) {
       console.error("AI Grading failed, switching to local.", error);
       // Fallback to local grading
       chunk.forEach(item => {
        results[item.question.id] = gradeLocally(item.question, item.userAnswer);
       });
    }

    completedItems += chunk.length;
    if (onProgress) onProgress(completedItems, items.length);
    if (i < chunks.length - 1) await delay(INTER_BATCH_DELAY_MS);
  }

  return results;
}

export function formatFeedback(question: Question, score: number, aiFeedback: string, language?: 'english' | 'somali' | 'arabic'): string {
  const isSomali = language === 'somali';
  const isArabic = language === 'arabic';
  
  let status = "";
  if (score === question.marks) {
      status = isSomali ? "✅ **Sax**" : isArabic ? "✅ **صحيح**" : "✅ **Correct**";
  } else if (score === 0) {
      status = isSomali ? "❌ **Qalad**" : isArabic ? "❌ **خطأ**" : "❌ **Incorrect**";
  } else {
      status = isSomali ? `⚠️ **Qeyb ahaan waa sax**` : isArabic ? `⚠️ **صحيح جزئيا**` : `⚠️ **Partially Correct**`;
  }

  return `${status}\n\n${aiFeedback}`;
}
