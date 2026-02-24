import { LoadingLogo } from '@/components/ui/loading-logo';

export default function Loading() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-4">
            <LoadingLogo className="text-muted-foreground" size={48} />
            <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
    );
}
