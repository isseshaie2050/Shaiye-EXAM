import { ExamResult } from '../types';

const STORAGE_KEY = 'shaiye_exam_history';

export const saveExamResult = (result: ExamResult): void => {
  try {
    const history = getExamHistory();
    history.unshift(result); // Add new result to the top
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save exam history", error);
  }
};

export const getExamHistory = (): ExamResult[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load exam history", error);
    return [];
  }
};

export const getSubjectStats = () => {
  const history = getExamHistory();
  const subjects: Record<string, { totalScore: number, totalMax: number, count: number }> = {};

  history.forEach(h => {
    if (!subjects[h.subject]) {
      subjects[h.subject] = { totalScore: 0, totalMax: 0, count: 0 };
    }
    subjects[h.subject].totalScore += h.score;
    subjects[h.subject].totalMax += h.maxScore;
    subjects[h.subject].count += 1;
  });

  return Object.keys(subjects).map(sub => {
    const data = subjects[sub];
    return {
      subject: sub,
      average: Math.round((data.totalScore / data.totalMax) * 100),
      attempts: data.count
    };
  });
};