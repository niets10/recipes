'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

type InstagramEmbedProps = {
    /** Instagram post URL (e.g. https://www.instagram.com/reel/xxx/ or https://www.instagram.com/p/xxx/) */
    url: string;
    /** Optional max width in pixels (320–658). Default 658. */
    maxWidth?: number;
    /** Optional class name for the wrapper */
    className?: string;
};

/**
 * Embeds an Instagram post (photo, video, or Reel) using Instagram's official embed.
 * Pass the post URL from Instagram (⋯ → Embed).
 */
export function InstagramEmbed({ url, maxWidth = 658, className }: InstagramEmbedProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        if (!scriptLoaded || !containerRef.current || typeof window === 'undefined') return;
        // Re-run Instagram's embed parser when script loads or URL changes
        (
            window as Window & { instgrm?: { Embeds: { process: () => void } } }
        ).instgrm?.Embeds?.process();
    }, [url, scriptLoaded]);

    const width = Math.min(658, Math.max(320, maxWidth));

    return (
        <div ref={containerRef} className={className} style={{ maxWidth: width }}>
            <blockquote
                className="instagram-media"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{
                    width: '100%',
                    minWidth: 320,
                    maxWidth: width,
                }}
            >
                <a href={url} target="_blank" rel="noopener noreferrer">
                    View on Instagram
                </a>
            </blockquote>
            <Script
                src="https://www.instagram.com/embed.js"
                strategy="lazyOnload"
                onLoad={() => setScriptLoaded(true)}
            />
        </div>
    );
}
