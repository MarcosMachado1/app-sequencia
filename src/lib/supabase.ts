import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  apiVersion: '2025-10-29.clover'
});

// Types para o banco de dados
export type Habit = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'custom';
  target_days?: number[];
  created_at: string;
  is_active: boolean;
};

export type HabitLog = {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  note?: string;
};

export type UserProfile = {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  total_streak: number;
  created_at: string;
};