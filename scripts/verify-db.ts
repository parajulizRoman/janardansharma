
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing Supabase credentials in .env.local');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verify() {
    console.log('Verifying Supabase connection...');
    console.log('URL:', supabaseUrl);

    try {
        const { data, error } = await supabase.from('posts').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Error connecting to "posts" table:', error);
            if (error.code === '42P01') {
                console.error('Table "posts" does not exist.');
            }
        } else {
            console.log('Successfully connected to "posts" table.');
            console.log('Current row count:', data);
        }

        // Test insertion (rollback logic not easily possible without transaction support in client lib simply, 
        // so we will just read for now to confirm connection)

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

verify();
