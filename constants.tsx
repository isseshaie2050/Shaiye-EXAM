
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

// --- GEOGRAPHY 2025 ---
const GEOGRAPHY_2025_EXAM: Exam = {
  id: 'geo-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.geography.label,
  subjectKey: SUBJECT_CONFIG.geography.key,
  durationMinutes: 120,
  direction: 'ltr',
  language: 'somali',
  questions: [
    // --- SECTION 1: MCQs (1-40) ---
    { id: 'geo-1', section: SectionType.MCQ, text: '1. Noocyada carrada ee dhulka Soomaaliya waa kala jaad, waxaana keenaya kala duwanaanta:', type: 'mcq', options: ['Nooca cimilada iyo dhadhabta', 'Nooca cimilada iyo folkaanaha', 'Nooca dhadhabta keliya', 'Nooca cimilada keliya'], correctAnswer: 'Nooca cimilada iyo dhadhabta', marks: 1, topic: 'Physical Geography', explanation: 'Soil formation factors.' },
    { id: 'geo-2', section: SectionType.MCQ, text: '2. Qaybta ugu weyn uguna muhiimsan qaybaha dhirta waxaa laga magacaabaa:', type: 'mcq', options: ['Keymaha', 'Cawska', 'Haramaha', 'Istibis'], correctAnswer: 'Keymaha', marks: 1, topic: 'Vegetation', explanation: 'Forests are major.' },
    { id: 'geo-3', section: SectionType.MCQ, text: '3. Maxay yihiin hababka wadidqaada Makanikada ay kaga duwan tahay wadidqaada Kiimikada?', type: 'mcq', options: ['Teed dhireed iyo teedad adag', 'Teedad gaaban iyo teed dhireed', 'Teedad adag iyo walxaha shidaalka', 'Walxaha shidaalka iyo teed dhireed'], correctAnswer: 'Teed dhireed iyo teedad adag', marks: 1, topic: 'Physical Geography', explanation: 'Weathering types.' },
    { id: 'geo-4', section: SectionType.MCQ, text: '4. Adigoo adeegsanaya jaantuska hoose, tilmaam lambarka muujinaya gobolka Jubadda Hoose:', type: 'mcq', options: ['Lambarka 12aad', 'Lambarka 8aad', 'Lambarka 18aad', 'Lambarka 17aad'], correctAnswer: 'Lambarka 18aad', marks: 1, topic: 'Somali Geography', explanation: 'Map reading.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-12-2026-10_27_49-AM.png' },
    { id: 'geo-5', section: SectionType.MCQ, text: '5. Marka aynu joogno magaalooyinka xeebaha, sida la dareemi karo huurka wuxuu noqdaa mid:', type: 'mcq', options: ['Kordha', 'Hoos u dhaca', 'Dhexdhexaad ah', 'Aan muuqan'], correctAnswer: 'Kordha', marks: 1, topic: 'Climate', explanation: 'Humidity increases near coast.' },
    { id: 'geo-6', section: SectionType.MCQ, text: '6. Jiidaha dhulka Soomaaliya waxaa loo qeybiyaa ilaa iyo:', type: 'mcq', options: ['4 qeybood', '3 qeybood', '5 qeybood', '6 qeybood'], correctAnswer: '5 qeybood', marks: 1, topic: 'Somali Geography', explanation: 'Five main geographic zones.' },
    { id: 'geo-7', section: SectionType.MCQ, text: '7. Maxaa dhacaya haddii tirada dadka ay ka sara marto ilaha dhaqaale ee dabiiciga ah?', type: 'mcq', options: ['Taran dhimid', 'Taran furan', 'Taran dhaqid', 'Taran fatah'], correctAnswer: 'Taran fatah', marks: 1, topic: 'Population', explanation: 'Overpopulation.' },
    { id: 'geo-8', section: SectionType.MCQ, text: '8. Xaalad ka dhalata hoos u dhac ku yimaada roobka muddo dheer waxaa loo yaqaan:', type: 'mcq', options: ['Lama degaan', 'Daad', 'Barwaaqo', 'Abaar'], correctAnswer: 'Abaar', marks: 1, topic: 'Climate', explanation: 'Drought definition.' },
    { id: 'geo-9', section: SectionType.MCQ, text: '9. Waxyaabaha dabiiciga ah ee saameeya bahsanaanta tirada dadka waxaa ka mid ah:', type: 'mcq', options: ['Cimilada', 'Xirfadda', 'Dhimashada', 'Socdaalka'], correctAnswer: 'Cimilada', marks: 1, topic: 'Population', explanation: 'Natural factors include climate.' },
    { id: 'geo-10', section: SectionType.MCQ, text: '10. Goob cufnaanta dadkeedu ka badan yahay 100 qof halkii km² waa goob dadku ay:', type: 'mcq', options: ['Sarreyso', 'Hooseyso', 'Aad u sarreyso', 'Aad u hooseyso'], correctAnswer: 'Sarreyso', marks: 1, topic: 'Population', explanation: 'High density.' },
    { id: 'geo-11', section: SectionType.MCQ, text: '11. Sanadkii 1970, guud ahaan tirada warshadaha dalka ku yaallay waxay ahaayeen:', type: 'mcq', options: ['190 warshadood', '180 warshadood', '120 warshadood', '122 warshadood'], correctAnswer: '122 warshadood', marks: 1, topic: 'Economy', explanation: 'Historical industrial data.' },
    { id: 'geo-12', section: SectionType.MCQ, text: '12. Marka laysku qeybiyo tirada dadka iyo baaxadda dalka, waxaa loo yaqaan:', type: 'mcq', options: ['Koror dabiici ah', 'Koror aan dabiici ahayn', 'Cufnaanta dadka', 'Kororka waddamada'], correctAnswer: 'Cufnaanta dadka', marks: 1, topic: 'Population', explanation: 'Population Density Formula.' },
    { id: 'geo-13', section: SectionType.MCQ, text: '13. Adigoo eegaya jaantuska hoos ku sawiran, sheeg il tamareed loo adeegsado:', type: 'mcq', options: ['Tamarta dabaysha', 'Tamarta biyaha', 'Tamarta korontada', 'Tamarta qorraxda'], correctAnswer: 'Tamarta dabaysha', marks: 1, topic: 'Resources', explanation: 'Wind energy.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/iec-en-61400-12-5-ruzgar-enerjisi-uretim-sistemleri-bolum-12-5_-guc-performansi-engellerin-ve-arazinin-degerlendirilmesi-testi.jpg' },
    { id: 'geo-14', section: SectionType.MCQ, text: '14. Goobaha ugu warshadaha badan adduunka waxaa ka mid ah:', type: 'mcq', options: ['Galbeedka Afrika', 'Galbeedka Yurub', 'Koonfurta Ameerika', 'Waqooyiga Aasiya'], correctAnswer: 'Galbeedka Yurub', marks: 1, topic: 'Industry', explanation: 'Major industrial regions.' },
    { id: 'geo-15', section: SectionType.MCQ, text: '15. Waa tee laanta Jiyoolojiga ee la adeegsado marka la dhisayo buundo:', type: 'mcq', options: ['Jiyoolojiga bay’ada', 'Jiyoolojiga handasada', 'Jiyoolojiga waxbarashada', 'Jiyoolojiga saliidda'], correctAnswer: 'Jiyoolojiga handasada', marks: 1, topic: 'Geology', explanation: 'Engineering Geology.' },
    { id: 'geo-16', section: SectionType.MCQ, text: '16. Dadka dunida ku nool dhulka dushiisa waxay u qaybsan yihiin qaab:', type: 'mcq', options: ['Isla’eg', 'Aan isla ekeyn', 'Toosan', 'Dheellitiran'], correctAnswer: 'Aan isla ekeyn', marks: 1, topic: 'Population', explanation: 'Uneven distribution.' },
    { id: 'geo-17', section: SectionType.MCQ, text: '17. Diiwaangelinta dhalashada, dhimashada, guurka iyo furiinka waa:', type: 'mcq', options: ['Tirakoobka dadka', 'Tirakoob muhiim ah', 'Fiiqsanaanta dadka', 'Diiwaan gelinta dadka'], correctAnswer: 'Diiwaan gelinta dadka', marks: 1, topic: 'Population', explanation: 'Civil Registration.' },
    { id: 'geo-18', section: SectionType.MCQ, text: '18. Ilaha tamarta dib loo cusboonaysiin karo waxaa ka mid ah:', type: 'mcq', options: ['Tamarta cadceedda', 'Tamarta dhuxusha', 'Tamarta yuraaniyamka', 'Tamarta gaaska dabiiciga ah'], correctAnswer: 'Tamarta cadceedda', marks: 1, topic: 'Energy', explanation: 'Solar energy is renewable.' },
    { id: 'geo-19', section: SectionType.MCQ, text: '19. Sohdin dabiici ah waa xuduud lagu saleeyo astaamaha muuqaallada dabiiciga ah sida:', type: 'mcq', options: ['Buuro', 'Xariiq', 'Handasi', 'Ilbaxnimo'], correctAnswer: 'Buuro', marks: 1, topic: 'Boundaries', explanation: 'Natural boundaries like mountains.' },
    { id: 'geo-20', section: SectionType.MCQ, text: '20. Kuwaan soo socda keeban kama mid aha shaqooyinka sohdinta siyaasadeed:', type: 'mcq', options: ['Kala saaridda dalalka', 'Ilaalinta amniga', 'Ilaalinta dhaqaalaha', 'Maamulka xadka'], correctAnswer: 'Maamulka xadka', marks: 1, topic: 'Political Geography', explanation: 'Management is a process, not a function of the line itself.' },
    { id: 'geo-21', section: SectionType.MCQ, text: '21. Haddii aad rabto inaad beerato dalag, carro nooce ah ayaa ku habboon:', type: 'mcq', options: ['Carro hurdiga', 'Carro maanyo', 'Carro bannaan xeebeed', 'Carro madow'], correctAnswer: 'Carro madow', marks: 1, topic: 'Agriculture', explanation: 'Black soil is fertile.' },
    { id: 'geo-22', section: SectionType.MCQ, text: '22. Waa imisa loolalka ay dhacaan goobaha kulul, haddii wadartu tahay 180°?', type: 'mcq', options: ['30°', '60°', '45°', '23°'], correctAnswer: '60°', marks: 1, topic: 'Climate Zones', explanation: 'Tropical zone spans approx 60 degrees (30N to 30S).' },
    { id: 'geo-23', section: SectionType.MCQ, text: '23. Maxay noqonayaan wadarta warshadaha ku yaallay Muqdisho iyo Hargeysa?', type: 'mcq', options: ['154', '153', '155', '157'], correctAnswer: '155', marks: 1, topic: 'Industry', explanation: 'Historical data.' },
    { id: 'geo-24', section: SectionType.MCQ, text: '24. Magaalo ay dadka badankood ku mashquulsan yihiin waxbarasho waxaa loo yaqaan:', type: 'mcq', options: ['Magaalo diimeed', 'Magaalo warshadeed', 'Magaalo aqooneed', 'Magaalo maamul'], correctAnswer: 'Magaalo aqooneed', marks: 1, topic: 'Urban Geography', explanation: 'Educational city.' },
    { id: 'geo-25', section: SectionType.MCQ, text: '25. Ururinta xog juqraafi iyadoo la adeegsanayo indha-indheyn waxaa la yiraahdaa:', type: 'mcq', options: ['Cilmi qoran', 'Xog kaydsan', 'Cilmi baaris', 'Xog tilmaaman'], correctAnswer: 'Cilmi baaris', marks: 1, topic: 'Research Methods', explanation: 'Field research/Observation.' },
    { id: 'geo-26', section: SectionType.MCQ, text: '26. Hanaanka diyaarinta xogta Juqraafiyadu wuxuu maraa ilaa iyo:', type: 'mcq', options: ['Lix heer', 'Shan heer', 'Toddobo heer', 'Sagaal heer'], correctAnswer: 'Shan heer', marks: 1, topic: 'Research Methods', explanation: 'Five stages of data preparation.' },
    { id: 'geo-27', section: SectionType.MCQ, text: '27. Badda furan waxay kaga duwan tahay badda xiran:', type: 'mcq', options: ['Waxay la xiriirtaa badweyn', 'Waxay leedahay marin cariiri ah', 'Waxay leedahay dooxo', 'Waxay leedahay haro'], correctAnswer: 'Waxay la xiriirtaa badweyn', marks: 1, topic: 'Hydrology', explanation: 'Open seas connect to oceans.' },
    { id: 'geo-28', section: SectionType.MCQ, text: '28. Farqiga heerkulka maalinta iyo sanadka ee cimilada badhalaaha waxaa lagu gartaa:', type: 'mcq', options: ['Hooseyn', 'Sarreyn', 'Dhexdhexaad', 'Diirimaad'], correctAnswer: 'Hooseyn', marks: 1, topic: 'Climate', explanation: 'Low temperature range in equatorial zones.' },
    { id: 'geo-29', section: SectionType.MCQ, text: '29. Marka noole uu ku noolaado mid kale isagoo ka faa’iideysanaya, waxaa loo yaqaan:', type: 'mcq', options: ['Isla noolaansho', 'Ugaadhsi', 'Wada noolaansho', 'Kala faa’iidaysi'], correctAnswer: 'Kala faa’iidaysi', marks: 1, topic: 'Ecology', explanation: 'Parasitism/Exploitation.' },
    { id: 'geo-30', section: SectionType.MCQ, text: '30. Adigoo eegaya khariidada hoos ku sawiran, waa kee lambarka lagu calaamadeeyey dalka Masar:', type: 'mcq', options: ['Lambarka 4aad', 'Lambarka 6aad', 'Lambarka 49aad', 'Lambarka 31aad'], correctAnswer: 'Lambarka 6aad', marks: 1, topic: 'Regional Geography', explanation: 'Egypt map location.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-13-2026-02_28_41-AM.png' },
    { id: 'geo-31', section: SectionType.MCQ, text: '31. Maxaa dhacaya haddii dadkii aqoonta lahaa ay dalka ka tahriibaan:', type: 'mcq', options: ['Maan ququl', 'Maan cabburin', 'Maan fatah', 'Maan go’id'], correctAnswer: 'Maan ququl', marks: 1, topic: 'Population', explanation: 'Brain drain.' },
    { id: 'geo-32', section: SectionType.MCQ, text: '32. Degmooyinka miyiga ah waxay kaga duwan yihiin kuwa magaalooyinka:', type: 'mcq', options: ['Xajmigooda oo yar', 'Xiriirkooda oo liita', 'Heer nololeed oo sarreeya', 'Dhaqaale badan'], correctAnswer: 'Xiriirkooda oo liita', marks: 1, topic: 'Urban/Rural', explanation: 'Poor infrastructure in rural areas.' },
    { id: 'geo-33', section: SectionType.MCQ, text: '33. Meeraha ugu dhaw qorraxda waa:', type: 'mcq', options: ['Maaris', 'Dhulka', 'Merkuri', 'Safeen'], correctAnswer: 'Merkuri', marks: 1, topic: 'Solar System', explanation: 'Mercury is closest.' },
    { id: 'geo-34', section: SectionType.MCQ, text: '34. Haddii waqtiga Muqdisho (45° bari) uu yahay 10:00 subaxnimo, waa imisa waqtiga Qaahira (30° bari)?', type: 'mcq', options: ['11:00 AM', '09:00 AM', '10:30 AM', '12:00 PM'], correctAnswer: '09:00 AM', marks: 1, topic: 'Time Zones', explanation: '15 degrees west = -1 hour.' },
    { id: 'geo-35', section: SectionType.MCQ, text: '35. Kee kama mid aha calaamadaha khariidadda:', type: 'mcq', options: ['Qiyaaska', 'Tusmada', 'Cinwaanka', 'Dug baxa'], correctAnswer: 'Dug baxa', marks: 1, topic: 'Map Skills', explanation: 'Not a map element.' },
    { id: 'geo-36', section: SectionType.MCQ, text: '36. Wadanka ugu wax-soo-saarka badan gaaska dabiiciga ah waa:', type: 'mcq', options: ['Baxreyn', 'Imaaraadka', 'Qadar', 'Aljeeriya'], correctAnswer: 'Qadar', marks: 1, topic: 'Economy', explanation: 'Qatar is a major gas producer.' },
    { id: 'geo-37', section: SectionType.MCQ, text: '37. Wadanka ugu horreeyay ee bilaabay sahaminta Juqraafiyadda waa:', type: 'mcq', options: ['Bortaqiis', 'Ingiriis', 'Talyaani', 'Isbaanish'], correctAnswer: 'Bortaqiis', marks: 1, topic: 'History of Geo', explanation: 'Portugal started the Age of Discovery.' },
    { id: 'geo-38', section: SectionType.MCQ, text: '38. Sawirka hoos ku qoran wuxuu muujinayaa nooca folkaanaha:', type: 'mcq', options: ['Firfircoon', 'Meyd', 'Huruda', 'Muuqata'], correctAnswer: 'Firfircoon', marks: 1, topic: 'Physical Geography', explanation: 'Active volcano.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/active-volcano.png' },
    { id: 'geo-39', section: SectionType.MCQ, text: '39. Khariidadda muujisa beeraha, warshadaha iyo ganacsiga waa khariidadda:', type: 'mcq', options: ['Siyaasadda', 'Dhaqaalaha', 'Cimilada', 'Isgaarsiinta'], correctAnswer: 'Dhaqaalaha', marks: 1, topic: 'Map Types', explanation: 'Economic map.' },
    { id: 'geo-40', section: SectionType.MCQ, text: '40. Soomaaliya waxay leedahay 18,000,000 qof iyo baaxad dhan 637,657 km². Waa imisa cufnaanta dadkeedu?', type: 'mcq', options: ['30 qof/km²', '28 qof/km²', '12 qof/km²', '16 qof/km²'], correctAnswer: '28 qof/km²', marks: 1, topic: 'Population', explanation: '18m/637k approx 28.' },

    // --- SECTION 2: Structured Questions (41-55) ---
    { id: 'geo-41', section: SectionType.SHORT_ANSWER, text: '1. Falanqee kaalinta culimada Muslimiinta ee Cilmiga Jiyoolojiga. (4 dhibcood)', type: 'text', correctAnswer: 'Waxay sameeyeen khariidado, wax ka qoreen dhagxaanta iyo macdanta.', marks: 4, topic: 'History of Geography', explanation: 'Muslim contributions.' },
    { id: 'geo-42', section: SectionType.SHORT_ANSWER, text: '2. Kala saar gobollada dabiiciga ah ee dunida. (4 dhibcood)', type: 'text', correctAnswer: 'Gobolada: Kulaylaha, Dhexdhexaadka, Qabowga.', marks: 4, topic: 'Natural Regions', explanation: 'Natural regions.' },
    { id: 'geo-43', section: SectionType.SHORT_ANSWER, text: '3. Falanqee qaababka wasakhawga hawada. (4 dhibcood)', type: 'text', correctAnswer: 'Warshadaha, Gawaarida, Gubida qashinka.', marks: 4, topic: 'Environment', explanation: 'Air pollution.' },
    { id: 'geo-44', section: SectionType.SHORT_ANSWER, text: '4. Qor xalal looga hortagi karo daadadka. (4 dhibcood)', type: 'text', correctAnswer: 'Biyo xireeno, Dhireynta, Kanaalada.', marks: 4, topic: 'Disaster Management', explanation: 'Flood prevention.' },
    { id: 'geo-45', section: SectionType.SHORT_ANSWER, text: '5. Falanqee ahmiyadda istiraatiijiyadeed ee dhulka Soomaaliyeed. (4 dhibcood)', type: 'text', correctAnswer: 'Bada cas, Badweynta Hindiya, Marinka Bab el Mandeb.', marks: 4, topic: 'Somali Geography', explanation: 'Strategic location.' },
    { id: 'geo-46', section: SectionType.SHORT_ANSWER, text: '6. Sharax sida ay dadka Soomaaliyeed ugu kala firirsan yihiin dalka. (4 dhibcood)', type: 'text', correctAnswer: 'Magaalooyinka, Webiyada, Xeebaha.', marks: 4, topic: 'Population', explanation: 'Population distribution.' },
    { id: 'geo-47', section: SectionType.SHORT_ANSWER, text: '7. Sharax kooban ka bixi noocyada gaadiidka dhulka. (4 dhibcood)', type: 'text', correctAnswer: 'Wadooyinka, Tareenada.', marks: 4, topic: 'Transport', explanation: 'Land transport.' },
    { id: 'geo-48', section: SectionType.SHORT_ANSWER, text: '8. Tax ilaha daraasaadka bulshooyinka. (4 dhibcood)', type: 'text', correctAnswer: 'Tirakoobka, Diiwaangelinta, Sahanka.', marks: 4, topic: 'Social Studies', explanation: 'Data sources.' },
    { id: 'geo-49', section: SectionType.SHORT_ANSWER, text: '9. Qor caqabadaha hortaagan xoolo-dhaqashada Soomaaliya. (4 dhibcood)', type: 'text', correctAnswer: 'Abaaraha, Cudurada, Daaqa yaraanta.', marks: 4, topic: 'Economy', explanation: 'Livestock challenges.' },
    { id: 'geo-50', section: SectionType.SHORT_ANSWER, text: '10. Kala sooc noocyada xoolo-dhaqashada dunida. (4 dhibcood)', type: 'text', correctAnswer: 'Reer guuraa, Xero ku hayn, Ganacsi.', marks: 4, topic: 'Agriculture', explanation: 'Types of farming.' },
    { id: 'geo-51', section: SectionType.SHORT_ANSWER, text: '11. Maxay ku kala duwan yihiin waddamada badda leh iyo kuwa aan badda lahayn? (3 dhibcood)', type: 'text', correctAnswer: 'Ganacsiga, Kalluumeysiga, Gaadiidka.', marks: 3, topic: 'Trade', explanation: 'Landlocked vs Coastal.' },
    { id: 'geo-52', section: SectionType.SHORT_ANSWER, text: '12. Maxaa dhici kara haddii uu kordho kululaanshaha dunida? (4 dhibcood)', type: 'text', correctAnswer: 'Barafka dhalaalaya, Heerka badda oo kordha.', marks: 4, topic: 'Climate Change', explanation: 'Global warming effects.' },
    { id: 'geo-53', section: SectionType.SHORT_ANSWER, text: '13. Isbarbardhig Cimilada iyo Cimilogeeredka. (4 dhibcood)', type: 'text', correctAnswer: 'Cimilada (Climate) - waqti dheer. Cimilogeered (Weather) - waqti gaaban.', marks: 4, topic: 'Climate', explanation: 'Climate vs Weather.' },
    { id: 'geo-54', section: SectionType.SHORT_ANSWER, text: '14. Qor xalal lagu yareyn karo saamaynta xun ee warshaduhu ku leeyihiin deegaanka. (4 dhibcood)', type: 'text', correctAnswer: 'Shaandheynta qiiqa, Dib u warshadaynta.', marks: 4, topic: 'Environment', explanation: 'Industrial pollution control.' },
    { id: 'geo-55', section: SectionType.SHORT_ANSWER, text: '15. Adigoo eegaya khariidadda hoos ku sawiran, ku muuji: Kiiniya, Jabuuti iyo Itoobiya. (5 dhibcood)', type: 'text', correctAnswer: 'Map labeling.', marks: 5, topic: 'Map Work', explanation: 'Regional map.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/direct-15.png' }
  ]
};

const ICT_2025_EXAM: Exam = {
  id: 'ict-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.ict.label,
  subjectKey: SUBJECT_CONFIG.ict.key,
  durationMinutes: 120,
  direction: 'ltr',
  questions: [
    { id: 'ict-1', section: SectionType.MCQ, text: '1. Is a network that connects computers within a small geographical area?', type: 'mcq', options: ['WAN', 'LAN', 'PAN', 'MAN'], correctAnswer: 'LAN', marks: 1, topic: 'Networking', explanation: 'Local Area Network.' },
    { id: 'ict-2', section: SectionType.MCQ, text: '2. Which one is the Advantage of Ring Topology?', type: 'mcq', options: ['Expansion of the Nodes is simple and easy', 'Easy to install and reconfigure', 'Simple installation and easy to wire', 'Fault detection is straightforward'], correctAnswer: 'Simple installation and easy to wire', marks: 1, topic: 'Networking', explanation: 'Cable layout is simple.' },
    { id: 'ict-3', section: SectionType.MCQ, text: '3. Is used to send and receive files from a remote host?', type: 'mcq', options: ['TCP', 'NFS', 'IPX', 'FTP'], correctAnswer: 'FTP', marks: 1, topic: 'Internet', explanation: 'File Transfer Protocol.' },
    { id: 'ict-4', section: SectionType.MCQ, text: '4. The top part of the Power Point window as shown in the figure below is called?', type: 'mcq', options: ['Title bar', 'Status bar', 'Window bar', 'Toolbar'], correctAnswer: 'Title bar', marks: 1, topic: 'Software', explanation: 'Top bar showing filename.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-14-2026-08_25_37-AM.png' },
    { id: 'ict-9', section: SectionType.MCQ, text: '9. In the flow chart the diamond symbol indicates what?', type: 'mcq', options: ['A process', 'A decision', 'A start', 'An output'], correctAnswer: 'A decision', marks: 1, topic: 'Programming', explanation: 'Decision/Branching.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-14-2026-08_34_29-AM.png' },
    { id: 'ict-11', section: SectionType.MCQ, text: '11. You want to change worksheet views in Excel which one of the following steps is true? (Image reference implied)', type: 'mcq', options: ['Locate in the Excel window’s bottom-right corner...', '...', '...', '...'], correctAnswer: 'Locate in the Excel window’s bottom-right corner...', marks: 1, topic: 'Spreadsheets', explanation: 'View buttons location.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-14-2026-08_25_40-AM.png' },
    { id: 'ict-14', section: SectionType.MCQ, text: '14. Using the Figure below the letters inside the figure indicates ______ respectively what?', type: 'mcq', options: ['Bold, Italic, Uppercase', 'Bold, Italic, Underline', 'Black, Italic, Underline', 'Bold, Italic Uniform'], correctAnswer: 'Bold, Italic, Underline', marks: 1, topic: 'Word Processing', explanation: 'B, I, U icons.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-14-2026-08_25_29-AM.png' },
    { id: 'ict-23', section: SectionType.MCQ, text: '23. Quick Access toolbar shows you the common commands (Image)', type: 'mcq', options: ['Save, Undo, and Redo', 'Save, Copy and Paste', 'Save, Open, and Cut', 'Save, Cut, and Copy'], correctAnswer: 'Save, Undo, and Redo', marks: 1, topic: 'Software', explanation: 'Standard QAT items.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-14-2026-08_46_38-AM.png' },
    { id: 'ict-31', section: SectionType.MCQ, text: '31. The figure below Indicates the symbol of?', type: 'mcq', options: ['Java', 'PYTHON', 'GOLAND', 'C#'], correctAnswer: 'PYTHON', marks: 1, topic: 'Programming', explanation: 'Python Logo.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-14-2026-08_30_40-AM.png' },
    { id: 'ict-32', section: SectionType.MCQ, text: '32. The figure below indicates what? Source Code → ______ → Machine Code → Output', type: 'mcq', options: ['Interpreter', 'Converter', 'Compiler', 'Decoder'], correctAnswer: 'Compiler', marks: 1, topic: 'Programming', explanation: 'Compilation process.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/Captured.png' },
    { id: 'ict-41', section: SectionType.SHORT_ANSWER, text: 'Draw simple Mesh Topology that consists of five computers.', type: 'text', correctAnswer: '(Drawing)', marks: 4, topic: 'Networking', explanation: 'Full connectivity.' },
    { id: 'ict-42', section: SectionType.SHORT_ANSWER, text: 'Demonstrate the difference between the terms Hub and Switch.', type: 'text', correctAnswer: 'Hub broadcasts to all, Switch directs to specific MAC.', marks: 4, topic: 'Networking', explanation: 'Network devices.' }
  ]
};

const SOMALI_2025_EXAM: Exam = {
  id: 'som-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.somali.label,
  subjectKey: SUBJECT_CONFIG.somali.key,
  durationMinutes: 120,
  direction: 'ltr',
  language: 'somali',
  sectionPassages: {
    [SectionType.MCQ]: `Dhirta waxa ay laf-dhabar u tahay nolosha nafleyda dhammaan. Nafleyda badda iyo tan berrigaba, waxa ay noloshoodu ku tiirsan tahay dhirta. Dhirta barriga waxa ay isugu jirtaa mid la beero iyo mid iskeeda u baxda. Tan la beero waxa ka mid ah geed miroodka, sida cambaha, digirta, muuska, galleyda iyo masagadda. Sidoo kale waxa jira khudrad kala duwan oo qaar caleentoooda la cuno, qaarna jirridooda, qaarna xididdadooda.\nIntaas waxaa ka badan dhirta dabiiciga ah ee iskeed u baxda, miraha iyo xabagta laga helo. Xabagtu sida; fooxa, lubaanta, malmalka iyo xabagta dhacda waa laga ganacsadaa. Sidaa darteed dhirtu waxa ay gundhig u tahay nolosha dadka, duunyada, ciidodka iyo duugaagta.\nHaddii ay dhirtu yaraato ama xaalufowdo waxa hoos u dhacaya dhaqaalaha iyo dhaqanka. Dhirtu waxa ay ka qeybqaadataa bilicda deegaanka, waxa ayna noqotaa dalxiis indha doogsi ah.\nMarkii uu roobku da’o oo ay cammuduubbiya ka dhacdo, calcayduna balliyada ceegaagto, dhirtuna caleemo kala duwan bixiso, haddii aad dalxiis gaaban ugu baxdo keymo ay xalay roob ka da’ay miir hesho oo ay indhahaagu qabtaan ciidod kala duwan sida; geriga, deerada, maroodiga, galyanio iyo arbab, oo kuu laaclamaya dhir qurux badan laanta carunka ah madxa isgalinaya, waxa aad dareemeysaa indha darandoori.\nSidaa oo kale jillaalka waxa magoola geed madowga. Geed madowgu waa dhirta aan caleentu ka dhammaan ee mar walba cagaaran, dhirtasi waxa calaafsad xooolaha xilliga jillaalka, magaalooyinka hoos iyo qurux ayey u leedahay. Dhirtasi waxa ay bixisaa xilliga jiilaadka man qurux badan, kadibna waa ay magooshaa. Magoolku waa caleenta ay dhirta geed madowga ahi bixiso xilliga diraacda inta aan wali roobku di’in.\nDhirta waxa ay noo leedahay waxdheef badan, waxa aan cunnaa miraha, xabagteeda iyo caleenteeda. Waxaana daaqa oo ku nool duunyada aan dhaqananno sida; geela, geeslayda iyo gammaanta. Ugu dambeyn dhirta waa in aan dhayal loo jarin oo la ilaalinyo.`,
    'Poem': `“Gudcur dam ah daw laga cabsado iyo daluun jeexan\nMiiraale dooxyada rogoo daadku mulacyeeyey\nAar diiqalyanyiyo maskiyo daalinkiyo tuugga\nAma dayradhaafkoo qabow dignka jiilaalka\nDubatada cadceediyo hafyaga diiran hilibkaaga\nDantii nimay waddaa baa dhexmara diima-diimaha’e\nHurdo wayga duuf waayadaan umal daraadiiye…”`
  },
  questions: [
    { id: 'som-1', section: SectionType.MCQ, text: '1. Dhirta yar yar ee ka baxda badda gudheeda waxaa loo yaqaan:', type: 'mcq', options: ['dhirbiyood', 'dhirbadeed', 'haramobadeed', 'dhirgaab'], correctAnswer: 'dhirbadeed', marks: 1, topic: 'Vocabulary', explanation: 'Dhirta badda.' },
    { id: 'som-2', section: SectionType.MCQ, text: '2. Erayga “magool” macnihiisu waa:', type: 'mcq', options: ['ubax', 'jirrid', 'caleen', 'miro'], correctAnswer: 'caleen', marks: 1, topic: 'Vocabulary', explanation: 'Caleenta cusub.' },
    { id: 'som-3', section: SectionType.MCQ, text: '3. Dhulka meesha ugaadka ah ee beerashada iyo daaqsinta ku habboon waxaa loo yaqaan:', type: 'mcq', options: ['cosob', 'kaliil', 'raso', 'hiil'], correctAnswer: 'cosob', marks: 1, topic: 'Vocabulary', explanation: 'Dhul barwaaqo.' },
    { id: 'som-4', section: SectionType.MCQ, text: '4. Erayga “Geelays” waxaa loo la jeedaa:', type: 'mcq', options: ['riyo iyo ido', 'ari’ iyo lo’', 'geel iyo lo’', 'ari’ iyo geel'], correctAnswer: 'geel iyo lo’', marks: 1, topic: 'Vocabulary', explanation: 'Xoolaha waaweyn.' },
    { id: 'som-5', section: SectionType.MCQ, text: '5. Geedka “waambaha” waxaa la cunaa:', type: 'mcq', options: ['xididdisa', 'mirihiisa', 'caleentiisa', 'fiiddiisa'], correctAnswer: 'caleentiisa', marks: 1, topic: 'Knowledge', explanation: 'Caleenta.' },
    { id: 'som-33', section: SectionType.MCQ, text: '33. Erayga daluun waxa halkan loola jeedaa (tixda):', type: 'mcq', options: ['waddo', 'habeenn', 'haadaan', 'webi'], correctAnswer: 'haadaan', marks: 1, topic: 'Poetry Analysis', explanation: 'Deep place/ravine.' },
    { id: 'som-34', section: SectionType.MCQ, text: '34. Erayga miraale waxa halkan loola jeedaa:', type: 'mcq', options: ['wasaq badan', 'biyo', 'qof miyirkii ka tagay', 'roob xoog leh'], correctAnswer: 'roob xoog leh', marks: 1, topic: 'Poetry Analysis', explanation: 'Heavy rain.' },
    { id: 'som-41', section: SectionType.WRITING, text: 'Ka qor curis ugu yaraan 20 sadar ah mid ka mid ah mowduucyadan hoose:\n1. Sidee Soomaaliya u gaari kartaa isku-filnaasho dhinaca dhaqaalaha ah?\n2. Muxuu yahay doorka kaaga aaddan mideynta ummadda Soomaaliyeed?', type: 'text', correctAnswer: '(Essay)', marks: 10, topic: 'Writing', explanation: 'Composition.' }
  ]
};

const HISTORY_2025_EXAM: Exam = {
  id: 'hist-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.history.label,
  subjectKey: SUBJECT_CONFIG.history.key,
  durationMinutes: 120,
  direction: 'ltr',
  language: 'somali',
  questions: [
    { id: 'hist-1', section: SectionType.MCQ, text: '1. Suldaankii ugu dambeeyay Cusmaaniyiinta waxa uu ahaa Suldaan:', type: 'mcq', options: ['Cabdulxamiid 2', 'Muxammad 1', 'Saliim', 'Muraad'], correctAnswer: 'Cabdulxamiid 2', marks: 1, topic: 'Ottoman History', explanation: 'Cabdulxamiid II wuxuu ahaa suldaankii ugu dambeeyay ee awood buuxda lahaa.' }
  ]
};

const PHYSICS_2025_EXAM: Exam = {
  id: 'phys-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.physics.label,
  subjectKey: SUBJECT_CONFIG.physics.key,
  durationMinutes: 120,
  direction: 'ltr',
  questions: [
    { id: 'phys-1', section: SectionType.MCQ, text: '1. Which of the following is a scalar quantity?', type: 'mcq', options: ['Force', 'Velocity', 'Speed', 'Acceleration'], correctAnswer: 'Speed', marks: 1, topic: 'Kinematics', explanation: 'Speed has magnitude only, no direction.' }
  ]
};

const CHEMISTRY_2025_EXAM: Exam = {
  id: 'chem-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.chemistry.label,
  subjectKey: SUBJECT_CONFIG.chemistry.key,
  durationMinutes: 120,
  direction: 'ltr',
  questions: [
    { id: 'chem-1', section: SectionType.MCQ, text: '1. What is the chemical symbol for Gold?', type: 'mcq', options: ['Ag', 'Au', 'Fe', 'Cu'], correctAnswer: 'Au', marks: 1, topic: 'Elements', explanation: 'Au stands for Aurum, which is gold.' }
  ]
};

const BIOLOGY_2025_EXAM: Exam = {
  id: 'bio-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.biology.label,
  subjectKey: SUBJECT_CONFIG.biology.key,
  durationMinutes: 120,
  direction: 'ltr',
  questions: [
    { id: 'bio-1', section: SectionType.MCQ, text: '1. The powerhouse of the cell is:', type: 'mcq', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Cytoplasm'], correctAnswer: 'Mitochondria', marks: 1, topic: 'Cell Biology', explanation: 'Mitochondria generate most of the cell supply of adenosine triphosphate (ATP).' }
  ]
};

const ENGLISH_2025_EXAM: Exam = {
  id: 'eng-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.english.label,
  subjectKey: SUBJECT_CONFIG.english.key,
  durationMinutes: 120,
  direction: 'ltr',
  authority: 'SOMALI_GOV', // Explicitly setting this helps logic
  level: 'FORM_IV',
  sectionPassages: {
    [SectionType.READING]: `The role of good neighbors.\nNeighbors are the people who live near us. They may live next door, across the street, or in the same building. We see them every day when we go outside, to school, the market, or the mosque. Neighbors are part of our everyday life. A neighbor is not just someone who lives close to you. They can become like a family member. Having good neighbors makes life easier, safer, and more enjoyable for everyone.\nA good neighbor is someone who is kind, friendly, and helpful. They greet you with a smile, speak politely, and show care for you and your family. When you are sick or have a problem, a good neighbor offers help without being asked especially during weddings, funerals, festivals or other important events, neighbors support each other by cooking, helping with preparations, or simply being present. These small but meaningful actions build love and respect between people.\nIn traditional communities, helping neighbors is a big part of daily life. Even in hard times, people share what they have whether it is food, water, or knowledge. For example, when there is a water shortage, a neighbor might allow others to use their well. When a young person needs help with schoolwork, a neighbor may offer guidance or support. This spirit of cooperation shows that when people work together, life is better for all.\nGood neighbors are also important for keeping peace in the community. When people trust and understand each other, there is less chance of fighting or misunderstanding. If a problem does happen such as noise, a disagreement, or something goes missing good neighbors solve it calmly and respectfully. They listen to each other and find a fair solution. In addition, neighbors watch each other’s homes and children. If someone is in danger, neighbors can act quickly to protect and help.\nBeing kind to neighbors is not only a cultural value. It is also a religious duty in Islam. Prophet Muhammad peace is upon him taught Muslims to treat neighbors with kindness and care. He said, “He is not a true believer whose neighbor is not safe from his harm.” This means that hurting or bothering your neighbor is not acceptable in Islam. Islam teaches us to visit our neighbors, help them in times of need, and treat them like family. It is part of being a good Muslim.\nUnfortunately, in some modern communities, people have become distant from their neighbors. Some people do not know the names of the people living next door. They stay inside their homes and do not interact. This can lead to loneliness, fear, and mistrust. It also weakens the community because people stop helping each other. To fix this, we should return to the tradition of being close and supportive neighbors. Saying hello, sharing food, and offering help are small actions that can make a big difference.\nYoung people can also help build strong relationships with neighbors. They can be polite and helpful, offer to carry groceries, visit elderly neighbors, or help younger children with homework. Youth can organize small clean-up days or play sports together with neighbors to create friendship and unity. When young people show good character and kindness, they help create a future community that is peaceful, respectful, and united.`
  },
  questions: [
    // PART 1
    { id: 'eng-1', section: SectionType.READING, text: '1. The word “people” is', type: 'mcq', options: ['adverb', 'pronoun', 'noun', 'adjective'], correctAnswer: 'noun', marks: 1, topic: 'Grammar', explanation: 'People is a plural noun referencing human beings.' },
    { id: 'eng-2', section: SectionType.READING, text: '2. Mosque is a holly place, it is a ______ noun', type: 'mcq', options: ['collective', 'proper', 'Abstract', 'common'], correctAnswer: 'common', marks: 1, topic: 'Grammar', explanation: 'It is a general name for a place of worship, not a specific one.' },
    { id: 'eng-3', section: SectionType.READING, text: '3. Her kindness made her success. The word “kindness” is ______ noun', type: 'mcq', options: ['Concrete', 'Material', 'Abstract', 'proper'], correctAnswer: 'Abstract', marks: 1, topic: 'Grammar', explanation: 'Kindness is an idea/quality, not a physical object.' },
    { id: 'eng-4', section: SectionType.READING, text: '4. The word “big” is an adjective of ______', type: 'mcq', options: ['demonstrative', 'possession', 'quantity', 'quality'], correctAnswer: 'quality', marks: 1, topic: 'Grammar', explanation: 'It describes the quality/size of the noun.' },
    { id: 'eng-5', section: SectionType.READING, text: '5. The word “easier” is used in the passage. which degree does it belong to?', type: 'mcq', options: ['positive', 'comparative', 'superlative', 'Gerund'], correctAnswer: 'comparative', marks: 1, topic: 'Grammar', explanation: 'Easier compares two states (ends in -er).' },
    { id: 'eng-6', section: SectionType.READING, text: '6. What does respectfully mean in according to the passage:', type: 'mcq', options: ['Considerately', 'Harshly', 'Indifferently', 'Arguing'], correctAnswer: 'Considerately', marks: 1, topic: 'Vocabulary', explanation: 'Showing regard and consideration for others.' },
    { id: 'eng-7', section: SectionType.READING, text: '7. Marry was a young lady. the word “young” is', type: 'mcq', options: ['noun', 'adjective', 'Adverb', 'Conjunction'], correctAnswer: 'adjective', marks: 1, topic: 'Grammar', explanation: 'It modifies the noun "lady".' },
    { id: 'eng-8', section: SectionType.READING, text: '8. What does support mean according to the passage:', type: 'mcq', options: ['Ignore', 'Assist', 'Argue', 'Avoid'], correctAnswer: 'Assist', marks: 1, topic: 'Vocabulary', explanation: 'To give help or assistance.' },
    { id: 'eng-9', section: SectionType.READING, text: '9. What does peacefully mean in according to the passage:', type: 'mcq', options: ['Quietly', 'Guilty', 'Loudly', 'Faulty'], correctAnswer: 'Quietly', marks: 1, topic: 'Vocabulary', explanation: 'Without disturbance, calmly.' },
    { id: 'eng-10', section: SectionType.READING, text: '10. We respect each other. Which tense is it?', type: 'mcq', options: ['Past tense', 'Present simple', 'future tense', 'present perfect'], correctAnswer: 'Present simple', marks: 1, topic: 'Grammar', explanation: 'Subject + base verb indicates present simple.' },

    // PART 2
    { id: 'eng-11', section: SectionType.GRAMMAR, text: '11. Complex sentence can have one or more ______', type: 'mcq', options: ['coordinating conjunction', 'subordinating Conjunction', 'correlative conjunction', 'compound conjunction'], correctAnswer: 'subordinating Conjunction', marks: 1, topic: 'Grammar', explanation: 'Complex sentences use subordinating conjunctions to join dependent clauses.' },
    { id: 'eng-12', section: SectionType.GRAMMAR, text: '12. _____ is used to negatively with uncountable nouns to show that quantity is small and not enough.', type: 'mcq', options: ['A few', 'little', 'few', 'a little'], correctAnswer: 'little', marks: 1, topic: 'Grammar', explanation: '"Little" implies a negative/insufficient quantity for uncountables.' },
    { id: 'eng-13', section: SectionType.GRAMMAR, text: '13. Typically the adverb ends LY usually called', type: 'mcq', options: ['adverb of place', 'adverb of manner', 'adverb of time', 'adverb of duration'], correctAnswer: 'adverb of manner', marks: 1, topic: 'Grammar', explanation: 'Adverbs of manner (e.g., quickly, slowly) often end in -ly.' },
    { id: 'eng-14', section: SectionType.GRAMMAR, text: '14. Phrasal verbs are made up of ______', type: 'mcq', options: ['Verb and noun', 'Verb and adjective', 'Verb and pronoun', 'Verb and preposition'], correctAnswer: 'Verb and preposition', marks: 1, topic: 'Grammar', explanation: 'A verb + preposition/adverb.' },
    { id: 'eng-15', section: SectionType.GRAMMAR, text: '15. The word “crowd” is ______', type: 'mcq', options: ['Compound nouns', 'Collective nouns', 'Countable nouns', 'Material nouns'], correctAnswer: 'Collective nouns', marks: 1, topic: 'Grammar', explanation: 'Represents a group of individuals.' },
    { id: 'eng-16', section: SectionType.GRAMMAR, text: '16. The goat produces much milk at night, ______', type: 'mcq', options: ['Is it?', 'Isn’t the goat?', 'Isn’t it?', 'Doesn’t it?'], correctAnswer: 'Doesn’t it?', marks: 1, topic: 'Grammar', explanation: 'Simple present "produces" uses "doesn\'t" in tag.' },
    { id: 'eng-17', section: SectionType.GRAMMAR, text: '17. Which tense is the following sentence: Farida has passed in her exam.', type: 'mcq', options: ['Progressive tenses', 'Future tenses', 'Perfect tenses', 'past tenses'], correctAnswer: 'Perfect tenses', marks: 1, topic: 'Grammar', explanation: 'Present Perfect (has + past participle).' },
    { id: 'eng-18', section: SectionType.GRAMMAR, text: '18. The teacher advised the candidates to abide ______ the law.', type: 'mcq', options: ['in', 'from', 'by', 'of'], correctAnswer: 'by', marks: 1, topic: 'Grammar', explanation: 'Abide by is the correct collocation.' },
    { id: 'eng-19', section: SectionType.GRAMMAR, text: '19. This exercise is ______ than the last one.', type: 'mcq', options: ['Trickier', 'Tracker', 'Tricky', 'More tricky'], correctAnswer: 'Trickier', marks: 1, topic: 'Grammar', explanation: 'Comparative of tricky (ends in y -> ier).' },
    { id: 'eng-20', section: SectionType.GRAMMAR, text: '20. Adjective is word that is used to modify.', type: 'mcq', options: ['noun or adverb', 'Pronoun or Adverb', 'conjunction or noun', 'Noun or Pronoun'], correctAnswer: 'Noun or Pronoun', marks: 1, topic: 'Grammar', explanation: 'Adjectives modify nouns and pronouns.' },

    // PART 3
    { id: 'eng-21', section: SectionType.LITERATURE, text: '21. The author of a poem is called ______', type: 'mcq', options: ['Player', 'Poet', 'Poetry', 'Persona'], correctAnswer: 'Poet', marks: 1, topic: 'Literature', explanation: 'One who writes poems.' },
    { id: 'eng-22', section: SectionType.LITERATURE, text: '22. He is as black as a charcoal. This is an example of', type: 'mcq', options: ['Metaphor', 'Simile', 'Smile', 'smell'], correctAnswer: 'Simile', marks: 1, topic: 'Literature', explanation: 'Comparison using "as".' },
    { id: 'eng-23', section: SectionType.LITERATURE, text: '23. The voice speaking in the poem is called ______', type: 'mcq', options: ['Person', 'character', 'Persona', 'Poet'], correctAnswer: 'Persona', marks: 1, topic: 'Literature', explanation: 'The speaker in the poem.' },
    { id: 'eng-24', section: SectionType.LITERATURE, text: '24. ______ is the repetition of consonant sounds, especially at the beginning of the words.', type: 'mcq', options: ['Alliteration', 'Rhyme', 'rhythm', 'Satire'], correctAnswer: 'Alliteration', marks: 1, topic: 'Literature', explanation: 'Repetition of initial sounds.' },
    { id: 'eng-25', section: SectionType.LITERATURE, text: '25. When we directly compare two objects or things in literature we say ______', type: 'mcq', options: ['analogy', 'metaphor', 'equivalent', 'Same'], correctAnswer: 'metaphor', marks: 1, topic: 'Literature', explanation: 'Direct comparison without like/as.' },
    { id: 'eng-26', section: SectionType.LITERATURE, text: '26. Simile is when we compare two thing by using word like ______', type: 'mcq', options: ['us', 'As', 'A little', 'Large'], correctAnswer: 'As', marks: 1, topic: 'Literature', explanation: 'Uses "like" or "as".' },
    { id: 'eng-27', section: SectionType.LITERATURE, text: '27. ______ is the repetition of consonant sounds, especially at the beginning of the words.', type: 'mcq', options: ['Assonance', 'Consonance', 'Alliteration', 'Allegory'], correctAnswer: 'Alliteration', marks: 1, topic: 'Literature', explanation: 'Definition matches Alliteration.' },
    { id: 'eng-28', section: SectionType.LITERATURE, text: '28. The situation when the poet repeats a line or a whole stanza throughout the poem is called', type: 'mcq', options: ['Irony', 'Symbol', 'Recycle', 'Refrain'], correctAnswer: 'Refrain', marks: 1, topic: 'Literature', explanation: 'Repeated lines.' },
    { id: 'eng-29', section: SectionType.LITERATURE, text: '29. Short statements with hidden meaning that are delivered from generation to another are', type: 'mcq', options: ['Provisions', 'Proverbs', 'Pronouns', 'propositions'], correctAnswer: 'Proverbs', marks: 1, topic: 'Literature', explanation: 'Wise sayings passed down.' },
    { id: 'eng-30', section: SectionType.LITERATURE, text: '30. The nature of the voice used in a poem is called', type: 'mcq', options: ['Tool', 'Team', 'Torch', 'Tone'], correctAnswer: 'Tone', marks: 1, topic: 'Literature', explanation: 'The attitude/voice.' },

    // PART 4
    { id: 'eng-31', section: SectionType.VOCABULARY, text: '31. The opposite of reject is', type: 'mcq', options: ['accept', 'except', 'expect', 'respect'], correctAnswer: 'accept', marks: 1, topic: 'Vocabulary', explanation: 'Antonym of reject.' },
    { id: 'eng-32', section: SectionType.VOCABULARY, text: '32. The singular form of the word mice is', type: 'mcq', options: ['rats', 'miseries', 'mouse', 'rat'], correctAnswer: 'mouse', marks: 1, topic: 'Vocabulary', explanation: 'Mice is plural of mouse.' },
    { id: 'eng-33', section: SectionType.VOCABULARY, text: '33. The homophone of eight is', type: 'mcq', options: ['aid', 'ate', 'at', 'added'], correctAnswer: 'ate', marks: 1, topic: 'Vocabulary', explanation: 'Sounds same, different meaning.' },
    { id: 'eng-34', section: SectionType.VOCABULARY, text: '34. Which of the following is showing place or location?', type: 'mcq', options: ['Their', 'They’re', 'Thread', 'There'], correctAnswer: 'There', marks: 1, topic: 'Vocabulary', explanation: 'Adverb of place.' },
    { id: 'eng-35', section: SectionType.VOCABULARY, text: '35. The opposite of conflict is', type: 'mcq', options: ['piece', 'Pease', 'Peace', 'pace'], correctAnswer: 'Peace', marks: 1, topic: 'Vocabulary', explanation: 'Antonym of conflict.' },
    { id: 'eng-36', section: SectionType.VOCABULARY, text: '36. The person who looks after our eyes is called', type: 'mcq', options: ['dentist', 'surgeon', 'optician', 'nurse'], correctAnswer: 'optician', marks: 1, topic: 'Vocabulary', explanation: 'Eye specialist.' },
    { id: 'eng-37', section: SectionType.VOCABULARY, text: '37. The synonyms of quick is', type: 'mcq', options: ['feast', 'fast', 'first', 'last'], correctAnswer: 'fast', marks: 1, topic: 'Vocabulary', explanation: 'Similar meaning.' },
    { id: 'eng-38', section: SectionType.VOCABULARY, text: '38. I ______ letter to my uncle every month', type: 'mcq', options: ['right', 'write', 'rite', 'Wright'], correctAnswer: 'write', marks: 1, topic: 'Vocabulary', explanation: 'To pen a letter.' },
    { id: 'eng-39', section: SectionType.VOCABULARY, text: '39. They ______ the man in the street every afternoon.', type: 'mcq', options: ['see', 'sea', 'sew', 'sin'], correctAnswer: 'see', marks: 1, topic: 'Vocabulary', explanation: 'Visual perception.' },
    { id: 'eng-40', section: SectionType.VOCABULARY, text: '40. You should be ______ honest leader for your country', type: 'mcq', options: ['an', 'the', 'a', 'in'], correctAnswer: 'an', marks: 1, topic: 'Vocabulary', explanation: 'Honest starts with silent h (vowel sound).' },

    // SECTION TWO: STRUCTURED
    { id: 'eng-41', section: SectionType.STRUCTURED, text: '41. Define synopsis.', type: 'text', correctAnswer: 'A brief summary or general survey of something.', marks: 5, topic: 'Writing', explanation: 'Definition of synopsis.' },
    { id: 'eng-42', section: SectionType.STRUCTURED, text: '42. Differentiate Simile and Metaphor.', type: 'text', correctAnswer: 'Simile compares using like/as; Metaphor is a direct comparison.', marks: 5, topic: 'Literature', explanation: 'Comparison methods.' },
    { id: 'eng-43', section: SectionType.STRUCTURED, text: '43. What is the difference between Biography and autobiography?', type: 'text', correctAnswer: 'Biography is written by another person; Autobiography is written by the subject themselves.', marks: 5, topic: 'Writing', explanation: 'Life history types.' },
    { id: 'eng-44', section: SectionType.STRUCTURED, text: '44. Explain character.', type: 'text', correctAnswer: 'A person, animal, or being in a story or play.', marks: 5, topic: 'Literature', explanation: 'Story element.' },
    { id: 'eng-45', section: SectionType.STRUCTURED, text: '45. Define Curriculum Vitae.', type: 'text', correctAnswer: 'A document listing qualifications and career history (CV).', marks: 5, topic: 'Writing', explanation: 'CV definition.' },
    { id: 'eng-46', section: SectionType.STRUCTURED, text: '46. Describe Riddle.', type: 'text', correctAnswer: 'A question or statement phrased as a puzzle to be solved.', marks: 5, topic: 'Literature', explanation: 'Puzzle definition.' },
    { id: 'eng-47', section: SectionType.STRUCTURED, text: '47. What is an interjection?', type: 'text', correctAnswer: 'A word or phrase used to express strong emotion (e.g., Wow! Oh!).', marks: 5, topic: 'Grammar', explanation: 'Part of speech.' },
    { id: 'eng-48', section: SectionType.STRUCTURED, text: '48. Explain Composition?', type: 'text', correctAnswer: 'The act of writing a structured piece of text, like an essay.', marks: 5, topic: 'Writing', explanation: 'Writing process.' },
    { id: 'eng-49', section: SectionType.STRUCTURED, text: '49. What is imagery?', type: 'text', correctAnswer: 'Visually descriptive or figurative language that appeals to the senses.', marks: 5, topic: 'Literature', explanation: 'Descriptive language.' },
    { id: 'eng-50', section: SectionType.STRUCTURED, text: '50. Write down the meaning of this Proverb “Rome was not built in a day”?', type: 'text', correctAnswer: 'Important work takes time to complete.', marks: 5, topic: 'Literature', explanation: 'Proverb meaning.' },

    // WRITING SKILLS
    { id: 'eng-51', section: SectionType.WRITING, text: 'Write a composition (at least 10 lines) by choosing one of the following topics:\n1. Disadvantages of Tribalism.\n2. The Unforgettable Memories of Your Education.\n3. Importance of good manner.', type: 'text', correctAnswer: '(Essay)', marks: 10, topic: 'Writing', explanation: 'Composition writing.' }
  ]
};

const BUSINESS_2025_EXAM: Exam = {
  id: 'bus-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.business.label,
  subjectKey: SUBJECT_CONFIG.business.key,
  durationMinutes: 120,
  direction: 'ltr',
  questions: [
    { id: 'bus-1', section: SectionType.MCQ, text: '1. Factors of production include:', type: 'mcq', options: ['Land, Labor, Capital, Enterprise', 'Money, Market, Management', 'Buying, Selling, Profit', 'None'], correctAnswer: 'Land, Labor, Capital, Enterprise', marks: 1, topic: 'Economics', explanation: 'Standard economic theory.' }
  ]
};

const ARABIC_2025_EXAM: Exam = {
  id: 'ara-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.arabic.label,
  subjectKey: SUBJECT_CONFIG.arabic.key,
  durationMinutes: 120,
  direction: 'rtl',
  language: 'arabic',
  questions: [
    { id: 'ara-1', section: SectionType.MCQ, text: '1. الفاعل دائماً:', type: 'mcq', options: ['مرفوع', 'منصوب', 'مجرور', 'مجزوم'], correctAnswer: 'مرفوع', marks: 1, topic: 'Grammar', explanation: 'الفاعل مرفوع بالضمة أو ما ينوب عنها.' }
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
    { id: 'isl-1', section: SectionType.MCQ, text: '1. عدة المرأة التي مات عنها زوجها:', type: 'mcq', options: ['ثلاثة أشهر', 'أربعة أشهر وعشرا', 'ثلاثة أشهر', 'أربعة أشهر'], correctAnswer: 'أربعة أشهر وعشرا', marks: 1, topic: 'Fiqh', explanation: 'عدة المتوفى عنها زوجها أربعة أشهر وعشرة أيام.' },
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
    { id: 'isl-21', section: SectionType.MCQ, text: '21. ما نزل القرآن في شأنه وقت وقوعه كما في سؤال (يسألونك) يسمى سببه:', type: 'mcq', options: ['النزول', 'السؤال', 'النزول', 'الوقوع'], correctAnswer: 'السؤال', marks: 1, topic: 'Quran Sciences', explanation: 'سبب النزول قد يكون سؤالا.' },
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
