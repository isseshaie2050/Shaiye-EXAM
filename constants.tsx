
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

const PHYSICS_2025_EXAM: Exam = {
  id: 'phy-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.physics.label,
  subjectKey: SUBJECT_CONFIG.physics.key,
  durationMinutes: 120,
  language: 'english',
  authority: 'SOMALI_GOV',
  level: 'FORM_IV',
  questions: [
      { id: 'phy-1', section: SectionType.MCQ, text: '1. The SI unit of force is:', type: 'mcq', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correctAnswer: 'Newton', marks: 1, topic: 'Forces', explanation: 'Newton is the SI unit of force.' }
  ]
};

const MATHEMATICS_2025_EXAM: Exam = {
  id: 'math-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.math.label,
  subjectKey: SUBJECT_CONFIG.math.key,
  durationMinutes: 120,
  direction: 'ltr',
  questions: [
    { id: 'math-1', section: SectionType.MCQ, text: '1. The imaginary part of the complex number Z = -5 + 6i is:', type: 'mcq', options: ['-5', '-6', '1', '6'], correctAnswer: '6', marks: 1, topic: 'Complex Numbers', explanation: 'In a complex number a + bi, b is the imaginary part.' },
    { id: 'math-2', section: SectionType.MCQ, text: '2. Solve for x: 2x + 5 = 15', type: 'mcq', options: ['5', '10', '2.5', '7.5'], correctAnswer: '5', marks: 1, topic: 'Algebra', explanation: '2x = 10, so x = 5.' },
    { id: 'math-3', section: SectionType.MCQ, text: '3. The derivative of sin(x) is:', type: 'mcq', options: ['cos(x)', '-cos(x)', 'tan(x)', 'sec(x)'], correctAnswer: 'cos(x)', marks: 1, topic: 'Calculus', explanation: 'Standard derivative.' },
    { id: 'math-4', section: SectionType.MCQ, text: '4. Calculate the area of a circle with radius 7cm (π=22/7).', type: 'mcq', options: ['154 cm²', '44 cm²', '22 cm²', '100 cm²'], correctAnswer: '154 cm²', marks: 1, topic: 'Geometry', explanation: 'Area = πr² = (22/7)*7*7 = 154.' },
    { id: 'math-5', section: SectionType.CALCULATION, text: '5. Find the inverse of the matrix A = [[2, 1], [3, 2]].', type: 'text', correctAnswer: '[[2, -1], [-3, 2]]', marks: 5, topic: 'Matrices', explanation: 'Det(A) = 4-3=1. Swap diagonal, negate off-diagonal.' }
  ]
};

const CHEMISTRY_2025_EXAM: Exam = {
    id: 'chem-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.chemistry.label,
    subjectKey: SUBJECT_CONFIG.chemistry.key,
    durationMinutes: 120,
    language: 'english',
    authority: 'SOMALI_GOV',
    level: 'FORM_IV',
    questions: [
      { id: 'ch-1', section: SectionType.MCQ, text: '1. Which of the following is a mixture?', type: 'mcq', options: ['Air', 'Water', 'Sodium Chloride', 'Iron'], correctAnswer: 'Air', marks: 1, topic: 'Matter', explanation: 'Air is a mixture of gases.' },
      { id: 'ch-2', section: SectionType.MCQ, text: '2. The atomic number of an element is determined by the number of:', type: 'mcq', options: ['Neutrons', 'Protons', 'Electrons', 'Nucleons'], correctAnswer: 'Protons', marks: 1, topic: 'Atomic Structure', explanation: 'Atomic number (Z) is the number of protons.' },
      { id: 'ch-3', section: SectionType.MCQ, text: '3. Isotopes are atoms of the same element that have different numbers of:', type: 'mcq', options: ['Protons', 'Electrons', 'Neutrons', 'Shells'], correctAnswer: 'Neutrons', marks: 1, topic: 'Atomic Structure', explanation: 'Isotopes differ in neutrons.' },
      { id: 'ch-4', section: SectionType.MCQ, text: '4. Which bond is formed by the transfer of electrons?', type: 'mcq', options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], correctAnswer: 'Ionic', marks: 1, topic: 'Bonding', explanation: 'Ionic bonds involve electron transfer.' },
      { id: 'ch-5', section: SectionType.MCQ, text: '5. The pH of a strong acid is:', type: 'mcq', options: ['1', '7', '9', '14'], correctAnswer: '1', marks: 1, topic: 'Acids', explanation: 'Strong acids have low pH.' },
      { id: 'ch-6', section: SectionType.MCQ, text: '6. Mass of 0.5 moles of CaCO3 (Ca=40, C=12, O=16)?', type: 'mcq', options: ['100g', '50g', '20g', '40g'], correctAnswer: '50g', marks: 1, topic: 'Stoichiometry', explanation: '100g/mol * 0.5 = 50g.' },
      { id: 'ch-7', section: SectionType.MCQ, text: '7. Group VII elements are called:', type: 'mcq', options: ['Alkali Metals', 'Alkaline Earth', 'Halogens', 'Noble Gases'], correctAnswer: 'Halogens', marks: 1, topic: 'Periodic Table', explanation: 'Group 7 are Halogens.' },
      { id: 'ch-8', section: SectionType.MCQ, text: '8. Gas produced when Mg reacts with HCl?', type: 'mcq', options: ['Oxygen', 'Chlorine', 'Hydrogen', 'CO2'], correctAnswer: 'Hydrogen', marks: 1, topic: 'Reactions', explanation: 'Metal + Acid -> Hydrogen.' },
      { id: 'ch-9', section: SectionType.MCQ, text: '9. General formula for Alkanes:', type: 'mcq', options: ['CnH2n', 'CnH2n+2', 'CnH2n-2', 'CnH2n+1OH'], correctAnswer: 'CnH2n+2', marks: 1, topic: 'Organic', explanation: 'Saturated hydrocarbons.' },
      { id: 'ch-10', section: SectionType.MCQ, text: '10. Separation method for ethanol and water:', type: 'mcq', options: ['Filtration', 'Distillation', 'Evaporation', 'Decantation'], correctAnswer: 'Distillation', marks: 1, topic: 'Separation', explanation: 'Based on boiling points.' },
      { id: 'ch-21', section: SectionType.SHORT_ANSWER, text: '21. Define Allotropy and name two allotropes of Carbon.', type: 'text', correctAnswer: 'Existence of element in different forms. Diamond, Graphite.', marks: 4, topic: 'Non-metals', explanation: 'Structural variation.' },
      { id: 'ch-25', section: SectionType.CALCULATION, text: '25. Calculate Molarity of 4g NaOH in 500cm³ water.', type: 'text', correctAnswer: '0.2 M', marks: 5, topic: 'Stoichiometry', explanation: '0.1 mol / 0.5 L = 0.2 M.' }
    ]
};

const BIOLOGY_2025_EXAM: Exam = {
    id: 'bio-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.biology.label,
    subjectKey: SUBJECT_CONFIG.biology.key,
    durationMinutes: 90,
    questions: [
        { id: 'bio-1', section: SectionType.MCQ, text: '1. The powerhouse of the cell is:', type: 'mcq', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Body'], correctAnswer: 'Mitochondria', marks: 1, topic: 'Cell Biology', explanation: 'Site of respiration.' },
        { id: 'bio-2', section: SectionType.MCQ, text: '2. Which vitamin is produced by skin upon sun exposure?', type: 'mcq', options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], correctAnswer: 'Vitamin D', marks: 1, topic: 'Nutrition', explanation: 'UV light synthesizes Vitamin D.' },
        { id: 'bio-3', section: SectionType.MCQ, text: '3. The process of water loss from leaves is:', type: 'mcq', options: ['Respiration', 'Transpiration', 'Photosynthesis', 'Absorption'], correctAnswer: 'Transpiration', marks: 1, topic: 'Plants', explanation: 'Evaporation from stomata.' },
        { id: 'bio-4', section: SectionType.SHORT_ANSWER, text: '4. State three differences between Arteries and Veins.', type: 'text', correctAnswer: 'Arteries: Thick walls, no valves, carry blood away. Veins: Thin walls, valves, carry blood to heart.', marks: 3, topic: 'Transport', explanation: 'Structural differences.' }
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
        { id: 'geo-1', section: SectionType.MCQ, text: '1. Webiga Shabelle wuxuu ku dhammaadaa:', type: 'mcq', options: ['Badweynta Hindiya', 'Dhulka', 'Webiga Jubba', 'Badda Cas'], correctAnswer: 'Dhulka', marks: 1, topic: 'Somali Geography', explanation: 'Webiga Shabelle ma gaaro badda, wuxuu ku dhamaadaa ciidda.' },
        { id: 'geo-2', section: SectionType.MCQ, text: '2. Magaalo madaxda gobolka Bari waa:', type: 'mcq', options: ['Garowe', 'Bosaso', 'Qardho', 'Galkacyo'], correctAnswer: 'Bosaso', marks: 1, topic: 'Somali Geography', explanation: 'Bosaso waa xarunta ganacsiga iyo gobolka Bari.' },
        { id: 'geo-3', section: SectionType.SHORT_ANSWER, text: '3. Sheeg saddex astaamood oo lagu garto cimilada saxaraha.', type: 'text', correctAnswer: 'Roob yar, kulayl badan maalintii, qabow habeenkii.', marks: 3, topic: 'Climate', explanation: 'Astaamaha cimilada qalalan.' }
    ]
};

const SOMALI_2025_EXAM: Exam = {
  id: 'som-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.somali.label,
  subjectKey: SUBJECT_CONFIG.somali.key,
  durationMinutes: 90,
  language: 'somali',
  authority: 'SOMALI_GOV',
  questions: [
      { id: 'som-1', section: SectionType.MCQ, text: '1. Hooriska gabaygu waa:', type: 'mcq', options: ['Qaybta hore', 'Qaybta dhexe', 'Qaybta dambe', 'Hordhaca'], correctAnswer: 'Qaybta dambe', marks: 1, topic: 'Suugaan', explanation: 'Hoorisku waa qaybta dambe ee tuduca.' }
  ]
};

const ENGLISH_2025_EXAM: Exam = {
    id: 'eng-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.english.label,
    subjectKey: SUBJECT_CONFIG.english.key,
    durationMinutes: 90,
    questions: [
        { id: 'eng-1', section: SectionType.MCQ, text: '1. She _____ to the market yesterday.', type: 'mcq', options: ['go', 'gone', 'went', 'going'], correctAnswer: 'went', marks: 1, topic: 'Grammar', explanation: 'Past tense of go is went.' },
        { id: 'eng-2', section: SectionType.MCQ, text: '2. The plural of "child" is:', type: 'mcq', options: ['childs', 'children', 'childrens', 'childes'], correctAnswer: 'children', marks: 1, topic: 'Grammar', explanation: 'Irregular plural.' },
        { id: 'eng-3', section: SectionType.ESSAY, text: '3. Write a composition about "The importance of Education" (approx 150 words).', type: 'text', correctAnswer: '', marks: 10, topic: 'Writing', explanation: 'Essay writing skills.' }
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
        { id: 'isl-1', section: SectionType.MCQ, text: '1. أركان الإسلام:', type: 'mcq', options: ['ثلاثة', 'أربعة', 'خمسة', 'ستة'], correctAnswer: 'خمسة', marks: 1, topic: 'Fiqh', explanation: 'أركان الإسلام خمسة.' },
        { id: 'isl-2', section: SectionType.MCQ, text: '2. أول سورة نزلت في القرآن هي:', type: 'mcq', options: ['الفاتحة', 'العلق', 'البقرة', 'الناس'], correctAnswer: 'العلق', marks: 1, topic: 'Quran', explanation: 'اقرأ باسم ربك الذي خلق.' }
    ]
};

const BUSINESS_2025_EXAM: Exam = {
    id: 'bus-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.business.label,
    subjectKey: SUBJECT_CONFIG.business.key,
    durationMinutes: 120,
    questions: [
        { id: 'bus-1', section: SectionType.MCQ, text: '1. Limited Liability means:', type: 'mcq', options: ['Shareholders pay all debts', 'Shareholders only lose investment', 'Government pays debts', 'No debts allowd'], correctAnswer: 'Shareholders only lose investment', marks: 1, topic: 'Legal Structures', explanation: 'Liability is limited to capital invested.' },
        { id: 'bus-2', section: SectionType.MCQ, text: '2. The primary goal of a business is:', type: 'mcq', options: ['Charity', 'Profit Maximization', 'Employment', 'Taxation'], correctAnswer: 'Profit Maximization', marks: 1, topic: 'Objectives', explanation: 'Commercial businesses aim for profit.' },
        { id: 'bus-3', section: SectionType.CALCULATION, text: '3. Calculate Gross Profit if Sales = $10,000 and Cost of Goods Sold = $6,000.', type: 'text', correctAnswer: '$4,000', marks: 2, topic: 'Accounting', explanation: 'Sales - COGS = GP.' }
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
    authority: 'SOMALI_GOV',
    questions: [
        { id: 'ara-1', section: SectionType.MCQ, text: '1. ضد كلمة «الكرم»:', type: 'mcq', options: ['الحقد', 'الحسد', 'الترف', 'البخل'], correctAnswer: 'البخل', marks: 1, topic: 'Vocabulary', explanation: 'الكرم يعني العطاء، وضده البخل.' },
        { id: 'ara-2', section: SectionType.MCQ, text: '2. (كتب) الطالب الدرس. الفعل "كتب" هو فعل:', type: 'mcq', options: ['ماضٍ', 'مضارع', 'أمر', 'نهي'], correctAnswer: 'ماضٍ', marks: 1, topic: 'Grammar', explanation: 'دل على حدث في الزمن الماضي.' },
        { id: 'ara-38', section: SectionType.MCQ, text: 'فإن رُزِقتَ خليفةً محمودةً ... قائل هذا البيت هو:', type: 'mcq', options: ['حافظ إبراهيم', 'محمود غنيم', 'أحمد محمد', 'محمود الرصافي'], correctAnswer: 'حافظ إبراهيم', marks: 1, topic: 'Literature', explanation: 'البيت للشاعر حافظ إبراهيم.' }
    ]
};

const HISTORY_2025_EXAM: Exam = {
    id: 'hist-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.history.label,
    subjectKey: SUBJECT_CONFIG.history.key,
    durationMinutes: 90,
    language: 'somali',
    authority: 'SOMALI_GOV',
    questions: [
        { id: 'hist-1', section: SectionType.MCQ, text: '1. Goormaa xorriyadda qaadatay Soomaaliya?', type: 'mcq', options: ['1950', '1960', '1970', '1980'], correctAnswer: '1960', marks: 1, topic: 'Somali History', explanation: 'Soomaaliya waxay xorriyadda qaadatay 1da Luulyo 1960.' },
        { id: 'hist-2', section: SectionType.MCQ, text: '2. SYL waxaa la aasaasay sannadkii:', type: 'mcq', options: ['1943', '1945', '1954', '1960'], correctAnswer: '1943', marks: 1, topic: 'Independence Movement', explanation: '13-kii May 1943.' },
        { id: 'hist-3', section: SectionType.SHORT_ANSWER, text: '3. Qor saddex sababood oo keenay dagaalkii 1aad ee adduunka.', type: 'text', correctAnswer: 'Isbahaysiyada, Tartanka hubka, Dilkii Archduke Franz Ferdinand.', marks: 3, topic: 'World History', explanation: 'Sababaha ugu waaweyn ee WW1.' }
    ]
};

const ICT_2025_EXAM: Exam = {
    id: 'ict-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.ict.label,
    subjectKey: SUBJECT_CONFIG.ict.key,
    durationMinutes: 90,
    questions: [
        { id: 'ict-1', section: SectionType.MCQ, text: '1. What does CPU stand for?', type: 'mcq', options: ['Central Processing Unit', 'Central Power Unit', 'Computer Personal Unit', 'Central Process Utility'], correctAnswer: 'Central Processing Unit', marks: 1, topic: 'Hardware', explanation: 'CPU is the brain of the computer.' },
        { id: 'ict-2', section: SectionType.MCQ, text: '2. Which of these is an Output Device?', type: 'mcq', options: ['Keyboard', 'Mouse', 'Monitor', 'Scanner'], correctAnswer: 'Monitor', marks: 1, topic: 'Hardware', explanation: 'Displays information to user.' },
        { id: 'ict-3', section: SectionType.MCQ, text: '3. RAM is:', type: 'mcq', options: ['Permanent Storage', 'Volatile Memory', 'Optical Storage', 'Magnetic Storage'], correctAnswer: 'Volatile Memory', marks: 1, topic: 'Memory', explanation: 'Data is lost when power is off.' }
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
