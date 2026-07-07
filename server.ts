import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY", // Handle gracefully if not loaded yet
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const MODEL_NAME = "gemini-3.5-flash";

  // Guard for API Key availability
  const checkApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Missing GEMINI_API_KEY. Please set your API key in Settings > Secrets."
      });
    }
    next();
  };

  // Endpoint 1: Brainstorming Coach Chat
  app.post("/api/brainstorm", checkApiKey, async (req, res) => {
    try {
      const { message, chatHistory = [], currentProposal } = req.body;

      const systemInstruction = `You are a friendly, encouraging, and sharp AI Education Design Coach. 
Your goal is to guide students in brainstorming, designing, and refining their own AI-powered educational tool.
Adhere strictly to modern learning science and the project requirements.

The project requires students to design a tool addressing at least two of these benefits:
1. Student engagement and motivation
2. Cost-effective learning
3. Intelligent tutoring
4. Continuous evaluation
5. Raising academic standards

When replying:
- Ask deep, guiding questions. Don't just give them the final answer; prompt them to think of AI implementations (e.g., natural language processing, reinforcement learning, speech-to-text, recommendation systems) and how they actually enhance learning.
- Maintain a highly encouraging tone, keeping responses concise and readable (using bold text and short bullet points).
- Suggest 2-3 specific, actionable next steps or brainstorming prompts.

Current user's draft proposal context (if any):
${currentProposal ? JSON.stringify(currentProposal, null, 2) : "None yet. Starting from scratch."}`;

      // Convert chat history format to what @google/genai expects
      // The SDK chats.create uses history of type Content[]
      const formattedHistory = chatHistory.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.text || msg.content }]
      }));

      const chat = ai.chats.create({
        model: MODEL_NAME,
        history: formattedHistory,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const response = await chat.sendMessage({ message });
      const responseText = response.text || "";

      // Also generate quick suggested next prompt chips to make the UI ultra-interactive
      const suggestionsPrompt = `Based on the coaching response above, generate 3 short interactive prompt chips (under 10 words each) that the student can click to reply next. Return them as a JSON list of strings.
Example: ["How can I gamify this?", "Is this cost-effective?", "Explain NLP features"]`;

      const suggestionResponse = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [responseText, suggestionsPrompt],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      let promptChips = ["How to gamify this?", "Let's check uniqueness", "Help me write features"];
      try {
        if (suggestionResponse.text) {
          promptChips = JSON.parse(suggestionResponse.text.trim());
        }
      } catch (err) {
        console.error("Failed to parse prompt chips:", err);
      }

      res.json({
        text: responseText,
        suggestedPrompts: promptChips
      });
    } catch (error: any) {
      console.error("Error in /api/brainstorm:", error);
      res.status(500).json({ error: error.message || "An error occurred during brainstorming." });
    }
  });

  // Endpoint 2: Refine / Autocomplete a Section of the Proposal
  app.post("/api/refine-section", checkApiKey, async (req, res) => {
    try {
      const { sectionId, currentProposal, instructions } = req.body;

      const systemInstruction = `You are an expert Educational Technology Researcher. 
Help the student expand, professionalize, and refine a specific section of their AI-powered learning tool proposal.
Keep the language academic yet accessible, persuasive, and grounded in realistic AI capabilities (avoid sci-fi or magic AI).
Focus strictly on the selected section.`;

      const prompt = `Here is the current draft of the student's proposal:
${JSON.stringify(currentProposal, null, 2)}

The student wants you to refine or draft the section: "${sectionId}".
Specific instructions or guidance for this section's refinement:
"${instructions || "Professionalize and expand with concrete, realistic AI mechanisms."}"

Write a detailed, polished, and structured response (2-3 paragraphs or structured bullet points) specifically for the "${sectionId}" field. Do not include introductory or concluding conversational filler; return ONLY the final content to put in this section.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ content: response.text || "" });
    } catch (error: any) {
      console.error("Error in /api/refine-section:", error);
      res.status(500).json({ error: error.message || "An error occurred refining the section." });
    }
  });

  // Endpoint 3: Evaluate Draft Proposal
  app.post("/api/evaluate", checkApiKey, async (req, res) => {
    try {
      const { proposal } = req.body;

      const prompt = `Review this AI-powered educational tool proposal designed by a student.
Proposal Details:
- Name: ${proposal.name || "Untitled Tool"}
- Target Audience: ${proposal.targetAudience || "Not specified"}
- AI Features: ${proposal.aiFeatures || "Not specified"}
- Benefits Addressed: ${proposal.benefitsAddressed || "Not specified"}
- Uniqueness: ${proposal.uniqueness || "Not specified"}
- Challenges: ${proposal.challenges || "Not specified"}

Perform a detailed evaluation against educational technology standards. Address the key elements: student engagement, cost-effectiveness, intelligent tutoring, continuous evaluation, and raising academic standards.
Provide an overall score out of 100, specific category scores out of 10, list 3 strengths, list 3 constructive suggestions, and 3 mock defense questions a teacher or panel might ask the student during their presentation.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: "You are an expert EdTech professor and evaluator. Evaluate strictly and constructively, providing high-quality educational feedback.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.INTEGER, description: "Score out of 100" },
              categoryRatings: {
                type: Type.OBJECT,
                properties: {
                  engagement: { type: Type.INTEGER, description: "Engagement and Motivation rating (0-10)" },
                  cost: { type: Type.INTEGER, description: "Cost-effectiveness rating (0-10)" },
                  tutoring: { type: Type.INTEGER, description: "Intelligent Tutoring rating (0-10)" },
                  evaluation: { type: Type.INTEGER, description: "Continuous Evaluation rating (0-10)" },
                  standards: { type: Type.INTEGER, description: "Raising Academic Standards rating (0-10)" }
                },
                required: ["engagement", "cost", "tutoring", "evaluation", "standards"]
              },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 major positive elements of this concept."
              },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 detailed, actionable improvements."
              },
              defenseQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 mock defense questions to help the student prepare for their presentation."
              }
            },
            required: ["overallScore", "categoryRatings", "strengths", "suggestions", "defenseQuestions"]
          }
        }
      });

      let evaluationData = {};
      try {
        if (response.text) {
          evaluationData = JSON.parse(response.text.trim());
        }
      } catch (err) {
        console.error("Failed to parse evaluation JSON:", err);
      }

      res.json(evaluationData);
    } catch (error: any) {
      console.error("Error in /api/evaluate:", error);
      res.status(500).json({ error: error.message || "An error occurred during evaluation." });
    }
  });

  // Endpoint 4: Generate Presentation Slides
  app.post("/api/generate-slides", checkApiKey, async (req, res) => {
    try {
      const { proposal } = req.body;

      const prompt = `Based on this student proposal for an AI-powered educational tool, generate a beautiful 5 to 7 slide presentation structure.
Proposal:
${JSON.stringify(proposal, null, 2)}

Create a compelling visual slide deck that outlines:
1. Title Slide (Tool Name, Tagline, Target Audience)
2. The Problem & Target Audience (Who needs this and why)
3. Core AI Features & Mechanisms (How the AI works in simple terms)
4. Key Pedagogical Benefits (How it solves engagement, tutoring, evaluation, standards, or cost)
5. Uniqueness & Competitor Comparison (Why it's better)
6. Potential Implementation Challenges & Smart Solutions
7. Conclusion & Vision (Summary and future expansion)

For each slide, provide a structured layout with bullet points, a visual guidance design recommendation (appropriate icons, graphics, or layout tips to fit the theme), and detailed speaker notes/guidelines to help them practice for their 5-7 minutes talk.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: "You are a professional designer and presentation coach. Design clear, concise, highly professional presentations.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              slides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    layout: { type: Type.STRING, description: "e.g., 'title', 'bullets', 'split', 'stats', 'grid'" },
                    bullets: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Concise bullet points for the slide (max 4-5 points)"
                    },
                    visualGuidance: { type: Type.STRING, description: "Suggestions on how to design this slide visually" },
                    speakerNotes: { type: Type.STRING, description: "Detailed presentation script/notes for the student" }
                  },
                  required: ["id", "title", "layout", "bullets", "visualGuidance", "speakerNotes"]
                }
              }
            },
            required: ["slides"]
          }
        }
      });

      let slidesData = { slides: [] };
      try {
        if (response.text) {
          slidesData = JSON.parse(response.text.trim());
        }
      } catch (err) {
        console.error("Failed to parse slides JSON:", err);
      }

      res.json(slidesData);
    } catch (error: any) {
      console.error("Error in /api/generate-slides:", error);
      res.status(500).json({ error: error.message || "An error occurred generating the slides." });
    }
  });

  // ==========================================
  // SMARTTUTOR AI ADDED ROBUST LMS ENDPOINTS
  // ==========================================

  // Endpoint 5: AI Tutor Chat (Socratic, voice/image/code aware, with quiz injection)
  app.post("/api/tutor-chat", checkApiKey, async (req, res) => {
    try {
      const { message, history = [], topic = "General Learning", studentProfile = {} } = req.body;

      const systemInstruction = `You are a highly skilled, compassionate, and sharp Socratic AI Tutor on the SmartTutor AI platform.
Your guiding educational philosophy is Socratic questioning: rather than giving answers away directly, you scaffold the learner's journey.
- If a student asks to explain a concept (e.g. recursion or Ohm's Law), simplify with elegant real-world analogies first, provide clear visual/ASCII representations if appropriate, and prompt them to predict the outcome of a scenario.
- If they ask to solve a programming error, do not give them the corrected script outright. Pinpoint the conceptual flaw, explain *why* it fails, and ask a targeted debugging question.
- Always include 3 action-packed, short suggested replies or options under 10 words.
- Maintain a warm, premium, elite SaaS persona (resembling Coursera/Khan Academy experts). Ensure readability with Markdown, clean lists, and code blocks.`;

      const formattedHistory = history.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.text || msg.content }]
      }));

      const chat = ai.chats.create({
        model: MODEL_NAME,
        history: formattedHistory,
        config: {
          systemInstruction,
          temperature: 0.65,
        }
      });

      const response = await chat.sendMessage({ message });
      const text = response.text || "";

      // Generate suggested prompt reply chips
      const suggestionsPrompt = `Based on your tutor reply, generate exactly 3 interactive socratic follow-up suggestions (under 10 words each) for the student. Output as a JSON array of strings.`;
      const suggestionResponse = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [text, suggestionsPrompt],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      let replyChips = ["Could you give another example?", "Let's test my knowledge", "Explain in simple terms"];
      try {
        if (suggestionResponse.text) {
          replyChips = JSON.parse(suggestionResponse.text.trim());
        }
      } catch (err) {
        console.error("Failed to parse tutor reply chips:", err);
      }

      res.json({
        text,
        suggestedPrompts: replyChips
      });
    } catch (error: any) {
      console.error("Error in /api/tutor-chat:", error);
      res.status(500).json({ error: error.message || "AI Tutor encountered an error." });
    }
  });

  // Endpoint 6: AI Question / Assessment Generator (MCQs, short answer, coding questions)
  app.post("/api/generate-quiz", checkApiKey, async (req, res) => {
    try {
      const { topic, difficulty = "Medium", questionType = "MCQ", count = 3 } = req.body;

      const prompt = `Generate a quiz with exactly ${count} questions.
Topic: "${topic}"
Difficulty: "${difficulty}" (Easy, Medium, Hard)
Type: "${questionType}" (MCQ, Short Answer, Coding)

Return a structured JSON object containing a list of questions.
Each question must include:
- id: unique string
- question: clear, professional prompt
- type: "MCQ" | "Short Answer" | "Coding"
- options: array of 4 options (only for MCQ, empty otherwise)
- correctAnswer: correct option index (for MCQ) or a sample correct keyword/answer string
- explanation: detailed pedagogical explanation of the correct answer
- hint: useful hint for the student`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: "You are an elite academic curriculum examiner. Ensure technical accuracy and realistic test criteria.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    type: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING, description: "Index string for MCQ, e.g. '1', or keywords for other types" },
                    explanation: { type: Type.STRING },
                    hint: { type: Type.STRING }
                  },
                  required: ["id", "question", "type", "explanation", "hint"]
                }
              }
            },
            required: ["questions"]
          }
        }
      });

      let quizData = { questions: [] };
      try {
        if (response.text) {
          quizData = JSON.parse(response.text.trim());
        }
      } catch (err) {
        console.error("Failed to parse quiz response:", err);
      }

      res.json(quizData);
    } catch (error: any) {
      console.error("Error in /api/generate-quiz:", error);
      res.status(500).json({ error: error.message || "Failed to generate assessment." });
    }
  });

  // Endpoint 7: AI Essay / Practical / Code Marker & Evaluation Engine
  app.post("/api/evaluate-submission", checkApiKey, async (req, res) => {
    try {
      const { question, studentAnswer, questionType = "Essay", context = "" } = req.body;

      const prompt = `Evaluate the student's submission carefully against standard academic rubrics.
Question Asked: "${question}"
Question Type: "${questionType}"
Student's Answer: "${studentAnswer}"
Context / Correct Reference: "${context}"

Provide a structured evaluation in JSON format:
- score: Integer out of 100
- passed: Boolean
- feedback: Paragraph explaining overall performance
- rubricGrades: Object detailing scores (0-10) for categories:
  - accuracy: accuracy and correctness
  - reasoning: logic & depth
  - structure: presentation/organization
  - originality: uniqueness or code elegance
- strengths: List of 2 strengths in their response
- keyMistakes: List of 2 key mistakes or omissions
- suggestions: List of 3 highly actionable, specific revision recommendations`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: "You are a professional university grading evaluator. Score strictly, give helpful, actionable, detailed critiques.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              passed: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
              rubricGrades: {
                type: Type.OBJECT,
                properties: {
                  accuracy: { type: Type.INTEGER },
                  reasoning: { type: Type.INTEGER },
                  structure: { type: Type.INTEGER },
                  originality: { type: Type.INTEGER }
                },
                required: ["accuracy", "reasoning", "structure", "originality"]
              },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              keyMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["score", "passed", "feedback", "rubricGrades", "strengths", "keyMistakes", "suggestions"]
          }
        }
      });

      let evaluation = {};
      try {
        if (response.text) {
          evaluation = JSON.parse(response.text.trim());
        }
      } catch (err) {
        console.error("Failed to parse evaluation response:", err);
      }

      res.json(evaluation);
    } catch (error: any) {
      console.error("Error in /api/evaluate-submission:", error);
      res.status(500).json({ error: error.message || "Failed to score submission." });
    }
  });

  // Endpoint 8: AI Content Generator (Notes, Assignments, PowerPoint structure, Lesson plans)
  app.post("/api/generate-coursework", checkApiKey, async (req, res) => {
    try {
      const { topic, materialType = "Lecture Notes", audience = "University Students" } = req.body;

      const prompt = `Generate a high-quality educational resource.
Topic: "${topic}"
Resource Type: "${materialType}" (e.g. Lecture Notes, Assignment Prompt, Lesson Plan, Slides Structure)
Target Audience: "${audience}"

Structure your response perfectly as a professional, thorough coursework document in Markdown.
Ensure you include comprehensive explanations, realistic examples, mathematical equations or code blocks if relevant, and 3 key study questions at the end.`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: "You are a senior university professor and curriculum director creating elite educational resources.",
          temperature: 0.7,
        }
      });

      res.json({ content: response.text || "" });
    } catch (error: any) {
      console.error("Error in /api/generate-coursework:", error);
      res.status(500).json({ error: error.message || "Failed to generate coursework material." });
    }
  });

  // Endpoint 9: AI Study Planner (Generates personalized schedule and diagnostic alerts)
  app.post("/api/generate-study-plan", checkApiKey, async (req, res) => {
    try {
      const { weakSubjects = [], targetHours = 10, examGoal = "Term Exam Preparation" } = req.body;

      const prompt = `Generate a highly practical, hourly Study & Revision Timetable.
Weak Subjects to Focus on: ${JSON.stringify(weakSubjects)}
Target Study Hours per week: ${targetHours} hours
Ultimate Learning Goal: "${examGoal}"

Provide a structured study plan in JSON format:
- summary: paragraph outlining the core focus strategy
- weeklyMilestone: milestone objective for the week
- timetable: array of timetable slots, each with:
  - day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"
  - timeSlot: e.g. "09:00 AM - 11:00 AM"
  - subject: subject name
  - topicToStudy: granular topic focus
  - method: "Active Recall" | "Socratic Chat" | "Virtual Practical Lab" | "Continuous Quiz"
  - durationMins: integer duration
- diagnosticTips: list of 3 tips to maintain academic standards and handle exam stress`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: "You are an expert student psychologist and study coach who organizes hyper-efficient active-recall study timetables.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              weeklyMilestone: { type: Type.STRING },
              timetable: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.STRING },
                    timeSlot: { type: Type.STRING },
                    subject: { type: Type.STRING },
                    topicToStudy: { type: Type.STRING },
                    method: { type: Type.STRING },
                    durationMins: { type: Type.INTEGER }
                  },
                  required: ["day", "timeSlot", "subject", "topicToStudy", "method", "durationMins"]
                }
              },
              diagnosticTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["summary", "weeklyMilestone", "timetable", "diagnosticTips"]
          }
        }
      });

      let planData = {};
      try {
        if (response.text) {
          planData = JSON.parse(response.text.trim());
        }
      } catch (err) {
        console.error("Failed to parse study plan response:", err);
      }

      res.json(planData);
    } catch (error: any) {
      console.error("Error in /api/generate-study-plan:", error);
      res.status(500).json({ error: error.message || "Failed to generate study timetable." });
    }
  });

  // Endpoint 10: Career Guidance Advisory
  app.post("/api/career-advice", checkApiKey, async (req, res) => {
    try {
      const { skills = [], performanceMetrics = {}, interests = [] } = req.body;

      const prompt = `Formulate an elite personalized Career Advisory Report.
Student Skills: ${JSON.stringify(skills)}
Student Interests: ${JSON.stringify(interests)}
Academic Performance Summary: ${JSON.stringify(performanceMetrics)}

Provide structured JSON career advice:
- targetRole: recommended professional career title
- fitJustification: short paragraph justifying the fit
- certifiedMilestones: list of 3 industry certifications to target (e.g. CCNA, AWS Cloud Practitioner)
- universityRecommendations: list of 3 prestigious global universities & specialized degree pathways
- jobDemandSalary: short demand description and median starting salary estimation
- actionableNextSteps: list of 3 tasks to implement immediately`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: "You are a professional executive career guidance counselor and academic advisor.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              targetRole: { type: Type.STRING },
              fitJustification: { type: Type.STRING },
              certifiedMilestones: { type: Type.ARRAY, items: { type: Type.STRING } },
              universityRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              jobDemandSalary: { type: Type.STRING },
              actionableNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["targetRole", "fitJustification", "certifiedMilestones", "universityRecommendations", "jobDemandSalary", "actionableNextSteps"]
          }
        }
      });

      let careerData = {};
      try {
        if (response.text) {
          careerData = JSON.parse(response.text.trim());
        }
      } catch (err) {
        console.error("Failed to parse career advice response:", err);
      }

      res.json(careerData);
    } catch (error: any) {
      console.error("Error in /api/career-advice:", error);
      res.status(500).json({ error: error.message || "Failed to formulate career guidance." });
    }
  });

  // Setup Vite middleware for Asset Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
