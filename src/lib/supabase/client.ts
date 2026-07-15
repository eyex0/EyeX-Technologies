import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Use the environment variable names defined in .env
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
