import { supabase } from '@/lib/supabase';
import { getSiteSettings } from '@/app/actions';
import { Metadata } from 'next';
import MediaGrid from '@/components/MediaGrid';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Media Gallery | Janardan Sharma Pravakar',
    description: 'Photos and videos from recent programs and interviews.',
};

export const revalidate = 60;

export default async function MediaPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations('Media');
    const { data: mediaItems } = await supabase
        .from('media')
        .select('*')
        .order('sort_order', { ascending: true }) // Preferred sort if column exists, else created_at
        .order('created_at', { ascending: false });

    // Separate items
    // Fetch bio settings for aggregation
    const settings = await getSiteSettings();
    const bioData = settings.biography_data || [];

    // Extract videos from bio data
    const bioVideos: any[] = [];
    if (Array.isArray(bioData)) {
        bioData.forEach((event: any, eventIdx: number) => {
            if (event.references && Array.isArray(event.references)) {
                event.references.forEach((ref: any, refIdx: number) => {
                    const url = ref.url || '';
                    // Check if YouTube URL
                    const isYoutube = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
                    if (isYoutube) {
                        bioVideos.push({
                            id: `bio-ref-${event.id || eventIdx}-${refIdx}`,
                            title: ref.title || `Video from ${event.year}`,
                            title_np: ref.title || '', // Fallback
                            url: url,
                            type: 'video',
                            created_at: new Date().toISOString() // Could use event year but ISO string is safer for sorting
                        });
                    }
                });
            }
        });
    }

    // Merge and Deduplicate Videos
    const dbVideos = mediaItems?.filter(item => item.type === 'video') || [];

    // Create a map of existing URLs to avoid duplicates
    const existingUrls = new Set(dbVideos.map(v => v.url));

    // Only add bio videos if URL doesn't exist in DB videos
    const uniqueBioVideos = bioVideos.filter(v => !existingUrls.has(v.url));

    const videos = [...uniqueBioVideos, ...dbVideos];
    const photos = mediaItems?.filter(item => item.type === 'image') || [];

    return (
        // Transparent to show global body gradient
        <div className="relative overflow-hidden">

            <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28">
                <header className="mb-16 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-white drop-shadow-md">
                        {t('title')}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                    <div className="w-24 h-1.5 mx-auto mt-8 rounded-full bg-white/30"></div>
                </header>

                {!mediaItems || mediaItems.length === 0 ? (
                    <div className="text-center py-20 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                        <p className="text-white text-lg">{t('noItems')}</p>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {/* Video Gallery */}
                        {videos.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-red-500 pl-4">
                                    {t('videosTitle')}
                                </h2>
                                <MediaGrid items={videos} locale={locale} />
                            </section>
                        )}

                        {/* Photo Gallery */}
                        {photos.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-yellow-400 pl-4">
                                    {t('photosTitle')}
                                </h2>
                                <MediaGrid items={photos} locale={locale} />
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
