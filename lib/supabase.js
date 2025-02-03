import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qpwrmxbxpcbhgbtaphhz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwd3JteGJ4cGNiaGdidGFwaGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5NjI0MjMsImV4cCI6MjA1MzUzODQyM30.R-z1Eb-cCZ0w1CDUg4I-STcfp2IG6J7QrsraMj6vZQE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 