import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgikemqmeryuesjgepxb.supabase.co';
const supabaseAnonKey = 'sb_publishable_B2eI2PFYcf8OvBigec2IwQ_hJ_gYIDk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deepAudit() {
    // Try to guess more tables or use RPC if available
    const tables = ['hero_content', 'about_content', 'site_settings', 'services', 'work_projects', 'stats', 'team_members', 'messages', 'footer_settings'];
    console.log('--- DEEP AUDIT START ---');
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*');
        if (error) continue;
        if (!data) continue;
        
        data.forEach(row => {
            const str = JSON.stringify(row).toLowerCase();
            if (str.includes('protonn')) {
                console.log(`[MATCH] Table: ${table}, ID: ${row.id}`);
                console.log(JSON.stringify(row, null, 2));
            }
        });
    }
    console.log('--- DEEP AUDIT END ---');
}

deepAudit();
