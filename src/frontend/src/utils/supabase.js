import { createClient } from '@supabase/supabase-js';

// Load Supabase URL and API Key from environment variables
const SUPABASE_URL = "https://uruhpptcyvuqovyehgie.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVydWhwcHRjeXZ1cW92eWVoZ2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MTY1OTUsImV4cCI6MjA0OTI5MjU5NX0.jEknBNqVB1IhIAcU3098P_09JpIDhYC068yF_QFL4fk"

// Initialize the Supabase client
const supabase = createClient("https://uruhpptcyvuqovyehgie.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVydWhwcHRjeXZ1cW92eWVoZ2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MTY1OTUsImV4cCI6MjA0OTI5MjU5NX0.jEknBNqVB1IhIAcU3098P_09JpIDhYC068yF_QFL4fk");

export { supabase };
