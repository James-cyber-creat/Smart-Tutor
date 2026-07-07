import React, { useState, useEffect } from "react";
import { 
  BookOpen, Cpu, Sparkles, TrendingUp, Award, Compass, Calendar, 
  MessageSquare, Send, Terminal, ArrowRight, ChevronRight, Play, 
  CheckCircle2, AlertCircle, ThumbsUp, Plus, X, Lock, FileText, 
  Volume2, Mic, Download, RefreshCw, UserCheck
} from "lucide-react";
import { Course, LabSimulation, Badge, ForumPost, StudyPlanSlot, CareerPathReport } from "../types";
import { MOCK_COURSES, MOCK_LABS, MOCK_BADGES, MOCK_FORUM_POSTS, MOCK_LEADERBOARD } from "../data";

interface StudentDashboardProps {
  onAddXp: (amount: number) => void;
  onAddCoins: (amount: number) => void;
  streak: number;
  xp: number;
  coins: number;
  unlockedBadges: string[];
  onUnlockBadge: (badgeId: string) => void;
  isAccessibilityMode: boolean;
  accessibilitySettings: {
    textToSpeech: boolean;
    highContrast: boolean;
    screenReader: boolean;
  };
}

export default function StudentDashboard({
  onAddXp,
  onAddCoins,
  streak,
  xp,
  coins,
  unlockedBadges,
  onUnlockBadge,
  isAccessibilityMode,
  accessibilitySettings
}: StudentDashboardProps) {
  // Navigation & Sub-Tabs
  const [activeTab, setActiveTab] = useState<"overview" | "tutor" | "labs" | "assessments" | "planner" | "career" | "forum" | "live">("overview");

  // Courses and Adaptive recommendations
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(MOCK_COURSES[0]);
  const [adaptiveHighlight, setAdaptiveHighlight] = useState(true);

  // Chat Socratic Tutor State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{role: "user"|"assistant", text: string, files?: string[]}>>([
    { role: "assistant", text: "👋 Hello James! I am your SmartTutor Socratic Mentor. Ready to learn? Ask me to explain a concept, quiz your memory, or let's inspect the uploaded files." }
  ]);
  const [chatChips, setChatChips] = useState(["Explain Recursion", "Quiz me on Net Routing", "What is Ohm's Law?"]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [voiceInputSim, setVoiceInputSim] = useState(false);
  const [ttsActiveId, setTtsActiveId] = useState<number | null>(null);

  // Document Upload Mockup
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string, size: string, type: string}>>([
    { name: "Syllabus-DataStructures-CS201.pdf", size: "1.2 MB", type: "PDF" }
  ]);
  const [dragActive, setDragActive] = useState(false);

  // Virtual Practical Labs State
  const [labs, setLabs] = useState<LabSimulation[]>(MOCK_LABS);
  const [activeLab, setActiveLab] = useState<LabSimulation>(MOCK_LABS[0]);
  const [labReport, setLabReport] = useState("");
  const [isLabEvaluating, setIsLabEvaluating] = useState(false);
  const [labGraderResult, setLabGraderResult] = useState<any | null>(null);

  // Continuous Assessment State
  const [quizTopic, setQuizTopic] = useState("Recursion and Trees");
  const [quizDiff, setQuizDiff] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [quizType, setQuizType] = useState<"MCQ" | "Short Answer" | "Coding">("MCQ");
  const [isQuizGenerating, setIsQuizGenerating] = useState(false);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizFeedback, setQuizFeedback] = useState<any | null>(null);
  const [customEssayInput, setCustomEssayInput] = useState("");
  const [customEssayQuestion, setCustomEssayQuestion] = useState("Analyze the trade-offs between static and dynamic routing protocols in a core enterprise ISP.");

  // Study Planner State
  const [weakSubjects, setWeakSubjects] = useState<string[]>(["Network Routing", "Big O Complexity"]);
  const [plannerHours, setPlannerHours] = useState(12);
  const [plannerGoal, setPlannerGoal] = useState("University Midterm Exams");
  const [generatedPlan, setGeneratedPlan] = useState<{summary: string, weeklyMilestone: string, timetable: StudyPlanSlot[], diagnosticTips: string[]} | null>(null);
  const [isPlannerLoading, setIsPlannerLoading] = useState(false);

  // Career Guidance State
  const [careerSkills, setCareerSkills] = useState<string[]>(["Python", "Basic Circuit Prototyping", "Subnet Design"]);
  const [careerInterests, setCareerInterests] = useState<string[]>(["Cyber Security Analyst", "Embedded Software Engineer", "Product Manager"]);
  const [careerReport, setCareerReport] = useState<CareerPathReport | null>(null);
  const [isCareerLoading, setIsCareerLoading] = useState(false);

  // Forum State
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTag, setNewPostTag] = useState("Programming");
  const [activePostId, setActivePostId] = useState<string | null>("p1");
  const [replyInput, setReplyInput] = useState("");

  // Live Class State
  const [liveChatMessages, setLiveChatMessages] = useState<Array<{author: string, text: string}>>([
    { author: "Dr. Catherine", text: "Welcome everyone! Feel free to sketch on the whiteboard if you want to trace the fib(3) recursive path." },
    { author: "Clara Oswald", text: "Is the base case always reached first in depth-first order?" }
  ]);
  const [liveChatInput, setLiveChatInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [whiteboardLines, setWhiteboardLines] = useState<Array<{x: number, y: number, color: string}>>([
    { x: 100, y: 150, color: "#3b82f6" },
    { x: 150, y: 220, color: "#3b82f6" },
    { x: 200, y: 150, color: "#ef4444" }
  ]);

  // Audio Text to Speech synthesis simulator
  const handleTts = (text: string, id: number) => {
    if (window.speechSynthesis) {
      if (ttsActiveId === id) {
        window.speechSynthesis.cancel();
        setTtsActiveId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#`_-]/g, ""));
      utterance.onend = () => setTtsActiveId(null);
      setTtsActiveId(id);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech is simulated! (Your browser doesn't fully support physical Synthesis in this frame, but Speech Mode is active)");
    }
  };

  // Drag and Drop simulation for file uploads
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const newFile = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        type: file.name.split('.').pop()?.toUpperCase() || "PDF"
      };
      setUploadedFiles([...uploadedFiles, newFile]);
      // Trigger Socratic reaction to file
      setChatMessages(prev => [
        ...prev,
        { role: "assistant", text: `📁 **Document Detected:** I have successfully indexed **${newFile.name}** using semantic vectors. Ask me any question regarding its topics, syllabus, or recommended test exercises.` }
      ]);
    }
  };

  const simulateFileUpload = () => {
    const names = ["Recursion_Handout.pdf", "Ohm_Experimental_Data.xlsx", "CS403_Subnetting_Practice.docx"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const newFile = {
      name: randomName,
      size: "1.4 MB",
      type: randomName.split('.').pop()?.toUpperCase() || "PDF"
    };
    setUploadedFiles([...uploadedFiles, newFile]);
    setChatMessages(prev => [
      ...prev,
      { role: "assistant", text: `📁 **Document Uploaded:** Indexed **${newFile.name}**. You can now request: "Explain the main thesis of this document" or "Quiz me based on this file".` }
    ]);
  };

  // AI Tutor Chat Request to Backend
  const handleSendTutorChat = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    const userMsg = textToSend;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsChatLoading(true);

    try {
      const formattedHistory = chatMessages.map(m => ({
        role: m.role,
        content: m.text
      }));

      const response = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: formattedHistory,
          studentProfile: { xp, streak, coins }
        })
      });

      if (!response.ok) {
        throw new Error("Tutor Service failed to respond.");
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: "assistant", text: data.text }]);
      if (data.suggestedPrompts) {
        setChatChips(data.suggestedPrompts);
      }
      onAddXp(15);
    } catch (err: any) {
      console.error(err);
      // Fallback elegant responses for offline / empty keys
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { 
            role: "assistant", 
            text: `🧠 **Socratic Helper (Fallback Mode):** That's an interesting inquiry! Let's approach this analytically. If you look at the fundamental principles of **${userMsg}**, what do you think is the critical bottleneck? 
\n\n*Note: To enable active server-side AI reasoning, please configure your \`GEMINI_API_KEY\` in Settings > Secrets.*` 
          }
        ]);
        setChatChips(["Help me understand", "Give me a step-by-step example", "How is this evaluated?"]);
      }, 1000);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Virtual Practical Lab Steps Progression
  const handleNextLabStep = () => {
    if (activeLab.activeStepIndex < activeLab.steps.length - 1) {
      const updatedIndex = activeLab.activeStepIndex + 1;
      const progressOutput = [
        ...activeLab.terminalOutput,
        `> USER INPUT: Proceeded to Step ${updatedIndex + 1}`,
        `SYSTEM: Verifying hardware metrics... OK.`,
        `SYSTEM: Guide instruction: "${activeLab.steps[updatedIndex]}"`
      ];
      const updatedLab = { ...activeLab, activeStepIndex: updatedIndex, terminalOutput: progressOutput };
      setActiveLab(updatedLab);
      setLabs(labs.map(l => l.id === activeLab.id ? updatedLab : l));
      onAddXp(20);
    }
  };

  const handleResetLab = () => {
    const updatedLab = {
      ...activeLab,
      activeStepIndex: 0,
      terminalOutput: [
        `SYSTEM: Simulator ${activeLab.title} restarted.`,
        "SYSTEM: Ready for step 1. Input parameters and proceed."
      ],
      evaluationText: undefined
    };
    setActiveLab(updatedLab);
    setLabs(labs.map(l => l.id === activeLab.id ? updatedLab : l));
    setLabGraderResult(null);
  };

  // Submit lab report for real AI evaluation
  const handleSubmitLabReport = async () => {
    if (!labReport.trim()) return;
    setIsLabEvaluating(true);
    setLabGraderResult(null);

    try {
      const response = await fetch("/api/evaluate-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Virtual Lab Completion Report: ${activeLab.title}`,
          studentAnswer: labReport,
          questionType: "Practical",
          context: `Target Badges to Award: ${activeLab.badgeToEarn}. Steps traced: ${activeLab.steps.join(", ")}`
        })
      });

      if (!response.ok) throw new Error("Grading service unavailable");

      const data = await response.json();
      setLabGraderResult(data);
      if (data.passed) {
        onUnlockBadge(activeLab.badgeToEarn);
        onAddXp(150);
        onAddCoins(50);
      }
    } catch (err) {
      // Mock grading response in case of API offline
      setTimeout(() => {
        const dummyResult = {
          score: 88,
          passed: true,
          feedback: `Great job completing the ${activeLab.title}! Your write-up correctly demonstrates Ohm's linear principles/recursive tracing constraints. Your methodology is sound.`,
          rubricGrades: { accuracy: 9, reasoning: 8, structure: 8, originality: 10 },
          strengths: ["Clear documentation of observed data points", "Exceptional structure and logical transitions"],
          keyMistakes: ["Minor math precision discrepancy in calculation margins"],
          suggestions: ["Refine mathematical assertions to four decimal places", "Integrate secondary circuit impedance comparisons"]
        };
        setLabGraderResult(dummyResult);
        onUnlockBadge(activeLab.badgeToEarn);
        onAddXp(120);
        onAddCoins(35);
      }, 1500);
    } finally {
      setIsLabEvaluating(false);
    }
  };

  // Continuous Assessment - AI Question Generator Request
  const handleGenerateQuiz = async () => {
    setIsQuizGenerating(true);
    setQuizFeedback(null);
    setQuizAnswers({});

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: quizTopic,
          difficulty: quizDiff,
          questionType: quizType,
          count: 3
        })
      });

      if (!response.ok) throw new Error("Quiz API failed");
      const data = await response.json();
      setActiveQuizQuestions(data.questions || []);
    } catch (err) {
      // Fallback quiz database for robust local operations
      setTimeout(() => {
        const localQuestions = [
          {
            id: "q_local_1",
            question: "Which of the following data structures operates on a Last-In, First-Out (LIFO) model, directly matching function recursion stack frames?",
            type: "MCQ",
            options: ["Queue", "Binary Search Tree", "Stack", "Min-Heap"],
            correctAnswer: "2",
            explanation: "The runtime memory stack tracks function calls by pushing active scopes onto the stack and popping them when base criteria is reached (LIFO).",
            hint: "Think about stacking plates in a cafeteria: the last plate placed is the first one removed."
          },
          {
            id: "q_local_2",
            question: "Under Ohm's Law (V = IR), if you maintain a constant Voltage across a resistor and double the Resistance value, what happens to the electric Current?",
            type: "MCQ",
            options: ["The current doubles", "The current is halved", "The current quadruples", "The current remains identical"],
            correctAnswer: "1",
            explanation: "Current is inversely proportional to resistance (I = V/R). Doubling R halves the Current (I).",
            hint: "More resistance restricts flow, allowing less current to pass."
          },
          {
            id: "q_local_3",
            question: "In standard classful IP subnetting, how many usable host addresses are available inside a /24 network prefix?",
            type: "MCQ",
            options: ["256", "254", "512", "128"],
            correctAnswer: "1",
            explanation: "A /24 subnet has 256 addresses, but 2 are reserved (subnet network IP and the broadcast IP), leaving exactly 254 usable host addresses.",
            hint: "Subtract the net identity address and the broadcast address from 2^8."
          }
        ];
        setActiveQuizQuestions(localQuestions);
      }, 1200);
    } finally {
      setIsQuizGenerating(false);
    }
  };

  // Submit quiz answers for marking
  const handleQuizSubmit = async () => {
    // Generate detailed feedback score
    let correctCount = 0;
    activeQuizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / activeQuizQuestions.length) * 100);
    const passed = finalScore >= 60;

    const summaryFeedback = `You correctly answered ${correctCount} out of ${activeQuizQuestions.length} questions on ${quizTopic}. ${
      passed ? "Excellent job, you are demonstrating strong mastery of these concepts!" : "We suggest scheduling an AI Study Planner slot to review this topic."
    }`;

    setQuizFeedback({
      score: finalScore,
      passed,
      feedback: summaryFeedback,
      correctCount,
      totalCount: activeQuizQuestions.length
    });

    if (passed) {
      onAddXp(100);
      onAddCoins(25);
    } else {
      onAddXp(30);
    }
  };

  // Submit custom essay / programming file content for granular grading rubrics
  const handleEvaluateCustomEssay = async () => {
    if (!customEssayInput.trim()) return;
    setIsLabEvaluating(true);
    setQuizFeedback(null);

    try {
      const response = await fetch("/api/evaluate-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: customEssayQuestion,
          studentAnswer: customEssayInput,
          questionType: "Essay",
          context: "Academic continuous grading. Generate comprehensive marks out of 100 with full rubric breakdowns."
        })
      });

      if (!response.ok) throw new Error("Grading failed");
      const data = await response.json();
      setQuizFeedback({
        ...data,
        isEssayGrading: true
      });
      onAddXp(150);
      onAddCoins(30);
    } catch (err) {
      setTimeout(() => {
        setQuizFeedback({
          score: 84,
          passed: true,
          feedback: "Robust, well-reasoned argumentative essay submission. Your understanding of ISP gateways and packet routing metrics is solid.",
          rubricGrades: { accuracy: 9, reasoning: 8, structure: 8, originality: 9 },
          strengths: ["Excellent breakdown of interior gateway protocols vs exterior routing gates", "Realistic subnet scenario parameters"],
          keyMistakes: ["Omitted specific references to packet-over-SONET routing latencies"],
          suggestions: ["Integrate concrete latency comparisons of BGP route flapping", "Include autonomous system boundaries routing tables"],
          isEssayGrading: true
        });
        onAddXp(120);
        onAddCoins(20);
      }, 1500);
    } finally {
      setIsLabEvaluating(false);
    }
  };

  // Generate Personalized AI Study Planner Timetable
  const handleGenerateStudyPlan = async () => {
    setIsPlannerLoading(true);
    try {
      const response = await fetch("/api/generate-study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weakSubjects,
          targetHours: plannerHours,
          examGoal: plannerGoal
        })
      });

      if (!response.ok) throw new Error("Planner failed");
      const data = await response.json();
      setGeneratedPlan(data);
      onAddXp(60);
    } catch (err) {
      setTimeout(() => {
        setGeneratedPlan({
          summary: "This personalized plan focuses on high-yield active recall and virtual lab iterations to secure critical gaps in dynamic subnetting and recursive binary trees.",
          weeklyMilestone: "Achieve recursive Fibonacci simulation mastery and trace a /22 CIDR network routing map.",
          timetable: [
            { day: "Monday", timeSlot: "04:00 PM - 05:30 PM", subject: "Network Protocols (CS-403)", topicToStudy: "Subnet Mask Boundaries & Gateways", method: "Virtual Practical Lab", durationMins: 90 },
            { day: "Wednesday", timeSlot: "03:00 PM - 04:30 PM", subject: "Data Structures (CS-201)", topicToStudy: "Base Case Recursion & Memory Frames", method: "Socratic Chat", durationMins: 90 },
            { day: "Friday", timeSlot: "05:00 PM - 06:00 PM", subject: "Network Protocols (CS-403)", topicToStudy: "Dynamic BGP & Loop Routing", method: "Continuous Quiz", durationMins: 60 },
            { day: "Saturday", timeSlot: "10:00 AM - 11:30 AM", subject: "Electronics Circuits (EE-102)", topicToStudy: "Impedance and AC Currents", method: "Virtual Practical Lab", durationMins: 90 }
          ],
          diagnosticTips: [
            "Leverage active recall: explain recursion trees aloud to our Socratic Tutor.",
            "Complete physical simulation iterations twice: once with tutorial notes, once blind.",
            "Take a 5-minute cognitive rest break for every 25 minutes of intense focus."
          ]
        });
        onAddXp(50);
      }, 1500);
    } finally {
      setIsPlannerLoading(false);
    }
  };

  // Generate AI Career Advice Report
  const handleGenerateCareerReport = async () => {
    setIsCareerLoading(true);
    try {
      const response = await fetch("/api/career-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: careerSkills,
          interests: careerInterests,
          performanceMetrics: { xp, streak, badgesUnlocked: unlockedBadges.length }
        })
      });

      if (!response.ok) throw new Error("Career API failed");
      const data = await response.json();
      setCareerReport(data);
      onAddXp(80);
    } catch (err) {
      setTimeout(() => {
        setCareerReport({
          targetRole: "Cloud Infrastructure Specialist & Embedded Developer",
          fitJustification: "Your strong performance across networking algorithms (CS-403) coupled with basic circuit prototyping makes you a perfect cross-functional candidate for Edge-Computing and IoT cloud architecture networks.",
          certifiedMilestones: [
            "AWS Certified SysOps Administrator - Associate",
            "Cisco Certified Network Associate (CCNA 200-301)",
            "Embedded Systems Professional Certification (Arm)"
          ],
          universityRecommendations: [
            "Carnegie Mellon University - M.S. in Embedded Software Engineering",
            "Stanford University - Advanced Cybersecurity Certificate Program",
            "ETH Zurich - Distributed Systems & Cloud Infrastructure Division"
          ],
          jobDemandSalary: "Extremely high market demand (+18% YoY growth). Median starting salary ranges between $115,000 - $142,000 per annum.",
          actionableNextSteps: [
            "Complete the Network Gateway Static IP Virtual Lab in SmartTutor AI.",
            "Incorporate a public Github repo displaying a recursive parser project.",
            "Begin Cisco CCNA curriculum preparation via automated AI Question generators."
          ]
        });
        onAddXp(70);
      }, 1500);
    } finally {
      setIsCareerLoading(false);
    }
  };

  // Submit community forum reply
  const handleAddForumReply = (postId: string) => {
    if (!replyInput.trim()) return;
    const newReply = {
      id: `r_${Date.now()}`,
      author: "James Shadrack (You)",
      role: "Student" as const,
      content: replyInput,
      upvotes: 0
    };

    setForumPosts(forumPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, newReply]
        };
      }
      return post;
    }));
    setReplyInput("");
    onAddXp(15);
  };

  // Submit new forum post
  const handleCreateForumPost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    const newPost: ForumPost = {
      id: `p_${Date.now()}`,
      title: newPostTitle,
      author: "James Shadrack (You)",
      role: "Student",
      content: newPostContent,
      upvotes: 0,
      tags: [newPostTag],
      solved: false,
      replies: []
    };
    setForumPosts([newPost, ...forumPosts]);
    setActivePostId(newPost.id);
    setNewPostTitle("");
    setNewPostContent("");
    onAddXp(30);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT SIDEBAR: Navigations */}
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-100 shadow-sm space-y-1">
          <p className="px-3 text-[10px] font-semibold text-slate-400 tracking-wider uppercase mb-2">Student Navigation</p>
          <button 
            onClick={() => setActiveTab("overview")} 
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${
              activeTab === "overview" ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <TrendingUp className="w-4.5 h-4.5" /> Learning Overview
            </span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <button 
            onClick={() => setActiveTab("tutor")} 
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${
              activeTab === "tutor" ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MessageSquare className="w-4.5 h-4.5 text-rose-500" /> Socratic AI Tutor
            </span>
            <span className="bg-rose-100 text-rose-600 text-[9px] font-bold px-1.5 py-0.5 rounded">24/7 AI</span>
          </button>

          <button 
            onClick={() => setActiveTab("labs")} 
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${
              activeTab === "labs" ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Cpu className="w-4.5 h-4.5 text-cyan-500" /> Virtual Practical Labs
            </span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <button 
            onClick={() => setActiveTab("assessments")} 
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${
              activeTab === "assessments" ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Award className="w-4.5 h-4.5 text-amber-500" /> Continuous Assessment
            </span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <button 
            onClick={() => setActiveTab("planner")} 
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${
              activeTab === "planner" ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Calendar className="w-4.5 h-4.5 text-emerald-500" /> AI Study Planner
            </span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <button 
            onClick={() => setActiveTab("career")} 
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${
              activeTab === "career" ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Compass className="w-4.5 h-4.5 text-violet-500" /> Career Advisory
            </span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <button 
            onClick={() => setActiveTab("forum")} 
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${
              activeTab === "forum" ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <BookOpen className="w-4.5 h-4.5 text-blue-500" /> Discussion Forum
            </span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <button 
            onClick={() => setActiveTab("live")} 
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${
              activeTab === "live" ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Play className="w-4.5 h-4.5 text-orange-500" /> Live Classes
            </span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </button>
        </div>

        {/* Dynamic Streak Card */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-15px] opacity-10">
            <Sparkles className="w-28 h-28" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-100">Learning Streak</p>
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">🔥 {streak} Days</span>
          </div>
          <h4 className="text-2xl font-bold mt-2">Active Streak</h4>
          <p className="text-xs text-amber-500/10 mt-1">Study 10 mins today to lock in your daily streak bonus!</p>
          <div className="grid grid-cols-7 gap-1.5 mt-4">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[9px] text-amber-100 font-medium">{d}</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < 5 ? "bg-white text-orange-600" : "bg-orange-700/40 text-amber-200"
                }`}>
                  ✓
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard widget */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Classroom Leaderboard</p>
          <div className="space-y-2">
            {MOCK_LEADERBOARD.map((user, idx) => (
              <div key={idx} className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                user.name.includes("You") ? "bg-indigo-50 border border-indigo-100" : ""
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 w-4">{idx + 1}</span>
                  <span className={`font-semibold ${user.name.includes("You") ? "text-indigo-700" : "text-slate-700"}`}>
                    {user.name}
                  </span>
                </div>
                <span className="font-mono text-slate-500">{user.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT MAIN VIEW */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* TAB 1: OVERVIEW & COURSES */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* ADAPTIVE RECOMMENDATIONS ALERTS */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute right-4 top-4 text-indigo-400 animate-spin" style={{ animationDuration: "12s" }}>
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex gap-3">
                <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600 h-fit mt-0.5">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">SmartTutor AI Adaptive Engine Insights</span>
                  <h4 className="text-base font-bold text-slate-800">Your Diagnostic Learning Analytics Report</h4>
                  <p className="text-sm text-slate-600 max-w-2xl">
                    We noticed you completed the introductory subnetting lessons, but your diagnostic routing simulations have a 45% completion loop error rate.
                  </p>
                  <div className="flex items-center gap-3 mt-3.5">
                    <button 
                      onClick={() => { setActiveTab("labs"); setActiveLab(labs[2]); }}
                      className="bg-indigo-600 text-white text-xs font-semibold py-1.5 px-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Terminal className="w-3.5 h-3.5" /> Solve Network Router Lab
                    </button>
                    <button 
                      onClick={() => setActiveTab("planner")}
                      className="text-indigo-600 text-xs font-semibold hover:underline"
                    >
                      Schedule Study Slot
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ENROLLED COURSES SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Your Active Enrolled Courses</h3>
                  <p className="text-xs text-slate-500">Continuous tracking and socratic study pathways</p>
                </div>
                <button 
                  onClick={() => setAdaptiveHighlight(!adaptiveHighlight)}
                  className={`text-xs font-semibold py-1.5 px-3 rounded-lg border transition-all flex items-center gap-1.5 ${
                    adaptiveHighlight ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> {adaptiveHighlight ? "AI Diagnostics Enabled" : "Show All Standard"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courses.map(course => {
                  const progressPct = course.lessons.filter(l => l.completed).length / course.lessons.length * 100;
                  const isWeak = course.weaknessScore && course.weaknessScore < 70;
                  return (
                    <div 
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative ${
                        selectedCourse?.id === course.id 
                          ? "bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500/20" 
                          : "bg-white border-slate-100 hover:border-slate-300 shadow-sm"
                      } ${adaptiveHighlight && isWeak ? "ring-2 ring-rose-500/20 bg-rose-50/10" : ""}`}
                    >
                      {adaptiveHighlight && isWeak && (
                        <div className="absolute right-3 top-3 flex items-center gap-1 bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          <AlertCircle className="w-2.5 h-2.5" /> High Risk
                        </div>
                      )}

                      <span className="text-[10px] font-bold font-mono uppercase text-slate-400 tracking-wider">
                        {course.code} • {course.subject}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-1 group-hover:text-indigo-600 transition">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Syllabus Completed</span>
                          <span className="font-bold">{Math.round(progressPct)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${isWeak ? "bg-rose-500" : "bg-indigo-600"}`} 
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SELECTED COURSE SYLLABUS LISTING */}
            {selectedCourse && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start border-b border-slate-50 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600">{selectedCourse.code}</span>
                    <h3 className="text-base font-bold text-slate-800">{selectedCourse.title}</h3>
                    <p className="text-xs text-slate-500">Instructor: {selectedCourse.instructor} • {selectedCourse.durationWeeks} Weeks</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">
                      {selectedCourse.enrollmentCount} Active Learners
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject Lesson Timeline & AI Triggers</h4>
                  {selectedCourse.lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/30 text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold ${
                          lesson.completed ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700">{lesson.title}</p>
                          <span className="text-[10px] text-slate-400 capitalize">{lesson.contentType} • {lesson.durationMins} Mins</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.completed ? (
                          <span className="flex items-center gap-1 text-indigo-600 font-medium text-[10px] bg-indigo-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        ) : (
                          <button 
                            onClick={() => {
                              if (lesson.title.toLowerCase().includes("recursion")) {
                                setActiveTab("labs");
                                setActiveLab(labs[0]);
                              } else if (lesson.title.toLowerCase().includes("ohm")) {
                                setActiveTab("labs");
                                setActiveLab(labs[1]);
                              } else {
                                setActiveTab("tutor");
                                handleSendTutorChat(`Teach me about ${lesson.title}`);
                              }
                            }}
                            className="bg-indigo-600 text-white font-bold py-1 px-2.5 rounded hover:bg-indigo-700 transition"
                          >
                            Launch Lesson
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EARNED ACHIEVEMENTS & GAMIFICATION METER */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Your Gamified Badge Board</h3>
                  <p className="text-xs text-slate-500">Demonstrate mastery to unlock badges and coins</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-700">{xp} XP</span>
                    <span className="block text-[10px] text-indigo-600">Level {Math.floor(xp / 400) + 1} Scholar</span>
                  </div>
                  <div className="text-right border-l pl-3">
                    <span className="block text-xs font-bold text-amber-500">🪙 {coins} Coins</span>
                    <span className="block text-[9px] text-slate-400">Shop rewards active</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {MOCK_BADGES.map(badge => {
                  const isUnlocked = unlockedBadges.includes(badge.name);
                  return (
                    <div 
                      key={badge.id}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center justify-between h-32 transition ${
                        isUnlocked 
                          ? "bg-indigo-50/40 border-indigo-200 shadow-sm" 
                          : "bg-slate-50/20 border-slate-100 opacity-40"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isUnlocked ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-400"}`}>
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700 truncate w-full">{badge.name}</p>
                        <p className="text-[8px] text-slate-400 line-clamp-2 leading-normal">{badge.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SOCRATIC TUTOR CHAT */}
        {activeTab === "tutor" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[640px]">
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    Socratic AI Mentor <span className="bg-rose-100 text-rose-600 text-[8px] font-black uppercase px-1 rounded">PRO</span>
                  </h4>
                  <p className="text-xs text-slate-500">Guided critical questioning logic engine</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleTts(chatMessages[chatMessages.length-1]?.text || "", 99)}
                  className={`p-2 rounded-lg border transition ${
                    ttsActiveId === 99 ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                  title="Toggle Read Aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setVoiceInputSim(!voiceInputSim)}
                  className={`p-2 rounded-lg border transition ${
                    voiceInputSim ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse" : "bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                  title="Toggle Voice Input Simulation"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body & File Uploading Side panel */}
            <div className="flex-1 flex overflow-hidden">
              {/* Document/File upload section on the left */}
              <div className="w-64 border-r border-slate-100 bg-slate-50/50 p-4 flex flex-col justify-between hidden md:flex">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Semantic File Vault</p>
                  
                  {/* File Drop Box */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                      dragActive ? "border-indigo-500 bg-indigo-50/30" : "border-slate-200 hover:border-indigo-400 bg-white"
                    }`}
                  >
                    <FileText className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-slate-700">Drag PDF/Word here</p>
                    <p className="text-[8px] text-slate-400 mt-0.5">Or click to select</p>
                    <button 
                      onClick={simulateFileUpload}
                      className="mt-2 text-[9px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-200"
                    >
                      Attach Sample
                    </button>
                  </div>

                  {/* Uploaded File List */}
                  <div className="space-y-1.5 overflow-y-auto max-h-[220px]">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="bg-white border rounded-lg p-2 text-[10px] flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="font-medium text-slate-700 truncate">{file.name}</span>
                        </div>
                        <span className="text-[8px] text-slate-400">{file.size}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-[9px] text-indigo-700 space-y-1">
                  <p className="font-bold flex items-center gap-1"><Sparkles className="w-3 h-3" /> Document Intelligence</p>
                  <p>Students can upload slide files, coursework PDFs or lab logs. The AI indexes files with vector embeddings to answer context queries instantly.</p>
                </div>
              </div>

              {/* Chat Message Panel */}
              <div className="flex-1 flex flex-col bg-white">
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex gap-3 max-w-[85%] ${
                        msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        msg.role === "user" ? "bg-indigo-600 text-white" : "bg-rose-500 text-white"
                      }`}>
                        {msg.role === "user" ? <UserCheck className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      </div>
                      <div className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                        msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-50 border text-slate-700 rounded-tl-none"
                      }`}>
                        <div className="leading-relaxed whitespace-pre-line">{msg.text}</div>
                        {msg.role === "assistant" && (
                          <button 
                            onClick={() => handleTts(msg.text, idx)}
                            className="mt-1 text-[9px] text-slate-400 hover:text-rose-500 font-semibold flex items-center gap-1 border border-slate-200 px-1.5 py-0.5 rounded bg-white"
                          >
                            <Volume2 className="w-2.5 h-2.5" /> {ttsActiveId === idx ? "Mute" : "Speak Socratic Response"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="flex gap-3 max-w-[80%] mr-auto items-center">
                      <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="p-3 bg-slate-50 border rounded-2xl rounded-tl-none text-xs flex items-center gap-2 text-slate-500">
                        <RefreshCw className="w-4.5 h-4.5 animate-spin text-rose-500" />
                        AI Tutor is contemplating next socratic inquiry...
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggested Socratic prompt chips */}
                <div className="p-2 bg-slate-50/50 border-t flex flex-wrap gap-1.5">
                  {chatChips.map((chip, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSendTutorChat(chip)}
                      className="bg-white border text-slate-600 hover:border-indigo-500 hover:text-indigo-600 text-[10px] font-semibold py-1 px-2.5 rounded-full transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t flex gap-2">
                  <input 
                    type="text" 
                    placeholder={voiceInputSim ? "🎤 Speech input active... speak into microphone." : "Ask a Socratic question (e.g. explain recursion)"}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendTutorChat(chatInput)}
                    className="flex-1 bg-slate-50 border rounded-xl px-3 text-xs outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                  <button 
                    onClick={() => handleSendTutorChat(chatInput)}
                    disabled={isChatLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition shadow-sm shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VIRTUAL PRACTICAL LABS */}
        {activeTab === "labs" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full font-bold">Virtual Hardware Sandbox</span>
                  <h3 className="text-base font-bold text-slate-800 mt-1">SaaS Engineering Interactive Labs</h3>
                  <p className="text-xs text-slate-500">Run virtual models, check terminal outputs, submit practical diagnostic reports</p>
                </div>
                <div className="flex gap-2">
                  {labs.map(lab => (
                    <button 
                      key={lab.id}
                      onClick={() => { setActiveLab(lab); setLabGraderResult(null); }}
                      className={`text-xs font-semibold py-1.5 px-3 rounded-lg border transition ${
                        activeLab.id === lab.id 
                          ? "bg-cyan-50 text-cyan-700 border-cyan-200 shadow-sm" 
                          : "bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {lab.category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lab Guide Panel */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{activeLab.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{activeLab.description}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step-by-Step Task Scaffolding</p>
                    {activeLab.steps.map((step, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex gap-3 transition-all ${
                          idx === activeLab.activeStepIndex 
                            ? "border-cyan-500 bg-cyan-50/20" 
                            : idx < activeLab.activeStepIndex 
                            ? "border-slate-100 bg-slate-50/50 opacity-60" 
                            : "border-slate-100 opacity-40"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold ${
                          idx <= activeLab.activeStepIndex ? "bg-cyan-600 text-white" : "bg-slate-200 text-slate-400"
                        }`}>
                          {idx + 1}
                        </div>
                        <p className={idx === activeLab.activeStepIndex ? "font-semibold text-slate-700" : "text-slate-500"}>
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleNextLabStep}
                      disabled={activeLab.activeStepIndex >= activeLab.steps.length - 1}
                      className="bg-cyan-600 text-white text-xs font-bold py-2 px-4 rounded-xl hover:bg-cyan-700 transition disabled:opacity-40 shadow-sm"
                    >
                      Next Step Task
                    </button>
                    <button 
                      onClick={handleResetLab}
                      className="bg-slate-100 text-slate-600 text-xs font-bold py-2 px-4 rounded-xl hover:bg-slate-200 transition"
                    >
                      Reset Sandbox
                    </button>
                  </div>
                </div>

                {/* Simulated Hardware Terminal Output */}
                <div className="space-y-4 flex flex-col h-full justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Simulated Hardware Log Terminal</p>
                    <div className="bg-slate-900 text-cyan-400 font-mono text-[10px] p-4 rounded-xl h-64 overflow-y-auto space-y-1.5 shadow-inner">
                      {activeLab.terminalOutput.map((log, idx) => (
                        <div key={idx} className="leading-relaxed">
                          {log}
                        </div>
                      ))}
                      {activeLab.activeStepIndex === activeLab.steps.length - 1 && (
                        <div className="text-yellow-300 font-bold animate-pulse">
                          ✓ SANDBOX SUCCESS: All parameters calculated correctly. Write and submit your lab report below.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* LAB REPORT FORM */}
                  <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <FileText className="w-4 h-4 text-cyan-600" /> Automated AI Lab Grader
                    </h5>
                    <textarea 
                      placeholder="Input your experimental observations, formulas, recursion limits, or routing solutions here..."
                      value={labReport}
                      onChange={(e) => setLabReport(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs h-24 outline-none focus:border-cyan-500 transition"
                    />
                    <button 
                      onClick={handleSubmitLabReport}
                      disabled={isLabEvaluating || !labReport.trim()}
                      className="w-full bg-cyan-600 text-white text-xs font-bold py-2 rounded-xl hover:bg-cyan-700 transition disabled:opacity-40 shadow-sm"
                    >
                      {isLabEvaluating ? "AI Grader reviewing writeup..." : "Submit Lab Report for AI Grading"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI LAB GRADER OUTCOME AND RUBRIC */}
            {labGraderResult && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center bg-cyan-50/50 p-4 rounded-xl border border-cyan-100">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex flex-col items-center justify-center text-cyan-700">
                      <span className="text-lg font-black">{labGraderResult.score}</span>
                      <span className="text-[8px] font-bold uppercase tracking-wider leading-none">Score</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        {labGraderResult.passed ? "✓ Passed & Certified" : "✗ Needs Improvement"}
                        <span className="text-[10px] bg-cyan-200/50 text-cyan-800 font-bold px-2 py-0.5 rounded-full">
                          AI Automated Grader
                        </span>
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">{labGraderResult.feedback}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">Accuracy</span>
                    <span className="text-base font-extrabold text-slate-700">{labGraderResult.rubricGrades?.accuracy}/10</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">Reasoning</span>
                    <span className="text-base font-extrabold text-slate-700">{labGraderResult.rubricGrades?.reasoning}/10</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">Structure</span>
                    <span className="text-base font-extrabold text-slate-700">{labGraderResult.rubricGrades?.structure}/10</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">Originality</span>
                    <span className="text-base font-extrabold text-slate-700">{labGraderResult.rubricGrades?.originality}/10</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Identified Strengths</span>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      {labGraderResult.strengths?.map((str: string, i: number) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Automated Suggestions</span>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      {labGraderResult.suggestions?.map((sug: string, i: number) => (
                        <li key={i}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CONTINUOUS ASSESSMENT */}
        {activeTab === "assessments" && (
          <div className="space-y-6">
            
            {/* CONFIGURATOR CARD */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="border-b pb-4">
                <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">Diagnostic Exam Generator</span>
                <h3 className="text-base font-bold text-slate-800 mt-1">Continuous Evaluation Diagnostic Suite</h3>
                <p className="text-xs text-slate-500">Configure curriculum topics and trigger the AI assessment parser</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">Assessment Subject / Topic</label>
                  <select 
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    className="w-full bg-slate-50 border rounded-xl p-2 text-xs outline-none focus:border-indigo-500"
                  >
                    <option value="Recursion & Binary Trees">Recursion & Binary Trees</option>
                    <option value="Ohm's Law & Circuits">Ohm's Law & Circuits</option>
                    <option value="Subnet Routing & IP Gates">Subnet Routing & IP Gates</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">System Difficulty</label>
                  <select 
                    value={quizDiff}
                    onChange={(e) => setQuizDiff(e.target.value as any)}
                    className="w-full bg-slate-50 border rounded-xl p-2 text-xs outline-none focus:border-indigo-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard (University standard)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">Question Pattern</label>
                  <select 
                    value={quizType}
                    onChange={(e) => setQuizType(e.target.value as any)}
                    className="w-full bg-slate-50 border rounded-xl p-2 text-xs outline-none focus:border-indigo-500"
                  >
                    <option value="MCQ">Multiple Choice Questions (MCQ)</option>
                    <option value="Short Answer">Short Answer / Concept Essay</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button 
                    onClick={handleGenerateQuiz}
                    disabled={isQuizGenerating}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isQuizGenerating ? "AI is generating CAT..." : "Generate Diagnostic CAT"}
                  </button>
                </div>
              </div>
            </div>

            {/* QUIZ INTERACTIVE VIEW */}
            {activeQuizQuestions.length > 0 && !quizFeedback?.isEssayGrading && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="text-sm font-bold text-slate-800">Dynamic Quiz: {quizTopic} ({quizDiff})</h4>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">{activeQuizQuestions.length} Questions</span>
                </div>

                <div className="space-y-4">
                  {activeQuizQuestions.map((q, qIdx) => (
                    <div key={q.id} className="space-y-2 border-b border-slate-50 pb-4">
                      <p className="text-xs font-semibold text-slate-700">
                        {qIdx + 1}. {q.question}
                      </p>
                      
                      {q.options ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {q.options.map((opt: string, oIdx: number) => (
                            <label 
                              key={oIdx}
                              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-2 ${
                                quizAnswers[q.id] === String(oIdx)
                                  ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-medium"
                                  : "bg-slate-50/50 hover:bg-slate-50 border-slate-100 text-slate-600"
                              }`}
                            >
                              <input 
                                type="radio"
                                name={q.id}
                                value={oIdx}
                                checked={quizAnswers[q.id] === String(oIdx)}
                                onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: String(oIdx) })}
                                className="hidden"
                              />
                              <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] shrink-0">
                                {quizAnswers[q.id] === String(oIdx) && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                              </span>
                              {opt}
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-2 space-y-2">
                          <textarea 
                            placeholder="Type your explanation / proof or source script code here..."
                            value={quizAnswers[q.id] || ""}
                            onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs h-24 outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 justify-end">
                  <button 
                    onClick={handleQuizSubmit}
                    className="bg-indigo-600 text-white text-xs font-bold py-2 px-4 rounded-xl hover:bg-indigo-700 transition"
                  >
                    Submit Answers for Scoring
                  </button>
                </div>
              </div>
            )}

            {/* DIRECT CODE / ESSAY UPLOAD LAB WITH DETAILED RUBRIC GENERATOR */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Advanced Essay / Code Architecture Submission</h4>
                <p className="text-xs text-slate-500 mt-1">Submit extensive theoretical explanations or full algorithms to receive automated rubric marking schemes.</p>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 border p-3 rounded-xl">
                  <span className="text-[9px] font-bold text-indigo-600 uppercase block">Continuous Assignment Prompt</span>
                  <p className="text-xs text-slate-700 font-semibold mt-1">{customEssayQuestion}</p>
                </div>

                <textarea 
                  placeholder="Paste your comparative analysis, networking schema breakdown, or dynamic programming proof here..."
                  value={customEssayInput}
                  onChange={(e) => setCustomEssayInput(e.target.value)}
                  className="w-full bg-white border rounded-xl p-3 text-xs h-36 outline-none focus:border-indigo-500 transition font-mono"
                />

                <button 
                  onClick={handleEvaluateCustomEssay}
                  disabled={isLabEvaluating || !customEssayInput.trim()}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl transition shadow-sm"
                >
                  {isLabEvaluating ? "AI is compiling and grading..." : "Submit for AI Rubric Analysis"}
                </button>
              </div>
            </div>

            {/* QUIZ/ESSAY FEEDBACK RESULTS */}
            {quizFeedback && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex flex-col items-center justify-center text-indigo-700 shrink-0">
                    <span className="text-lg font-black">{quizFeedback.score}%</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider leading-none">Grade</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {quizFeedback.passed ? "🎉 Mastery Confirmed" : "⚠️ Needs Revision"}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{quizFeedback.feedback}</p>
                  </div>
                </div>

                {quizFeedback.rubricGrades && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">Accuracy</span>
                      <span className="text-sm font-black text-slate-700">{quizFeedback.rubricGrades.accuracy}/10</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">Reasoning</span>
                      <span className="text-sm font-black text-slate-700">{quizFeedback.rubricGrades.reasoning}/10</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">Structure</span>
                      <span className="text-sm font-black text-slate-700">{quizFeedback.rubricGrades.structure}/10</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">Originality</span>
                      <span className="text-sm font-black text-slate-700">{quizFeedback.rubricGrades.originality}/10</span>
                    </div>
                  </div>
                )}

                {quizFeedback.strengths && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Identified Strengths</span>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                        {quizFeedback.strengths.map((str: string, i: number) => <li key={i}>{str}</li>)}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Detailed Suggestions</span>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                        {quizFeedback.suggestions.map((sug: string, i: number) => <li key={i}>{sug}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* TAB 5: AI STUDY PLANNER */}
        {activeTab === "planner" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="border-b pb-4">
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">LMS Core scheduler</span>
                <h3 className="text-base font-bold text-slate-800 mt-1">SmartTutor AI Study & Revision Planner</h3>
                <p className="text-xs text-slate-500">Auto-organize schedules and diagnostic reminders mapping active recall study slots</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Weak Topics requiring focus</label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border">
                    {["Recursion Trees", "Subnet Mask Boundaries", "AC Impedance", "Big O notation"].map(topic => {
                      const selected = weakSubjects.includes(topic);
                      return (
                        <button 
                          key={topic}
                          onClick={() => {
                            if (selected) {
                              setWeakSubjects(weakSubjects.filter(t => t !== topic));
                            } else {
                              setWeakSubjects([...weakSubjects, topic]);
                            }
                          }}
                          className={`text-[9px] font-bold px-2 py-1 rounded-full transition ${
                            selected ? "bg-emerald-600 text-white" : "bg-white text-slate-600 border"
                          }`}
                        >
                          {topic} {selected ? "✓" : "+"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Target Revision Hours / Week</label>
                  <input 
                    type="number"
                    min={4}
                    max={40}
                    value={plannerHours}
                    onChange={(e) => setPlannerHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs outline-none focus:bg-white focus:border-indigo-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Main Goal</label>
                  <input 
                    type="text"
                    value={plannerGoal}
                    onChange={(e) => setPlannerGoal(e.target.value)}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs outline-none focus:bg-white focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <button 
                onClick={handleGenerateStudyPlan}
                disabled={isPlannerLoading || weakSubjects.length === 0}
                className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 rounded-xl hover:bg-emerald-700 transition disabled:opacity-40 shadow-sm flex items-center gap-1.5"
              >
                {isPlannerLoading ? "AI is building perfect revision calendar..." : "Generate AI Active-Recall Calendar"}
              </button>
            </div>

            {/* STUDY PLAN OUTPUT */}
            {generatedPlan && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">AI Study Strategy Roadmap</h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{generatedPlan.summary}</p>
                  <div className="mt-3 text-xs">
                    <span className="font-bold text-slate-600">Weekly Target Milestone: </span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      {generatedPlan.weeklyMilestone}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom Hour-by-Hour Active Schedule</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {generatedPlan.timetable.map((slot, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold mr-1.5">{slot.day}</span>
                          <span className="text-[10px] font-mono text-slate-500">{slot.timeSlot}</span>
                          <p className="text-xs font-bold text-slate-700 mt-1.5">{slot.subject}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Focus: {slot.topicToStudy}</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] font-bold text-emerald-600 uppercase">{slot.method}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{slot.durationMins} Mins</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnostic Stress-Management Guidelines</span>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    {generatedPlan.diagnosticTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CAREER GUIDANCE PORTAL */}
        {activeTab === "career" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="border-b pb-4">
                <span className="text-xs bg-violet-100 text-violet-800 px-2 py-0.5 rounded-full font-bold">Placement and Career Mentor</span>
                <h3 className="text-base font-bold text-slate-800 mt-1">SmartTutor AI Career Guidance Pathway</h3>
                <p className="text-xs text-slate-500">Generates custom global university degree tracks, certificate milestones and high-salary placements</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Your Current Core Skills</label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border">
                    {["Python", "React", "Subnet Design", "Ohm measurements", "C++", "Cyber Security"].map(skill => {
                      const active = careerSkills.includes(skill);
                      return (
                        <button 
                          key={skill}
                          onClick={() => {
                            if (active) setCareerSkills(careerSkills.filter(s => s !== skill));
                            else setCareerSkills([...careerSkills, skill]);
                          }}
                          className={`text-[9px] font-bold px-2 py-1 rounded-full transition ${
                            active ? "bg-violet-600 text-white" : "bg-white text-slate-600 border"
                          }`}
                        >
                          {skill} {active ? "✓" : "+"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Target Fields of Interest</label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border">
                    {["Cloud Architect", "Embedded Firmware Eng", "Full Stack Developer", "Network Defender", "AI Engineer"].map(field => {
                      const active = careerInterests.includes(field);
                      return (
                        <button 
                          key={field}
                          onClick={() => {
                            if (active) setCareerInterests(careerInterests.filter(s => s !== field));
                            else setCareerInterests([...careerInterests, field]);
                          }}
                          className={`text-[9px] font-bold px-2 py-1 rounded-full transition ${
                            active ? "bg-violet-600 text-white" : "bg-white text-slate-600 border"
                          }`}
                        >
                          {field} {active ? "✓" : "+"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerateCareerReport}
                disabled={isCareerLoading || careerSkills.length === 0}
                className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {isCareerLoading ? "AI is processing credentials..." : "Formulate Personalized Placement Report"}
              </button>
            </div>

            {/* CAREER REPORT DISPLAY */}
            {careerReport && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex gap-4 items-center bg-violet-50/50 p-4 border border-violet-100 rounded-xl">
                  <div className="p-3 bg-violet-100 text-violet-700 rounded-xl h-fit">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block">Recommended Professional Destination</span>
                    <h4 className="text-base font-extrabold text-slate-800">{careerReport.targetRole}</h4>
                    <p className="text-xs text-slate-600 mt-1">{careerReport.fitJustification}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Global Prestigious University Options</span>
                    <div className="space-y-1.5">
                      {careerReport.universityRecommendations.map((uni, i) => (
                        <div key={i} className="text-xs p-2.5 bg-slate-50 border rounded-lg flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-violet-500 shrink-0" />
                          <span className="font-medium text-slate-700">{uni}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Industry Certification Benchmark Milestones</span>
                    <div className="space-y-1.5">
                      {careerReport.certifiedMilestones.map((cert, i) => (
                        <div key={i} className="text-xs p-2.5 bg-slate-50 border rounded-lg flex items-center gap-2">
                          <Award className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-medium text-slate-700">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Starting Market Demand & Salary Bounds</span>
                    <p className="text-xs text-slate-700 font-semibold mt-1 bg-slate-50 p-2.5 border rounded-xl">{careerReport.jobDemandSalary}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Actionable Daily To-Do Items</span>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4 mt-1">
                      {careerReport.actionableNextSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: DISCUSSION FORUM */}
        {activeTab === "forum" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* THREAD LIST */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Create New Discussion Topic</p>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Topic Title..." 
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none focus:bg-white"
                  />
                  <textarea 
                    placeholder="Describe your inquiry..." 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg p-2 text-xs h-16 outline-none focus:bg-white"
                  />
                  <div className="flex gap-2">
                    <select 
                      value={newPostTag}
                      onChange={(e) => setNewPostTag(e.target.value)}
                      className="bg-slate-100 border text-slate-600 text-[10px] font-bold px-2 rounded outline-none"
                    >
                      <option value="Programming">Programming</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Networking">Networking</option>
                    </select>
                    <button 
                      onClick={handleCreateForumPost}
                      className="bg-indigo-600 text-white text-[10px] font-bold py-1 px-3 rounded hover:bg-indigo-700 transition"
                    >
                      Publish Thread
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {forumPosts.map(post => (
                  <div 
                    key={post.id}
                    onClick={() => setActivePostId(post.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      activePostId === post.id 
                        ? "bg-indigo-50/50 border-indigo-200" 
                        : "bg-white border-slate-100 hover:border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-start text-[10px] text-slate-400">
                      <span>{post.author} • {post.role}</span>
                      <span className="bg-slate-100 px-1.5 rounded font-bold font-mono text-[9px] text-slate-500">
                        {post.tags[0]}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-700 mt-1 line-clamp-1">{post.title}</h5>
                    <div className="flex justify-between items-center mt-2.5 text-[10px] text-slate-500 font-bold">
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {post.upvotes}</span>
                      <span>{post.replies.length} Replies</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* THREAD DETAILS & AI SUMMARY */}
            <div className="lg:col-span-7 space-y-4">
              {activePostId && (() => {
                const post = forumPosts.find(p => p.id === activePostId);
                if (!post) return null;
                return (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono">{post.author} ({post.role})</span>
                        <h4 className="text-sm font-bold text-slate-800 mt-0.5">{post.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-50">{post.content}</p>

                      {post.aiSummary && (
                        <div className="bg-amber-50/40 border border-amber-100 p-3.5 rounded-xl text-[11px] text-amber-800 space-y-1">
                          <p className="font-bold flex items-center gap-1 text-amber-700">
                            <Sparkles className="w-3.5 h-3.5" /> AI Thread Synthesizer Summarization
                          </p>
                          <p className="leading-relaxed">{post.aiSummary}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Syllabus Thread Replies</p>
                      
                      <div className="space-y-3 max-h-[220px] overflow-y-auto">
                        {post.replies.map(reply => (
                          <div key={reply.id} className="p-3 border rounded-xl bg-slate-50/30 text-xs">
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mb-1">
                              <span>{reply.author} ({reply.role})</span>
                              {reply.isAiVerified && (
                                <span className="text-[8px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">
                                  AI Verified Solution
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 leading-relaxed">{reply.content}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Submit professional educational response..."
                          value={replyInput}
                          onChange={(e) => setReplyInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddForumReply(post.id)}
                          className="flex-1 bg-slate-50 border rounded-xl px-3 text-xs outline-none focus:bg-white"
                        />
                        <button 
                          onClick={() => handleAddForumReply(post.id)}
                          className="bg-indigo-600 text-white text-xs font-bold px-3.5 rounded-xl hover:bg-indigo-700 transition"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB 8: LIVE CLASS */}
        {activeTab === "live" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* STREAM & WHITEBOARD */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-slate-950 rounded-2xl overflow-hidden aspect-video relative border border-slate-800 shadow-md">
                
                {/* Simulated Web Cam Streams */}
                <div className="absolute right-4 top-4 w-32 aspect-video bg-indigo-900 border border-white/20 rounded-lg overflow-hidden flex items-center justify-center text-[10px] text-white">
                  Instructor Camera
                </div>

                <div className="absolute left-4 top-4 bg-black/60 px-2.5 py-1 rounded text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  LIVE: CS-201 Socratic Recursion Tracing
                </div>

                {/* Draw Canvas Whiteboard overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="bg-black/45 backdrop-blur-md rounded-xl p-3 border border-white/10 max-w-sm mb-4">
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Whiteboard Concept Overlay</p>
                    <div className="h-28 bg-slate-900 border border-slate-800 rounded-lg relative mt-1 overflow-hidden">
                      {/* Lines rendering */}
                      <svg className="absolute inset-0 w-full h-full">
                        <line x1="50" y1="100" x2="100" y2="50" stroke="#3b82f6" strokeWidth="2" />
                        <line x1="100" y1="50" x2="150" y2="100" stroke="#3b82f6" strokeWidth="2" />
                        <line x1="100" y1="50" x2="100" y2="110" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
                        <circle cx="100" cy="50" r="4" fill="#ef4444" />
                        <text x="94" y="42" fill="#ef4444" fontSize="8" fontWeight="bold">fib(3)</text>
                        <text x="44" y="112" fill="#3b82f6" fontSize="8">fib(2)</text>
                        <text x="144" y="112" fill="#3b82f6" fontSize="8">fib(1)</text>
                      </svg>
                    </div>
                  </div>

                  {/* Controller */}
                  <div className="flex gap-2 justify-between">
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={`text-xs font-bold py-1.5 px-3 rounded-lg border transition ${
                          isMuted ? "bg-red-600 text-white border-red-500" : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                        }`}
                      >
                        {isMuted ? "Unmute Mic" : "Mute Mic"}
                      </button>
                      <button 
                        onClick={() => setIsScreenSharing(!isScreenSharing)}
                        className={`text-xs font-bold py-1.5 px-3 rounded-lg border transition ${
                          isScreenSharing ? "bg-cyan-600 text-white border-cyan-500" : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                        }`}
                      >
                        Share Screen
                      </button>
                    </div>
                    <button className="bg-red-500 text-white text-xs font-bold py-1.5 px-3.5 rounded-lg hover:bg-red-600">
                      Leave Class
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CHAT PANEL */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-[360px] lg:h-auto">
              <div className="p-3 bg-slate-50 border-b">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Classroom Chat</p>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                {liveChatMessages.map((msg, i) => (
                  <div key={i} className="space-y-0.5">
                    <span className="font-bold text-slate-700">{msg.author}</span>
                    <p className="text-slate-600 bg-slate-50 p-2 rounded-lg leading-normal">{msg.text}</p>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t flex gap-1.5">
                <input 
                  type="text" 
                  placeholder="Chat with classroom..."
                  value={liveChatInput}
                  onChange={(e) => setLiveChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && liveChatInput.trim()) {
                      setLiveChatMessages([...liveChatMessages, { author: "James (You)", text: liveChatInput }]);
                      setLiveChatInput("");
                    }
                  }}
                  className="flex-1 bg-slate-50 border rounded-lg px-2 py-1.5 text-xs outline-none"
                />
                <button 
                  onClick={() => {
                    if (liveChatInput.trim()) {
                      setLiveChatMessages([...liveChatMessages, { author: "James (You)", text: liveChatInput }]);
                      setLiveChatInput("");
                    }
                  }}
                  className="bg-indigo-600 text-white text-[10px] font-bold px-3.5 rounded-lg hover:bg-indigo-700"
                >
                  Send
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
