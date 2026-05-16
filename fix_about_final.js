
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim().replace(/^"|"$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const ID = '4f7e7697-bb74-4cb5-86ff-c981d44db752';

async function fixAboutContent() {
  console.log('Updating about_content with ID:', ID);
  const { error } = await supabase.from('about_content').update({
    manifesto_line1: "We Believe Every Frame",
    manifesto_line2: "Is a Decision.",
    manifesto_line3: "Every Decision, A Story.",
    philosophy_1_body: "We look past the obvious, finding beauty in the shadows and character in the quiet moments that others might miss.",
    philosophy_2_body: "Every element in our frame has a purpose. We don't just capture; we craft images with intention and technical precision.",
    philosophy_3_body: "Our commitment ends only when the final deliverable exceeds expectations, maintaining consistency and quality at every step.",
    studio_image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    founder2_image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    founder2_name: "Priya",
    founder2_title: "Creative Producer"
  }).eq('id', ID);

  if (error) {
    console.error('Error updating about_content:', error);
  } else {
    console.log('Update successful.');
  }
}

fixAboutContent();
