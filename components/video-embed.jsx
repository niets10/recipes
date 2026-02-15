'use client';

import { InstagramEmbed, YouTubeEmbed } from 'react-social-media-embed';

/**
 * Detects whether the URL is Instagram or YouTube.
 * @returns 'instagram' | 'youtube' | null
 */
function getVideoProvider(url) {
    if (!url || typeof url !== 'string') return null;
    try {
        const parsed = new URL(url);
        const host = parsed.hostname?.toLowerCase() ?? '';
        if (host.includes('instagram.com')) return 'instagram';
        if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
        return null;
    } catch {
        return null;
    }
}

/**
 * Embeds a video from Instagram or YouTube. The correct embed is chosen from the URL.
 */
export function VideoEmbed({ url, maxWidth = 658, className }) {
    const provider = getVideoProvider(url);
    const width = Math.min(658, Math.max(320, maxWidth));

    if (!url || !provider) {
        return null;
    }

    const wrapperClassName = className;
    const wrapperStyle = { maxWidth: width };

    if (provider === 'instagram') {
        return (
            <div className={wrapperClassName} style={wrapperStyle}>
                <InstagramEmbed url={url} width={width} captioned />
            </div>
        );
    }

    if (provider === 'youtube') {
        return (
            <div className={wrapperClassName} style={wrapperStyle}>
                <YouTubeEmbed url={url} width={width} />
            </div>
        );
    }

    return null;
}
