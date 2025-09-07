import { createClient } from '@supabase/supabase-js';
import { User, LogoRequest, GeneratedLogo } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User Management
export async function signUpUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Logo Request Management
export async function createLogoRequest(logoRequest: Omit<LogoRequest, 'requestId'>) {
  const { data, error } = await supabase
    .from('logo_requests')
    .insert([logoRequest])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateLogoRequest(requestId: string, updates: Partial<LogoRequest>) {
  const { data, error } = await supabase
    .from('logo_requests')
    .update(updates)
    .eq('requestId', requestId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getLogoRequestsByUser(userId: string) {
  const { data, error } = await supabase
    .from('logo_requests')
    .select('*')
    .eq('userId', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Generated Logo Management
export async function saveGeneratedLogos(logos: GeneratedLogo[]) {
  const { data, error } = await supabase
    .from('generated_logos')
    .insert(logos)
    .select();
  
  if (error) throw error;
  return data;
}

export async function getGeneratedLogosByRequest(requestId: string) {
  const { data, error } = await supabase
    .from('generated_logos')
    .select('*')
    .eq('requestId', requestId);
  
  if (error) throw error;
  return data;
}

// User Profile Management
export async function createUserProfile(user: Omit<User, 'userId'> & { userId: string }) {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('userId', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('userId', userId)
    .single();
  
  if (error) throw error;
  return data;
}
