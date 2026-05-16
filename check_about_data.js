
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Manually parse .env
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim().replace(/^"|"$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkAboutContent() {
  const { data: about, error: aboutError } = await supabase.from('about_content').select('*').single();
  if (aboutError) {
    console.error('Error fetching about_content:', aboutError);
  } else {
    console.log('--- About Content ---');
    console.log(JSON.stringify(about, null, 2));
  }

  const { data: team, error: teamError } = await supabase.from('team_members').select('*').order('order_index');
  if (teamError) {
    console.error('Error fetching team_members:', teamError);
  } else {
    console.log('\n--- Team Members ---');
    console.log('Count:', team?.length);
    console.log(JSON.stringify(team, null, 2));
  }

  const { data: stats, error: statsError } = await supabase.from('stats').select('*').order('order_index');
  if (statsError) {
    console.error('Error fetching stats:', statsError);
  } else {
    console.log('\n--- Stats ---');
    console.log('Count:', stats?.length);
    console.log(JSON.stringify(stats, null, 2));
  }
}

checkAboutContent();
