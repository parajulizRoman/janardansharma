'use client';

import { useState, useEffect } from 'react';
import { updateSiteSetting, getSiteSettings, syncBioGalleryToMedia } from '@/app/actions';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, Upload, Image as ImageIcon, Plus, X, RefreshCcw, LayoutTemplate, GalleryHorizontal } from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'home' | 'gallery'>('home');

    const [heroImage, setHeroImage] = useState('');
    const [bioGallery, setBioGallery] = useState<string[]>([]);
    const [energyImages, setEnergyImages] = useState<string[]>([]);
    const [heritageSettings, setHeritageSettings] = useState({
        flag_image: '',
        map_image: '',
        pns_image: '',
        divya_upadesh_pdf: '',
        video_url: ''
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        getSiteSettings().then(settings => {
            if (settings) {
                if (settings.hero_image) setHeroImage(settings.hero_image);
                if (settings.bio_gallery && Array.isArray(settings.bio_gallery)) setBioGallery(settings.bio_gallery);
                if (settings.energy_ministry_images && Array.isArray(settings.energy_ministry_images)) setEnergyImages(settings.energy_ministry_images);
                if (settings.heritage_settings) setHeritageSettings(settings.heritage_settings);
            }
        });
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setMessage('');

        const r1 = await updateSiteSetting('hero_image', heroImage);
        const r2 = await updateSiteSetting('bio_gallery', bioGallery);
        const r3 = await updateSiteSetting('energy_ministry_images', energyImages);
        const r4 = await updateSiteSetting('heritage_settings', heritageSettings);

        setLoading(false);
        if (r1.error || r2.error || r3.error || r4.error) {
            setMessage(`Error saving settings. Please try again.`);
        } else {
            setMessage('Settings saved successfully!');
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'bio' | 'energy' | 'heritage_flag' | 'heritage_map' | 'heritage_pns' | 'heritage_pdf') => {
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
            } else if (type === 'bio') {
                setBioGallery(prev => [...prev, data.publicUrl]);
                // Auto-sync logic kept as per previous implementation
                const { error: syncError } = await supabase
                    .from('media')
                    .insert([{
                        title: 'Bio Gallery Upload',
                        url: data.publicUrl,
                        type: 'image',
                        created_at: new Date().toISOString()
                    }]);
                if (syncError) console.error('Error syncing to media gallery:', syncError);
            } else if (type === 'energy') {
                setEnergyImages(prev => [...prev, data.publicUrl]);
            } else if (type === 'heritage_flag') {
                setHeritageSettings(prev => ({ ...prev, flag_image: data.publicUrl }));
            } else if (type === 'heritage_map') {
                setHeritageSettings(prev => ({ ...prev, map_image: data.publicUrl }));
            } else if (type === 'heritage_pns') {
                setHeritageSettings(prev => ({ ...prev, pns_image: data.publicUrl }));
            } else if (type === 'heritage_pdf') {
                setHeritageSettings(prev => ({ ...prev, divya_upadesh_pdf: data.publicUrl }));
            }

            setMessage('Image uploaded! Click Save to apply.');
        } catch (error: any) {
            console.error('Upload Error:', error);
            setMessage(`Upload Failed: ${error.message}`);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-3xl font-bold mb-2">Site Settings</h1>
            <p className="text-gray-500 mb-8">Manage global site assets and configurations.</p>

            {/* TAB NAVIGATION */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-8 w-fit">
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'home' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
                >
                    <LayoutTemplate className="h-4 w-4" />
                    Home & Assets
                </button>
                <button
                    onClick={() => setActiveTab('gallery')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'gallery' ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
                >
                    <GalleryHorizontal className="h-4 w-4" />
                    Bio Gallery
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-12">

                {/* HOME & ASSETS TAB */}
                {activeTab === 'home' && (
                    <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Hero Image Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                                <ImageIcon className="h-5 w-5 text-blue-500" />
                                Homepage Hero Image
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Displayed on the right side of the main Hero section.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative group h-48 flex items-center justify-center">
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
                                    {uploading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-blue-600" /></div>}
                                </div>

                                {heroImage && (
                                    <div className="relative group w-full h-48">
                                        <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg pointer-events-none">
                                            <p className="text-white text-xs font-medium">Current Active Image</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Energy Ministry Images (Optional / If needed here) */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                                <ImageIcon className="h-5 w-5 text-yellow-500" />
                                Energy Ministry Achievements
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {energyImages.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <img src={img} alt="Energy" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setEnergyImages(prev => prev.filter((_, i) => i !== idx))}
                                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg aspect-square cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <Plus className="h-6 w-6 text-gray-400" />
                                    <span className="text-xs text-gray-500 mt-1">Add</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'energy')} />
                                </label>
                            </div>
                        </div>
                    </section>
                )}

                {/* BIO GALLERY TAB */}
                {activeTab === 'gallery' && (
                    <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-purple-500" />
                                Bio Section Gallery
                            </h2>
                            <button
                                onClick={async () => {
                                    setLoading(true);
                                    const result = await syncBioGalleryToMedia(bioGallery);
                                    setLoading(false);
                                    if (result.error) {
                                        setMessage(`Error syncing: ${result.error}`);
                                    } else {
                                        setMessage(`Synced ${result.count} items to Media Gallery.`);
                                    }
                                }}
                                className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors"
                                type="button"
                                disabled={loading}
                            >
                                <RefreshCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                                Sync to Media Gallery
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Images that scroll automatically in the "Life Dedicated to People" section.
                        </p>

                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative group mb-8">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleUpload(e, 'bio')}
                                disabled={uploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center gap-3 text-gray-500 group-hover:text-purple-500 transition-colors">
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                                    <Plus className="h-8 w-8 text-purple-500" />
                                </div>
                                <span className="text-base font-medium">Add new image to gallery</span>
                            </div>
                        </div>

                        {bioGallery.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {bioGallery.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity px-2">
                                            <button
                                                onClick={() => setBioGallery(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                                                title="Remove"
                                                type="button"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl flex flex-col items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-800">
                                <ImageIcon className="h-12 w-12 mb-3 opacity-20" />
                                <p className="text-sm">No images in gallery yet.</p>
                            </div>
                        )}
                    </section>
                )}

                {/* Save Button */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 pb-0">
                    {message && (
                        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${message.startsWith('Error') || message.includes('Failed') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                            {message.startsWith('Error') ? <X className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                            {message}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={loading || uploading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Save Settings
                    </button>
                </div>

            </div>
        </div>
    );
}
