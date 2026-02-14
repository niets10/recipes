'use client';

import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { routes } from '@/lib/routes';

export function LogoutButton() {
    const router = useRouter();

    const logout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push(routes.login);
    };

    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logout();
        });
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="hover:cursor-pointer"
            onClick={handleLogout}
            disabled={isPending}
        >
            {isPending ? <Spinner /> : <LogOut />}
        </Button>
    );
}
