import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Calendar } from 'lucide-react';

export async function LatestNews() {
    if (!supabase) {
        return null;
    }

    const { data: news, error } = await supabase
        .from('posts')
        .select('id, title, slug, excerpt, published_at, type')
        .eq('type', 'news')
        .order('published_at', { ascending: false })
        .limit(3);

    if (error || !news || news.length === 0) {
        return (
            <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Latest Updates</h2>
                    <p className="text-gray-500">No news updates available at the moment.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Latest News</h2>
                        <p className="text-gray-500 max-w-xl">Recent activities, press releases, and announcements.</p>
                    </div>
                    <Link href="/news" className="text-blue-600 hover:text-blue-700 font-medium hidden sm:block">
                        View All News
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <Link key={item.id} href={`/news/${item.slug}`} className="group block h-full">
                            <article className="h-full bg-white dark:bg-gray-950 rounded-lg shadow border border-gray-100 dark:border-gray-800 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
                                <div className="h-48 bg-gray-200 dark:bg-gray-800"></div> {/* Image placeholder */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                        <span className="uppercase tracking-wider font-semibold text-blue-600">{item.type}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(item.published_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                                        {item.excerpt || "Click to read more details about this news item."}
                                    </p>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link href="/news" className="text-blue-600 hover:text-blue-700 font-medium">
                        View All News
                    </Link>
                </div>
            </div>
        </section>
    );
}
