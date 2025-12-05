import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import { Calendar, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'News & Updates | Janardan Sharma Pravakar',
    description: 'Latest news, press releases, and articles from Janardan Sharma.',
};

export const revalidate = 60;

export default async function NewsPage() {
    const { data: news, error } = await supabase
        .from('posts')
        .select('id, title, slug, excerpt, published_at, type, cover_image')
        .in('type', ['news', 'press', 'statement', 'article'])
        .order('published_at', { ascending: false });

    return (
        <div className="bg-gray-50 dark:bg-gray-950 py-16 px-4 min-h-screen">
            <div className="container mx-auto max-w-6xl">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">News & Updates</h1>
                    <p className="text-gray-600 dark:text-gray-400">Stay informed about the latest activities and announcements.</p>
                </header>

                {(!news || news.length === 0) ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                        <p className="text-gray-500">No news updates available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item) => (
                            <Link key={item.id} href={`/news/${item.slug}`} className="group block h-full">
                                <article className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
                                    <div className="h-48 bg-gray-200 dark:bg-gray-800 relative w-full overflow-hidden">
                                        {/* Placeholder for image - use item.cover_image if available */}
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200 dark:bg-gray-800">
                                            <span className="text-sm">News Image</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-3">
                                            <span className="uppercase tracking-wider font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                                                {item.type}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(item.published_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {item.title}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                                            {item.excerpt}
                                        </p>
                                        <div className="flex items-center text-blue-600 text-sm font-medium mt-auto group-hover:underline">
                                            Read More <ChevronRight className="h-4 w-4 ml-1" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
