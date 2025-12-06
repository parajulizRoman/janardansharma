'use client';

import { useState, useRef, useEffect } from 'react';
import { Tweet } from 'react-tweet';
import { InstagramEmbed, FacebookEmbed, YouTubeEmbed, TikTokEmbed } from 'react-social-media-embed';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type SocialPlatform = 'twitter' | 'instagram' | 'facebook' | 'youtube' | 'tiktok';

export interface SocialMention {
    id: string;
    platform: SocialPlatform;
    url: string;
    authorName?: string;
}

interface SocialCarouselProps {
    mentions: SocialMention[];
}

export function SocialCarousel({ mentions }: SocialCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [mentions]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            setTimeout(checkScroll, 300);
        }
    };

    if (!mentions || mentions.length === 0) return null;

    return (
        <div className="relative group">
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex overflow-x-auto gap-6 pb-8 px-4 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {mentions.map((mention) => (
                    <div
                        key={mention.id}
                        className="flex-none w-[300px] md:w-[350px] snap-center bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        {mention.platform === 'twitter' && (
                            <div className="light">
                                <Tweet id={getTweetId(mention.url)} />
                            </div>
                        )}

                        {mention.platform === 'instagram' && (
                            <div className="flex justify-center p-2">
                                <InstagramEmbed url={mention.url} width={328} />
                            </div>
                        )}

                        {mention.platform === 'facebook' && (
                            <div className="flex justify-center p-2 h-full overflow-hidden">
                                <FacebookEmbed url={mention.url} width={328} />
                            </div>
                        )}

                        {mention.platform === 'youtube' && (
                            <div className="flex justify-center p-2 h-full overflow-hidden aspect-video">
                                <YouTubeEmbed url={mention.url} width={328} height={220} />
                            </div>
                        )}

                        {mention.platform === 'tiktok' && (
                            <div className="flex justify-center p-2 h-full overflow-hidden">
                                <TikTokEmbed url={mention.url} width={328} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all z-20 backdrop-blur-sm"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
            )}

            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all z-20 backdrop-blur-sm"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            )}
        </div>
    );
}

function getTweetId(url: string): string {
    try {
        const parts = url.split('/');
        const statusIndex = parts.indexOf('status');
        if (statusIndex !== -1 && parts[statusIndex + 1]) {
            return parts[statusIndex + 1].split('?')[0];
        }
        return '';
    } catch (_) {
        return '';
    }
}
