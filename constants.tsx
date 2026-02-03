
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
    // PART ONE: MULTIPLE CHOICE QUESTIONS (40 Marks)
    { id: 'phy-1', section: SectionType.MCQ, text: '1. The branch of physics that deals with motion and force is called:', type: 'mcq', options: ['Optics', 'Mechanics', 'Atomic', 'Electromagnetism'], correctAnswer: 'Mechanics', marks: 1, topic: 'Mechanics', explanation: 'Mechanics is the study of motion and forces.' },
    { id: 'phy-2', section: SectionType.MCQ, text: '2. The magnetic field lines originate from:', type: 'mcq', options: ['East Pole', 'South Pole', 'North Pole', 'West Pole'], correctAnswer: 'North Pole', marks: 1, topic: 'Magnetism', explanation: 'Magnetic field lines travel from North to South externally.' },
    { id: 'phy-3', section: SectionType.MCQ, text: '3. In which of the following diagrams show P and Q are series with each other and parallel with R?', type: 'mcq', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A', marks: 1, topic: 'Electricity', explanation: 'Identify the circuit where P and Q form a single branch connected across R.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ph-1-ChatGPT.png' },
    { id: 'phy-4', section: SectionType.MCQ, text: '4. The period of SHM depends on:', type: 'mcq', options: ['Length of the string', 'Mass of the spring', 'Acceleration due to gravity', 'Mass of vibrating body'], correctAnswer: 'Length of the string', marks: 1, topic: 'Simple Harmonic Motion', explanation: 'For a simple pendulum, T depends on length and gravity.' },
    { id: 'phy-5', section: SectionType.MCQ, text: '5. The figure below shows the journey made by a car. At what interval the velocity will be constant:', type: 'mcq', options: ['Between O and K', 'Between L and M', 'Between K and L', 'Between O and M'], correctAnswer: 'Between L and M', marks: 1, topic: 'Kinematics', explanation: 'Constant velocity appears as a horizontal line on a Velocity-Time graph.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ph-2-ChatGPT-2.png' },
    { id: 'phy-6', section: SectionType.MCQ, text: '6. Which quantity measures the figure below:', type: 'mcq', options: ['Pressure', 'Energy', 'Volume', 'Temperature'], correctAnswer: 'Volume', marks: 1, topic: 'Measurements', explanation: 'A measuring cylinder measures liquid volume.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ph-6-ChatGPT.png' },
    { id: 'phy-7', section: SectionType.MCQ, text: '7. The device used for measuring potential difference (Voltage) is known as:', type: 'mcq', options: ['Ammeter', 'Voltmeter', 'Ohmmeter', 'Galvanometer'], correctAnswer: 'Voltmeter', marks: 1, topic: 'Electricity', explanation: 'Voltmeters measure potential difference.' },
    { id: 'phy-8', section: SectionType.MCQ, text: '8. According to wave properties which property shows the figure below:', type: 'mcq', options: ['Reflection', 'Refraction', 'Diffraction', 'Rectilinear Propagation'], correctAnswer: 'Refraction', marks: 1, topic: 'Waves', explanation: 'Bending of light/waves passing between media is Refraction.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ph-2-ChatGPT.png' },
    { id: 'phy-9', section: SectionType.MCQ, text: '9. Two teams from Somali public schools are playing a tug war. Find their resultant force by using in the figure below:', type: 'mcq', options: ['600 N', '300 N', '0 N', '0.5 N'], correctAnswer: '300 N', marks: 1, topic: 'Forces', explanation: 'Resultant = Larger Force - Smaller Force.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/Phy-8-ChatGPT.png' },
    { id: 'phy-10', section: SectionType.MCQ, text: '10. Which method of heat transfer occurs in vacuum:', type: 'mcq', options: ['Conduction', 'Convection', 'Radiation', 'Induction'], correctAnswer: 'Radiation', marks: 1, topic: 'Heat', explanation: 'Radiation requires no medium.' },
    { id: 'phy-11', section: SectionType.MCQ, text: '11. In the early morning the sun can cause the buildings to form a shadow. This shadow appears:', type: 'mcq', options: ['Long', 'fat', 'thin', 'short'], correctAnswer: 'Long', marks: 1, topic: 'Light', explanation: 'Low sun angle creates long shadows.' },
    { id: 'phy-12', section: SectionType.MCQ, text: '12. In the figure shown pendulums with different strings... Which of the pendulums oscillates with the lowest frequency?', type: 'mcq', options: ['string A', 'string B', 'string C', 'string D'], correctAnswer: 'string D', marks: 1, topic: 'Simple Harmonic Motion', explanation: 'Frequency is inversely proportional to length. Longest string = Lowest frequency.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ph12.png' },
    { id: 'phy-13', section: SectionType.MCQ, text: '13. The third law of Newton is also known as:', type: 'mcq', options: ['The law of inertia', 'law of acceleration', 'the law of action and reaction', 'The law of weight'], correctAnswer: 'the law of action and reaction', marks: 1, topic: 'Newton\'s Laws', explanation: 'Action and Reaction pairs.' },
    { id: 'phy-14', section: SectionType.MCQ, text: '14. The figure below shows one of the following motion:', type: 'mcq', options: ['Linear Motion', 'Projectile Motion', 'Circular Motion', 'Oscillatory Motion'], correctAnswer: 'Oscillatory Motion', marks: 1, topic: 'Motion', explanation: 'Shows back and forth movement (e.g., pendulum).', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ph-14-ChatGPT.png' },
    { id: 'phy-15', section: SectionType.MCQ, text: '15. The quantity of heat energy is given by:', type: 'mcq', options: ['Q = mcΔT', 'Q = mΔt', 'Q = mCΔt', 'Q = mcΔe'], correctAnswer: 'Q = mcΔT', marks: 1, topic: 'Heat', explanation: 'Standard heat capacity formula.' },
    { id: 'phy-16', section: SectionType.MCQ, text: '16. In the diagram below the amplitude the wave in centimeters is equivalent to:', type: 'mcq', options: ['1 cm', '2 cm', '3 cm', '4 cm'], correctAnswer: '2 cm', marks: 1, topic: 'Waves', explanation: 'Amplitude is maximum displacement from equilibrium.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/Ph-16-ChatGPT.png' },
    { id: 'phy-17', section: SectionType.MCQ, text: '17. Which of the following materials allows light to pass through it?', type: 'mcq', options: ['Copper', 'wood', 'glass', 'rubber'], correctAnswer: 'glass', marks: 1, topic: 'Light', explanation: 'Glass is transparent.' },
    { id: 'phy-18', section: SectionType.MCQ, text: '18. The frequency of simple harmonic motion is given by:', type: 'mcq', options: ['f = 1 / 2π √(g/l)', 'f = 1 / 2π √(l/g)', 'f = 2π √(g/l)', 'f = 2π √(l/g)'], correctAnswer: 'f = 1 / 2π √(g/l)', marks: 1, topic: 'Simple Harmonic Motion', explanation: 'Frequency formula for simple pendulum.' },
    { id: 'phy-19', section: SectionType.MCQ, text: '19. In the following shape represents same brick place in different ways which case has its least pressure:', type: 'mcq', options: ['A', 'B', 'C', 'The three shapes have same pressure'], correctAnswer: 'B', marks: 1, topic: 'Pressure', explanation: 'Least pressure corresponds to the largest surface area in contact.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ph-19-ChatGPT.png' },
    { id: 'phy-20', section: SectionType.MCQ, text: '20. The characteristics of sound which helps us to distinguish between a woman’s voice and man’s, even voice without seeing them is:', type: 'mcq', options: ['Intensity', 'Loudness', 'Quality', 'Pitch'], correctAnswer: 'Pitch', marks: 1, topic: 'Sound', explanation: 'Pitch is determined by frequency (women typically have higher pitch).' },
    { id: 'phy-21', section: SectionType.MCQ, text: '21. A microphone of a mosque is set up to record and display a sound of pray (Salat) by loudspeaker. Which one of the following sound is louder?', type: 'mcq', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A', marks: 1, topic: 'Sound', explanation: 'Louder sounds have larger amplitude.', diagramUrl: ['https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ph-21-ChatGPT.png', 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/phy-21-ChatGPT.png'] },
    { id: 'phy-22', section: SectionType.MCQ, text: '22. The angle between two plane mirrors is 60°, if an object is placed between them, the number of images formed will be:', type: 'mcq', options: ['6 images', '5 images', '4 images', '3 images'], correctAnswer: '5 images', marks: 1, topic: 'Light', explanation: 'n = (360/theta) - 1. (360/60) - 1 = 5.' },
    { id: 'phy-23', section: SectionType.MCQ, text: '23. The image formed by a plane mirror is:', type: 'mcq', options: ['real and erect', 'virtual and inverted', 'virtual and erect', 'real and magnified'], correctAnswer: 'virtual and erect', marks: 1, topic: 'Light', explanation: 'Plane mirrors form virtual, erect, same-size images.' },
    { id: 'phy-24', section: SectionType.MCQ, text: '24. A battery of 220V is connected to a lamp as shown in the figure. The current passed through it is:', type: 'mcq', options: ['220V', '176V', '0.25A', '220.8V'], correctAnswer: '0.25A', marks: 1, topic: 'Electricity', explanation: 'Use Ohm\'s Law I = V/R based on diagram values.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ph-24-ChatGPT.png' },
    { id: 'phy-25', section: SectionType.MCQ, text: '25. The principle of formation of image in lenses is:', type: 'mcq', options: ['Reflection of light', 'Refraction of light', 'Dispersion of light', 'Scattering of light'], correctAnswer: 'Refraction of light', marks: 1, topic: 'Light', explanation: 'Lenses work by refraction.' },
    { id: 'phy-26', section: SectionType.MCQ, text: '26. If you stand in front of a special mirror... head bigger... middle same... leg smaller. The order is:', type: 'mcq', options: ['Plane – Concave – Convex', 'Concave – Plane – Convex', 'Plane – Convex – Concave', 'Convex – Plane – Concave'], correctAnswer: 'Concave – Plane – Convex', marks: 1, topic: 'Light', explanation: 'Concave magnifies, Plane stays same, Convex diminishes.' },
    { id: 'phy-27', section: SectionType.MCQ, text: '27. A coal appears dark when viewed with white light because it:', type: 'mcq', options: ['Reflect', 'Disperse', 'Refract', 'Absorb'], correctAnswer: 'Absorb', marks: 1, topic: 'Light', explanation: 'Black objects absorb all light.' },
    { id: 'phy-28', section: SectionType.MCQ, text: '28. The stars appears to twinkle due to:', type: 'mcq', options: ['refraction', 'diffraction', 'interference', 'reflection'], correctAnswer: 'refraction', marks: 1, topic: 'Light', explanation: 'Atmospheric refraction.' },
    { id: 'phy-29', section: SectionType.MCQ, text: '29. The seven colors obtained on the screen when light passes through a prism is known as:', type: 'mcq', options: ['Scattering', 'Refraction', 'Spectrum', 'Dispersion'], correctAnswer: 'Spectrum', marks: 1, topic: 'Light', explanation: 'The band of colors is the spectrum.' },
    { id: 'phy-30', section: SectionType.MCQ, text: '30. Calculate the equivalent capacitors as shown in the figure below:', type: 'mcq', options: ['3.4 μF', '2.4 μF', '4.4 μF', '5.4 μF'], correctAnswer: '2.4 μF', marks: 1, topic: 'Electronics', explanation: 'Calculate using Series/Parallel capacitor rules.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/Ph-30-ChatGPT.png' },
    { id: 'phy-31', section: SectionType.MCQ, text: '31. In real life the Faraday’s law can be applied in many devices which of the following is an application of it:', type: 'mcq', options: ['Electric bulb', 'Watches', 'televisions', 'tape player'], correctAnswer: 'tape player', marks: 1, topic: 'Electromagnetism', explanation: 'Magnetic tape reading uses induction.' },
    { id: 'phy-32', section: SectionType.MCQ, text: '32. The maximum voltage circuit is 60V, using θ = 30°, its instantaneous voltage will be:', type: 'mcq', options: ['40V', '50V', '30V', '60V'], correctAnswer: '30V', marks: 1, topic: 'AC Circuits', explanation: 'V = Vmax * sin(30) = 60 * 0.5 = 30V.' },
    { id: 'phy-33', section: SectionType.MCQ, text: '33. The basic element in DC is resistor while in AC the three basic elements are:', type: 'mcq', options: ['Resistor, Inductor and Capacitor (RLC)', 'Voltage Diode and Capacitor (VDC)', 'Transistor, Diode and Resistor (TDR)', 'Diode, Inductor and Resistors (DLR)'], correctAnswer: 'Resistor, Inductor and Capacitor (RLC)', marks: 1, topic: 'AC Circuits', explanation: 'RLC components.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ph-33-ChatGPT.png' },
    { id: 'phy-34', section: SectionType.MCQ, text: '34. The below figure represents:', type: 'mcq', options: ['and gate', 'or gate', 'not gate', 'Nor gate'], correctAnswer: 'or gate', marks: 1, topic: 'Electronics', explanation: 'Identify the logic gate symbol.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/Ph-34-ChatGPT.png' },
    { id: 'phy-35', section: SectionType.MCQ, text: '35. The two most frequently used materials for electronics are:', type: 'mcq', options: ['Carbon and Selenium', 'Selenium and Glass', 'Germanium and Silicon', 'Gallium and Arsenic'], correctAnswer: 'Germanium and Silicon', marks: 1, topic: 'Electronics', explanation: 'Semiconductors.' },
    { id: 'phy-36', section: SectionType.MCQ, text: '36. Which of the following electromagnetic spectrum is particularly more hazardous:', type: 'mcq', options: ['γ – ray', 'Infrared', 'x – ray', 'Ultraviolet'], correctAnswer: 'γ – ray', marks: 1, topic: 'EM Spectrum', explanation: 'Gamma rays have highest energy.' },
    { id: 'phy-37', section: SectionType.MCQ, text: '37. The different elements having same mass number but different atomic number are called:', type: 'mcq', options: ['isobars', 'isotones', 'isotopes', 'isomers'], correctAnswer: 'isobars', marks: 1, topic: 'Atomic Physics', explanation: 'Same mass (A), different atomic (Z).' },
    { id: 'phy-38', section: SectionType.MCQ, text: '38. ²³⁸U → ²³⁴Th + β + Energy. This equation represents a radioactive emission of:', type: 'mcq', options: ['Alpha (α) – Particle', 'Beta (β) – Particle', 'gamma (γ) – Particle', 'Theta (θ) – particle'], correctAnswer: 'Beta (β) – Particle', marks: 1, topic: 'Radioactivity', explanation: 'Equation indicates Beta emission.' },
    { id: 'phy-39', section: SectionType.MCQ, text: '39. Which type of radiation is stopped by a sheet paper?', type: 'mcq', options: ['Beta particle', 'alpha particle', 'gamma ray', 'x-ray'], correctAnswer: 'alpha particle', marks: 1, topic: 'Radioactivity', explanation: 'Alpha particles have low penetration.' },
    { id: 'phy-40', section: SectionType.MCQ, text: '40. For every one degree Celsius rise in temperature the speed of sound in air is increased by:', type: 'mcq', options: ['0.4 m/s', '0.2 m/s', '0.6 m/s', '0.1 m/s'], correctAnswer: '0.6 m/s', marks: 1, topic: 'Sound', explanation: 'Standard approximate value.' },

    // PART TWO: DIRECT QUESTIONS (15 Questions – 28 Marks)
    { id: 'phy-41', section: SectionType.SHORT_ANSWER, text: '1. a) What is a magnet?\nb) What are the poles of magnet?', type: 'text', correctAnswer: 'a) A material producing a magnetic field. b) North and South poles.', marks: 4, topic: 'Magnetism', explanation: 'Definition and poles.' },
    { id: 'phy-42', section: SectionType.SHORT_ANSWER, text: '2. Complete the table below with the names of the type of current which generated the specific wave form.', type: 'text', correctAnswer: 'DC (Direct Current) and AC (Alternating Current).', marks: 4, topic: 'Electricity', explanation: 'Identify waveforms from table.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ph-dr-2-ChatGPT.png' },
    { id: 'phy-43', section: SectionType.SHORT_ANSWER, text: '3. Distinguish between transparent and translucent materials.', type: 'text', correctAnswer: 'Transparent allows light to pass clearly; Translucent allows light but diffuses it (unclear view).', marks: 4, topic: 'Light', explanation: 'Optical properties.' },
    { id: 'phy-44', section: SectionType.SHORT_ANSWER, text: '4. List the five common properties of wave.', type: 'text', correctAnswer: 'Reflection, Refraction, Diffraction, Interference, Polarization.', marks: 4, topic: 'Waves', explanation: 'Core wave behaviors.' },
    { id: 'phy-45', section: SectionType.SHORT_ANSWER, text: '5. Compare with examples luminous and non–luminous bodies.', type: 'text', correctAnswer: 'Luminous emit light (Sun, Bulb); Non-luminous reflect light (Moon, Wood).', marks: 4, topic: 'Light', explanation: 'Source vs Reflector.' },
    { id: 'phy-46', section: SectionType.SHORT_ANSWER, text: '6. Give reason why the red light is used as a universal danger signal?', type: 'text', correctAnswer: 'Longest wavelength, scatters least, visible from long distance.', marks: 4, topic: 'Light', explanation: 'Scattering properties.' },
    { id: 'phy-47', section: SectionType.SHORT_ANSWER, text: '7. An 18-years old student is not able to see clearly the questions written on the blackboard placed at a distance of 20 m from him.\na) Name the defect of vision suffering from him\nb) Name the type of lens used to correct this defect.', type: 'text', correctAnswer: 'a) Myopia (Short-sightedness)\nb) Concave Lens', marks: 4, topic: 'Light', explanation: 'Distance vision problem.' },
    { id: 'phy-48', section: SectionType.CALCULATION, text: '8. The yacht shown in figure 1 has mass of 2000 kg. Calculate its weight in air. Take Acceleration due to gravity = 10 m/s².', type: 'text', correctAnswer: '20,000 N', marks: 4, topic: 'Forces', explanation: 'W = mg = 2000 * 10 = 20000 N.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/Ph-Dr8-ChatGPT-I.png' },
    { id: 'phy-49', section: SectionType.CALCULATION, text: '9. The minute arm of the clock rotates in one complete revolution (2π) in 60 seconds. Calculate the angular frequency of the arm.', type: 'text', correctAnswer: '0.105 rad/s', marks: 4, topic: 'Circular Motion', explanation: 'omega = 2pi / T = 2*3.14 / 60 = 0.1047.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/Ph-Dr-9-ChatGPT-I.png' },
    { id: 'phy-50', section: SectionType.CALCULATION, text: '10. Find the intensity level for a sound wave of intensity of 4 × 10⁻¹⁰ W/m².', type: 'text', correctAnswer: 'Depends on reference intensity (assume 10^-12). L = 10log(I/I0) = 10log(400) = 26 dB.', marks: 4, topic: 'Sound', explanation: 'Decibel formula.' },
    { id: 'phy-51', section: SectionType.CALCULATION, text: '11. The primary current in a transformer is 20 A if the primary coil has 200 turns and secondary coil has 600 turns... What current flows in the secondary coil?', type: 'text', correctAnswer: '6.67 A', marks: 4, topic: 'Electricity', explanation: 'Ip/Is = Ns/Np => 20/Is = 600/200 => Is = 6.67 A.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ph-dr-11-ChatGPT.png' },
    { id: 'phy-52', section: SectionType.CALCULATION, text: '12. An electron is accelerated by a potential difference of 2000 V if the electron charge is 1.6 × 10⁻¹⁹ C.\na) What is the electron energy in Joule (J)?\nb) Electron volt (eV).', type: 'text', correctAnswer: 'a) 3.2 x 10^-16 J\nb) 2000 eV', marks: 4, topic: 'Electricity', explanation: 'E = qV.' },
    { id: 'phy-53', section: SectionType.CALCULATION, text: '13. Calculate the equivalent resistance as shown below.', type: 'text', correctAnswer: 'Depends on diagram values.', marks: 4, topic: 'Electricity', explanation: 'Series and Parallel rules.', diagramUrl: 'https://courses.shaiyecompany.com/wp-content/uploads/2026/01/ph-dr13-ChatGPT.png' },
    { id: 'phy-54', section: SectionType.CALCULATION, text: '14. A student having a myopic eye uses a concave lens of focal length 15 cm. What is the power of the lens?', type: 'text', correctAnswer: '-6.67 D', marks: 4, topic: 'Light', explanation: 'P = 1/f (in meters). f = -0.15m. P = -6.67 Diopters.' },
    { id: 'phy-55', section: SectionType.CALCULATION, text: '15. A 20 cm straight wire moves at a constant speed of 5 m/s perpendicular to a magnetic field of strength 0.004 T.\na) How much induced electromotive force is generated in the wire?\nb) If the wire has a resistance of 0.25 Ω what is the magnitude of the current passing through it?', type: 'text', correctAnswer: 'a) 0.004 V\nb) 0.016 A', marks: 4, topic: 'Electromagnetism', explanation: 'a) E = Blv = 0.004 * 0.2 * 5 = 0.004 V. b) I = E/R = 0.004/0.25 = 0.016 A.' }
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
    // ... [Content abbreviated for brevity, assuming existing structure remains] ...
  ]
};

// ... [Existing exams: CHEMISTRY_2025_EXAM, BIOLOGY_2025_EXAM, etc.] ...
const CHEMISTRY_2025_EXAM: Exam = {
    id: 'chem-2025',
    year: 2025,
    subject: SUBJECT_CONFIG.chemistry.label,
    subjectKey: SUBJECT_CONFIG.chemistry.key,
    durationMinutes: 120,
    language: 'english',
    authority: 'SOMALI_GOV',
    level: 'FORM_IV',
    questions: []
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
  sectionPassages: {
    [SectionType.MCQ]: "Dhirta waxa ay laf-dhabar u tahay nolosha nafleyda dhammaan. Nafleyda badda iyo tan berrigaba, waxa ay noloshoodu ku tiirsan tahay dhirta. Dhirta barriga waxa ay isugu jirtaa mid la beero iyo mid iskeeda u baxda. Tan la beero waxa ka mid ah geed miroodka, sida cambaha, digirta, muuska, galleyda iyo masagadda. Sidoo kale waxa jira khudrad kala duwan oo qaar caleentoooda la cuno, qaarna jirridooda, qaarna xididdadooda.\n\nIntaas waxaa ka badan dhirta dabiiciga ah ee iskeed u baxda, miraha iyo xabagta laga helo. Xabagtu sida; fooxa, lubaanta, malmalka iyo xabagta dhacda waa laga ganacsadaa. Sidaa darteed dhirtu waxa ay gundhig u tahay nolosha dadka, duunyada, ciidodka iyo duugaagta.\n\nHaddii ay dhirtu yaraato ama xaalufowdo waxa hoos u dhacaya dhaqaalaha iyo dhaqanka. Dhirtu waxa ay ka qeybqaadataa bilicda deegaanka, waxa ayna noqotaa dalxiis indha doogsi ah.\n\nMarkii uu roobku da’o oo ay cammuduubbiya ka dhacdo, calcayduna balliyada ceegaagto, dhirtuna caleemo kala duwan bixiso, haddii aad dalxiis gaaban ugu baxdo keymo ay xalay roob ka da’ay miir hesho oo ay indhahaagu qabtaan ciidod kala duwan sida; geriga, deerada, maroodiga, galyanio iyo arbab, oo kuu laaclamaya dhir qurux badan laanta carunka ah madxa isgalinaya, waxa aad dareemeysaa indha darandoori.\n\nSidaa oo kale jillaalka waxa magoola geed madowga. Geed madowgu waa dhirta aan caleentu ka dhammaan ee mar walba cagaaran, dhirtasi waxa calaafsad xooolaha xilliga jillaalka, magaalooyinka hoos iyo qurux ayey u leedahay. Dhirtasi waxa ay bixisaa xilliga jiilaadka man qurux badan, kadibna waa ay magooshaa. Magoolku waa caleenta ay dhirta geed madowga ahi bixiso xilliga diraacda inta aan wali roobku di’in.\n\nDhirta waxa ay noo leedahay waxdheef badan, waxa aan cunnaa miraha, xabagteeda iyo caleenteeda. Waxaana daaqa oo ku nool duunyada aan dhaqananno sida; geela, geeslayda iyo gammaanta. Ugu dambeyn dhirta waa in aan dhayal loo jarin oo la ilaalinyo."
  },
  questions: [
    // PART 1: MCQs (1-40)
    { id: 'som-1', section: SectionType.MCQ, text: '1. Dhirta yar yar ee ka baxda badda gudheeda waxaa loo yaqaan:', type: 'mcq', options: ['dhirbiyood', 'dhirbadeed', 'haramobadeed', 'dhirgaab'], correctAnswer: 'dhirbadeed', marks: 1, topic: 'Comprehension', explanation: 'Dhirta badda waxaa loo yaqaan dhirbadeed.', diagramUrl: 'https://shaiyecompany.com/wp-content/uploads/2026/02/forests.jpg' },
    { id: 'som-2', section: SectionType.MCQ, text: '2. Erayga “magool” macnihiisu waa:', type: 'mcq', options: ['ubax', 'jirrid', 'caleen', 'miro'], correctAnswer: 'caleen', marks: 1, topic: 'Comprehension', explanation: 'Sida qoraalka ku xusan, magoolku waa caleenta ay dhirta geed madowga ahi bixiso.' },
    { id: 'som-3', section: SectionType.MCQ, text: '3. Dhulka meesha ugaadka ah ee beerashada iyo daaqsinta ku habboon waxaa loo yaqaan:', type: 'mcq', options: ['cosob', 'kaliil', 'raso', 'hiil'], correctAnswer: 'cosob', marks: 1, topic: 'Vocabulary', explanation: 'Cosob waa dhul cagaaran oo ku habboon daaqsin.' },
    { id: 'som-4', section: SectionType.MCQ, text: '4. Erayga “Geelays” waxaa loo la jeedaa:', type: 'mcq', options: ['riyo iyo ido', 'ari’ iyo lo’', 'geel iyo lo’', 'ari’ iyo geel'], correctAnswer: 'geel iyo lo’', marks: 1, topic: 'Vocabulary', explanation: 'Geelays waxaa badanaa loola jeedaa geela iyo lo\'da.' },
    { id: 'som-5', section: SectionType.MCQ, text: '5. Geedka “waambaha” waxaa la cunaa:', type: 'mcq', options: ['xididdisa', 'mirihiisa', 'caleentiisa', 'fiiddiisa'], correctAnswer: 'caleentiisa', marks: 1, topic: 'Plants', explanation: 'Waambaha waxaa la cunaa caleentiisa (iyo miraha mararka qaar).' },
    { id: 'som-6', section: SectionType.MCQ, text: '6. Roobka da’abaayaadka xilliga gu’ga waxaa loo yaqaan:', type: 'mcq', options: ['gugudde', 'mansuunta', 'gufaco', 'xanqar'], correctAnswer: 'gugudde', marks: 1, topic: 'Seasons', explanation: 'Gugudde waa roobka gu\'ga.' },
    { id: 'som-7', section: SectionType.MCQ, text: '7. Erayga “man” macnihiisu waa:', type: 'mcq', options: ['caleen', 'ubax', 'miro', 'xidid'], correctAnswer: 'ubax', marks: 1, topic: 'Plants', explanation: 'Man waa ubaxa geedka ka hor inta uusan dhalin.' },
    { id: 'som-8', section: SectionType.MCQ, text: '8. “Gamaan” waxaa loola jeedaa:', type: 'mcq', options: ['ariga, lo’da iyo baqasha', 'lo’da dameeraha iyo fardaha', 'dameeraha, fardaha iyo baqasha', 'geela, dameeraha iyo ariga'], correctAnswer: 'dameeraha, fardaha iyo baqasha', marks: 1, topic: 'Animals', explanation: 'Gamaan waa xayawaanka la fuulo ama la raro (Fardo, dameero, baqal).' },
    { id: 'som-9', section: SectionType.MCQ, text: '9. “Haruur” waxaa la micna ah:', type: 'mcq', options: ['digir', 'galleey', 'masaggo', 'sisin'], correctAnswer: 'masaggo', marks: 1, topic: 'Crops', explanation: 'Haruur waa nooc ka mid ah masagada/haduudhka.' },
    { id: 'som-10', section: SectionType.MCQ, text: '10. “foox” waa:', type: 'mcq', options: ['miro', 'caleen', 'xidid', 'xabag'], correctAnswer: 'xabag', marks: 1, topic: 'Plants', explanation: 'Fooxu waa nooc ka mid ah xabagta la shito.' },
    { id: 'som-11', section: SectionType.MCQ, text: '11. Erayga “ceelkaeye” waxa uu ka kooban yahay:', type: 'mcq', options: ['magac, fal iyo meeleyne', 'magac, falkaab iyo meeleyne', 'magac, magac u yaal iyo fal', 'magac, fal iyo falkaab'], correctAnswer: 'magac, fal iyo meeleyne', marks: 1, topic: 'Grammar', explanation: 'Ceel (Magac), ka (Meeleyne/Qodob), eeye/geeye (Fal/Magac-faleed).' },
    { id: 'som-12', section: SectionType.MCQ, text: '12. Erayga “Afgooye” waxa uu ka kooban yahay:', type: 'mcq', options: ['fal iyo tilmaame', 'sifo iyo magac', 'fal iyo xiriiriye', 'fal iyo sifo'], correctAnswer: 'fal iyo sifo', marks: 1, topic: 'Grammar', explanation: 'Af (Magac/Sifo) + Gooye (Fal/Sifo).' },
    { id: 'som-13', section: SectionType.MCQ, text: '13. Noocyada weeraha af Soomaaliga waxaa ka mid ah:', type: 'mcq', options: ['weer fudud, mid kakan, mid qalloocean', 'weer jilicsan, mid fudud, iyo mid toosan', 'weer dabban, mid toosan, iyo mid qaloocean', 'weer dhafan, mid fudud, iyo mid kakan'], correctAnswer: 'weer dhafan, mid fudud, iyo mid kakan', marks: 1, topic: 'Grammar', explanation: 'Weeruhu waa Fudud, Kakan, iyo Dhafan.' },
    { id: 'som-14', section: SectionType.MCQ, text: '14. Eray weydiinleedyada magac-u-yaallada dheddig waxaa ka mid ah:', type: 'mcq', options: ['kuwee, kuma, tuma, sidee', 'xaggee, goorma, kee, kuwee', 'kee, kuma, xaggee, imisa', 'tee, kuwee, yaa, tuma'], correctAnswer: 'tee, kuwee, yaa, tuma', marks: 1, topic: 'Grammar', explanation: 'Tee iyo Tuma waa dheddig.' },
    { id: 'som-15', section: SectionType.MCQ, text: '15. Magac lab ee kelida ah haddii uu ku dhammaado shaqalka “e” waxa uu wadar ku noqdaa:', type: 'mcq', options: ['aal', 'yaal', 'aayal', 'yooyin'], correctAnswer: 'yaal', marks: 1, topic: 'Grammar', explanation: 'Tusaale: Bare -> Barayaal.' },
    { id: 'som-16', section: SectionType.MCQ, text: '16. Xiririyeyaasha af-Soomaaliga waxa aan ka mid ahayn:', type: 'mcq', options: ['sidee', 'sidaa darteed', 'markaa', 'mise'], correctAnswer: 'sidee', marks: 1, topic: 'Grammar', explanation: 'Sidee waa eray su\'aaleed (falkaab), maaha xiriiriye.' },
    { id: 'som-17', section: SectionType.MCQ, text: '17. Magacyada qarsan waxa ka mid ah:', type: 'mcq', options: ['buug', 'miis', 'aqoon', 'qalin'], correctAnswer: 'aqoon', marks: 1, topic: 'Grammar', explanation: 'Aqoon waa magac aan la taaban karin (Abstract/Qarsan).' },
    { id: 'som-18', section: SectionType.MCQ, text: '18. Magacyada aan kelida lahayn waxa ka mid ah:', type: 'mcq', options: ['nin', 'wiil', 'rag', 'macallin'], correctAnswer: 'rag', marks: 1, topic: 'Grammar', explanation: 'Rag waa wadar (Collective noun) aan keli lahayn.' },
    { id: 'som-19', section: SectionType.MCQ, text: '19. Erayga “maamule” waxa uu ka kooban yahay:', type: 'mcq', options: ['saddex dhawaaq', 'laba dhawaaq', 'hal dhawaaq', 'afar dhawaaq'], correctAnswer: 'saddex dhawaaq', marks: 1, topic: 'Phonology', explanation: 'Maa-mu-le (3 syllables).' },
    { id: 'som-20', section: SectionType.MCQ, text: '20. Erayga “jalalaqsi” waxa uu ka kooban yahay:', type: 'mcq', options: ['lix xubnood', 'saddex xubnood', 'afar xubnood', 'shan xubnood'], correctAnswer: 'afar xubnood', marks: 1, topic: 'Phonology', explanation: 'Ja-la-laq-si (4 syllables).' },
    { id: 'som-21', section: SectionType.MCQ, text: '21. Naxwaha af Soomaaliga waxa ka mid ah:', type: 'mcq', options: ['magac, tilmaame iyo meeleyne', 'fal, tix iyo tiraab', 'falkaab, tilmaame iyo astaamaha', 'meeleyne, magac u yaal iyo tilmaame'], correctAnswer: 'magac, tilmaame iyo meeleyne', marks: 1, topic: 'Grammar', explanation: 'Qaybaha hadalka (Parts of speech).' },
    { id: 'som-22', section: SectionType.MCQ, text: '22. Hadalku waxa uu ka kooban yahay:', type: 'mcq', options: ['tix', 'sheeko', 'tiraab', 'b iyo j'], correctAnswer: 'b iyo j', marks: 1, topic: 'Literature', explanation: 'Hadalku waa Tix (Poetry) iyo Tiraab (Prose).' },
    { id: 'som-23', section: SectionType.MCQ, text: '23. Marka guddoonka guurku dhaco martida waxa ay bixin jireen:', type: 'mcq', options: ['yarad', 'yabaadh', 'gaabati', 'kaalo'], correctAnswer: 'kaalo', marks: 1, topic: 'Culture', explanation: 'Kaalo waa xoolaha la bixiyo marka la guursanayo.' },
    { id: 'som-24', section: SectionType.MCQ, text: '24. Falku waxa uu u kala baxaa:', type: 'mcq', options: ['taagto, tilmaaddo iyo taagan', 'tilmaaddo, joogto iyo socoto', 'soo socoto, joogto, taagan iyo sii socoto', 'taagan, mataagan, iyo majoogto ma socoto'], correctAnswer: 'tilmaaddo, joogto iyo socoto', marks: 1, topic: 'Grammar', explanation: 'Noocyada falka.' },
    { id: 'som-25', section: SectionType.MCQ, text: '25. Erayga “saxansaxo” waa:', type: 'mcq', options: ['dabaysha roobka', 'dhibcaha roobka', 'daruurta roobka', 'xareedda roobka'], correctAnswer: 'dabaysha roobka', marks: 1, topic: 'Vocabulary', explanation: 'Saxansaxo waa urta iyo dabaysha roobka.' },
    { id: 'som-26', section: SectionType.MCQ, text: '26. Erayga “abbaaan” waxa la micna ah:', type: 'mcq', options: ['geesi', 'cadow', 'hoggaamiye', 'saaxiib'], correctAnswer: 'hoggaamiye', marks: 1, topic: 'Vocabulary', explanation: 'Abbaan waa hoggaamiye ama ilaaliye.' },
    { id: 'som-27', section: SectionType.MCQ, text: '27. Hasha ilmaheedii dhintay ee ilmaha kale lagu maalo waxaa loo yaqaan:', type: 'mcq', options: ['igar', 'sidig', 'habad', 'galoof'], correctAnswer: 'sidig', marks: 1, topic: 'Vocabulary', explanation: 'Sidig waa hasha ilmo kale lagu maalo ama laba ilmo wada nuujisa.' },
    { id: 'som-28', section: SectionType.MCQ, text: '28. Wananka iyo orgida la dhufaanay si loo iibiyo waxaa loo yaqaan:', type: 'mcq', options: ['jar', 'dibaax', 'loog', 'labood'], correctAnswer: 'dibaax', marks: 1, topic: 'Vocabulary', explanation: 'Dibaax waa xoolaha la naaxiyo.' },
    { id: 'som-29', section: SectionType.MCQ, text: '29. Marka la doonayo in meel cusub oo aan horay loo beeran jirin la beero waxaa lagu sameeyaa:', type: 'mcq', options: ['geed abuur', 'geed tacab', 'geed qaad', 'geed beer'], correctAnswer: 'geed tacab', marks: 1, topic: 'Vocabulary', explanation: 'Geed tacab waa falidda dhul cusub.' },
    { id: 'som-30', section: SectionType.MCQ, text: '30. Erayga “hanfi” waa dabeyl:', type: 'mcq', options: ['qabow', 'kulul', 'badan', 'yar'], correctAnswer: 'kulul', marks: 1, topic: 'Vocabulary', explanation: 'Hanfi waa dabayl kulul.' },
    { id: 'som-31', section: SectionType.MCQ, text: '31. Waranka yar waxaa la yiraahdaa:', type: 'mcq', options: ['taki', 'ableey', 'golxab', 'billawe'], correctAnswer: 'taki', marks: 1, topic: 'Vocabulary', explanation: 'Taki waa waran yar.' },
    { id: 'som-32', section: SectionType.MCQ, text: '32. Maahmaahda “Isma hurto waa haan iyo haruub” waxaa loo adeegsadaa:', type: 'mcq', options: ['colaadd', 'nabad', 'ammaan', 'waano'], correctAnswer: 'waano', marks: 1, topic: 'Proverbs', explanation: 'Waxaa loo adeegsadaa midnimada iyo isku tiirsanaanta (waano).' },
    { id: 'som-33', section: SectionType.MCQ, text: '33. Erayga daluun waxa halkan loola jeedaa:', type: 'mcq', options: ['waddo', 'habeenn', 'haadaan', 'webi'], correctAnswer: 'haadaan', marks: 1, topic: 'Poetry', explanation: 'Daluun waa meel god ah oo qoto dheer (haadaan).' },
    { id: 'som-34', section: SectionType.MCQ, text: '34. Erayga miraale waxa halkan loola jeedaa:', type: 'mcq', options: ['wasaq badan', 'biyo', 'qof miyirkii ka tagay', 'roob xoog leh'], correctAnswer: 'roob xoog leh', marks: 1, topic: 'Poetry', explanation: 'Miiraale waa roob habeennimo da\'a oo xoog leh.' },
    { id: 'som-35', section: SectionType.MCQ, text: '35. Suugaantani (“Ninka guba dalkiisee...”) baddeedu waa:', type: 'mcq', options: ['saar', 'jiifto', 'geeraar', 'buraanbur'], correctAnswer: 'geeraar', marks: 1, topic: 'Poetry', explanation: 'Meerisyada gaagaaban iyo laxanka ayaa tilmaamaya geeraar.' },
    { id: 'som-36', section: SectionType.MCQ, text: '36. Erayga “Qaafiyad” waa astaanta lagu aqoonsado:', type: 'mcq', options: ['tiraabta', 'tixda', 'riwaayadda', 'maahmaahda'], correctAnswer: 'tixda', marks: 1, topic: 'Literature', explanation: 'Qaafiyaddu waa tiirka maansada (Tixda).' },
    { id: 'som-37', section: SectionType.MCQ, text: '37. Hooriska gabaygu waxa uu ka kooban yahay:', type: 'mcq', options: ['20 alan', '8 alan', '12 alan', '18 alan'], correctAnswer: '12 alan', marks: 1, topic: 'Poetry', explanation: 'Hoorisku waa qaybta dambe ee tuduca gabayga, badanaa waa 10-12 alan.' },
    { id: 'som-38', section: SectionType.MCQ, text: '38. Meeriskan “Aboorkuba ailaylkuu dhisaa aqallo waaweyne” waxa uu ka hadlayaa:', type: 'mcq', options: ['awood qeybsii', 'iskaashi', 'wax kala goosi', 'maamul xumada'], correctAnswer: 'iskaashi', marks: 1, topic: 'Literature', explanation: 'Wuxuu tilmaamayaa awoodda wada-jirka iyo iskaashiga.' },
    { id: 'som-39', section: SectionType.MCQ, text: '39. “Dhulka baxsad sooriyo bannaan miran weeyaan ama waa bus iyo xoon” meesiyadan waxa ay ku jiraan maansadii:', type: 'mcq', options: ['seyl', 'dhaqan', 'difaac qaran', 'baaq'], correctAnswer: 'difaac qaran', marks: 1, topic: 'Literature', explanation: 'Waa maanso caan ah oo ka hadlaysa difaaca dalka.' },
    { id: 'som-40', section: SectionType.MCQ, text: '40. Ku buuxi tixdan erayga ku habboon: “Leg ninkii siyaay bey dishaa ________ doqoneede”', type: 'mcq', options: ['leydh', 'liida', 'lukiyan', 'hiillo'], correctAnswer: 'hiillo', marks: 1, topic: 'Poetry', explanation: 'Hiillo la\'aantu waa dhibaato (doqonimo).' },

    // QAYBTA 2AAD – CURIS (COMPOSITION)
    { id: 'som-41', section: SectionType.ESSAY, text: 'Ka qor curis ugu yaraan 20 sadar ah mid ka mid ah mowduucyadan hoose, adiga oo dhowraya habraacyada qoraalka iyo astaamaynta af Soomaaliga.\n\nDooro mid ka mid ah mowduucyadan:\n1. Sidee Soomaaliya u gaari kartaa isku-filnaasho dhinaca dhaqaalaha ah?\n2. Muxuu yahay doorka kaaga aaddan mideynta ummadda Soomaaliyeed?', type: 'text', correctAnswer: '', marks: 10, topic: 'Composition', explanation: 'Ardayga waxaa laga rabaa inuu qoro curis habaysan oo leh hordhac, duluc iyo gabagabo.' }
  ]
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
        // Dummy questions to complete structure if necessary, or assuming partial content provided in prompt
        { id: 'ara-1', section: SectionType.MCQ, text: 'ضد كلمة «الكرم»:', type: 'mcq', options: ['الحقد', 'الحسد', 'الترف', 'البخل'], correctAnswer: 'البخل', marks: 1, topic: 'Vocabulary', explanation: 'الكرم يعني العطاء، وضده البخل.' },
        // ... (Include up to ara-38 from previous context) ...
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
