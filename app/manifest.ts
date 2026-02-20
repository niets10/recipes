import type { MetadataRoute } from 'next';

const baseUrl =
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Fitness',
        short_name: 'Fitness',
        description: 'Track workouts, routines, and nutrition',
        start_url: '/',
        display: 'standalone',
        background_color: '#1a1a1c',
        theme_color: '#1a1a1c',
        orientation: 'portrait-primary',
        icons: [
            {
                src: new URL('/icons/fitness-192.png', baseUrl).toString(),
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: new URL('/icons/fitness-512.png', baseUrl).toString(),
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: new URL('/icons/fitness-192.png', baseUrl).toString(),
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: new URL('/icons/fitness-512.png', baseUrl).toString(),
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
