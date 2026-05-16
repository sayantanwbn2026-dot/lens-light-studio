
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim().replace(/^"|"$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkId() {
  const { data: about, error: aboutError } = await supabase.from('about_content').select('id').single();
  if (aboutError) {
    console.error('Error fetching about_content:', aboutError);
  } else {
    console.log('About Content ID:', about.id);
  }
}

checkId();
