import { Message } from '../types';
import { getMessages } from './supabaseService';
import { GoogleGenAI } from '@google/genai';

export interface ThreadSummary {
  thread_id: string;
  key_topics: string[];
  main_insights: string[];
  decisions_made: string[];
  important_facts: Record<string, any>;
  frameworks_used: string[];
  last_summarized_at: number;
  message_count: number;
}

/**
 * Summarizes a thread and extracts key information
 */
export const summarizeThread = async (threadId: string): Promise<ThreadSummary | null> => {
  try {
    const messages = await getMessages(threadId);
    
    if (messages.length === 0) {
      return null;
    }

    // Use Gemini to extract structured information
    const summary = await extractStructuredSummary(messages);
    
    return {
      thread_id: threadId,
      key_topics: summary.key_topics || [],
      main_insights: summary.main_insights || [],
      decisions_made: summary.decisions_made || [],
      important_facts: summary.important_facts || {},
      frameworks_used: summary.frameworks_used || [],
      last_summarized_at: Date.now(),
      message_count: messages.length,
    };
  } catch (error) {
    console.error('Error summarizing thread:', error);
    return null;
  }
};

/**
 * Extracts structured summary using Gemini
 */
const extractStructuredSummary = async (messages: Message[]): Promise<Partial<ThreadSummary>> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return createSimpleSummary(messages);
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Build conversation text
    const conversationText = messages
      .slice(0, 50) // Limit to last 50 messages for summarization
      .map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const summaryPrompt = `Analyze this conversation and extract structured information. Return a JSON object with:
{
  "key_topics": ["topic1", "topic2", ...],
  "main_insights": ["insight1", "insight2", ...],
  "decisions_made": ["decision1", "decision2", ...],
  "important_facts": {"fact_name": "value", ...},
  "frameworks_used": ["framework1", "framework2", ...]
}

Focus on:
- Key topics discussed (3-5 main topics)
- Main insights or conclusions (3-5 insights)
- Decisions or action items made
- Important facts, numbers, or data points
- Business frameworks or methodologies mentioned (e.g., MECE, Porter's 5 Forces, SWOT)

Conversation:
${conversationText}

Return ONLY valid JSON, no additional text:`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        temperature: 0.3,
        systemInstruction: 'You are a conversation analyzer. Extract structured information and return valid JSON only.',
      },
    });

    const response = await chat.sendMessage({ message: summaryPrompt });
    const responseText = response.text || '{}';
    
    // Try to extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn('Failed to parse JSON summary:', e);
      }
    }
    
    return createSimpleSummary(messages);
  } catch (error) {
    console.error('Error extracting structured summary:', error);
    return createSimpleSummary(messages);
  }
};

/**
 * Creates a simple summary as fallback
 */
const createSimpleSummary = (messages: Message[]): Partial<ThreadSummary> => {
  const userMessages = messages.filter(m => m.sender === 'user');
  const botMessages = messages.filter(m => m.sender === 'bot');
  
  // Extract basic topics from message content
  const topics: string[] = [];
  const insights: string[] = [];
  
  // Simple keyword extraction
  const content = messages.map(m => m.content.toLowerCase()).join(' ');
  
  if (content.includes('market') || content.includes('thị trường')) {
    topics.push('Market Analysis');
  }
  if (content.includes('pricing') || content.includes('giá')) {
    topics.push('Pricing Strategy');
  }
  if (content.includes('competitor') || content.includes('đối thủ')) {
    topics.push('Competitive Analysis');
  }
  if (content.includes('growth') || content.includes('tăng trưởng')) {
    topics.push('Growth Strategy');
  }
  if (content.includes('financial') || content.includes('tài chính')) {
    topics.push('Financial Analysis');
  }

  // Extract frameworks mentioned
  const frameworks: string[] = [];
  if (content.includes('mece')) frameworks.push('MECE');
  if (content.includes('porter') || content.includes("5 forces")) frameworks.push("Porter's 5 Forces");
  if (content.includes('swot')) frameworks.push('SWOT');
  if (content.includes('bcg')) frameworks.push('BCG Matrix');
  if (content.includes('value chain')) frameworks.push('Value Chain');

  return {
    key_topics: topics.length > 0 ? topics : ['General Discussion'],
    main_insights: insights.length > 0 ? insights : [`${userMessages.length} questions asked, ${botMessages.length} responses provided`],
    decisions_made: [],
    important_facts: {
      total_messages: messages.length,
      user_messages: userMessages.length,
      bot_messages: botMessages.length,
    },
    frameworks_used: frameworks,
  };
};

/**
 * Auto-summarize thread if it hasn't been summarized recently
 */
export const autoSummarizeThread = async (
  threadId: string,
  force: boolean = false
): Promise<ThreadSummary | null> => {
  try {
    // Check if summary exists and is recent
    const existingSummary = await getThreadSummary(threadId);
    
    if (!force && existingSummary) {
      const messages = await getMessages(threadId);
      const newMessageCount = messages.length;
      
      // Only re-summarize if significant new messages (20+ new messages)
      if (newMessageCount - existingSummary.message_count < 20) {
        return existingSummary;
      }
    }

    // Create new summary
    return await summarizeThread(threadId);
  } catch (error) {
    console.error('Error in auto-summarize:', error);
    return null;
  }
};

/**
 * Gets existing thread summary from database
 */
export const getThreadSummary = async (threadId: string): Promise<ThreadSummary | null> => {
  try {
    const { getThreadSummary: getSummaryFromDB } = await import('./supabaseService');
    return await getSummaryFromDB(threadId);
  } catch (error) {
    console.error('Error getting thread summary:', error);
    return null;
  }
};

/**
 * Saves thread summary to database
 */
export const saveThreadSummary = async (summary: ThreadSummary): Promise<boolean> => {
  try {
    const { saveThreadSummary: saveSummaryToDB } = await import('./supabaseService');
    return await saveSummaryToDB(summary);
  } catch (error) {
    console.error('Error saving thread summary:', error);
    return false;
  }
};

