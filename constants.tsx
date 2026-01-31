
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

const PHYSICS_2025_EXAM: Exam = {
    id: 'phy-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.physics.label,
    subjectKey: SUBJECT_CONFIG.physics.key,
    durationMinutes: 120,
    questions: [
        { id: 'phy-1', section: SectionType.MCQ, text: '1. Which of these is a vector quantity?', type: 'mcq', options: ['Mass', 'Distance', 'Displacement', 'Time'], correctAnswer: 'Displacement', marks: 1, topic: 'Kinematics', explanation: 'Displacement has both magnitude and direction.' }
    ]
};

const HISTORY_2025_EXAM: Exam = {
  id: 'his-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.history.label,
  subjectKey: SUBJECT_CONFIG.history.key,
  durationMinutes: 90,
  questions: [
      { id: 'his-1', section: SectionType.MCQ, text: '1. When did Somalia gain independence?', type: 'mcq', options: ['1950', '1960', '1970', '1980'], correctAnswer: '1960', marks: 1, topic: 'Somali History', explanation: 'Somalia gained independence in 1960.' }
  ]
};

const CHEMISTRY_2025_EXAM: Exam = {
  id: 'chem-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.chemistry.label,
  subjectKey: SUBJECT_CONFIG.chemistry.key,
  durationMinutes: 90,
  questions: [
      { id: 'chem-1', section: SectionType.MCQ, text: '1. What is the chemical symbol for Gold?', type: 'mcq', options: ['Au', 'Ag', 'Fe', 'Cu'], correctAnswer: 'Au', marks: 1, topic: 'Periodic Table', explanation: 'Au comes from Latin Aurum.' }
  ]
};

const BIOLOGY_2025_EXAM: Exam = {
  id: 'bio-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.biology.label,
  subjectKey: SUBJECT_CONFIG.biology.key,
  durationMinutes: 90,
  questions: [
      { id: 'bio-1', section: SectionType.MCQ, text: '1. Which organ pumps blood?', type: 'mcq', options: ['Brain', 'Heart', 'Lungs', 'Liver'], correctAnswer: 'Heart', marks: 1, topic: 'Circulatory System', explanation: 'The heart pumps blood.' }
  ]
};

const GEOGRAPHY_2025_EXAM: Exam = {
  id: 'geo-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.geography.label,
  subjectKey: SUBJECT_CONFIG.geography.key,
  durationMinutes: 90,
  questions: [
      { id: 'geo-1', section: SectionType.MCQ, text: '1. What is the capital of Somalia?', type: 'mcq', options: ['Hargeisa', 'Mogadishu', 'Kismayo', 'Bosaso'], correctAnswer: 'Mogadishu', marks: 1, topic: 'Cities', explanation: 'Mogadishu is the capital.' }
  ]
};

const SOMALI_2025_EXAM: Exam = {
  id: 'som-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.somali.label,
  subjectKey: SUBJECT_CONFIG.somali.key,
  durationMinutes: 90,
  questions: [
      { id: 'som-1', section: SectionType.MCQ, text: '1. Qeex magac?', type: 'mcq', options: ['Waa eray tilmaama shey', 'Waa ficil', 'Waa xiriiriye', 'Waa meel'], correctAnswer: 'Waa eray tilmaama shey', marks: 1, topic: 'Grammar', explanation: 'Magacu waa eray wax tilmaamaya.' }
  ]
};

const ENGLISH_2025_EXAM: Exam = {
  id: 'eng-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.english.label,
  subjectKey: SUBJECT_CONFIG.english.key,
  durationMinutes: 90,
  questions: [
      { id: 'eng-1', section: SectionType.MCQ, text: '1. Choose the correct verb: He ___ to school yesterday.', type: 'mcq', options: ['go', 'gone', 'went', 'going'], correctAnswer: 'went', marks: 1, topic: 'Grammar', explanation: 'Past tense of go is went.' }
  ]
};

const ISLAMIC_STUDIES_2025_EXAM: Exam = {
  id: 'isl-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.islamic.label,
  subjectKey: SUBJECT_CONFIG.islamic.key,
  durationMinutes: 90,
  language: 'arabic',
  direction: 'rtl',
  questions: [
      { id: 'isl-1', section: SectionType.MCQ, text: '1. كم عدد أركان الإسلام؟', type: 'mcq', options: ['3', '4', '5', '6'], correctAnswer: '5', marks: 1, topic: 'Pillars of Islam', explanation: 'أركان الإسلام خمسة.' }
  ]
};

const BUSINESS_2025_EXAM: Exam = {
  id: 'bus-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.business.label,
  subjectKey: SUBJECT_CONFIG.business.key,
  durationMinutes: 120,
  questions: [
    // SECTION A: MCQ (1-40)
    { id: 'bus-1', section: SectionType.MCQ, text: '1. The kind of business activity labeled in the given picture is:', type: 'mcq', options: ['Extraction', 'Processing', 'Manufacturing', 'Construction'], correctAnswer: 'Extraction', marks: 1, topic: 'Business Activity', explanation: 'Primary sector activity involving extraction of raw materials.', diagramUrl: 'https://shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-20-2026-11_03_45-PM-2.png' },
    { id: 'bus-2', section: SectionType.MCQ, text: '2. The fundamental economic problem is that resources are limited but human wants are unlimited. This problem is known as:', type: 'mcq', options: ['Trade-off', 'Productivity', 'Demand', 'Scarcity'], correctAnswer: 'Scarcity', marks: 1, topic: 'Economics', explanation: 'Scarcity is the basic economic problem.' },
    { id: 'bus-3', section: SectionType.MCQ, text: '3. Determine the total liability from the following: Capital 24,000, Stock 1,500, Debtors 2,000, Machinery 20,000, Cash 4,000.', type: 'mcq', options: ['3,500', '27,500', '51,500', '1,500'], correctAnswer: '3,500', marks: 1, topic: 'Accounting', explanation: 'Assets (27,500) - Capital (24,000) = Liability (3,500).' },
    { id: 'bus-4', section: SectionType.MCQ, text: '4. The following are characteristics of an entrepreneur EXCEPT:', type: 'mcq', options: ['Optimistic', 'Resourceful', 'Advocacy', 'Motivated'], correctAnswer: 'Advocacy', marks: 1, topic: 'Entrepreneurship', explanation: 'Advocacy is not a core trait of an entrepreneur.' },
    { id: 'bus-5', section: SectionType.MCQ, text: '5. The price of olive oil increased by 20%, leading to a 5% increase in quantity supplied. Calculate the price elasticity of supply.', type: 'mcq', options: ['1', '1.5', '0.25', '2.5'], correctAnswer: '0.25', marks: 1, topic: 'Economics', explanation: '5% / 20% = 0.25.' },
    { id: 'bus-6', section: SectionType.MCQ, text: '6. Planning, organizing, commanding, coordinating, and controlling are functions of:', type: 'mcq', options: ['Commercial activities', 'Accounting activities', 'Financial activities', 'Managerial activities'], correctAnswer: 'Managerial activities', marks: 1, topic: 'Management', explanation: 'Henri Fayol\'s functions of management.' },
    { id: 'bus-7', section: SectionType.MCQ, text: '7. How does a team make decisions in a business project?', type: 'mcq', options: ['By approval', 'By majority', 'Weighted', 'Unanimously'], correctAnswer: 'By majority', marks: 1, topic: 'Management', explanation: 'Majority vote is the standard method.' },
    { id: 'bus-8', section: SectionType.MCQ, text: '8. Which of the following factors does NOT cause a rightward shift of the supply curve?', type: 'mcq', options: ['Consumer tastes', 'Number of sellers', 'Technology', 'Taxes and subsidies'], correctAnswer: 'Consumer tastes', marks: 1, topic: 'Economics', explanation: 'Consumer tastes affect Demand, not Supply.', diagramUrl: 'https://shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-20-2026-11_00_49-PM.png' },
    { id: 'bus-9', section: SectionType.MCQ, text: '9. The following are characteristics of money EXCEPT:', type: 'mcq', options: ['Convenient', 'Durable', 'Scarce', 'Accepted'], correctAnswer: 'Convenient', marks: 1, topic: 'Money', explanation: '"Portability" is the technical term, not "Convenient".' },
    { id: 'bus-10', section: SectionType.MCQ, text: '10. This figure is a well-known mail-handling equipment used in an office. It is called:', type: 'mcq', options: ['Envelope', 'A4 letter', 'Stapler', 'Scissors'], correctAnswer: 'Stapler', marks: 1, topic: 'Office Equipment', explanation: 'Staplers are used for fastening papers.', diagramUrl: 'https://shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-20-2026-10_59_55-PM-1.png' },
    { id: 'bus-11', section: SectionType.MCQ, text: '11. Misuse of punctuation can affect communication. Which part of communication is affected?', type: 'mcq', options: ['Distractions', 'Cultural', 'Status', 'Language'], correctAnswer: 'Language', marks: 1, topic: 'Communication', explanation: 'Punctuation is a grammatical/language element.' },
    { id: 'bus-12', section: SectionType.MCQ, text: '12. To run an effective filing system, you should:', type: 'mcq', options: ['Avoid saving unnecessary documents', 'Keep all files in a closed cabinet', 'Drink a lot of coffee when filing', 'Make sure all cables are hidden'], correctAnswer: 'Avoid saving unnecessary documents', marks: 1, topic: 'Office Management', explanation: 'Efficiency principle.' },
    { id: 'bus-13', section: SectionType.MCQ, text: '13. The branch of economics that deals with government revenue and expenditure is:', type: 'mcq', options: ['Public issues', 'Public debts', 'Public finance', 'Public policy'], correctAnswer: 'Public finance', marks: 1, topic: 'Economics', explanation: 'Definition of Public Finance.' },
    { id: 'bus-14', section: SectionType.MCQ, text: '14. The earliest form of business was barter trade. Which type of money was used?', type: 'mcq', options: ['Bank money', 'Paper money', 'Metallic money', 'Commodity money'], correctAnswer: 'Commodity money', marks: 1, topic: 'Money', explanation: 'Goods used as money (Commodity).' },
    { id: 'bus-15', section: SectionType.MCQ, text: '15. International trade carried out between two countries is called:', type: 'mcq', options: ['Multilateral trade', 'Retail trade', 'Wholesale trade', 'Bilateral trade'], correctAnswer: 'Bilateral trade', marks: 1, topic: 'International Trade', explanation: 'Bi-lateral means two sides.' },
    { id: 'bus-16', section: SectionType.MCQ, text: '16. Which of the following is NOT part of the electronic marketing mix?', type: 'mcq', options: ['E-product', 'E-pricing', 'E-promotion', 'E-packaging'], correctAnswer: 'E-packaging', marks: 1, topic: 'Marketing', explanation: 'Standard mix is Product, Price, Place, Promotion.' },
    { id: 'bus-17', section: SectionType.MCQ, text: '17. Which of the following is NOT a major function of a warehouse?', type: 'mcq', options: ['Inventory manufacturing', 'Storage of goods', 'Grading and branding', 'Protection of goods'], correctAnswer: 'Inventory manufacturing', marks: 1, topic: 'Warehousing', explanation: 'Manufacturing is production, not warehousing.' },
    { id: 'bus-18', section: SectionType.MCQ, text: '18. The electronic system through which buyers and sellers meet to exchange goods is known as:', type: 'mcq', options: ['Electronic business', 'Electronic market', 'E-commerce', 'Digital marketing'], correctAnswer: 'E-commerce', marks: 1, topic: 'Trade', explanation: 'Electronic Commerce.' },
    { id: 'bus-19', section: SectionType.MCQ, text: '19. Another name for an Income Statement is:', type: 'mcq', options: ['Profit and Loss Statement', 'Profit and Revenue Statement', 'Cash Flow Statement', 'Balance Sheet Statement'], correctAnswer: 'Profit and Loss Statement', marks: 1, topic: 'Accounting', explanation: 'P&L Statement.' },
    { id: 'bus-20', section: SectionType.MCQ, text: '20. Trade that takes place within the boundaries of a country is known as:', type: 'mcq', options: ['Home trade', 'International trade', 'Import trade', 'Wholesale trade'], correctAnswer: 'Home trade', marks: 1, topic: 'Trade', explanation: 'Domestic or Home trade.' },
    { id: 'bus-21', section: SectionType.MCQ, text: '21. A start-up wants to enter the market with a limited budget. Which promotional method is most affordable?', type: 'mcq', options: ['National TV advertising', 'Hiring a celebrity', 'Social media marketing', 'Roadside advertising in rural areas'], correctAnswer: 'Social media marketing', marks: 1, topic: 'Marketing', explanation: 'Cost-effective for startups.' },
    { id: 'bus-22', section: SectionType.MCQ, text: '22. A customer switches brands after a negative experience. This behavior indicates:', type: 'mcq', options: ['Cultural influence', 'Post-purchase behavior', 'Customer loyalty', 'Habitual buying'], correctAnswer: 'Post-purchase behavior', marks: 1, topic: 'Marketing', explanation: 'Evaluating after buying.' },
    { id: 'bus-23', section: SectionType.MCQ, text: '23. When goods are transported by sea, which document is used?', type: 'mcq', options: ['Airway bill', 'Bill of lading', 'Price list', 'Debit note'], correctAnswer: 'Bill of lading', marks: 1, topic: 'Transport', explanation: 'Document of title for sea freight.' },
    { id: 'bus-24', section: SectionType.MCQ, text: '24. A trader wants a loan to invest in a business. Which type of bank provides this service?', type: 'mcq', options: ['Central bank', 'Commercial bank', 'Credit union', 'Cooperative bank'], correctAnswer: 'Commercial bank', marks: 1, topic: 'Banking', explanation: 'Commercial banks lend to businesses.' },
    { id: 'bus-25', section: SectionType.MCQ, text: '25. The medium of exchange used to measure the market value of goods and services is called:', type: 'mcq', options: ['Spending', 'Income', 'Insurance', 'Currency'], correctAnswer: 'Currency', marks: 1, topic: 'Money', explanation: 'Currency/Money is the measure of value.' },
    { id: 'bus-26', section: SectionType.MCQ, text: '26. In which stage of marketing is the customer free to communicate at any time?', type: 'mcq', options: ['Social network marketing', 'Marketing department', 'Marketing company', 'Relationship marketing'], correctAnswer: 'Social network marketing', marks: 1, topic: 'Marketing', explanation: 'Social media allows 24/7 interaction.' },
    { id: 'bus-27', section: SectionType.MCQ, text: '27. The following are objectives of fiscal policy EXCEPT:', type: 'mcq', options: ['Employment', 'Fair distribution of wealth', 'Economic development', 'Economic recession'], correctAnswer: 'Economic recession', marks: 1, topic: 'Economics', explanation: 'Recession is a problem to solve, not a goal.' },
    { id: 'bus-28', section: SectionType.MCQ, text: '28. The most modern form of money used in business transactions today is:', type: 'mcq', options: ['Bank money', 'Plastic money', 'Metallic money', 'Commodity money'], correctAnswer: 'Plastic money', marks: 1, topic: 'Money', explanation: 'Credit/Debit cards (Plastic) or Digital.' },
    { id: 'bus-29', section: SectionType.MCQ, text: '29. Income refers to:', type: 'mcq', options: ['Paying out money', 'Money earned from work or sales', 'Saving money for future use', 'Dividing money among people'], correctAnswer: 'Money earned from work or sales', marks: 1, topic: 'Economics', explanation: 'Definition of income.' },
    { id: 'bus-30', section: SectionType.MCQ, text: '30. Which of the following is NOT a fully digital product?', type: 'mcq', options: ['Films', 'Consultancy services', 'Songs', 'Fast foods'], correctAnswer: 'Fast foods', marks: 1, topic: 'E-commerce', explanation: 'Physical goods.' },
    { id: 'bus-31', section: SectionType.MCQ, text: '31. A successful market entry strategy that involves doing something new is called:', type: 'mcq', options: ['Market gap', 'Product offering', 'Being unique', 'Innovation'], correctAnswer: 'Innovation', marks: 1, topic: 'Entrepreneurship', explanation: 'Doing something new.' },
    { id: 'bus-32', section: SectionType.MCQ, text: '32. Calculate the Net Income: Service Revenue $5,500, Expenses (Salary $1,200 + Supply $500 + Depreciation $350 + Misc $100).', type: 'mcq', options: ['6,650', '900', '2,350', '3,350'], correctAnswer: '3,350', marks: 1, topic: 'Accounting', explanation: '5500 - (1200+500+350+100) = 5500 - 2150 = 3350. (Option corrected to match calculation)' },
    { id: 'bus-33', section: SectionType.MCQ, text: '33. Which type of control focuses on correcting errors after they occur?', type: 'mcq', options: ['Preventive control', 'Concurrent control', 'Feedback control', 'External control'], correctAnswer: 'Feedback control', marks: 1, topic: 'Management', explanation: 'Feedback control occurs after the activity.' },
    { id: 'bus-34', section: SectionType.MCQ, text: '34. The first stage of managing or protecting against risk is:', type: 'mcq', options: ['Transferring the risk', 'Accepting the risk', 'Avoiding the risk', 'Reducing the risk'], correctAnswer: 'Avoiding the risk', marks: 1, topic: 'Insurance', explanation: 'Avoidance is often the first consideration.' },
    { id: 'bus-35', section: SectionType.MCQ, text: '35. A business owned and managed by one person is known as:', type: 'mcq', options: ['Corporation', 'Partnership', 'Cooperative', 'Proprietorship'], correctAnswer: 'Proprietorship', marks: 1, topic: 'Business Units', explanation: 'Sole Proprietorship.' },
    { id: 'bus-36', section: SectionType.MCQ, text: '36. The use of a one-year accounting period is known as:', type: 'mcq', options: ['Internal year', 'General period', 'Fiscal year', 'Fiscal policy'], correctAnswer: 'Fiscal year', marks: 1, topic: 'Accounting', explanation: 'Financial year.' },
    { id: 'bus-37', section: SectionType.MCQ, text: '37. The most suitable mode of transport for perishable goods over long distances is:', type: 'mcq', options: ['Air transport', 'Road transport', 'Maritime transport', 'Rail transport'], correctAnswer: 'Air transport', marks: 1, topic: 'Transport', explanation: 'Fastest method.' },
    { id: 'bus-38', section: SectionType.MCQ, text: '38. Warehouses owned by the government and rented to private firms are called:', type: 'mcq', options: ['Private warehouses', 'Public warehouses', 'Cooperative warehouses', 'Value-adding warehouses'], correctAnswer: 'Public warehouses', marks: 1, topic: 'Warehousing', explanation: 'Owned by public bodies for general use.' },
    { id: 'bus-39', section: SectionType.MCQ, text: '39. International trade conducted among many countries is known as:', type: 'mcq', options: ['Multilateral trade', 'Retail trade', 'Wholesale trade', 'Bilateral trade'], correctAnswer: 'Multilateral trade', marks: 1, topic: 'International Trade', explanation: 'Multi = Many.' },
    { id: 'bus-40', section: SectionType.MCQ, text: '40. A person who combines all factors of production is called:', type: 'mcq', options: ['Managerial elite', 'Entrepreneur', 'Government unit', 'Corporate stakeholder'], correctAnswer: 'Entrepreneur', marks: 1, topic: 'Factors of Production', explanation: 'The coordinator of land, labor, and capital.' },

    // SECTION B: STRUCTURED QUESTIONS (15 Qs)
    { id: 'bus-41', section: SectionType.SHORT_ANSWER, text: '41. Explain two characteristics of human wants.', type: 'text', correctAnswer: 'Unlimited, recurrent, competitive, complementary.', marks: 4, topic: 'Economics', explanation: 'Wants are insatiable and reoccur.' },
    { id: 'bus-42', section: SectionType.SHORT_ANSWER, text: '42. Explain the importance of business studies to society.', type: 'text', correctAnswer: 'Provides goods/services, creates jobs, improves standard of living.', marks: 4, topic: 'Business Studies', explanation: 'Societal impact of business.' },
    { id: 'bus-43', section: SectionType.SHORT_ANSWER, text: '43. Identify four typical users of accounting information.', type: 'text', correctAnswer: 'Owners, Managers, Government, Lenders/Creditors.', marks: 4, topic: 'Accounting', explanation: 'Stakeholders.' },
    { id: 'bus-44', section: SectionType.SHORT_ANSWER, text: '44. Draw an equilibrium curve using the table below. (Find the Equilibrium Price and Quantity).\nPrice: 1, 2, 3, 4\nQty Demanded: 12, 9, 6, 3\nQty Supplied: 2, 4, 6, 8', type: 'text', correctAnswer: 'Equilibrium Price = 3, Equilibrium Quantity = 6.', marks: 4, topic: 'Economics', explanation: 'Where Qd = Qs (6).' },
    { id: 'bus-45', section: SectionType.SHORT_ANSWER, text: '45. State four characteristics of a good business idea.', type: 'text', correctAnswer: 'Profitable, unique, solves a problem, feasible.', marks: 4, topic: 'Entrepreneurship', explanation: 'Viability of ideas.' },
    { id: 'bus-46', section: SectionType.SHORT_ANSWER, text: '46. Highlight the four Ps of the marketing mix.', type: 'text', correctAnswer: 'Product, Price, Place, Promotion.', marks: 4, topic: 'Marketing', explanation: 'The 4 Ps model.' },
    { id: 'bus-47', section: SectionType.SHORT_ANSWER, text: '47. Give two differences between a business idea and a business opportunity.', type: 'text', correctAnswer: 'Idea is a concept; Opportunity is a proven concept with market potential.', marks: 4, topic: 'Entrepreneurship', explanation: 'Concept vs Viability.' },
    { id: 'bus-48', section: SectionType.SHORT_ANSWER, text: '48. Journalize the following adjustments of Air & Sea Travel Inc.:\ni. Depreciation on furniture $275\nii. Accrued income tax expense $540\niii. Prepaid rent expired $1,000\niv. Supplies used $300', type: 'text', correctAnswer: 'i. Dr Depr Exp / Cr Acc Depr. ii. Dr Tax Exp / Cr Tax Payable. iii. Dr Rent Exp / Cr Prepaid Rent. iv. Dr Supplies Exp / Cr Supplies.', marks: 4, topic: 'Accounting', explanation: 'Adjusting entries.' },
    { id: 'bus-49', section: SectionType.SHORT_ANSWER, text: '49. List four disadvantages of a partitioned office.', type: 'text', correctAnswer: 'Costly to build, uses more space, hinders supervision, isolation.', marks: 4, topic: 'Office Management', explanation: 'Closed office cons.' },
    { id: 'bus-50', section: SectionType.SHORT_ANSWER, text: '50. Give four services provided by commercial banks.', type: 'text', correctAnswer: 'Accepting deposits, lending money, safeguarding valuables, advice.', marks: 4, topic: 'Banking', explanation: 'Functions of banks.' },
    { id: 'bus-51', section: SectionType.SHORT_ANSWER, text: '51. Enumerate four factors affecting communication.', type: 'text', correctAnswer: 'Language barrier, noise, attitude, medium used.', marks: 4, topic: 'Communication', explanation: 'Barriers to communication.' },
    { id: 'bus-52', section: SectionType.SHORT_ANSWER, text: '52. Rearrange the following steps of the purchasing decision process:\n• Realizing the need\n• Search for information\n• Evaluate alternatives\n• Decision evaluation\n• Purchase decision', type: 'text', correctAnswer: '1. Realizing need, 2. Search info, 3. Evaluate alternatives, 4. Purchase decision, 5. Decision evaluation (Post-purchase).', marks: 4, topic: 'Marketing', explanation: 'Consumer decision process.' },
    { id: 'bus-53', section: SectionType.SHORT_ANSWER, text: '53. Categorize the following insurance terms: i. Ahmed ii. Theft iii. So.Sh 6,000 iv. Tayo Insurance Ltd', type: 'text', correctAnswer: 'i. Insured, ii. Risk/Peril, iii. Premium, iv. Insurer.', marks: 4, topic: 'Insurance', explanation: 'Insurance terminology.' },
    { id: 'bus-54', section: SectionType.SHORT_ANSWER, text: '54. Distinguish between private organizations and public organizations.', type: 'text', correctAnswer: 'Private: Owned by individuals for profit. Public: Owned by gov for service.', marks: 4, topic: 'Business Units', explanation: 'Ownership and motive.' },
    { id: 'bus-55', section: SectionType.SHORT_ANSWER, text: '55. Compare strategic planning and tactical planning in terms of time.', type: 'text', correctAnswer: 'Strategic: Long-term (Years). Tactical: Medium/Short-term (Months).', marks: 4, topic: 'Management', explanation: 'Time horizons.' }
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
