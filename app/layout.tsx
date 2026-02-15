import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

export const viewport: Viewport = {
    themeColor: '#0a0a0a',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: 'Recipes',
    description: 'A recipe app built with Next.js and Supabase',
    icons: {
        icon: '/icons/utensils-crossed.png',
        apple: '/icons/utensils-crossed.png',
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Recipes',
    },
    formatDetection: {
        telephone: false,
    },
};

const geistSans = Geist({
    variable: '--font-geist-sans',
    display: 'swap',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.className} antialiased overflow-x-hidden`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
