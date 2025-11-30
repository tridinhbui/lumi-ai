import { createClient } from '@supabase/supabase-js';
import { Message } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using localStorage fallback.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface ChatThread {
  id: string;
  user_id: string;
  name: string;
  mode: 'case-competition' | 'general';
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  sender: 'user' | 'bot';
  content: string;
  message_type: string;
  timestamp: number;
  created_at: string;
}

// Initialize database tables (run once)
export const initializeDatabase = async () => {
  if (!supabase) return;

  // Tables will be created via Supabase SQL editor or migrations
  // For now, we'll just verify connection
  try {
    const { data, error } = await supabase.from('chat_threads').select('count').limit(1);
    if (error && error.code === 'PGRST116') {
      console.warn('Tables not found. Please create them in Supabase dashboard.');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Thread operations
export const createThread = async (userId: string, name: string, mode: 'case-competition' | 'general'): Promise<string | null> => {
  if (!supabase) {
    // Fallback to localStorage
    const threadId = Date.now().toString();
    const threads = JSON.parse(localStorage.getItem('chat_threads') || '[]');
    threads.push({
      id: threadId,
      user_id: userId,
      name,
      mode,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    localStorage.setItem('chat_threads', JSON.stringify(threads));
    return threadId;
  }

  try {
    const { data, error } = await supabase
      .from('chat_threads')
      .insert({
        user_id: userId,
        name,
        mode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error creating thread:', error);
    return null;
  }
};

export const getThreads = async (userId: string): Promise<ChatThread[]> => {
  if (!supabase) {
    // Fallback to localStorage
    const threads = JSON.parse(localStorage.getItem('chat_threads') || '[]');
    return threads.filter((t: ChatThread) => t.user_id === userId);
  }

  try {
    const { data, error } = await supabase
      .from('chat_threads')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching threads:', error);
    return [];
  }
};

export const deleteThread = async (threadId: string): Promise<boolean> => {
  if (!supabase) {
    // Fallback to localStorage
    const threads = JSON.parse(localStorage.getItem('chat_threads') || '[]');
    const filtered = threads.filter((t: ChatThread) => t.id !== threadId);
    localStorage.setItem('chat_threads', JSON.stringify(filtered));
    
    // Also delete messages
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    const filteredMessages = messages.filter((m: ChatMessage) => m.thread_id !== threadId);
    localStorage.setItem('chat_messages', JSON.stringify(filteredMessages));
    return true;
  }

  try {
    // Delete messages first
    await supabase.from('chat_messages').delete().eq('thread_id', threadId);
    
    // Then delete thread
    const { error } = await supabase.from('chat_threads').delete().eq('id', threadId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting thread:', error);
    return false;
  }
};

// Message operations
export const saveMessage = async (threadId: string, message: Message): Promise<boolean> => {
  if (!supabase) {
    // Fallback to localStorage
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    messages.push({
      id: message.id,
      thread_id: threadId,
      sender: message.sender,
      content: message.content,
      message_type: message.type,
      timestamp: message.timestamp,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    return true;
  }

  try {
    const { error } = await supabase.from('chat_messages').insert({
      id: message.id,
      thread_id: threadId,
      sender: message.sender,
      content: message.content,
      message_type: message.type,
      timestamp: message.timestamp,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving message:', error);
    return false;
  }
};

export const getMessages = async (threadId: string): Promise<Message[]> => {
  if (!supabase) {
    // Fallback to localStorage
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    const threadMessages = messages
      .filter((m: ChatMessage) => m.thread_id === threadId)
      .sort((a: ChatMessage, b: ChatMessage) => a.timestamp - b.timestamp);
    
    return threadMessages.map((m: ChatMessage) => ({
      id: m.id,
      sender: m.sender as 'user' | 'bot',
      type: m.message_type as any,
      content: m.content,
      timestamp: m.timestamp,
    }));
  }

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    
    return (data || []).map((m: ChatMessage) => ({
      id: m.id,
      sender: m.sender as 'user' | 'bot',
      type: m.message_type as any,
      content: m.content,
      timestamp: m.timestamp,
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const updateThreadTimestamp = async (threadId: string): Promise<void> => {
  if (!supabase) return;

  try {
    await supabase
      .from('chat_threads')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', threadId);
  } catch (error) {
    console.error('Error updating thread timestamp:', error);
  }
};

// Session management operations
export interface ChatSession {
  id: string;
  thread_id: string;
  context_summary?: string;
  last_message_count: number;
  created_at: string;
  updated_at: string;
}

export const createOrUpdateSession = async (
  threadId: string,
  contextSummary?: string
): Promise<ChatSession | null> => {
  if (!supabase) {
    // Fallback: return mock session
    return {
      id: Date.now().toString(),
      thread_id: threadId,
      context_summary: contextSummary,
      last_message_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  try {
    // Get current message count
    const messages = await getMessages(threadId);
    const messageCount = messages.length;

    // Try to update existing session
    const { data: existing } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('thread_id', threadId)
      .single();

    if (existing) {
      // Update existing session
      const { data, error } = await supabase
        .from('chat_sessions')
        .update({
          context_summary: contextSummary,
          last_message_count: messageCount,
          updated_at: new Date().toISOString(),
        })
        .eq('thread_id', threadId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new session
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          thread_id: threadId,
          context_summary: contextSummary,
          last_message_count: messageCount,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error creating/updating session:', error);
    return null;
  }
};

export const getSession = async (threadId: string): Promise<ChatSession | null> => {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('thread_id', threadId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
};

// Thread summary operations
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

export const saveThreadSummary = async (summary: ThreadSummary): Promise<boolean> => {
  if (!supabase) {
    // Fallback: localStorage
    const summaries = JSON.parse(localStorage.getItem('thread_summaries') || '[]');
    const existingIndex = summaries.findIndex((s: ThreadSummary) => s.thread_id === summary.thread_id);
    
    if (existingIndex >= 0) {
      summaries[existingIndex] = summary;
    } else {
      summaries.push(summary);
    }
    
    localStorage.setItem('thread_summaries', JSON.stringify(summaries));
    return true;
  }

  try {
    const { error } = await supabase
      .from('thread_summaries')
      .upsert({
        thread_id: summary.thread_id,
        key_topics: summary.key_topics,
        main_insights: summary.main_insights,
        decisions_made: summary.decisions_made,
        important_facts: summary.important_facts,
        frameworks_used: summary.frameworks_used,
        last_summarized_at: new Date(summary.last_summarized_at).toISOString(),
        message_count: summary.message_count,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'thread_id',
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving thread summary:', error);
    return false;
  }
};

export const getThreadSummary = async (threadId: string): Promise<ThreadSummary | null> => {
  if (!supabase) {
    // Fallback: localStorage
    const summaries = JSON.parse(localStorage.getItem('thread_summaries') || '[]');
    const summary = summaries.find((s: ThreadSummary) => s.thread_id === threadId);
    return summary || null;
  }

  try {
    const { data, error } = await supabase
      .from('thread_summaries')
      .select('*')
      .eq('thread_id', threadId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return null;

    return {
      thread_id: data.thread_id,
      key_topics: data.key_topics || [],
      main_insights: data.main_insights || [],
      decisions_made: data.decisions_made || [],
      important_facts: data.important_facts || {},
      frameworks_used: data.frameworks_used || [],
      last_summarized_at: new Date(data.last_summarized_at).getTime(),
      message_count: data.message_count || 0,
    };
  } catch (error) {
    console.error('Error fetching thread summary:', error);
    return null;
  }
};

