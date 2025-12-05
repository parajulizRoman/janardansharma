'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BioCarouselProps {
    images: string[];
}

export function BioCarousel({ images }: BioCarouselProps) {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!images.length || isPaused) return;

        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % images.length);
        }, 5000); // 5 seconds

        return () => clearInterval(timer);
    }, [images.length, isPaused]);

    const next = () => setCurrent(prev => (prev + 1) % images.length);
    const prev = () => setCurrent(prev => (prev - 1 + images.length) % images.length);

    if (!images || images.length === 0) {
        return (
            <div className="w-full max-w-md aspect-[3/4] bg-white/20 backdrop-blur-sm rounded-lg shadow-xl flex items-center justify-center text-white/50 border border-white/30">
                <span className="text-sm font-medium">No images available</span>
            </div>
        );
    }

    return (
        <div
            className="relative w-full max-w-md aspect-[3/4] group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Images */}
            <div className="w-full h-full relative overflow-hidden rounded-xl shadow-2xl border-4 border-white/20">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <img
                            src={img}
                            alt={`Slide ${idx + 1}`}
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlay for better contrast if needed, maybe not */}
                    </div>
                ))}
            </div>

            {/* Controls */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
