'use client';

import { useState, useEffect } from 'react';
import { updateSiteSetting, getSiteSettings } from '@/app/actions';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, Upload, Image as ImageIcon, Plus, X } from 'lucide-react';

export default function SettingsPage() {
    const [heroImage, setHeroImage] = useState('');
    const [bioGallery, setBioGallery] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Load initial settings
        getSiteSettings().then(settings => {
            if (settings.hero_image) {
                setHeroImage(settings.hero_image);
            }
            if (settings.bio_gallery && Array.isArray(settings.bio_gallery)) {
                setBioGallery(settings.bio_gallery);
            }
        });
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setMessage('');

        const r1 = await updateSiteSetting('hero_image', heroImage);
        const r2 = await updateSiteSetting('bio_gallery', bioGallery);

        setLoading(false);
        if (r1.error || r2.error) {
            setMessage(`Error: ${r1.error || r2.error}`);
        } else {
            setMessage('Settings saved successfully!');
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'bio') => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${type}_${Date.now()}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            if (type === 'hero') {
                setHeroImage(data.publicUrl);
            } else {
                setBioGallery(prev => [...prev, data.publicUrl]);
            }

            setMessage('Image uploaded! Click Save to apply.');
        } catch (error: any) {
            console.error('Upload Error:', error);
            setMessage(`Upload Failed: ${error.message}`);
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Site Settings</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-12">

                {/* Hero Image Section */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-blue-500" />
                        Homepage Hero Image
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Displayed on the right side of the main Hero section.
                    </p>

                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUpload(e, 'hero')}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-blue-500 transition-colors">
                            <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                            <span className="text-sm font-medium">Click to upload new image</span>
                        </div>
                    </div>
                    {uploading && <p className="text-sm text-blue-500 text-center animate-pulse">Uploading...</p>}

                    {heroImage && (
                        <div className="mt-4 relative group w-full max-w-xs mx-auto">
                            <img src={heroImage} alt="Hero Preview" className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg pointer-events-none">
                                <p className="text-white text-xs">Current Hero Image</p>
                            </div>
                        </div>
                    )}
                </section>

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Bio Gallery Section */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-purple-500" />
                        Bio Section Gallery
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Images that scroll automatically in the "Life Dedicated to People" section.
                    </p>

                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUpload(e, 'bio')}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-purple-500 transition-colors">
                            <Plus className="h-8 w-8 text-gray-400 group-hover:text-purple-500" />
                            <span className="text-sm font-medium">Add image to gallery</span>
                        </div>
                    </div>

                    {bioGallery.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {bioGallery.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setBioGallery(prev => prev.filter((_, i) => i !== idx))}
                                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg z-20"
                                        title="Remove"
                                        type="button"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic text-center">No images in gallery yet.</p>
                    )}
                </section>

                {/* Save Button */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 pb-4">
                    {message && (
                        <div className={`mb-4 p-3 rounded-lg text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={loading || uploading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Save Settings
                    </button>
                </div>

            </div>
        </div>
    );
}
