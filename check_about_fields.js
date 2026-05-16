
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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
    // Specifically log philosophy fields
    console.log('--- Philosophy Fields ---');
    for (let i = 1; i <= 3; i++) {
      console.log(`Philosophy ${i} Title:`, about[`philosophy_${i}_title`]);
      console.log(`Philosophy ${i} Body:`, about[`philosophy_${i}_body`]);
    }
    console.log('Studio Image URL:', about.studio_image_url);
    console.log('Manifesto Lines:', about.manifesto_line1, about.manifesto_line2, about.manifesto_line3);
  }
}

checkAboutContent();
