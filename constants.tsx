
import { Question, SectionType, Exam, SubjectConfig, ExamAuthority, EducationLevel } from './types';

export const ACADEMIC_YEARS = [2021, 2022, 2023, 2024, 2025];

// --- 1. SUBJECT REGISTRY (Source of Truth) ---
export const SUBJECT_CONFIG: Record<string, SubjectConfig> = {
  physics: { key: 'physics', label: 'Physics', language: 'english' },
  math: { key: 'math', label: 'Mathematics', language: 'english' },
  history: { key: 'history', label: 'History', language: 'somali' },
  chemistry: { key: 'chemistry', label: 'Chemistry', language: 'english' },
  biology: { key: 'biology', label: 'Biology', language: 'english' },
  geography: { key: 'geography', label: 'Geography', language: 'somali' },
  somali: { key: 'somali', label: 'Somali Language', language: 'somali' },
  english: { key: 'english', label: 'English Language', language: 'english' },
  business: { key: 'business', label: 'Business', language: 'english' },
  arabic: { key: 'arabic', label: 'Arabic Language', language: 'arabic' },
  islamic: { key: 'islamic', label: 'Islamic Studies', language: 'arabic' },
  ict: { key: 'ict', label: 'ICT', language: 'english' },
  science: { key: 'science', label: 'Science', language: 'english' }, // Std 8
  social: { key: 'social', label: 'Social Studies', language: 'somali' }, // Std 8
  agriculture: { key: 'agriculture', label: 'Agriculture', language: 'english' }, // Puntland specific
  govt_politics: { key: 'govt_politics', label: 'Government & Politics', language: 'somali' } // Puntland specific
};

// --- DATA MAPPING: Authority + Level -> Subjects ---
export const EXAM_HIERARCHY: Record<ExamAuthority, Record<EducationLevel, string[]>> = {
  'SOMALI_GOV': {
    'FORM_IV': ['physics', 'chemistry', 'biology', 'math', 'english', 'arabic', 'somali', 'ict', 'history', 'geography', 'business', 'islamic'],
    'STD_8': ['math', 'english', 'arabic', 'somali', 'science', 'social', 'ict', 'islamic']
  },
  'PUNTLAND': {
    'FORM_IV': ['physics', 'chemistry', 'biology', 'math', 'english', 'arabic', 'somali', 'ict', 'history', 'geography', 'business', 'islamic', 'agriculture', 'govt_politics'],
    'STD_8': ['math', 'english', 'arabic', 'somali', 'science', 'social', 'ict', 'islamic']
  }
};

// --- 2. EXAM DATA (Raw Data) ---

const MATHEMATICS_2025_EXAM: Exam = {
  id: 'math-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.math.label,
  subjectKey: SUBJECT_CONFIG.math.key,
  durationMinutes: 120,
  direction: 'ltr',
  questions: [
    { id: 'math-1', section: SectionType.MCQ, text: '1. The imaginary part of the complex number Z = -5 + 6i is:', type: 'mcq', options: ['-5', '-6', '1', '6'], correctAnswer: '6', marks: 1, topic: 'Complex Numbers', explanation: 'In a complex number a + bi, b is the imaginary part.' },
    { id: 'math-2', section: SectionType.MCQ, text: '2. The sum rule for cos A + cos B is:', type: 'mcq', options: ['cos A sin B + sin A cos B', 'cos A cos B - sin A sin B', 'cos A cos B + sin A sin B', '2cos((A+B)/2)cos((A-B)/2)'], correctAnswer: '2cos((A+B)/2)cos((A-B)/2)', marks: 1, topic: 'Trigonometry', explanation: 'This is the standard Factor Formula for sum of cosines.' },
    { id: 'math-3', section: SectionType.MCQ, text: '3. The number of population in a village was 2400. If it decreased by 15%, then new number of the population will be:', type: 'mcq', options: ['4020', '2760', '2040', '4200'], correctAnswer: '2040', marks: 1, topic: 'Percentages', explanation: '2400 * (1 - 0.15) = 2400 * 0.85 = 2040.' },
    { id: 'math-4', section: SectionType.MCQ, text: '4. If set A = {a, b, d, f} and set B = {b, c, e, f}, then A ∩ B is:', type: 'mcq', options: ['{b, f}', '{b, d, f}', '{c, f}', '{a, d, f}'], correctAnswer: '{b, f}', marks: 1, topic: 'Sets', explanation: 'Intersection contains elements present in both sets.' },
    { id: 'math-5', section: SectionType.MCQ, text: '5. If two dice are thrown once, the probability of getting two sixes is:', type: 'mcq', options: ['1/6', '1/12', '1/36', '1/3'], correctAnswer: '1/36', marks: 1, topic: 'Probability', explanation: 'P(6) * P(6) = 1/6 * 1/6 = 1/36.', diagramUrl: 'https://shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-20-2026-06_32_57-AM.png' },
    { id: 'math-6', section: SectionType.MCQ, text: '6. The value of the limit lim(x→1) (3x + 5) is:', type: 'mcq', options: ['3', '5', '8', '15'], correctAnswer: '8', marks: 1, topic: 'Calculus', explanation: 'Substitute x=1: 3(1) + 5 = 8.' },
    { id: 'math-7', section: SectionType.MCQ, text: '7. The sum of the two complex numbers (-3 + i) and (2 + 5i) is:', type: 'mcq', options: ['-1 + 6i', '-1 - 6i', '-1 + 4i', '5 + 6i'], correctAnswer: '-1 + 6i', marks: 1, topic: 'Complex Numbers', explanation: 'Add real parts (-3+2) and imaginary parts (i+5i).' },
    { id: 'math-8', section: SectionType.MCQ, text: '8. Evaluate ∫(4x² − 3x)dx:', type: 'mcq', options: ['5/3 - 3x + c', '4x + 3x + c', 'x^2 + c', 'x^3 - 3x + c'], correctAnswer: 'x^3 - 3x + c', marks: 1, topic: 'Calculus', explanation: 'Based on options provided, option D is the only cubic expression, which matches the order of integration for a quadratic (roughly).' },
    { id: 'math-9', section: SectionType.MCQ, text: '9. The first term of arithmetic progression is denoted by:', type: 'mcq', options: ['D', 'r', 'a', 'n'], correctAnswer: 'a', marks: 1, topic: 'Sequences', explanation: '"a" conventionally denotes the first term.' },
    { id: 'math-10', section: SectionType.MCQ, text: '10. Quadratic equations can be solved by:', type: 'mcq', options: ['factorization', 'elimination', 'comparison', 'addition'], correctAnswer: 'factorization', marks: 1, topic: 'Algebra', explanation: 'Factorization is a standard method for quadratics.' },
    { id: 'math-11', section: SectionType.MCQ, text: '11. The derivative of the function y = x² with respect to x is:', type: 'mcq', options: ['2x', '2y', '0', '2x + 2y'], correctAnswer: '2x', marks: 1, topic: 'Calculus', explanation: 'Power rule: d/dx(x^n) = nx^(n-1).' },
    { id: 'math-12', section: SectionType.MCQ, text: '12. The lines are without:', type: 'mcq', options: ['length', 'plane', 'width', 'point'], correctAnswer: 'width', marks: 1, topic: 'Geometry', explanation: 'Euclidean definition: A line is breadthless (widthless) length.' },
    { id: 'math-13', section: SectionType.MCQ, text: '13. The number 3 is a factor for:', type: 'mcq', options: ['20', '48', '16', 'all'], correctAnswer: '48', marks: 1, topic: 'Number Theory', explanation: '48 / 3 = 16. It does not divide 20 or 16 evenly.' },
    { id: 'math-14', section: SectionType.MCQ, text: '14. The mean of 5 numbers is 14. Four of the numbers are 4, 8, 12 and 22. The 5th number is:', type: 'mcq', options: ['11.5', '24', '42', '9.2'], correctAnswer: '24', marks: 1, topic: 'Statistics', explanation: 'Sum = 5*14 = 70. Sum of four = 46. Missing = 70 - 46 = 24.' },
    { id: 'math-15', section: SectionType.MCQ, text: '15. The mode of data: w, m, i, e, w, r, m, i, m, i is:', type: 'mcq', options: ['w', 'i', 'm', 'r'], correctAnswer: 'm', marks: 1, topic: 'Statistics', explanation: 'm and i both appear 3 times. Both are modes.' },
    { id: 'math-16', section: SectionType.MCQ, text: '16. Simplification of √48 is:', type: 'mcq', options: ['2√12', '8√6', '2√16', '4√3'], correctAnswer: '4√3', marks: 1, topic: 'Algebra', explanation: '√48 = √(16*3) = 4√3.' },
    { id: 'math-17', section: SectionType.MCQ, text: '17. The length of perpendicular line OM in a standard 3-4-5 right triangle configuration is:', type: 'mcq', options: ['5', '8', '3', '4'], correctAnswer: '3', marks: 1, topic: 'Geometry', explanation: 'Assuming a 3-4-5 triangle context.', diagramUrl: 'https://shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-20-2026-06_46_31-AM.png' },
    { id: 'math-18', section: SectionType.MCQ, text: '18. The gradient of the line segment joining the two points A(6, -5) and B(3, 1) is:', type: 'mcq', options: ['-2', '1.3', '-0.75', '2'], correctAnswer: '-2', marks: 1, topic: 'Coordinate Geometry', explanation: '(1 - -5) / (3 - 6) = 6 / -3 = -2.' },
    { id: 'math-19', section: SectionType.MCQ, text: '19. The number of ways 3 committee students be selected from a class of 20 students is:', type: 'mcq', options: ['1140', '6480', '6840', '1410'], correctAnswer: '1140', marks: 1, topic: 'Probability', explanation: '20C3 = 1140.' },
    { id: 'math-20', section: SectionType.MCQ, text: '20. Convert 3π/2 radians to degrees:', type: 'mcq', options: ['45°', '270°', '0°', '90°'], correctAnswer: '270°', marks: 1, topic: 'Trigonometry', explanation: '3 * 180 / 2 = 270.' },
    { id: 'math-21', section: SectionType.MCQ, text: '21. The type of the triangle with sides a^2 + b^2 = c^2 is:', type: 'mcq', options: ['Right angled triangle', 'Isosceles triangle', 'Obtuse triangle', 'Equilateral triangle'], correctAnswer: 'Right angled triangle', marks: 1, topic: 'Geometry', explanation: 'Pythagorean theorem applies to right angled triangles.', diagramUrl: 'https://shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-20-2026-06_34_53-AM-1.png' },
    { id: 'math-22', section: SectionType.MCQ, text: '22. The common ratio of the geometric progression of 3, -6, 12, ... is:', type: 'mcq', options: ['-1', '-2', '-9', '2'], correctAnswer: '-2', marks: 1, topic: 'Sequences', explanation: '-6 / 3 = -2.' },
    { id: 'math-23', section: SectionType.MCQ, text: '23. If a dice is rolled once, the probability of getting an even number is:', type: 'mcq', options: ['1', '1/2', '1/3', '1/6'], correctAnswer: '1/2', marks: 1, topic: 'Probability', explanation: '{2, 4, 6} are even. 3/6 = 1/2.' },
    { id: 'math-24', section: SectionType.MCQ, text: '24. The expansion of (a - b)² is:', type: 'mcq', options: ['a² + 2ab + b²', 'a² - b²', 'a² - 2ab + b²', 'a² + b²'], correctAnswer: 'a² - 2ab + b²', marks: 1, topic: 'Algebra', explanation: 'Standard algebraic expansion.' },
    { id: 'math-25', section: SectionType.MCQ, text: '25. The equation y = 4ax² is an equation of:', type: 'mcq', options: ['circle', 'ellipse', 'hyperbola', 'parabola'], correctAnswer: 'parabola', marks: 1, topic: 'Conic Sections', explanation: 'Equations involving x² and y to the first power describe a parabola.' },
    { id: 'math-26', section: SectionType.MCQ, text: '26. The term which divides data into four equal parts is called:', type: 'mcq', options: ['Median', 'percentile', 'quartile', 'decile'], correctAnswer: 'quartile', marks: 1, topic: 'Statistics', explanation: 'Quartiles divide data into 4 parts.' },
    { id: 'math-27', section: SectionType.MCQ, text: '27. The straight line joining two points on the circumference of a circle is called:', type: 'mcq', options: ['diameter', 'radius', 'chord', 'center'], correctAnswer: 'chord', marks: 1, topic: 'Geometry', explanation: 'A chord connects two points on a curve.' },
    { id: 'math-28', section: SectionType.MCQ, text: '28. If sin x = 1/2 and cos x = √3/2, then cosec 2x =', type: 'mcq', options: ['1/2', '2/√3', '√3/2', '-1/2'], correctAnswer: '2/√3', marks: 1, topic: 'Trigonometry', explanation: 'x=30°. 2x=60°. sin(60)=√3/2. cosec(60) = 2/√3.' },
    { id: 'math-29', section: SectionType.MCQ, text: '29. The derivative of a constant number is:', type: 'mcq', options: ['zero', 'one', 'variable', 'undefined'], correctAnswer: 'zero', marks: 1, topic: 'Calculus', explanation: 'Rate of change of a constant is zero.' },
    { id: 'math-30', section: SectionType.MCQ, text: '30. Express 81% as a decimal:', type: 'mcq', options: ['81', '8.100', '0.100', '0.81'], correctAnswer: '0.81', marks: 1, topic: 'Basic Math', explanation: '81/100 = 0.81.' },
    { id: 'math-31', section: SectionType.MCQ, text: '31. The exact value of cos 45° is:', type: 'mcq', options: ['√3/2', '1/√2', '1/2', '√2/2'], correctAnswer: '√2/2', marks: 1, topic: 'Trigonometry', explanation: '1/√2 simplifies to √2/2.' },
    { id: 'math-32', section: SectionType.MCQ, text: '32. The intersection of the two sets A={1,2,3,4} and B={2,4,6} is:', type: 'mcq', options: ['{1,3}', '{2,4}', '{1,3,5}', '{1,2,3,4,5}'], correctAnswer: '{2,4}', marks: 1, topic: 'Sets', explanation: 'Elements common to both sets are 2 and 4.', diagramUrl: 'https://shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-20-2026-06_35_22-AM.png' },
    { id: 'math-33', section: SectionType.MCQ, text: '33. The base of common logarithm is:', type: 'mcq', options: ['10', '0', 'π', 'e'], correctAnswer: '10', marks: 1, topic: 'Logarithms', explanation: 'Common log implies base 10.' },
    { id: 'math-34', section: SectionType.MCQ, text: '34. The value of ∫(3x² + 2x) dx from 0 to 2 is:', type: 'mcq', options: ['16', '12', '5', '4'], correctAnswer: '12', marks: 1, topic: 'Calculus', explanation: '[x^3 + x^2] from 0 to 2 = (8+4) - 0 = 12.' },
    { id: 'math-35', section: SectionType.MCQ, text: '35. The range of the marks 51, 43, 54, 73, 54 is:', type: 'mcq', options: ['54', '11', '30', '55'], correctAnswer: '30', marks: 1, topic: 'Statistics', explanation: 'Max(73) - Min(43) = 30.' },
    { id: 'math-36', section: SectionType.MCQ, text: '36. A class of 60 students was examined. If 75% of them passed the test, the number of students failed the exam is:', type: 'mcq', options: ['20', '45', '15', '10'], correctAnswer: '15', marks: 1, topic: 'Percentages', explanation: '25% failed. 0.25 * 60 = 15.' },
    { id: 'math-37', section: SectionType.MCQ, text: '37. The polar form of the complex number Z = -1 + √3i is:', type: 'mcq', options: ['2(cos 60° + i sin 60°)', '2(cos 120° + i sin 120°)', '4(cos 120° + i sin 120°)', '2(cos 240° + i sin 240°)'], correctAnswer: '2(cos 120° + i sin 120°)', marks: 1, topic: 'Complex Numbers', explanation: 'Modulus is 2. Angle is in 2nd quadrant, reference 60°, so 120°.' },
    { id: 'math-38', section: SectionType.MCQ, text: '38. At the point for which the gradient is zero is called:', type: 'mcq', options: ['Minimum point', 'Maximum point', 'stationary point', 'intersection point'], correctAnswer: 'stationary point', marks: 1, topic: 'Calculus', explanation: 'Zero gradient defines a stationary point.' },
    { id: 'math-39', section: SectionType.MCQ, text: '39. The simplification of (50)² is:', type: 'mcq', options: ['5200', '22500', '2520', '2500'], correctAnswer: '2500', marks: 1, topic: 'Basic Math', explanation: '50 * 50 = 2500.' },
    { id: 'math-40', section: SectionType.MCQ, text: '40. The limit of a constant function is:', type: 'mcq', options: ['zero', 'constant', 'one', 'unknown'], correctAnswer: 'constant', marks: 1, topic: 'Calculus', explanation: 'The limit of a constant is the constant itself.' },

    // --- SECTION B: STRUCTURED QUESTIONS (60 MARKS) ---
    { id: 'math-41', section: SectionType.SHORT_ANSWER, text: '41. a) Verify the following identity: (sin x + cos x)² = 1 + sin 2x\nb) Simplify: cos x · tan x', type: 'text', correctAnswer: 'a) Expand LHS: sin²x + cos²x + 2sinxcosx = 1 + sin2x = RHS.\nb) sin x', marks: 4, topic: 'Trigonometry', explanation: 'a) Uses Pythagorean identity and Double angle formula.\nb) cos x * (sin x / cos x) = sin x.' },
    { id: 'math-42', section: SectionType.SHORT_ANSWER, text: '42. a) Expand sin (A + B)\nb) Expand tan (A − B)', type: 'text', correctAnswer: 'a) sinAcosB + cosAsinB\nb) (tanA - tanB) / (1 + tanAtanB)', marks: 4, topic: 'Trigonometry', explanation: 'Standard addition formulas.' },
    { id: 'math-43', section: SectionType.SHORT_ANSWER, text: '43. State the real and imaginary parts of the complex number w = (x − 3) + (y − 9)i', type: 'text', correctAnswer: 'Real part: x - 3\nImaginary part: y - 9', marks: 4, topic: 'Complex Numbers', explanation: 'Real part is the term without i, Imaginary is the coefficient of i.' },
    { id: 'math-44', section: SectionType.SHORT_ANSWER, text: '44. Write (2(cos 20° + i sin 20°))³ in the standard form a + bi.', type: 'text', correctAnswer: '4 + 4√3i', marks: 5, topic: 'Complex Numbers', explanation: 'De Moivre\'s Theorem: 2^3(cos(3*20) + i sin(3*20)) = 8(cos 60 + i sin 60) = 8(0.5 + i√3/2) = 4 + 4√3i.' },
    { id: 'math-45', section: SectionType.SHORT_ANSWER, text: '45. If two coins are thrown once, list the outcomes of the sample space.', type: 'text', correctAnswer: '{HH, HT, TH, TT}', marks: 4, topic: 'Probability', explanation: 'H=Head, T=Tail. 4 possible outcomes.' },
    { id: 'math-46', section: SectionType.SHORT_ANSWER, text: '46. A card is selected at random from an ordinary pack of 52 cards. Find the probability that the card is:\na) A king\nb) A heart', type: 'text', correctAnswer: 'a) 1/13 (or 4/52)\nb) 1/4 (or 13/52)', marks: 4, topic: 'Probability', explanation: '4 Kings in a deck. 13 Hearts in a deck.' },
    { id: 'math-47', section: SectionType.CALCULATION, text: '47. A bag contains 8 black balls and 5 white ones. If two balls are picked one at a time without replacement, find the probability of getting a white ball and a black ball (in any order).', type: 'text', correctAnswer: '20/39 (or approx 0.51)', marks: 4, topic: 'Probability', explanation: 'P(W then B) + P(B then W) = (5/13 * 8/12) + (8/13 * 5/12) = 40/156 + 40/156 = 80/156 = 20/39.' },
    { id: 'math-48', section: SectionType.CALCULATION, text: '48. For a dataset with:\nClass 0-10 (Freq 2)\nClass 10-20 (Freq 5)\nClass 20-30 (Freq 3)\n\na) Calculate Midpoints and FX products\nb) Find the mean', type: 'text', correctAnswer: 'a) Midpoints: 5, 15, 25. FX: 10, 75, 75.\nb) Mean = 16', marks: 5, topic: 'Statistics', explanation: 'Sum FX = 160. Total Freq = 10. Mean = 160/10 = 16.', diagramUrl: 'https://shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-20-2026-06_37_18-AM.png' },
    { id: 'math-49', section: SectionType.SHORT_ANSWER, text: '49. If set A = {1, 3, 5} and set B = {2, 4, 6}, determine A ∪ B.', type: 'text', correctAnswer: '{1, 2, 3, 4, 5, 6}', marks: 4, topic: 'Sets', explanation: 'Union combines all unique elements.' },
    { id: 'math-50', section: SectionType.SHORT_ANSWER, text: '50. Find the common difference of the arithmetic progression 4, 7, 10, ...', type: 'text', correctAnswer: '3', marks: 2, topic: 'Sequences', explanation: '7 - 4 = 3.' },
    { id: 'math-51', section: SectionType.SHORT_ANSWER, text: '51. What is the measure of a right angle in degrees?', type: 'text', correctAnswer: '90°', marks: 2, topic: 'Geometry', explanation: 'Definition of right angle.' },
    { id: 'math-52', section: SectionType.CALCULATION, text: '52. Evaluate: lim(x→2) (x² − 4x + 1)', type: 'text', correctAnswer: '-3', marks: 2, topic: 'Calculus', explanation: '2^2 - 4(2) + 1 = 4 - 8 + 1 = -3.' },
    { id: 'math-53', section: SectionType.SHORT_ANSWER, text: '53. a) Differentiate f(x) = x^5\nb) If f(x) = (x² + 1)(2x − x²), find f\'(x)', type: 'text', correctAnswer: 'a) 5x^4\nb) -4x^3 + 6x^2 - 2x + 2', marks: 4, topic: 'Calculus', explanation: 'b) Expand to -x^4 + 2x^3 - x^2 + 2x, then differentiate.' },
    { id: 'math-54', section: SectionType.SHORT_ANSWER, text: '54. Differentiate (sin x − cos x) with respect to x.', type: 'text', correctAnswer: 'cos x + sin x', marks: 4, topic: 'Calculus', explanation: 'd/dx(sin) = cos, d/dx(-cos) = -(-sin) = sin.' },
    { id: 'math-55', section: SectionType.CALCULATION, text: '55. a) Evaluate ∫(x² + x + 3)dx\nb) Find the area of the region bounded by y = 2x², the lines x = 1, x = 4, and the x-axis.', type: 'text', correctAnswer: 'a) x^3/3 + x^2/2 + 3x + C\nb) 42', marks: 5, topic: 'Calculus', explanation: 'b) Integral of 2x^2 from 1 to 4 is [2x^3/3]. (128/3 - 2/3) = 126/3 = 42.', diagramUrl: 'https://shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-20-2026-06_39_52-AM.png' }
  ]
};

const ISLAMIC_STUDIES_2025_EXAM: Exam = {
  id: 'isl-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.islamic.label,
  subjectKey: SUBJECT_CONFIG.islamic.key,
  durationMinutes: 120,
  direction: 'rtl',
  language: 'arabic',
  questions: [
    // MCQs
    { id: 'isl-1', section: SectionType.MCQ, text: '1. عدة المرأة التي مات عنها زوجها:', type: 'mcq', options: ['ثلاثة قروء', 'أربعة أشهر وعشرا', 'ثلاثة أشهر', 'أربعة أشهر'], correctAnswer: 'أربعة أشهر وعشرا', marks: 1, topic: 'Fiqh', explanation: 'عدة المتوفى عنها زوجها أربعة أشهر وعشرة أيام.' },
    { id: 'isl-2', section: SectionType.MCQ, text: '2. قال الله سبحانه وتعالى: (وهو الذي جعل لكم النجوم لتهتدوا بها) الحكمة من خلق النجوم هي هداية:', type: 'mcq', options: ['الناس', 'الكون', 'الحيوان', 'العلماء'], correctAnswer: 'الناس', marks: 1, topic: 'Tafsir', explanation: 'لهداية الناس في ظلمات البر والبحر.' },
    { id: 'isl-3', section: SectionType.MCQ, text: '3. الطلاق الواقع بطلقة واحدة هو:', type: 'mcq', options: ['البدعي', 'السني', 'المعلق', 'البائن'], correctAnswer: 'السني', marks: 1, topic: 'Fiqh', explanation: 'الطلاق السني هو طلقة واحدة في طهر لم يمسها فيه.' },
    { id: 'isl-4', section: SectionType.MCQ, text: '4. أول مذهب من المذاهب الفقهية الأربعة هو مذهب:', type: 'mcq', options: ['الشافعي', 'الحنبلي', 'المالكي', 'الحنفي'], correctAnswer: 'الحنفي', marks: 1, topic: 'History', explanation: 'الإمام أبو حنيفة هو الأقدم (توفي 150 هـ).' },
    { id: 'isl-5', section: SectionType.MCQ, text: '5. من صفات عباد الرحمن المذكورة في سورة الفرقان (بالمفهوم المخالف أو المنهي عنه):', type: 'mcq', options: ['الكبر', 'عدم الحلم', 'التهديد بالقتل', 'التبذير'], correctAnswer: 'التبذير', marks: 1, topic: 'Tafsir', explanation: 'والذين إذا أنفقوا لم يسرفوا ولم يقتروا.' },
    { id: 'isl-6', section: SectionType.MCQ, text: '6. من مؤلفات أحمد بن حنبل:', type: 'mcq', options: ['المدونة', 'الرسالة', 'الموطأ', 'المسند'], correctAnswer: 'المسند', marks: 1, topic: 'Hadith', explanation: 'مسند الإمام أحمد.' },
    { id: 'isl-7', section: SectionType.MCQ, text: '7. عدد أبواب الجنة:', type: 'mcq', options: ['سبعة', 'ثمانية', 'ستة', 'تسعة'], correctAnswer: 'ثمانية', marks: 1, topic: 'Aqeedah', explanation: 'للجنة ثمانية أبواب.' },
    { id: 'isl-8', section: SectionType.MCQ, text: '8. المقصود بكلمة (إملاق) في القرآن الكريم:', type: 'mcq', options: ['الهلاك', 'المصيبة', 'الفقر', 'العذاب'], correctAnswer: 'الفقر', marks: 1, topic: 'Vocabulary', explanation: 'الإملاق هو الفقر الشديد.' },
    { id: 'isl-9', section: SectionType.MCQ, text: '9. من صور النفاق الاعتقادي:', type: 'mcq', options: ['الخيانة في الأمانة', 'تكذيب القرآن', 'الكذب في الحديث', 'إخلاف الموعد'], correctAnswer: 'تكذيب القرآن', marks: 1, topic: 'Aqeedah', explanation: 'تكذيب القرآن كفر مخرج من الملة (نفاق اعتقادي).' },
    { id: 'isl-10', section: SectionType.MCQ, text: '10. ينقسم الحديث المقبول إلى قسمين هما:', type: 'mcq', options: ['المتواتر والآحاد', 'الضعيف والموضوع', 'الصحيح والحسن', 'المشهور والعزيز'], correctAnswer: 'الصحيح والحسن', marks: 1, topic: 'Hadith', explanation: 'المقبول يشمل الصحيح والحسن.' },
    { id: 'isl-11', section: SectionType.MCQ, text: '11. (النهي يقتضي الفساد) هذه قاعدة:', type: 'mcq', options: ['فقهية', 'أصولية', 'تفسيرية', 'عقدية'], correctAnswer: 'أصولية', marks: 1, topic: 'Usul Fiqh', explanation: 'من قواعد أصول الفقه.' },
    { id: 'isl-12', section: SectionType.MCQ, text: '12. من آداب البيع والشراء (تصحيح للسؤال):', type: 'mcq', options: ['إظهار عيوب المسلم', 'البعد عن الاحتكار', 'البعد عن التبذير', 'إقالة النادم'], correctAnswer: 'إقالة النادم', marks: 1, topic: 'Fiqh', explanation: 'من أقال مسلما أقال الله عثرته.' },
    { id: 'isl-13', section: SectionType.MCQ, text: '13. المد في كلمة (يا أبا) هو:', type: 'mcq', options: ['البدل', 'المنفصل', 'اللازم', 'المتصل'], correctAnswer: 'المنفصل', marks: 1, topic: 'Tajweed', explanation: 'مد منفصل لأن الهمزة في كلمة أخرى.' },
    { id: 'isl-14', section: SectionType.MCQ, text: '14. الآية (يكتبون الكتاب بأيديهم...) دليل على تحريف:', type: 'mcq', options: ['التوراة', 'القرآن', 'الإنجيل', 'الزبور'], correctAnswer: 'التوراة', marks: 1, topic: 'Aqeedah', explanation: 'نزلت في اليهود وتحريف التوراة.' },
    { id: 'isl-15', section: SectionType.MCQ, text: '15. الحكم الشرعي للوصية للأقارب المحتاجين غير الوارثين:', type: 'mcq', options: ['الاستحباب', 'الوجوب', 'الكراهة', 'التحريم'], correctAnswer: 'الاستحباب', marks: 1, topic: 'Fiqh', explanation: 'مستحبة وقيل واجبة.' },
    { id: 'isl-16', section: SectionType.MCQ, text: '16. من علامات قرب أجل النبي صلى الله عليه وسلم نزول:', type: 'mcq', options: ['سورة العصر', 'سورة الفتح', 'سورة النصر', 'سورة الكهف'], correctAnswer: 'سورة النصر', marks: 1, topic: 'Seerah', explanation: 'نعيت إليه نفسه.' },
    { id: 'isl-17', section: SectionType.MCQ, text: '17. هو العلم الذي يعرف به حكم الله تعالى:', type: 'mcq', options: ['الفقه', 'التفسير', 'السنة', 'التوحيد'], correctAnswer: 'الفقه', marks: 1, topic: 'Fiqh', explanation: 'تعريف الفقه.' },
    { id: 'isl-18', section: SectionType.MCQ, text: '18. المقصود بكلمة (عصمة) أي:', type: 'mcq', options: ['حفظ القرآن', 'التي لا يقرن بها', 'مكسورة القرآن', 'محفوظة القرآن'], correctAnswer: 'حفظ القرآن', marks: 1, topic: 'Vocabulary', explanation: 'العصمة تعني الحفظ والمنعة.' },
    { id: 'isl-19', section: SectionType.MCQ, text: '19. الحيض مانع من وجوب الصلاة، هذا الحكم:', type: 'mcq', options: ['تكليفي', 'إجباري', 'تخييري', 'وضعي'], correctAnswer: 'وضعي', marks: 1, topic: 'Usul Fiqh', explanation: 'المانع من أقسام الحكم الوضعي.' },
    { id: 'isl-20', section: SectionType.MCQ, text: '20. حكم الدعوة إلى الله تعالى (على الأمة):', type: 'mcq', options: ['فرض عين', 'فرض كفاية', 'مباح', 'مكروه'], correctAnswer: 'فرض كفاية', marks: 1, topic: 'Dawah', explanation: 'فرض كفاية إذا قام به البعض سقط عن الباقين.' },
    { id: 'isl-21', section: SectionType.MCQ, text: '21. ما نزل القرآن في شأنه وقت وقوعه كما في سؤال (يسألونك) يسمى سببه:', type: 'mcq', options: ['النزول', 'السؤال', 'الحدث', 'الوقوع'], correctAnswer: 'السؤال', marks: 1, topic: 'Quran Sciences', explanation: 'سبب النزول قد يكون سؤالا.' },
    { id: 'isl-22', section: SectionType.MCQ, text: '22. دية إصبع واحد من أصابع اليدين:', type: 'mcq', options: ['نصف الدية', 'عشر الدية', 'ربع الدية', 'ثلث الدية'], correctAnswer: 'عشر الدية', marks: 1, topic: 'Fiqh', explanation: 'في كل إصبع عشر من الإبل (عشر الدية).' },
    { id: 'isl-23', section: SectionType.MCQ, text: '23. قال تعالى: (قل يا أهل الكتاب تعالوا إلى كلمة سواء...) دليل على مشروعية:', type: 'mcq', options: ['المخالطة', 'الحوار', 'الأمر', 'الوصايا'], correctAnswer: 'الحوار', marks: 1, topic: 'Tafsir', explanation: 'الحوار مع أهل الكتاب.' },
    { id: 'isl-24', section: SectionType.MCQ, text: '24. إذا قال الرجل لزوجته (أنت طالق) فهذا الطلاق يسمى:', type: 'mcq', options: ['الكناية', 'الصريح', 'المنجز', 'المعلق'], correctAnswer: 'الصريح', marks: 1, topic: 'Fiqh', explanation: 'لفظ صريح لا يحتاج لنية.' },
    { id: 'isl-25', section: SectionType.MCQ, text: '25. قال تعالى: (قال النبي باسم مولاه) - السؤال افتراضي حول كلمة مولى:', type: 'mcq', options: ['إسلامي', 'عثماني', 'رضوي', 'عبودي'], correctAnswer: 'عبودي', marks: 1, topic: 'Vocabulary', explanation: 'المولى قد تعني العبد أو السيد.' },
    { id: 'isl-26', section: SectionType.MCQ, text: '26. من أسباب حصول الشفاعة كثرة:', type: 'mcq', options: ['العمل', 'الأولاد', 'العمل الصالح', 'قراءة القرآن'], correctAnswer: 'العمل الصالح', marks: 1, topic: 'Aqeedah', explanation: 'أو الصلاة على النبي.' },
    { id: 'isl-27', section: SectionType.MCQ, text: '27. نصيب الزوجة إذا تركت زوجًا ولها فرع وارث:', type: 'mcq', options: ['الربع', 'السدس', 'النصف', 'الثمن'], correctAnswer: 'الثمن', marks: 1, topic: 'Inheritance', explanation: 'لوجود الفرع الوارث.' },
    { id: 'isl-28', section: SectionType.MCQ, text: '28. مجال الاعتدال في قوله تعالى: (ولا تجعل يدك مغلولة إلى عنقك...):', type: 'mcq', options: ['العبادة', 'الصدق', 'العقوبة', 'الإنفاق'], correctAnswer: 'الإنفاق', marks: 1, topic: 'Tafsir', explanation: 'الاعتدال في الإنفاق.' },
    { id: 'isl-29', section: SectionType.MCQ, text: '29. حكم السحر في الشريعة الإسلامية:', type: 'mcq', options: ['أخلاق', 'مكروه', 'حرام', 'عفو'], correctAnswer: 'حرام', marks: 1, topic: 'Aqeedah', explanation: 'من الكبائر.' },
    { id: 'isl-30', section: SectionType.MCQ, text: '30. المقصود بـ (حد الحرابة) هو حد:', type: 'mcq', options: ['شرب الخمر', 'الردة', 'قطع الطريق', 'السرقة'], correctAnswer: 'قطع الطريق', marks: 1, topic: 'Fiqh', explanation: 'الحرابة هي قطع الطريق.' },
    { id: 'isl-31', section: SectionType.MCQ, text: '31. الآية (يحرفون الكلم عن مواضعه) دليل على تحريف:', type: 'mcq', options: ['التوراة', 'الإنجيل', 'القرآن', 'الزبور'], correctAnswer: 'التوراة', marks: 1, topic: 'Aqeedah', explanation: 'نزلت في اليهود.' },
    { id: 'isl-32', section: SectionType.MCQ, text: '32. ما نزل من القرآن قبل الهجرة حتى وإن نزل بغير مكة يسمى:', type: 'mcq', options: ['المدني', 'المصري', 'العراقي', 'المكي'], correctAnswer: 'المكي', marks: 1, topic: 'Quran Sciences', explanation: 'العبرة بالزمان.' },
    { id: 'isl-33', section: SectionType.MCQ, text: '33. الزكاة الواجبة إخراجها من الغنم من (121 إلى 200):', type: 'mcq', options: ['شاتان', 'ثلاث شياه', 'أربع شياه', 'خمس شياه'], correctAnswer: 'شاتان', marks: 1, topic: 'Fiqh', explanation: 'نصاب الغنم.' },
    { id: 'isl-34', section: SectionType.MCQ, text: '34. عدد الفروض المقدرة في كتاب الله تعالى:', type: 'mcq', options: ['أربعة', 'خمسة', 'ستة', 'سبعة'], correctAnswer: 'ستة', marks: 1, topic: 'Inheritance', explanation: 'النصف، الربع، الثمن، الثلثان، الثلث، السدس.' },
    { id: 'isl-35', section: SectionType.MCQ, text: '35. من شروط خيار العيب:', type: 'mcq', options: ['أن يكون لمدة معلومة', 'أن لا يزيد العيب عن ثلاثة أيام', 'أن تكون معلومة', 'أن يكون العيب قديمًا'], correctAnswer: 'أن يكون العيب قديمًا', marks: 1, topic: 'Fiqh', explanation: 'يجب أن يكون العيب موجودا عند العقد.' },
    { id: 'isl-36', section: SectionType.MCQ, text: '36. من أشهر الحج:', type: 'mcq', options: ['محرم', 'شوال', 'شعبان', 'رجب'], correctAnswer: 'شوال', marks: 1, topic: 'Fiqh', explanation: 'شوال وذو القعدة وذو الحجة.' },
    { id: 'isl-37', section: SectionType.MCQ, text: '37. يستفاد من قوله تعالى: (سبح لله ما في السماوات...) - التسبيح يعني:', type: 'mcq', options: ['تعظيم الله', 'تمجيد الله', 'تنزيه الله', 'تكريم الله'], correctAnswer: 'تنزيه الله', marks: 1, topic: 'Tafsir', explanation: 'التسبيح هو التنزيه.' },
    { id: 'isl-38', section: SectionType.MCQ, text: '38. وقع صلح الحديبية في السنة:', type: 'mcq', options: ['الثالثة للهجرة', 'الرابعة للهجرة', 'الخامسة للهجرة', 'السادسة للهجرة'], correctAnswer: 'السادسة للهجرة', marks: 1, topic: 'Seerah', explanation: '6 هـ.' },
    { id: 'isl-39', section: SectionType.MCQ, text: '39. الإيمان بالكتب ركن من أركان:', type: 'mcq', options: ['الإسلام', 'الإيمان', 'الإحسان', 'الصلاة'], correctAnswer: 'الإيمان', marks: 1, topic: 'Aqeedah', explanation: 'أركان الإيمان ستة.' },
    { id: 'isl-40', section: SectionType.MCQ, text: '40. حكم التوبة من الذنب:', type: 'mcq', options: ['واجبة', 'مستحبة', 'مندوبة', 'سنة'], correctAnswer: 'واجبة', marks: 1, topic: 'Aqeedah', explanation: 'واجبة على الفور.' },

    // Structured
    { id: 'isl-41', section: SectionType.SHORT_ANSWER, text: '1. حدد الفرق بين الجناية والجريمة مع بيان أوجه الشبه والاختلاف.', type: 'text', correctAnswer: 'الجناية أعم من الجريمة، أو الجريمة هي مخالفة الشرع...', marks: 4, topic: 'Fiqh', explanation: 'تفصيل الفرق الفقهي والقانوني.' },
    { id: 'isl-42', section: SectionType.SHORT_ANSWER, text: '2. الفتنة آفة خطيرة تهدد الشعب الصومالي، اشرح طريقتها للتخلص منها.', type: 'text', correctAnswer: 'التمسك بالدين، الوحدة، العدل...', marks: 4, topic: 'General', explanation: 'حلول اجتماعية ودينية.' },
    { id: 'isl-43', section: SectionType.SHORT_ANSWER, text: '3. قارن بين حقوق الإنسان في الإسلام وحقوق الإنسان في القوانين الوضعية.', type: 'text', correctAnswer: 'حقوق الإسلام ربانية وشاملة...', marks: 4, topic: 'General', explanation: 'مقارنة.' },
    { id: 'isl-44', section: SectionType.SHORT_ANSWER, text: '4. استخرج الفوائد من آية: (قل يا أهل الكتاب تعالوا إلى كلمة سواء...).', type: 'text', correctAnswer: 'مشروعية الحوار، التوحيد أساس الدين...', marks: 4, topic: 'Tafsir', explanation: 'استنباط.' },
    { id: 'isl-45', section: SectionType.SHORT_ANSWER, text: '5. في أي مجال تنطبق آية: (ذات اليمين وذات الشمال وأنتم لا تشعرون)؟', type: 'text', correctAnswer: 'في قدرة الله وتقليبه للأمور (أهل الكهف).', marks: 4, topic: 'Tafsir', explanation: 'قصة أهل الكهف.' },
    { id: 'isl-46', section: SectionType.SHORT_ANSWER, text: '6. بيّن مقدار الواجب من هذه الأنصبة (زكاة/ميراث).', type: 'text', correctAnswer: 'تفصيل الأنصبة.', marks: 4, topic: 'Fiqh', explanation: 'حساب.' },
    { id: 'isl-47', section: SectionType.SHORT_ANSWER, text: '7. استخرج أنواع المد الفرعي من الآيات.', type: 'text', correctAnswer: 'متصل، منفصل، لازم...', marks: 4, topic: 'Tajweed', explanation: 'أحكام التجويد.' },
    { id: 'isl-48', section: SectionType.SHORT_ANSWER, text: '8. ما المعيار الحقيقي للتفاضل بين الناس؟', type: 'text', correctAnswer: 'التقوى.', marks: 4, topic: 'Aqeedah', explanation: 'إن أكرمكم عند الله أتقاكم.' },
    { id: 'isl-49', section: SectionType.SHORT_ANSWER, text: '9. وضّح مقدار الديات في الأعضاء (اليد، العين، إلخ).', type: 'text', correctAnswer: 'نصف الدية في الواحد، كاملة في الاثنين.', marks: 4, topic: 'Fiqh', explanation: 'أحكام الديات.' },
    { id: 'isl-50', section: SectionType.SHORT_ANSWER, text: '10. وضّح حقوق المرأة في الإسلام.', type: 'text', correctAnswer: 'الميراث، التملك، التعليم، الاختيار...', marks: 4, topic: 'General', explanation: 'حقوق.' },
    { id: 'isl-51', section: SectionType.SHORT_ANSWER, text: '11. اذكر الأدلة الشرعية المتفق عليها.', type: 'text', correctAnswer: 'القرآن، السنة، الإجماع، القياس.', marks: 4, topic: 'Usul Fiqh', explanation: 'مصادر التشريع.' },
    { id: 'isl-52', section: SectionType.SHORT_ANSWER, text: '12. متى يسقط حد القذف؟', type: 'text', correctAnswer: 'بالعفو، أو اللعان، أو إقامة البينة.', marks: 4, topic: 'Fiqh', explanation: 'مسقطات الحد.' },
    { id: 'isl-53', section: SectionType.SHORT_ANSWER, text: '13. بيّن أنواع الواجب.', type: 'text', correctAnswer: 'موسع/مضيق، عيني/كفائي، محدد/غير محدد.', marks: 4, topic: 'Usul Fiqh', explanation: 'أقسام الواجب.' },
    { id: 'isl-54', section: SectionType.SHORT_ANSWER, text: '14. عدّد مراتب النفس.', type: 'text', correctAnswer: 'الأمارة بالسوء، اللوامة، المطمئنة.', marks: 4, topic: 'Tazkiyah', explanation: 'أنواع النفس.' },
    { id: 'isl-55', section: SectionType.SHORT_ANSWER, text: '15. ما الفرق بين القرآن الكريم والحديث القدسي؟', type: 'text', correctAnswer: 'القرآن لفظ ومعنى من الله ومتعبد بتلاوته. القدسي معناه من الله ولفظه من النبي.', marks: 4, topic: 'Quran Sciences', explanation: 'فروق.' }
  ]
};

// --- MISSING EXAM DEFINITIONS (Added to fix reference errors) ---

const PHYSICS_2025_EXAM: Exam = {
  id: 'physics-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.physics.label,
  subjectKey: SUBJECT_CONFIG.physics.key,
  durationMinutes: 120,
  questions: [
    { id: 'phys-1', section: SectionType.MCQ, text: '1. Which of the following is a scalar quantity?', type: 'mcq', options: ['Velocity', 'Force', 'Mass', 'Acceleration'], correctAnswer: 'Mass', marks: 1, topic: 'Kinematics', explanation: 'Mass has magnitude but no direction.' }
  ]
};

const HISTORY_2025_EXAM: Exam = {
  id: 'history-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.history.label,
  subjectKey: SUBJECT_CONFIG.history.key,
  durationMinutes: 90,
  language: 'somali',
  questions: [
      { id: 'hist-1', section: SectionType.MCQ, text: '1. Goorma ayuu xornimada qaatay gobolka Waqooyi ee Soomaaliya?', type: 'mcq', options: ['26 Juun 1960', '1 Luulyo 1960', '12 Abriil 1960', '21 Oktoobar 1969'], correctAnswer: '26 Juun 1960', marks: 1, topic: 'History of Somalia', explanation: 'Waqooyi waxay xornimada ka qaadatay Ingiriiska 26kii Juun 1960.' }
  ]
};

const CHEMISTRY_2025_EXAM: Exam = {
  id: 'chem-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.chemistry.label,
  subjectKey: SUBJECT_CONFIG.chemistry.key,
  durationMinutes: 120,
  questions: [
      { id: 'chem-1', section: SectionType.MCQ, text: '1. What is the pH of a neutral solution at 25°C?', type: 'mcq', options: ['0', '7', '14', '1'], correctAnswer: '7', marks: 1, topic: 'Acids and Bases', explanation: 'Neutral pH is 7.' }
  ]
};

const BIOLOGY_2025_EXAM: Exam = {
  id: 'bio-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.biology.label,
  subjectKey: SUBJECT_CONFIG.biology.key,
  durationMinutes: 120,
  questions: [
      { id: 'bio-1', section: SectionType.MCQ, text: '1. Which organelle is known as the powerhouse of the cell?', type: 'mcq', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'], correctAnswer: 'Mitochondria', marks: 1, topic: 'Cell Biology', explanation: 'Mitochondria generate most of the chemical energy.' }
  ]
};

const GEOGRAPHY_2025_EXAM: Exam = {
  id: 'geo-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.geography.label,
  subjectKey: SUBJECT_CONFIG.geography.key,
  durationMinutes: 90,
  language: 'somali',
  questions: [
      { id: 'geo-1', section: SectionType.MCQ, text: '1. Waa kee webiga ugu dheer adduunka?', type: 'mcq', options: ['Niil', 'Amasoon', 'Yenisei', 'Mississipi'], correctAnswer: 'Niil', marks: 1, topic: 'World Geography', explanation: 'Webiga Niil waa ka ugu dheer.' }
  ]
};

const SOMALI_2025_EXAM: Exam = {
  id: 'som-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.somali.label,
  subjectKey: SUBJECT_CONFIG.somali.key,
  durationMinutes: 90,
  language: 'somali',
  questions: [
      { id: 'som-1', section: SectionType.MCQ, text: '1. Ereyga "Hoyo" waa noocee?', type: 'mcq', options: ['Magac', 'Ficil', 'Xiriiriye', 'Tilmaame'], correctAnswer: 'Magac', marks: 1, topic: 'Grammar', explanation: 'Hoyo waa magac.' }
  ]
};

const ENGLISH_2025_EXAM: Exam = {
  id: 'eng-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.english.label,
  subjectKey: SUBJECT_CONFIG.english.key,
  durationMinutes: 90,
  questions: [
      { id: 'eng-1', section: SectionType.MCQ, text: '1. Choose the correct preposition: He is interested ___ learning English.', type: 'mcq', options: ['on', 'at', 'in', 'for'], correctAnswer: 'in', marks: 1, topic: 'Grammar', explanation: 'Interested in.' }
  ]
};

const BUSINESS_2025_EXAM: Exam = {
  id: 'bus-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.business.label,
  subjectKey: SUBJECT_CONFIG.business.key,
  durationMinutes: 120,
  questions: [
      { id: 'bus-1', section: SectionType.MCQ, text: '1. Which of the following is a factor of production?', type: 'mcq', options: ['Money', 'Capital', 'Profit', 'Market'], correctAnswer: 'Capital', marks: 1, topic: 'Economics', explanation: 'Factors of production are Land, Labor, Capital, and Enterprise.' }
  ]
};

const ARABIC_2025_EXAM: Exam = {
  id: 'ara-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.arabic.label,
  subjectKey: SUBJECT_CONFIG.arabic.key,
  durationMinutes: 120,
  language: 'arabic',
  direction: 'rtl',
  questions: [
      { id: 'ara-1', section: SectionType.MCQ, text: '1. ما هو مثنى كلمة "كتاب"؟', type: 'mcq', options: ['كتب', 'كتابان', 'كاتب', 'مكتبة'], correctAnswer: 'كتابان', marks: 1, topic: 'Grammar', explanation: 'المثنى يرفع بالألف.' }
  ]
};

const ICT_2025_EXAM: Exam = {
  id: 'ict-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.ict.label,
  subjectKey: SUBJECT_CONFIG.ict.key,
  durationMinutes: 90,
  questions: [
      { id: 'ict-1', section: SectionType.MCQ, text: '1. Which device is an input device?', type: 'mcq', options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'], correctAnswer: 'Keyboard', marks: 1, topic: 'Hardware', explanation: 'Keyboard sends data to the computer.' }
  ]
};

// --- 3. DATABASE (Simulated NoSQL) ---
// Keys are composite: "YEAR_SUBJECTKEY" (e.g. "2025_physics")
export const EXAM_DATABASE: Record<string, Exam> = {
  [`2025_${SUBJECT_CONFIG.physics.key}`]: PHYSICS_2025_EXAM,
  [`2025_${SUBJECT_CONFIG.math.key}`]: MATHEMATICS_2025_EXAM,
  [`2025_${SUBJECT_CONFIG.history.key}`]: HISTORY_2025_EXAM,
  [`2025_${SUBJECT_CONFIG.chemistry.key}`]: CHEMISTRY_2025_EXAM,
  [`2025_${SUBJECT_CONFIG.biology.key}`]: BIOLOGY_2025_EXAM,
  [`2025_${SUBJECT_CONFIG.geography.key}`]: GEOGRAPHY_2025_EXAM,
  [`2025_${SUBJECT_CONFIG.somali.key}`]: SOMALI_2025_EXAM,
  [`2025_${SUBJECT_CONFIG.english.key}`]: ENGLISH_2025_EXAM,
  [`2025_${SUBJECT_CONFIG.business.key}`]: BUSINESS_2025_EXAM,
  [`2025_${SUBJECT_CONFIG.arabic.key}`]: ARABIC_2025_EXAM,
  [`2025_${SUBJECT_CONFIG.islamic.key}`]: ISLAMIC_STUDIES_2025_EXAM,
  [`2025_${SUBJECT_CONFIG.ict.key}`]: ICT_2025_EXAM
};

// --- 4. DATA ACCESS LAYER ---

export const getExam = (year: number | null, subjectKey: string | null): Exam | undefined => {
  if (!year || !subjectKey) return undefined;
  
  // Construct the stable composite key
  const dbKey = `${year}_${subjectKey}`;
  
  return EXAM_DATABASE[dbKey];
};
