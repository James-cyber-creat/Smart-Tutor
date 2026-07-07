import { Course, LabSimulation, Badge, ForumPost } from "./types";

export const MOCK_COURSES: Course[] = [
  {
    id: "cs-201",
    title: "Data Structures & Algorithms",
    subject: "Computer Science",
    code: "CS-201",
    instructor: "Dr. Catherine Vance",
    description: "Master recursion, trees, graphs, sorting, and dynamic programming with interactive code environments and AI visualizers.",
    durationWeeks: 12,
    enrollmentCount: 342,
    lessons: [
      { id: "cs-l1", title: "Introduction to Time Complexity & Big O", durationMins: 45, completed: true, contentType: "notes" },
      { id: "cs-l2", title: "Understanding Recursion & Stack Frames", durationMins: 60, completed: false, contentType: "interactive" },
      { id: "cs-l3", title: "Singly & Doubly Linked Lists", durationMins: 50, completed: true, contentType: "video" },
      { id: "cs-l4", title: "Binary Trees and Inorder Traversal", durationMins: 55, completed: false, contentType: "interactive" },
    ],
    weaknessScore: 68, // Low score means they need help here (identified by AI)
  },
  {
    id: "ee-102",
    title: "Introduction to Electronics & Circuits",
    subject: "Electrical Engineering",
    code: "EE-102",
    instructor: "Prof. Arthur Pendelton",
    description: "Understand currents, Ohm's law, diode properties, and microcontroller integration with simulated laboratory setups.",
    durationWeeks: 10,
    enrollmentCount: 215,
    lessons: [
      { id: "ee-l1", title: "Voltage, Current, and Resistance Principles", durationMins: 40, completed: true, contentType: "notes" },
      { id: "ee-l2", title: "Ohm's Law & Series-Parallel Circuits", durationMins: 65, completed: false, contentType: "interactive" },
      { id: "ee-l3", title: "Capacitors & RC Time Constants", durationMins: 50, completed: false, contentType: "video" },
    ],
    weaknessScore: 88, // Doing okay
  },
  {
    id: "cs-403",
    title: "Network Routing & Cyber Security",
    subject: "Information Technology",
    code: "CS-403",
    instructor: "Dr. Marcus Sterling",
    description: "Dive into network topology design, packet routing algorithms, firewalls, and port-level penetration testing simulations.",
    durationWeeks: 14,
    enrollmentCount: 189,
    lessons: [
      { id: "net-l1", title: "IP Addressing & Subnetting Basics", durationMins: 60, completed: true, contentType: "video" },
      { id: "net-l2", title: "Static vs Dynamic Routing Protocols", durationMins: 75, completed: false, contentType: "interactive" },
      { id: "net-l3", title: "VLANs & Access Control Lists (ACL)", durationMins: 50, completed: false, contentType: "notes" },
    ],
    weaknessScore: 45, // Major weakness! Dynamic suggestions will recommend routing labs.
  }
];

export const MOCK_LABS: LabSimulation[] = [
  {
    id: "lab-recursion",
    title: "Programming Lab: Recursion & Stack Frames",
    category: "Programming",
    difficulty: "Medium",
    description: "Visualize how recursive function calls consume stack memory. Complete the Fibonacci function, analyze stack overflows, and answer Socratic evaluation queries.",
    steps: [
      "Initialize recursion tracing parameters.",
      "Modify the helper function to set base cases of fib(0) and fib(1).",
      "Call fib(4) and witness the stack frames building dynamically on screen.",
      "Submit your final call tracing report for AI evaluation and badge award."
    ],
    activeStepIndex: 0,
    terminalOutput: [
      "SYSTEM: Recursion Lab virtual compiler initialized.",
      "SYSTEM: Ready for step 1. Click 'Next Step' to begin."
    ],
    badgeToEarn: "Recursion Master"
  },
  {
    id: "lab-circuits",
    title: "Electronics Lab: Ohm's Law & Circuit Analysis",
    category: "Electronics",
    difficulty: "Easy",
    description: "Configure a DC circuit with variable power source and resister. Record measurements, analyze current behavior, and prove Ohm's Law (V=IR) to the virtual lab coach.",
    steps: [
      "Connect power supply to 100 Ohm resistor.",
      "Set Voltage output to 5V, 10V, and 15V and record current readings.",
      "Identify the linear relationship in the output graph.",
      "Input your resistance estimation and submit report for grading."
    ],
    activeStepIndex: 0,
    terminalOutput: [
      "SYSTEM: Circuit simulator loaded.",
      "SYSTEM: Multimeter and DC source online."
    ],
    badgeToEarn: "Circuit Wizard"
  },
  {
    id: "lab-networking",
    title: "Networking Lab: Static IP & Route Configurator",
    category: "Networking",
    difficulty: "Hard",
    description: "Set up gateway routes and DNS IP tables for a local subnet system. Troubleshoot ping drops and repair packet routing collisions.",
    steps: [
      "Assign IP address 192.168.1.1 to Gateway Router.",
      "Set up dynamic routing table for VLAN-10 and VLAN-20.",
      "Identify the faulty routing gate causing packet loop packet drop.",
      "Submit routing log for automated routing evaluation."
    ],
    activeStepIndex: 0,
    terminalOutput: [
      "SYSTEM: Suburban Switch and router terminal ready.",
      "SYSTEM: DHCP lease loaded."
    ],
    badgeToEarn: "Network Engineer"
  }
];

export const MOCK_BADGES: Badge[] = [
  { id: "b1", name: "Recursion Master", description: "Successfully traced and solved recursive stack operations without causing stack overflow.", category: "lab", iconName: "Cpu" },
  { id: "b2", name: "Circuit Wizard", description: "Completed circuit analysis and proved Ohm's Law under simulated conditions.", category: "lab", iconName: "Sparkles" },
  { id: "b3", name: "Network Engineer", description: "Diagnosed a packet loop issue and configured static gateways perfectly.", category: "lab", iconName: "Cpu" },
  { id: "b4", name: "Socratic Scholar", description: "Completed over 5 deep conversational tutoring chat cycles with AI coach.", category: "streak", iconName: "Lightbulb" },
  { id: "b5", name: "Streak Legend", description: "Maintained a continuous daily learning streak of over 14 days.", category: "streak", iconName: "Target" },
  { id: "b6", name: "Industry Explorer", description: "Formulated a career guidance pathway and matching certificate benchmarks.", category: "career", iconName: "Bookmark" }
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: "p1",
    title: "Struggling to visualize recursion call trees - Help!",
    author: "Timothy Drake",
    role: "Student",
    content: "When analyzing fibonacci recursion, my mind gets lost in how the child frames return back up. Does the left branch complete entirely before the right branch starts, or does it happen simultaneously?",
    upvotes: 24,
    tags: ["Programming", "CS-201", "Recursion"],
    solved: true,
    replies: [
      {
        id: "r1",
        author: "Sarah Jenkins",
        role: "Teacher",
        content: "Great question! In standard single-threaded execution (like Python, C, or Javascript), the left recursive call `fib(n-1)` completes *entirely* first because it is pushed onto the call stack before `fib(n-2)`. Once it returns a concrete value, then the right branch begins.",
        upvotes: 18,
        isAiVerified: true
      },
      {
        id: "r2",
        author: "SmartTutor AI Bot",
        role: "Admin",
        content: "🧠 **AI Summary & Concept Map:** Recursion is synchronous. The runtime stack acts as a LIFO (Last-In, First-Out) structure. The left execution branch represents deep traversal, while the right branch represents breadth evaluation at each height increment.",
        upvotes: 10,
        isAiVerified: true
      }
    ],
    aiSummary: "The thread clarifies recursion call stack mechanics. It is established that execution is strictly sequential, evaluating left child branches fully before right branches are initiated under single-threaded runtime specifications."
  },
  {
    id: "p2",
    title: "How does Ohm's Law change in AC circuits?",
    author: "Clara Oswald",
    role: "Student",
    content: "I finished the DC lab circuit analysis. But I am curious: do resistors, inductors, and capacitors all behave identically under alternating current? What happens to the formula V = IR?",
    upvotes: 15,
    tags: ["Electronics", "EE-102", "AC Circuits"],
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
