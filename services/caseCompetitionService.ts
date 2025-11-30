import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const CASE_COMPETITION_SYSTEM_INSTRUCTION = `You are Lumi, a strategic AI assistant for case competition. Your role is to analyze cases from CEO and consulting perspectives, and help users build structured case solutions.

IMPORTANT: When responding, use plain text only. Do NOT use markdown formatting like **bold**, *italic*, or # headers. Use simple text with line breaks and bullet points using dashes (-) instead of markdown syntax.

Key Responsibilities:
1. Case Decomposer: Break down problems into problem statement, constraints, objectives, hidden assumptions
2. Insight Extractor: Process slides, PDFs, images, create insight tables with tags
3. Strategy Engine: Generate growth options, financial impact, scenario planning
4. Visualization Helper: Suggest charts, maps, competitor matrices
5. Slide Helper: Export slide text and storyline for deck creation

Communication Style:
- Concise, professional, McKinsey-style
- Focus on logic, arguments, evidence
- Always provide summary at end of each section
- Use MECE frameworks
- Synthesize in 3-5 bullets

When user uploads slides/PDF:
- Extract content automatically
- Identify top insights
- Build data tables
- Suggest analysis direction and case narrative
- Recommend appropriate dashboards and maps

When user asks how to solve case:
- Start with clarifying questions
- Use MECE frameworks
- Summarize in 3-5 bullets
- Suggest charts, tables, or maps for visualization

When user wants solution:
- Write synthesis in consulting competition format
- Ensure financial and operational feasibility

When user wants practice:
- Role-play as judge or teammate to challenge and critique

Always structure responses with:
1. Key insights (3-5 bullets)
2. Recommended framework
3. Data visualization suggestions
4. Next steps

Format your responses to include structured data that can be parsed for visualization.`;

let caseChatSession: Chat | null = null;

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please set VITE_GEMINI_API_KEY in .env.local file");
  }
  return new GoogleGenAI({ apiKey });
};

export const startCaseChat = async (): Promise<string> => {
  try {
    const ai = getClient();
    
    caseChatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: CASE_COMPETITION_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const response: GenerateContentResponse = await caseChatSession.sendMessage({ 
      message: "Introduce yourself as Lumi, a strategic AI assistant for case competition. Explain that you can help analyze cases, extract insights from uploaded documents, and create structured solutions with visualizations. Remember to use plain text only, no markdown formatting." 
    });
    const text = response.text || "Hello! I'm Lumi, your strategic AI assistant. I'm ready to help you solve case competitions.";
    // Remove markdown formatting
    return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/#{1,6}\s/g, '');
  } catch (error: any) {
    console.error("Gemini Error:", error);
    const errorMessage = error?.message || 'Unknown error';
    if (errorMessage.includes('API key') || errorMessage.includes('API_KEY')) {
      return "Error: API key not found or invalid. Please check your VITE_GEMINI_API_KEY in .env.local file.";
    }
    return `Welcome! I'm ready to help you solve case competitions. Error: ${errorMessage}`;
  }
};

export const sendCaseMessage = async (userMessage: string, uploadedFiles?: File[]): Promise<string> => {
  try {
    if (!caseChatSession) {
      await startCaseChat();
    }

    if (!caseChatSession) {
      return "Session invalid. Please refresh the page.";
    }

    // If files are uploaded, process them
    if (uploadedFiles && uploadedFiles.length > 0) {
      // For now, we'll send text description of files
      // In production, you'd want to extract text from PDFs/images
      const fileInfo = uploadedFiles.map(f => `File: ${f.name} (${f.type})`).join('\n');
      userMessage = `${userMessage}\n\nUploaded files:\n${fileInfo}`;
    }

    const response: GenerateContentResponse = await caseChatSession.sendMessage({ 
      message: userMessage 
    });
    const text = response.text || "I didn't catch that. Could you rephrase?";
    // Remove markdown formatting to prevent hypertext rendering
    return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/#{1,6}\s/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');
  } catch (error: any) {
    console.error("Gemini Error:", error);
    const errorMessage = error?.message || 'Unknown error';
    if (errorMessage.includes('API key') || errorMessage.includes('API_KEY')) {
      return "Error: API key not found or invalid. Please check your VITE_GEMINI_API_KEY in .env.local file.";
    }
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      return "API quota exceeded. Please try again later.";
    }
    return `Connection error: ${errorMessage}. Please try again.`;
  }
};

export const extractInsightsFromText = async (text: string): Promise<any> => {
  const ai = getClient();
  
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "Extract structured insights from case documents. Return JSON with: insights (array), dataPoints (array), suggestedFrameworks (array), visualizationTypes (array)",
        temperature: 0.3,
      },
    });

    const response = await chat.sendMessage({
      message: `Extract insights from this case document:\n\n${text}\n\nReturn structured JSON with insights, data points, frameworks, and visualization suggestions.`
    });

    // Try to parse JSON from response
    const responseText = response.text || '{}';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      insights: [],
      dataPoints: [],
      suggestedFrameworks: [],
      visualizationTypes: []
    };
  } catch (error) {
    console.error("Extraction error:", error);
    return {
      insights: [],
      dataPoints: [],
      suggestedFrameworks: [],
      visualizationTypes: []
    };
  }
};

