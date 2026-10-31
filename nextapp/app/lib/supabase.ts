import { createClient } from '@supabase/supabase-js';

// Fallback to valid URL structure if env variables are not yet configured in Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key-kosanku';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (typeof window !== 'undefined') {
    console.info(
      '💡 KosanKu: Berjalan dengan data lokal/Zustand persist. ' +
      'Tambahkan NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY untuk sinkronisasi cloud database Supabase.'
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
