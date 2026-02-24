import { LoadingLogo } from '@/components/ui/loading-logo';

export function FullScreenLoading() {
    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background"
            aria-live="polite"
            aria-busy="true"
        >
            <LoadingLogo className="text-muted-foreground" size={48} />
            <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
    );
}
