import Link from 'next/link';
import { Suspense } from 'react';
import { AuthButton } from '@/components/auth-button';
import { routes } from '@/lib/routes';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function AppHeader() {
    return (
        <header className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-6 items-center">
                    <Link
                        href={routes.home}
                        className="font-semibold text-base"
                    >
                        Recipes
                    </Link>
                    <nav className="flex gap-4 items-center">
                        <Link
                            href={routes.home}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href={routes.recipes}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Recipes
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                    <Suspense>
                        <AuthButton />
                    </Suspense>
                </div>
            </div>
        </header>
    );
}
