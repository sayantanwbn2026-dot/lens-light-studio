import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgikemqmeryuesjgepxb.supabase.co';
const supabaseAnonKey = 'sb_publishable_B2eI2PFYcf8OvBigec2IwQ_hJ_gYIDk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listAllTables() {
    const { data, error } = await supabase.rpc('get_tables'); // This might not work if RPC doesn't exist
    if (error) {
        console.log('RPC failed, trying information_schema...');
        // Try direct SQL via REST if possible, but usually restricted
        // Let's just try to fetch from a few more likely names
        const likelyTables = ['hero_content', 'about_content', 'site_settings', 'services', 'work_projects', 'stats', 'team_members', 'projects', 'content', 'settings', 'branding'];
        for (const table of likelyTables) {
            const { error: tableError } = await supabase.from(table).select('id').limit(1);
            if (!tableError) console.log(`Table exists: ${table}`);
        }
    } else {
        console.log('Tables:', data);
    }
}

listAllTables();
