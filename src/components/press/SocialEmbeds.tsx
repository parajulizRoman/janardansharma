'use client';

import { Tweet } from 'react-tweet';
import { InstagramEmbed, FacebookEmbed, YouTubeEmbed, TikTokEmbed } from 'react-social-media-embed';

interface SocialEmbedProps {
    platform: 'twitter' | 'instagram' | 'facebook' | 'youtube' | 'tiktok';
    url: string;
}

export function SocialEmbed({ platform, url }: SocialEmbedProps) {
    if (platform === 'twitter') {
        const tweetId = getTweetId(url);
        if (!tweetId) return null;
        return (
            <div className="light w-full flex justify-center">
                <Tweet id={tweetId} />
            </div>
        );
    }

    if (platform === 'instagram') {
        return (
            <div className="flex justify-center p-2">
                <InstagramEmbed url={url} width={328} />
            </div>
        );
    }

    if (platform === 'facebook') {
        return (
            <div className="flex justify-center p-2 overflow-hidden">
                <FacebookEmbed url={url} width={328} />
            </div>
        );
    }

    if (platform === 'youtube') {
        return (
            <div className="flex justify-center p-2 h-full overflow-hidden aspect-video">
                <YouTubeEmbed url={url} width={328} height={220} />
            </div>
        );
    }

    if (platform === 'tiktok') {
        return (
            <div className="flex justify-center p-2 h-full overflow-hidden">
                <TikTokEmbed url={url} width={328} />
            </div>
        );
    }

    return null;
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
