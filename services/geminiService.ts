import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function gradeOpenEndedResponse(question: Question, userAnswer: string): Promise<{ score: number, feedback: string }> {
  // Simple heuristic for MCQs
  if (question.type === 'mcq') {
    const isCorrect = userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    return {
      score: isCorrect ? question.marks : 0,
      feedback: isCorrect 
        ? "✅ **Correct**" 
        : `❌ **Incorrect**\n\nThe correct answer is: **${question.correctAnswer}**\n\n${question.explanation}`
    };
  }

  // Use Gemini for short answers and calculations
  try {
    // Detect language direction/type for better prompting
    const isArabic = /[\u0600-\u06FF]/.test(question.text);

    const systemInstruction = isArabic 
      ? `أنت مصحح أكاديمي خبير لامتحانات الشهادة الثانوية (Form IV). مهمتك هي تصحيح إجابة الطالب بدقة متناهية بناءً على نموذج الإجابة وتوزيع الدرجات.
         
         يجب أن تكون ملاحظاتك هيكلية واحترافية كما يلي:
         
         ### 🔍 التحليل (Analysis)
         * ✔ (للنقاط الصحيحة التي ذكرها الطالب)
         * ❌ (للنقاط المفقودة أو الخاطئة)
         
         ### 🧮 التقدير (Evaluation)
         * (شرح موجز لكيفية احتساب الدرجة بناءً على التحليل)
         
         ### 📝 ملاحظة (Note)
         * (تعليق بناء أو تبرير نهائي)
         
         كن عادلاً، ولا تعطِ الدرجة الكاملة إلا إذا كانت الإجابة تامة. الدرجة القصوى هي ${question.marks}.`
      : `You are a strict, world-class academic examiner for national examinations. Grade the student's answer with extreme precision based on the model answer.
         
         Structure your feedback strictly as follows:
         
         ### 🔍 Analysis
         * ✔ (List correct points found in student answer)
         * ❌ (List missed or incorrect points)
         
         ### 🧮 Evaluation
         * (Brief explanation of deduction or award)
         
         ### 📝 Note
         * (Constructive final remark)
         
         Max Marks: ${question.marks}. Be fair but strictly academic.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest", // Switching to Flash Lite for speed and lower cost/quota usage
      contents: `
        Question: ${question.text}
        Model Answer/Rubric: ${question.correctAnswer}
        Student Answer: ${userAnswer}
        Max Marks: ${question.marks}
        
        Grade this response. Return a JSON object with a numerical 'score' (integer or .5) and a string 'feedback' containing the formatted markdown text.
      `,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          },
          required: ["score", "feedback"]
        }
      }
    });

    // Robust parsing
    const cleanText = response.text.replace(/```json\n?|```/g, '').trim();
    const result = JSON.parse(cleanText);
    
    return {
      score: Math.min(Math.max(0, result.score), question.marks),
      feedback: result.feedback
    };
  } catch (error: any) {
    console.error("Grading error:", error);
    
    // Heuristic fallback
    const normUser = userAnswer.toLowerCase().trim();
    const normCorrect = question.correctAnswer.toLowerCase().trim();
    
    // Very basic overlap check
    const correctWords = normCorrect.split(' ').filter(w => w.length > 3);
    const userWords = normUser.split(' ');
    const matchCount = correctWords.filter(w => userWords.some(uw => uw.includes(w))).length;
    
    let estimatedScore = 0;
    if (matchCount >= correctWords.length * 0.8) estimatedScore = question.marks;
    else if (matchCount >= correctWords.length * 0.5) estimatedScore = Math.ceil(question.marks / 2);
    else if (normUser.length > 10 && normCorrect.length > 10) estimatedScore = 1; // Pity point for effort if not empty
    
    const isQuota = error.status === 429 || (error.message && error.message.includes('429')) || (error.toString().includes('429'));
    const message = isQuota 
      ? "⚠️ **System Overload (Quota)**: The AI examiner is currently busy. Your score was estimated based on keyword matching." 
      : "⚠️ **Connection Error**: Could not reach the AI examiner. Score estimated.";

    return {
      score: estimatedScore,
      feedback: `${message}\n\n### 🔍 Standard Model Answer\n${question.correctAnswer}\n\n### 📝 Explanation\n${question.explanation}`
    };
  }
}