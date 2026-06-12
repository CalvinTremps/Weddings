import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://xyzxyzxyz.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Guest = {
  id: string
  name: string
  email: string | null
  code: string
  created_at: string
}

export type RSVP = {
  id: string
  guest_id: string
  attending: boolean
  plus_one_name: string | null
  dietary_restrictions: string | null
  song_request: string | null
  message: string | null
  submitted_at: string
}
