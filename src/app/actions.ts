'use server';

import { createClient } from '@supabase/supabase-js';

// Initialize Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
});

interface CreatePostData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    type: string;
    cover_image?: string;
}

export async function createPost(data: CreatePostData) {
    // Validate data (basic)
    if (!data.title || !data.slug || !data.content) {
        return { error: 'Missing required fields' };
    }

    // Check if slug exists
    const { data: existing } = await supabaseAdmin
        .from('posts')
        .select('id')
        .eq('slug', data.slug)
        .single();

    if (existing) {
        return { error: 'Slug already exists' };
    }

    try {
        const { data: newPost, error } = await supabaseAdmin
            .from('posts')
            .insert([data])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data: newPost };
    } catch (err: any) {
        console.error('Create Post Error - Full Details:', JSON.stringify(err, null, 2));
        return { error: err.message || 'An unexpected error occurred' };
    }
}

export async function uploadMediaItem(data: { title: string, title_np?: string, url: string, type: 'image' | 'video' }) {
    if (!data.url) return { error: 'Missing URL' };

    // Auto-translate (Mock: duplicate if missing)
    if (!data.title_np) {
        data.title_np = data.title;
    }

    try {
        const { data: newItem, error } = await supabaseAdmin
            .from('media')
            .insert([data])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data: newItem };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function updateSiteSetting(key: string, value: any) {
    try {
        const { error } = await supabaseAdmin
            .from('site_settings')
            .upsert({ key, value })
            .select()
            .single();

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function getSiteSettings() {
    try {
        const { data, error } = await supabaseAdmin
            .from('site_settings')
            .select('*');

        if (error) throw error;

        // Convert to object for easier access { key: value }
        const settings: Record<string, any> = {};
        data?.forEach((item: any) => {
            settings[item.key] = item.value;
        });

        return settings;
    } catch (err: any) {
        console.error('Fetch Settings Error:', err);
        return {};
    }
}

export async function syncBioGalleryToMedia(urls: string[]) {
    let count = 0;
    try {
        for (const url of urls) {
            // Check if exists
            const { data: existing } = await supabaseAdmin
                .from('media')
                .select('id')
                .eq('url', url)
                .single();

            if (!existing) {
                // Insert
                await supabaseAdmin.from('media').insert([{
                    title: 'Bio Gallery Import',
                    title_np: 'Bio Gallery Import', // Placeholder for auto-translate
                    url: url,
                    type: 'image',
                    created_at: new Date().toISOString()
                }]);
                count++;
            }
        }
        return { success: true, count };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function updateMediaItem(id: number, data: any) {
    try {
        const { error } = await supabaseAdmin
            .from('media')
            .update(data)
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}
