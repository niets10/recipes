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
        background_color: '#ffffff',
        theme_color: '#0a0a0a',
        orientation: 'portrait-primary',
        icons: [
            {
                src: new URL('/icons/utensils-crossed.png', baseUrl).toString(),
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: new URL('/icons/utensils-crossed.png', baseUrl).toString(),
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: new URL('/icons/utensils-crossed.png', baseUrl).toString(),
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: new URL('/icons/utensils-crossed.png', baseUrl).toString(),
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
