
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim().replace(/^"|"$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkAll() {
  const { data: about, error } = await supabase.from('about_content').select('*');
  if (error) {
    console.error(error);
  } else {
    console.log('Count:', about?.length);
    console.log('Rows:', JSON.stringify(about, null, 2));
  }
}

checkAll();
