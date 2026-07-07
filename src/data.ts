import { Course, LabSimulation, Badge, ForumPost } from "./types";

export const MOCK_COURSES: Course[] = [
  {
    id: "ee-101",
    title: "Linear Circuit Analysis & DC Circuits",
    subject: "Electrical Engineering",
    code: "EE-101",
    instructor: "Prof. Arthur Pendelton",
    description: "Master voltage, current, power, Ohm's law, Kirchhoff's laws (KCL/KVL), mesh and nodal analysis, and basic transient RL/RC circuit behaviors.",
    durationWeeks: 12,
    enrollmentCount: 420,
    lessons: [
      { id: "ee101-l1", title: "Voltage, Current, and Resistance Principles", durationMins: 45, completed: true, contentType: "notes" },
      { id: "ee101-l2", title: "Ohm's Law & Kirchhoff's Current & Voltage Laws", durationMins: 60, completed: false, contentType: "interactive" },
      { id: "ee101-l3", title: "Nodal and Mesh Analysis Techniques", durationMins: 50, completed: true, contentType: "notes" },
      { id: "ee101-l4", title: "Capacitors, Inductors & RC Transient Responses", durationMins: 55, completed: false, contentType: "interactive" },
    ],
    weaknessScore: 68,
  },
  {
    id: "ee-201",
    title: "AC Circuits, Phasors & Impedance",
    subject: "Electrical Engineering",
    code: "EE-201",
    instructor: "Dr. Catherine Vance",
    description: "Dive deep into alternating currents (AC), sinusoidal steady-state analysis, phasor diagrams, complex impedance, real/reactive power, and resonance.",
    durationWeeks: 10,
    enrollmentCount: 312,
    lessons: [
      { id: "ee201-l1", title: "Sinusoidal Sources & RMS Voltage/Current", durationMins: 40, completed: true, contentType: "video" },
      { id: "ee201-l2", title: "Phasor Transforms & Complex Impedance (Z)", durationMins: 65, completed: false, contentType: "interactive" },
      { id: "ee201-l3", title: "Real, Reactive, and Apparent Power Calculations", durationMins: 50, completed: false, contentType: "video" },
      { id: "ee201-l4", title: "Series & Parallel RLC Resonance Sweeps", durationMins: 55, completed: false, contentType: "interactive" },
    ],
    weaknessScore: 45, // Identified as weak point for adaptive suggestions!
  },
  {
    id: "ee-302",
    title: "Power Systems & Electromagnetism",
    subject: "Electrical Engineering",
    code: "EE-302",
    instructor: "Dr. Marcus Sterling",
    description: "Explore electromagnetic field theory, Faraday's and Lenz's laws, ideal and practical transformers, balanced 3-phase systems, and synchronous generators.",
    durationWeeks: 14,
    enrollmentCount: 189,
    lessons: [
      { id: "ee302-l1", title: "Faraday's Law & Magnetic Circuit Fields", durationMins: 60, completed: true, contentType: "video" },
      { id: "ee302-l2", title: "Ideal & Practical Transformers Under Load", durationMins: 75, completed: false, contentType: "interactive" },
      { id: "ee302-l3", title: "Balanced Three-Phase Power Transmission Systems", durationMins: 50, completed: false, contentType: "notes" },
    ],
    weaknessScore: 88,
  }
];

export const MOCK_LABS: LabSimulation[] = [
  {
    id: "lab-circuits",
    title: "Electronics Lab: Ohm's Law & DC Circuit Analysis",
    category: "Electronics",
    difficulty: "Easy",
    description: "Configure a DC circuit with variable power source and resistor. Verify Kirchhoff's laws and Ohm's law (V=IR) through real-time multimeter diagnostics.",
    steps: [
      "Connect power supply to 100 Ohm and 220 Ohm series resistor array.",
      "Set Voltage output to 5V, 10V, and 15V and record current readings.",
      "Identify the linear relationship in the voltage-current output graph.",
      "Input your equivalent resistance estimation and submit report for grading."
    ],
    activeStepIndex: 0,
    terminalOutput: [
      "SYSTEM: DC Circuit simulator loaded.",
      "SYSTEM: Multimeter and DC voltage source online.",
      "SYSTEM: Connect the probes to begin measurement."
    ],
    badgeToEarn: "Circuit Master"
  },
  {
    id: "lab-ac-resonance",
    title: "AC Lab: Series RLC Resonance Sweep",
    category: "Electronics",
    difficulty: "Medium",
    description: "Build an AC-driven series RLC circuit. Vary source frequency from 10Hz to 100kHz to locate the resonant frequency where inductive and capacitive reactances cancel out.",
    steps: [
      "Set Inductor to 10mH, Capacitor to 100nF, and Resistor to 50 Ohms.",
      "Sweep AC frequency and record current amplitude peaks.",
      "Locate maximum current corresponding to minimum impedance (Z = R).",
      "Calculate the Quality Factor (Q) and submit experimental logs."
    ],
    activeStepIndex: 0,
    terminalOutput: [
      "SYSTEM: AC Function Generator and Oscilloscope online.",
      "SYSTEM: Ready for sweep. Click 'Next Step' to set parameters."
    ],
    badgeToEarn: "Resonance Wizard"
  },
  {
    id: "lab-transformers",
    title: "Power Lab: Transformer Efficiency & Magnetics",
    category: "Electronics",
    difficulty: "Hard",
    description: "Analyze core flux and secondary outputs of a step-up/step-down magnetic transformer under varying resistive loads.",
    steps: [
      "Set primary winding turns to 240 and secondary winding turns to 120.",
      "Energize primary with 120V AC RMS and measure secondary open-circuit voltage.",
      "Connect 50 Ohm load to secondary winding and record primary/secondary currents.",
      "Calculate core hysteresis and overall efficiency, then submit for socratic evaluation."
    ],
    activeStepIndex: 0,
    terminalOutput: [
      "SYSTEM: High-voltage magnetic winding test-bench active.",
      "SYSTEM: Core insulation check... OK. Rated at 60Hz."
    ],
    badgeToEarn: "Power Systems Expert"
  }
];

export const MOCK_BADGES: Badge[] = [
  { id: "b1", name: "Circuit Master", description: "Successfully analyzed DC resistor networks and proved Kirchhoff's Current and Voltage Laws.", category: "lab", iconName: "Cpu" },
  { id: "b2", name: "Resonance Wizard", description: "Mastered RLC series resonance sweeps and frequency-dependent impedance calculations.", category: "lab", iconName: "Sparkles" },
  { id: "b3", name: "Power Systems Expert", description: "Designed and analyzed magnetic transformer core behaviors under non-linear stress loading.", category: "lab", iconName: "Cpu" },
  { id: "b4", name: "Socratic Scholar", description: "Completed over 5 deep conversational tutoring chat cycles with AI coach.", category: "streak", iconName: "Lightbulb" },
  { id: "b5", name: "Streak Legend", description: "Maintained a continuous daily learning streak of over 14 days.", category: "streak", iconName: "Target" },
  { id: "b6", name: "Grid Innovator", description: "Formulated a power systems career guidance pathway and matching certificate benchmarks.", category: "career", iconName: "Bookmark" }
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: "p1",
    title: "Struggling to calculate Impedance in parallel AC Circuits - Help!",
    author: "Timothy Drake",
    role: "Student",
    content: "When combining a resistor in parallel with an inductor and a capacitor, do I add their reactance directly or do I need to calculate admittance (Y = 1/Z)? My results for Z total seem way off.",
    upvotes: 24,
    tags: ["Circuits", "EE-201", "AC Impedance"],
    solved: true,
    replies: [
      {
        id: "r1",
        author: "Sarah Jenkins",
        role: "Teacher",
        content: "Great question! Since impedance is complex, adding parallel branches directly is difficult. You should calculate the admittance of each branch: Y_R = 1/R, Y_L = -j/X_L, Y_C = j/X_C. Sum them up: Y_total = Y_R + Y_L + Y_C. Then invert it to get total impedance: Z_total = 1/Y_total.",
        upvotes: 18,
        isAiVerified: true
      },
      {
        id: "r2",
        author: "SmartTutor AI Bot",
        role: "Admin",
        content: "🧠 **AI Summary & Concept Map:** Parallel AC impedance is governed by reciprocal complex arithmetic. Admittance (Y) is the inverse of impedance, measured in Siemens. Conducting parallel addition using G + jB (conductance and susceptance) ensures correct magnitude and phase angles.",
        upvotes: 10,
        isAiVerified: true
      }
    ],
    aiSummary: "The thread clarifies parallel AC impedance calculations. Admittance (Y) simplifies reciprocal addition of parallel components with complex numbers, where total impedance is calculated as the inverse of sum admittance."
  },
  {
    id: "p2",
    title: "Understanding Faraday's Law & Lenz's Law Direction",
    author: "Clara Oswald",
    role: "Student",
    content: "I completed the transformer simulation. I'm still confused by the negative sign in Faraday's equation (emf = -N * dPhi/dt). Why does the magnetic flux change create an opposing voltage? Is this just conservation of energy?",
    upvotes: 15,
    tags: ["Electromagnetics", "EE-302", "Transformers"],
    solved: false,
    replies: [
      {
        id: "r3",
        author: "Prof. Arthur Pendelton",
        role: "Teacher",
        content: "In alternating current, pure resistance (R) stays the same, but capacitors and inductors introduce a frequency-dependent 'reactance'. The combination of resistance and reactance is called 'Impedance' (Z). The equation expands to V = IZ!",
        upvotes: 12
      }
    ]
  }
];

export const MOCK_LEADERBOARD = [
  { name: "Timothy Drake", xp: 4850, streak: 12, level: 14, badgeCount: 5 },
  { name: "Clara Oswald", xp: 4320, streak: 9, level: 12, badgeCount: 4 },
  { name: "James Shadrack (You)", xp: 3950, streak: 7, level: 11, badgeCount: 3 },
  { name: "Sarah Jenkins", xp: 3820, streak: 14, level: 11, badgeCount: 6 },
  { name: "Alex Mercer", xp: 3200, streak: 3, level: 9, badgeCount: 2 },
];
