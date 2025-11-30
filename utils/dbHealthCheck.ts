/**
 * Database health check utility
 * Checks if Supabase is properly configured and accessible
 */

import { supabase } from '../services/supabaseService';

export interface DBHealthStatus {
  isConfigured: boolean;
  isConnected: boolean;
  hasTables: boolean;
  error?: string;
}

/**
 * Check database health and configuration
 */
export async function checkDatabaseHealth(): Promise<DBHealthStatus> {
  const status: DBHealthStatus = {
    isConfigured: !!supabase,
    isConnected: false,
    hasTables: false,
  };

  if (!supabase) {
    status.error = 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local';
    return status;
  }

  try {
    // Test connection by querying chat_threads table
    const { data, error } = await supabase
      .from('chat_threads')
      .select('count')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116') {
        status.error = 'Tables not found. Please run the SQL migrations in Supabase dashboard.';
        status.hasTables = false;
      } else if (error.code === 'PGRST301') {
        status.error = 'RLS policy error. Please check Row Level Security policies.';
      } else {
        status.error = `Database error: ${error.message}`;
      }
      return status;
    }

    status.isConnected = true;
    status.hasTables = true;
    return status;
  } catch (error: any) {
    status.error = `Connection error: ${error.message}`;
    return status;
  }
}

/**
 * Log database status to console
 */
export async function logDatabaseStatus(): Promise<void> {
  const status = await checkDatabaseHealth();
  
  console.group('📊 Database Health Check');
  console.log('Configured:', status.isConfigured ? '✅' : '❌');
  console.log('Connected:', status.isConnected ? '✅' : '❌');
  console.log('Tables exist:', status.hasTables ? '✅' : '❌');
  
  if (status.error) {
    console.error('Error:', status.error);
  } else {
    console.log('Status: All systems operational ✅');
  }
  
  if (!status.isConfigured) {
    console.warn('⚠️  Supabase is not configured. Data will be saved to localStorage only.');
    console.warn('   To enable database storage, add to .env.local:');
    console.warn('   VITE_SUPABASE_URL=your_supabase_url');
    console.warn('   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  }
  
  console.groupEnd();
}

