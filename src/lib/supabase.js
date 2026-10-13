import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

// Graceful client creation so app never crashes if keys are not yet provided
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Sign in user with email & password
 */
export async function signInUser(email, password) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

/**
 * Sign up user with email & password
 */
export async function signUpUser(email, password, metadata = {}) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.warn('Could not fetch user profile from Supabase:', error.message);
    return null;
  }
  return data;
}
