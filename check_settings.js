import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgikemqmeryuesjgepxb.supabase.co';
const supabaseAnonKey = 'sb_publishable_B2eI2PFYcf8OvBigec2IwQ_hJ_gYIDk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSiteSettings() {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) {
        console.error(error);
        return;
    }
    console.log(JSON.stringify(data, null, 2));
}

checkSiteSettings();
