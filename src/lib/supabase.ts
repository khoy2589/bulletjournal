// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // ← ใช้ของคุณ
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // ← ใช้ anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
