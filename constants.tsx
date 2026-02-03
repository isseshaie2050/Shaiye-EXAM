
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
  questions: []
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
      // PART 1: MCQ
      { id: 'ch-1', section: SectionType.MCQ, text: '1. Which of the following is a mixture?', type: 'mcq', options: ['Air', 'Water', 'Sodium Chloride', 'Iron'], correctAnswer: 'Air', marks: 1, topic: 'Matter', explanation: 'Air is a mixture of gases, whereas water and NaCl are compounds, and Iron is an element.' },
      { id: 'ch-2', section: SectionType.MCQ, text: '2. The atomic number of an element is determined by the number of:', type: 'mcq', options: ['Neutrons', 'Protons', 'Electrons', 'Nucleons'], correctAnswer: 'Protons', marks: 1, topic: 'Atomic Structure', explanation: 'Atomic number (Z) is the number of protons in the nucleus.' },
      { id: 'ch-3', section: SectionType.MCQ, text: '3. Isotopes are atoms of the same element that have different numbers of:', type: 'mcq', options: ['Protons', 'Electrons', 'Neutrons', 'Shells'], correctAnswer: 'Neutrons', marks: 1, topic: 'Atomic Structure', explanation: 'Isotopes share the same proton number but differ in neutron number.' },
      { id: 'ch-4', section: SectionType.MCQ, text: '4. Which bond is formed by the transfer of electrons from a metal to a non-metal?', type: 'mcq', options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], correctAnswer: 'Ionic', marks: 1, topic: 'Bonding', explanation: 'Ionic bonds involve electron transfer.' },
      { id: 'ch-5', section: SectionType.MCQ, text: '5. The pH of a strong acid is likely to be:', type: 'mcq', options: ['1', '7', '9', '14'], correctAnswer: '1', marks: 1, topic: 'Acids and Bases', explanation: 'Strong acids have low pH values (0-2).' },
      { id: 'ch-6', section: SectionType.MCQ, text: '6. What is the mass of 0.5 moles of CaCO3? (Ca=40, C=12, O=16)', type: 'mcq', options: ['100g', '50g', '20g', '40g'], correctAnswer: '50g', marks: 1, topic: 'Stoichiometry', explanation: 'Molar Mass = 40+12+(16*3) = 100g/mol. Mass = 0.5 * 100 = 50g.' },
      { id: 'ch-7', section: SectionType.MCQ, text: '7. In the periodic table, elements in Group VII are known as:', type: 'mcq', options: ['Alkali Metals', 'Alkaline Earth Metals', 'Halogens', 'Noble Gases'], correctAnswer: 'Halogens', marks: 1, topic: 'Periodic Table', explanation: 'Group VII elements are called Halogens.' },
      { id: 'ch-8', section: SectionType.MCQ, text: '8. Which gas is produced when magnesium reacts with hydrochloric acid?', type: 'mcq', options: ['Oxygen', 'Chlorine', 'Hydrogen', 'Carbon Dioxide'], correctAnswer: 'Hydrogen', marks: 1, topic: 'Reactions', explanation: 'Metal + Acid -> Salt + Hydrogen.' },
      { id: 'ch-9', section: SectionType.MCQ, text: '9. The general formula for Alkanes is:', type: 'mcq', options: ['CnH2n', 'CnH2n+2', 'CnH2n-2', 'CnH2n+1OH'], correctAnswer: 'CnH2n+2', marks: 1, topic: 'Organic Chemistry', explanation: 'Alkanes are saturated hydrocarbons with formula CnH2n+2.' },
      { id: 'ch-10', section: SectionType.MCQ, text: '10. Which method is best for separating water and ethanol?', type: 'mcq', options: ['Filtration', 'Distillation', 'Evaporation', 'Decantation'], correctAnswer: 'Distillation', marks: 1, topic: 'Separation Techniques', explanation: 'Fractional distillation separates liquids with different boiling points.' },
      { id: 'ch-11', section: SectionType.MCQ, text: '11. Oxidation is defined as:', type: 'mcq', options: ['Gain of electrons', 'Loss of electrons', 'Gain of hydrogen', 'Loss of oxygen'], correctAnswer: 'Loss of electrons', marks: 1, topic: 'Redox', explanation: 'OIL RIG: Oxidation Is Loss of electrons.' },
      { id: 'ch-12', section: SectionType.MCQ, text: '12. Which catalyst is used in the Contact Process for making sulfuric acid?', type: 'mcq', options: ['Iron', 'Nickel', 'Vanadium(V) Oxide', 'Platinum'], correctAnswer: 'Vanadium(V) Oxide', marks: 1, topic: 'Industrial Processes', explanation: 'V2O5 is the catalyst for the Contact Process.' },
      { id: 'ch-13', section: SectionType.MCQ, text: '13. Hardness in water is caused by ions of:', type: 'mcq', options: ['Sodium and Potassium', 'Calcium and Magnesium', 'Iron and Copper', 'Lead and Zinc'], correctAnswer: 'Calcium and Magnesium', marks: 1, topic: 'Water', explanation: 'Ca2+ and Mg2+ ions cause hardness.' },
      { id: 'ch-14', section: SectionType.MCQ, text: '14. The main ore of Iron is:', type: 'mcq', options: ['Bauxite', 'Haematite', 'Galena', 'Cinnabar'], correctAnswer: 'Haematite', marks: 1, topic: 'Metals', explanation: 'Haematite (Fe2O3) is the primary iron ore.' },
      { id: 'ch-15', section: SectionType.MCQ, text: '15. Which organic compound reacts with sodium to produce hydrogen gas?', type: 'mcq', options: ['Ethanol', 'Ethene', 'Ethane', 'Ethyl ethanoate'], correctAnswer: 'Ethanol', marks: 1, topic: 'Organic Chemistry', explanation: 'Alcohols react with sodium metal to release hydrogen.' },
      { id: 'ch-16', section: SectionType.MCQ, text: '16. According to Boyle’s Law, at constant temperature:', type: 'mcq', options: ['V ∝ T', 'V ∝ 1/P', 'P ∝ T', 'V ∝ P'], correctAnswer: 'V ∝ 1/P', marks: 1, topic: 'Gas Laws', explanation: 'Volume is inversely proportional to Pressure.' },
      { id: 'ch-17', section: SectionType.MCQ, text: '17. A solution with pH 13 is:', type: 'mcq', options: ['Strongly Acidic', 'Weakly Acidic', 'Neutral', 'Strongly Alkaline'], correctAnswer: 'Strongly Alkaline', marks: 1, topic: 'Acids and Bases', explanation: 'pH > 7 is alkaline; 13 is very strong.' },
      { id: 'ch-18', section: SectionType.MCQ, text: '18. Which element is used to galvanize iron to prevent rusting?', type: 'mcq', options: ['Copper', 'Tin', 'Zinc', 'Silver'], correctAnswer: 'Zinc', marks: 1, topic: 'Metals', explanation: 'Galvanization uses Zinc.' },
      { id: 'ch-19', section: SectionType.MCQ, text: '19. The functional group -COOH belongs to:', type: 'mcq', options: ['Alcohols', 'Carboxylic Acids', 'Esters', 'Alkenes'], correctAnswer: 'Carboxylic Acids', marks: 1, topic: 'Organic Chemistry', explanation: '-COOH is the carboxyl group.' },
      { id: 'ch-20', section: SectionType.MCQ, text: '20. Exothermic reactions:', type: 'mcq', options: ['Absorb heat', 'Release heat', 'Have positive ΔH', 'Occur only in solution'], correctAnswer: 'Release heat', marks: 1, topic: 'Thermochemistry', explanation: 'Exothermic reactions release energy to the surroundings.' },

      // PART 2: SHORT ANSWER
      { id: 'ch-21', section: SectionType.SHORT_ANSWER, text: '21. Define the term "Allotropy" and name two allotropes of Carbon.', type: 'text', correctAnswer: 'Allotropy is the existence of an element in two or more different structural forms in the same physical state. Allotropes of Carbon: Diamond and Graphite.', marks: 4, topic: 'Non-metals', explanation: 'Different physical forms of the same element.' },
      { id: 'ch-22', section: SectionType.SHORT_ANSWER, text: '22. Explain why ionic compounds conduct electricity when molten but not when solid.', type: 'text', correctAnswer: 'In solid state, ions are held in fixed positions by strong electrostatic forces and cannot move. In molten state, the lattice breaks down, allowing ions to move freely and carry charge.', marks: 4, topic: 'Bonding', explanation: 'Conductivity requires mobile charge carriers (ions).' },
      { id: 'ch-23', section: SectionType.SHORT_ANSWER, text: '23. Balance the following equation: N₂ + H₂ → NH₃', type: 'text', correctAnswer: 'N₂ + 3H₂ → 2NH₃', marks: 2, topic: 'Stoichiometry', explanation: 'Nitrogen: 2 on both sides. Hydrogen: 6 on both sides.' },
      { id: 'ch-24', section: SectionType.SHORT_ANSWER, text: '24. State Le Chatelier’s Principle.', type: 'text', correctAnswer: 'If a system in dynamic equilibrium is subjected to a change in conditions (concentration, pressure, temperature), the position of equilibrium moves to counteract the change.', marks: 4, topic: 'Equilibrium', explanation: 'System opposes change.' },
      
      // PART 3: CALCULATION
      { id: 'ch-25', section: SectionType.CALCULATION, text: '25. Calculate the molarity of a solution formed by dissolving 4 grams of NaOH in 500 cm³ of water. (Na=23, O=16, H=1)', type: 'text', correctAnswer: '0.2 M', marks: 5, topic: 'Stoichiometry', explanation: '1. Molar Mass NaOH = 23+16+1 = 40g/mol. \n2. Moles = 4g / 40g/mol = 0.1 mol. \n3. Volume = 0.5 dm³. \n4. Molarity = 0.1 / 0.5 = 0.2 mol/dm³.' },
      { id: 'ch-26', section: SectionType.CALCULATION, text: '26. A hydrocarbon contains 85.7% Carbon and 14.3% Hydrogen by mass. Its molecular mass is 28. Determine its molecular formula. (C=12, H=1)', type: 'text', correctAnswer: 'C₂H₄', marks: 5, topic: 'Organic Chemistry', explanation: '1. Moles C: 85.7/12 = 7.14. Moles H: 14.3/1 = 14.3. \n2. Ratio C:H = 1:2. Empirical = CH₂. \n3. Mass(CH₂) = 14. \n4. n = 28/14 = 2. \n5. Formula = C₂H₄ (Ethene).' }
    ]
};

const BIOLOGY_2025_EXAM: Exam = {
    id: 'bio-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.biology.label,
    subjectKey: SUBJECT_CONFIG.biology.key,
    durationMinutes: 90,
    questions: []
};

const GEOGRAPHY_2025_EXAM: Exam = {
    id: 'geo-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.geography.label,
    subjectKey: SUBJECT_CONFIG.geography.key,
    durationMinutes: 90,
    language: 'somali',
    questions: []
};

const SOMALI_2025_EXAM: Exam = {
  id: 'som-2025',
  year: 2025,
  subject: SUBJECT_CONFIG.somali.label,
  subjectKey: SUBJECT_CONFIG.somali.key,
  durationMinutes: 90,
  language: 'somali',
  authority: 'SOMALI_GOV',
  questions: []
};

const ENGLISH_2025_EXAM: Exam = {
    id: 'eng-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.english.label,
    subjectKey: SUBJECT_CONFIG.english.key,
    durationMinutes: 90,
    questions: []
};

const ISLAMIC_STUDIES_2025_EXAM: Exam = {
    id: 'isl-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.islamic.label,
    subjectKey: SUBJECT_CONFIG.islamic.key,
    durationMinutes: 90,
    language: 'arabic',
    direction: 'rtl',
    questions: []
};

const BUSINESS_2025_EXAM: Exam = {
    id: 'bus-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.business.label,
    subjectKey: SUBJECT_CONFIG.business.key,
    durationMinutes: 120,
    questions: []
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
        { id: 'ara-1', section: SectionType.MCQ, text: 'ضد كلمة «الكرم»:', type: 'mcq', options: ['الحقد', 'الحسد', 'الترف', 'البخل'], correctAnswer: 'البخل', marks: 1, topic: 'Vocabulary', explanation: 'الكرم يعني العطاء، وضده البخل.' },
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
        { id: 'hist-1', section: SectionType.MCQ, text: '1. Goormaa xorriyadda qaadatay Soomaaliya?', type: 'mcq', options: ['1950', '1960', '1970', '1980'], correctAnswer: '1960', marks: 1, topic: 'Somali History', explanation: 'Soomaaliya waxay xorriyadda qaadatay 1da Luulyo 1960.' }
    ]
};

const ICT_2025_EXAM: Exam = {
    id: 'ict-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.ict.label,
    subjectKey: SUBJECT_CONFIG.ict.key,
    durationMinutes: 90,
    questions: [
        { id: 'ict-1', section: SectionType.MCQ, text: '1. What does CPU stand for?', type: 'mcq', options: ['Central Processing Unit', 'Central Power Unit', 'Computer Personal Unit', 'Central Process Utility'], correctAnswer: 'Central Processing Unit', marks: 1, topic: 'Hardware', explanation: 'CPU is the brain of the computer.' }
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
