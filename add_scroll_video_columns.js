// Run this script to add scroll_video columns to hero_content table
// Usage: node add_scroll_video_columns.js <service_role_key>
// 
// Get your service role key from:
// https://supabase.com/dashboard/project/jgikemqmeryuesjgepxb/settings/api
// (It's in the "Service role" section - NOT the anon key)

import https from 'https';

const SUPABASE_URL = 'jgikemqmeryuesjgepxb.supabase.co';
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
    console.error('❌ Please provide your Supabase service role key as an argument.');
    console.error('Usage: node add_scroll_video_columns.js <service_role_key>');
    console.error('\nGet it from: https://supabase.com/dashboard/project/jgikemqmeryuesjgepxb/settings/api');
    process.exit(1);
}

const sql = `
ALTER TABLE hero_content 
ADD COLUMN IF NOT EXISTS scroll_video_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS scroll_video_url text,
ADD COLUMN IF NOT EXISTS scroll_video_thumbnail_url text;
`;

const body = JSON.stringify({ query: sql });

const options = {
    hostname: SUPABASE_URL,
    path: '/rest/v1/rpc/exec_sql',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Length': Buffer.byteLength(body)
    }
};

console.log('🔧 Adding scroll_video columns to hero_content table...');

// Use Management API instead
const mgmtOptions = {
    hostname: 'api.supabase.com',
    path: '/v1/projects/jgikemqmeryuesjgepxb/database/query',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Length': Buffer.byteLength(body)
    }
};

const req = https.request(mgmtOptions, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            const parsed = JSON.parse(data);
            console.log('Response:', JSON.stringify(parsed, null, 2));
            if (res.statusCode === 200) {
                console.log('✅ Columns added successfully!');
            } else {
                console.log('❌ Failed. Try running this SQL directly in Supabase dashboard:');
                console.log(sql);
            }
        } catch (e) {
            console.log('Raw response:', data);
        }
    });
});

req.on('error', (err) => {
    console.error('Request error:', err.message);
});

req.write(body);
req.end();
