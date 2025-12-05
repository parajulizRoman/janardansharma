'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from '@/components/admin/TiptapEditor';
import { createPost } from '@/app/actions';
import { Loader2, Save } from 'lucide-react';

export default function NewPostPage() {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('news');
    const [coverImage, setCoverImage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Auto-generate slug from title
    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setTitle(val);
        setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const result = await createPost({
            title,
            slug,
            excerpt,
            content,
            type,
            cover_image: coverImage || undefined,
        });

        setLoading(false);

        if (result.error) {
            console.error('Submission error:', result.error);
            alert(`Error: ${result.error}`);
        } else {
            alert('Post created successfully!');
            router.push('/admin/posts'); // We will create this page next
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Write New Post</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Slug (URL)</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="news">News</option>
                        <option value="press">Press Release</option>
                        <option value="statement">Statement</option>
                        <option value="article">Article</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">Excerpt (Short Description)</label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">Cover Image URL</label>
                    <input
                        type="text"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">Content</label>
                    <TiptapEditor content={content} onChange={setContent} />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Publish Post
                    </button>
                </div>
            </form>
        </div>
    );
}
