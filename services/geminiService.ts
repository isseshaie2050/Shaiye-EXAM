import { Question } from "../types";

// We are switching to Pollinations.ai which is a free, limitless AI proxy.
// No API Key is required for this service.

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

    // Display Explanation (Calculation) first, then Model Answer
    return {
      score: isCorrect ? question.marks : 0,
      feedback: `${status}\n\n${explanationLabel}\n${question.explanation}\n\n${modelAnswerLabel}\n${question.correctAnswer}`
    };
  }

  // 2. Use Pollinations.ai (Free API) for Short Answers / Essays
  try {
    // We only ask the AI for the score. We do NOT ask for feedback/analysis.
    // We will construct the feedback string locally to ensure it matches the user's strict requirement.
    
    const systemInstruction = `You are a strict teacher. 
    Compare the Student Answer to the Model Answer.
    Return valid JSON only: {"score": number}.
    Max marks: ${question.marks}.
    If the answer conveys the correct meaning or key points, award marks accordingly.`;

    const prompt = `
      Question: "${question.text}"
      Model Answer: "${question.correctAnswer}"
      Student Answer: "${userAnswer}"
      
      Return JSON with the score.
    `;

    // Fetch from Pollinations.ai (Free, No Key)
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        model: 'openai', 
        jsonMode: true,
        seed: Math.floor(Math.random() * 1000) 
      })
    });

    if (!response.ok) {
      throw new Error(`Pollinations API Error: ${response.status}`);
    }

    const text = await response.text();
    
    // Clean and Parse JSON
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    let result;
    try {
        result = JSON.parse(cleanText);
    } catch (e) {
        // Fallback if AI returns plain text, try to extract a number
        const match = cleanText.match(/\d+/);
        result = { score: match ? parseInt(match[0]) : 0 };
    }
    
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

    // STRICT FORMAT: Status + Explanation + Model Answer
    return {
      score: score,
      feedback: `${status}\n\n${explanationLabel}\n${question.explanation}\n\n${modelAnswerLabel}\n${question.correctAnswer}`
    };

  } catch (error: any) {
    console.warn("Grading API failed, using fallback:", error);
    
    // --- LOCAL FALLBACK (Offline/Network Error) ---
    
    const normUser = userAnswer.toLowerCase().trim();
    const normCorrect = question.correctAnswer.toLowerCase().trim();
    
    // Logic to estimate score
    let estimatedScore = 0;
    
    // 1. Exact Match
    if (normUser === normCorrect || normUser.includes(normCorrect) || normCorrect.includes(normUser)) {
        estimatedScore = question.marks;
    } else {
        // 2. Keyword Overlap
        const correctWords = normCorrect.split(' ').filter(w => w.length > 3);
        const userWords = normUser.split(/[ .,!?]+/);
        const matchCount = correctWords.filter(w => userWords.some(uw => uw.includes(w))).length;
        
        if (correctWords.length > 0 && matchCount >= correctWords.length * 0.7) {
            estimatedScore = question.marks;
        } else if (correctWords.length > 0 && matchCount >= correctWords.length * 0.4) {
            estimatedScore = Math.ceil(question.marks / 2);
        } else if (normUser.length > 10) {
             // Participation point if length is reasonable but no keyword match (offline fallback is crude)
             estimatedScore = 1;
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