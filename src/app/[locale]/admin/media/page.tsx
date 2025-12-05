'use client';

import { useState } from 'react';
import { uploadMediaItem } from '@/app/actions';
import { Loader2, Plus, Image as ImageIcon, Video } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function MediaManagerPage() {
    const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    // Note: For now, we are using external URLs for images too or manual Supabase Storage upload via Dashboard
    // To implement real file upload, we'd need to handle client-side Supabase Storage upload or Server Action buffer upload
    // As per plan, we'll start with URL input which covers Videos perfectly and Images if hosted elsewhere/manually uploaded.

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
        }
    }

    return (
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
                                                // 1. Generate path
                                                const fileExt = file.name.split('.').pop();
                                                const fileName = `${Date.now()}.${fileExt}`;
                                                const filePath = `uploads/${fileName}`;

                                                // 2. Upload
                                                const { error: uploadError } = await supabase.storage
                                                    .from('media') // Ensure 'media' bucket exists
                                                    .upload(filePath, file);

                                                if (uploadError) throw uploadError;

                                                // 3. Get URL
                                                const { data } = supabase.storage
                                                    .from('media')
                                                    .getPublicUrl(filePath);

                                                setUrl(data.publicUrl);
                                                setMessage('Image uploaded successfully! Submit to save.');
                                            } catch (error: any) {
                                                console.error('Upload Error:', error);
                                                setMessage(`Upload Failed: ${error.message}`);
                                            } finally {
                                                setUploading(false);
                                            }
                                        }}
                                        className="block w-full text-sm text-gray-500
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-full file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-blue-50 file:text-blue-700
                                          hover:file:bg-blue-100
                                          cursor-pointer"
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
                            <p className="text-xs text-gray-500">
                                {activeTab === 'image'
                                    ? "This URL will be automatically filled if you upload above, or paste an external link."
                                    : "Supported: YouTube, Facebook, or direct video file links."}
                            </p>
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
    );
}
