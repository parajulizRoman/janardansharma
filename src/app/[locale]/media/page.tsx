import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import MediaGrid from '@/components/MediaGrid';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Media Gallery | Janardan Sharma Pravakar',
    description: 'Photos and videos from recent programs and interviews.',
};

export const revalidate = 60;

export default async function MediaPage() {
    const t = await getTranslations('Media');
    const { data: mediaItems } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        // Transparent to show global body gradient
        <div className="relative overflow-hidden">

            <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28">
                <header className="mb-20 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-white drop-shadow-md">
                        {t('title')}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>

                    {/* Decorative line - white/30 for subtle contrast */}
                    <div className="w-24 h-1.5 mx-auto mt-8 rounded-full bg-white/30"></div>
                </header>

                {(!mediaItems || mediaItems.length === 0) ? (
                    <div className="text-center py-20 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                        <p className="text-white text-lg">{t('noItems')}</p>
                    </div>
                ) : (
                    <MediaGrid items={mediaItems} />
                )}
            </div>
        </div>
    );
}
