// Run this script to add video columns to services table
// Usage: node add_service_video_columns.js <service_role_key>
// 
// Get your service role key from:
// https://supabase.com/dashboard/project/jgikemqmeryuesjgepxb/settings/api

import https from 'https';

const SUPABASE_PROJECT_ID = 'jgikemqmeryuesjgepxb';
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
    console.error('❌ Please provide your Supabase service role key as an argument.');
    console.error('Usage: node add_service_video_columns.js <service_role_key>');
    process.exit(1);
}

const sql = `
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS media_type text DEFAULT 'image';
`;

const body = JSON.stringify({ query: sql });

const mgmtOptions = {
    hostname: 'api.supabase.com',
    path: `/v1/projects/${SUPABASE_PROJECT_ID}/database/query`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Length': Buffer.byteLength(body)
    }
};

console.log('🔧 Adding video_url and media_type columns to services table...');

const req = https.request(mgmtOptions, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ Columns added successfully!');
        } else {
            console.log('Status:', res.statusCode);
            console.log('Raw response:', data);
            console.log('❌ Failed. Try running this SQL directly in Supabase SQL Editor:');
            console.log(sql);
        }
    });
});

req.on('error', (err) => {
    console.error('Request error:', err.message);
});

req.write(body);
req.end();
