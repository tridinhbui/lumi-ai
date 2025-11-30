import { Message } from '../types';
import { getMessages } from './supabaseService';
import { GoogleGenAI } from '@google/genai';

// Configuration
const MAX_CONTEXT_MESSAGES = 20; // Keep last N messages in full detail
const MAX_TOKENS_ESTIMATE = 8000; // Approximate token limit
const TOKENS_PER_MESSAGE = 100; // Rough estimate

export interface ChatSession {
  id: string;
  thread_id: string;
  context_summary?: string;
  last_message_count: number;
  created_at: number;
  updated_at: number;
}

export interface ContextWindow {
  summary?: string;
  messages: Message[];
  totalTokens: number;
}

/**
 * Builds an optimized context window for the chat session
 * Uses sliding window approach: keeps recent messages + summary of older ones
 */
export const buildContextWindow = async (
  threadId: string,
  maxMessages: number = MAX_CONTEXT_MESSAGES
): Promise<ContextWindow> => {
  try {
    const allMessages = await getMessages(threadId);
    
    if (allMessages.length <= maxMessages) {
      // No need for summarization
      return {
        messages: allMessages,
        totalTokens: estimateTokens(allMessages),
      };
    }

    // Split into old and recent messages
    const oldMessages = allMessages.slice(0, allMessages.length - maxMessages);
    const recentMessages = allMessages.slice(-maxMessages);

    // Summarize old messages
    const summary = await summarizeMessages(oldMessages);

    return {
      summary,
      messages: recentMessages,
      totalTokens: estimateTokens(recentMessages) + estimateTokens([{
        id: 'summary',
        sender: 'bot' as const,
        type: 'text' as any,
        content: summary,
        timestamp: Date.now(),
      }]),
    };
  } catch (error) {
    console.error('Error building context window:', error);
    // Fallback: return all messages
    const allMessages = await getMessages(threadId);
    return {
      messages: allMessages,
      totalTokens: estimateTokens(allMessages),
    };
  }
};

/**
 * Summarizes a list of messages using Gemini
 */
const summarizeMessages = async (messages: Message[]): Promise<string> => {
  if (messages.length === 0) return '';

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback: simple text summary
      return createSimpleSummary(messages);
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Create a summary prompt
    const conversationText = messages
      .map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const summaryPrompt = `Summarize the following conversation concisely. Focus on:
1. Key topics discussed
2. Important insights or decisions made
3. Relevant facts or data mentioned
4. Any frameworks or methodologies used

Conversation:
${conversationText}

Provide a concise summary (2-3 sentences):`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        temperature: 0.3,
        systemInstruction: 'You are a conversation summarizer. Create concise, informative summaries.',
      },
    });

    const response = await chat.sendMessage({ message: summaryPrompt });
    return response.text || createSimpleSummary(messages);
  } catch (error) {
    console.error('Error summarizing messages:', error);
    return createSimpleSummary(messages);
  }
};

/**
 * Creates a simple text-based summary as fallback
 */
const createSimpleSummary = (messages: Message[]): string => {
  const userMessages = messages.filter(m => m.sender === 'user');
  const botMessages = messages.filter(m => m.sender === 'bot');
  
  return `Previous conversation: ${userMessages.length} user messages and ${botMessages.length} assistant responses. Key topics discussed in earlier part of conversation.`;
};

/**
 * Estimates token count for messages (rough approximation)
 */
const estimateTokens = (messages: Message[]): number => {
  return messages.reduce((total, msg) => {
    // Rough estimate: 1 token ≈ 4 characters
    const tokenCount = Math.ceil(msg.content.length / 4);
    return total + tokenCount + TOKENS_PER_MESSAGE; // Add overhead per message
  }, 0);
};

/**
 * Converts messages to Gemini chat format
 */
export const messagesToGeminiFormat = (messages: Message[], summary?: string): any[] => {
  const parts: any[] = [];

  // Add summary if available
  if (summary) {
    parts.push({
      role: 'user',
      parts: [{ text: `Context from previous conversation: ${summary}` }],
    });
    parts.push({
      role: 'model',
      parts: [{ text: 'Understood. I have the context from the previous conversation.' }],
    });
  }

  // Convert messages to Gemini format
  messages.forEach(msg => {
    parts.push({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    });
  });

  return parts;
};

/**
 * Checks if context window needs summarization
 */
export const needsSummarization = (messageCount: number): boolean => {
  return messageCount > MAX_CONTEXT_MESSAGES;
};

/**
 * Gets conversation history for a thread in optimized format
 */
export const getConversationHistory = async (
  threadId: string
): Promise<{ summary?: string; recentMessages: Message[] }> => {
  const contextWindow = await buildContextWindow(threadId);
  
  return {
    summary: contextWindow.summary,
    recentMessages: contextWindow.messages,
  };
};

