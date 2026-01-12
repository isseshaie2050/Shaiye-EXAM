
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Initialize AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function gradeOpenEndedResponse(question: Question, userAnswer: string, language?: 'english' | 'somali'): Promise<{ score: number, feedback: string }> {
  const isSomali = language === 'somali';

  // Simple heuristic for MCQs
  if (question.type === 'mcq') {
    const isCorrect = userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    
    if (isSomali) {
         return {
          score: isCorrect ? question.marks : 0,
          feedback: isCorrect 
            ? "✅ **Sax**" 
            : `❌ **Qalad**\n\nJawaabta saxda ah waa: **${question.correctAnswer}**\n\n${question.explanation}`
        };
    }

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
    // If explicitly Somali, use Somali prompt. Else check for Arabic.
    const isArabic = !isSomali && /[\u0600-\u06FF]/.test(question.text);

    let systemInstruction = "";

    if (isSomali) {
        systemInstruction = `Adigu waxaad tahay macalin Soomaaliyeed oo caddaalad ah. Ujeedadaadu waa inaad qiimeyso fahanka ardayga ee ma ahan xafiditaan.
         
         Qawaaniinta sixitaanka:
         1. **Fududeyn:** Haddii jawaabta ardaygu ay xambaarsan tahay macnaha saxda ah, sii dhibcaha oo dhan (Full Mark).
         2. **Jawaabaha Gaaban:** Aqbal jawaabaha gaaban haddii ay sax yihiin.
         3. **Luqadda:** Jawaab-celintu (feedback) waa inay noqotaa Af-Soomaali cad oo dhiirigelin leh.
         4. **Qaabka:** Ha isticmaalin hashtags (#). Isticmaal (**) cinwaanada.

         Qaabka Jawaab-celinta:
         **Falanqeyn:**
         (Qodobbada muhiimka ah)
         
         **Qiimeyn:**
         (Sababta dhibcaha)
         
         Dhibcaha ugu badan: ${question.marks}.`;
    } else if (isArabic) {
       systemInstruction = `أنت مصحح مرن وعادل جداً. هدفك هو تقييم الفهم العام وليس الحفظ الحرفي للنص.
         
         قواعد التصحيح الصارمة:
         1. **التساهل في الدرجات:** إذا كانت إجابة الطالب تحمل نفس المعنى الصحيح للإجابة النموذجية، امنحه الدرجة الكاملة (Full Mark) فوراً، حتى لو كانت الكلمات مختلفة.
         2. **أسئلة الإعراب:** اقبل الإجابات المختصرة. مثال: "فاعل مرفوع" تكفي وتعتبر صحيحة تماماً بدلاً من "فاعل مرفوع وعلامة رفعه الضمة الظاهرة". لا تخصم درجات على الاختصار.
         3. **التعبير (Essay):** قيم بناءً على: (1) المنطق وتسلسل الأفكار، (2) وضوح اللغة، (3) أن يكون الموضوع في حدود 10 أسطر. إذا كان المعنى واضحاً، كن كريماً في الدرجات.
         4. **التنسيق:** لا تستخدم علامات الهاشتاج (#) أبداً. استخدم الخط العريض (**) للعناوين.

         نسق ردك كالتالي:
         **التحليل:**
         (نقاط القوة أو الخطأ باختصار شديد)
         
         **التقييم:**
         (سبب الدرجة)
         
         الدرجة القصوى: ${question.marks}. كن في صف الطالب.`;
    } else {
        systemInstruction = `You are a fair and lenient examiner. Grade based on semantic understanding, not exact phrasing.

         Rules:
         1. **Lenient Grading:** If the student's answer conveys the correct meaning, award FULL MARKS. Do not penalize for minor spelling or phrasing differences.
         2. **Short Answers:** Accept standard short forms (e.g., "Voltmeter" is enough, no need for a full sentence).
         3. **Essay:** Grade based on Logic, Clarity, and Length (~10 lines). If it is readable and logical, give a high score.
         4. **Formatting:** Do NOT use hashtags (#). Use Bold (**) for headers.

         Format:
         **Analysis:**
         (Brief points)
         
         **Evaluation:**
         (Reasoning)
         
         Max Marks: ${question.marks}. Be generous if the answer is right.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: `
        Question: ${question.text}
        Model Answer: ${question.correctAnswer}
        Student Answer: ${userAnswer}
        Max Marks: ${question.marks}
        
        Grade this response. Return a JSON object with a numerical 'score' (integer or .5) and a string 'feedback'.
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

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI model");
    }

    // Robust parsing
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    const result = JSON.parse(cleanText);
    
    // Append the standard Model Answer to the feedback
    let finalFeedback = result.feedback;
    const modelAnswerLabel = isSomali ? "**Jawaabta Saxda ah:**" : (isArabic ? "**الإجابة النموذجية:**" : "**Model Answer:**");
    finalFeedback += `\n\n${modelAnswerLabel}\n${question.correctAnswer}`;

    return {
      score: Math.min(Math.max(0, result.score), question.marks),
      feedback: finalFeedback
    };
  } catch (error: any) {
    console.error("Grading error:", error);
    
    // Heuristic fallback logic
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
    
    let message = "";
    if (isSomali) {
        message = isQuota 
        ? "⚠️ **Culeys Jira**: Nidaamka sixitaanka ayaa mashquul ah. Dhibcaha waxaa lagu qiyaasay ereyada muhiimka ah."
        : "⚠️ **Cilad Jirta**: Lama xiriiri karo nidaamka sixitaanka. Dhibcaha waa qiyaas.";
    } else {
        message = isQuota 
        ? "⚠️ **System Overload**: The AI examiner is currently experiencing high traffic. Score estimated based on keywords." 
        : "⚠️ **Grading Unavailable**: Could not connect to the AI examiner. Score estimated based on keywords.";
    }

    return {
      score: estimatedScore,
      feedback: `${message}\n\n**Model Answer**\n${question.correctAnswer}\n\n**Note**\nAutomated grading fallback active.`
    };
  }
}
