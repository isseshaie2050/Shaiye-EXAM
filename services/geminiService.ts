import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export async function gradeOpenEndedResponse(question: Question, userAnswer: string, language?: 'english' | 'somali'): Promise<{ score: number, feedback: string }> {
  const isSomali = language === 'somali';
  const modelAnswerLabel = isSomali ? "**Jawaabta Saxda ah:**" : "**Model Answer:**";
  const explanationLabel = isSomali ? "**Faahfaahin:**" : "**Full Explanation / Calculation:**";

  // 1. Handle MCQs locally (Instant, no API needed)
  if (question.type === 'mcq') {
    const isCorrect = userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    
    const status = isCorrect 
      ? (isSomali ? "✅ **Sax**" : "✅ **Correct**")
      : (isSomali ? "❌ **Qalad**" : "❌ **Incorrect**");

    return {
      score: isCorrect ? question.marks : 0,
      feedback: `${status}\n\n${explanationLabel}\n${question.explanation}\n\n${modelAnswerLabel}\n${question.correctAnswer}`
    };
  }

  // 2. Use Gemini API for Short Answers / Essays
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not available");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are a strict teacher grading an exam.
      Question: "${question.text}"
      Model Answer: "${question.correctAnswer}"
      Student Answer: "${userAnswer}"
      Max Marks: ${question.marks}
      
      Compare the Student Answer to the Model Answer.
      Return valid JSON only: {"score": number}.
      If the answer conveys the correct meaning or key points, award marks accordingly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
          },
          required: ["score"],
        },
      },
    });

    const result = JSON.parse(response.text || '{"score": 0}');
    const score = Math.min(Math.max(0, result.score || 0), question.marks);
    
    // Determine Status Label
    let status = "";
    if (score === question.marks) {
        status = isSomali ? "✅ **Sax**" : "✅ **Correct**";
    } else if (score === 0) {
        status = isSomali ? "❌ **Qalad**" : "❌ **Incorrect**";
    } else {
        status = isSomali ? `⚠️ **Qeyb ahaan waa sax** (${score}/${question.marks})` : `⚠️ **Partially Correct** (${score}/${question.marks})`;
    }

    return {
      score: score,
      feedback: `${status}\n\n${explanationLabel}\n${question.explanation}\n\n${modelAnswerLabel}\n${question.correctAnswer}`
    };

  } catch (error: any) {
    console.warn("Grading API failed, using fallback:", error);
    
    // --- LOCAL FALLBACK (Offline/Network Error/No Key) ---
    const normUser = userAnswer.toLowerCase().trim();
    const normCorrect = question.correctAnswer.toLowerCase().trim();
    
    let estimatedScore = 0;
    
    if (normUser === normCorrect || normUser.includes(normCorrect) || normCorrect.includes(normUser)) {
        estimatedScore = question.marks;
    } else {
        // Keyword Overlap Logic
        const correctWords = normCorrect.split(' ').filter(w => w.length > 3);
        const userWords = normUser.split(/[ .,!?]+/);
        const matchCount = correctWords.filter(w => userWords.some(uw => uw.includes(w))).length;
        
        if (correctWords.length > 0 && matchCount >= correctWords.length * 0.7) {
            estimatedScore = question.marks;
        } else if (correctWords.length > 0 && matchCount >= correctWords.length * 0.4) {
            estimatedScore = Math.ceil(question.marks / 2);
        } else if (normUser.length > 10) {
             estimatedScore = 1; // Participation point for reasonable length attempt
        }
    }

    let status = "";
    if (estimatedScore === question.marks) {
        status = isSomali ? "✅ **Sax**" : "✅ **Correct**";
    } else if (estimatedScore === 0) {
        status = isSomali ? "❌ **Qalad**" : "❌ **Incorrect**";
    } else {
        status = isSomali ? `⚠️ **Qeyb ahaan waa sax** (${estimatedScore}/${question.marks})` : `⚠️ **Partially Correct** (${estimatedScore}/${question.marks})`;
    }

    return {
      score: estimatedScore,
      feedback: `${status}\n\n${explanationLabel}\n${question.explanation}\n\n${modelAnswerLabel}\n${question.correctAnswer}`
    };
  }
}