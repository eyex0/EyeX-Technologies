import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

export function createServerSupabase(cookieHeader?: string) {
  const options = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  };

  if (cookieHeader) {
    return createClient<Database>(supabaseUrl, supabaseAnonKey || supabaseServiceKey, {
      ...options,
      global: {
        headers: {
          cookie: cookieHeader,
        },
      },
    });
  }

  if (supabaseServiceKey) {
    return createClient<Database>(supabaseUrl, supabaseServiceKey, options);
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, options);
}
