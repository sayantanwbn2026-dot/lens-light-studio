
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

async function finalFix() {
  console.log('Starting final database fix...');
  
  const payload = {
    founder_name: "Kingshuk",
    founder_title: "Founder & Creative Director",
    founder2_name: "Priya",
    founder2_title: "Creative Producer",
    manifesto_line1: "We Believe Every Frame",
    manifesto_line2: "Is a Decision.",
    manifesto_line3: "Every Decision, A Story.",
    philosophy_1_title: "See Differently",
    philosophy_1_body: "We look past the obvious, finding beauty in the shadows and character in the quiet moments that others might miss.",
    philosophy_2_title: "Compose Deliberately",
    philosophy_2_body: "Every element in our frame has a purpose. We don't just capture; we craft images with intention and technical precision.",
    philosophy_3_title: "Deliver Exceptionally",
    philosophy_3_body: "Our commitment ends only when the final deliverable exceeds expectations, maintaining consistency and quality at every step.",
    studio_image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    founder_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    founder2_image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80"
  };

  const { data, error } = await supabase
    .from('about_content')
    .update(payload)
    .eq('id', ID)
    .select();

  if (error) {
    console.error('Update Error:', error);
  } else {
    console.log('Update Success! Resulting data:');
    console.log(JSON.stringify(data, null, 2));
  }
}

finalFix();
