import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export interface CoachInsight {
  content: string;
  type: 'strategy' | 'focus' | 'rest' | 'motivation';
}

const createTaskTool: FunctionDeclaration = {
  name: "create_task",
  description: "Schedule a new task or activity for the user.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "The name of the task, e.g., 'Read for 30 mins' or 'Morning Workout'.",
      },
      description: {
        type: Type.STRING,
        description: "A short detail about the task.",
      },
      category: {
        type: Type.STRING,
        description: "The category: work, fitness, learning, health, personal.",
      },
      priority: {
        type: Type.STRING,
        enum: ["low", "medium", "high"],
      },
      dueDate: {
        type: Type.STRING,
        description: "The deadline for the task in ISO format or relative time string.",
      }
    },
    required: ["title", "description", "category", "priority"],
  },
};

export async function getCoachInsight(tasks: any[], userData: any): Promise<CoachInsight | null> {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        You are a cinematic high-performance productivity coach. 
        Analyze this user's state:
        - Current Plan: ${userData?.plan || 'free'}
        - Productivity Score: ${userData?.pScore || 75}
        - Active Tasks: ${JSON.stringify(tasks.filter(t => !t.completed).map(t => t.title))}
        
        Provide ONE short, powerful, futuristic insight or strategy (max 25 words).
        Reply ONLY with a JSON object: { "content": "insight text", "type": "strategy|focus|rest|motivation" }
      `,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text.trim()) as CoachInsight;
  } catch (error) {
    console.error("AI insight failed:", error);
    return null;
  }
}

export async function getChatResponse(messages: { role: string, content: string }[], userData: any): Promise<{ text: string, functionCall?: any }> {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) return { text: "Neural link offline. (API Key missing)" };

  try {
    // Filter history to start with 'user'
    let history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    
    while (history.length > 0 && history[0].role !== 'user') {
      history.shift();
    }

    const systemPrompt = `
      You are the SmartFlow Core AI, a cinematic high-performance productivity assistant. 
      The user is ${userData?.name || 'Architect'} on the ${userData?.plan || 'free'} plan.
      Your tone is technical, supportive, and futuristic. 
      Keep responses concise and actionable.
      
      CAPABILITIES:
      1. Schedule tasks using the 'create_task' tool.
      2. Analyze productivity blocks and suggest focus strategies.
      3. Create learning roadmaps for technical domains (VLSI, AI, WebDev, etc.).
      
      When the user asks for a "roadmap" or "how to learn [domain]", provide a clear, phase-based structure and offer to schedule the first tasks.
    `;

    const lastMessage = messages[messages.length - 1].content;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        ...history,
        { role: 'user', parts: [{ text: lastMessage }] }
      ],
      config: {
        tools: [{ functionDeclarations: [createTaskTool] }]
      }
    });

    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      return { 
        text: "Initiating neural task synchronization... Task successfully queued for implementation.", 
        functionCall: functionCalls[0] 
      };
    }

    return { text: response.text || "Neural resonance received." };
  } catch (error) {
    console.error("AI chat failed:", error);
    return { text: "Neural disruption detected. Please retry sync." };
  }
}
