import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://arshrkjqptpquqpkfktd.supabase.co'
const supabaseAnonKey = 'sb_publishable_sUMWvOI7owlR03XAizm75g_p87tsnGP'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
