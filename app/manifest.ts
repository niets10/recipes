import type { MetadataRoute } from 'next';

const baseUrl =
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Recipes',
        short_name: 'Recipes',
        description: 'A recipe app built with Next.js and Supabase',
        start_url: '/',
        display: 'standalone',
        background_color: '#1a1a1c',
        theme_color: '#1a1a1c',
        orientation: 'portrait-primary',
        // Use 192×192 and 512×512 PNGs for sharp display. Export your logo at these exact sizes.
        icons: [
            {
                src: new URL('/icons/utensils-crossed-192.png', baseUrl).toString(),
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: new URL('/icons/utensils-crossed-512.png', baseUrl).toString(),
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: new URL('/icons/utensils-crossed-192.png', baseUrl).toString(),
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: new URL('/icons/utensils-crossed-512.png', baseUrl).toString(),
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
