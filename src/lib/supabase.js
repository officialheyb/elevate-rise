import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dseifdnspiuoxpicbvad.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZWlmZG5zcGl1b3hwaWNidmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NDQ2MDksImV4cCI6MjA5NzIyMDYwOX0.80sJQRsJehL6C6K2ShHloYVfw9xnikPCo6iUSaEGmlc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
