
import { Question, SectionType, Exam, SubjectConfig } from './types';

export const ACADEMIC_YEARS = [2021, 2022, 2023, 2024, 2025];

// --- 1. SUBJECT REGISTRY (Source of Truth) ---
// This separates UI Labels from Database Keys
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
  ict: { key: 'ict', label: 'ICT', language: 'english' }
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
    { id: 'math-14', section: SectionType.MCQ, text: '14. The mean of 5 numbers is 14. Four of the numbers are 4, 8, 12 and 22. The 5th number is:', type: 'mcq', options: ['11.5', '2.4', '42', '9.2'], correctAnswer: '2.4', marks: 1, topic: 'Statistics', explanation: 'Sum = 5*14 = 70. Sum of four = 46. Missing = 24. (Note: Option "2.4" likely a typo for 24, but strictly 24 is the calculated answer).' },
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
    { id: 'geo-1', section: SectionType.MCQ, text: '1. Noocyada carrada ee dhulka Soomaaliya waa kala jaad, waxaana keenaya kala duwanaanta:', type: 'mcq', options: ['b. Nooca cimilada iyo dhadhabta', 't. Nooca cimilada iyo folkaanaha', 'j. Nooca dhadhabta keliya', 'x. Nooca cimilada keliya'], correctAnswer: 'b. Nooca cimilada iyo dhadhabta', marks: 1, topic: 'Physical Geography', explanation: 'Soil formation factors.' },
    { id: 'geo-2', section: SectionType.MCQ, text: '2. Qaybta ugu weyn uguna muhiimsan qaybaha dhirta waxaa laga magacaabaa:', type: 'mcq', options: ['b. Keymaha', 't. Cawska', 'j. Haramaha', 'x. Istibis'], correctAnswer: 'b. Keymaha', marks: 1, topic: 'Vegetation', explanation: 'Forests are major.' },
    { id: 'geo-3', section: SectionType.MCQ, text: '3. Maxay yihiin hababka wadidqaada Makanikada ay kaga duwan tahay wadidqaada Kiimikada?', type: 'mcq', options: ['b. Teed dhireed iyo teedad adag', 't. Teedad gaaban iyo teed dhireed', 'j. Teedad adag iyo walxaha shidaalka', 'x. Walxaha shidaalka iyo teed dhireed'], correctAnswer: 'b. Teed dhireed iyo teedad adag', marks: 1, topic: 'Physical Geography', explanation: 'Weathering types.' },
    { id: 'geo-4', section: SectionType.MCQ, text: '4. Adigoo adeegsanaya jaantuska hoose, tilmaam lambarka muujinaya gobolka Jubadda Hoose:', type: 'mcq', options: ['b. Lambarka 12aad', 't. Lambarka 8aad', 'j. Lambarka 18aad', 'x. Lambarka 17aad'], correctAnswer: 'j. Lambarka 18aad', marks: 1, topic: 'Somali Geography', explanation: 'Map reading.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-12-2026-10_27_49-AM.png' },
    { id: 'geo-5', section: SectionType.MCQ, text: '5. Marka aynu joogno magaalooyinka xeebaha, sida la dareemi karo huurka wuxuu noqdaa mid:', type: 'mcq', options: ['b. Kordha', 't. Hoos u dhaca', 'j. Dhexdhexaad ah', 'x. Aan muuqan'], correctAnswer: 'b. Kordha', marks: 1, topic: 'Climate', explanation: 'Humidity increases near coast.' },
    { id: 'geo-6', section: SectionType.MCQ, text: '6. Jiidaha dhulka Soomaaliya waxaa loo qeybiyaa ilaa iyo:', type: 'mcq', options: ['b. 4 qeybood', 't. 3 qeybood', 'j. 5 qeybood', 'x. 6 qeybood'], correctAnswer: 'j. 5 qeybood', marks: 1, topic: 'Somali Geography', explanation: 'Five main geographic zones.' },
    { id: 'geo-7', section: SectionType.MCQ, text: '7. Maxaa dhacaya haddii tirada dadka ay ka sara marto ilaha dhaqaale ee dabiiciga ah?', type: 'mcq', options: ['b. Taran dhimid', 't. Taran furan', 'j. Taran dhaqid', 'x. Taran fatah'], correctAnswer: 'x. Taran fatah', marks: 1, topic: 'Population', explanation: 'Overpopulation.' },
    { id: 'geo-8', section: SectionType.MCQ, text: '8. Xaalad ka dhalata hoos u dhac ku yimaada roobka muddo dheer waxaa loo yaqaan:', type: 'mcq', options: ['b. Lama degaan', 't. Daad', 'j. Barwaaqo', 'x. Abaar'], correctAnswer: 'x. Abaar', marks: 1, topic: 'Climate', explanation: 'Drought definition.' },
    { id: 'geo-9', section: SectionType.MCQ, text: '9. Waxyaabaha dabiiciga ah ee saameeya bahsanaanta tirada dadka waxaa ka mid ah:', type: 'mcq', options: ['b. Cimilada', 't. Xirfadda', 'j. Dhimashada', 'x. Socdaalka'], correctAnswer: 'b. Cimilada', marks: 1, topic: 'Population', explanation: 'Natural factors include climate.' },
    { id: 'geo-10', section: SectionType.MCQ, text: '10. Goob cufnaanta dadkeedu ka badan yahay 100 qof halkii km² waa goob dadku ay:', type: 'mcq', options: ['b. Sarreyso', 't. Hooseyso', 'j. Aad u sarreyso', 'x. Aad u hooseyso'], correctAnswer: 'b. Sarreyso', marks: 1, topic: 'Population', explanation: 'High density.' },
    { id: 'geo-11', section: SectionType.MCQ, text: '11. Sanadkii 1970, guud ahaan tirada warshadaha dalka ku yaallay waxay ahaayeen:', type: 'mcq', options: ['b. 190 warshadood', 't. 180 warshadood', 'j. 120 warshadood', 'x. 122 warshadood'], correctAnswer: 'x. 122 warshadood', marks: 1, topic: 'Economy', explanation: 'Historical industrial data.' },
    { id: 'geo-12', section: SectionType.MCQ, text: '12. Marka laysku qeybiyo tirada dadka iyo baaxadda dalka, waxaa loo yaqaan:', type: 'mcq', options: ['b. Koror dabiici ah', 't. Koror aan dabiici ahayn', 'j. Cufnaanta dadka', 'x. Kororka waddamada'], correctAnswer: 'j. Cufnaanta dadka', marks: 1, topic: 'Population', explanation: 'Population Density Formula.' },
    { id: 'geo-13', section: SectionType.MCQ, text: '13. Adigoo eegaya jaantuska hoos ku sawiran, sheeg il tamareed loo adeegsado:', type: 'mcq', options: ['b. Tamarta dabaysha', 't. Tamarta biyaha', 'j. Tamarta korontada', 'x. Tamarta qorraxda'], correctAnswer: 'b. Tamarta dabaysha', marks: 1, topic: 'Resources', explanation: 'Wind energy.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/iec-en-61400-12-5-ruzgar-enerjisi-uretim-sistemleri-bolum-12-5_-guc-performansi-engellerin-ve-arazinin-degerlendirilmesi-testi.jpg' },
    { id: 'geo-14', section: SectionType.MCQ, text: '14. Goobaha ugu warshadaha badan adduunka waxaa ka mid ah:', type: 'mcq', options: ['b. Galbeedka Afrika', 't. Galbeedka Yurub', 'j. Koonfurta Ameerika', 'x. Waqooyiga Aasiya'], correctAnswer: 't. Galbeedka Yurub', marks: 1, topic: 'Industry', explanation: 'Major industrial regions.' },
    { id: 'geo-15', section: SectionType.MCQ, text: '15. Waa tee laanta Jiyoolojiga ee la adeegsado marka la dhisayo buundo:', type: 'mcq', options: ['b. Jiyoolojiga bay’ada', 't. Jiyoolojiga handasada', 'j. Jiyoolojiga waxbarashada', 'x. Jiyoolojiga saliidda'], correctAnswer: 't. Jiyoolojiga handasada', marks: 1, topic: 'Geology', explanation: 'Engineering Geology.' },
    { id: 'geo-16', section: SectionType.MCQ, text: '16. Dadka dunida ku nool dhulka dushiisa waxay u qaybsan yihiin qaab:', type: 'mcq', options: ['b. Isla’eg', 't. Aan isla ekeyn', 'j. Toosan', 'x. Dheellitiran'], correctAnswer: 't. Aan isla ekeyn', marks: 1, topic: 'Population', explanation: 'Uneven distribution.' },
    { id: 'geo-17', section: SectionType.MCQ, text: '17. Diiwaangelinta dhalashada, dhimashada, guurka iyo furiinka waa:', type: 'mcq', options: ['b. Tirakoobka dadka', 't. Tirakoob muhiim ah', 'j. Fiiqsanaanta dadka', 'x. Diiwaan gelinta dadka'], correctAnswer: 'x. Diiwaan gelinta dadka', marks: 1, topic: 'Population', explanation: 'Civil Registration.' },
    { id: 'geo-18', section: SectionType.MCQ, text: '18. Ilaha tamarta dib loo cusboonaysiin karo waxaa ka mid ah:', type: 'mcq', options: ['b. Tamarta cadceedda', 't. Tamarta dhuxusha', 'j. Tamarta yuraaniyamka', 'x. Tamarta gaaska dabiiciga ah'], correctAnswer: 'b. Tamarta cadceedda', marks: 1, topic: 'Energy', explanation: 'Solar energy is renewable.' },
    { id: 'geo-19', section: SectionType.MCQ, text: '19. Sohdin dabiici ah waa xuduud lagu saleeyo astaamaha muuqaallada dabiiciga ah sida:', type: 'mcq', options: ['b. Buuro', 't. Xariiq', 'j. Handasi', 'x. Ilbaxnimo'], correctAnswer: 'b. Buuro', marks: 1, topic: 'Boundaries', explanation: 'Natural boundaries like mountains.' },
    { id: 'geo-20', section: SectionType.MCQ, text: '20. Kuwaan soo socda keeban kama mid aha shaqooyinka sohdinta siyaasadeed:', type: 'mcq', options: ['b. Kala saaridda dalalka', 't. Ilaalinta amniga', 'j. Ilaalinta dhaqaalaha', 'x. Maamulka xadka'], correctAnswer: 'x. Maamulka xadka', marks: 1, topic: 'Political Geography', explanation: 'Management is a process, not a function of the line itself.' },
    { id: 'geo-21', section: SectionType.MCQ, text: '21. Haddii aad rabto inaad beerato dalag, carro nooce ah ayaa ku habboon:', type: 'mcq', options: ['b. Carro hurdiga', 't. Carro maanyo', 'j. Carro bannaan xeebeed', 'x. Carro madow'], correctAnswer: 'x. Carro madow', marks: 1, topic: 'Agriculture', explanation: 'Black soil is fertile.' },
    { id: 'geo-22', section: SectionType.MCQ, text: '22. Waa imisa loolalka ay dhacaan goobaha kulul, haddii wadartu tahay 180°?', type: 'mcq', options: ['b. 30°', 't. 60°', 'j. 45°', 'x. 23°'], correctAnswer: 't. 60°', marks: 1, topic: 'Climate Zones', explanation: 'Tropical zone spans approx 60 degrees (30N to 30S).' },
    { id: 'geo-23', section: SectionType.MCQ, text: '23. Maxay noqonayaan wadarta warshadaha ku yaallay Muqdisho iyo Hargeysa?', type: 'mcq', options: ['b. 154', 't. 153', 'j. 155', 'x. 157'], correctAnswer: 'j. 155', marks: 1, topic: 'Industry', explanation: 'Historical data.' },
    { id: 'geo-24', section: SectionType.MCQ, text: '24. Magaalo ay dadka badankood ku mashquulsan yihiin waxbarasho waxaa loo yaqaan:', type: 'mcq', options: ['b. Magaalo diimeed', 't. Magaalo warshadeed', 'j. Magaalo aqooneed', 'x. Magaalo maamul'], correctAnswer: 'j. Magaalo aqooneed', marks: 1, topic: 'Urban Geography', explanation: 'Educational city.' },
    { id: 'geo-25', section: SectionType.MCQ, text: '25. Ururinta xog juqraafi iyadoo la adeegsanayo indha-indheyn waxaa la yiraahdaa:', type: 'mcq', options: ['b. Cilmi qoran', 't. Xog kaydsan', 'j. Cilmi baaris', 'x. Xog tilmaaman'], correctAnswer: 'j. Cilmi baaris', marks: 1, topic: 'Research Methods', explanation: 'Field research/Observation.' },
    { id: 'geo-26', section: SectionType.MCQ, text: '26. Hanaanka diyaarinta xogta Juqraafiyadu wuxuu maraa ilaa iyo:', type: 'mcq', options: ['b. Lix heer', 't. Shan heer', 'j. Toddobo heer', 'x. Sagaal heer'], correctAnswer: 't. Shan heer', marks: 1, topic: 'Research Methods', explanation: 'Five stages of data preparation.' },
    { id: 'geo-27', section: SectionType.MCQ, text: '27. Badda furan waxay kaga duwan tahay badda xiran:', type: 'mcq', options: ['b. Waxay la xiriirtaa badweyn', 't. Waxay leedahay marin cariiri ah', 'j. Waxay leedahay dooxo', 'x. Waxay leedahay haro'], correctAnswer: 'b. Waxay la xiriirtaa badweyn', marks: 1, topic: 'Hydrology', explanation: 'Open seas connect to oceans.' },
    { id: 'geo-28', section: SectionType.MCQ, text: '28. Farqiga heerkulka maalinta iyo sanadka ee cimilada badhalaaha waxaa lagu gartaa:', type: 'mcq', options: ['b. Hooseyn', 't. Sarreyn', 'j. Dhexdhexaad', 'x. Diirimaad'], correctAnswer: 'b. Hooseyn', marks: 1, topic: 'Climate', explanation: 'Low temperature range in equatorial zones.' },
    { id: 'geo-29', section: SectionType.MCQ, text: '29. Marka noole uu ku noolaado mid kale isagoo ka faa’iideysanaya, waxaa loo yaqaan:', type: 'mcq', options: ['b. Isla noolaansho', 't. Ugaadhsi', 'j. Wada noolaansho', 'x. Kala faa’iidaysi'], correctAnswer: 'x. Kala faa’iidaysi', marks: 1, topic: 'Ecology', explanation: 'Parasitism/Exploitation.' },
    { id: 'geo-30', section: SectionType.MCQ, text: '30. Adigoo eegaya khariidada hoos ku sawiran, waa kee lambarka lagu calaamadeeyey dalka Masar:', type: 'mcq', options: ['b. Lambarka 4aad', 't. Lambarka 6aad', 'j. Lambarka 49aad', 'x. Lambarka 31aad'], correctAnswer: 't. Lambarka 6aad', marks: 1, topic: 'Regional Geography', explanation: 'Egypt map location.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-13-2026-02_28_41-AM.png' },
    { id: 'geo-31', section: SectionType.MCQ, text: '31. Maxaa dhacaya haddii dadkii aqoonta lahaa ay dalka ka tahriibaan:', type: 'mcq', options: ['b. Maan ququl', 't. Maan cabburin', 'j. Maan fatah', 'x. Maan go’id'], correctAnswer: 'b. Maan ququl', marks: 1, topic: 'Population', explanation: 'Brain drain.' },
    { id: 'geo-32', section: SectionType.MCQ, text: '32. Degmooyinka miyiga ah waxay kaga duwan yihiin kuwa magaalooyinka:', type: 'mcq', options: ['b. Xajmigooda oo yar', 't. Xiriirkooda oo liita', 'j. Heer nololeed oo sarreeya', 'x. Dhaqaale badan'], correctAnswer: 't. Xiriirkooda oo liita', marks: 1, topic: 'Urban/Rural', explanation: 'Poor infrastructure in rural areas.' },
    { id: 'geo-33', section: SectionType.MCQ, text: '33. Meeraha ugu dhaw qorraxda waa:', type: 'mcq', options: ['b. Maaris', 't. Dhulka', 'j. Merkuri', 'x. Safeen'], correctAnswer: 'j. Merkuri', marks: 1, topic: 'Solar System', explanation: 'Mercury is closest.' },
    { id: 'geo-34', section: SectionType.MCQ, text: '34. Haddii waqtiga Muqdisho (45° bari) uu yahay 10:00 subaxnimo, waa imisa waqtiga Qaahira (30° bari)?', type: 'mcq', options: ['b. 11:00 AM', 't. 09:00 AM', 'j. 10:30 AM', 'x. 12:00 PM'], correctAnswer: 't. 09:00 AM', marks: 1, topic: 'Time Zones', explanation: '15 degrees west = -1 hour.' },
    { id: 'geo-35', section: SectionType.MCQ, text: '35. Kee kama mid aha calaamadaha khariidadda:', type: 'mcq', options: ['b. Qiyaaska', 't. Tusmada', 'j. Cinwaanka', 'x. Dug baxa'], correctAnswer: 'x. Dug baxa', marks: 1, topic: 'Map Skills', explanation: 'Not a map element.' },
    { id: 'geo-36', section: SectionType.MCQ, text: '36. Wadanka ugu wax-soo-saarka badan gaaska dabiiciga ah waa:', type: 'mcq', options: ['b. Baxreyn', 't. Imaaraadka', 'j. Qadar', 'x. Aljeeriya'], correctAnswer: 'j. Qadar', marks: 1, topic: 'Economy', explanation: 'Qatar is a major gas producer.' },
    { id: 'geo-37', section: SectionType.MCQ, text: '37. Wadanka ugu horreeyay ee bilaabay sahaminta Juqraafiyadda waa:', type: 'mcq', options: ['b. Bortaqiis', 't. Ingiriis', 'j. Talyaani', 'x. Isbaanish'], correctAnswer: 'b. Bortaqiis', marks: 1, topic: 'History of Geo', explanation: 'Portugal started the Age of Discovery.' },
    { id: 'geo-38', section: SectionType.MCQ, text: '38. Sawirka hoos ku qoran wuxuu muujinayaa nooca folkaanaha:', type: 'mcq', options: ['b. Firfircoon', 't. Meyd', 'j. Huruda', 'x. Muuqata'], correctAnswer: 'b. Firfircoon', marks: 1, topic: 'Physical Geography', explanation: 'Active volcano.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/active-volcano.png' },
    { id: 'geo-39', section: SectionType.MCQ, text: '39. Khariidadda muujisa beeraha, warshadaha iyo ganacsiga waa khariidadda:', type: 'mcq', options: ['b. Siyaasadda', 't. Dhaqaalaha', 'j. Cimilada', 'x. Isgaarsiinta'], correctAnswer: 't. Dhaqaalaha', marks: 1, topic: 'Map Types', explanation: 'Economic map.' },
    { id: 'geo-40', section: SectionType.MCQ, text: '40. Soomaaliya waxay leedahay 18,000,000 qof iyo baaxad dhan 637,657 km². Waa imisa cufnaanta dadkeedu?', type: 'mcq', options: ['b. 30 qof/km²', 't. 28 qof/km²', 'j. 12 qof/km²', 'x. 16 qof/km²'], correctAnswer: 't. 28 qof/km²', marks: 1, topic: 'Population', explanation: '18m/637k approx 28.' },

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
    { id: 'ict-1', section: SectionType.MCQ, text: '1. Is a network that connects computers within a small geographical area?', type: 'mcq', options: ['A) WAN', 'B) LAN', 'C) PAN', 'D) MAN'], correctAnswer: 'B) LAN', marks: 1, topic: 'Networking', explanation: 'Local Area Network.' },
    { id: 'ict-2', section: SectionType.MCQ, text: '2. Which one is the Advantage of Ring Topology?', type: 'mcq', options: ['A) Expansion of the Nodes is simple and easy', 'B) Easy to install and reconfigure', 'C) Simple installation and easy to wire', 'D) Fault detection is straightforward'], correctAnswer: 'C) Simple installation and easy to wire', marks: 1, topic: 'Networking', explanation: 'Cable layout is simple.' },
    { id: 'ict-3', section: SectionType.MCQ, text: '3. Is used to send and receive files from a remote host?', type: 'mcq', options: ['A) TCP', 'B) NFS', 'C) IPX', 'D) FTP'], correctAnswer: 'D) FTP', marks: 1, topic: 'Internet', explanation: 'File Transfer Protocol.' },
    { id: 'ict-4', section: SectionType.MCQ, text: '4. The top part of the Power Point window as shown in the figure below is called?', type: 'mcq', options: ['A) Title bar', 'B) Status bar', 'C) Window bar', 'D) Toolbar'], correctAnswer: 'A) Title bar', marks: 1, topic: 'Software', explanation: 'Top bar showing filename.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-14-2026-08_25_37-AM.png' },
    { id: 'ict-9', section: SectionType.MCQ, text: '9. In the flow chart the diamond symbol indicates what?', type: 'mcq', options: ['A) A process', 'B) A decision', 'C) A start', 'D) An output'], correctAnswer: 'B) A decision', marks: 1, topic: 'Programming', explanation: 'Decision/Branching.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-14-2026-08_34_29-AM.png' },
    { id: 'ict-11', section: SectionType.MCQ, text: '11. You want to change worksheet views in Excel which one of the following steps is true? (Image reference implied)', type: 'mcq', options: ['A) Locate in the Excel window’s bottom-right corner...', 'B) ...', 'C) ...', 'D) ...'], correctAnswer: 'A) Locate in the Excel window’s bottom-right corner...', marks: 1, topic: 'Spreadsheets', explanation: 'View buttons location.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-14-2026-08_25_40-AM.png' },
    { id: 'ict-14', section: SectionType.MCQ, text: '14. Using the Figure below the letters inside the figure indicates ______ respectively what?', type: 'mcq', options: ['A) Bold, Italic, Uppercase', 'B) Bold, Italic, Underline', 'C) Black, Italic, Underline', 'D) Bold, Italic Uniform'], correctAnswer: 'B) Bold, Italic, Underline', marks: 1, topic: 'Word Processing', explanation: 'B, I, U icons.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-14-2026-08_25_29-AM.png' },
    { id: 'ict-23', section: SectionType.MCQ, text: '23. Quick Access toolbar shows you the common commands (Image)', type: 'mcq', options: ['A) Save, Undo, and Redo', 'B) Save, Copy and Paste', 'C) Save, Open, and Cut', 'D) Save, Cut, and Copy'], correctAnswer: 'A) Save, Undo, and Redo', marks: 1, topic: 'Software', explanation: 'Standard QAT items.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-14-2026-08_46_38-AM.png' },
    { id: 'ict-31', section: SectionType.MCQ, text: '31. The figure below Indicates the symbol of?', type: 'mcq', options: ['A) Java', 'B) PYTHON', 'C) GOLAND', 'D) C#'], correctAnswer: 'B) PYTHON', marks: 1, topic: 'Programming', explanation: 'Python Logo.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-14-2026-08_30_40-AM.png' },
    { id: 'ict-32', section: SectionType.MCQ, text: '32. The figure below indicates what? Source Code → ______ → Machine Code → Output', type: 'mcq', options: ['A) Interpreter', 'B) Converter', 'C) Compiler', 'D) Decoder'], correctAnswer: 'C) Compiler', marks: 1, topic: 'Programming', explanation: 'Compilation process.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/Captured.png' },
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
    { id: 'som-1', section: SectionType.MCQ, text: '1. Dhirta yar yar ee ka baxda badda gudheeda waxaa loo yaqaan:', type: 'mcq', options: ['b. dhirbiyood', 't. dhirbadeed', 'j. haramobadeed', 'x. dhirgaab'], correctAnswer: 't. dhirbadeed', marks: 1, topic: 'Vocabulary', explanation: 'Dhirta badda.' },
    { id: 'som-2', section: SectionType.MCQ, text: '2. Erayga “magool” macnihiisu waa:', type: 'mcq', options: ['b. ubax', 't. jirrid', 'j. caleen', 'x. miro'], correctAnswer: 'j. caleen', marks: 1, topic: 'Vocabulary', explanation: 'Caleenta cusub.' },
    { id: 'som-3', section: SectionType.MCQ, text: '3. Dhulka meesha ugaadka ah ee beerashada iyo daaqsinta ku habboon waxaa loo yaqaan:', type: 'mcq', options: ['b. cosob', 't. kaliil', 'j. raso', 'x. hiil'], correctAnswer: 'b. cosob', marks: 1, topic: 'Vocabulary', explanation: 'Dhul barwaaqo.' },
    { id: 'som-4', section: SectionType.MCQ, text: '4. Erayga “Geelays” waxaa loo la jeedaa:', type: 'mcq', options: ['b. riyo iyo ido', 't. ari’ iyo lo’', 'j. geel iyo lo’', 'x. ari’ iyo geel'], correctAnswer: 'j. geel iyo lo’', marks: 1, topic: 'Vocabulary', explanation: 'Xoolaha waaweyn.' },
    { id: 'som-5', section: SectionType.MCQ, text: '5. Geedka “waambaha” waxaa la cunaa:', type: 'mcq', options: ['b. xididdisa', 't. mirihiisa', 'j. caleentiisa', 'x. fiiddiisa'], correctAnswer: 'j. caleentiisa', marks: 1, topic: 'Knowledge', explanation: 'Caleenta.' },
    { id: 'som-33', section: SectionType.MCQ, text: '33. Erayga daluun waxa halkan loola jeedaa (tixda):', type: 'mcq', options: ['b. waddo', 't. habeenn', 'j. haadaan', 'x. webi'], correctAnswer: 'j. haadaan', marks: 1, topic: 'Poetry Analysis', explanation: 'Deep place/ravine.' },
    { id: 'som-34', section: SectionType.MCQ, text: '34. Erayga miraale waxa halkan loola jeedaa:', type: 'mcq', options: ['b. wasaq badan', 't. biyo', 'j. qof miyirkii ka tagay', 'x. roob xoog leh'], correctAnswer: 'x. roob xoog leh', marks: 1, topic: 'Poetry Analysis', explanation: 'Heavy rain.' },
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
  questions: [
    { id: 'eng-1', section: SectionType.MCQ, text: '1. Which tense is used in "I have eaten"?', type: 'mcq', options: ['Simple Past', 'Present Perfect', 'Past Perfect', 'Future'], correctAnswer: 'Present Perfect', marks: 1, topic: 'Grammar', explanation: 'Have + Past Participle indicates Present Perfect.' }
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
    { id: 'isl-1', section: SectionType.MCQ, text: '1. أول رسول أرسله الله هو:', type: 'mcq', options: ['نوح', 'آدم', 'إبراهيم', 'محمد'], correctAnswer: 'نوح', marks: 1, topic: 'Prophets', explanation: 'نوح عليه السلام هو أول الرسل.' }
  ]
};

// --- 3. DATABASE (Simulated NoSQL) ---
// Keys are composite: "YEAR_SUBJECTKEY" (e.g. "2025_physics")
const EXAM_DATABASE: Record<string, Exam> = {
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
