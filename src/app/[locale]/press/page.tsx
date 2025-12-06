
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getSiteSettings } from '@/app/actions';
import { SocialCarousel } from '@/components/about/SocialCarousel'; // reusing component logic? No, need a grid.
import { SocialEmbed } from '@/components/press/SocialEmbeds';
import { ExternalLink, Twitter, Facebook, Instagram, Newspaper } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Press & Media | Janardan Sharma Pravakar',
    description: 'Latest news coverage, social media highlights, and public statements.',
};

export default async function PressPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations('Press');
    const settings = await getSiteSettings();
    const bioData = settings.biography_data || [];

    // Aggregation Logic
    const socialMentions: any[] = [];
    const newsReferences: any[] = [];

    if (Array.isArray(bioData)) {
        bioData.forEach((event: any) => {
            // 1. Extract Social Mentions
            if (event.socialMentions && Array.isArray(event.socialMentions)) {
                event.socialMentions.forEach((mention: any) => {
                    socialMentions.push({
                        ...mention,
                        contextYear: event.year,
                        contextTitle: event.title?.[locale] || event.title?.['en']
                    });
                });
            }

            // 2. Extract News References (Excluding YouTube)
            if (event.references && Array.isArray(event.references)) {
                event.references.forEach((ref: any) => {
                    const url = ref.url || '';
                    const isYoutube = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
                    if (!isYoutube) {
                        newsReferences.push({
                            title: ref.title,
                            url: ref.url,
                            year: event.year,
                            contextTitle: event.title?.[locale] || event.title?.['en']
                        });
                    }
                });
            }
        });
    }

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen">
            {/* Header */}
            <header className="relative bg-gray-100 dark:bg-gray-900 py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>
            </header>

            <div className="container mx-auto max-w-7xl px-4 py-16 space-y-20">

                {/* Social Highlights Section */}
                {socialMentions.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold mb-10 flex items-center gap-3 text-gray-800 dark:text-white border-l-4 border-blue-500 pl-4">
                            <span className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                <Twitter className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </span>
                            {t('socialTitle')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {socialMentions.map((mention, idx) => (
                                <div key={idx} className="flex flex-col gap-2">
                                    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                                        {/* Context Header */}
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                                            <span className="font-medium truncate max-w-[70%]">{mention.contextTitle}</span>
                                            <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                                                {mention.contextYear}
                                            </span>
                                        </div>

                                        {/* Embed Content */}
                                        <div className="p-0">
                                            <SocialEmbed platform={mention.platform} url={mention.url} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* News References Section */}
                {newsReferences.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold mb-10 flex items-center gap-3 text-gray-800 dark:text-white border-l-4 border-red-500 pl-4">
                            <span className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                                <Newspaper className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </span>
                            {t('newsTitle')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {newsReferences.map((news, idx) => (
                                <a
                                    key={idx}
                                    href={news.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-col p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                                            {news.contextYear} • {news.contextTitle}
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
                                        {news.title || news.url}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500 break-all line-clamp-1">
                                        {news.url}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {socialMentions.length === 0 && newsReferences.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        {t('noItems')}
                    </div>
                )}
            </div>
        </div>
    );
}


