import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eqqqhxrqgnsxomxjwxln.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcXFoeHJxZ25zeG9teGp3eGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NjYyMTcsImV4cCI6MjA1MzI0MjIxN30.Zfo1FvtKvO6aFpfA9k9HEEdJ5RTVsK6Cgc5IPyRvbgs';
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
