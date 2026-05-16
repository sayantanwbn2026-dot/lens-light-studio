import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkTables() {
    const tables = ['hero_content', 'about_content', 'site_settings', 'services', 'work_projects', 'stats', 'team_members'];
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*');
        if (error) {
            console.error(`Error fetching ${table}:`, error);
            continue;
        }
        const json = JSON.stringify(data);
        if (json.toLowerCase().includes('protonn')) {
            console.log(`Found "ProtoNN" in table: ${table}`);
            console.log(JSON.stringify(data, null, 2));
        }
    }
}

checkTables();
