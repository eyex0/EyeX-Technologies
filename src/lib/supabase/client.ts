import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Default to dummy values if env vars are missing to prevent crash during development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
