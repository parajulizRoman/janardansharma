'use client';

import { useState } from 'react';
import { Plus, Trash, Image as ImageIcon, ExternalLink, BookOpen, FileText, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface HeritageItem {
    id: string;
    image: string;
    caption: { en: string; np: string };
}

export interface InspirationItem {
    id: string;
    title: { en: string; np: string };
    type: 'book' | 'pdf' | 'article';
    url?: string;
    coverImage?: string; // Optional cover for books
}

interface HeritageManagerProps {
    heritageItems: HeritageItem[];
    inspirationItems: InspirationItem[];
    setHeritageItems: (items: HeritageItem[]) => void;
    setInspirationItems: (items: InspirationItem[]) => void;
}

export function HeritageManager({
    heritageItems,
    inspirationItems,
    setHeritageItems,
    setInspirationItems
}: HeritageManagerProps) {
    const [uploading, setUploading] = useState(false);

    // --- Heritage Gallery Handlers ---

    const addHeritageItem = () => {
        const newItem: HeritageItem = {
            id: crypto.randomUUID(),
            image: '',
            caption: { en: '', np: '' }
        };
        setHeritageItems([newItem, ...heritageItems]);
    };

    const removeHeritageItem = (id: string) => {
        setHeritageItems(heritageItems.filter(item => item.id !== id));
    };

    const updateHeritageItem = (id: string, updates: Partial<HeritageItem>) => {
        setHeritageItems(heritageItems.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const handleHeritageImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileName = `heritage-${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(fileName);

            updateHeritageItem(id, { image: publicUrl });
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };


    // --- Inspiration Handlers ---

    const addInspirationItem = () => {
        const newItem: InspirationItem = {
            id: crypto.randomUUID(),
            title: { en: '', np: '' },
            type: 'article'
        };
        setInspirationItems([newItem, ...inspirationItems]);
    };

    const removeInspirationItem = (id: string) => {
        setInspirationItems(inspirationItems.filter(item => item.id !== id));
    };

    const updateInspirationItem = (id: string, updates: Partial<InspirationItem>) => {
        setInspirationItems(inspirationItems.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const handleInspirationCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileName = `book-cover-${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(fileName);

            updateInspirationItem(id, { coverImage: publicUrl });
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };


    return (
        <div className="space-y-12">
            {/* HERITAGE GALLERY SECTION */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Image className="h-5 w-5 text-amber-600" />
                            National Heritage Gallery
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Images representing national pride, heritage, and unity.
                        </p>
                    </div>
                    <button
                        onClick={addHeritageItem}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        <Plus className="h-4 w-4" /> Add Image
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {heritageItems.map((item) => (
                        <div key={item.id} className="relative group bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {/* Image Preview / Upload */}
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                                {item.image ? (
                                    <img src={item.image} alt="Heritage" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                                        <span className="text-xs">No Image</span>
                                    </div>
                                )}

                                {/* Overlay for Upload/Remove */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <label className="cursor-pointer p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors backdrop-blur-sm" title="Upload Image">
                                        <Upload className="h-4 w-4" />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleHeritageImageUpload(e, item.id)} disabled={uploading} />
                                    </label>
                                    {item.image && (
                                        <button
                                            onClick={() => updateHeritageItem(item.id, { image: '' })}
                                            className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-colors backdrop-blur-sm"
                                            title="Remove Image"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Caption Inputs */}
                            <div className="p-4 space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">English Caption</label>
                                    <input
                                        type="text"
                                        value={item.caption.en}
                                        onChange={(e) => updateHeritageItem(item.id, { caption: { ...item.caption, en: e.target.value } })}
                                        className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. Swayambhunath Stupa..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nepali Caption</label>
                                    <input
                                        type="text"
                                        value={item.caption.np}
                                        onChange={(e) => updateHeritageItem(item.id, { caption: { ...item.caption, np: e.target.value } })}
                                        className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="उदाहरण: स्वयम्भूनाथ स्तूप..."
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => removeHeritageItem(item.id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                title="Delete Item"
                            >
                                <Trash className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    {heritageItems.length === 0 && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                            <ImageIcon className="h-10 w-10 mb-3 opacity-30" />
                            <p className="text-sm">No heritage images added yet.</p>
                            <button onClick={addHeritageItem} className="mt-4 text-blue-600 hover:underline text-sm font-medium">Add your first item</button>
                        </div>
                    )}
                </div>
            </div>

            {/* INSPIRATIONS SECTION */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            Inspirations & References
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Books, articles, and documents that have influenced the journey.
                        </p>
                    </div>
                    <button
                        onClick={addInspirationItem}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        <Plus className="h-4 w-4" /> Add Reference
                    </button>
                </div>

                <div className="space-y-4">
                    {inspirationItems.map((item) => (
                        <div key={item.id} className="flex flex-col md:flex-row gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 relative group animate-in slide-in-from-top-1">

                            {/* Icon / Cover */}
                            <div className="w-16 h-20 md:w-20 md:h-24 flex-shrink-0 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-300 dark:border-gray-600 relative group/cover">
                                {item.coverImage ? (
                                    <img src={item.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-400 flex flex-col items-center">
                                        {item.type === 'book' ? <BookOpen className="h-6 w-6" /> : item.type === 'pdf' ? <FileText className="h-6 w-6" /> : <ExternalLink className="h-6 w-6" />}
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/cover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                    <Upload className="h-4 w-4 text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleInspirationCoverUpload(e, item.id)} disabled={uploading} />
                                </label>
                            </div>

                            {/* Details */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title (English)</label>
                                        <input
                                            type="text"
                                            value={item.title.en}
                                            onChange={(e) => updateInspirationItem(item.id, { title: { ...item.title, en: e.target.value } })}
                                            className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                            placeholder="Title..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title (Nepali)</label>
                                        <input
                                            type="text"
                                            value={item.title.np}
                                            onChange={(e) => updateInspirationItem(item.id, { title: { ...item.title, np: e.target.value } })}
                                            className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                            placeholder="शीर्षक..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type</label>
                                            <select
                                                value={item.type}
                                                onChange={(e) => updateInspirationItem(item.id, { type: e.target.value as any })}
                                                className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                            >
                                                <option value="book">Book</option>
                                                <option value="pdf">Document (PDF)</option>
                                                <option value="article">Article/Link</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">URL / Link</label>
                                        <input
                                            type="url"
                                            value={item.url || ''}
                                            onChange={(e) => updateInspirationItem(item.id, { url: e.target.value })}
                                            className="w-full px-3 py-1.5 text-sm border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => removeInspirationItem(item.id)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                            >
                                <Trash className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    {inspirationItems.length === 0 && (
                        <div className="py-8 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                            <BookOpen className="h-8 w-8 mb-2 opacity-30" />
                            <p className="text-sm">No inspirations added yet.</p>
                            <button onClick={addInspirationItem} className="mt-2 text-blue-600 hover:underline text-sm font-medium">Add a book or article</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Image({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    )
}
