import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn("⚠️ VITE_SUPABASE_URL is missing. Please add it to your .env file. The app is falling back to a mock client to prevent crashing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
