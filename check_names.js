
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim().replace(/^"|"$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkData() {
  const { data: about, error } = await supabase.from('about_content').select('*').single();
  if (error) {
    console.error(error);
  } else {
    console.log('Founder 1 Name:', about.founder_name);
    console.log('Founder 2 Name:', about.founder2_name);
    console.log('Manifesto 1:', about.manifesto_line1);
  }
}

checkData();
