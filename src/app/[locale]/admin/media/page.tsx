'use client';

import { useState, useEffect } from 'react';
import { uploadMediaItem, getSiteSettings, updateSiteSetting } from '@/app/actions';
import { Loader2, Plus, Image as ImageIcon, Video, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MediaItem {
    id: number;
    title: string;
    url: string;
    type: 'image' | 'video';
    created_at: string;
}

export default function MediaManagerPage() {
    const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    // List View State
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [bioGallery, setBioGallery] = useState<string[]>([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setFetching(true);
        // Fetch Media
        const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
        if (data) setMediaItems(data);

        // Fetch Settings (Bio Gallery)
        const settings = await getSiteSettings();
        if (settings.bio_gallery && Array.isArray(settings.bio_gallery)) {
            setBioGallery(settings.bio_gallery);
        }
        setFetching(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const result = await uploadMediaItem({
            title,
            url,
            type: activeTab
        });

        setLoading(false);

        if (result.error) {
            setMessage(`Error: ${result.error}`);
        } else {
            setMessage('Media added successfully!');
            setTitle('');
            setUrl('');
            fetchData(); // Refresh list
        }
    }

    async function handleToggleBio(itemUrl: string, checked: boolean) {
        let newGallery = [...bioGallery];
        if (checked) {
            if (!newGallery.includes(itemUrl)) newGallery.push(itemUrl);
        } else {
            newGallery = newGallery.filter(u => u !== itemUrl);
        }

        setBioGallery(newGallery); // Optimistic update
        await updateSiteSetting('bio_gallery', newGallery);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12">

            {/* ADD MEDIA FORM */}
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">Media Manager</h1>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('image')}
                            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'image' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Add Image
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('video')}
                            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'video' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Video className="h-5 w-5" />
                                Add Video
                            </div>
                        </button>
                    </div>

                    <div className="p-8">
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Title / Caption</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={activeTab === 'image' ? "Rally in Kathmandu" : "Interview with BBC"}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {activeTab === 'image' && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Upload Image</label>
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                try {
                                                    setUploading(true);
                                                    const fileExt = file.name.split('.').pop();
                                                    const fileName = `${Date.now()}.${fileExt}`;
                                                    const filePath = `uploads/${fileName}`;
                                                    const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
                                                    if (uploadError) throw uploadError;
                                                    const { data } = supabase.storage.from('media').getPublicUrl(filePath);
                                                    setUrl(data.publicUrl);
                                                    setMessage('Image uploaded successfully! Submit to save.');
                                                } catch (error: any) {
                                                    console.error('Upload Error:', error);
                                                    setMessage(`Upload Failed: ${error.message}`);
                                                } finally {
                                                    setUploading(false);
                                                }
                                            }}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                        />
                                        {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">
                                    {activeTab === 'image' ? 'Image URL (Auto-filled or External)' : 'Video URL (YouTube/Facebook)'}
                                </label>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                    placeholder="https://..."
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                                Add to Gallery
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* LIST ALL MEDIA */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold mb-6">Existing Media Items</h2>
                {fetching ? (
                    <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" /></div>
                ) : mediaItems.length === 0 ? (
                    <p className="text-center text-gray-500">No media items found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mediaItems.map((item) => {
                            const isFeatured = bioGallery.includes(item.url);
                            return (
                                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                                    <div className="aspect-video bg-gray-100 relative">
                                        {item.type === 'image' ? (
                                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <Video className="h-10 w-10" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{item.title}</h3>
                                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isFeatured ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-gray-600'}`}>
                                                    {isFeatured && <Star className="h-3 w-3 text-white fill-current" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={isFeatured}
                                                    onChange={(e) => handleToggleBio(item.url, e.target.checked)}
                                                />
                                                <span className={`text-sm font-medium ${isFeatured ? 'text-purple-600' : 'text-gray-500'}`}>
                                                    {isFeatured ? 'On Bio Carousel' : 'Add to Bio Carousel'}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
