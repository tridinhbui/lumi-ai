-- Migration: Add memory management tables for Phase 1
-- Run this SQL in your Supabase SQL Editor

-- Create chat_sessions table for persistent session management
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  context_summary TEXT,
  last_message_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(thread_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_chat_sessions_thread_id ON chat_sessions(thread_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);

-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_sessions
CREATE POLICY "Users can view their own sessions"
  ON chat_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads 
      WHERE chat_threads.id = chat_sessions.thread_id 
      AND (chat_threads.user_id = auth.uid()::text OR chat_threads.user_id = current_setting('app.user_id', true))
    )
  );

CREATE POLICY "Users can create their own sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_threads 
      WHERE chat_threads.id = chat_sessions.thread_id 
      AND (chat_threads.user_id = auth.uid()::text OR chat_threads.user_id = current_setting('app.user_id', true))
    )
  );

CREATE POLICY "Users can update their own sessions"
  ON chat_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads 
      WHERE chat_threads.id = chat_sessions.thread_id 
      AND (chat_threads.user_id = auth.uid()::text OR chat_threads.user_id = current_setting('app.user_id', true))
    )
  );

CREATE POLICY "Users can delete their own sessions"
  ON chat_sessions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads 
      WHERE chat_threads.id = chat_sessions.thread_id 
      AND (chat_threads.user_id = auth.uid()::text OR chat_threads.user_id = current_setting('app.user_id', true))
    )
  );

-- Add metadata column to chat_messages for future enhancements
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add tags column for message categorization
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create index for metadata queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_metadata ON chat_messages USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_chat_messages_tags ON chat_messages USING GIN(tags);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_chat_sessions_timestamp
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_sessions_updated_at();

-- Function to sync message count with session
CREATE OR REPLACE FUNCTION sync_session_message_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE chat_sessions
    SET last_message_count = (
      SELECT COUNT(*) FROM chat_messages WHERE thread_id = NEW.thread_id
    ),
    updated_at = NOW()
    WHERE thread_id = NEW.thread_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE chat_sessions
    SET last_message_count = (
      SELECT COUNT(*) FROM chat_messages WHERE thread_id = OLD.thread_id
    ),
    updated_at = NOW()
    WHERE thread_id = OLD.thread_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update message count
CREATE TRIGGER sync_session_message_count_trigger
  AFTER INSERT OR DELETE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION sync_session_message_count();

-- Create thread_summaries table for Phase 2
CREATE TABLE IF NOT EXISTS thread_summaries (
  thread_id UUID PRIMARY KEY REFERENCES chat_threads(id) ON DELETE CASCADE,
  key_topics TEXT[] DEFAULT '{}',
  main_insights TEXT[] DEFAULT '{}',
  decisions_made TEXT[] DEFAULT '{}',
  important_facts JSONB DEFAULT '{}',
  frameworks_used TEXT[] DEFAULT '{}',
  last_summarized_at TIMESTAMPTZ DEFAULT NOW(),
  message_count INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for thread_summaries
CREATE INDEX IF NOT EXISTS idx_thread_summaries_updated_at ON thread_summaries(updated_at DESC);

-- Enable RLS
ALTER TABLE thread_summaries ENABLE ROW LEVEL SECURITY;

-- Create policies for thread_summaries
CREATE POLICY "Users can view their own thread summaries"
  ON thread_summaries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads 
      WHERE chat_threads.id = thread_summaries.thread_id 
      AND (chat_threads.user_id = auth.uid()::text OR chat_threads.user_id = current_setting('app.user_id', true))
    )
  );

CREATE POLICY "Users can create their own thread summaries"
  ON thread_summaries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_threads 
      WHERE chat_threads.id = thread_summaries.thread_id 
      AND (chat_threads.user_id = auth.uid()::text OR chat_threads.user_id = current_setting('app.user_id', true))
    )
  );

CREATE POLICY "Users can update their own thread summaries"
  ON thread_summaries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads 
      WHERE chat_threads.id = thread_summaries.thread_id 
      AND (chat_threads.user_id = auth.uid()::text OR chat_threads.user_id = current_setting('app.user_id', true))
    )
  );

-- Function to auto-update updated_at for thread_summaries
CREATE OR REPLACE FUNCTION update_thread_summaries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_thread_summaries_timestamp
  BEFORE UPDATE ON thread_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_summaries_updated_at();

