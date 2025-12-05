import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import { Calendar, Share2 } from 'lucide-react';

export const revalidate = 60;

interface NewsDetailProps {
    params: Promise<{ slug: string }>;
}

// Generate Metadata
export async function generateMetadata({ params }: NewsDetailProps): Promise<Metadata> {
    const { slug } = await params;
    if (!supabase) return { title: 'News Not Found' };

    const { data: post } = await supabase
        .from('posts')
        .select('title, excerpt, cover_image')
        .eq('slug', slug)
        .single();

    if (!post) {
        return {
            title: 'News Not Found',
        };
    }

    return {
        title: `${post.title} | Janardan Sharma Pravakar`,
        description: post.excerpt || post.title,
        openGraph: {
            images: post.cover_image ? [post.cover_image] : [],
        },
    };
}

export async function generateStaticParams() {
    if (!supabase) return [];

    const { data: posts } = await supabase
        .from('posts')
        .select('slug')
        .in('type', ['news', 'press', 'statement', 'article']);

    if (!posts) return [];

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function NewsDetailPage({ params }: NewsDetailProps) {
    const { slug } = await params;

    if (!supabase) return notFound();

    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !post) {
        notFound();
    }

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen pb-20">
            {/* Hero / Header Image */}
            {post.cover_image ? (
                <div className="w-full h-64 md:h-96 relative bg-gray-200 dark:bg-gray-800">
                    {/* Replace with Next.js Image component in real implementation if domains configured */}
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 container mx-auto">
                        <span className="inline-block bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                            {post.type}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="h-24 bg-gray-100 dark:bg-gray-900"></div>
            )}

            <div className="container mx-auto px-4 max-w-4xl -mt-8 relative z-10">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
                    <header className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-between gap-4 text-gray-500 dark:text-gray-400 text-sm">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(post.published_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>

                            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                <Share2 className="h-4 w-4" />
                                Share
                            </button>
                        </div>
                    </header>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
