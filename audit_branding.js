import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgikemqmeryuesjgepxb.supabase.co';
const supabaseAnonKey = 'sb_publishable_B2eI2PFYcf8OvBigec2IwQ_hJ_gYIDk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
    const tables = ['hero_content', 'about_content', 'site_settings', 'services', 'work_projects', 'stats', 'team_members'];
    console.log('--- STARTING BRANDING AUDIT ---');
    for (const table of tables) {
        console.log(`Checking table: ${table}...`);
        const { data, error } = await supabase.from(table).select('*');
        if (error) {
            console.error(`Error fetching ${table}:`, error.message);
            continue;
        }
        if (!data || data.length === 0) continue;

        const json = JSON.stringify(data);
        if (json.toLowerCase().includes('protonn')) {
            console.log(`[FOUND] "ProtoNN" in table: ${table}`);
            // Find which rows/columns have it
            data.forEach(row => {
                const rowStr = JSON.stringify(row);
                if (rowStr.toLowerCase().includes('protonn')) {
                    console.log(`Row ID: ${row.id}`);
                    for (const key in row) {
                        if (String(row[key]).toLowerCase().includes('protonn')) {
                            console.log(`  Column "${key}": "${row[key]}"`);
                        }
                    }
                }
            });
        }
    }
    console.log('--- AUDIT COMPLETE ---');
}

checkTables();
