// SmartTutor AI - LMS Type System

export type UserRole = "Student" | "Teacher" | "Admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution: string;
  department?: string;
  xp: number;
  coins: number;
  streak: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: "lab" | "quiz" | "streak" | "career";
  unlockedAt?: string;
  iconName: string;
}

export interface Course {
  id: string;
  title: string;
  subject: string;
  code: string;
  instructor: string;
  description: string;
  durationWeeks: number;
  enrollmentCount: number;
  lessons: Lesson[];
  weaknessScore?: number; // Calculated dynamically for adaptive learning
}

export interface Lesson {
  id: string;
  title: string;
  durationMins: number;
  completed: boolean;
  contentType: "video" | "notes" | "interactive";
}

export interface LabSimulation {
  id: string;
  title: string;
  category: "Programming" | "Electronics" | "Networking" | "Cyber Security" | "Cloud";
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  steps: string[];
  activeStepIndex: number;
  terminalOutput: string[];
  evaluationText?: string;
  badgeToEarn: string;
  interactiveState?: any;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: "MCQ" | "Short Answer" | "Coding";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
}

export interface SubmissionFeedback {
  score: number;
  passed: boolean;
  feedback: string;
  rubricGrades: {
    accuracy: number;
    reasoning: number;
    structure: number;
    originality: number;
  };
  strengths: string[];
  keyMistakes: string[];
  suggestions: string[];
}

export interface StudyPlanSlot {
  day: string;
  timeSlot: string;
  subject: string;
  topicToStudy: string;
  method: string;
  durationMins: number;
}

export interface CareerPathReport {
  targetRole: string;
  fitJustification: string;
  certifiedMilestones: string[];
  universityRecommendations: string[];
  jobDemandSalary: string;
  actionableNextSteps: string[];
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  role: UserRole;
  content: string;
  upvotes: number;
  replies: ForumReply[];
  solved: boolean;
  tags: string[];
  aiSummary?: string;
}

export interface ForumReply {
  id: string;
  author: string;
  role: UserRole;
  content: string;
  upvotes: number;
  isAiVerified?: boolean;
}
