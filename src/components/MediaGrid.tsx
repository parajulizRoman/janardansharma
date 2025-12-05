'use client';

import { useState } from 'react';
import { Play, PlayCircle, X } from 'lucide-react';

interface MediaItem {
    id: string;
    title: string | null;
    url: string;
    type: 'image' | 'video';
    created_at: string;
}

export default function MediaGrid({ items }: { items: MediaItem[] }) {
    const [playingId, setPlayingId] = useState<string | null>(null);

    // Extract YouTube ID helper (Robust regex)
    const getYoutubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`group relative bg-white shadow-xl shadow-purple-500/5 rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 ${item.type === 'video' ? 'aspect-video' : 'aspect-[4/5]'
                        }`}
                >
                    {/* VIDEO LOGIC */
                        item.type === 'video' ? (
                            playingId === item.id ? (
                                // Inline Player
                                <div className="w-full h-full relative bg-black">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYoutubeId(item.url)}?autoplay=1&rel=0`}
                                        title={item.title || 'Video'}
                                        className="w-full h-full absolute inset-0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                    <button
                                        onClick={() => setPlayingId(null)}
                                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                // Thumbnail with Play Button
                                <div
                                    onClick={() => setPlayingId(item.id)}
                                    className="w-full h-full relative cursor-pointer"
                                >
                                    <img
                                        src={`https://img.youtube.com/vi/${getYoutubeId(item.url)}/maxresdefault.jpg`}
                                        alt={item.title || 'Video Thumbnail'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback if maxres is unavailable
                                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${getYoutubeId(item.url)}/hqdefault.jpg`;
                                        }}
                                    />

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#03001e]/80 via-transparent to-transparent opacity-60 transition-opacity"></div>

                                    {/* Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative group/play">
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] rounded-full blur-lg opacity-40 group-hover/play:opacity-70 transition-opacity duration-300"></div>
                                            {/* Button */}
                                            <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full bg-white flex items-center justify-center pl-1 shadow-lg transform group-hover/play:scale-110 transition-all duration-300">
                                                <Play className="h-8 w-8 md:h-10 md:w-10 text-[#4a00e0] fill-current" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : (
                            // IMAGE LOGIC
                            <div className="w-full h-full relative">
                                <img
                                    src={item.url}
                                    alt={item.title || 'Gallery Image'}
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Gradient Overlay for Text */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#03001e]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <h3 className="text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        )}
                </div>
            ))}
        </div>
    );
}
