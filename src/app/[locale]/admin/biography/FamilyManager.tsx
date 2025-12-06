'use client';

import { useState } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FamilyManagerProps {
    fatherImage: string;
    setFatherImage: (url: string) => void;
    motherImage: string;
    setMotherImage: (url: string) => void;
    familyExtraImage: string;
    setFamilyExtraImage: (url: string) => void;
    familyExtraImage2: string;
    setFamilyExtraImage2: (url: string) => void;
    familyExtraLabel: string;
    setFamilyExtraLabel: (url: string) => void;
    familyExtraLabel2: string;
    setFamilyExtraLabel2: (url: string) => void;
    familyTributeMessage: string;
    setFamilyTributeMessage: (msg: string) => void;
}

export function FamilyManager({
    fatherImage, setFatherImage,
    motherImage, setMotherImage,
    familyExtraImage, setFamilyExtraImage,
    familyExtraImage2, setFamilyExtraImage2,
    familyExtraLabel, setFamilyExtraLabel,
    familyExtraLabel2, setFamilyExtraLabel2,
    familyTributeMessage, setFamilyTributeMessage
}: FamilyManagerProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'father' | 'mother' | 'family_extra' | 'family_extra_2') => {
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

            if (type === 'father') setFatherImage(data.publicUrl);
            else if (type === 'mother') setMotherImage(data.publicUrl);
            else if (type === 'family_extra') setFamilyExtraImage(data.publicUrl);
            else if (type === 'family_extra_2') setFamilyExtraImage2(data.publicUrl);

        } catch (error: any) {
            console.error('Upload Error:', error);
            alert(`Upload Failed: ${error.message}`);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <ImageIcon className="h-5 w-5 text-green-500" />
                Family & Tribute Images
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Father Upload */}
                <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Father's Image</p>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative group h-48 flex items-center justify-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUpload(e, 'father')}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {fatherImage ? (
                            <div className="relative w-full h-full">
                                <img src={fatherImage} alt="Father" className="w-full h-full object-cover rounded-md" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                                    Click to Replace
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-green-500 transition-colors">
                                <Upload className="h-6 w-6" />
                                <span className="text-xs">Upload Father</span>
                            </div>
                        )}
                        {uploading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin h-5 w-5 text-green-600" /></div>}
                    </div>
                </div>

                {/* Mother Upload */}
                <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Mother's Image</p>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative group h-48 flex items-center justify-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUpload(e, 'mother')}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {motherImage ? (
                            <div className="relative w-full h-full">
                                <img src={motherImage} alt="Mother" className="w-full h-full object-cover rounded-md" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                                    Click to Replace
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-green-500 transition-colors">
                                <Upload className="h-6 w-6" />
                                <span className="text-xs">Upload Mother</span>
                            </div>
                        )}
                        {uploading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin h-5 w-5 text-green-600" /></div>}
                    </div>
                </div>

                {/* Extra Upload 1 */}
                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Tribute Label 1</label>
                        <input
                            type="text"
                            value={familyExtraLabel}
                            onChange={(e) => setFamilyExtraLabel(e.target.value)}
                            placeholder="e.g. Spouse"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent focus:ring-1 focus:ring-green-500"
                        />
                    </div>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative group h-48 flex items-center justify-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUpload(e, 'family_extra')}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {familyExtraImage ? (
                            <div className="relative w-full h-full">
                                <img src={familyExtraImage} alt="Extra" className="w-full h-full object-cover rounded-md" />
                                <button
                                    onClick={(e) => { e.preventDefault(); setFamilyExtraImage(''); }}
                                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full z-20 hover:bg-red-700"
                                    title="Remove"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-green-500 transition-colors">
                                <Upload className="h-6 w-6" />
                                <span className="text-xs">Upload Image</span>
                            </div>
                        )}
                        {uploading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin h-5 w-5 text-green-600" /></div>}
                    </div>
                </div>

                {/* Extra Upload 2 */}
                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Tribute Label 2</label>
                        <input
                            type="text"
                            value={familyExtraLabel2}
                            onChange={(e) => setFamilyExtraLabel2(e.target.value)}
                            placeholder="e.g. Start of the Day"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded bg-transparent focus:ring-1 focus:ring-green-500"
                        />
                    </div>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative group h-48 flex items-center justify-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUpload(e, 'family_extra_2')}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {familyExtraImage2 ? (
                            <div className="relative w-full h-full">
                                <img src={familyExtraImage2} alt="Extra 2" className="w-full h-full object-cover rounded-md" />
                                <button
                                    onClick={(e) => { e.preventDefault(); setFamilyExtraImage2(''); }}
                                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full z-20 hover:bg-red-700"
                                    title="Remove"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-green-500 transition-colors">
                                <Upload className="h-6 w-6" />
                                <span className="text-xs">Upload Image</span>
                            </div>
                        )}
                        {uploading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin h-5 w-5 text-green-600" /></div>}
                    </div>
                </div>

                {/* Tribute Footer Message */}
                <div className="col-span-1 md:col-span-3 space-y-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Footer Tribute Message</p>
                    <textarea
                        placeholder="e.g. A heartfelt tribute to the roots that grounded me."
                        value={familyTributeMessage}
                        onChange={(e) => setFamilyTributeMessage(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    />
                    <p className="text-xs text-gray-500">Displayed in italics below the tribute images.</p>
                </div>
            </div>
        </div>
    );
}
