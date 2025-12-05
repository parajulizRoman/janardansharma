
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use Service Role Key for seeding to bypass RLS policies if needed, 
// OR use Anon key if policies allow insert (which they don't for public usually).
// For this test, we'll try with ANON key and rely on the policy "Public posts are viewable..." getting updated?
// Wait, my SQL schema only allowed SELECT for public. 
// I need the SERVICE ROLE KEY to insert data if I'm not logged in as admin.
// But I don't have the SERVICE_ROLE_KEY valid here? 
// The user provided: SUPABASE_SERVICE_ROLE_KEY in the prompt.
// I will check if it is in .env.local.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Role Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    console.log('Starting seed...');

    // 1. Insert Sample News
    const newsData = [
        {
            title: 'Welcome to the New Official Website',
            slug: 'welcome-official-website',
            content: 'We are delighted to launch the new official website of Janardan Sharma Pravakar. This platform will serve as a hub for updates, vision documents, and direct communication with the citizens. Stay tuned for more updates.',
            excerpt: 'Announcing the launch of the new digital platform for transparency and connectivity.',
            type: 'news',
            published_at: new Date().toISOString(),
        },
        {
            title: 'Address to the Youth regarding Economic Prosperity',
            slug: 'address-youth-economic-prosperity',
            content: 'In a recent gathering, Janardan Sharma emphasized the critical role of youth in driving the nation towards economic self-sufficiency...',
            excerpt: 'Highlights from the recent address to student unions.',
            type: 'statement',
            published_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        }
    ];

    const { data: posts, error: postError } = await supabase
        .from('posts')
        .upsert(newsData, { onConflict: 'slug' })
        .select();

    if (postError) {
        console.error('Error seeding posts:', postError);
    } else {
        console.log(`Seeded ${posts.length} posts.`);
    }

    // 2. Insert Sample Event
    const eventData = [
        {
            title: 'Town Hall Meeting: Rukum West',
            description: 'Open interaction with the constituents of Rukum West regarding local development projects.',
            location: 'Musikot, Rukum West',
            start_time: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
            type: 'meeting'
        }
    ];

    const { data: events, error: eventError } = await supabase
        .from('events')
        .upsert(eventData, { onConflict: 'id' }) // ID won't match so it will insert. Upsert on ID requires ID. 
        // Actually upsert without ID will insert if no conflict.
        // Let's just use insert for events to avoid complexity or strictly insert.
        .select();

    // Better to just insert if table empty or just push one.
    // We will just insert and ignore error if it fails (unlikely for new DB).
    // Actually, without ID it will generate one.

    if (postError) {
        // already logged
    } else {
        const { data: events, error: eventError } = await supabase.from('events').insert(eventData).select();
        if (eventError) {
            console.error('Error seeding events:', eventError);
        } else {
            console.log(`Seeded ${events.length} events.`);
        }
    }

    // 3. Insert Sample Policy
    const policyData = [
        {
            title: 'Energy Security & Independence',
            content: 'Full utilization of hydropower potential to ensure Nepal becomes an energy-independent nation and a net exporter of clean energy...',
            order: 1
        }
    ];

    const { data: policies, error: policyError } = await supabase.from('policies').insert(policyData).select();
    if (policyError) {
        console.error('Error seeding policies:', policyError);
    } else {
        console.log(`Seeded ${policies.length} policies.`);
    }

    console.log('Seed completed.');
}

seed();
