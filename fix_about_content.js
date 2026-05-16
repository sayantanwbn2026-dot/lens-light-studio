
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim().replace(/^"|"$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function fixContent() {
  console.log('Updating about_content...');
  const { error: aboutError } = await supabase.from('about_content').update({
    manifesto_line1: "We Believe Every Frame",
    manifesto_line2: "Is a Decision.",
    manifesto_line3: "Every Decision, A Story.",
    philosophy_1_body: "We look past the obvious, finding beauty in the shadows and character in the quiet moments that others might miss.",
    philosophy_2_body: "Every element in our frame has a purpose. We don't just capture; we craft images with intention and technical precision.",
    philosophy_3_body: "Our commitment ends only when the final deliverable exceeds expectations, maintaining consistency and quality at every step.",
    studio_image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    founder2_image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", // High quality placeholder
    founder2_name: "Priya",
    founder2_title: "Creative Producer"
  }).neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy condition to update all (likely only one row anyway)

  if (aboutError) console.error('Error updating about_content:', aboutError);

  console.log('Adding team members...');
  const teamMembers = [
    {
      name: "Arjun Mehta",
      role: "Lead Cinematographer",
      photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      order_index: 0,
      is_active: true
    },
    {
      name: "Sara Khan",
      role: "Post-Production Lead",
      photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
      order_index: 1,
      is_active: true
    },
    {
      name: "Vikram Singh",
      role: "Technical Director",
      photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      order_index: 2,
      is_active: true
    }
  ];

  const { error: teamError } = await supabase.from('team_members').upsert(teamMembers);
  if (teamError) console.error('Error adding team members:', teamError);

  console.log('Done.');
}

fixContent();
