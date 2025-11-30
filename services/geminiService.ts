import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let chatSession: Chat | null = null;

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const startChat = async (): Promise<string> => {
  const ai = getClient();
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, 
    },
  });

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ 
      message: "Start the interview. Introduce the case of GreenFlow Logistics." 
    });
    return response.text || "Error starting case.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm having trouble connecting to the case server. Please check your API key.";
  }
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  if (!chatSession) {
    await startChat();
  }

  if (!chatSession) {
    return "Session invalid.";
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ 
      message: userMessage 
    });
    return response.text || "I didn't catch that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection error. Please try again.";
  }
};
