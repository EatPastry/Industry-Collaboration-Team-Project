import { createClient, SupabaseClient} from '@supabase/supabase-js';

// Load Supabase URL and API Key from environment variables
const SUPABASE_URL = "https://bplqbfrbhimqbsvqyrhw.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwbHFiZnJiaGltcWJzdnF5cmh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjA2NjYsImV4cCI6MjA0ODE5NjY2Nn0.xH5sdfWFLo5WOVqtr-uhXQ1s-hS6DLtVRLnLLa5u6Ik"

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase };
